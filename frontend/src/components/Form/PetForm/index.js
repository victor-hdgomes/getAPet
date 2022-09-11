import { useState } from 'react'

import formStyles from '../Form.module.css'

import Input from '../Input'
import Select from '../Select'

function PetForm({ petData, btnText, handleSubmit }) {

    const [pet, setPet] = useState(petData || {})
    const [preview, setPreview] = useState([])
    const colors = ["white", "black", "gray", "brown", "red", "gold", "grey", "bicolor", "tricolor", "merle", "harlequin", "spotted"]

    function onFileChange(e) {
        setPreview(Array.from(e.target.files))
        setPet({ ...pet, images: [...e.target.files] })
    }

    function handleChange(e) {
        setPet({ ...pet, [e.target.name]: e.target.value })
    }

    function handleColor(e) {
        setPet({ ...pet, color: e.target.options[e.target.selectedIndex].text })
    }

    function submit(e) {
        e.preventDefault()
        handleSubmit(pet)
    }

    return (
        <form onSubmit={submit} className={formStyles.form_container}>
            <div className={formStyles.preview_pet_images}>
                {
                    preview.length > 0 ? preview.map((image, index) => (
                        <img src={URL.createObjectURL(image)} alt={pet.name} key={`${pet.name}+${index}`} />
                    )) : pet.images && pet.images.map((image, index) => (
                        <img src={`${process.env.REACT_APP_API}img/pets/${image}`} alt={pet.name} key={`${pet.name}+${index}`} />
                    ))
                }
            </div>
            <Input text="Pet Images" type="file" name="images" handleOnChange={onFileChange} multiple={true} />
            <Input text="Pet Name" type="text" name="name" placeholder="Enter pet name" value={pet.name || ''} handleOnChange={handleChange} />
            <Input text="Pet Age" type="text" name="age" placeholder="Enter pet age" value={pet.age || ''} handleOnChange={handleChange} />
            <Input text="Pet Weight (Kg)" type="number" name="weight" placeholder="Enter pet weight" value={pet.weight || ''} handleOnChange={handleChange} />
            <Select name="color" text="Choose a color" options={colors} handleOnChange={handleColor} value={pet.color || ''} />
            <input type="submit" value={btnText} />
        </form>
    )
}

export default PetForm