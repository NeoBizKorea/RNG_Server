var express = require("express");
var router = express.Router();
import * as controller from "./blogCategoryController";

import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

router.get("/list", controller.CategoryList);

export default router;
