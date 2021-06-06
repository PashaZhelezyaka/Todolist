import {Dispatch} from 'redux';
import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {AppThunk} from "../../app/store";

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: "all"}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case 'SET-TODOLISTS': {
            return action.todolists.map((tl) => {
                return {...tl, filter: 'all'}
            })
        }
        default:
            return state;
    }
}
// ACTIONS
export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter} as const
}
export const setTodolistsAC = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}

// THUNK
export const fetchTodolistsTC = ():AppThunk => {
    return (dispatch) => {
        todolistsAPI.getTodolists().then((res) => {
            let todos = res.data
            dispatch(setTodolistsAC(todos))
        })
    }
}
export const removeTodolistTC = (todolistId: string):AppThunk => {
    return (dispatch) => {
        todolistsAPI.deleteTodolist(todolistId).then((res) => {
            dispatch(removeTodolistAC(todolistId))
        })
    }
}
export const addTodolistTC = (title: string):AppThunk => {
    return (dispatch) => {
        todolistsAPI.createTodolist(title).then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
        })
    }
}
export const changeTodolistTitleTC = (todolistId: string, title: string):AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(todolistId, title).then((res) => {
            dispatch(changeTodolistTitleAC(todolistId, title))
        })
    }
}

// Types
//всё перенес в ActionType без переменных
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

export type TodolistsActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}