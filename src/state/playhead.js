import { createSlice } from '@reduxjs/toolkit'
import { genome } from '../genome'

const boundPlayheadToGenome = (index) => {
  if (index <= 0) return 1
  if (index >= genome.length) return genome.length - 1
  return index
}

const slice = createSlice({
  name: 'playhead',
  initialState: 1,
  reducers: {
    set (state, action) {
      return boundPlayheadToGenome(action.payload)
    },
    increment (state, action) {
      const count = action.payload ?? 1
      return boundPlayheadToGenome(state + count)
    },
    decrement (state, action) {
      const count = action.payload ?? 1
      return boundPlayheadToGenome(state - count)
    },
  }
})

export const playheadReducer = slice.reducer

// actions
export const setPlayhead = slice.actions.set
export const incrementPlayhead = slice.actions.increment
export const decrementPlayhead = slice.actions.decrement

// selectors
export const getPlayhead = state => state.playhead
