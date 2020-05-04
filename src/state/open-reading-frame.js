import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'open-reading-frame',
  initialState: ['', '', ''],
  reducers: {
    set (state, action) {
      const updated = [...state]
      updated[action.payload.index] = action.payload.value
      return updated
    },
  }
})

export const openReadingFrameReducer = slice.reducer

// actions
export const setORF = (index, value) => slice.actions.set({ index, value })

// selectors
export const getORF = state => state['open-reading-frame']
