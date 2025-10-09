import express from "express";
import { verifyToken } from "../middlewares/AuthVerify.js"
import { logoutUser } from "../controllers/AuthController.js";
import { getAllInterns, getInternById, updateDomain, updatePerformance, updateStatus, deleteIntern, generateOfferLetterWithPNG} from "../controllers/AdminControllers.js";


const router = express.Router();

router.get("/admin/interns",verifyToken, getAllInterns);
router.get("/admin/interns/:id",verifyToken, getInternById);
router.put("/admin/interns/:id/status",verifyToken, updateStatus);
router.put("/admin/interns/:id/performance", verifyToken, updatePerformance);
router.put("/admin/interns/:id/domain",verifyToken, updateDomain);
router.post("/admin/logout", verifyToken, logoutUser)
router.post("/admin/interns/:id/generate",verifyToken, generateOfferLetterWithPNG)
router.delete("/admin/interns/:id",verifyToken, deleteIntern);

export default router;
