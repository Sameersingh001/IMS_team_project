// models/DepartmentHead.js
import mongoose from "mongoose";

const InternHeadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
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
      minlength: 6,
    },
    mobile: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    department: {
      type: String,
      required: true,
      enum: [
      "Sales & Marketing",
      "Email Outreaching",
      "Journalism and Mass communication",
      "Social Media Management",
      "Graphic Design",
      "Digital Marketing",
      "Video Editing",
      "Content Writing",
      "UI/UX Designing",
      "Front-end Developer",
      "Back-end Developer",
      ],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    role: {
      type: String,
      default: "InternHead",
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      match: [/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit pin code"],
    },
    // Active / Inactive status
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const InternHead = mongoose.model("InternHead", InternHeadSchema, "InternHead");
export default InternHead
