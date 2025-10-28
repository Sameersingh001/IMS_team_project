import ReviewTeam from "../models/ReviewTeam.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Feedback from "../models/Feedback.js"
import ExcelJS from 'exceljs';
import { Parser } from 'json2csv';

export const registerReviewTeam = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, mobile, gender, address, city, state, pinCode, Secret_Key } = req.body;

    if (!fullName || !email || !password || !confirmPassword || !mobile || !gender || !Secret_Key) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (!mobile.match(/^[0-9]{10}$/)) return res.status(400).json({ message: "Invalid mobile number" });

    // Secret key check against .env
    if (Secret_Key !== process.env.REVIEW_TEAM_SECRET) return res.status(401).json({ message: "Invalid Secret Key" });

    // Check if email exists
    const existingUser = await ReviewTeam.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Hash password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user
    const newMember = new ReviewTeam({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      gender,
      address: address || "",
      city: city || "",
      state: state || "",
      pinCode: pinCode || "",
      role: "ReviewTeam"
    });

    await newMember.save();
    res.status(201).json({ message: "Review Team member registered successfully" });

  } catch (error) {
    console.error("Review Team registration error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};


export const loginReviewTeam = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const member = await ReviewTeam.findOne({ email });
    if (!member) return res.status(401).json({ message: "Invalid email or password" });

    // Check if hashed password exists in DB
    if (!member.password) return res.status(500).json({ message: "User password missing in database" });

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign({ id: member._id, role: member.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      member: {
        id: member._id,
        fullName: member.fullName,
        email: member.email,
        role: member.role
      }
    });

  } catch (error) {
    console.error("Review Team login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};


export const getFeedbacks = async (req, res) => {
  try {
    const memberId = req.user.id; // from auth middleware
    const feedbacks = await Feedback.find()
      .populate("intern", "fullName email mobile dob")
      .sort({ submittedAt: -1 });

    const formatted = feedbacks.map(f => {
      // Safe data extraction with fallbacks
      const intern = f.intern || {};
      const internshipInfo = f.internshipInfo || {};
      const media = f.media || {};

      return {
        _id: f._id || '',
        uniqueId: f.uniqueId || '',
        internDetails: {
          fullName: intern.fullName || 'N/A',
          email: intern.email || 'N/A',
          mobile: intern.mobile || 'N/A',
          dob: intern.dob
        },
        internshipInfo: {
          domain: internshipInfo.domain || 'N/A',
          duration: internshipInfo.duration || 'N/A',
          startMonth: internshipInfo.startMonth || 'N/A',
          endMonth: internshipInfo.endMonth || 'N/A',
          certificateNumber: internshipInfo.certificateNumber
        },
        feedbackText: f.feedbackText || 'No feedback provided',
        media: {
          // Use nested media object first, fallback to direct properties
          photoUrl: media.photoUrl || f.photoUrl || '',
          videoUrl: media.videoUrl || f.videoUrl || ''
        },
        submittedAt: f.submittedAt || new Date()
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Fetch feedbacks error:", error);
    res.status(500).json({ message: "Server error fetching feedbacks" });
  }
};




export const exportFeedbacks = async (req, res) => {
  try {
    const { feedbackIds, options } = req.body;

    // Validate input
    if (!feedbackIds || !Array.isArray(feedbackIds) || feedbackIds.length === 0) {
      return res.status(400).json({ message: "No feedbacks selected for export" });
    }

    if (!options || typeof options !== 'object') {
      return res.status(400).json({ message: "Export options are required" });
    }

    // Validate feedback IDs are valid MongoDB ObjectIds
    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
    const validFeedbackIds = feedbackIds.filter(id => isValidObjectId(id));
    
    if (validFeedbackIds.length === 0) {
      return res.status(400).json({ message: "Invalid feedback IDs provided" });
    }

    // Fetch feedback data with proper error handling
    const feedbacks = await Feedback.find({ _id: { $in: validFeedbackIds } })
      .populate("intern", "fullName email mobile dob")
      .sort({ submittedAt: -1 })
      .lean();

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedbacks found for the selected IDs" });
    }

    // -----------------------------
    // 🧾 Prepare Data for Export
    // -----------------------------
    const exportData = feedbacks.map((fb, index) => {
      const intern = fb.intern || {};
      const internshipInfo = fb.internshipInfo || {};
      const media = fb.media || {};
      const internDetails = fb.internDetails || {};
      
      // Use internDetails as fallback if intern population fails
      const internName = intern.fullName || internDetails.fullName || 'N/A';
      const internEmail = intern.email || internDetails.email || 'N/A';
      const internMobile = intern.mobile || internDetails.mobile || 'N/A';
      const internDob = intern.dob || internDetails.dob || 'N/A';

      const baseData = {
        'SR No.': index + 1,
        'Certificate Number': internshipInfo.certificateNumber || 'Not Available',
        'Unique ID': fb.uniqueId || 'N/A',
        'Intern Name': internName,
        'Email': internEmail,
        'Mobile': internMobile,
        'Date of Birth': internDob,
        'Domain': internshipInfo.domain || 'N/A',
        'Duration': internshipInfo.duration || 'N/A',
        'Start Month': internshipInfo.startMonth || 'N/A',
        'End Month': internshipInfo.endMonth || 'N/A',
        'Submitted Date': fb.submittedAt ? new Date(fb.submittedAt).toLocaleDateString('en-IN') : 'N/A',
        'Submitted Time': fb.submittedAt ? new Date(fb.submittedAt).toLocaleTimeString('en-IN') : 'N/A',
      };

      // Conditionally add fields based on options
      if (options.includeText) {
        baseData['Feedback Text'] = fb.feedbackText || 'No feedback provided';
      }

      if (options.includePhotos) {
        baseData['Photo URL'] = media.photoUrl || 'No photo available';
      }

      if (options.includeVideos) {
        baseData['Video URL'] = media.videoUrl || 'No video available';
      }

      if (options.includeCertificate) {
        baseData['Certificate Number'] = internshipInfo.certificateNumber || 'Not Available';
        baseData['Date of Birth'] = internDob;
      }

      return baseData;
    });

    // -----------------------------
    // 📦 Generate File
    // -----------------------------
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (options.format === "csv") {
      // ✅ Export as CSV
      try {
        const { Parser } = require('json2csv');
        const parser = new Parser({
          fields: Object.keys(exportData[0]),
          delimiter: ',',
          quote: '"',
          escape: '"'
        });
        
        const csv = parser.parse(exportData);
        
        res.header("Content-Type", "text/csv; charset=utf-8");
        res.header("Content-Disposition", `attachment; filename="intern-feedbacks-${timestamp}.csv"`);
        res.header("X-Content-Type-Options", "nosniff");
        
        return res.send('\uFEFF' + csv); // BOM for Excel compatibility
      } catch (csvError) {
        console.error("CSV Generation Error:", csvError);
        return res.status(500).json({ message: "Failed to generate CSV file" });
      }
      
    } else {
      // ✅ Export as Excel (.xlsx) - Default
      try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Intern Management System';
        workbook.created = new Date();

        const sheet = workbook.addWorksheet("Intern Feedbacks", {
          properties: { tabColor: { argb: 'FF3B82F6' } }
        });

        // Define columns with appropriate widths
        sheet.columns = [
          { header: 'SR No.', key: 'SR No.', width: 8 },
          { header: 'Certificate Number', key: 'Certificate Number', width: 25 },
          { header: 'Unique ID', key: 'Unique ID', width: 15 },
          { header: 'Intern Name', key: 'Intern Name', width: 25 },
          { header: 'Email', key: 'Email', width: 30 },
          { header: 'Mobile', key: 'Mobile', width: 15 },
          { header: 'Date of Birth', key: 'Date of Birth', width: 12 },
          { header: 'Domain', key: 'Domain', width: 20 },
          { header: 'Duration', key: 'Duration', width: 12 },
          { header: 'Start Month', key: 'Start Month', width: 12 },
          { header: 'End Month', key: 'End Month', width: 12 },
          { header: 'Submitted Date', key: 'Submitted Date', width: 12 },
          { header: 'Submitted Time', key: 'Submitted Time', width: 12 },
          ...(options.includeText ? [{ header: 'Feedback Text', key: 'Feedback Text', width: 50 }] : []),
          ...(options.includePhotos ? [{ header: 'Photo URL', key: 'Photo URL', width: 40 }] : []),
          ...(options.includeVideos ? [{ header: 'Video URL', key: 'Video URL', width: 40 }] : [])
        ];

        // Add data rows
        sheet.addRows(exportData);

        // Style header row
        const headerRow = sheet.getRow(1);
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
          cell.font = { 
            bold: true, 
            color: { argb: "FFFFFFFF" },
            size: 11
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" } // blue
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { 
            vertical: "middle", 
            horizontal: "center",
            wrapText: true
          };
        });

        // Style data rows
        for (let i = 2; i <= sheet.rowCount; i++) {
          const row = sheet.getRow(i);
          row.height = 20;
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
            cell.font = { size: 10 };
            // Align SR No. and dates to center
            if (cell.col === 1 || cell.value === 'SR No.' || cell.value.includes('Date') || cell.value.includes('Time')) {
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
            }
          });
        }

        // Freeze header row
        sheet.views = [{ state: 'frozen', ySplit: 1 }];

        // Auto-filter on header row
        sheet.autoFilter = {
          from: 'A1',
          to: `${String.fromCharCode(65 + sheet.columnCount - 1)}1`
        };

        // Set response headers
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="intern-feedbacks-${timestamp}.xlsx"`
        );
        res.setHeader("X-Content-Type-Options", "nosniff");

        await workbook.xlsx.write(res);
        res.end();

      } catch (excelError) {
        console.error("Excel Generation Error:", excelError);
        return res.status(500).json({ message: "Failed to generate Excel file" });
      }
    }

  } catch (error) {
    console.error("❌ Export Feedbacks Error:", error);
    
    // More specific error messages
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid feedback ID format" });
    }
    
    if (error.code === 'ETIMEDOUT') {
      return res.status(504).json({ message: "Export request timed out" });
    }

    res.status(500).json({ 
      message: "Export failed due to server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
