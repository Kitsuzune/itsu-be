const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../models/AuthModel.js");
const User = require("../models/UserModel.js");
const Admin = require("../models/AdminModel.js");
const { Op } = require("sequelize");

const register = async (req, res) => {
    try {
        const { username, firstName, lastName, email, address, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(req.body);

        const newUser = await User.create({ username, firstName, lastName, email, address });
        await Auth.create({ userId: newUser.id, password: hashedPassword });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ 
            message: "User registered successfully",
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                address: newUser.address,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: username }, { username: username }]
            }
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const auth = await Auth.findOne({ where: { userId: user.id } });
        const isMatch = await bcrypt.compare(password, auth.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const admin = await Admin.findOne({ where: { userId: user.id } });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        let adminToken = null;
        if (admin) {
            adminToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        }
        res.status(200).json({ 
            message: "User logged in successfully",
            token,
            adminToken,
            user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                address: user.address,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;

        const auth = await Auth.findOne({ where: { userId } });
        const isMatch = await bcrypt.compare(oldPassword, auth.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        auth.password = hashedPassword;
        await auth.save();

        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    register,
    login,
    changePassword
};