var express = require("express");
var router = express.Router();
import * as controller from "./fileController";
import * as passport from "passport";

import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

router.use("*", passport.authenticate("jwt"));
router.post("/upload", controller.uploadFile);

export default router;
