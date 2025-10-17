import Intern from "../models/InternDatabase.js";

// ✅ Fetch all interns (with search, filter, pagination)
export const getAllInterns = async (req, res) => {
  try {
    const { search = "", status, performance, page = 1, limit = 10 } = req.query;

    const allowedStatuses = ["Applied", "Selected"];
    let searchQuery = {};

    // ✅ Apply status filter
    if (status && allowedStatuses.includes(status)) {
      searchQuery.status = status; // single status
    } else {
      searchQuery.status = { $in: allowedStatuses }; // fallback: all allowed
    }

    // Search filter
    if (search.trim() !== "") {
      searchQuery.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { domain: { $regex: search, $options: "i" } },
        { college: { $regex: search, $options: "i" } },
        { course: { $regex: search, $options: "i" } },
        { educationLevel: { $regex: search, $options: "i" } },
        { uniqueId: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    // Performance filter
    if (performance) searchQuery.performance = performance;

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
    const hrId = req.user.id; // assuming your auth middleware sets req.user

    const intern = await Intern.findByIdAndUpdate(
      id,
      {
        performance,
        updatedByHR: hrId, // track which HR updated performance
      },
      { new: true }
    ).populate("updatedByHR", "fullName email role"); // optional: show HR info

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.status(200).json({
      message: "Performance updated successfully",
      intern,
    });
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


export const addHrComment = async (req, res) => {
  try {
    const { id } = req.params; // intern id
    const { text, stage } = req.body;
    const hrId = req.user?.id; // HR id from JWT (if using auth middleware)

    // Validate input
    if (!text || !stage) {
      return res.status(400).json({ message: "Stage and comment text are required" });
    }

    // Find intern and push new HR comment
    const intern = await Intern.findByIdAndUpdate(
      id,
      {
        $push: {
          hrComments: {
            text,
            stage,
            commentedBy: hrId,
            date: new Date(),
          },
        },
        updatedByHR: hrId,
      },
      { new: true }
    )
      .populate("hrComments.commentedBy", "fullName email role")
      .populate("updatedByHR", "fullName email role");

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.status(200).json({
      message: "HR comment added successfully",
      intern,
    });
  } catch (err) {
    console.error("Error adding HR comment:", err);
    res.status(500).json({ message: "Failed to add HR comment" });
  }
};


export const getHrComments = async (req, res) => {
  try {
    const { id } = req.params; // Intern ID

    // Find intern and populate HR comment authors
    const intern = await Intern.findById(id)
      .populate("hrComments.commentedBy", "fullName email role");

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.status(200).json({
      message: "HR comments fetched successfully",
      hrComments: intern.hrComments || [],
    });
  } catch (err) {
    console.error("Error fetching HR comments:", err);
    res.status(500).json({ message: "Failed to fetch HR comments" });
  }
};



export const deleteHrComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const hrId = req.user?.id; // Assuming JWT middleware provides logged-in HR ID

    // Find intern
    const intern = await Intern.findById(id);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    // Find the comment by its ID
    const comment = intern.hrComments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "HR comment not found" });
    }

    // Optional: Ensure only the HR who added it can delete
    if (comment.commentedBy.toString() !== hrId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Remove the comment
    comment.deleteOne();

    await intern.save();

    res.status(200).json({ message: "HR comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting HR comment:", err);
    res.status(500).json({ message: "Failed to delete HR comment" });
  }
};




export const deleteRejectMany = async (req, res) => {
  try {
    const result = await Intern.deleteMany({ status: 'Rejected' });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} rejected interns`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting rejected interns:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete rejected interns'
    });
  }
}



export const ImportedIntern = async (req, res) => {

  try {
    const { interns } = req.body;

    if (!interns || !Array.isArray(interns)) {
      return res.status(400).json({
        message: "Invalid data format. Expected array of interns."
      });
    }

    if (interns.length === 0) {
      return res.status(400).json({
        message: "No data to import."
      });
    }

    // Limit the number of records per import
    if (interns.length > 1000) {
      return res.status(400).json({
        message: "Too many records. Maximum 1000 records per import."
      });
    }

    const results = {
      total: interns.length,
      success: 0,
      failed: 0,
      duplicates: 0,
      errors: []
    };

    const importedInterns = [];
    const seenEmails = new Set();
    const seenMobiles = new Set();

    for (const [index, internData] of interns.entries()) {
      try {
        // Validate required fields
        const requiredFields = ['fullName', 'email', 'mobile', 'domain'];
        const missingFields = requiredFields.filter(field => !internData[field] || internData[field].toString().trim() === '');

        if (missingFields.length > 0) {
          results.failed++;
          results.errors.push(`Record ${index + 1}: Missing required fields - ${missingFields.join(', ')}`);
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = internData.email.toString().trim().toLowerCase();
        if (!emailRegex.test(email)) {
          results.failed++;
          results.errors.push(`Record ${index + 1}: Invalid email format - ${email}`);
          continue;
        }

        // Validate mobile format
        const mobile = internData.mobile.toString().trim();
        if (!mobile || mobile.length < 10) {
          results.failed++;
          results.errors.push(`Record ${index + 1}: Invalid mobile number - ${mobile}`);
          continue;
        }

        // Check for duplicates in current batch
        if (seenEmails.has(email)) {
          results.duplicates++;
          results.errors.push(`Record ${index + 1}: Duplicate email in batch - ${email}`);
          continue;
        }

        if (seenMobiles.has(mobile)) {
          results.duplicates++;
          results.errors.push(`Record ${index + 1}: Duplicate mobile in batch - ${mobile}`);
          continue;
        }

        // Check for existing interns in database
        const existingIntern = await Intern.findOne({
          $or: [
            { email: email },
            { mobile: mobile }
          ]
        });

        if (existingIntern) {
          results.duplicates++;
          results.errors.push(`Record ${index + 1}: Already exists in database - ${email} / ${mobile}`);
          continue;
        }

        // Prepare intern data with proper formatting
        const internToSave = {
          fullName: internData.fullName.toString().trim(),
          email: email,
          mobile: mobile,
          dob: internData.dob ? internData.dob.toString().trim() : '',
          gender: internData.gender ? internData.gender.toString().trim() : '',
          state: internData.state ? internData.state.toString().trim() : '',
          city: internData.city ? internData.city.toString().trim() : '',
          address: internData.address ? internData.address.toString().trim() : '',
          pinCode: internData.pinCode ? internData.pinCode.toString().trim() : '',
          college: internData.college ? internData.college.toString().trim() : '',
          course: internData.course ? internData.course.toString().trim() : '',
          educationLevel: internData.educationLevel ? internData.educationLevel.toString().trim() : '',
          domain: internData.domain.toString().trim(),
          contactMethod: internData.contactMethod ? internData.contactMethod.toString().trim() : 'Email',
          resumeUrl: internData.resumeUrl ? internData.resumeUrl.toString().trim() : '',
          duration: internData.duration ? internData.duration.toString().trim() : '',
          prevInternship: ['Yes', 'No'].includes(internData.prevInternship) ? internData.prevInternship : 'No',
          TpoName: internData.TpoName ? internData.TpoName.toString().trim() : '',
          TpoEmail: internData.TpoEmail ? internData.TpoEmail.toString().trim().toLowerCase() : '',
          TpoNumber: internData.TpoNumber ? internData.TpoNumber.toString().trim() : '',

          // Optional fields
          uniqueId: internData.uniqueId ? internData.uniqueId.toString().trim() : '',
          joiningDate: internData.joiningDate ? internData.joiningDate.toString().trim() : '',

          // ✅ Status logic
          status:
            internData.uniqueId && internData.joiningDate
              ? 'Active'
              : 'Applied',

          performance:
            internData.uniqueId && internData.joiningDate
              ? 'Good'
              : 'Average', 
          // Track import source
          importedBy: req.user._id,
          importDate: new Date(),
          source: 'import'
        };


        // Validate domain against allowed values
        const allowedDomains = [
          'Sales & Marketing',
          'Email Outreaching',
          'Journalism',
          'Social Media Management',
          'Graphic Design',
          'Digital Marketing',
          'Video Editing',
          'Content Writing',
          'UI/UX Designing',
          'Front-end Developer',
          'Back-end Developer'
        ];

        if (!allowedDomains.includes(internToSave.domain)) {
          results.failed++;
          results.errors.push(`Record ${index + 1}: Invalid domain - ${internToSave.domain}. Must be one of: ${allowedDomains.join(', ')}`);
          continue;
        }

        // Create new intern
        const newIntern = new Intern(internToSave);
        await newIntern.save();

        // Add to seen sets to prevent duplicates in this batch
        seenEmails.add(email);
        seenMobiles.add(mobile);

        importedInterns.push(newIntern);
        results.success++;

      } catch (error) {
        results.failed++;

        if (error.code === 11000) {
          // MongoDB duplicate key error
          const field = Object.keys(error.keyPattern)[0];
          results.duplicates++;
          results.errors.push(`Record ${index + 1}: Duplicate ${field} - ${internData[field]}`);
        } else if (error.name === 'ValidationError') {
          // Mongoose validation error
          const validationErrors = Object.values(error.errors).map(e => e.message);
          results.errors.push(`Record ${index + 1}: Validation error - ${validationErrors.join(', ')}`);
        } else {
          results.errors.push(`Record ${index + 1}: ${error.message}`);
        }

        console.error(`Error importing record ${index + 1}:`, error);
      }
    }

    res.json({
      message: `Import completed: ${results.success} successful, ${results.failed} failed, ${results.duplicates} duplicates`,
      summary: results,
      importedCount: results.success
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      message: 'Failed to import interns: ' + error.message
    });
  }


}




