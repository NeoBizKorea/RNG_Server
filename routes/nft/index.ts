var express = require("express");
var router = express.Router();
import * as controller from "./nftController";
import * as passport from "passport";

import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

// router.use("*", async (req: any, res: any, next: any) => {
// 	if (req.headers.authorization) {
// 		passport.authenticate("jwt", {}, (err, user, info) => {
// 			req.user = user;
// 			next();
// 		})(req, res, next);
// 	} else {
// 		next();
// 	}
// });

router.use("*", passport.authenticate("jwt"));
router.post("/create", controller.CreateNft);

export default router;
