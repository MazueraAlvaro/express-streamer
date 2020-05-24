const https = require("http");
const path = require("path");
const express = require("express");

const indexRouter = require("./routes/index");
const streamerRouter = require("./routes/streamer");

const app = express();
const PORT = process.env.PORT || "10000";

const server = https.createServer(app);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", indexRouter);
app.use("/play", streamerRouter);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});

module.exports = server;
