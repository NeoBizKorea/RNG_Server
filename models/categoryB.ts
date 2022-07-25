import { createConnection } from "../modules/mariadb";
const CATEGORY_B = "CATEGORY_B";

const createTableSql =
	"CREATE TABLE IF NOT EXISTS " +
	"ciscryp." +
	CATEGORY_B +
	"(" +
	"`ID` INT auto_increment NOT NULL PRIMARY KEY," +
	"`NAME` VARCHAR(100), " +
	"`CONTRACT_ID` VARCHAR(100)" +
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

export const getCategoryList = async () => {
	const client: any = await createConnection();
	if (client) {
		const sql =
			"SELECT ID as id, NAME as name, CONTRACT_ID as contractId FROM ciscryp." +
			CATEGORY_B +
			" ORDER BY ID DESC";
		const [rows] = await client.promise().query(sql);
		client.end();
		return rows;
	} else {
		return null;
	}
};
