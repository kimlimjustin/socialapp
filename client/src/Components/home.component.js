import React, { useEffect, useState } from "react";
import cookie from 'react-cookies';
import Axios from "axios";
import { NavLink } from "react-router-dom";
import moment from "moment";
import LikeIcon from "../Icons/like.png";
import HeartIcon from "../Icons/heart.png";
import CommentIcon from "../Icons/comment.png";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const token = cookie.load('token');
async function check_token() {
    var logged_in = false
    await Axios.get(`${BACKEND_URL}/users`)
        .then(res => {
            (res.data).forEach(i => {
                if (i.token === token) {
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
    const [newestUser, setNewestUser] = useState([]);
    const [taggedList, setTaggedList] = useState([]);
    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        check_token().then(result => {
            if (!result) window.location = "/register";
            else setUserInfo(result);
        })
    }, [])

    useEffect(() => {
        Axios.get(`${BACKEND_URL}/follow/get`, { params: { user: userInfo._id } })
            .then(res => {
                if (res.data.following) {
                    (res.data.following).forEach((following) => {
                        Axios.get(`${BACKEND_URL}/posts/get/${following.following}?skip=${skip}`)
                            .then(res => {
                                (res.data).forEach(post => {
                                    Axios.get(`${BACKEND_URL}/users`)
                                        .then(users => {
                                            (users.data).forEach((user) => {
                                                if (user._id === post.user) {
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
            if (window.pageYOffset + window.innerHeight >= window.document.body.offsetHeight - (40 * (posts.length))) {
                setSkip(skip => skip + 1)
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
    }, [skip, posts])

    useEffect(() => {
        posts.forEach((post) => {
            Axios.get(`${BACKEND_URL}/likes/get/${post._id}/all`)
                .then(res => {
                    setTotalLikes(n => ({ ...n, [post._id]: res.data.length }));
                    (res.data).forEach((like) => {
                        if (like.liker === userInfo._id) {
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
        if (!likeInfo[id]) {
            if (userInfo) {
                Axios.post(`${BACKEND_URL}/likes/add`, { liker: userInfo._id, post: id })
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
        if (likeInfo[id]) {
            Axios.delete(`${BACKEND_URL}/likes/remove/${likeInfo[id]}`)
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

    useEffect(() => {
        Axios.get(`${BACKEND_URL}/users/get_newest`)
            .then(res => {
                (res.data).forEach((user) => {
                    setNewestUser(existing => [...existing, user])
                })
            })
            .catch(err => console.log(err));
    }, [])

    useEffect(() => {
        if (userInfo) {
            Axios.get(`${BACKEND_URL}/posts/get/tagged/${userInfo.username}`)
                .then(res => {
                    (res.data).forEach((tag) => {
                        Axios.get(`${BACKEND_URL}/users`)
                            .then(users => {
                                (users.data).forEach((user) => {
                                    if (user._id === tag.user) {
                                        tag.username = user.username;
                                        setTaggedList(ex => [...ex, tag]);
                                    }
                                })
                            })
                    })
                })
        }
    }, [userInfo])

    useEffect(() => {
        if (userInfo) {
            Axios.get(`${BACKEND_URL}/chats/info/${userInfo._id}`)
                .then(res => {
                    res.data.forEach((chat) => {
                        Axios.get(`${BACKEND_URL}/users`)
                            .then(users => {
                                users.data.forEach((user) => {
                                    if (user._id === chat.from) { chat.username = user.username; setChatList(chats => [...chats, chat]); }
                                })
                            })
                    })
                });
        }
    }, [userInfo])

    const GeneratePost = ({ post }) => {
        return <div key={post._id} className="box box-shadow margin-top-bottom">
            <NavLink to={`/post/${post._id}`}><img src={`${BACKEND_URL}/${post.image.filename}`} alt={post.description} className="box-image" /></NavLink>
            <div className="post-section">
                {!likeInfo[post._id]
                    ? <span className="to-like-icon" onClick={() => { LikePost(post._id) }}><img src={LikeIcon} alt="Like Icon" /></span>
                    : <span className="to-like-icon" onClick={() => { UnlikePost(post._id) }}><img src={HeartIcon} alt="Unlike Icon" /></span>}
                <NavLink to={`/post/${post._id}/#comment`}><span className="share-icon"><img src={CommentIcon} alt="Comment Icon" /></span></NavLink>
                <p className="box-text">{totalLikes[post._id]} {totalLikes[post._id] <= 1 ? <span>Like</span> : <span>Likes</span>}</p>
            </div>
            <div className="post-section">
                <p className="box-text">{post.description}</p>
            </div>
            {post.tags.length > 0 && post.tags[0] !== ""
                ? <div className="post-section">
                    <p className="form-label">Tags:</p>
                    {post.tags.map((tag) => (<span key={tag}><NavLink to={`/u/${tag.toLowerCase()}`} className="link">@{tag.toLowerCase()} </NavLink></span>))}
                </div>
                : null}
            {post.hashtags.length > 0 && post.hashtags[0] !== ""
                ? <div className="post-section">
                    <p className="form-label">Hashtags:</p>
                    {post.hashtags.map((hashtag) => (<span key={hashtag}>#{hashtag} </span>))}
                </div>
                : null
            }
            <p className="box-text">Posted {moment(post.createdAt).fromNow()} by <NavLink to={`/u/${post.creator}`} className="link">{post.creator}</NavLink></p>
            {post.createdAt !== post.updatedAt ?
                <p className="box-text">Updated {moment(post.updatedAt).fromNow()}</p>
                : null}
        </div>
    }

    return (
        <div className="container">
            <div className="home">
                {posts.length !== 0 ? (
                    [posts.map((post) => {
                        return <GeneratePost post={post} key={post._id} />
                    })]
                )
                    : <h1>Loading...</h1>}
            </div>
            <div className="recommendation">
                <div className="margin box box-shadow">
                    <h3 className="box-title">You might like these users:</h3>
                    <ul>
                        {newestUser.map((user) => {
                            if (user.username !== userInfo.username) {
                                return <li key={user._id}><NavLink className="link" to={`/u/${user.username}`}>{user.username}</NavLink> (joined {moment(user.createdAt).fromNow()})</li>
                            } else { return null; }
                        })}
                    </ul>
                </div>
                <div className="margin box box-shadow">
                    <h3 className="box-title">Tags:</h3>
                    {taggedList.map((tag) => {
                        return <p key={tag._id}><NavLink className="link" to={`/u/${tag.username}`}>{tag.username}</NavLink> tagged you on a
                        &nbsp;<NavLink to={`/post/${tag._id}`} className="link">post</NavLink> {moment(tag.createdAt).fromNow()}</p>
                    })}
                </div>
                <div className="margin box box-shadow">
                    <h3 className="box-title">Messages:</h3>
                    {chatList.map((chat) => {
                        return <p key={chat.id}><NavLink to={`/chats?qto=${chat.username}`} className="link">{chat.username}</NavLink> Messaged you {moment(chat.at).fromNow()}.</p>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Home;