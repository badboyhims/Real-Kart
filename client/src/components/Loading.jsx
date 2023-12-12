import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loading = () => {
  return (
    <div className='container-fluid' id='spinnerBox'>
       <Spinner style={{animationDelay:0.4}} className='mx-1' animation="grow" />
       <Spinner style={{animationDelay:0.8}} className='mx-1' animation="grow" />
       <Spinner  className='mx-1' animation="grow" />
    </div>
  )
}

export default Loading