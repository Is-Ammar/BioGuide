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
        required: true,
        minlength: 6
    },
    phone_number:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    agreement:{
        type:Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("users",userSchema);