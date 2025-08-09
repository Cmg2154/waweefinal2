import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import WalletConnect from './components/WalletConnect'
import TransactionForm from './components/TransactionForm'

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'forgot' | 'wallet' | 'transaction'>('wallet')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative overflow-hidden font-inter">
      {/* Meta Tags */}
      <head>
        <meta property="og:title" content="Web3 Authentication App - Built with ChatAndBuild" />
        <meta property="og:description" content="Modern Web3 authentication app with wallet integration and transaction capabilities" />
        <meta property="og:image" content="https://cdn.chatandbuild.com/images/preview.png" />
        <meta property="keywords" content="no-code, app builder, conversation-driven development, web3, react, typescript, wallet, ethereum" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Web3 Authentication App - Built with ChatAndBuild" />
        <meta property="twitter:description" content="Modern Web3 authentication app with wallet integration and transaction capabilities" />
        <meta property="twitter:image" content="https://cdn.chatandbuild.com/images/preview.png" />
        <meta property="twitter:site" content="@chatandbuild" />
      </head>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Web3 Auth</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('wallet')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'wallet' || currentView === 'transaction'
                  ? 'bg-white/30 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Wallet
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'login' || currentView === 'signup' || currentView === 'forgot'
                  ? 'bg-white/30 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Auth
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="w-full max-w-md">
          {currentView === 'wallet' && (
            <WalletConnect onTransactionClick={() => setCurrentView('transaction')} />
          )}
          {currentView === 'transaction' && (
            <TransactionForm onBack={() => setCurrentView('wallet')} />
          )}
          {currentView === 'login' && (
            <LoginForm 
              onSwitchToSignup={() => setCurrentView('signup')}
              onSwitchToForgot={() => setCurrentView('forgot')}
            />
          )}
          {currentView === 'signup' && (
            <SignupForm onSwitchToLogin={() => setCurrentView('login')} />
          )}
          {currentView === 'forgot' && (
            <ForgotPasswordForm onSwitchToLogin={() => setCurrentView('login')} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
