import api from '../../../utils/api'
// CSS
import styles from './AddPet.module.css'
// Hooks
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Hooks
import useFlashMessage from '../../../hooks/useFlashMessage'
// Components
import PetForm from '../../../components/Form/PetForm'

function AddPet() {

    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    async function registerPet(pet) {
        let msgType = 'success'

        const formData = new FormData()

        await Object.keys(pet).forEach((key) => {
            if (key === 'images') {
                for (let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        const data = await api.post('pets/create', formData, {
            Authorization: `Bearer ${JSON.parse(token)}`,
            'Content-Type': 'multipart/form-data'
        }).then((response) => {
            return response.data
        }).catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)

        if (msgType !== 'error') {
            navigate('/pet/mypets')
        }
    }

    return (
        <section className={styles.addpet_header}>
            <div>
                <h1>Register a pet</h1>
                <p>Then it will be available for adoption</p>
            </div>
            <PetForm handleSubmit={registerPet} btnText="Register" />
        </section>
    )
}

export default AddPet