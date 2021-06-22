import {AppActionType, AppThunk} from "./store";
import {authAPI} from "../api/todolists-api";
import {handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../features/login/auth-reducer";

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as ErrorSnacbarType,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionType): InitialStateType => {

    console.log(action)
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.initialized}
        default:
            return {...state}
    }
}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}

export const setAppErrorAC = (error: ErrorSnacbarType) => {
    return {type: 'APP/SET-ERROR', error} as const
}

// крутилка когда идет запрос на зареганы мы или нет
export const setIsInitializedAC = (initialized: boolean) => {
    return {type: 'APP/SET-INITIALIZED', initialized} as const
}

export const initializeAppTC = (): AppThunk => (dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
        }
    }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
        .finally(() => dispatch(setIsInitializedAC(true)))
}


export type AppReducerActionType =
    SetAppStatusActionType
    | SetAppErrorActionType
    | setIsInitializedActionType

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorSnacbarType = string | null

export type InitialStateType = typeof initialState

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type setIsInitializedActionType = ReturnType<typeof setIsInitializedAC>