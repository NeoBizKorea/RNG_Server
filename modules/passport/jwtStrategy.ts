import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../../config";
import * as auth from "../../models/users"; // JWT

export default new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: config.USERJWTSECRET,
		issuer: config.USERISSUER,
	},
	async function (payload: any, done: any) {
		if (payload && payload._id) {
			await auth
				.findByUserId({ id: payload._id })
				.then((isExist: any) => {
					if (isExist) done(null, payload);
					else done(null, false);
				})
				.catch((e) => done(e));
		} else done(null, false);
	}
);
