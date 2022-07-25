var express = require("express");
var router = express.Router();
import * as controller from "./userController";
import * as passport from "passport";

import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

router.post("/check-nickname", controller.UserNameCheck);
router.post("/signup", controller.Signup);
router.post("/verify", controller.Verify);

router.use("*", passport.authenticate("jwt"));

router.get("/check-nickname", controller.UserNameCheck);
router.post("/update", controller.UpdateUser);

router.get("/jwt-verify", controller.JWTVerify);

export default router;
