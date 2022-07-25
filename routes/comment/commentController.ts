import * as jwt from "jsonwebtoken";
import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

import * as userDB from "../../models/users";
import * as blogDB from "../../models/blog";
import * as commentDB from "../../models/comment";
import * as crypto from "../../modules/crypto";
import config from "../../config";

import * as mysql from "../../modules/mariadb";

export const CountComment = async (req: any, res: any) => {
	//CreateUsers
	const { blogId } = req.query;

	if (!blogId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const commentCount: number = await commentDB.CountComment(blogId);

		res.send(new SuccessMessage(commentCount));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const CreateComment = async (req: any, res: any) => {
	const userId = req.user._id;
	const { blogId, content } = req.body;

	if (!blogId || !content) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const blog: any = await blogDB.GetDetail({ id: blogId });

		if (!blog) {
			res
				.status(400)
				.send(new FailedMessage("2", "게시글을 찾을 수 없습니다."));
			return;
		}

		const response: any = await commentDB.CreateComment({
			blogId: blog.id,
			userId,
			content,
		});

		res.send(new SuccessMessage(response));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const CreateSubComment = async (req: any, res: any) => {
	const userId = req.user._id;
	const { blogId, content, commentId } = req.body;

	if (!blogId || !content) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const blog: any = await blogDB.GetDetail({ id: blogId });

		if (!blog) {
			res
				.status(400)
				.send(new FailedMessage("2", "게시글을 찾을 수 없습니다."));
			return;
		}

		const response: any = await commentDB.CreateComment({
			blogId: blog.id,
			userId,
			content,
			commentId,
		});

		res.send(new SuccessMessage(response));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const commentList = async (req: any, res: any) => {
	//CreateUsers
	let userId = req.user?._id;
	const { blogId } = req.query;

	if (!blogId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const comments: any = await commentDB.commentList({ blogId, userId });

		const ids = comments.map((item: any) => item.id);
		let subComments: any = [];
		if (ids.length > 0) {
			subComments = await commentDB.subCommentList({ ids, userId });
		}
		res.send(new SuccessMessage({ comments, subComments }));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const commentInfo = async (req: any, res: any) => {
	//CreateUsers
	const { commentId } = req.query;

	if (!commentId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const comment: any = await commentDB.commentInfo({ commentId });

		res.send(new SuccessMessage(comment));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const updateComment = async (req: any, res: any) => {
	//CreateUsers
	const userId = req.user._id;
	const { commentId, content } = req.body;

	if (!commentId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const comment: any = await commentDB.findByUser({ commentId, userId });

		if (!comment) {
			res.status(400).send(new FailedMessage("2", "댓글을 찾을 수 없습니다."));
			return;
		}

		const response: any = await commentDB.updateComment({ commentId, content });

		res.send(new SuccessMessage(response));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const deleteComment = async (req: any, res: any) => {
	//CreateUsers
	const userId = req.user._id;
	const { commentId } = req.query;

	if (!commentId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const comment: any = await commentDB.findByUser({ commentId, userId });

		if (!comment) {
			res.status(400).send(new FailedMessage("2", "댓글을 찾을 수 없습니다."));
			return;
		}

		const response: any = await commentDB.deleteComment({ commentId });

		res.send(new SuccessMessage(response));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};
