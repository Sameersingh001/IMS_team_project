import express from "express"
import { registerReviewTeam, loginReviewTeam, getFeedbacks, exportFeedbacks, updateCertificateStatus} from "../controllers/ReviewTeamController.js"
import {authenticateToken} from "../middlewares/ReviewMiddle.js"


const router = express.Router();


router.post("/review-team/register", registerReviewTeam)
router.post("/review-team/login", loginReviewTeam)
router.get("/review-team/feedbacks", authenticateToken, getFeedbacks)
router.post("/review-team/export-feedbacks", authenticateToken, exportFeedbacks)
router.put("/review-team/feedbacks/:feedbackId/certificate", authenticateToken, updateCertificateStatus)


export default router