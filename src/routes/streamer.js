const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/:filename", (req, res) => {
    const { filename } = req.params;
    // const pathFile = path.join(__dirname, "sample.mp4");
    const pathFile = path.join(__dirname, "..", "..", "files", filename);

    //Get File size
    const { size: fileSize } = fs.statSync(pathFile);
    //Get requested range
    const {
        headers: { range },
    } = req;

    if (range) {
        //Get start an end range
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        //Validate the start in filesize
        if (start >= fileSize) {
            res.status(416).send("Requested range not satisfiable\n" + start + " >= " + fileSize);
            return;
        }

        //Get file range
        const file = fs.createReadStream(pathFile, { start, end });

        //Write Headers
        const chunksize = end - start + 1;
        const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/ogv",
        };
        res.writeHead(206, head);

        file.pipe(res);
    } else {
        //Offer entire video.
        const head = {
            "Content-Length": fileSize,
            "Content-Type": "video/ogv",
        };
        res.writeHead(200, head);
        fs.createReadStream(pathFile).pipe(res);
    }
});

module.exports = router;
