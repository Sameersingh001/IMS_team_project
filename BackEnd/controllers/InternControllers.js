import Intern from "../models/InternDatabase.js";

export const createIntern = async (req, res) => {
    try {
        const internData = req.body;
        // Check if intern with the same email or mobile already exists

        if (!internData.fullName || !internData.email || !internData.mobile) {
            return res.status(400).json({ message: "Full Name, Email and Mobile are required" });
        }

        const intern = await Intern.findOne({ email: internData.email });
        if (intern) {
            return res.status(400).json({ message: "Intern Application already exists" });
        }

        const internWithMobile = await Intern.findOne({ mobile: internData.mobile });
        if (internWithMobile) {
            return res.status(400).json({ message: "Intern Application already exists" });
        }

        const newIntern = new Intern({
            fullName: internData.fullName,
            email: internData.email,
            mobile: internData.mobile,
            dob: internData.dob,
            gender: internData.gender,
            state: internData.state,
            city: internData.city,
            address: internData.address,
            pinCode: internData.pinCode,
            college: internData.college,
            course: internData.course,
            educationLevel: internData.educationLevel,
            domain: internData.domain,
            contactMethod: internData.contactMethod,
            resumeUrl: internData.resumeUrl,
            duration: internData.duration,
            prevInternship: internData.prevInternship,


        });
        await newIntern.save();
        res.status(201).json({ message: "Intern created successfully", intern: newIntern });


    } catch (error) {
        console.log('error while creating intern', error);
        res.status(500).json({ message: "Server Error" });
    }
};

