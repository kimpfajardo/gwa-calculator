import { combineReducers } from "redux";
import entryReducer from './entryReducer'

const allReducers = combineReducers({
    entries: entryReducer,
})

export default allReducers;