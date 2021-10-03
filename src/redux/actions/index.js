import {v4 as uuidgen} from 'uuid'

export const addEntry = (params) => {
    const uuid = uuidgen()
    return {
        type: 'ADD_ENTRY',
        payload: {
            uuid,
            unit: 0,
            grade: 0
        }
    }
};

export const updateEntry = (uuid, values) => {
    return {
        type: 'UPDATE_ENTRY',
        payload: {
            uuid,
            unit: values.unit,
            grade: values.grade
        }
    }
}

export const deleteEntry = (uuid) => {
    return {
        type: 'DELETE_ENTRY',
        payload: uuid
    }
}
