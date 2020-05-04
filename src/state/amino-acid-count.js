import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'amino-acid-count',
  initialState: [0, 0, 0],
  reducers: {
    set (state, action) {
      const updated = [...state]
      updated[action.payload.index] = action.payload.value
      return updated
    },
    increment (state, action) {
      const updated = [...state]
      updated[action.payload.index] += 1
      return updated
    }
  }
})

export const aminoAcidCountReducer = slice.reducer

// actions
export const setAA = (index, value) => slice.actions.set({ index, value })
export const incrementAA = (index) => slice.actions.increment({ index })

// selectors
export const getAA = state => state['amino-acid-count']
