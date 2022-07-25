var express = require("express");
var router = express.Router();
import * as controller from "./likeController";
import * as passport from "passport";

import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

router.get("/count", controller.CountLike);
router.use("*", passport.authenticate("jwt"));
router.post("/create", controller.CreateLike);
router.post("/delete", controller.cancelLike);

export default router;
