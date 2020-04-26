import React from 'react'
import Tone from 'tone'

import { Button } from '../button'

import { store, useDispatch, useSelector } from '../../state/store'
import { getIsPlaying, controlsStart, controlsStop, controlsReverse, getReversed } from '../../state/controls'
import { incrementPlayhead, decrementPlayhead, setPlayhead } from '../../state/playhead'

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
  const isReversed = useSelector(getReversed)

  const play = () => dispatch(controlsStart())
  const pause = () => dispatch(controlsStop())
  const reverse = () => dispatch(controlsReverse())
  const playTranscription = () => {
    dispatch(setPlayhead(+Infinity))
    if (!isReversed) reverse()
    if (!isPlaying) play()
  }
  const playTranslation = () => {
    dispatch(setPlayhead(-Infinity))
    if (isReversed) reverse()
    if (!isPlaying) play()
  }
  const increment = () => dispatch(incrementPlayhead())
  const decrement = () => dispatch(decrementPlayhead())

  let buttonPlayOrPause
  if (isPlaying) {
    buttonPlayOrPause = (
      <Button onClick={pause} className='button pause'>
        Pause  &#9612;&#9612;
      </Button>
    )
  } else {
    buttonPlayOrPause = (
      <Button onClick={play} className='button play'>
        Play &#9658;
      </Button>
    )
  }

  let buttonPlayTrsOrPlayTrl
  if (isReversed) {
    buttonPlayTrsOrPlayTrl = (
      <Button onClick={playTranslation} className='button play'>
        Play Translation &#9658;
      </Button>
    )
  } else {
    buttonPlayTrsOrPlayTrl = (
      <Button onClick={playTranscription} className='button play'>
        Play Transcription &#9658;
      </Button>
    )
  }

  return (
    <>
      {buttonPlayOrPause}
      <Button onClick={reverse} className='button mode'>
        {isReversed ? 'Translation' : 'Transcription'}
      </Button>
      {buttonPlayTrsOrPlayTrl}
      <Button onClick={decrement} className='button ffrr'>
      &#x25c0;&#x25c0;
      </Button>
      <Button onClick={increment} className='button ffrr'>
      &#x25ba;&#x25ba;
      </Button>

    </>
  )
}
