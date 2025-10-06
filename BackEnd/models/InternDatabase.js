import mongoose from "mongoose";

const internSchema = new mongoose.Schema({
    fullName: {
        type: String,   
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    pinCode: {
        type: String,
        required: true,
        unique: true
    },
    college: {
        type: String,
        required: true,
        unique: true
    },
    course: {
        type: String,
        required: true,
        unique: true
    },
    educationLevel: {
        type: String,
        required: true,
        unique: true
    },
    domain: {
        type: String,
        required: true,
        unique: true
    },
    contactMethod: {
        type: String,
        required: true,
        unique: true
    },
    resumeUrl: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: String,
        required: true,
        unique: true
    },
    prevInternship: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

const Intern = mongoose.model('Intern', internSchema);
export default Intern;
    
    
    

    
   
