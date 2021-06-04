import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    TodolistType,
    UpdateTaskModelType
} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

/*export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}*/

/*export type AddTaskActionType = {
    type: 'ADD-TASK',
    todolistId: string
    title: string
}*/
/*
export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}*/


type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            let stateCopy = {...state}
            action.todolists.forEach((tl) => {
                return stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'SET-TASKS': {
            let stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.task.todoListId];
            const newTasks = [action.task, ...tasks];
            stateCopy[action.task.todoListId] = newTasks;
            return stateCopy;
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const
}

export type AddTaskActionType = ReturnType<typeof addTaskAC>

export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}

export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId} as const
}

export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const
}
export type SetTasksActionType = ReturnType<typeof setTasksAC>

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET-TASKS', tasks, todolistId} as const
}


export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                let tasks = res.data.items
                dispatch(setTasksAC(tasks, todolistId))
            })
    }
}

export const removeTaskTC = (taskId: string, todosId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTask(todosId, taskId)
            .then(() => {
                dispatch(removeTaskAC(taskId, todosId))
            })
    }
}

export const addTaskTC = (todolistId: string, taskTitle: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTask(todolistId, taskTitle).then((res) => {
            const taskTitle = res.data.data.item
            dispatch(addTaskAC(taskTitle))
        })
    }
}

export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

        const findTask = getState().tasks[todolistId].find((t) => {
            return t.id === taskId
        })
        //const newTask = {...findTask, status: status}
        if (findTask) {
            const model: UpdateTaskModelType = {
                title: findTask.title,
                status: status,
                deadline: findTask.deadline,
                description: findTask.description,
                priority: findTask.priority,
                startDate: findTask.startDate
            }

            todolistsAPI.updateTask(todolistId, taskId, model).then((res) => {
                const updatedStatusTask = res.data.data.item.status
                //const status = model.status

                dispatch(changeTaskStatusAC(taskId, updatedStatusTask, todolistId))
            })
        }
    }
}

export const changeTaskTitleTC = (todolistId: string, taskId: string, title: string) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const newTask = getState().tasks[todolistId].find((t) => {
            return t.id === taskId
        })
        if (newTask) {
            const model: UpdateTaskModelType = {
                title: title,
                status: newTask.status,
                deadline: newTask.deadline,
                description: newTask.description,
                priority: newTask.priority,
                startDate: newTask.startDate
            }
            todolistsAPI.updateTask(todolistId, taskId, model).then((res) => {
                const title = res.data.data.item.title
                dispatch(changeTaskTitleAC(taskId, title, todolistId))
            })
        }


    }
}

