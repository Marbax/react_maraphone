import { Route, Switch, useRouteMatch, Redirect } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
import PrivateRoute from './components/PrivateRoute'

import { DatabaseContext } from './context/databaseContext'
import MenuNavbar from './components/MenuNavbar'
import HomePage from './routes/Home'
import GamePage from './routes/Game'
import AboutPage from './routes/About'
import ContactPage from './routes/Contact'
import NotFound from './routes/NotFound'
import FirebaseClass from './services/firebase'

import 'react-notifications/lib/notifications.css'
import { useDispatch } from 'react-redux'
import { getUserAsync } from './store/user'
import { useEffect } from 'react'

const App = () => {
    const isRoot = useRouteMatch('/')
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserAsync())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <DatabaseContext.Provider value={FirebaseClass}>
            <Switch>
                <Route path='/404' component={NotFound} />
                <Route>
                    <MenuNavbar bgActive={!isRoot.isExact} />
                    <main>
                        <Switch>
                            <Route exact path='/' component={HomePage}></Route>
                            <Route path='/home' component={HomePage}></Route>
                            <PrivateRoute path='/game' component={GamePage} />
                            <PrivateRoute path='/about' component={AboutPage} />
                            <Route path='/contact' component={ContactPage} />
                            <Route
                                render={() => {
                                    return <Redirect to='/404' />
                                }}
                            />
                        </Switch>
                    </main>
                </Route>
            </Switch>
            <NotificationContainer />
        </DatabaseContext.Provider>
    )
}

export default App
