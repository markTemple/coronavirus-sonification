import React, { createContext, useReducer, useContext } from 'react'

const initial = {
  genome: '',
  index: 0,
  markstamp: null
}

export const StoreContext = createContext(initial)

export function StoreProvider ({ children }) {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'set-genome':
        return { ...state, genome: action.payload }
      case 'set-markstamp':
        return { ...state, markstamp: action.payload }
      case 'increment-index': {
        const genome = state.genome
        const index = state.index + 1

        if (index >= genome.length)  return { ...state, index: 0 }
        else return { ...state, index }
      }
      case 'decrement-index': {
        const genome = state.genome
        const index = state.index - 1

        if (index <= 0) return { ...state, index: genome.length - 1 }
        else return { ...state, index }
      }
      case 'set-index': {
        const genome = state.genome
        const index = Number(action.payload)

        if (!Number.isInteger(index)) return state
        if (index < 0) return { ...state, index: genome.length - 1 }
        if (index >= genome.length)  return { ...state, index: 0 }
        return { ...state, index }
      }
      default:
        return state
    }
  }, initial)

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  )
}
