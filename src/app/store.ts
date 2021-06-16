import {TasksActionsType, tasksReducer} from '../features/todolists/tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from '../features/todolists/todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk, {ThunkAction} from "redux-thunk";
import {appReducer, AppReducerActionType} from "./app-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

// типы всех actions
export type AppActionType = TasksActionsType | TodolistsActionsType | AppReducerActionType

// типы для всех санок THunk обобщеные из документации Redux
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,AppRootStateType,unknown,AppActionType>


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
