import mongoose from 'mongoose';

const  userSchema = mongoose.Schema({

    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: function() {
            // Password not required if user signed up with Google
            return !this.googleId;
        },
        minlength: 6
    },
    phone_number:{
        type:String,
        required: false, // Optional for Google OAuth users
    },
    country:{
        type:String,
        required: false, // Optional for Google OAuth users
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values while maintaining uniqueness
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
  
    savedPublications: {
        type: [String],
        default: []
    },
    favoritePublications: {
        type: [String],
        default: []
    }
});

export default mongoose.model("users",userSchema);