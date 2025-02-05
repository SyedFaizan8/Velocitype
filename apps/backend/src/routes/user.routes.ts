import { Router } from "express";
import loginUser from "@/controllers/loginUser.controller";
import checkUsername from "src/controllers/checkUsername.controller";
import registerUser from "src/controllers/register.controller";
import checkEmail from "src/controllers/checkEmail.controller";
import verifyJWT from "@/middlewares/auth.middleware";
import logoutUser from "@/controllers/logoutUser.controller";
import refreshAccessToken from "@/controllers/refreshAccessToken.controller";

const router = Router();

router.route("/check-username").get(checkUsername); // GET /api/check-username?username=johndoe
router.route("/check-email").get(checkEmail); // GET /api/check-${field} //email?email=syejkd@gmail.com
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
