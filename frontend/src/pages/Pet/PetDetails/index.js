import api from '../../../utils/api'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './PetDetails.module.css'
import useFlashMessage from '../../../hooks/useFlashMessage'

function PetDetails() {

    const [pet, setPet] = useState({})
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {

        api.get(`/pets/${id}`).then((response) => {
            setPet(response.data.pet)
        })

    }, [id])

    async function schedule() {
        let msgType = 'success'

        const data = await api.patch(`pets/schedule/${pet._id}`, {
            Authorization: `Bearer ${JSON.parse(token)}`
        }).then((response) => {
            return response.data
        }).catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return (
        <>
            {
                pet.name && (
                    <section className={styles.pet_details_container}>
                        <div className={styles.pet_details_header}>
                            <h1>Meeting the pet: {pet.name}</h1>
                            <p>If interested, pay us a visit to meet him</p>
                        </div>
                        <div className={styles.pet_images}>
                            {
                                pet.images.map((image, index) => (
                                    <img src={`${process.env.REACT_APP_API}img/pets/${image}`} alt={pet.name} key={index} />
                                ))
                            }
                        </div>
                        <p><span className='bold'>Weight: </span>{pet.weight}Kg</p>
                        <p><span className='bold'>Age: </span>{pet.age} years old</p>
                        {
                            token ? (
                                <button onClick={schedule}>Request a visit</button>
                            ) : (
                                <p>You need to be in <Link to="/register">account</Link> to book a visit</p>
                            )
                        }
                    </section>
                )
            }
        </>
    )
}

export default PetDetails