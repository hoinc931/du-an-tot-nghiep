var express = require('express')

var router = express.Router()

const playlist_Controller = require("../app/controllers/playlistControllers");


router.post("/", playlist_Controller.createPlaylist);

router.get("/:idPlaylist", playlist_Controller.getOne);
router.get("/", playlist_Controller.index);
module.exports = router;