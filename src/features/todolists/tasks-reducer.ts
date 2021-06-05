import {TasksStateType} from '../../app/App';
import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC
} from './todolists-reducer';
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    TodolistType,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";

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
            return {...state, [action.todolistId]: []}
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

//THUNK
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                let tasks = res.data.items
                dispatch(setTasksAC(tasks, todolistId))
            })
    }
}
export const removeTaskTC = (taskId: string, todosId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.deleteTask(todosId, taskId)
            .then(() => {
                dispatch(removeTaskAC(taskId, todosId))
            })
    }
}
export const addTaskTC = (todolistId: string, taskTitle: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.createTask(todolistId, taskTitle).then((res) => {
            const taskTitle = res.data.data.item
            dispatch(addTaskAC(taskTitle))
        })
    }
}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {

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

            todolistsAPI.updateTask(todolistId, taskId, model).then((res) => {
                const updatedStatusTask = res.data.data.item.status
                //const status = model.status

                dispatch(changeTaskStatusAC(taskId, updatedStatusTask, todolistId))
            })
        }
    }
}
export const changeTaskTitleTC = (todolistId: string, taskId: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
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


//Types
type ActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>

//все типы экшенов перенес без переменных при помощи ReturnType
