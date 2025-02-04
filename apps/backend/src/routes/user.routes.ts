import { Router } from "express";
// import registerUser from "src/controllers/register.controller";
import { loginUser } from "src/controllers/user.controller";
import checkUsername from "src/controllers/checkUsername.controller";

const router = Router();

router.route("/check-username").get(checkUsername); // GET /api/check-username?username=johndoe
// router.route("/register").post(registerUser)
router.route("/login").post(loginUser);

export default router;
