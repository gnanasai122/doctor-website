const bcrypt = require("bcryptjs");
const { userRepository } = require("../store/repository");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }

    if (role && !["patient", "doctor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "patient",
    });

    return res.status(201).json({
      message: "Registration successful.",
      user: sanitizeUser(user),
      token: generateToken(user),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({
      message: "Login successful.",
      user: sanitizeUser(user),
      token: generateToken(user),
    });
  } catch (error) {
    return next(error);
  }
};

const listDoctors = async (req, res, next) => {
  try {
    const doctors = await userRepository.findDoctors();
    return res.status(200).json({ doctors });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  listDoctors,
};

