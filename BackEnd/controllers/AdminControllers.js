
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import Intern from "../models/InternDatabase.js"
import InternIncharge from '../models/InternHead.js';
import nodemailer from "nodemailer"
import User from "../models/UserDB.js"
import Setting from "../models/SettingDB.js"
import bcrypt from "bcrypt"



export const getAllInterns = async (req, res) => {
  try {
    const { search = "", status, performance, page = 1, limit = 10 } = req.query;

    // 🔍 Search query (case-insensitive)
    const searchQuery = {
      $or: [
    { fullName: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { domain: { $regex: search, $options: 'i' } },
    { college: { $regex: search, $options: 'i' } },
    { course: { $regex: search, $options: 'i' } },
    { educationLevel: { $regex: search, $options: 'i' } },
    { uniqueId: { $regex: search, $options: 'i' } },
    { mobile: { $regex: search, $options: 'i' } } // Also search in mobile
      ],
      performance: { $nin: ["Average", "Rejected"] }
    };

    if (search.trim() === "") {
      delete searchQuery.$or; // Remove $or if search is empty
    }

    // 🎯 Filter logic
    if (status) searchQuery.status = status;
    if (performance) searchQuery.performance = performance;

    // 🧭 Pagination
    const skip = (page - 1) * limit;

    const interns = await Intern.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Intern.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      interns,
    });
  } catch (error) {
    console.error("Error fetching interns:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};


export const getInternById = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id)
      .populate("updatedByHR", "fullName email role"); // 👈 populate HR info

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.status(200).json(intern);
  } catch (err) {
    console.error("Error fetching intern:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const intern = await Intern.findById(id);
    if (!intern) return res.status(404).json({ message: "Intern not found" });

    // ✅ If intern is selected and joiningDate is not yet generated
    if (status === "Selected" && !intern.joiningDate) {
      const joinDate = new Date();
      intern.joiningDate = joinDate.toISOString(); // store as string
      intern.status = "Active"; // internship starts
    } else if (status) {
      // Update other statuses manually
      intern.status = status;
    }

    await intern.save();
    res.status(200).json({ message: "Status updated successfully", intern });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};


// Update intern performance
export const updatePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { performance } = req.body;

    const intern = await Intern.findByIdAndUpdate(
      id,
      { performance },
      { new: true }
    );

    if (!intern) return res.status(404).json({ message: "Intern not found" });

    res
      .status(200)
      .json({ message: "Performance updated successfully", intern });
  } catch (err) {
    console.error("Error updating performance:", err);
    res.status(500).json({ message: "Failed to update performance" });
  }
};

// Update intern domain
export const updateDomain = async (req, res) => {
  try {
    const { id } = req.params;
    const { domain } = req.body;
    const intern = await Intern.findByIdAndUpdate(
      id,
      { domain },
      { new: true }
    );
    if (!intern) return res.status(404).json({ message: "Intern not found" });

    res.status(200).json({ message: "Domain updated successfully", intern });
  } catch (err) {
    console.error("Error updating domain:", err);
    res.status(500).json({ message: "Failed to update domain" });
  }
};


export const deleteIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const intern = await Intern.findByIdAndDelete(id);
    if (!intern) return res.status(404).json({ message: "Intern not found" });
    res.status(200).json({ message: "Intern deleted successfully" });
  } catch (err) {
    console.error("Error deleting intern:", err);
    res.status(500).json({ message: "Failed to delete intern" });
  }
};


const generateUniqueId = async () => {
  const currentDate = new Date();
  let candidateId;
  let exists = true;

  while (exists) {
    candidateId = `GRAPHURA/${currentDate.getFullYear().toString().slice(2)}/${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${Math.floor(100 + Math.random() * 900)}`;

    // Check if this ID already exists
    const existing = await Intern.findOne({ uniqueId: candidateId });
    if (!existing) exists = false;
  }

  return candidateId;
};

export const generateOfferLetterWithPNG = async (req, res) => {
  try {
    const { id } = req.params;
    const { joiningDate } = req.body;

    // 1️⃣ Find the intern
    const intern = await Intern.findById(id);
    if (!intern) return res.status(404).json({ error: "Intern not found" });

    if (intern.status !== "Selected")
      return res
        .status(400)
        .json({ error: "Offer letter can only be generated for selected interns" });

    if (!joiningDate)
      return res
        .status(400)
        .json({ error: "Joining date is required to generate offer letter" });

    // Update joining date
    intern.joiningDate = new Date(joiningDate);

    // 2️⃣ Generate uniqueId if not already present
    if (!intern.uniqueId) {
      intern.uniqueId = await generateUniqueId();
    }

    await intern.save();

    // 3️⃣ Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

    const backgroundPath = path.join(
      process.cwd(),
      "public",
      "templates",
      "GRAPHURAOFFERLETTERS.png"
    );

    if (!fs.existsSync(backgroundPath)) {
      return res.status(404).json({ error: "Background PNG not found" });
    }

    const backgroundImageBytes = fs.readFileSync(backgroundPath);
    const backgroundImage = await pdfDoc.embedPng(backgroundImageBytes);

    page.drawImage(backgroundImage, {
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
    });

    const formattedJoiningDate = new Date(joiningDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const font = await pdfDoc.embedFont("Helvetica");
    const fontBold = await pdfDoc.embedFont("Helvetica-Bold");

    let y = 630;
    page.drawText("GRAPHURA INDIA PRIVATE LIMITED", {
      x: 60,
      y,
      size: 15,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    y -= 20;
    page.drawText("Gurgaon, Haryana.", {
      x: 60,
      y,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 60;
    page.drawText(`To,`, { x: 60, y, size: 13, font, color: rgb(0, 0, 0) });
    y -= 20;
    page.drawText(`${intern.fullName}`, {
      x: 60,
      y,
      size: 13,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    y -= 15;
    page.drawText(`${intern.domain} Department`, {
      x: 60,
      y,
      size: 13,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 40;
    page.drawText(
      "Subject: Offer of Internship at Graphura India Private Limited",
      { x: 60, y, size: 13, font, color: rgb(0, 0, 0) }
    );

    y -= 35;
    page.drawText(`Dear ${intern.fullName},`, {
      x: 60,
      y,
      size: 13,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 20;
    const textLines = [
      `We are delighted to offer you the position of Intern at Graphura India Private`,
      `Limited, starting from ${formattedJoiningDate}. We were impressed with your skills and`,
      "believe that your contribution will add value to our team.",
      "",
      "We look forward to welcoming you aboard and are excited about the journey",
      "ahead. Please feel free to reach out if you have any questions before your start",
      "date. Together, let's create impactful work and grow as a team. Once again,",
      "congratulations and welcome to Graphura India Private Limited.",
    ];

    textLines.forEach((line) => {
      page.drawText(line, { x: 60, y, size: 13, font, color: rgb(0, 0, 0) });
      y -= 15;
    });

    y -= 20;
    page.drawText("Thank you", { x: 60, y, size: 13, font: fontBold });
    y -= 15;
    page.drawText("Team Graphura.", { x: 60, y, size: 13, font: fontBold });

    y -= 95;
    page.drawText("Unique ID:", { x: 75, y, size: 13, font: fontBold });
    y -= 15;
    page.drawText(intern.uniqueId, { x: 75, y, size: 14, font: fontBold });

    y -= 15;
    page.drawText("Date:", { x: 75, y, size: 14, font: fontBold });
    page.drawText(formattedJoiningDate, { x: 115, y, size: 14, font });

    // 4️⃣ Save PDF
    const outputDir = path.join(process.cwd(), "public", "generated", "offerletters");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `OfferLetter-${intern.fullName.replace(/\s+/g, "_")}.pdf`;
    const filePath = path.join(outputDir, fileName);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    // 5️⃣ Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Graphura HR" <${process.env.EMAIL_USER}>`,
      to: intern.email,
      subject: "Internship Offer Letter – Graphura India Private Limited",
      text: `Dear ${intern.fullName},

It is our pleasure to offer you the position of intern at Graphura India Private Limited.
This internship is scheduled to commence on ${formattedJoiningDate}. During this period, you will have the opportunity to gain valuable industry exposure, enhance your professional skills, and contribute meaningfully to assigned projects. Upon successful completion, you will be awarded a Certificate of Internship from Graphura India Private Limited.

We kindly request you to review the attached document carefully.
We look forward to welcoming you to Graphura and are confident that this internship will provide you with a rewarding and enriching experience.

Best regards,
HR Department
Graphura India Private Limited
🌐 www.graphura.online`,
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    });

    // 6️⃣ Send PDF as response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating offer letter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateJoiningDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { joiningDate } = req.body;
    const intern = await Intern.findByIdAndUpdate(
      id,
      { joiningDate },
      { new: true }
    );
    if (!intern) return res.status(404).json({ message: "Intern not found" });

    res.status(200).json({ message: "Joining Date updated successfully", intern });
  } catch (err) {
    console.error("Error updating JoiningDate:", err);
    res.status(500).json({ message: "Failed to update domain" });
  }
};



export const updateDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body;

    const intern = await Intern.findByIdAndUpdate(
      id,
      { duration },
      { new: true }
    );

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.status(200).json({
      message: "Duration updated successfully",
      intern
    });
  } catch (error) {
    console.error("Error updating duration:", error);
    res.status(500).json({ message: "Server error" });
  }
}


export const InternIncharges = async (req, res) => {
  try {
    const incharges = await InternIncharge.find().select("-password"); // exclude password
    res.status(200).json({ success: true, incharges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const InchargeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // 1️⃣ Fetch incharge details
    const incharge = await InternIncharge.findById(id);

    if (!incharge) {
      return res.status(404).json({ message: "Incharge not found" });
    }

    // 2️⃣ Fetch students assigned under same departments
    const interns = await Intern.find({
      status: ["Active", "Inactive"],
      domain: { $in: incharge.departments },
    }).select("fullName email domain status joinDate");

    // 3️⃣ Respond
    res.status(200).json({
      message: "Incharge Fetched Successfully",
      Incharge: incharge,
      Interns: interns,
    });
  } catch (error) {
    console.error("Error in fetching incharge profile:", error);
    res.status(500).json({
      message: "Error in fetching incharge profile",
      error: error.message,
    });
  }
};



export const updateInchargeDepartments = async (req, res) => {
  try {
    const { id } = req.params;

    const { departments } = req.body;

    if (!Array.isArray(departments)) {
      return res.status(400).json({ message: "Departments must be an array" });
    }

    const incharge = await InternIncharge.findByIdAndUpdate(
      id,
      { departments },
      { new: true }
    );

    if (!incharge) {
      return res.status(404).json({ message: "Incharge not found" });
    }

    res.status(200).json({
      message: "Departments updated successfully",
      incharge,
    });
  } catch (error) {
    console.error("Error updating departments:", error);
    res.status(500).json({ message: "Error updating incharge departments" });
  }
};



export const removeInchargeDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { departments } = req.body;

    if (!Array.isArray(departments)) {
      return res.status(400).json({ message: "Departments must be an array" });
    }

    // Update incharge with new department list
    const incharge = await InternIncharge.findByIdAndUpdate(
      id,
      { departments },
      { new: true }
    );

    if (!incharge) {
      return res.status(404).json({ message: "Incharge not found" });
    }

    // Optionally unassign interns linked to the removed departments
    await Intern.updateMany(
      { domain: { $nin: incharge.departments } },
      { $unset: { inchargeId: "" } } // removes the inchargeId field
    );

    res.status(200).json({
      message: "Department removed successfully",
      incharge,
    });
  } catch (error) {
    console.error("Error removing department:", error);
    res.status(500).json({ message: "Error removing department" });
  }
};



export const ToggleInchargeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the incharge by ID
    const incharge = await InternIncharge.findById(id);

    if (!incharge) {
      return res.status(404).json({ message: "Incharge not found" });
    }

    // Toggle status
    const newStatus = incharge.status === "Active" ? "Inactive" : "Active";
    incharge.status = newStatus;

    // Save the updated incharge
    await incharge.save();

    res.status(200).json({ message: `Incharge status updated to ${newStatus}`, incharge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const deleteIncharge = async (req, res) => {
  try {
    const { id } = req.params;

    const incharge = await InternIncharge.findByIdAndDelete(id);

    if (!incharge) {
      return res.status(404).json({ message: "Incharge not found" });
    }

    res.status(200).json({ message: "Incharge deleted successfully" });
  } catch (err) {
    console.error("Error deleting incharge:", err);
    res.status(500).json({
      message: "Error deleting incharge",
      error: err.message,
    });
  }
};

export const getHRManagers = async (req, res) => {
  try {
    // Fetch all users with role HR
    const hrUsers = await User.find({ role: "HR" });

    res.status(200).json({
      message: "HR Managers fetched successfully",
      totalHR: hrUsers.length,
      hrManagers: hrUsers // optional full data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching HR managers", error: error.message });
  }
};


export const toggleHRStatus = async (req, res) => {
  try {
    const { hrId } = req.params;

    // Find the HR user by ID and ensure role is HR
    const hrUser = await User.findOne({ _id: hrId, role: "HR" });
    if (!hrUser) {
      return res.status(404).json({ message: "HR user not found" });
    }

    // Switch status
    hrUser.status = hrUser.status === "Active" ? "Inactive" : "Active";

    // Save changes
    await hrUser.save();

    res.status(200).json({
      message: `HR status updated to ${hrUser.status}`,
      hrUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating HR status", error: error.message });
  }
};



export const deleteHR = async (req, res) => {
  try {
    const { hrId } = req.params;

    // Find HR user by ID and ensure role is HR
    const hrUser = await User.findOne({ _id: hrId, role: "HR" });

    if (!hrUser) {
      return res.status(404).json({ success: false, message: "HR user not found" });
    }

    // Delete HR user
    await User.findByIdAndDelete(hrId);

    res.status(200).json({ success: true, message: "HR user deleted successfully" });
  } catch (error) {
    console.error("Delete HR Error:", error);
    res.status(500).json({ success: false, message: "Error deleting HR user", error: error.message });
  }
};

export const InchargeComments = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the intern exists
    const intern = await Intern.findById(id)
    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found'
      });
    }
    // Get comments from intern's comments array
    const inchargeComments = intern.comments || [];

    res.json({
      success: true,
      comments: inchargeComments
    });
  } catch (error) {
    console.error('Get incharge comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incharge comments'
    });
  }
}



export const InchargeCommentsDetails = async (req, res) => {
  try {
    const { inchargeId } = req.params;
    const incharge = await InternIncharge.findById(inchargeId).select('fullName email');
    if (!incharge) {
      return res.status(404).json({
        success: false,
        message: 'Incharge not found'
      });
    }
    res.json({
      success: true,
      incharge
    });
  } catch (error) {
    console.error('Get incharge details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incharge details'
    });
  }
}



export const InchargeDeleteComments = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    // Remove comment from intern's comments array
    await Intern.findByIdAndUpdate(
      id,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete incharge comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment'
    });
  }
}




export const GetApplication = async (req,res) =>{
    try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
}




export const toggleApplicationStatus = async (req, res) => {
  try {
    const { isApplicationOpen, password } = req.body;

    // Verify admin password
    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Update existing settings
    const settings = await Setting.findOne();
    if (!settings) {
      return res.status(404).json({ error: "Settings not found" });
    }

    // Update the status
    settings.isApplicationOpen = isApplicationOpen !== undefined ? isApplicationOpen : !settings.isApplicationOpen;
    await settings.save();

    res.json({ message: "Application status updated successfully", settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};



export const getHrCommentsForAdmin = async (req, res) => {
  try {
    const { id } = req.params; // Intern ID

    // Find intern and populate HR who commented
    const intern = await Intern.findById(id)
      .populate("hrComments.commentedBy", "fullName email role");

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.status(200).json({
      message: "HR comments fetched successfully (Admin view)",
      hrComments: intern.hrComments || [],
    });
  } catch (err) {
    console.error("Error fetching HR comments for Admin:", err);
    res.status(500).json({ message: "Failed to fetch HR comments" });
  }
};
