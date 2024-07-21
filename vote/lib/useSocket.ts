"use client"

import { useEffect } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { useAppContext } from './isConnectedContext';

export function useSocket({ endpoint, token }: { endpoint: string, token: object }) {
  // initialize the client using the server endpoint, e.g. localhost:8000
  // and set the auth "token" (in our case we're simply passing the username
  // for simplicity -- you would not do this in production!)
  // also make sure to use the Socket generic types in the reverse order of the server!
  const socket: Socket = socketIOClient(endpoint, {
    auth: {
      token: token,
    }
  })

  const { isConnected, setIsConnected } = useAppContext()

  useEffect(() => {
    console.log('useSocket useEffect', endpoint, socket)

    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [endpoint, setIsConnected, socket, token, isConnected]);

  return {
    isConnected,
    socket,
  };
}