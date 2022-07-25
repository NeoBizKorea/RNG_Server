import * as fs from "fs";

export const IsExistAsync = (path: any) => {
	return new Promise((resolve) => {
		fs.access(path, (err) => {
			if (err) resolve(false);
			else resolve(true);
		});
	});
};

export const WriteFileAsync = (path: any, file: any, type: any = "base64") => {
	return new Promise((resolve: any, reject) => {
		fs.writeFile(path, file, { encoding: type }, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

export const ReadFileAsync = (path: any) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
};

export const ReadDirAsync = (path: any) => {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (err, files) => {
			if (err) reject(err);
			else resolve(files);
		});
	});
};

export const CopyFileAsync = (path: any, destPath: any) => {
	return new Promise((resolve: any, reject) => {
		fs.copyFile(path, destPath, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

export const RenameAsync = (oldPath: any, newPath: any) => {
	return new Promise((resolve: any, reject: any) => {
		fs.rename(oldPath, newPath, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

export const UnlinkAsync = (path: any) => {
	return new Promise((resolve: any, reject: any) => {
		fs.unlink(path, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

export const RemoveDirAsync = (path: any) => {
	return new Promise((resolve: any, reject: any) => {
		fs.rmdir(path, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

export const LstatAsync = (path: any) => {
	return new Promise((resolve: any, reject: any) => {
		fs.lstat(path, (err, stats) => {
			if (err) reject(err);
			else resolve(stats);
		});
	});
};

export const GetFolderFileList = (path: any) => {
	return new Promise(async (resolve: any, reject: any) => {
		try {
			const arr = [];
			const files: any = await ReadDirAsync(path);

			for (let i = 0; i < files.length; i++) {
				const file = path + "/" + files[i];
				const lstat: any = await LstatAsync(file);
				if (lstat.isDirectory()) {
					const resArr: any = await GetFolderFileList(file);
					arr.push(...resArr);
				} else arr.push(file);
			}

			resolve(arr);
		} catch (e) {
			reject(e);
		}
	});
};

export const UnlinkFolderRecursive = (path: any) => {
	return new Promise(async (resolve: any, reject: any) => {
		try {
			const files: any = await ReadDirAsync(path);

			for (let i = 0; i < files.length; i++) {
				const file = path + "/" + files[i];
				const lstat: any = await LstatAsync(file);
				if (lstat.isDirectory()) {
					await UnlinkFolderRecursive(file);
				} else await UnlinkAsync(file);
			}
			await RemoveDirAsync(path);
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

export const UnlinkFolderRecursiveNoDir = (path: any) => {
	return new Promise(async (resolve: any, reject: any) => {
		try {
			const files: any = await ReadDirAsync(path);

			for (let i = 0; i < files.length; i++) {
				const file = path + "/" + files[i];
				const lstat: any = await LstatAsync(file);
				if (lstat.isDirectory()) {
					await UnlinkFolderRecursive(file);
				} else await UnlinkAsync(file);
			}
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};
