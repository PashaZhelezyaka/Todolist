import {Dispatch} from 'redux';
import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'

/*export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    title: string
    todolistId: string
}*/
/*export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}*/
/*export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}*/


type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
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

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>

export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', title: title, todolistId: v1()} as const
}

export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>

export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const
}

export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const
}

export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

export const setTodolistsAC = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}

export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTodolists().then((res) => {
            let todos = res.data
            dispatch(setTodolistsAC(todos))
        })
    }
}

export const removeTodolistTC = (todolistId:string) => {
    return (dispatch:Dispatch)=>{
        todolistsAPI.deleteTodolist(todolistId).then((res)=>{
            dispatch(removeTodolistAC(todolistId))
        })
    }
}
// ?????????????
export const addTodolistTC = (title: string)=> {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTodolist(title).then((res)=>{
            const todoTitle = res.data.data.item.title
            dispatch(addTodolistAC(todoTitle))
        })
    }
}

export const  changeTodolistTitleTC = (todolistId:string, title: string)=> {
 return (dispatch: Dispatch)=>{
     todolistsAPI.updateTodolist(todolistId, title).then((res)=>{
         dispatch(changeTodolistTitleAC(todolistId,title))
     })
 }
}
