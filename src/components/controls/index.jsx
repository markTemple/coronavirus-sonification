import React from 'react'
import Tone from 'tone'

import { Button } from '../button'

import { store, useDispatch, useSelector } from '../../state/store'
import { getPlaying, controlsStart, controlsStop, controlsReverse, getReversed, controlsReset } from '../../state/controls'
import { incrementPlayhead, decrementPlayhead, setPlayhead } from '../../state/playhead'

store.subscribe(() => {
  const isPlaying = getPlaying(store.getState())

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
//16n
  store.dispatch(action())
}, '1m')

export const Controls = () => {
  const dispatch = useDispatch()
  const isPlaying = useSelector(getPlaying)
  const isReversed = useSelector(getReversed)

  const play = () => dispatch(controlsStart())
  const pause = () => dispatch(controlsStop())
  const reverse = () => dispatch(controlsReverse())
  const playTranscription = () => {
    dispatch(setPlayhead(+Infinity))
    if (!isReversed) reverse()
    // if (!isPlaying) play()
  }
  const playTranslation = () => {
    dispatch(controlsReset(true))
    dispatch(setPlayhead(-Infinity))
    if (isReversed) reverse()
    // if (!isPlaying) play()
  }
  const increment = () => dispatch(incrementPlayhead())
  const decrement = () => dispatch(decrementPlayhead())

  let buttonPlayOrPause
  if (isPlaying) {
    buttonPlayOrPause = (
      <Button onClick={pause} className='button pausecont'>
        Stop  &#9612;&#9612;
      </Button>
    )
  } else {
    buttonPlayOrPause = (
      <Button onClick={play} className='button pausecont'>
        Play &#x25c0;&#9658;
      </Button>
    )
  }

  // let buttonPlayTrsOrPlayTrl
  // if (isReversed) {
  //   buttonPlayTrsOrPlayTrl = (
  //     <Button onClick={playTranslation} className='button trl'>
  //       Start Translation &#x25ba;&#x25ba;
  //     </Button>
  //   )
  // } else {
  //   buttonPlayTrsOrPlayTrl = (
  //     <Button onClick={playTranscription} className='button pause'>
  //       &#x25c0;&#x25c0; Start Transcription
  //     </Button>
  //   )
  // }

  return (
    <>
      {/* {buttonPlayTrsOrPlayTrl} */}
      <Button onClick={playTranslation} className='button trl'>
      &#x25c0;&#x25c0; 1bp Translation
      </Button>

      {buttonPlayOrPause}

      <Button onClick={reverse} className='button switch'>
        {isReversed ? 'Switch' : 'Switch' }
      </Button>

      <Button onClick={playTranscription} className='button tsc'>
        29903bp Transcription &#x25ba;&#x25ba;
      </Button>

      {/*  <Button onClick={decrement} className='button ffrr'>
      &#x25c0;&#x25c0;
      </Button>
     <Button onClick={increment} className='button ffrr'>
      &#x25ba;&#x25ba;
      </Button> */}

    </>
  )
}
