import "dotenv/config";
import Regmodel from "../models/Register.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const registerData = async (req, res) => {
    try {
        const { name, email, pass } = req.body;

        if (!name || !email || !pass) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        const existingUser = await Regmodel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        const user = new Regmodel({
            name,
            email,
            pass: hashedPassword,
        });

        await user.save();

        return res.status(201).json({
            message: "User registered successfully",
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            error: "Server error",
        });
    }
};



export const login = async (req, res) => {
    try {
        const { email, pass } = req.body;

        const user = await Regmodel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(pass, user.pass);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: user.name
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await Regmodel.findById(req.user.id).select("-pass");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json(user);
    } catch (err) {
        console.error("Profile Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};
