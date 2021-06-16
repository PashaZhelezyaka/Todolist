import {AppActionType} from "./store";



const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as ErrorSnacbarType
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state,error: action.error}
        default:
            return state
    }
}

export const setAppStatusAC = (status:RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status } as const
}

export const setAppErrorAC = (error:ErrorSnacbarType) => {
    return {type: 'APP/SET-ERROR', error } as const
}


export type AppReducerActionType = SetAppStatusActionType | SetAppErrorActionType

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorSnacbarType = string | null

export type InitialStateType = typeof initialState

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>