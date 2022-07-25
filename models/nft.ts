import { createConnection } from "../modules/mariadb";
const USER = "USERS";
const COMMENT = "COMMENT";
const NFT = "NFT";

const createTableSql =
	"CREATE TABLE IF NOT EXISTS " +
	"ciscryp." +
	NFT +
	"(" +
	"`ID` int(11) NOT NULL AUTO_INCREMENT, " +
	"`TOKEN_ID` varchar(100) NOT NULL, " +
	"`USER_ID` int(11) NOT NULL, " +
	"`NFT_ADDRESS` varchar(200) DEFAULT NULL, " +
	"`CREATED_AT` datetime DEFAULT NULL, " +
	"KEY `NFT_FK` (`USER_ID`), " +
	"CONSTRAINT NFT_PK PRIMARY KEY (ID,TOKEN_ID) " +
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

export const Create = async (params: any) => {
	const { nftAddress, tokenId, userId } = params;

	const createdAt = new Date(new Date().setHours(new Date().getHours() + 9))
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");

	await createTable();

	const param = [nftAddress, tokenId, userId, createdAt];
	const sql = `insert into ${NFT} (NFT_ADDRESS, TOKEN_ID, USER_ID, CREATED_AT) VALUES (?,?,?,?);`;

	const client: any = await createConnection();
	if (client) {
		const query = await client.promise().query(sql, param);
		client.end();
		return query[0];
	} else {
		return null;
	}
};
