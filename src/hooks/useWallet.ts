import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

interface WalletState {
  address: string | null
  balance: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
  provider: ethers.BrowserProvider | null
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    provider: null
  })

  const [error, setError] = useState<string | null>(null)

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          const balance = await provider.getBalance(address)
          const network = await provider.getNetwork()
          
          setWallet({
            address,
            balance: ethers.formatEther(balance),
            isConnected: true,
            isConnecting: false,
            chainId: Number(network.chainId),
            provider
          })
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err)
      setError('Failed to check wallet connection')
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return
    }

    setWallet(prev => ({ ...prev, isConnecting: true }))
    setError(null)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const balance = await provider.getBalance(address)
      const network = await provider.getNetwork()

      setWallet({
        address,
        balance: ethers.formatEther(balance),
        isConnected: true,
        isConnecting: false,
        chainId: Number(network.chainId),
        provider
      })
    } catch (err: any) {
      console.error('Error connecting wallet:', err)
      setError(err.message || 'Failed to connect wallet')
      setWallet(prev => ({ ...prev, isConnecting: false }))
    }
  }

  const disconnectWallet = () => {
    setWallet({
      address: null,
      balance: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      provider: null
    })
    setError(null)
  }

  const sendTransaction = async (to: string, amount: string) => {
    if (!wallet.provider || !wallet.address) {
      throw new Error('Wallet not connected')
    }

    try {
      const signer = await wallet.provider.getSigner()
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount)
      })

      return tx
    } catch (err: any) {
      throw new Error(err.message || 'Transaction failed')
    }
  }

  const refreshBalance = async () => {
    if (wallet.provider && wallet.address) {
      try {
        const balance = await wallet.provider.getBalance(wallet.address)
        setWallet(prev => ({
          ...prev,
          balance: ethers.formatEther(balance)
        }))
      } catch (err) {
        console.error('Error refreshing balance:', err)
      }
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()

    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          checkIfWalletIsConnected()
        }
      }

      const handleChainChanged = () => {
        checkIfWalletIsConnected()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [checkIfWalletIsConnected])

  return {
    wallet,
    error,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    refreshBalance,
    clearError: () => setError(null)
  }
}
