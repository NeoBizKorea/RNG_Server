var mkdirp = require("mkdirp");
var multer = require("multer");
// import * as fsAsync from "./fsAsync";
// import {
// 	SuccessMessage,
// 	FailedMessage,
// 	InternalErrorMessage,
// } from "./response";

export const BasePath = "/tmp";
export const FilePath = `${BasePath}/files`;

export const Uploadfile = (req: any, res: any, next: any) => {
	multer({
		storage: multer.diskStorage({
			destination: (req: any, file: any, cb: any) => {
				const path = `${FilePath}/${req.user._id}`;
				mkdirp(path, (err: any) => {
					if (err) cb(err, path);
					else cb(null, path);
				});
			},
			filename: (req: any, file: any, cb: any) => {
				cb(null, file.originalname);
			},
		}),
	}).array("file")(req, res, next);
};
