import * as jwt from "jsonwebtoken";
import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

import * as userDB from "../../models/users";
import * as nftDB from "../../models/nft";
import config from "../../config";

import * as mysql from "../../modules/mariadb";

export const CreateNft = async (req: any, res: any) => {
	const userId = req.user._id;
	let { nftAddress, tokenId } = req.body;

	if (!nftAddress || !tokenId) {
		res.status(400).send(new FailedMessage("1", "필드값이 없습니다."));
		return;
	}

	try {
		const response = await nftDB.Create({
			nftAddress,
			tokenId,
			userId,
		});

		res.send(new SuccessMessage(response.insertId));
	} catch (e) {
		console.log(e);
		res.status(500).send(new FailedMessage("-1", "서버오류입니다."));
	}
};
