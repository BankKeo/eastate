import bcryptjs from "bcryptjs";
import userModel from "../models/user.js";
import errorHandler from "../utils/error.js";

const userController = {
  getUser: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);

      if (!user) return next(errorHandler(404, "User not found!"));

      const { password: pass, ...rest } = user._doc;

      return res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res) => {
    try {
      if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"));

      if (req.body.password) req.body.password = bcryptjs.hashSync(req.body.password, 10);

      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );

      const { password, ...rest } = updatedUser._doc;

      return res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account!"));

      await userModel.findByIdAndDelete(req.params.id);

      res.clearCookie("access_token");

      return res.status(200).json("User has been deleted!");
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
