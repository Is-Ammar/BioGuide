import User from '../models/userModel.js';
import { signupSchema,signinSchema } from '../middlewares/validator.js';
import { doHash,doHashValidation } from '../utils/hashing.js';
import jwt from "jsonwebtoken"



export const signup = async (req, res) => {
  try {
  const {first_name, last_name, email, password, age, profession} = req.body;
    const { error, value } = signupSchema.validate({
    first_name, last_name, email, password, age, profession
    });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists!' });
    }
    const hashedPassword = await doHash(password, 12);

    //  Create new user
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
      profession
    });
    const result = await newUser.save();
    result.password = undefined; // never return password hash

    return res.status(201).json({
        success: true,
        message: 'Your account has been created successfully',
        result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};






export const signin = async(req,res)=>{
    const{email,password} = req.body;
    try{
        const {error} = signinSchema.validate({email,password});
        if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message});
        }

        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await doHashValidation(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT (optional)
        const token = jwt.sign(
        {
            id: user._id, 
            email: user.email 
        },
        process.env.TOKEN_SECRET,
        { expiresIn: '1d' }
        );
        user.password = undefined;
        return res.status(200).json({success: true,message: 'Login successful', token, user});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}



export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true, message: 'Logged out successfully. Please remove the token on client side.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




export const fetch = async (req,res)=>{
  // Deprecated: kept temporarily if frontend still calls /fetch expecting array
  // Return only the authenticated user for safety
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if(!user){
      return res.status(404).json({ success:false, message:'User not found'});
    }
    return res.json({ success:true, user });
  } catch(err){
    console.error('Fetch user error:', err);
    return res.status(500).json({ success:false, message:'Internal Server Error'});
  }
}

export const me = async (req,res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if(!user){
      return res.status(404).json({ success:false, message:'User not found'});
    }
    return res.status(200).json({ success:true, user });
  } catch(err){
    console.error('Me endpoint error:', err);
    return res.status(500).json({ success:false, message:'Internal Server Error'});
  }
}

export const toggleSavedPublication = async (req, res) => {
  try {
    const { publicationId } = req.body;
    const userId = req.user.id;

    if (!publicationId) {
      return res.status(400).json({ success: false, message: 'Publication ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const savedIndex = user.savedPublications.indexOf(publicationId);
    
    if (savedIndex > -1) {
      user.savedPublications.splice(savedIndex, 1);
    } else {
      user.savedPublications.push(publicationId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: savedIndex > -1 ? 'Removed from saved' : 'Added to saved',
      savedPublications: user.savedPublications,
      favoritePublications: user.favoritePublications
    });
  } catch (err) {
    console.error('Toggle saved error:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
export const toggleFavoritePublication = async (req, res) => {
  try {
    const { publicationId } = req.body;
    const userId = req.user.id;

    if (!publicationId) {
      return res.status(400).json({ success: false, message: 'Publication ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const favoriteIndex = user.favoritePublications.indexOf(publicationId);
    
    if (favoriteIndex > -1) {
      user.favoritePublications.splice(favoriteIndex, 1);
    } else {
      user.favoritePublications.push(publicationId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: favoriteIndex > -1 ? 'Removed from favorites' : 'Added to favorites',
      savedPublications: user.savedPublications,
      favoritePublications: user.favoritePublications
    });
  } catch (err) {
    console.error('Toggle favorite error:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getUserPublications = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('savedPublications favoritePublications');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      savedPublications: user.savedPublications,
      favoritePublications: user.favoritePublications
    });
  } catch (err) {
    console.error('Get user publications error:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
