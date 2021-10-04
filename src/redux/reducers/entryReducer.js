const initialState = []

const entryReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'ADD_ENTRY':
            return [
                ...state,
                {
                    ...action.payload
                }
            ]
            break;
        case 'UPDATE_ENTRY':
            const indexOfObject = state.findIndex(item => item.uuid === action.payload.uuid)
            const newState = [...state]
            

            if (indexOfObject !== -1) {
                newState[indexOfObject].grade = action.payload.grade
                newState[indexOfObject].unit = action.payload.unit
                newState[indexOfObject].unit_error = action.payload.unit_error
                newState[indexOfObject].grade_error = action.payload.grade_error
                return newState
            }
            break;
        case 'DELETE_ENTRY':
            const index = state.findIndex(item => item.uuid === action.payload)
            let tempState = [...state]
            

            if (index !== -1) {
                tempState.splice(index, 1)
                return tempState
            }
            break;
        default:
            return state
    }
}

export default entryReducer;
