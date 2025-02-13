import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getUser,
  updateFullname,
  updateUsername,
  updateEmail,
  updateBio,
  updatePassword,
  updateDp,
  resetAccount,
  deleteAccount,
  getProfile,
  updateSocials,
} from "../controllers/index";

const router = Router();

router.use(verifyJWT);

router.route("/me").get(getUser);

router.route("/profile/:username").get(getProfile);

router.route("/fullname").post(updateFullname);
router.route("/username").post(updateUsername);
router.route("/email").post(updateEmail);
router.route("/bio").post(updateBio);
router.route("/password").post(updatePassword);
router.route("/socials").post(updateSocials);
router.route("/dp").post(updateDp);

router.route("/reset").post(resetAccount);
router.route("/delete").post(deleteAccount);

export default router;
