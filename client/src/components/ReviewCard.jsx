import React from 'react'

import {AiFillStar} from 'react-icons/ai'
import {BsPersonFill} from 'react-icons/bs'

const ReviewCard = ({name,rating,comment}) => {
  return (
    <div>
        <div className="d-flex my-3">
            <div className="profilePicture">
                <BsPersonFill />
            </div>
            <div className="d-flex flex-column">
                <div className=" d-flex my-1 w-100">
                    <div className="ratingButton bgColor d-flex align-items-center justify-content-center">
                        <div>{rating}</div>
                        <AiFillStar />
                    </div>
                    <div className="font1 ps-2" style={{borderLeft:'1px solid gray'}}>{name}</div>
                </div>
                <div className="font-sm comment w-100">{comment}</div>
            </div>
        </div>
        <hr />
    </div>
  )
}

export default ReviewCard