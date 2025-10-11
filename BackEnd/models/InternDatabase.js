import mongoose from "mongoose";
import { type } from "os";

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
    },
    gender: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    pinCode: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    educationLevel: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    contactMethod: {
        type: String,
        required: true,
    },
    resumeUrl: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    prevInternship: {
        type: String,
        required: true,
        enums: ['Yes', 'No'],
        default: 'No'
    },
    performance: {
        type: String,
        enums: ['Excellent', 'Good', 'Average'],
        default: 'Average'
    },
    status: {
        type: String,
        enums: ["Selected", "Rejected", "Applied"],
        default: 'Applied'
    },
    uniqueId: {
        type:String,
        unique:true
    },
    comment: {
        type:String
    },
    TpoName : {
        type:String
    },
    TpoEmail : {
        type:String
    },
    TpoNumber : {
        type:String
    },
    joiningDate : {
        type:String
    },
    updatedByHR: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the HR (User collection)
    },
    updatedByIncharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternHead", // reference to the HR (User collection)
    },
    comments: [
  {
    text: {
      type: String,
      required: true,
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternHead", // or "HR" / "Admin" / "Intern" depending on your logic
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
],

}, { timestamps: true });

const Intern = mongoose.model('Intern', internSchema);
export default Intern;
    
    
    

    
   
