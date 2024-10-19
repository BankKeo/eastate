import { Router } from "express";
import userController from "../controllers/user.js";

const router = Router();

router.post("/user/:id", userController.getUser);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

const userRouter = router;

export default userRouter;
