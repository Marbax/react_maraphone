import { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import PokemonCard from '../../../components/PokemonCard'
import { PokemonContext } from '../../../context/pokemonContext'
import Layout from '../../../components/Layout'
import style from './style.module.css'
import pikaBg from '../../../assets/bgSleepingPika.jpg'

const FinishPage = () => {
    const { isGameFinished, pokemonsSelected, oponetsHand, isPlayerWon, endGame } = useContext(
        PokemonContext
    )
    const history = useHistory()
    if (!isGameFinished) {
        history.replace('/game')
    }

    const [selectedCard, setSelectedCard] = useState(null)
    const [cardsToChoose, setCardsToChoose] = useState(() => {
        return oponetsHand.map((item) => ({ ...item }))
    })

    const handleAddCardClick = (card) => {
        setSelectedCard((prevState) => {
            if (card.id !== prevState?.id) {
                return { ...card, isSelected: !card.isSelected }
            } else {
                return null
            }
        })
        setCardsToChoose((prevState) => {
            const copy = prevState.map((item) => {
                if (item.id !== card.id) {
                    return { ...item, isSelected: false }
                } else {
                    return { ...item, isSelected: !item.isSelected }
                }
            })
            return [...copy]
        })
    }

    const handleGameEndClick = () => {
        endGame(selectedCard)
    }

    return (
        <>
            <Layout
                title={`You ${isPlayerWon ? 'WON. Choose one card.' : 'LOOSE'}`}
                urlBg={pikaBg}
                isPololygonDisabled={true}>
                <div className={style['card-container']}>
                    {pokemonsSelected &&
                        Object.values(
                            pokemonsSelected
                        ).map(({ id, type, img, name, values, bgImg }) => (
                            <PokemonCard
                                key={id}
                                id={id}
                                type={type}
                                img={img}
                                name={name}
                                values={values}
                                bgImg={bgImg}
                                isDisabled
                                isActive
                                className={style['large-card']}
                            />
                        ))}
                </div>
                <button
                    className={style['start-button']}
                    disabled={selectedCard == null && isPlayerWon}
                    onClick={handleGameEndClick}>
                    End Game
                </button>
                <div className={style['card-container']}>
                    {pokemonsSelected &&
                        cardsToChoose.map((item) => (
                            <PokemonCard
                                key={item.id}
                                id={item.id}
                                type={item.type}
                                img={item.img}
                                name={item.name}
                                values={item.values}
                                bgImg={item.bgImg}
                                isActive
                                isSelected={item.isSelected}
                                className={style['large-card']}
                                onClick={() => isPlayerWon && handleAddCardClick(item)}
                            />
                        ))}
                </div>
            </Layout>
        </>
    )
}

export default FinishPage
