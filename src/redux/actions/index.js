import {v4 as uuidgen} from 'uuid'

export const addEntry = (params) => {
    const uuid = uuidgen()
    return {
        type: 'ADD_ENTRY',
        payload: {
            uuid,
            unit: null,
            grade: null,
            unit_error: null,
            grade_error: null
        }
    }
};

export const updateEntry = (uuid, values, unit_error = null, grade_error = null) => {
    return {
        type: 'UPDATE_ENTRY',
        payload: {
            uuid,
            unit: values.unit ? values.unit : null,
            grade: values.grade ? values.grade : null,
            unit_error: unit_error !== null ? unit_error : null,
            grade_error: grade_error !== null ? grade_error : null,
        }
    }
}

export const deleteEntry = (uuid) => {
    return {
        type: 'DELETE_ENTRY',
        payload: uuid
    }
}
