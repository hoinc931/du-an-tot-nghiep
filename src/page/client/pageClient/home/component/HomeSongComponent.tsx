import songApi from 'api/songApi';
import GetTimeAudio from 'page/client/common/GetTimeAudio';
import { handleLike, handleDownload, handleAddToPlaylist } from 'page/client/common/handle';
import React, { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineDownload } from 'react-icons/ai';
import { BsFillPlayFill } from 'react-icons/bs';
import { IoMdAdd } from 'react-icons/io';
import { useDispatch } from "react-redux";
import { getlistAudio, playSong } from "redux/audio/actionAudio"

interface HomeSongComponentIF<T> {
    userState: any,
}
const HomeSongComponent: React.FC<HomeSongComponentIF<any>> = (props) => {
    const { user } = props.userState;
    const [songs, setSongs] = useState([]);
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            dispatch(getlistAudio())
        })()
    }, [])

    useEffect(() => {
        const getSongs = async () => {
            const { data } = await songApi.getAll({ _limit: 20 });
            setSongs(data);
        }
        getSongs();
    }, []);

    const handleAdd = async <T extends string>(s: T, u: T, t: T) => {
        if(t === 'like'){
            let likeRes = await handleLike(s, u);
            if(likeRes && likeRes.status === "added"){
                console.log('okay, them roi nhe. (Added)');
            }else if(likeRes && likeRes.status === "deleted") {
                console.log('okay, them roi nhe. (Deleted)');
            } else{
                console.log('oops, khong them duoc roi. (Error)')
            }
        }
        
        if(t === "playlist"){
            //đang sai vì chưa lấy được playlist của user
            let playlistRes = await handleAddToPlaylist(s, u);
            if(playlistRes && playlistRes.status === "successfully"){
                console.log('okay, them roi nhe');
            }else if(playlistRes.status === "existed"){
                console.log("Bài hát này đã tồn tại trong play list này của bạn.")
            }else{
                console.log('oops, khong them duoc roi');
            }
        }
    }

    const playAudio = <T extends string>(_id: T): void => {
        dispatch(playSong({ _id }))
        // console.log(_id);
    }
    return (
        <div className="box-music">
            {songs.length !== 0 && songs.map((item: any) => (
                <div className="music_item" key={item._id} >
                    <img src={item.image} alt={item.name} />
                    <div className="box-icon">
                        <BsFillPlayFill onClick={() => playAudio(item._id)} />
                    </div>
                    <div>
                        <h6>{item.title}</h6>
                        <div style={{ fontSize: "0.7rem", marginTop: "-0.2rem" }}>{item.name_artist ? item.name_artist : "ten tac gia"}</div>
                    </div>
                    <div>
                        <GetTimeAudio url={item.audio} />
                    </div>
                    <div className="icon_item">
                        <AiOutlineDownload onClick={() => handleDownload(item._id)} className="icon" />
                        <AiFillHeart onClick={() => handleAdd(item._id, user._id, "like")} className="icon" />
                        <IoMdAdd className="icon" onClick={() => handleAdd(item._id, user._id, "playlist")} />
                    </div>
                </div>
            ))}

        </div>
    )
}

export default HomeSongComponent
