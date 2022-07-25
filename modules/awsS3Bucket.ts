import * as AWS from "aws-sdk";
import * as fs from "fs";
import config from "../config";
AWS.config.region = config.AWS_REGION;
const Bucket = config.AWS_BUCKET;
var s3 = new AWS.S3({
	accessKeyId: config.AWS_ACCESS_KEY,
	secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
	region: config.AWS_REGION,
});

export const UploadLocalFile = (path: string, key: string, type: string) => {
	return new Promise(
		async (resolve: (data: any) => void, reject: (reason: any) => void) => {
			const body = fs.createReadStream(path);
			var param = {
				Bucket,
				Key: path.substring(1, path.length),
				ACL: "private",
				Body: body,
				// ContentType: type,
			};
			s3.upload(param, function (err: any, data: any) {
				if (err) reject(err);
				else resolve(data);
			});
		}
	);
};

export const ListFile = (path: string) => {
	return new Promise(
		(resolve: (data: any) => void, reject: (reason: any) => void) => {
			var params = {
				Bucket /* required */,
				Prefix: path, // Can be your folder name
			};
			s3.listObjects(params, function (err: any, data: any) {
				if (err) reject(err);
				// an error occurred
				else resolve(data); // successful response
			});
		}
	);
};

export const CopyFile = (sourcePath: string, destinationPath: string) => {
	return new Promise(
		(resolve: (data: any) => void, reject: (reason: any) => void) => {
			var params = {
				Bucket /* Another bucket working fine */,
				CopySource: Bucket + sourcePath /* required */,
				Key: destinationPath /* required */,
				ACL: "private",
			};
			s3.copyObject(params, function (err, data) {
				if (err) reject(err);
				// an error occurred
				else resolve(data); // successful response
			});
		}
	);
};

export const DeleteFile = (path: string) => {
	return new Promise(
		(resolve: (data: any) => void, reject: (reason: any) => void) => {
			var params = {
				Bucket /* Another bucket working fine */,
				Key: path /* required */,
				// ACL: "private",
			};
			s3.deleteObject(params, function (err, data) {
				if (err) reject(err);
				// an error occurred
				else resolve(data); // successful response
			});
		}
	);
};

// export const DeleteRecursive = (path: string) => {
// 	return new Promise(
// 		async (resolve: (data?: any) => void, reject: (reason: any) => void) => {
// 	var params:any
// 	params= {
// 	  Bucket,
// 	  Prefix: path
// 	};

// 	s3.listObjects(params, async (err, data) => {
// 	  if (err) return reject(err);

// 	  if (data.Contents.length == 0) resolve();

// 	  params = {Bucket};
// 	  params.Delete = {Objects:[]};

// 	  data.Contents.forEach(function(content) {
// 		params.Delete.Objects.push({Key: content.Key});
// 	  });

// 	  s3.deleteObjects(params, (err, data) => {
// 		if (err) return reject(err);
// 		if(data..length == 1000) emptyBucket(bucketName,callback);
// 		else callback();
// 	  });
// 	});
// })
//   }
