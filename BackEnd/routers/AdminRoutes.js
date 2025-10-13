import express from "express";
import { verifyToken } from "../middlewares/AuthVerify.js"
import { logoutUser } from "../controllers/AuthController.js";
import { getAllInterns, getInternById, updateDomain,updateDuration, updatePerformance, updateStatus, deleteIntern, generateOfferLetterWithPNG, updateJoiningDate, InternIncharges, InchargeProfile, updateInchargeDepartments, removeInchargeDepartment, deleteIncharge, ToggleInchargeStatus, getHRManagers, toggleHRStatus, deleteHR,InchargeComments,InchargeCommentsDetails, InchargeDeleteComments, GetApplication, toggleApplicationStatus, getHrCommentsForAdmin, BulkJoinDate, generateBulkOfferLetters} from "../controllers/AdminControllers.js";


const router = express.Router();

router.get("/admin/interns",verifyToken, getAllInterns);
router.get("/admin/interns/:id",verifyToken, getInternById);
router.get("/admin/department-incharges", verifyToken, InternIncharges)
router.get("/admin/intern-incharge/:id/profile",verifyToken, InchargeProfile)
router.get("/admin/hr-managers", verifyToken, getHRManagers)
router.get("/admin/interns/:id/incharge-comments",verifyToken, InchargeComments)
router.get("/admin/intern-head/:inchargeId",verifyToken, InchargeCommentsDetails)
router.get("/admin/settings",verifyToken, GetApplication)
router.get("/admin/interns/:id/hr-comments",verifyToken, getHrCommentsForAdmin)

router.put("/admin/intern-incharge/:id/add/departments",verifyToken, updateInchargeDepartments )
router.put("/admin/intern-incharge/:id/remove/departments",verifyToken, removeInchargeDepartment)
router.put("/admin/intern-incharge/:id/status",verifyToken, ToggleInchargeStatus)
router.put("/admin/hr-managers/:hrId/status",verifyToken, toggleHRStatus)
router.put("/admin/settings/application-status",verifyToken, toggleApplicationStatus)


router.put("/admin/interns/:id/status",verifyToken, updateStatus);
router.put("/admin/interns/:id/performance", verifyToken, updatePerformance);
router.put("/admin/interns/:id/domain",verifyToken, updateDomain);
router.put("/admin/interns/:id/joining-date", verifyToken,updateJoiningDate )
router.put("/admin/interns/:id/duration", verifyToken,updateDuration )


router.post("/admin/logout", verifyToken, logoutUser)
router.post("/admin/interns/:id/generate-offer-letter",verifyToken, generateOfferLetterWithPNG)

router.put("/admin/interns/bulk-joining-date",verifyToken, BulkJoinDate)
router.post("/admin/interns/bulk-offer-letters",verifyToken, generateBulkOfferLetters)

router.delete("/admin/interns/:id",verifyToken, deleteIntern);
router.delete("/admin/department-incharges/:id",verifyToken, deleteIncharge);
router.delete("/admin/hr-managers/:hrId",verifyToken, deleteHR);
router.delete("/admin/interns/:id/incharge-comments/:commentId",verifyToken, InchargeDeleteComments);




export default router;
