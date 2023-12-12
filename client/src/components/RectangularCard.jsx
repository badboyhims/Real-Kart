import React from 'react';
import {Link} from 'react-router-dom';

const RectangularCard = ({link,img,text}) => {
  return (
    <Link to={link} className="rectangularCard d-flex align-items-center justify-content-center">
        <img src={img} alt="" />
        <div className="font-md font1 subHeading colorText">{text}</div>
    </Link>
  )
}

export default RectangularCard