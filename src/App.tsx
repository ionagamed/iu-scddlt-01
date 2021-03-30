/* eslint-disable-next-line */
import { Button, Container } from '@material-ui/core'

import haravsetbsDistance from 'haversine-distance'
import React, { useState } from 'react'
import './App.css'
import { useEthereumInit } from './components/ethereum'

function App () {
  const [balance, setBalance] = useState<number | undefined>(undefined)
  const [amountToTransfer, setAmountToTransfer] = useState<number>(0)
  const [addressToTransfer, setAddressToTransfer] = useState<string>('')

  const eth = useEthereumInit()
  if (eth.fallback) {
    return eth.fallback
  }
  const { ethereum, provideEthereum } = eth

  function geoFindMe (): Promise<{ lat: number, lon: number }> {
    return new Promise((resolve, reject) => {
      function success (position: any) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        resolve({ lat: latitude, lon: longitude })
      }

      function error () {
        reject(new Error('error finding location'))
      }

      if (!navigator.geolocation) {
        reject(new Error('error finding location'))
      } else {
        navigator.geolocation.getCurrentPosition(success, error)
      }
    })
  }

  async function updateBalance () {
    const balance = await ethereum.getMyBalance()
    setBalance(balance)
  }

  async function generateToken () {
    const coords = await geoFindMe()

    const lat = 55.7512495
    const lon = 48.7422761

    const distance = haravsetbsDistance({ lat, lon }, coords)
    console.log(distance)

    if (distance > 30) {
      alert('You are very-very far away from the Sports Complex')
    } else {


      await ethereum.generateToken(distance)
      await updateBalance()
    }
  }

  async function sendTokens () {
    await ethereum.sendTokens(addressToTransfer, amountToTransfer)
    await updateBalance()
  }

  updateBalance()

  return (
    <Container>{provideEthereum(
      <div>
        <div>
          Balance: {balance}
        </div>
        <Button onClick={() => generateToken()}>
          Generate new token (but only if you are near SC)
        </Button>
        <hr/>
        <input type="number" onChange={e => setAmountToTransfer(Number(e.target.value))} placeholder="how much"/>
        <input type="text" onChange={e => setAddressToTransfer(e.target.value)} placeholder="to which address"/>
        <Button onClick={() => sendTokens()}>
          send
        </Button>
      </div>
    )}</Container>
  )
}

export default App

