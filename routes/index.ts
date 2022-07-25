var express = require("express");
var router = express.Router();
import user from "./user";
import blog from "./blog";
import comment from "./comment";
import like from "./like";
import file from "./file";
import nft from "./nft";
import blogCategory from "./category_blog";

import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../modules/response";

router.use("/user", user);
router.use("/blog", blog);
router.use("/comment", comment);
router.use("/like", like);
router.use("/file", file);
router.use("/nft", nft);
router.use("/blogCategory", blogCategory);

module.exports = router;
