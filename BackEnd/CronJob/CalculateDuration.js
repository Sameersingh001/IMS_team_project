import cron from "node-cron";
import Intern from "../models/InternDatabase.js";

// Function to check and update interns
export const updateInternStatus = async () => {
  try {
    const now = new Date();
    const interns = await Intern.find({ status: "Active" });

    for (const intern of interns) {
      if (!intern.joiningDate) continue;

      const joinDate = new Date(intern.joiningDate);
      const endDate = new Date(joinDate);

      if (intern.duration === "1 Month") endDate.setMonth(joinDate.getMonth() + 1);
      else if (intern.duration === "3 Months") endDate.setMonth(joinDate.getMonth() + 3);
      else if (intern.duration === "6 Months") endDate.setMonth(joinDate.getMonth() + 6);

      if (now >= endDate) {
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
    await updateInternStatus();
  });
};

