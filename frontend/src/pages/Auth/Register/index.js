import { Link } from 'react-router-dom'

import { useContext, useState } from 'react'

// Components
import Input from '../../../components/Form/Input'
import styles from '../../../components/Form/Form.module.css'
// Context
import {Context} from '../../../contexts/UserContext'

function Register() {

    const [user, setUser] = useState({})
    const {register} = useContext(Context)

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        register(user)
    }

    return (
        <section className={styles.form_container}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <Input text="Name" type="text" name="name" placeholder="Type your name" handleOnChange={handleChange} />
                <Input text="Phone" type="text" name="phone" placeholder="Type your phone" handleOnChange={handleChange} />
                <Input text="Email" type="email" name="email" placeholder="Type your email" handleOnChange={handleChange} />
                <Input text="Password" type="password" name="password" placeholder="Type your password" handleOnChange={handleChange} />
                <Input text="Confirm password" type="password" name="confirmpassword" placeholder="Retype your password" handleOnChange={handleChange} />
                <input type="submit" value="Register" />
            </form>
            <p>Already have an account? <Link to="/login">Click here.</Link></p>
        </section>
    )
}

export default Register