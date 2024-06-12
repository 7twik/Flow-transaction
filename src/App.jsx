import './App.css';
import * as fcl from '@onflow/fcl';
import { useEffect, useState } from 'react';
import './flow/config';

// Ensure to replace with your actual contract address
const CONTRACT_ADDRESS = '0xf50bf6c131609ba6';

fcl.config()
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');

function App() {
  const [user, setUser] = useState();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  const logIn = () => {
    fcl.authenticate();
  };

  const logOut = async () => {
    await fcl.unauthenticate();
    setUser(null);
  };

  const depositTokens = async () => {
    try {
      const res = await fcl.send([
        fcl.transaction`
          import StealableVa from ${CONTRACT_ADDRESS}
          import FungibleToken from 0x9a0766d93b6608b7
          import FlowToken from 0x7e60df042a9c0868

          transaction {
            prepare(acct: AuthAccount) {
              let vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                ?? panic("Could not borrow reference to the owner's Vault!")
              let depositAmount: UFix64 = 3.0
              let depositVault <- vaultRef.withdraw(amount: depositAmount)

              StealableVa.deposit(from: <-depositVault)

            }
          }
        `,
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(100)
      ]);
      console.log('Deposit Tokens:', res);
      const result = await fcl.tx(res).onceSealed();
      console.log('Deposit Tokens:', result);
    } catch (error) {
      console.error('Failed to deposit tokens:', error);
    }
  };

  const stealTokens = async () => {
    try {
      const res = await fcl.send([
        fcl.transaction`
          import StealableVa from ${CONTRACT_ADDRESS}
          import FungibleToken from 0x9a0766d93b6608b7
          import FlowToken from 0x7e60df042a9c0868

          transaction {
            prepare(acct: AuthAccount) {
              
               let stolenVault <- StealableVa.steal()
              let vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                ?? panic("Could not borrow reference to the owner's Vault!")
              vaultRef.deposit(from: <-stolenVault)

            }
          }
        `,
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(100)
      ]);
      console.log('Steal Tokens:', res);
      const result = await fcl.tx(res).onceSealed();
      console.log('Steal Tokens:', result);
    } catch (error) {
      console.error('Failed to steal tokens:', error);
    }
  };

  const showFunds = async () => {
    try {
      const result = await fcl.query({
        cadence: `
          import StealableVa from ${CONTRACT_ADDRESS}

          pub fun main(): UFix64 {
            return StealableVa.getBalance()
          }
        `,
        args: () => []
      });
      setBalance(result);
    } catch (error) {
      console.error('Failed to fetch funds:', error);
    }
  };

  return (
    <div className="App">
      <h1>My Flow Token DApp</h1>
      <h2>Current Address: {user?.addr || ''}</h2>
      <h3>Contract Balance: {balance} FLOW</h3>
      {user?.loggedIn ? (
        <>
          <button onClick={logOut}>Logout</button>
          <button onClick={depositTokens}>Deposit Tokens</button>
          <button onClick={stealTokens}>Steal Tokens</button>
          <button onClick={showFunds}>Show Funds</button>
        </>
      ) : (
        <button onClick={logIn}>Log In</button>
      )}
    </div>
  );
}

export default App;
