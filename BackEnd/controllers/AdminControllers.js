
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import Intern from "../models/InternDatabase.js"




export const getAllInterns = async (req, res) => {
  try {
    const { search = "", status, performance, page = 1, limit = 10 } = req.query;

    // 🔍 Search query (case-insensitive)
    const searchQuery = {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { domain: { $regex: search, $options: "i" } },
      ],
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
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: "Intern not found" });
    res.status(200).json(intern);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const intern = await Intern.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!intern) return res.status(404).json({ message: "Intern not found" });

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


export const generateOfferLetterWithPNG = async (req, res) => {


  try {
    const { id } = req.params;

    // 1️⃣ Find the intern
    const intern = await Intern.findById(id);
    if (!intern) {
      return res.status(404).json({ error: "Intern not found" });
    }

    if (intern.status !== "Selected") {
      return res.status(400).json({
        error: "Offer letter can only be generated for selected interns",
      });
    }

    // 2️⃣ Create a new PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

    // 3️⃣ Load and embed PNG background
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

    // Draw background image on full page
    page.drawImage(backgroundImage, {
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
    });

    // 4️⃣ Dynamic details
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);
    const formattedStartDate = startDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const uniqueId = `GRAPHURA/${currentDate.getFullYear().toString().slice(2)}/${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${Math.floor(100 + Math.random() * 900)}`;

    const font = await pdfDoc.embedFont("Helvetica");
    const fontBold = await pdfDoc.embedFont("Helvetica-Bold");

    // 5️⃣ Write content over PNG - Matching exact sample PDF format
    
    // Company Header - Centered at top
    page.drawText("GRAPHURA INDIA PRIVATE LIMITED", {
      x: 60,
      y: 630,
      size: 15,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    page.drawText("Gurgaon, Haryana.", {
      x: 60,
      y: 610,
      size: 14,
      font: font,
      color: rgb(0, 0, 0),
    });

    // To Section
    let y = 550;
    page.drawText("To,", { 
      x: 60, 
      y, 
      size: 13, 
      font: font, 
      color: rgb(0, 0, 0) 
    });

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
      font: font,
      color: rgb(0, 0, 0),
    });

    // Subject
    y -= 40;
    page.drawText("Subject: Offer of Internship at Graphura India Private Limited", {
      x: 60, 
      y, 
      size: 13, 
      font: font, 
      color: rgb(0, 0, 0) 
    });

    // Salutation
    y -= 35;
    page.drawText(`Dear ${intern.fullName},`, {
      x: 60,
      y,
      size: 13,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Main Content - Exact same text as sample PDF
    y -= 20;
    const textLines = [
      `We are delighted to offer you the position of Intern at Graphura India Private`,
      `Limited, starting from ${formattedStartDate}. We were impressed with your skills and`,
      "believe that your contribution will add value to our team.",
      "",
      "We look forward to welcoming you aboard and are excited about the journey",
      "ahead. Please feel free to reach out if you have any questions before your start",
      "date. Together, let's create impactful work and grow as a team. Once again,",
      "congratulations and welcome to Graphura India Private Limited."
    ];

    textLines.forEach((line) => {
      page.drawText(line, {
        x: 60,
        y,
        size: 13,
        font: font,
        color: rgb(0, 0, 0),
      });
      y -= 15;
    });

    // Closing Section
    y -= 20;
    page.drawText("Thank you", { 
      x: 60, 
      y, 
      size: 13, 
      font: fontBold, 
      color: rgb(0, 0, 0) 
    });

    y -= 15;
    page.drawText("Team Graphura.", {
      x: 60,
      y,
      size: 13,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Footer with Unique ID and Date
    y -= 95;
    page.drawText("Unique ID:", {
      x: 75,
      y,
      size: 13,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    y -= 15;

    page.drawText(uniqueId, {
      x: 75,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    y -= 15;
    page.drawText(`Date:`, {
      x: 75,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    y-=0
    page.drawText(formattedStartDate, {
      x: 115,
      y,
      size: 14,
      font: font,
      color: rgb(0, 0, 0),
    });

    // 6️⃣ Save the file to /public/generated/offerletters/
    const outputDir = path.join(process.cwd(), "public", "generated", "offerletters");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `OfferLetter-${intern.fullName.replace(/\s+/g, "_")}.pdf`;
    const filePath = path.join(outputDir, fileName);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    // 7️⃣ Send file as download response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error("Error generating offer letter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

