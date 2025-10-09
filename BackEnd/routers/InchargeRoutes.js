import express from "express"
import {registerInternIncharge, loginInternIncharge, checkInternInchargeAuth, logoutInternIncharge, DomainWiseInterns} from "../controllers/InternInchargeControllers.js"
import {protectInternIncharge} from "../middlewares/InchargeMiddle.js"

const router = express.Router()

router.post("/intern-incharge/register", registerInternIncharge)
router.post("/incharge/login", loginInternIncharge)
router.get("/intern-incharge/check-auth", protectInternIncharge, checkInternInchargeAuth )
router.get("/intern-incharge/assigned-interns", protectInternIncharge, DomainWiseInterns)
router.post("/intern-incharge/logout", protectInternIncharge, logoutInternIncharge)



export default router