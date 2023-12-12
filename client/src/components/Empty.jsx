import React from 'react'


const Empty = () => {
  return (
    <div className='container-fluid' id='emptyBox'>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <img width={"90%"} src="/images/empty.png" alt="" />
        <div className="font1 heading text-secondary text-center">No Products are there</div>
      </div>
    </div>
  )
}

export default Empty