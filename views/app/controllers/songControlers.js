const SongModel = require("../models/song");
let { statusF, statusS, localhost, extensionAudio, extensionImage } = require("../validator/variableCommon");
let mongoose = require("mongoose");
let path = require("path");

let formidable = require("formidable")



class song {
    index(req, res, next) {
        let { _page, _limit, name, _id } = req.query;
        SongModel.find({}).limit(_limit * 1).skip((_page - 1) * _limit).select({})
            .exec((err, response) => {
                if (err || !response) {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `we have some error:${err}`
                    })
                } else {
                    if (name) {
                        let findName = response.filter(currenT => {

                            let nameTopic = currenT.title.toLowerCase();
                            let ParamsName = name.toLowerCase();

                            return nameTopic.indexOf(ParamsName) != -1;
                        })
                        return res.json({
                            status: statusS,
                            data: findName,
                            message: "get data successfully"
                        })
                    } else if (_id) {
                        let findId = response.find(currenT => currenT._id == _id);
                        return res.json({
                            status: statusS,
                            data: findId,
                            message: "get data successfully"
                        })
                    }
                    return res.json({
                        status: statusS,
                        data: response,
                        message: ``
                    })
                }

            })
    }
    createSong(req, res) {
        let form1 = formidable.IncomingForm();
        form1.uploadDir = path.join(__dirname, "../../public/uploads");
        form1.keepExtensions = true;
        form1.maxFieldsSize = 1 * 1024 * 1024;
        form1.multiples = true;
        form1.parse(req, (err, all_input, files) => {
            console.log(all_input);
            console.log(files)

            let { title, view, active, describe, id_Topic, id_Categories, id_album, day_release } = all_input;

            if (title && view != undefined && files["image"] && files["audio"] && active
                && describe && id_Topic && id_Categories && id_album && day_release
            ) {
                let condition = {
                    title
                }
                SongModel.find(condition).exec((error, response) => {
                    if (error) {
                        return res.json({
                            status: statusF,
                            data: [],
                            message: `We have some error:${error}`
                        })
                    }
                    if (response.length >= 1) {

                        return res.json({
                            status: statusF,
                            data: [],
                            message: `this song was have in database !`
                        })
                    } else {
                        const upload_files = files["image"];

                        let find_index_path = upload_files.path.indexOf("upload");
                        let cut_path = upload_files.path.slice(find_index_path);
                        //["/awdawd","png"]

                        const upload_audio = files["audio"];

                        let find_index_path_audio = upload_audio.path.indexOf("upload");
                        let cut_path_audio = upload_audio.path.slice(find_index_path_audio);

                        let getExtension = cut_path.split(".")[1];
                        let getExtension_audio = cut_path_audio.split(".")[1];
                        if (!getExtension || !getExtension_audio) {
                            return res.json({
                                status: statusF,
                                data: [],
                                message: `We don't allow file is blank !`
                            })
                        }
                        if (!extensionAudio.includes(getExtension_audio)) {
                            return res.json({
                                status: statusF,
                                data: [],
                                message: `We just allow file extension mp3,wav,flac,aac,m4a`
                            })
                        }
                        if (!extensionImage.includes(getExtension)) {
                            return res.json({
                                status: statusF,
                                data: [],
                                message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
                            })
                        }

                        let format_form = {
                            ...all_input,
                            image: localhost + cut_path,
                            audio: localhost + cut_path_audio,
                            id_Topic: mongoose.Types.ObjectId(id_Topic),
                            id_Categories: mongoose.Types.ObjectId(id_Categories),
                            id_album: mongoose.Types.ObjectId(id_album)
                        }
                        let create_Song = new SongModel(format_form);
                        create_Song.save((err, product1) => {
                            if (err) {
                                res.json({
                                    status: statusF,
                                    data: [],
                                    message: `We have few error: ${err}`
                                })
                            } else {
                                res.json({
                                    status: statusS,
                                    data: product1,
                                    message: "Add Product Successfully"
                                })

                            }
                        })
                    }
                })
            } else {
                res.json({
                    status: statusF,
                    data: [],
                    message: "We don't allow input is blank !"
                })

            }
        })
    }
    getOne(req, res) {
        let { idsong } = req.params;
        let condition = {
            _id: mongoose.Types.ObjectId(idsong),
        };
        SongModel.findById(condition).exec((error, response) => {
            if (error || !response) {
                return res.json({
                    status: statusF,
                    data: [],
                    message: `We have some error: ${error}`,
                });
            } else {
                res.json({
                    status: statusS,
                    data: [response],
                    message: `Get a play list successfully`,
                });
            }
        });
    }
    deleteSong(req, res) {
        const condition = {
            _id: mongoose.Types.ObjectId(req.params.idsong),
        };
        SongModel.findOneAndRemove(condition).exec((err) => {
            if (err) {
                return res.json({
                    status: statusF,
                    message: "Error: " + err,
                });
            } else {
                return res.json({
                    status: statusS,
                    message: "Delete successfully",
                });
            }
        });
    }
    editSong(req, res) {
        let form1 = new formidable.IncomingForm();
        form1.uploadDir = path.join(__dirname, "../../public/uploads");
        form1.keepExtensions = true;
        form1.maxFieldsSize = 1 * 1024 * 1024;
        form1.multiples = true;
        form1.parse(req, async (err, input_all, files) => {

            let { id_Topic, id_Categories, id_album } = input_all;
            let get_id = req.params.idsong;


            const condition = {
                _id: mongoose.Types.ObjectId(get_id)
            }
            var format_form = {
                ...input_all,
                id_album: mongoose.Types.ObjectId(id_album),
                id_Categories: mongoose.Types.ObjectId(id_Categories),
                id_Topic: mongoose.Types.ObjectId(id_Topic)
            }

            const upload_files = files["image"];

            let find_index_path = upload_files.path.indexOf("upload");
            let cut_path = upload_files.path.slice(find_index_path);

            const upload_audio = files["audio"];

            let find_index_path_audio = upload_audio.path.indexOf("upload");
            let cut_path_audio = upload_audio.path.slice(find_index_path_audio);

            let getExtension = cut_path.split(".")[1];
            let getExtension_audio = cut_path_audio.split(".")[1];

            if (getExtension_audio) {
                if (extensionAudio.includes(getExtension_audio)) {
                    format_form = {
                        ...format_form, audio: localhost + cut_path_audio
                    }
                } else {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We just allow file extension mp3,wav,flac,aac,m4a`
                    })
                }
            }
            if (getExtension) {
                if (extensionImage.includes(getExtension)) {
                    format_form = {
                        ...format_form, image: localhost + cut_path
                    }
                } else {
                    return res.json({
                        status: statusF,
                        data: [],
                        message: `We just allow audio extension jpg, jpeg, bmp,gif, png`
                    })
                }
            }
            SongModel.findOneAndUpdate(condition, { $set: format_form }, { new: true })
                .exec((err, new_product) => {
                    if (err) {
                        res.json({
                            status: statusF,
                            data: [],
                            message: `We have few error: ${err}`
                        })
                    } else {
                        res.json({
                            status: statusS,
                            data: [new_product],
                            message: `You were update successfully`
                        })

                    }
                })
        })
    }
}
module.exports = new song;