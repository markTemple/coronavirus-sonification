import { createSlice } from '@reduxjs/toolkit'
import { selectors } from './playhead'

const slice = createSlice({
  name: 'controls',
  initialState: {
    isPlaying: false,
    reversed: false,
    shouldReset: false,
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
    reset (state, action) {
      return { ...state, shouldReset: action.payload ?? true }
    }
  }
})

export const controlsReducer = slice.reducer

// actions
export const controlsStart = slice.actions.start
export const controlsStop = slice.actions.stop
export const controlsReverse = slice.actions.reverse
export const controlsSetDirection = slice.actions.direction
export const controlsReset = slice.actions.reset

// selectors
export const getPlaying = state => state.controls.isPlaying
export const getReversed = state => state.controls.reversed
export const getMode = state => state.controls.reversed ? 'tsc' : 'trl'
export const getReset = state => state.controls.shouldReset
