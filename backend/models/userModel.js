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
    age: {
        type: Number,
        min: 10, // basic sane lower bound
        max: 120,
        required: false // keep optional to avoid breaking existing google users
    },
    profession: {
        type: String,
        enum: ['student', 'researcher', 'scientist', 'other'],
        required: false
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