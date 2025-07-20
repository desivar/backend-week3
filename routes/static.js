const express = require('express');
const router = express.Router();
const path = require('path'); // Add this line to require the 'path' module

// Static Routes
// This single line correctly serves all static files from the 'public' directory
// It correctly calculates the path to 'public' relative to the project root.
router.use(express.static(path.join(__dirname, '..', 'public')));


// You can remove or comment out these lines as they are redundant and
// were causing incorrect pathing for your static assets.
// router.use("/css", express.static(__dirname + "public/css"));
// router.use("/js", express.static(__dirname + "public/js"));
// router.use("/images", express.static(__dirname + "public/images"));

module.exports = router;

















