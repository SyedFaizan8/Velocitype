import { Router } from "express";
import { loginUser } from "../controllers/loginUser.controller";
import { checkUsername } from "../controllers/checkUsername.controller";
import { registerUser } from "../controllers/register.controller";
import verifyJWT from "../middlewares/auth.middleware";
import { logoutUser } from "../controllers/logoutUser.controller";
// import refreshAccessToken from "@/controllers/refreshAccessToken.controller";

const router = Router();

router.route("/check-username").get(checkUsername);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
// router.route("/refresh-token").post(refreshAccessToken);

export default router;
