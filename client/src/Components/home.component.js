import React, { useEffect, useState } from "react";
import cookie from 'react-cookies';
import Axios from "axios";
import {NavLink} from "react-router-dom";
import moment from "moment";
import LikeIcon from "../Icons/like.png";
import HeartIcon from "../Icons/heart.png";

const token = cookie.load('token');
async function check_token(){
  var logged_in = false
  await Axios.get('http://localhost:5000/users')
  .then(res => {
      (res.data).forEach(i=> {
          if(i.token === token){
              logged_in = i
          }
      })
  })
  .catch(err => console.log(err));
  return logged_in
}

const Home = () => {
    const [userInfo, setUserInfo] = useState('');
    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [likeInfo, setLikeInfo] = useState({});
    const [totalLikes, setTotalLikes] = useState({});

    useEffect(() => {
        check_token().then(result => {
            if(!result) window.location = "/register";
            else setUserInfo(result);
        })
    }, [])

    useEffect(()=> {
        Axios.get("http://localhost:5000/follow/get", {params: {user: userInfo._id}})
        .then(res => {
            if(res.data.following){
                (res.data.following).forEach((following)=>{
                    Axios.get(`http://localhost:5000/posts/get/${following.following}?skip=${skip}`)
                    .then(res => {
                        (res.data).forEach(post => {
                            Axios.get('http://localhost:5000/users/')
                            .then(users => {
                                (users.data).forEach((user) => {
                                    if(user._id === post.user){
                                        post.creator = user.username;
                                        setPosts(posts => [...posts, post])  
                                    }
                                })
                            })
                        })
                    })
                })
            }
        })
    }, [userInfo, skip])
    
    useEffect(() => {
        const handleScroll = (e) => {
            if (window.pageYOffset + window.innerHeight >= window.document.body.offsetHeight - (40*(posts.length))) {
                setSkip(skip => skip + 1)
            }
        }
        window.addEventListener('scroll', handleScroll, {passive: true})
    }, [skip, posts])

    useEffect(() => {
        posts.forEach((post) => {
            Axios.get(`http://localhost:5000/likes/get/${post._id}/all`)
            .then(res => {
                setTotalLikes(n => ({...n, [post._id]: res.data.length}));
                (res.data).forEach((like) => {
                    if(like.liker === userInfo._id){
                        setLikeInfo(likes => ({
                            ...likes,
                            [post._id]: like._id
                        }))
                    }
                })
            })
        })
    }, [posts, userInfo])

    const LikePost = (id) => {
        if(!likeInfo[id]){
            if(userInfo){
                Axios.post('http://localhost:5000/likes/add', {liker: userInfo._id, post: id})
                .then(res => {
                    setLikeInfo(likes => ({
                        ...likes,
                        [id]: res.data.id
                    }))
                    setTotalLikes(n => ({
                        ...n,
                        [id]: n[id] + 1
                    }))
                })
            }
        }
    }

    const UnlikePost = (id) => {
        if(likeInfo[id]){
            Axios.delete(`http://localhost:5000/likes/remove/${likeInfo[id]}`)
            .then(() => {
                setLikeInfo(likes => ({
                    ...likes,
                    [id]: null
                }))
                setTotalLikes(n => ({
                    ...n,
                    [id]: n[id] - 1
                }))
            })
        }
    }
    
    const GeneratePost = ({post}) => {
        return <div key={post._id} className="box box-shadow margin-top-bottom">
            <NavLink to={`/post/${post._id}`}><img src = {`http://localhost:5000/${post.image.filename}`} alt = {post.description} className="box-image" /></NavLink>
            <div className="post-section">
                {!likeInfo[post._id]
                ?<span className="to-like-icon" onClick = {() => {LikePost(post._id)}}><img src={LikeIcon} alt="Like Icon" /></span>
                :<span className="to-like-icon" onClick = {() => {UnlikePost(post._id)}}><img src={HeartIcon} alt="Unlike Icon" /></span>}
                <p className="box-text">{totalLikes[post._id]} {totalLikes[post._id] <= 1? <span>Like</span>:<span>Likes</span>}</p>
            </div>
            <div className = "post-section">
                <p className = "box-text">{post.description}</p>
            </div>
            {post.tags.length > 0 && post.tags[0] !== ""
            ?<div className = "post-section">
                <p className="form-label">Tags:</p>
                {post.tags.map((tag) => (<span key={tag}><NavLink to={`/u/${tag.toLowerCase()}`} className="link">@{tag.toLowerCase()} </NavLink></span>))}
            </div>
            :null}
            {post.hashtags.length > 0 && post.hashtags[0] !== ""
            ?<div className="post-section">
                <p className="form-label">Hashtags:</p>
                {post.hashtags.map((hashtag) => (<span key={hashtag}>#{hashtag} </span>) )}
            </div>
            :null
            }
            <p className="box-text">Posted {moment(post.createdAt).fromNow()} by <NavLink to = {`/u/${post.creator}`} className= "link">{post.creator}</NavLink></p>
            {post.createdAt !== post.updatedAt ?
            <p className="box-text">Updated {moment(post.updatedAt).fromNow()}</p>
            : null}
        </div>
    }

    return(
        <div className="container home">
            {posts.map((post)=> {
                return <GeneratePost post = {post} key={post._id} />
            })}        
        </div>
    )
}

export default Home;