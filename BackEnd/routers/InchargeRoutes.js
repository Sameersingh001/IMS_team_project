import express from "express"
import {registerInternIncharge, loginInternIncharge, checkInternInchargeAuth, logoutInternIncharge, DomainWiseInterns, forgotPassword, verifyOtp, resendOtp, resetPassword, InternComments, DeleteComments} from "../controllers/InternInchargeControllers.js"
import {protectInternIncharge} from "../middlewares/InchargeMiddle.js"

const router = express.Router()

router.post("/intern-incharge/register", registerInternIncharge)
router.post("/incharge/login", loginInternIncharge)
router.post("/incharge/forgot-password", forgotPassword)
router.post("/incharge/verify-otp", verifyOtp)
router.post("/incharge/resend-otp", resendOtp)
router.post("/incharge/reset-password", resetPassword)
router.post("/intern-incharge/interns/:internId/comments",protectInternIncharge, InternComments)
router.delete("/intern-incharge/interns/:internId/comments/:commentId",protectInternIncharge, DeleteComments)



router.get("/intern-incharge/check-auth", protectInternIncharge, checkInternInchargeAuth )
router.get("/intern-incharge/assigned-interns", protectInternIncharge, DomainWiseInterns)
router.post("/intern-incharge/logout", protectInternIncharge, logoutInternIncharge)



export default router