import cron from "node-cron";
import Intern from "../models/InternDatabase.js";

// Function to check and update interns
export const updateInternStatus = async () => {
  try {
    const now = new Date();
    const interns = await Intern.find({ status: { $in: ["Active", "Completed"] } });

    for (const intern of interns) {
      if (!intern.joiningDate) continue;

      const joinDate = new Date(intern.joiningDate);
      let endDate = new Date(joinDate);

      // Calculate base duration from joining date
      if (intern.duration === "8 Months") endDate.setMonth(joinDate.getMonth() + 8);
      else if (intern.duration === "3 Months") endDate.setMonth(joinDate.getMonth() + 3);
      else if (intern.duration === "4 Months") endDate.setMonth(joinDate.getMonth() + 4);
      else if (intern.duration === "6 Months") endDate.setMonth(joinDate.getMonth() + 6);

      // Add extended days if any (from the original end date)
      if (intern.extendedDays && intern.extendedDays > 0) {
        endDate.setDate(endDate.getDate() + intern.extendedDays);
      }

      // If intern has extended days and was previously completed, but extended end date is in future
      if (intern.extendedDays > 0 && intern.status === "Completed" && now < endDate) {
        intern.status = "Active";
        await intern.save();
      }
      // Mark as completed if current date is past the calculated end date (from joining date + duration + extensions)
      else if (now >= endDate && intern.status === "Active") {
        intern.status = "Completed";
        await intern.save();
      }
    }
  } catch (err) {
    console.error("❌ Error in updating intern status:", err);
  }
};

export const startInternshipCronJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("🕒 Running internship status update cron job...");
    await updateInternStatus();
  }); 
};



