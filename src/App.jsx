import './App.css';
import * as fcl from '@onflow/fcl'
import * as t from "@onflow/types";
import react, {useEffect, useState} from 'react'
import "./flow/config";
import {Money} from './script/GetAmount.js'
import {Deposit} from './transactions/Deposit.js'
import {Steal} from './transactions/Steal.js'
import './flow/config.js'
// 0x94925fdb92008088

fcl.config()
//  .put("app.detail.title", "My Flow NFT DApp")
//  .put("app.detail.icon", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat5.svg")
//  .put("accessNode.api", "https://rest-testnet.onflow.org")
//  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {
  const [money, setMoney] = useState(0);

  const f=async()=>{
    const res=await fcl.send([
      fcl.script(Money),
      fcl.args([])
    ]).then(fcl.decode)
    setMoney(res)
    console.log(res)
  }

  useEffect(()=>{
    f();
  });

  const [user, setUser] = useState();
  useEffect(()=>{
    console.log(user)
  },[user])

  const logIn =  () => {
    fcl.authenticate();
    fcl.currentUser().subscribe(setUser);
  }

  const logOut = async () => {
    await fcl.unauthenticate();
    setUser(null);
  }
  const depositTokens = async () => {
    const amountToDeposit = parseFloat(5);
    const transactionId = await fcl.send([
      fcl.transaction(Deposit),
      fcl.args([
        fcl.arg(amountToDeposit.toFixed(2), t.UFix64)
      ]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(100)
    ]).then(fcl.decode);

    console.log("Transaction ID: ", transactionId);
  }
  const stealTokens = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(Steal),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(100)
    ]).then(fcl.decode);

    console.log("Transaction ID: ", transactionId);
  };


  return (
    <div className="App">
      <h1>My Flow NFT DApp</h1>
      <h2>Current Address : {user && user.addr ? user.addr : ''}</h2>
      <h2>Current Balance: {money} </h2>
      {(user===null||user===undefined)?<button onClick={() => logIn()}>LogIn</button>:
      (user.loggedIn)?<button onClick={() => logOut()}>Logout</button>:<button onClick={() => logIn()}>LogIn</button>}
        {((user !== null)&&(user!==undefined)&&(user.loggedIn))?
        <>
          <button onClick={depositTokens}>Send</button>
          <button onClick={stealTokens}>Steal</button>
        </>:<></>}
        
    </div>
  );
}

export default App;