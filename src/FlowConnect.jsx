import React, { useState, useEffect, useCallback, useRef } from 'react'

// @ts-ignore
import * as fcl from '@onflow/fcl'
// @ts-ignore
import * as types from '@onflow/types'



if (window.location.pathname === '/testnet') {
  fcl.config({
    'flow.network': 'testnet',
    'app.detail.title': 'Identity',
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'app.detail.icon': 'https://placekitten.com/g/200/200',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  })
} else {
  fcl.config({
    'flow.network': 'mainnet',
    'app.detail.title': 'Identity',
    'accessNode.api': 'https://rest-mainnet.onflow.org',
    'app.detail.icon': 'https://placekitten.com/g/200/200',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/authn',
  })
}

const FlowConnector = ({
  setUser,
  user,
}) => {
  
    function getFlowAccountLink() {
        return 'https://flowscan.org/account/'
      }
  const onLogout = () => {
    setUser({loggedIn: false})
    fcl.unauthenticate()
  }

  return (
    <div className="connector">
      <p className="title">{`FLOW ${
        user.loggedIn ? '⚡️' : ''
      }`}</p>
      {
        (!user.loggedIn && (
          <button className="button" onClick={fcl.authenticate}>
            Connect ♻️
          </button>
        ))}
      {user.loggedIn && (
        <div>
          <div className="account">
            <p>
              Account:{' '}
              <a
                href={getFlowAccountLink() + user}
                target="_blank"
                rel="noreferrer"
              >
                {user.addr}
              </a>
            </p>
            <p className="logout" onClick={onLogout}>
              ❌
            </p>
          </div>
          
      
          </div>
        
      )}
     
    </div>
  )
}

export default FlowConnector