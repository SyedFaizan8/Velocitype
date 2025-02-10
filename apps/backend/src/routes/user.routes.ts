import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  loginUser,
  checkUsername,
  checkEmail,
  registerUser,
  logoutUser,
  refreshAccessToken,
  result,
  profile,
  leaderboard,
  authImagekit,
} from "../controllers/index";

const router = Router();

router.route("/check-username").get(checkUsername);
router.route("/check-email").get(checkEmail);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/leaderboard").get(leaderboard);
router.route("/profile/:username").get(profile);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/result").post(verifyJWT, result); // add verifyJWT later

router.route("/imagekit-auth").get(authImagekit); // add verifyJWT later

export default router;
