import Axios from "axios";
import React, { useEffect, useState } from "react";
import {NavLink} from "react-router-dom";
import cookie from "react-cookies";
import moment from "moment";
import LikeIcon from "../Icons/like.png";
import HeartIcon from "../Icons/heart.png";

const token = cookie.load('token');
const check_logged_in = async () => {
    let is_logged_in = false
    if(token === null) is_logged_in = false;
    await Axios.get("http://localhost:5000/users")
    .then(res => {
        (res.data).forEach((i)=> {
            if(i.token === token) is_logged_in = i
        })
    })
    return is_logged_in
}

const Post = (params) => {
    const [postInfo, setPostInfo] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [username, setUsername] = useState('');
    const [userInfo, setUserInfo] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [totalLike, setTotalLike] = useState(0);

    useEffect(()=> {
        Axios.get(`http://localhost:5000/posts/${params.match.params.id}`)
        .then(res => {
            setPostInfo(res.data);
        })
    }, [params.match.params.id])

    useEffect(() => {
        check_logged_in().then(result => setUserInfo(result))
    }, [])

    useEffect(() => {
        if(postInfo) document.title = `${postInfo.description} by @${username}`
    }, [postInfo, username])
    
    useEffect(()=> {
        Axios.get("http://localhost:5000/users")
        .then(res => {
            const token = cookie.load('token');
            (res.data).forEach((i) => {
                if(i.token === token)if(postInfo)if(i._id === postInfo.user)setIsOwner(true);
                if(postInfo) if(i._id === postInfo.user)  setUsername(i.username.toLowerCase());
            })
        })
    }, [postInfo])

    useEffect(() => {
        if(userInfo && postInfo){
            Axios.get(`http://localhost:5000/likes/get/${postInfo._id}/all`)
            .then(res => {
                (res.data).forEach((like) => {
                    if(like.liker === userInfo._id) setIsLiked(like._id);
                })
                setTotalLike(res.data.length)
            })
        }
    }, [userInfo, postInfo])

    const DeletePost = () => {
        if(window.confirm("Are you sure?")){
            const token = cookie.load('token');
            Axios.post(`http://localhost:5000/posts/delete/${params.match.params.id}`, {token})
            .then(()=> window.location = `/u/${username}`)
            .catch(err => console.log(err));
        }
    }

    const LikePost = () => {
        if(isLiked === false){
            if(postInfo && userInfo){
                Axios.post('http://localhost:5000/likes/add', {liker: userInfo._id, post: postInfo._id})
                .then(res => {
                    setIsLiked(res.data.id);
                    setTotalLike(like => like + 1);
                })
                .catch(err => console.log(err));
            }
        }
    }

    const UnlikePost = () => {
        if(isLiked !== false){
            Axios.delete(`http://localhost:5000/likes/remove/${isLiked}`)
            .then(() => {
                setIsLiked(false);
                setTotalLike(like => like - 1);
            })
            .catch(err => console.log(err));
        }
    }
    return(
        <div className="container">
            {postInfo
            ?
            <div className="margin box box-shadow">
                <img src = {`http://localhost:5000/${postInfo.image.filename}`} className="box-image" alt={postInfo.description} />
                {userInfo !== false && userInfo !== null
                ?<div className="post-section">
                    {isLiked === false
                    ?<span className="to-like-icon" onClick = {() => {LikePost()}}><img src={LikeIcon} alt="Like Icon" /></span>
                    :<span className="to-like-icon" onClick = {() => {UnlikePost()}}><img src={HeartIcon} alt="Unlike Icon" /></span>}
                    <p className="box-text">{totalLike} {totalLike <= 1? <span>Like</span>: <span>Likes</span>}</p>
                </div>
                :null}
                <div className="post-section">
                    <p className="box-text">{postInfo.description}</p>
                </div>
                {postInfo.tags.length > 0 && postInfo.tags[0] !== ""
                ?<div className = "post-section">
                    <p className="form-label">Tags:</p>
                    {postInfo.tags.map((tag) => (<span key={tag}><NavLink to={`/u/${tag.toLowerCase()}`} className="link">@{tag.toLowerCase()} </NavLink></span>))}
                </div>
                :null}
                {postInfo.hashtags.length > 0 && postInfo.hashtags[0] !== ""
                ?<div className="post-section">
                    <p className="form-label">Hashtags:</p>
                    {postInfo.hashtags.map((hashtag) => (<span key={hashtag}>#{hashtag} </span>) )}
                </div>
                :null
                }
                <p className="box-text">Posted {moment(postInfo.createdAt).fromNow()} by <NavLink className="link" to={`/u/${username}`}>{username}</NavLink></p>
                {postInfo.createdAt !== postInfo.updatedAt ?
                <p className="box-text">Updated {moment(postInfo.updatedAt).fromNow()}</p>
                : null}
                {isOwner ?
                <div>
                    <h3><NavLink to={`/post/${params.match.params.id}/edit`} className="link">Edit Post</NavLink></h3>
                    <h3 className="link text-danger" onClick={DeletePost}>Delete Post</h3>
                </div>
                :null
                }
            </div>
            :null}
        </div>
    )
}

export default Post;