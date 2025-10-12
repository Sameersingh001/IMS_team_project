import express from "express";
import {getAllInterns, getInternById, updatePerformance, updateStatus, updateDomain, addHrComment, getHrComments, deleteHrComment} from "../controllers/HrControllers.js";
import { verifyToken } from "../middlewares/AuthVerify.js";
import { logoutUser } from "../controllers/AuthController.js";

const router = express.Router();

router.get("/hr/interns", verifyToken, getAllInterns);
router.get("/hr/interns/:id", verifyToken, getInternById);
router.put("/hr/interns/:id/status", verifyToken, updateStatus);
router.put("/hr/interns/:id/performance", verifyToken, updatePerformance);
router.put("/hr/interns/:id/domain", verifyToken, updateDomain);
router.post("/hr/interns/:id/hr-comments", verifyToken, addHrComment)
router.get("/hr/interns/:id/hr-comments", verifyToken, getHrComments)
router.delete("/hr/interns/:id/hr-comments/:commentId", verifyToken, deleteHrComment)
router.post("/logout", verifyToken, logoutUser);

export default router;
    