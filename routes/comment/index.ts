var express = require("express");
var router = express.Router();
import * as controller from "./commentController";
import * as passport from "passport";

import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

router.get("/count", controller.CountComment);
router.use("*", async (req: any, res: any, next: any) => {
	if (req.headers.authorization) {
		passport.authenticate("jwt", {}, (err, user, info) => {
			req.user = user;
			next();
		})(req, res, next);
	} else {
		next();
	}
});
router.get("/list", controller.commentList);
router.get("/info", controller.commentInfo);
router.use("*", passport.authenticate("jwt"));
router.post("/create", controller.CreateComment);
router.post("/create-sub", controller.CreateSubComment);
router.post("/update", controller.updateComment);
router.delete("/delete", controller.deleteComment);

export default router;
