var express = require("express");
var router = express.Router();
import * as controller from "./blogController";
import * as passport from "passport";

import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

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

router.get("/list-notice", controller.getNoticeList);
router.get("/list", controller.getList);
router.get("/info", controller.getDetail);

router.use("*", passport.authenticate("jwt"));

router.post("/create", controller.CreatePost);
router.post("/create-notice", controller.CreateNotice);
router.post("/update", controller.UpdatePost);
router.delete("/delete", controller.deletePost);

export default router;
