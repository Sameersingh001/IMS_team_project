import Intern from "../models/InternDatabase.js";

// ✅ Fetch all interns (with search, filter, pagination)
export const getAllInterns = async (req, res) => {
  try {
    const { search = "", status, performance, page = 1, limit = 10 } = req.query;

    const allowedStatuses = ["Applied", "Selected", "Rejected"];
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




export const deleteRejectMany = async (req, res)=>{
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