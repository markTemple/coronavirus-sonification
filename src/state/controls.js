import { createSlice } from '@reduxjs/toolkit'
import { selectors } from './playhead'

const slice = createSlice({
  name: 'controls',
  initialState: {
    isPlaying: false,
    reversed: false,
  },
  reducers: {
    start (state) {
      return { ...state, isPlaying: true }
    },
    stop (state) {
      return { ...state, isPlaying: false }
    },
    reverse (state) {
      return { ...state, reversed: !state.reversed }
    },
    direction (state, action) {
      return { ...state, reversed: action.payload }
    },
  }
})

export const controlsReducer = slice.reducer

// actions
export const controlsStart = slice.actions.start
export const controlsStop = slice.actions.stop
export const controlsReverse = slice.actions.reverse
export const controlsSetDirection = slice.actions.direction

// selectors
export const getIsPlaying = state => state.controls.isPlaying
export const getReversed = state => state.controls.reversed
export const getMode = state => state.controls.reversed ? 'tsc' : 'trl'
