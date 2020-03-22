import { useContext } from 'react'
import { StoreContext } from './store'
import { client } from './utilities/client'

function useStore () {
  const [state, dispatch] = useContext(StoreContext)
  return [state, (type, payload) => dispatch({ type, payload })]
}

export function useGenome () {
  const [state, dispatch] = useStore()

  function getGenome () {
    client.request({ method: 'get', path: '/dna' })
      .then((response) => {
        dispatch('set-genome', response.payload.genome)
      })
  }

  return [state.genome, getGenome]
}

export function useMarkstamp () {
  const [state, dispatch] = useStore()

  function subscribe () {
    client.subscribe('/markstamp', (response) => {
      dispatch('set-markstamp', response.markstamp)
    })
  }

  return [state.markstamp, subscribe]
}

export function useIndex () {
  const [state, dispatch] = useStore()

  const actions = {
    increment: () => dispatch('increment-index'),
    decrement: () => dispatch('decrement-index')
  }

  return [state.index, actions]
}
