import * as jwt from "jsonwebtoken";
import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

import * as userDB from "../../models/users";
import * as blogDB from "../../models/blog";
import * as commentDB from "../../models/comment";
import * as likeDB from "../../models/like";
import * as crypto from "../../modules/crypto";
import config from "../../config";

import * as mysql from "../../modules/mariadb";

export const CountLike = async (req: any, res: any) => {
	const { blogId } = req.query;

	if (!blogId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const likeCount: number = await likeDB.CountLike(blogId);

		res.send(new SuccessMessage(likeCount));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const CreateLike = async (req: any, res: any) => {
	const userId = req.user._id;
	const { blogId } = req.body;

	if (!blogId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const like: any = await likeDB.isLikeBlog({ blogId, userId });

		if (like.COUNT > 0) {
			res
				.status(400)
				.send(new FailedMessage("2", "이미 좋아요를 누르셨습니다."));
			return;
		}

		const blog: any = await blogDB.GetDetail({ id: blogId });

		if (!blog) {
			res
				.status(400)
				.send(new FailedMessage("3", "해당 게시물을 찾을 수 없습니다."));
			return;
		}

		const response: any = await likeDB.CreateLike({
			blogId: blog.id,
			userId,
		});

		res.send(new SuccessMessage(response));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const cancelLike = async (req: any, res: any) => {
	//CreateUsers
	let userId = req.user?._id;
	const { blogId } = req.body;

	if (!blogId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const like: any = await likeDB.isLikeBlog({ blogId, userId });

		if (like.COUNT == 0) {
			res
				.status(400)
				.send(new FailedMessage("2", "좋아요를 누르지 않았습니다."));
			return;
		}

		const blog: any = await blogDB.GetDetail({ id: blogId });

		if (!blog) {
			res
				.status(400)
				.send(new FailedMessage("3", "해당 게시물을 찾을 수 없습니다."));
			return;
		}

		const comment: any = await likeDB.deleteLike({ blogId, userId });

		res.send(new SuccessMessage(comment));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};
