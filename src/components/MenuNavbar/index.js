import { useEffect, useState } from 'react'
import FirebaseClass, { firebaseSignInUrl, firebaseSignUpUrl } from '../../services/firebase'
import LoginForm from '../LoginForm'
import Modal from '../Modal'
import { NotificationManager } from 'react-notifications'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, getUserAsync } from '../../store/user'
import BackendApiClass from '../../services/backendApi'
import Menu from './Menu'
import Navbar from './Navbar'
import UserProfle from '../UserProfile'

const MenuNavbar = ({ bgActive }) => {
    const [isMenuActive, setMenuActive] = useState(null)
    const [isModalOpen, setModalOpen] = useState(null)
    //state to display login or register form and to proccess submit differently
    const [isLoginForm, setLoginForm] = useState(true)
    const [user, setUser] = useState(null)
    const userRedux = useSelector(selectUser)
    const dispatch = useDispatch()

    useEffect(() => {
        setUser({ ...userRedux })
    }, [userRedux])

    const handleBurgerClick = () => setMenuActive((prevState) => !prevState)
    const handleLoginClick = () => setModalOpen((prevState) => !prevState)
    const handleModalCloseClick = () => setModalOpen(false)
    const handleSubmitLoginForm = async ({ email, password }) => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true,
            }),
        }
        const resp = await fetch(
            isLoginForm ? firebaseSignInUrl : firebaseSignUpUrl,
            requestOptions
        )
        const data = await resp.json()

        if (data.hasOwnProperty('error')) {
            NotificationManager.error(data?.error?.message, 'Oops...')
        } else {
            if (isLoginForm) {
                localStorage.setItem('idToken', data.idToken)
                localStorage.setItem('localId', data.localId)
                dispatch(getUserAsync())
            } else {
                await FirebaseClass.postNewUsersDeck(
                    data.localId,
                    data.idToken,
                    await BackendApiClass.getStarterDeck()
                )
            }
            NotificationManager.success(
                `${data?.email} successfully ${isLoginForm ? 'logined' : 'registered'}.`,
                'Gotcha'
            )
            handleModalCloseClick()
        }
    }
    const handleChangeFormState = () => setLoginForm((prevState) => !prevState)

    return (
        <>
            <Navbar
                isBgActive={bgActive}
                isMenuActive={isMenuActive}
                handleBurgerClick={handleBurgerClick}
                onClickLogin={handleLoginClick}
            />
            <Menu isMenuActive={isMenuActive} handleLinkClick={handleBurgerClick} />

            {user?.email ? (
                <Modal
                    clickCloseModal={handleModalCloseClick}
                    isOpen={isModalOpen}
                    title={`Welcome ${user.email}`}>
                    <UserProfle
                        lastLoginAt={user.lastLoginAt}
                        createdAt={user.createdAt}
                        emailVerified={user.emailVerified}
                    />
                </Modal>
            ) : (
                <Modal
                    clickCloseModal={handleModalCloseClick}
                    isOpen={isModalOpen}
                    title={isLoginForm ? 'Login...' : 'Register...'}>
                    <LoginForm
                        isLoginForm={isLoginForm}
                        onChangeFormState={handleChangeFormState}
                        onSubmit={handleSubmitLoginForm}
                        isActive={isModalOpen}
                    />
                </Modal>
            )}
        </>
    )
}

export default MenuNavbar
