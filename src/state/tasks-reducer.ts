import {FilterValuesType, TasksStateType} from "../App";
import {v1} from "uuid";
import {TaskType} from "../Todolist";

type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType

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
    type: 'CHANGE-TASK'
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



export const tasksReducer = (state: TasksStateType, action: ActionsType):TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todolistId];
            const filterTask =  tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = filterTask
            return stateCopy
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const newTask = {id: v1(), title: action.title, isDone: false}
            const todolistTasks = stateCopy[action.todolistId]
            stateCopy[action.todolistId] = [newTask,...todolistTasks]
            return stateCopy
        }
        case 'CHANGE-TASK': {
            const stateCopy = {...state}
            const todolistTask = stateCopy[action.todolistId]
            const task = todolistTask.find(t => t.id === action.taskId)
            if (task) {
                task.isDone = action.isDone}
            return stateCopy
        }
        case 'CHANGE-TASK-TITLE': {
            const stateCopy = {...state}
            const todolistTask = stateCopy[action.todolistId]
            const task = todolistTask.find(t => t.id === action.taskId)
            if (task) {
                task.title = action.title}
            return stateCopy
        }

        default:
            throw new Error('I don`t understand this action type')
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK',taskId, todolistId}
}
export const addTaskAC = (title: string, todolistId: string):
    AddTaskActionType => {
    return {type: 'ADD-TASK', todolistId, title}
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string):
    ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK', taskId, isDone, todolistId}
}

export const ChangeTaskTitleAC = (todolistId: string, taskId: string, title: string, ):
    ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId}
}
