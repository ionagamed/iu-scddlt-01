import { Button } from '@material-ui/core'
import React, { ReactElement, useContext, useState } from 'react'
import Web3 from 'web3'

const abi = [
  {
    "inputs": [
      {
        "internalType": "int32",
        "name": "meters",
        "type": "int32"
      }
    ],
    "name": "generateToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "amount",
        "type": "uint32"
      }
    ],
    "name": "sendTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin_address",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const address = '0x947EEffC14B41CeAfDF443850C4E77704a7c7ade'

declare global {
  interface Window {
    web3: Web3
    ethereum: any
  }
}

interface Ok {
  fallback?: undefined
  ethereum: Ethereum
  provideEthereum: (x: ReactElement) => ReactElement
}

interface NotOk {
  fallback: ReactElement
  ethereum?: undefined
  provideEthereum?: undefined
}

type UseEthereumResult = Ok | NotOk

class Ethereum {
  constructor (
    public account: string,
    private contract = new window.web3.eth.Contract(abi as any, address)
  ) {
    window.web3.defaultAccount = account
  }

  async getMyBalance (): Promise<number> {
    // return await this.contract.methods.balances().call({ address: this.account })
    return await this.contract.methods.balances(this.account).call({ from: this.account })
  }

  async generateToken (meters: number): Promise<number> {
    return await this.contract.methods.generateToken(meters).send({ from: this.account })
  }

  async sendTokens (to: string, amount: number): Promise<void> {
    return await this.contract.methods.sendTokens(to, amount).send({ from: this.account, value: 343 * 10 ** 12 })
  }
}

const EthereumContext = React.createContext<Ethereum | undefined>(undefined)

export function useEthereumInit (): UseEthereumResult {
  const [account, setAccount] = useState<string | undefined>(undefined)

  if (window.ethereum === undefined) {
    return { fallback: <>Metamask is not installed</> }
  }

  if (!account) {
    return {
      fallback: <MetamaskRequest onAccount={(x: string) => setAccount(x)}/>
    }
  }

  window.web3 = new Web3(window.ethereum)
  window.ethereum.enable()

  const ethereum = new Ethereum(account)
  return {
    provideEthereum: (x) =>
      <EthereumContext.Provider value={ethereum}>{x}</EthereumContext.Provider>,
    ethereum,
    fallback: undefined
  }
}

export function useEthereum (): Ethereum {
  return useContext(EthereumContext) as Ethereum
}

function MetamaskRequest ({ onAccount }: { onAccount: (x: string) => void }) {
  function connectMetamask () {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((x: string[]) => onAccount(x[0]))
  }

  return <Button variant={'contained'} onClick={connectMetamask}>Connect MetaMask account</Button>
}
