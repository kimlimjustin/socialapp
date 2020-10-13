import Axios from "axios";
import React, { useEffect, useState } from "react";
import {NavLink} from "react-router-dom";

const Post = (params) => {
    const [postInfo, setPostInfo] = useState(null);

    useEffect(()=> {
        Axios.get(`http://localhost:5000/posts/${params.match.params.id}`)
        .then(res => {
            setPostInfo(res.data);
        })
    }, [params.match.params.id])
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
            </div>
            :null}
        </div>
    )
}

export default Post;