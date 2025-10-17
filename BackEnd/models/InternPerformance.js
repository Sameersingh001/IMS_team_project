import mongoose from "mongoose";

// Sub-schema for monthly performance
const monthlyScoreSchema = new mongoose.Schema({
    monthNumber: { type: Number, required: true }, // 1, 2, 3...
    score: { type: Number, required: true },
    remarks: { type: String, default: "" }
});

// Sub-schema for soft skills
const softSkillsSchema = new mongoose.Schema({
    initiative: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    behaviour: { type: Number, default: 0 }
});

// Main performance schema
const internPerformanceSchema = new mongoose.Schema({
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Intern",
        required: true
    },

    // Overall performance
    performance: { type: String, enum: ["Excellent", "Good", "Average"], default: "Average" },

    // Monthly performance scores
    monthlyScores: [monthlyScoreSchema],

    // Soft skills
    softSkills: softSkillsSchema,

    // Certificate info
    certificateGenerated: { type: Boolean, default: false },
    certificateNo: { type: String, default: "Not Generated" }

}, { timestamps: true });

// Auto-assign month numbers before saving
internPerformanceSchema.pre("save", function(next) {
    if (this.monthlyScores && this.monthlyScores.length > 0) {
        this.monthlyScores = this.monthlyScores.map((m, idx) => ({
            ...m,
            monthNumber: idx + 1
        }));
    }
    next();
});

// Virtual to populate intern basic details
internPerformanceSchema.virtual("internDetails", {
    ref: "Intern",
    localField: "internId",
    foreignField: "_id",
    justOne: true
});

const InternPerformance = mongoose.model("InternPerformance", internPerformanceSchema);
export default InternPerformance;
