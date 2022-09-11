import api from '../../../utils/api'

import styles from '../Dashboard.module.css'

import { Link } from 'react-router-dom'

import RoundedImage from '../../../components/Layout/RoundedImage'

// Hooks
import useFlashMessage from '../../../hooks/useFlashMessage'
import { useState, useEffect } from 'react'

function MyPets() {

    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get('/pets/mypets', {
            headers: {
                Authorization: `Beraer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setPets(response.data.pets)
        })
    }, [token])

    async function removePet(id) {
        let msgType = 'success'

        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            const updatedPets = pets.filter((pet) => pet._id !== id)
            setPets(updatedPets)
            return response.data
        }).catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    async function concludeAdoption(id) {
        let msgType = 'success'

        const data = await api.patch(`/pets/conclude/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            return response.data
        }).catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>My Pets</h1>
                <Link to="/pet/add">Pet register</Link>
            </div>
            <div className={styles.petlist_container}>
                {
                    pets.length > 0 &&
                    pets.map((pet) => (
                        <div className={styles.petlist_row} key={pet._id}>
                            <RoundedImage src={`${process.env.REACT_APP_API}img/pets/${pet.images[0]}`} alt={pet.name} width="px75" />
                            <span className="bold">{pet.name}</span>
                            <div className={styles.actions}>
                                {pet.available ? (
                                    <>
                                        {
                                            pet.adopter && (
                                                <button className={styles.conclude_btn} onClick={() => {
                                                    concludeAdoption(pet._id)
                                                }}>Complete adoption</button>
                                            )
                                        }
                                        <Link to={`/pet/edit/${pet._id}`}>Edit</Link>
                                        <button onClick={() => {
                                            removePet(pet._id)
                                        }}>Remove</button>
                                    </>
                                ) : (
                                    <p>The pet is already adopted!</p>
                                )}
                            </div>
                        </div>
                    ))
                }
                {
                    pets.length === 0 && (<p>You don't have pets</p>)
                }
            </div>
        </section>
    )
}

export default MyPets