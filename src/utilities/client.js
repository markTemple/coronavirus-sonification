import { Client } from '@hapi/nes/lib/client'
import { useEffect, createContext, useState } from 'react'
import { useStore } from '../store';

const url = new URL(window.location.origin)
url.protocol = 'ws'
url.port = '3000'

export const client = new Client(url.href);

export function useServer () {
  const [isSuccessful, setSuccess] = useState(null)

  useEffect(() => {
    client.onConnect = () => setSuccess(true)
    client.onDisconnect = () => setSuccess(null)

    client.connect().catch(() => setSuccess(false))
    return () => client.disconnect().catch(() => setSuccess(false))
  }, [])

  return isSuccessful
}
