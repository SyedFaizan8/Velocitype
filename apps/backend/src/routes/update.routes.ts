import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  updateFullname,
  updateUsername,
  updateEmail,
  updateBio,
  updatePassword,
  updateTwitter,
  updateInstagram,
  updateWebsite,
  updateDp,
  resetAccount,
  deleteAccount,
} from "../controllers/index";

const router = Router();

router.use(verifyJWT);

router.route("/user/fullname").post(updateFullname);
router.route("/user/username").post(updateUsername);
router.route("/user/email").post(updateEmail);
router.route("/user/bio").post(updateBio);
router.route("/user/password").post(updatePassword);
router.route("/user/twitter").post(updateTwitter);
router.route("/user/instagram").post(updateInstagram);
router.route("/user/website").post(updateWebsite);
router.route("/user/dp").post(updateDp); // fix this

router.route("/user/reset").post(resetAccount);
router.route("/user/delete").post(deleteAccount);

export default router;
