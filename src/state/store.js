import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import {
  Provider,
  createStoreHook,
  createDispatchHook,
  createSelectorHook
} from 'react-redux'

import { playheadReducer } from './playhead'
import { controlsReducer } from './controls'

const Context = React.createContext(null)
export const store = configureStore({
  reducer: {
    playhead: playheadReducer,
    controls: controlsReducer,
  }
})

export const useStore = createStoreHook(Context)
export const useDispatch = createDispatchHook(Context)
export const useSelector = createSelectorHook(Context)

export const StoreProvider = ({ children }) => (
  <Provider context={Context} store={store}>
    {children}
  </Provider>
)
