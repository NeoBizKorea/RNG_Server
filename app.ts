var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
const session = require("express-session");
var cors = require("cors");

var indexRouter = require("./routes/index");

import * as dotenv from "dotenv";
import "./declare";

dotenv.config();

var allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:3690",
	"http://13.124.90.215",
	"http://13.124.90.215:3000",
	"http://13.124.90.215:2008",
	"http://ec2-13-124-90-215.ap-northeast-2.compute.amazonaws.com",
	"http://ec2-13-124-90-215.ap-northeast-2.compute.amazonaws.com:2008",
	"http://ec2-13-124-90-215.ap-northeast-2.compute.amazonaws.com:3000",
	"http://localhost:3000/",
	"http://13.124.90.215/",
	"http://13.124.90.215:3000/",
	"http://localhost:3690/",
	"http://13.124.90.215:2008/",
	"http://ec2-13-124-90-215.ap-northeast-2.compute.amazonaws.com/",
	"http://ec2-13-124-90-215.ap-northeast-2.compute.amazonaws.com:2008/",
	"http://ec2-13-124-90-215.ap-northeast-2.compute.amazonaws.com:3000/",
];

var corsOptions = {
	origin: function (origin: any, callback: any) {
		var issafesitelisted = allowedOrigins.indexOf(origin) !== -1;
		callback(null, issafesitelisted);
	},
	credentials: true,
};

var port = normalizePort(process.env.PORT ? Number(process.env.PORT) : 2008);

var app = express();

console.log(`[Server Start! ${new Date().toISOString()}]`);
const passport = require("./modules/passport").default;

app.use(
	session({
		secret: "xr-gzodU6zwIy/F#rRn3", // 암호화
		resave: false,
		saveUninitialized: false,
	})
);

// view engine setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(passport.initialize());
app.use(cors());

app.use("/api", indexRouter);
app.get("*", (req: any, res: any) => {
	res.sendFile(path.join(__dirname, "public", "index.html"), {
		dotfiles: "allow",
	});
});

app.listen(port, () => {
	console.log(`app listening on port ${port}!`);
});

function normalizePort(val: any) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

module.exports = app;
