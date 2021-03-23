import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";

type ActionsType =
    RemoveTodolistActionType
    | ChangeTodolistTitleActionType
    | AddTodolistActionType
    | FilterTodolistActionType

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type  ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string

}
export type  AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    title: string
    todolistId: string

}
export type  FilterTodolistActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType

}
export let todolistId1 = v1()
export let todolistId2 = v1()

const initialState: Array<TodolistType> = [
    {id: todolistId1, title: "What to learn", filter: "all"},
    {id: todolistId2, title: "What to buy", filter: "all"}

]

export const todolistsReducer = (state: Array<TodolistType> = initialState,
                                 action: ActionsType): Array<TodolistType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(t => t.id != action.id)
        }
        case 'ADD-TODOLIST':
            return [{
                id: action.todolistId, title: action.title,
                filter: "all"
            }, ...state]

        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;

            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER' : {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;

            }
            return [...state]
        }

        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const changeTodolistAC = (todolistId: string, newTodolistTitle: string):
    ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: todolistId, title: newTodolistTitle}
}
export const addTodolistAC = (title: string):
    AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', title, todolistId: v1()}
}
export const filterTodolistAC = (todolistId: string, filter: FilterValuesType):
    FilterTodolistActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: todolistId, filter}
}
