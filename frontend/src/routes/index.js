import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Profile from '../pages/User/Profile' 
import MyPets from '../pages/Pet/MyPets'
import AddPet from '../pages/Pet/AddPet';
import EditPet from '../pages/Pet/EditPet';
import PetDetails from '../pages/Pet/PetDetails';
import MyAdoptions from '../pages/Pet/MyAdoptions';
// Error
import Error from '../pages/Error'
// Components
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Container from '../components/Layout/Container'
import Message from '../components/Layout/Message'
// Context
import { UserProvider } from '../contexts/UserContext';

const RoutesApp = () => {
    return (
        <BrowserRouter>
            <UserProvider>
                <Header />
                <Message />
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/user/profile" element={<Profile />} />
                        <Route path="/pet/mypets" element={<MyPets />} />
                        <Route path="/pet/add" element={<AddPet />} />
                        <Route path="/pet/:id" element={<PetDetails />} />
                        <Route path="/pet/edit/:id" element={<EditPet />} />
                        <Route path="/pet/myadoptions" element={<MyAdoptions />} />

                        {/*not found*/}
                        <Route path="*" element={<Error />} />
                    </Routes>
                </Container>
                <Footer />
            </UserProvider>
        </BrowserRouter>
    )
}

export default RoutesApp;