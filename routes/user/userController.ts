import * as jwt from "jsonwebtoken";
import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

import * as userDB from "../../models/users";
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

export const UserNameCheck = async (req: any, res: any) => {
	//CreateUsers
	let { userName } = req.query;

	if (!userName) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		let userCount = await userDB.CountUserByUserName(userName);
		if (userCount > 0) {
			res.send(new SuccessMessage(true));
		} else {
			res.send(new SuccessMessage(false));
		}
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const Signup = async (req: any, res: any) => {
	//CreateUsers
	let { userEmail, password, userName } = req.body;

	if (!userEmail || !password) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		let userCount: number = await userDB.CountUser(userEmail);
		if (userCount > 0) {
			res.status(400).send(new FailedMessage("2", "동일한 유저가 존재합니다."));
			return;
		}

		userCount = await userDB.CountUserByUserName(userName);
		if (userCount > 0) {
			res.status(400).send(new FailedMessage("3", "닉네임이 중복됩니다."));
			return;
		}

		password = crypto.AES256Encrypt(password);

		const response = await userDB.CreateUser({ userEmail, password, userName });

		res.send(new SuccessMessage(response));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const Verify = async (req: any, res: any) => {
	let { userEmail, password } = req.body;

	if (!userEmail || !password) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		password = crypto.AES256Encrypt(password);
		const user: any = await userDB.VerifyUser({ userEmail, password });

		if (!user) {
			res.status(400).send(new FailedMessage("2", "유저를 찾을 수 없습니다."));
			return;
		}

		res.send(
			new SuccessMessage({ token: issueToken(user.ID), isAdmin: user.ADMIN })
		);
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const UpdateUser = async (req: any, res: any) => {
	const userId = req.user._id;
	const { userName, filePath, description } = req.body;

	if (!userName) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const user: any = await userDB.CountUserByUserNameExceptMe(
			userName,
			userId
		);

		if (user.length > 0) {
			res.status(400).send(new FailedMessage("2", "닉네임이 중복됩니다."));
			return;
		}

		await userDB.updateUser({ userName, filePath, description, id: userId });

		res.send(new SuccessMessage());
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};

export const JWTVerify = async (req: any, res: any) => {
	const userId = req.user._id;

	try {
		const user: any = await userDB.getUserInfoByUserId({ id: userId });

		if (!user) {
			res.status(400).send(new FailedMessage("1", "인증 오류."));
			return;
		}

		res.send(new SuccessMessage(user));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};
