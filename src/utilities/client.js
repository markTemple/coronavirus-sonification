import { Client } from '@hapi/nes/lib/client'
import { useEffect, createContext, useState } from 'react'
import { useStore } from '../store';

export const client = new Client('ws://localhost:3000');

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
