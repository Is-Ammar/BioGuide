import User from '../models/userModel.js';
import { signupSchema,signinSchema } from '../middlewares/validator.js';
import { doHash,doHashValidation } from '../utils/hashing.js';
import jwt from "jsonwebtoken"



export const signup = async (req, res) => {
  try {
    const {first_name, last_name, email, password, phone_number, country, agreement} = req.body;
    const { error, value } = signupSchema.validate({
        first_name, last_name, email, password, phone_number, country, agreement
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
      phone_number,
      country,
      agreement
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
  const alldata = await User.find();
  res.json(alldata);

}