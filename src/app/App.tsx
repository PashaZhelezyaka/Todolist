import React from 'react'
import './App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {TaskType} from '../api/todolists-api'
import {TodolistsList} from "../features/todolists/TodolistsList";
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import {useSelector} from "react-redux";
import {ErrorSnacbarType, RequestStatusType} from "./app-reducer";
import {AppRootStateType} from "./store";
import {ErrorSnackbar} from "../components/errorSnackbar/ErrorSnackbar";

function App() {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const error = useSelector<AppRootStateType, ErrorSnacbarType>(state => state.app.error)


    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === 'loading' && <LinearProgress color="primary"/>}
            </AppBar>
            <Container fixed>
                <TodolistsList/>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default App;


// Types
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
