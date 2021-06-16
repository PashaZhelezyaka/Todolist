import {TasksStateType} from '../../app/App';
import {
    AddTodolistActionType,
    changeTodolistEntityStatusAC,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType, AppThunk} from "../../app/store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

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

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
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
            return {
                ...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
            /*const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;*/
        }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
            /* const stateCopy = {...state}
             const tasks = stateCopy[action.task.todoListId];
             const newTasks = [action.task, ...tasks];
             stateCopy[action.task.todoListId] = newTasks;
             return stateCopy;*/
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
            return {...state, [action.todolist.id]: []}
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        /*case "CHANGE-TASK-ENTITY-STATUS": {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);
            state[action.todolistId] = newTasksArray;
            return ({...state});
        }*/
        default:
            return state;
    }
}

//ACTIONS
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET-TASKS', tasks, todolistId} as const
}
/*export const changeTaskEntityStatusAC = (todolistId: string, taskId: string,
                                         entityStatus: RequestStatusType)=> {
    return {type: 'CHANGE-TASK-ENTITY-STATUS', todolistId, taskId, entityStatus} as const
}*/

//THUNK
export const fetchTasksTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                let tasks = res.data.items
                dispatch(setTasksAC(tasks, todolistId))
                dispatch(setAppStatusAC("succeeded"))
            })
            .catch((error:AxiosError)=>{
                handleServerNetworkError(error,dispatch)
            })
    }
}
export const removeTaskTC = (taskId: string, todosId: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC("loading"))
        /*dispatch(changeTodolistEntityStatusAC(todosId, "loading"))*/
        todolistsAPI.deleteTask(todosId, taskId)
            .then(() => {
                dispatch(removeTaskAC(taskId, todosId))
                dispatch(setAppStatusAC("succeeded"))
            })
            .catch((error:AxiosError)=>{
                handleServerNetworkError(error,dispatch)
            })
    }
}
export const addTaskTC = (todolistId: string, taskTitle: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.createTask(todolistId, taskTitle).then((res) => {
                if (res.data.resultCode === 0) {
                    const taskTitle = res.data.data.item
                    dispatch(addTaskAC(taskTitle))
                    dispatch(setAppStatusAC("succeeded"))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }
        ).catch((error: AxiosError)=>{
            handleServerNetworkError(error,dispatch)
        })
    }
}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses): AppThunk => {
    return (dispatch, getState) => {


        const findTask = getState().tasks[todolistId].find((t) => {
            return t.id === taskId
        })
        if (findTask) {
            const model: UpdateTaskModelType = {
                title: findTask.title,
                status: status,
                deadline: findTask.deadline,
                description: findTask.description,
                priority: findTask.priority,
                startDate: findTask.startDate
            }
            dispatch(setAppStatusAC("loading"))
            todolistsAPI.updateTask(todolistId, taskId, model).then((res) => {
                const updatedStatusTask = res.data.data.item.status
                dispatch(changeTaskStatusAC(taskId, updatedStatusTask, todolistId))
                dispatch(setAppStatusAC("succeeded"))
            })
                .catch((error: AxiosError)=>{
                    handleServerNetworkError(error,dispatch)
                })
        }
    }
}
export const changeTaskTitleTC = (todolistId: string, taskId: string, title: string): AppThunk => {
    return (dispatch, getState) => {
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
            dispatch(setAppStatusAC("loading"))
            todolistsAPI.updateTask(todolistId, taskId, model).then((res) => {
                const title = res.data.data.item.title
                dispatch(changeTaskTitleAC(taskId, title, todolistId))
                dispatch(setAppStatusAC("succeeded"))
            })
                .catch((error: AxiosError)=>{
                    handleServerNetworkError(error,dispatch)
                })
        }
    }
}


//Types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type SetTaskActionType = ReturnType<typeof setTasksAC>
/*export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>*/



export type TasksActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTaskActionType
   /* | ChangeTaskEntityStatusActionType*/
//все типы экшенов перенес без переменных при помощи ReturnType
