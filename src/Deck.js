import React, { useState, useEffect, useRef } from 'react'
import Card from './Card'
import axios from 'axios'

const API_ROOT = 'http://deckofcardsapi.com/api/deck'

function Deck() {
    const [ deck, setDeck ] = useState(null);
    const [ draw, setDraw ] = useState([])
    const [ keepDraw, setKeepDraw] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        async function shuffle() {
            let newDeck = await axios.get(`${API_ROOT}/new/shuffle`)
            setDeck(newDeck.data)
        }
        shuffle()
    }, [setDeck])

    useEffect(() => {
        async function getCard() {
            let {deck_id} = deck

            try {
                let drawCard = await axios.get(`${API_ROOT}/${deck_id}/draw`);

                if (drawCard.data.remaining === 0) {
                    setKeepDraw(false)
                    throw new Error('No cards remaining!')
                }
                const card = drawCard.data.cards[0]

                setDraw(data => [...data, 
                    {
                        id: card.code,
                        name: card.suit + ' ' + card.value,
                        image: card.image
                    }
                ])

            } catch(err) {
                console.log(err)
            }
        }

        if(keepDraw && !timer.current) {
            timer.current = setInterval(async () => {
                await getCard();
            }, 1000)
        }

        return () => {
            clearInterval(timer.current);
            timer.current = null
        }

    }, [keepDraw, setKeepDraw, deck])

    const toggleKeepDraw = () => {
        setKeepDraw(draw => !draw)
    }

    const cards = draw.map(card => (
        <Card 
            key={card.id}
            name={card.name}
            image={card.image}
        />
    ))

    return (
        <div className='Deck'>
            {deck ? (
                <button onClick={toggleKeepDraw}>Draw</button>
            ) : null}
            <div className='cards'>{cards}</div>
        </div>
    )
}

export default Deck;
