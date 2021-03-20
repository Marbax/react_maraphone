import { createSlice } from '@reduxjs/toolkit'
import { firebaseUrl } from '../services/firebase'
import { selectLocalId } from './user'

export const slice = createSlice({
    name: 'pokemons',
    initialState: {
        isLoading: false,
        data: {},
        error: null,
    },
    reducers: {
        fetchPokemons: (state) => ({
            ...state,
            isLoading: true,
        }),
        fetchPokemonsResolve: (state, action) => ({
            ...state,
            isLoading: false,
            data: action.payload,
        }),
        fetchPokemonsReject: (state, action) => ({
            ...state,
            isLoading: false,
            data: {},
            error: action.payload,
        }),
    },
})

export const { fetchPokemons, fetchPokemonsResolve, fetchPokemonsReject } = slice.actions

export const selectPokemonsData = (state) => state.pokemons.data
export const selectPokemonsLoading = (state) => state.pokemons.isLoading

export const getPokemonsAsync = () => async (dispatch, getState) => {
    const localId = selectLocalId(getState())
    dispatch(fetchPokemons())
    const resp = await fetch(`${firebaseUrl}${localId}/pokemons.json`)
    const data = await resp.json()
    dispatch(fetchPokemonsResolve(data))
}

export default slice.reducer
