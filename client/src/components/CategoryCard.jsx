import React from 'react'
import {Link} from 'react-router-dom';

// importing css files 
import { Card } from 'react-bootstrap';


const CategoryCard = ({link,img,category,tagline}) => {
  return (
    <Link to={link} className="categoryCardLink">
        <Card className="categoryCard">
            <Card.Img variant="top" src={img} />
            <Card.Body>
                <Card.Title className='mb-0'>
                    <div className="font1 category mb-0">{category}</div>
                </Card.Title>
                <Card.Text>
                    <div className="font1 tagline textColor">{tagline}</div>
                </Card.Text>
            </Card.Body>
        </Card>
    </Link>
  )
}

export default CategoryCard