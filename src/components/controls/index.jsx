import React from 'react'
import Tone from 'tone'

import { Button } from '../button'

import { store, useDispatch, useSelector } from '../../state/store'
import { getIsPlaying, controlsStart, controlsStop, controlsReverse, getReversed } from '../../state/controls'
import { incrementPlayhead, decrementPlayhead } from '../../state/playhead'

store.subscribe(() => {
  const isPlaying = getIsPlaying(store.getState())

  if (isPlaying && Tone.Transport.state !== 'started') {
    Tone.Transport.start()
  }

  if (!isPlaying && Tone.Transport.state === 'started') {
    Tone.Transport.stop()
  }
})

Tone.Transport.scheduleRepeat(() => {
  const isReversed = getReversed(store.getState())
  const action = isReversed
    ? decrementPlayhead
    : incrementPlayhead

  store.dispatch(action())
}, '16n')

export const Controls = () => {
  const dispatch = useDispatch()
  const isPlaying = useSelector(getIsPlaying)

  const play = () => dispatch(controlsStart())
  const pause = () => dispatch(controlsStop())
  const reverse = () => dispatch(controlsReverse())
  const increment = () => dispatch(incrementPlayhead())
  const decrement = () => dispatch(decrementPlayhead())

  return (
    <>
      <Button onClick={play}>Play</Button>
      <Button onClick={pause}>Pause</Button>
      <Button onClick={reverse}>Reverse</Button>
      <Button onClick={increment}>Increment</Button>
      <Button onClick={decrement}>Decrement</Button>
    </>
  )
}
