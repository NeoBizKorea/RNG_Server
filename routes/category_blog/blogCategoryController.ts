import * as jwt from "jsonwebtoken";
import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

import * as userDB from "../../models/users";
import * as blogCategoryDB from "../../models/categoryB";
import config from "../../config";

import * as mysql from "../../modules/mariadb";

export const CategoryList = async (req: any, res: any) => {
	try {
		const categoryList: any = await blogCategoryDB.getCategoryList();

		res.send(new SuccessMessage({ categoryList }));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};
