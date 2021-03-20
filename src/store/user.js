import { createSlice } from '@reduxjs/toolkit'
import { firebaseGetUserUrl } from '../services/firebase'

export const slice = createSlice({
    name: 'user',
    initialState: {
        isLoading: false,
        data: {},
    },
    reducers: {
        fetchUser: () => ({ isLoading: true }),
        updateUser: (state, action) => ({ isLoading: false, data: action.payload }),
        removeUser: () => ({ isLoading: false, data: {} }),
    },
})

export const { fetchUser, updateUser, removeUser } = slice.actions

export const selectUserLoading = (state) => state.user.isLoading
export const selectUser = (state) => state.user.data
export const selectLocalId = (state) => localStorage.getItem('localId') ?? state.user.data?.localId
export const selectUserEmail = (state) => state.user.data?.email

export const getUserAsync = () => async (dispatch) => {
    const idToken = localStorage.getItem('idToken')
    if (idToken) {
        dispatch(fetchUser())
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ idToken }),
        }

        const resp = await fetch(firebaseGetUserUrl, requestOptions)
        const data = await resp.json()

        if (data.hasOwnProperty('error')) {
            localStorage.removeItem('idToken')
            localStorage.removeItem('localId')
            dispatch(removeUser())
        } else {
            dispatch(updateUser(data.users[0]))
        }
    } else {
        dispatch(removeUser())
    }
}

export const removeUserAsync = () => async (dispatch) => {
    localStorage.removeItem('idToken')
    localStorage.removeItem('localId')
    dispatch(removeUser())
}

export default slice.reducer
