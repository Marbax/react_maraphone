import cn from 'classnames'
import { useHistory, useRouteMatch } from 'react-router'
import { ReactComponent as LoginSVG } from '../../../assets/login.svg'
import { selectUserEmail } from '../../../store/user'
import { useSelector } from 'react-redux'
import style from './style.module.css'

const Navbar = ({ handleBurgerClick, onClickLogin, isMenuActive, isBgActive = false }) => {
    const history = useHistory()
    const isRoot = useRouteMatch('/')
    const email = useSelector(selectUserEmail)
    return (
        <nav id={style.navbar} className={cn({ [style['bg-active']]: isBgActive })}>
            <div className={style['nav-wrapper']}>
                <span onClick={() => !isRoot.isExact && history.push('/')} className={style.brand}>
                    Mbx
                </span>
                <span className={style.btns}>
                    <span
                        className={style['login-btn']}
                        onClick={() => onClickLogin && onClickLogin()}>
                        {email ?? <LoginSVG />}
                    </span>
                    <span
                        onClick={handleBurgerClick}
                        className={cn(style['menu-button'], { [style.active]: isMenuActive })}>
                        <span />
                    </span>
                </span>
            </div>
        </nav>
    )
}

export default Navbar
