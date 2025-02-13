import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
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

// secured routes
router.route("/profile/:username").get(verifyJWT, profile);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/result").post(verifyJWT, result);

router.route("/imagekit-auth").get(verifyJWT, authImagekit);

export default router;
