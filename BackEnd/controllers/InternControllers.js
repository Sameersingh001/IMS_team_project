import Intern from "../models/InternDatabase.js";

export const createIntern = async (req, res) => {
    try {
        const inernData = req.body;
        // console.log( "body data ",inernData.name,inernData.email,inernData.phone);
        // console.log("body data ", inernData);

        const intern = await Intern.findOne({ email: inernData.email });
        if (intern) {
            return res.status(400).json({ message: "Intern with this email already exists" });
        }
        const newIntern = new Intern({
            fullName: inernData.fullName,
            email: inernData.email,
            mobile: inernData.mobile,
            dob: inernData.dob,
            gender: inernData.gender,
            state:inernData.state ,
            city: inernData.city,
            address: inernData.address,
            pinCode: inernData.pinCode,
            college: inernData.college,
            course: inernData.course,
            educationLevel:inernData.educationLevel ,
            domain: inernData.domain,
            contactMethod: inernData.contactMethod,
            resumeUrl: inernData.resumeUrl,
            duration: inernData.duration,
            prevInternship:inernData.prevInternship , 


        });
        await newIntern.save();
        res.status(201).json({ message: "Intern created successfully", intern: newIntern });


    } catch (error) {
        console.log('error while creating intern', error);
        res.status(500).json({ message: "Server Error" });


    }
};

