import { Router } from "express";
import authController from "../controllers/auth.js";

const router = Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);

const authRouter = router;

export default authRouter;
