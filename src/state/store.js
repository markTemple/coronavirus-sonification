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
import { synthStatusReducer } from './synth-status'
import { openReadingFrameReducer } from './open-reading-frame'
import { aminoAcidCountReducer } from './amino-acid-count'

const Context = React.createContext(null)
export const store = configureStore({
  reducer: {
    playhead: playheadReducer,
    controls: controlsReducer,
    'synth-status': synthStatusReducer,
    'open-reading-frame': openReadingFrameReducer,
    'amino-acid-count': aminoAcidCountReducer,
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
