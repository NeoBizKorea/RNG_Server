const mysql = require("mysql2");

let connection: any;

export const createConnection = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!connection) {
				const connection = mysql.createConnection({
					host: process.env.RDS_HOSTNAME,
					user: process.env.RDS_USERNAME,
					password: process.env.RDS_PASSWORD,
					port: process.env.RDS_PORT,
					database: process.env.RDS_DATABASE,
				});
				resolve(connection);
			} else resolve(connection);
		} catch (e) {
			console.log(e);
		}
	});
};
