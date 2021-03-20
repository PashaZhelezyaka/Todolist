type StateType = {
    age: number
    childrenCount: number
    name: string
}
type ActionType =
    IncrementAgeType
    |IncrementChildrenCountType
    | ChangeNameType

type IncrementAgeType = {
    type: 'INCREMENT-AGE'
    [key: string]: any
}
type IncrementChildrenCountType = {
    type: 'INCREMENT-CHILDREN-COUNT'
    [key: string]: any
}
type ChangeNameType = {
    type: 'CHANGE-NAME'
    newName: string
    [key: string]: any
}


// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописаному type в этом action (инструкции) я поменяю state
export const userReducer = (state: StateType, action: ActionType) => {
    switch (action.type) {
        case 'INCREMENT-AGE':
       return   {...state,
            age: state.age + 1}
        case 'INCREMENT-CHILDREN-COUNT':
            return {...state, childrenCount: state.childrenCount + 1}
        case 'CHANGE-NAME' :
            let newState = {...state}
            newState.name = action.newName
            return newState
        default:
            throw new Error("I don't understand this type")
    }
}