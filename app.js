var express = require("express");
var app = express();
var fs = require("fs");
var cors = require("cors");
var path = require("path");

app.use(cors);

// app.get("/", function (req, res) {
// 	res.sendFile(p__dirname + "./public/index.html");
// });

app.get("/video", (req, res) => {
	const range = req.headers.range;
	const videoPath = "GraphQL.mp4";
	const videoSize = fs.statSync(videoPath).size;

	const chunkSize = 210 ** 6 //prettier-ignore
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + chunkSize, videoSize - 1);

	const contentLength = end - start + 1;

	const headers = {
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};
	res.writeHead(206, headers);
	console.log(headers);

	const stream = fs.createReadStream(videoPath, { start, end });
	stream.pipe(res);
});

app.listen(3000, () => {
	console.log("App listening on port 3000");
});
