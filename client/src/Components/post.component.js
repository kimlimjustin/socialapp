import Axios from "axios";
import React, { useEffect, useState } from "react";
import {NavLink} from "react-router-dom";
import cookie from "react-cookies";
import moment from "moment";

const Post = (params) => {
    const [postInfo, setPostInfo] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(()=> {
        Axios.get(`http://localhost:5000/posts/${params.match.params.id}`)
        .then(res => {
            setPostInfo(res.data);
        })
    }, [params.match.params.id])

    
    useEffect(()=> {
        Axios.get("http://localhost:5000/users")
        .then(res => {
            const token = cookie.load('token');
            (res.data).forEach((i) => {
                if(i.token === token)if(postInfo)if(i._id === postInfo.user){setIsOwner(true); setUsername(i.username.toLowerCase())};
            })
        })
    }, [postInfo])

    const DeletePost = () => {
        if(window.confirm("Are you sure?")){
            const token = cookie.load('token');
            Axios.post(`http://localhost:5000/posts/delete/${params.match.params.id}`, {token})
            .then(()=> window.location = `/u/${username}`)
            .catch(err => console.log(err));
        }
    }
    return(
        <div className="container">
            {postInfo
            ?
            <div className="margin box box-shadow">
                <img src = {`http://localhost:5000/${postInfo.image.filename}`} className="box-image" alt={postInfo.description} />
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