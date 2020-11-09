import React, { useEffect, useState } from "react";
import cookie from "react-cookies";
import Axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const token = cookie.load('token');
const logged_in = async () => {
    let is_logged_in = false
    if (token === null) is_logged_in = false;
    await Axios.get(`${BACKEND_URL}/users`)
        .then(res => {
            (res.data).forEach((i) => {
                if (i.token === token) is_logged_in = i
            })
        })
    return is_logged_in
}

const CreatePost = () => {
    const [userInfo, setUserInfo] = useState(false);
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [hashtags, setHastags] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        logged_in().then(result => {
            if (!result) window.location = "/";
            else setUserInfo(result);
        })
    }, [])

    const Validate = (e) => {
        var list = e.split(',');
        var valid = true;
        for (let i = 0; i < list.length; i++) {
            if (String(list[i]).length === 0 || list[i] === ' ') {
                valid = false;
            }
        }
        return valid;
    }

    const ChangeTags = (e) => {
        const inputTags = e.target.value;
        setTags(inputTags);
        if (Validate(inputTags)) setError('');
        else setError("Please input according to format.")
    }

    const ChangeHastags = (e) => {
        const inputHastags = e.target.value;
        setHastags(inputHastags);
        if (Validate(inputHastags)) setError('');
        else setError("Please input according to format.");
    }

    const Submit = (e) => {
        e.preventDefault();
        const tagList = tags.split(',');
        for (let i = 0; i < tagList.length; i++) {
            if (String(tagList[i])[0] === " ") { tagList[i] = String(tagList[i]).substring(1) }
        }
        const hastagList = hashtags.split(',');
        for (let i = 0; i < hastagList.length; i++) {
            if (String(hastagList[i])[0] === " ") { hastagList[i] = String(hastagList[i]).substring(1) }
        }
        const Post = new FormData();
        Post.append('image', image);
        Post.append('user', userInfo._id);
        Post.append('token', userInfo.token);
        Post.append("description", description);
        Post.append("hashtags", hastagList);
        Post.append("tags", tagList);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        };
        Axios.post(`${BACKEND_URL}/posts/create`, Post, config)
            .then(res => window.location = res.data.id)
            .catch(err => console.log(err))
    }
    return (
        <div className="container">
            <form className="margin box box-shadow bg-light text-dark" onSubmit={Submit}>
                <h4 className="form-error">{error}</h4>
                <div className="form-group">
                    <p className="form-label">Image:</p>
                    {image !== '' ? <img src={URL.createObjectURL(image)} className="box-image" alt="Post property" /> : null}
                    <input className="form-control" type="file" onChange={({ target: { files } }) => files[0] ? setImage(files[0]) : ''} />
                </div>
                <div className="form-group">
                    <p className="form-label">Description:</p>
                    <textarea rows="10" className="form-control" maxLength="5000" value={description} onChange={({ target: { value } }) => setDescription(value)} required></textarea>
                </div>
                <div className="form-group">
                    <p className="form-label">Tags:</p>
                    <textarea rows="5" className="form-control" placeholder="Format: Split using comma" value={tags} onChange={ChangeTags}></textarea>
                </div>
                <div className="form-group">
                    <p className="form-label">Hastags:</p>
                    <textarea rows="5" className="form-control" placeholder="Format: Split using comma" value={hashtags} onChange={ChangeHastags}></textarea>
                </div>
                <div className="form-group">
                    <input type="submit" className="btn btn-dark form-control" />
                </div>
            </form>
        </div>
    )
}
export default CreatePost;