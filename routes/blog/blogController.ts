import * as jwt from "jsonwebtoken";
import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

import * as userDB from "../../models/users";
import * as blogDB from "../../models/blog";
import * as crypto from "../../modules/crypto";
import config from "../../config";

import * as mysql from "../../modules/mariadb";

function issueToken(_id: String) {
	return jwt.sign(
		{
			_id,
		},
		config.USERJWTSECRET,
		{
			issuer: config.USERISSUER,
			expiresIn: "1d",
		}
	);
}

export const CreatePost = async (req: any, res: any) => {
	const userId = req.user._id;
	let { title, content, description, fileLink, categoryId } = req.body;

	if (!title || !content || !categoryId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const userInfo: any = await userDB.findByUserId({ id: userId });
		if (userInfo === null) {
			res
				.status(404)
				.send(new FailedMessage("2", "해당 유저가 존재하지 않습니다."));
			return;
		}

		//TODO::: 카테고리 체크

		const response = await blogDB.CreatePost({
			title,
			content,
			description,
			userId,
			fileLink,
			categoryId,
		});

		res.send(new SuccessMessage(response.insertId));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const CreateNotice = async (req: any, res: any) => {
	const userId = req.user._id;
	let { title, content, description, fileLink } = req.body;

	if (!title || !content) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const userInfo: any = await userDB.findByUserId({ id: userId });
		if (userInfo === null) {
			res
				.status(404)
				.send(new FailedMessage("2", "해당 유저가 존재하지 않습니다."));
			return;
		}

		if (!userInfo.ADMIN) {
			res.status(400).send(new FailedMessage("3", "권한이 없습니다."));
			return;
		}

		const response = await blogDB.CreateNotice({
			title,
			content,
			description,
			userId,
			fileLink,
		});

		res.send(new SuccessMessage(response.insertId));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const UpdatePost = async (req: any, res: any) => {
	const userId = req.user._id;
	let { id, title, content, description } = req.body;

	if (!id || !title || !content) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const userInfo: any = await userDB.findByUserId({ id: userId });
		if (userInfo === null) {
			res
				.status(404)
				.send(new FailedMessage("2", "해당 유저가 존재하지 않습니다."));
			return;
		}

		const postCount = await blogDB.CountUserPost({ id, userId });
		if (postCount === null || postCount === 0) {
			res
				.status(404)
				.send(new FailedMessage("3", "해당 게시글이 존재하지 않습니다."));
			return;
		}

		const response = await blogDB.UpdatePost({
			id,
			title,
			content,
			description,
		});

		res.send(new SuccessMessage(response));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const getList = async (req: any, res: any) => {
	const userId = req.user?._id;
	let {
		isASC = false,
		isPopular = false,
		offset = 0,
		limit = 10,
		categoryId = null,
	} = req.query;

	if (isASC === null || isASC !== "true") isASC = false;

	try {
		const list: any = await blogDB.GetList({
			isASC,
			offset,
			limit,
			userId,
			isPopular,
			categoryId,
		});
		const total: number = await blogDB.GetCount({ categoryId });

		res.send(new SuccessMessage({ contents: list, total }));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const getNoticeList = async (req: any, res: any) => {
	const userId = req.user?._id;
	let { isASC = false, offset = 0, limit = 10 } = req.query;

	if (isASC === null || isASC !== "true") isASC = false;

	try {
		const list: any = await blogDB.GetNoticeList({
			isASC,
			offset,
			limit,
			userId,
		});
		const total: number = await blogDB.GetNoticeCount({});

		res.send(new SuccessMessage({ contents: list, total }));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const getDetail = async (req: any, res: any) => {
	const userId = req.user?._id;
	let { id } = req.query;

	if (id === null || id === "") {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다"));
		return;
	}

	try {
		const response: any = await blogDB.GetDetail({ id, userId });

		if (response) {
			await blogDB.UpdateView({ id });
			res.send(new SuccessMessage(response));
		} else {
			res
				.status(404)
				.send(new FailedMessage("2", "해당 게시글을 찾을 수 없습니다."));
		}
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const deletePost = async (req: any, res: any) => {
	const userId = req.user._id;
	let { id } = req.query;

	if (id === null || id === "") {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다"));
		return;
	}

	try {
		const poseCount = await blogDB.CountUserPost({ id, userId });
		if (poseCount === null || poseCount === 0) {
			res
				.status(404)
				.send(new FailedMessage("2", "해당 게시글이 존재하지 않습니다."));
			return;
		}

		await blogDB.DeletePost({ id });

		res.send(new SuccessMessage());
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};
