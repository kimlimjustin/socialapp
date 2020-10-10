import React from "react";
import { Link } from "react-router-dom";

const FourZeroFour = () => {
    return(
        <div>
            <h1 className="box-title">Sorry, this page is unavailable, please<Link to="/" className="link"> go back</Link></h1>
        </div>
    )
}

export default FourZeroFour;