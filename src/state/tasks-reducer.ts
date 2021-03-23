import {FilterValuesType, TasksStateType, TodolistType} from "../App";
import {v1} from "uuid";
import {TaskType} from "../Todolist";
import {AddTodolistActionType, RemoveTodolistActionType, todolistId1, todolistId2} from "./todolists-reducer";

type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType

type RemoveTaskActionType = {
    type: 'REMOVE-TASK'
    taskId: string
    todolistId: string

}
type  AddTaskActionType = {
    type: 'ADD-TASK'
    title: string
    todolistId: string

}
type  ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string
    isDone: boolean
    todolistId: string
}
type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    taskId: string
    title: string
    todolistId: string
}



const initialState:TasksStateType = {
    [todolistId1]: [
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true}
    ],
    [todolistId2]: [
        {id: v1(), title: "Milk", isDone: true},
        {id: v1(), title: "React Book", isDone: true}
    ]
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todolistId];
            const filterTask = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = filterTask
            return stateCopy
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const newTask = {id: v1(), title: action.title, isDone: false}
            const todolistTasks = stateCopy[action.todolistId]
            stateCopy[action.todolistId] = [newTask, ...todolistTasks]
            return stateCopy
        }
        case 'CHANGE-TASK-STATUS': {
            const stateCopy = {...state}
            const todolistTask = stateCopy[action.todolistId]
            const task = todolistTask.find(t => t.id === action.taskId)
            if (task) {
                task.isDone = action.isDone
            }
            return stateCopy
        }
        case 'CHANGE-TASK-TITLE': {
            const stateCopy = {...state}
            const todolistTask = stateCopy[action.todolistId]
            const task = todolistTask.find(t => t.id === action.taskId)
            if (task) {
                task.title = action.title
            }
            return stateCopy
        }
        case 'ADD-TODOLIST': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = []
            return stateCopy
        }
        case "REMOVE-TODOLIST":
            const stateCopy = {...state}
            delete stateCopy[action.id]

            return stateCopy

        default:
            return state
        }
    }

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId, todolistId}
}
export const addTaskAC = (title: string, todolistId: string):
    AddTaskActionType => {
    return {type: 'ADD-TASK', todolistId, title}
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string):
    ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todolistId}
}

export const ChangeTaskTitleAC = (todolistId: string, taskId: string, title: string,):
    ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId}
}

