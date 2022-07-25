import { createConnection } from "../modules/mariadb";
const BLOG = "BLOG";
const USER = "USERS";

const createTableSql =
	"CREATE TABLE IF NOT EXISTS " +
	"ciscryp." +
	BLOG +
	"(" +
	"`ID` int(11) NOT NULL AUTO_INCREMENT, " +
	"`USER_ID` int(11) NOT NULL, " +
	"`TITLE` varchar(100) DEFAULT NULL, " +
	"`DESCRIPTION` varchar(100) DEFAULT NULL, " +
	"`CONTENT` text, " +
	"`THUMBNAIL` varchar(100) DEFAULT NULL, " +
	"PRIMARY KEY (`ID`), " +
	"KEY `BLOG_FK` (`USER_ID`), " +
	"CONSTRAINT `BLOG_FK` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`ID`) " +
	") default character set utf8 collate utf8_general_ci;";

const createTable = async () => {
	const client: any = await createConnection();

	if (client) {
		const sql = createTableSql;
		if (client) {
			await client.promise().query(sql);
			client.end();
			return true;
		} else {
			client.end();
			return null;
		}
	}
};

export const CreatePost = async (params: any) => {
	const { userId, title, content, description, fileLink, categoryId } = params;

	const createdAt = new Date(new Date().setHours(new Date().getHours() + 9))
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");

	const param = [
		userId,
		title,
		content,
		description,
		createdAt,
		fileLink,
		categoryId,
	];

	await createTable();
	const sql = `insert into ${BLOG}(USER_ID, TITLE, CONTENT, DESCRIPTION, CREATED_AT, THUMBNAIL, CATEGORY_ID)VALUES(?,?,?,?,?,?,?);`;
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, param);
		client.end();
		return query[0];
	} else {
		client.end();
		return null;
	}
};

export const CreateNotice = async (params: any) => {
	const { userId, title, content, description, fileLink } = params;

	const createdAt = new Date(new Date().setHours(new Date().getHours() + 9))
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");

	const param = [userId, title, content, description, createdAt, "Y", fileLink];

	await createTable();
	const sql = `insert into ${BLOG}(USER_ID, TITLE, CONTENT, DESCRIPTION, CREATED_AT, NOTICE_YN, THUMBNAIL)VALUES(?,?,?,?,?,?,?);`;
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, param);
		client.end();
		return query[0];
	} else {
		client.end();
		return null;
	}
};

export const UpdatePost = async (params: any) => {
	const { id, title, content, description } = params;

	const createdAt = new Date(new Date().setHours(new Date().getHours() + 9))
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");

	const param = [title, content, description, createdAt];

	await createTable();
	const sql = `update ${BLOG} set TITLE='${title}', CONTENT='${content}', DESCRIPTION='${description}' where ID=${id};`;
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, param);
		client.end();
		return query[0];
	} else {
		client.end();
		return null;
	}
};

export const CountUserPost = async (params: any) => {
	const { id, userId } = params;

	const createdAt = new Date(new Date().setHours(new Date().getHours() + 9))
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");

	const param = [id, userId];

	await createTable();
	const sql =
		"SELECT COUNT(*) AS COUNT FROM ciscryp." +
		BLOG +
		" WHERE ID = ? AND USER_ID = ?;";
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, param);
		client.end();
		return query[0][0].COUNT;
	} else {
		client.end();
		return null;
	}
};

export const GetList = async (params: any) => {
	const {
		isASC = false,
		offset = 0,
		limit = 10,
		userId,
		isPopular,
		categoryId,
	} = params;

	await createTable();
	let sql = `select a.ID as id, a.USER_ID as userId, a.TITLE as title, a.DESCRIPTION as description, a.CREATED_AT as createdAt, b.USER_EMAIL as userEmail, b.PROFILE_PHOTO as profilePhoto, b.USERNAME as userName, a.THUMBNAIL as thumbnail, a.VIEWS as views, (SELECT COUNT(*) FROM LIKES where BLOG_ID = a.ID) AS likes from ${BLOG} a `;
	if (userId) {
		sql = `select a.ID as id, a.USER_ID as userId, a.TITLE as title, a.DESCRIPTION as description, a.CREATED_AT as createdAt, b.USER_EMAIL as userEmail, b.PROFILE_PHOTO as profilePhoto, b.USERNAME as userName, a.THUMBNAIL as thumbnail, a.VIEWS as views, (SELECT COUNT(*) FROM LIKES where BLOG_ID = a.ID) AS likes, case when a.USER_ID = ${userId} then true else false end as editable from ${BLOG} a `;
	}
	sql += `left join ${USER} b on a.USER_ID = b.ID `;
	if (categoryId) {
		sql += `where a.NOTICE_YN = 'N' AND a.CATEGORY_ID = ${categoryId} `;
	} else {
		sql += `where a.NOTICE_YN = 'N' `;
	}
	if (isPopular) {
		if (isASC === true) {
			sql += `order by likes ASC LIMIT ${limit} OFFSET ${offset};`;
		} else {
			sql += `order by likes DESC LIMIT ${limit} OFFSET ${offset};`;
		}
	} else {
		if (isASC === true) {
			sql += `order by a.CREATED_AT ASC LIMIT ${limit} OFFSET ${offset};`;
		} else {
			sql += `order by a.CREATED_AT DESC LIMIT ${limit} OFFSET ${offset};`;
		}
	}
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql);
		client.end();
		return query[0];
	} else {
		client.end();
		return null;
	}
};

export const GetNoticeList = async (params: any) => {
	const { isASC = false, offset = 0, limit = 10, userId } = params;

	await createTable();
	let sql = `select a.ID as id, a.USER_ID as userId, a.TITLE as title, a.DESCRIPTION as description, a.CREATED_AT as createdAt, b.USER_EMAIL as userEmail, b.USERNAME as userName, b.PROFILE_PHOTO as profilePhoto, a.THUMBNAIL as thumbnail, a.VIEWS as views, (SELECT COUNT(*) FROM LIKES where BLOG_ID = a.ID) AS likes from ${BLOG} a `;
	if (userId) {
		sql = `select a.ID as id, a.USER_ID as userId, a.TITLE as title, a.DESCRIPTION as description, a.CREATED_AT as createdAt, b.USER_EMAIL as userEmail, b.USERNAME as userName, b.PROFILE_PHOTO as profilePhoto, a.THUMBNAIL as thumbnail, a.VIEWS as views, (SELECT COUNT(*) FROM LIKES where BLOG_ID = a.ID) AS likes, case when a.USER_ID = ${userId} then true else false end as editable from ${BLOG} a `;
	}

	sql += `left join ${USER} b on a.USER_ID = b.ID `;
	sql += `where a.NOTICE_YN = 'Y' `;
	if (isASC === true) {
		sql += `order by a.CREATED_AT ASC LIMIT ${limit} OFFSET ${offset};`;
	} else {
		sql += `order by a.CREATED_AT DESC LIMIT ${limit} OFFSET ${offset};`;
	}
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql);
		client.end();
		return query[0];
	} else {
		client.end();
		return null;
	}
};

export const GetCount = async (params: any) => {
	const { categoryId } = params;
	await createTable();
	let sql = `select COUNT(*) as COUNT from ${BLOG} a `;
	if (categoryId) {
		sql += `where a.NOTICE_YN = 'N' AND a.CATEGORY_ID = ${categoryId};`;
	} else {
		sql += `where a.NOTICE_YN = 'N';`;
	}
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql);
		client.end();
		return query[0][0].COUNT;
	} else {
		client.end();
		return null;
	}
};

export const GetNoticeCount = async (params: any) => {
	await createTable();
	let sql = `select COUNT(*) as COUNT from ${BLOG} a where a.NOTICE_YN = 'Y';`;
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql);
		client.end();
		return query[0][0].COUNT;
	} else {
		client.end();
		return null;
	}
};

export const GetDetail = async (params: any) => {
	const { id, userId } = params;

	await createTable();
	let sql = "";
	if (userId) {
		sql = `select a.ID as id, a.USER_ID as userId, a.TITLE as title, a.DESCRIPTION as description, a.CONTENT as content, a.CREATED_AT as createdAt, b.USER_EMAIL as userEmail, b.PROFILE_PHOTO as profilePhoto, b.USERNAME as userName, a.VIEWS as views, a.THUMBNAIL as thumbnail, case when EXISTS(select * from LIKES c where a.ID = c.BLOG_ID and c.USER_ID = ${userId}) then true else false end as isLiked from ${BLOG} a `;
	} else {
		sql = `select a.ID as id, a.USER_ID as userId, a.TITLE as title, a.DESCRIPTION as description, a.CONTENT as content, a.CREATED_AT as createdAt, b.USER_EMAIL as userEmail, b.PROFILE_PHOTO as profilePhoto, b.USERNAME as userName, a.VIEWS as views, a.THUMBNAIL as thumbnail from ${BLOG} a `;
	}

	sql += `left join ${USER} b on a.USER_ID = b.ID `;
	sql += `where a.ID = ?;`;

	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, [id]);
		client.end();
		return query[0][0];
	} else {
		client.end();
		return null;
	}
};

export const UpdateView = async (params: any) => {
	const { id } = params;

	await createTable();
	let sql = `UPDATE ${BLOG} SET VIEWS = VIEWS + 1 where ID = ?;`;

	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, [id]);
		client.end();
		return query[0][0];
	} else {
		client.end();
		return null;
	}
};

export const DeletePost = async (params: any) => {
	const { id } = params;

	await createTable();
	let sql = `delete from ${BLOG} where ID = ?;`;
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, [id]);
		client.end();
		return query;
	} else {
		client.end();
		return null;
	}
};
