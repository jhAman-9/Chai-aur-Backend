import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
import { varifyJWT } from "../middlewares/Auth.middleware.js";


const router = Router();

router.route("/register").post(
  upload.fields([               // middleware  - multer
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser)

//Secured Routes
router.route("/logout").post(varifyJWT, logoutUser);

// new refresh And Access Token
router.route("/refresh-token").post(refreshAccessToken)

export default router;
