import { useDispatch } from 'react-redux'
import { removeUserAsync } from '../../store/user'
import style from './style.module.css'

const UserProfle = ({ lastLoginAt, createdAt, emailVerified }) => {
    const dispatch = useDispatch()
    const lastLoginDate = new Date(parseInt(lastLoginAt)).toLocaleString()
    const createdAccDate = new Date(parseInt(createdAt)).toLocaleString()

    return (
        <div className={style.root}>
            <div className={style.row}>
                <label className={style['descr']}>Account created At: </label>
                <p>{createdAccDate}</p>
            </div>
            <div className={style.row}>
                <label className={style['descr']}>Last logined At: </label>
                <p>{lastLoginDate}</p>
            </div>
            <div className={style.row}>
                <label className={style['descr']}>Is Email Verified: </label>
                <p>{emailVerified ? 'Yes' : 'No'}</p>
            </div>
            <div className={style['btn-container']}>
                <button
                    className={style['submit-button']}
                    onClick={() => dispatch(removeUserAsync())}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default UserProfle
