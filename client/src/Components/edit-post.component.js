import React, { useState, useEffect } from "react";
import Axios from 'axios';
import cookie from "react-cookies";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const token = cookie.load('token');
const CheckisOwner = async () => {
    let owner = false
    await Axios.get(`${BACKEND_URL}/users`)
        .then(users => {
            (users.data).forEach((user) => {
                if (user.token === token) owner = true
            })
        })
    return owner
}
const EditPost = (params) => {
    const [postInfo, setPostInfo] = useState(null);
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const [Hashtags, setHastags] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        Axios.get(`${BACKEND_URL}/posts/${params.match.params.id}`)
            .then(res => {
                setPostInfo(res.data);
                setDescription(res.data.description);
                setTags(res.data.tags.join(', '));
                setHastags(res.data.hashtags.join(', '));
                CheckisOwner().then(result => setIsOwner(result))
            })
    }, [params.match.params.id])

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

    const ChangeHashtags = (e) => {
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
        const hastagList = Hashtags.split(',');
        for (let i = 0; i < hastagList.length; i++) {
            if (String(hastagList[i])[0] === " ") { hastagList[i] = String(hastagList[i]).substring(1) }
        }

        const Post = {
            description,
            tags: tagList,
            hashtags: hastagList,
            token: token
        }
        Axios.post(`${BACKEND_URL}/posts/update/${params.match.params.id}`, Post)
            .then(() => window.location = `/post/${params.match.params.id}`)
            .catch(err => console.log(err))
    }

    return (
        <div className="container">
            {isOwner ?
                [(postInfo
                    ? <form className="margin box box-shadow" onSubmit={Submit} key={postInfo.description}>
                        <p className="form-error">{error}</p>
                        <div className="form-group">
                            <img src={`${BACKEND_URL}/${postInfo.image.filename}`} alt={postInfo.description} className="box-image" />
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
                            <p className="form-label">Hashtags:</p>
                            <textarea rows="5" className="form-control" placeholder="Format: Split using comma" value={Hashtags} onChange={ChangeHashtags}></textarea>
                        </div>
                        <div className="form-group">
                            <input className="form-control btn btn-dark" type="submit" />
                        </div>
                    </form>
                    : null)]
                : <h1 className="box-title">Loading...</h1>}
        </div>
    )

}

export default EditPost;