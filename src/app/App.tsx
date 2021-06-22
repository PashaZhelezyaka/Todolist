import React, {useEffect} from 'react'
import './App.css';
import {AppBar, Button, CircularProgress, Container, IconButton, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {TaskType} from '../api/todolists-api'
import {TodolistsList} from "../features/todolists/TodolistsList";
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import {useDispatch, useSelector} from "react-redux";
import {ErrorSnacbarType, initializeAppTC, RequestStatusType} from "./app-reducer";
import {AppRootStateType} from "./store";
import {ErrorSnackbar} from "../components/errorSnackbar/ErrorSnackbar";
import {Login} from "../features/login/Login";
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {logoutTC} from "../features/login/auth-reducer";

function App({demo = false}: PropsType) {
    const dispatch = useDispatch()
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const error = useSelector<AppRootStateType, ErrorSnacbarType>(state => state.app.error)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

// на старте загрузки, проверяет зареганы мы или нет и куда нас редиректнуть в зависимости и буливого
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    //делаем проверку, чтобы код не шел дальше, и не было прыжков в урле
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>

    }
    console.log(isInitialized)
    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <BrowserRouter>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress color="primary"/>}
                </AppBar>
                <Container fixed>
                    <Switch>
                        <Route exact path={'/'} render={() => <TodolistsList demo={demo}/>}/>
                        <Route path={'/login'} render={() => <Login/>}/>
                        <Route path={'/404'} render={() => <h1> 404: PAGE NOT FOUND</h1>}/>
                        <Redirect from={'*'} to={'/404'}/>
                    </Switch>
                </Container>
                <ErrorSnackbar/>
            </div>
        </BrowserRouter>
    );
}

export default App;


// Types
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
type PropsType = {
    demo?: boolean
}