import { createConnection } from "../modules/mariadb";
const USER = "USERS";
const COMMENT = "COMMENT";

const createTableSql =
	"CREATE TABLE IF NOT EXISTS " +
	"ciscryp." +
	COMMENT +
	"(" +
	"`ID` int(11) NOT NULL AUTO_INCREMENT, " +
	"`CONTENT` varchar(100) DEFAULT NULL, " +
	"`CREATED_AT` datetime DEFAULT NULL, " +
	"`BLOG_ID` int(11) NOT NULL, " +
	"`USER_ID` int(11) NOT NULL, " +
	"`UPDATED_AT` datetime DEFAULT NULL, " +
	"`CDEPTH` int(11) DEFAULT 1, " +
	"`CGROUP` int(11) DEFAULT NULL, " +
	"PRIMARY KEY (`ID`), " +
	"KEY `NewTable_FK` (`BLOG_ID`)," +
	"KEY `NewTable_FK_1` (`USER_ID`), " +
	"KEY `NewTable_FK_2` (`GROUP`), " +
	"CONSTRAINT `NewTable_FK` FOREIGN KEY (`BLOG_ID`) REFERENCES `BLOG` (`ID`), " +
	"CONSTRAINT `NewTable_FK_1` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`), " +
	"CONSTRAINT `NewTable_FK_2` FOREIGN KEY (`GROUP`) REFERENCES `COMMENT` (`ID`)" +
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
			return null;
		}
	}
};

export const CountComment = async (blogId: String) => {
	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT COUNT(*) AS COUNT FROM ciscryp." + COMMENT + " WHERE BLOG_ID = ?";
		const [rows] = await client.promise().query(sql, [blogId]);
		client.end();
		return rows[0].COUNT;
	} else {
		return null;
	}
};

export const CreateComment = async (params: any) => {
	const { blogId, userId, content, commentId } = params;

	const createdAt = new Date(new Date().setHours(new Date().getHours() + 9))
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");

	let param = [];
	await createTable();
	let sql = "";
	if (commentId) {
		param = [blogId, content, createdAt, userId, createdAt, 2, commentId];
		sql = `insert into ${COMMENT}(BLOG_ID, CONTENT, CREATED_AT, USER_ID, UPDATED_AT, CDEPTH, CGROUP)VALUES(?,?,?,?,?,?,?);`;
	} else {
		param = [blogId, content, createdAt, userId, createdAt, 1, null];
		sql = `insert into ${COMMENT}(BLOG_ID, CONTENT, CREATED_AT, USER_ID, UPDATED_AT, CDEPTH, CGROUP)VALUES(?,?,?,?,?,?,?);`;
	}

	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, param);
		client.end();
		return query[0];
	} else {
		return null;
	}
};

export const commentInfo = async (params: any) => {
	const { commentId } = params;

	const client: any = await createConnection();
	if (client) {
		const sql = "SELECT * FROM ciscryp." + COMMENT + " WHERE ID = ?;";
		const [rows] = await client.promise().query(sql, [commentId]);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};

export const findByUser = async (params: any) => {
	const { commentId, userId } = params;

	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT * FROM ciscryp." + COMMENT + " WHERE ID = ? AND USER_ID = ?;";
		const [rows] = await client.promise().query(sql, [commentId, userId]);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};

export const commentList = async (params: any) => {
	const { blogId, userId } = params;

	const client: any = await createConnection();
	if (client) {
		let sql = "";
		if (userId) {
			sql =
				"SELECT a.ID as id, a.CONTENT as content, a.CREATED_AT as createdAt, a.BLOG_ID as blogId, a.USER_ID as userId, a.UPDATED_AT as updatedAt, a.CDEPTH as cdepth, a.CGROUP as cgroup, b.USER_EMAIL as userEmail, b.USERNAME as userName, b.PROFILE_PHOTO as profilePhoto, case when a.USER_ID = " +
				userId +
				" then true else false end as editable FROM ciscryp." +
				COMMENT +
				" a " +
				` left join ${USER} b on b.ID = a.USER_ID ` +
				" WHERE BLOG_ID = ? AND CDEPTH = 1 ORDER BY a.CREATED_AT DESC;";
		} else {
			sql =
				"SELECT a.ID as id, a.CONTENT as content, a.CREATED_AT as createdAt, a.BLOG_ID as blogId, a.USER_ID as userId, a.UPDATED_AT as updatedAt, a.CDEPTH as cdepth, a.CGROUP as cgroup, b.USER_EMAIL as userEmail, b.USERNAME as userName, b.PROFILE_PHOTO as profilePhoto FROM ciscryp." +
				COMMENT +
				" a " +
				` left join ${USER} b on b.ID = a.USER_ID ` +
				" WHERE BLOG_ID = ? AND CDEPTH = 1 ORDER BY a.CREATED_AT DESC;";
		}

		const [rows] = await client.promise().query(sql, [blogId]);
		client.end();
		return rows;
	} else {
		return null;
	}
};

export const subCommentList = async (params: any) => {
	const { ids, userId } = params;

	const client: any = await createConnection();
	if (client) {
		let sql = "";
		if (userId) {
			sql =
				"SELECT a.ID as id, a.CONTENT as content, a.CREATED_AT as createdAt, a.BLOG_ID as blogId, a.USER_ID as userId, a.UPDATED_AT as updatedAt, a.CDEPTH as cdepth, a.CGROUP as cgroup, b.USER_EMAIL as userEmail, case when a.USER_ID = " +
				userId +
				" then true else false end as editable FROM ciscryp." +
				COMMENT +
				" a " +
				` left join ${USER} b on b.ID = a.USER_ID ` +
				" WHERE CGROUP IN(?) ORDER BY a.CREATED_AT ASC;";
		} else {
			sql =
				"SELECT a.ID as id, a.CONTENT as content, a.CREATED_AT as createdAt, a.BLOG_ID as blogId, a.USER_ID as userId, a.UPDATED_AT as updatedAt, a.CDEPTH as cdepth, a.CGROUP as cgroup, b.USER_EMAIL as userEmail FROM ciscryp." +
				COMMENT +
				" a " +
				` left join ${USER} b on b.ID = a.USER_ID ` +
				" WHERE CGROUP IN(?) ORDER BY a.CREATED_AT ASC;";
		}

		const [rows] = await client.promise().query(sql, [ids]);
		client.end();
		return rows;
	} else {
		return null;
	}
};

export const updateComment = async (params: any) => {
	const { commentId, content } = params;

	const client: any = await createConnection();
	if (client) {
		const sql = `update ${COMMENT} set CONTENT='${content}' WHERE ID = ${commentId}`;
		const [rows] = await client.promise().query(sql);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};

export const deleteComment = async (params: any) => {
	const { commentId } = params;

	const client: any = await createConnection();
	if (client) {
		let sql = `delete from ${COMMENT} where ID = ${commentId};`;
		const [rows] = await client.promise().query(sql);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};
