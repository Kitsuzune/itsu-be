import User from "../models/UserModel.js";
import path from 'path';
import fs from 'fs';

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, firstName, lastName, email, address } = req.body;
        console.log(req.body);
        const newUser = await User.create({ username, firstName, lastName, email, address });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const editProfileDetail = async (req, res) => {
    try {
        const { firstName, lastName, email, address } = req.body;
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.address = address || user.address;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const editProfilePicture = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.file) {
            const filename = req.file.filename;

            if (user.profilePicture) {
                const oldPicturePath = path.join(path.resolve(), `uploads/profilePicture/${user.profilePicture}`);
                fs.unlink(oldPicturePath, (err) => {
                    if (err) console.error("Failed to delete old profile picture:", err);
                });
            }

            user.profilePicture = filename;
            await user.save();

            res.status(200).json({ 
                message: "Profile picture updated successfully", 
                user: {
                    ...user.toJSON(),
                    profilePicture: `${process.env.BASE_URL}/uploads/profilePicture/${filename}`
                }
            });
        } else {
            res.status(400).json({ message: "No file uploaded" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfileDetail = async (req, res) => { 
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfilePicture = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.profilePicture) {
            // const picturePath = path.join(path.resolve(), `uploads/profilePicture/${user.profilePicture}`);
            const picturePath = `${process.env.BASE_URL}/uploads/profilePicture/${user.profilePicture}`;
            res.status(200).json({ profilePicture: picturePath });
        } else {
            res.status(404).json({ message: "Profile picture not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};