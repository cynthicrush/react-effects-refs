import React, { useState } from 'react'

function Card({name, image}) {
    return (
        <div className='Card'>
            <img 
                className='card-image' 
                alt={name} 
                src={image} 
            />
        </div>
    )
}

export default Card;