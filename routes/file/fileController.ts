import * as jwt from "jsonwebtoken";
import {
	SuccessMessage,
	FailedMessage,
	InternalErrorMessage,
} from "../../modules/response";

import * as commentDB from "../../models/comment";
import * as fsAsync from "../../modules/fsAsync";
import * as s3 from "../../modules/awsS3Bucket";
import * as Multer from "../../modules/multer";
import config from "../../config";

import * as mysql from "../../modules/mariadb";

export const uploadFile = async (req: any, res: any) => {
	Multer.Uploadfile(req, res, async (e: any) => {
		if (e) {
			console.log(e);
			return res.status(500).send(new InternalErrorMessage());
		} else {
			var fileLocation = "";
			if (req.files && req.files.length) {
				const file = req.files[0];
				const result = await s3.UploadLocalFile(
					file.destination + "/" + file.originalname,
					file.originalname,
					file.mimetype
				);
				fileLocation = result.Location;
				await fsAsync.UnlinkFolderRecursive(file.destination);
			} else {
				return res
					.status(400)
					.send(new FailedMessage("ERR_INVALID_FIELD", "파일이 없습니다."));
			}

			try {
				res.send(new SuccessMessage({ fileLink: fileLocation }));
			} catch (e) {
				console.log(e);
				res.status(500).send(new InternalErrorMessage());
			}
		}
	});
};
