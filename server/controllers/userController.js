// signup new user 
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utilis.js";
import User from "../models/User.js";
//ESM model/module require .js extension
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const user = await User.findOne({ email });


        if (user) {
            return res.json({ success: false, message: "Account already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });


        const token = generateToken(newUser._id)
        res.json({ success: true, userData: newUser, token, message: "Account created successfully" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}







//controller to login a user 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Missing credentials" });
        }
        const userData = await User.findOne({ email })
        if (!userData) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });

        }

        const token = generateToken(userData._id)
        res.json({ success: true, userData, token, message: "Login successful" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })


    }
}



// controller to check if user is authincated 
// this function will return data when the user is authenticated
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user })

}






//controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;


        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName },
                { new: true });
        } else {
            console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
            console.log("API key:", process.env.CLOUDINARY_API_KEY);
            console.log("API secret:", process.env.CLOUDINARY_API_SECRET);

            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true });
        }
        res.json({ success: true, user: updatedUser })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}

