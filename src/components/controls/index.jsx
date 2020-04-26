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
        Continue &#9658;
      </Button>
    )
  }

  let buttonPlayTrsOrPlayTrl
  if (isReversed) {
    buttonPlayTrsOrPlayTrl = (
      <Button onClick={playTranslation} className='button play'>
        Start Translation &#x25ba;&#x25ba;
      </Button>
    )
  } else {
    buttonPlayTrsOrPlayTrl = (
      <Button onClick={playTranscription} className='button pause'>
        &#x25c0;&#x25c0; Start Transcription
      </Button>
    )
  }

  return (
    <>
      {/* {buttonPlayTrsOrPlayTrl} */}
      <Button onClick={playTranslation} className='button play'>
        Start Translation &#x25ba;&#x25ba;
      </Button>

      {buttonPlayOrPause}

      <Button onClick={reverse} className='button mode'>
        {isReversed ? 'Switch' : 'Switch' }
      </Button>

      <Button onClick={playTranscription} className='button pause'>
        &#x25c0;&#x25c0; Start Transcription
      </Button>

      {/* <Button onClick={decrement} className='button ffrr'>
      &#x25c0;&#x25c0;
      </Button>
      <Button onClick={increment} className='button ffrr'>
      &#x25ba;&#x25ba;
      </Button> */}

    </>
  )
}
