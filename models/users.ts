import { createConnection } from "../modules/mariadb";
const USER = "USERS";

const createTableSql =
	"CREATE TABLE IF NOT EXISTS " +
	"ciscryp." +
	USER +
	"(" +
	"`ID` INT auto_increment NOT NULL PRIMARY KEY," +
	"`USER_EMAIL` VARCHAR(100), " +
	"`PASSWORD` VARCHAR(100)," +
	"`USERNAME` VARCHAR(100)," +
	"`PROFILE_PHOTO` VARCHAR(200)," +
	"`DESCRIPTION` VARCHAR(300)," +
	"`CREATED_AT` DATETIME" +
	") default character set utf8 collate utf8_general_ci;";

const createTable = async () => {
	const client: any = await createConnection();

	if (client) {
		const sql = createTableSql;
		if (client) {
			await client.promise().query(sql);
			return true;
		} else {
			return null;
		}
	}
};

export const CountUser = async (userEmail: String) => {
	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT COUNT(*) AS COUNT FROM ciscryp." + USER + " WHERE USER_EMAIL = ?";
		const [rows] = await client.promise().query(sql, [userEmail]);
		client.end();
		return rows[0].COUNT;
	} else {
		return null;
	}
};

export const CountUserByUserName = async (userName: String) => {
	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT COUNT(*) AS COUNT FROM ciscryp." + USER + " WHERE USERNAME = ?";
		const [rows] = await client.promise().query(sql, [userName]);
		client.end();
		return rows[0].COUNT;
	} else {
		return null;
	}
};

export const CountUserByUserNameExceptMe = async (
	userName: String,
	userId: string
) => {
	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT COUNT(*) AS COUNT FROM ciscryp." +
			USER +
			" WHERE USERNAME = ? AND ID != ?";
		const [rows] = await client.promise().query(sql, [userName, userId]);
		client.end();
		return rows[0].COUNT;
	} else {
		return null;
	}
};

export const CreateUser = async (params: any) => {
	const { userEmail, password, userName } = params;

	const createdAt = new Date(new Date().setHours(new Date().getHours() + 9))
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");

	const param = [userEmail, password, createdAt, userName];

	await createTable();
	const sql = `insert into ${USER}(USER_EMAIL, PASSWORD, CREATED_AT, USERNAME)VALUES(?,?,?,?);`;
	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, param);
		client.end();
		return query[0];
	} else {
		return null;
	}
};

export const VerifyUser = async (params: any) => {
	const { userEmail, password } = params;

	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT * FROM ciscryp." +
			USER +
			" WHERE USER_EMAIL = ? AND PASSWORD = ?";
		const [rows] = await client.promise().query(sql, [userEmail, password]);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};

export const findByUserId = async (params: any) => {
	const { id } = params;

	const client: any = await createConnection();
	if (client) {
		const sql = "SELECT * FROM ciscryp." + USER + " WHERE ID = ?";
		const [rows] = await client.promise().query(sql, [id]);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};

export const getUserInfoByUserId = async (params: any) => {
	const { id } = params;

	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT USER_EMAIL as email, USERNAME as nickName, PROFILE_PHOTO as profilePhoto, DESCRIPTION as description FROM ciscryp." +
			USER +
			" WHERE ID = ?";
		const [rows] = await client.promise().query(sql, [id]);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};

export const updateUser = async (params: any) => {
	const { id, userName, filePath, description } = params;

	const client: any = await createConnection();
	if (client) {
		const sql = `update ${USER} set USERNAME='${userName}', PROFILE_PHOTO='${filePath}', DESCRIPTION='${description}' where ID=${id};`;
		const [rows] = await client.promise().query(sql, [id]);
		client.end();
		return rows[0];
	} else {
		return null;
	}
};
