import userModel from "../models/user.js";
import errorHandler from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const authController = {
  signUp: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const user = await userModel.findOne({ email });

      if (user) return res.status(409).json({ message: "This user is exist" });

      const hashPassword = bcryptjs.hashSync(password, 10);

      const newUser = new userModel({ username, email, password: hashPassword });

      await newUser.save();

      return res.status(201).json("User created successfully");
    } catch (error) {
      next(error);
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const validUser = await userModel.findOne({ email });

      if (!validUser) return next(errorHandler(404, "User not found!"));

      const validPassword = bcryptjs.compareSync(password, validUser.password);

      if (!validPassword) return next(errorHandler(401, "Email or Password is incorrect"));

      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

      const { password: pass, ...rest } = validUser._doc;

      return res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
    } catch (error) {
      next(error);
    }
  },

  google: async (req, res, next) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });

      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;

        return res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
      } else {
        const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

        const hashPassword = bcryptjs.hashSync(generatePassword, 10);
        const newUser = new userModel({
          username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashPassword,
          avatar: req.bod.photo,
        });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;

        return res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
      }
    } catch (error) {
      next(error);
    }
  },
  signOut: async () => {
    try {
      res.clearCookie("access_token");
      res.status(200).json("User has been logged out!");
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
