import * as Express from "express";

declare module "express" {
	export interface Request {
		user?: any;
		session?: any;
		query?: any;
		files: any;
	}
	export interface Application {
		io?: any;
	}
}
