import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'synth-status',
  initialState: [false, false, false],
  reducers: {
    set (state, action) {
      const updated = [...state]
      updated[action.payload.index] = action.payload.value
      return updated
    },
  }
})

export const synthStatusReducer = slice.reducer

// actions
export const setSynthStatus = (index, value) => slice.actions.set({ index, value })

// selectors
export const getSynthStatus = state => state['synth-status']
