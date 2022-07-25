import { createConnection } from "../modules/mariadb";
const USER = "USERS";
const COMMENT = "COMMENT";
const LIKE = "LIKES";

const createTableSql =
	"CREATE TABLE IF NOT EXISTS " +
	"ciscryp." +
	LIKE +
	"(" +
	"`ID` int(11) NOT NULL AUTO_INCREMENT, " +
	"`BLOG_ID` int(11) NOT NULL, " +
	"`USER_ID` int(11) NOT NULL, " +
	"`CREATED_AT` datetime DEFAULT NULL, " +
	"PRIMARY KEY (`ID`), " +
	"KEY `LIKE_FK` (`USER_ID`)," +
	"KEY `LIKE_FK_1` (`BLOG_ID`), " +
	"CONSTRAINT `LIKE_FK` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`), " +
	"CONSTRAINT `LIKE_FK_1` FOREIGN KEY (`BLOG_ID`) REFERENCES `BLOG` (`ID`)" +
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

export const CountLike = async (blogId: String) => {
	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT COUNT(*) AS COUNT FROM ciscryp." + LIKE + " WHERE BLOG_ID = ?";
		const [rows] = await client.promise().query(sql, [blogId]);
		client.end();
		return rows[0].COUNT;
	} else {
		return null;
	}
};

export const CreateLike = async (params: any) => {
	const { blogId, userId } = params;

	const createdAt = new Date(new Date().setHours(new Date().getHours() + 9))
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");

	await createTable();

	const param = [blogId, userId, createdAt];
	const sql = `insert into ${LIKE} (BLOG_ID, USER_ID, CREATED_AT) VALUES (?,?,?);`;

	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, param);
		client.end();
		return query[0];
	} else {
		return null;
	}
};

export const deleteLike = async (params: any) => {
	const { userId, blogId } = params;

	const client: any = await createConnection();
	if (client) {
		let sql = `delete from ${LIKE} where USER_ID = ? AND BLOG_ID = ?;`;
		const [rows] = await client.promise().query(sql, [userId, blogId]);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};

export const isLikeBlog = async (params: any) => {
	const { userId, blogId } = params;

	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT COUNT(*) AS COUNT FROM ciscryp." +
			LIKE +
			" WHERE BLOG_ID = ? AND USER_ID = ?";
		const [rows] = await client.promise().query(sql, [blogId, userId]);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};
