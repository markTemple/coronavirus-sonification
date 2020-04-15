import { useRef, useEffect } from "react"

export const useSingleFramePrimitive = (initial) => {
  const ref = useRef(initial)

  useEffect(() => {
    ref.current = initial
  })

  return ref
}
