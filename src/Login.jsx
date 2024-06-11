// npm i @onflow/fcl @onflow/types
import React, { useState } from 'react';
import * as fcl from "@onflow/fcl";
import "./flow/config";

fcl.config();

const App = () => {
  const [user, setUser] = useState({ loggedIn: null });

  fcl.currentUser.subscribe(setUser);

  const logIn = () => {
    fcl.authenticate();
  };
  const sub = () => {
    const unsubscribe = fcl.currentUser.subscribe(currentUser => {
        console.log("The Current User", currentUser)
      })
    }
  const logOut = async() => {
    await fcl.unauthenticate();
    setUser({loggedIn: false})
  };
  const info = async () => {
    const currentUser = await fcl.currentUser.snapshot()
console.log("The Current User", currentUser)
  }

  return (
    <div>
      <h1>Flow dApp</h1>
      {user.loggedIn ? (
        <>
          <button onClick={logOut}>Log Out</button>
          <p>Address: {user.addr}</p>
        </>
      ) : (
        <button onClick={logIn}>Log In</button>
      )}
      <button onClick={sub}>Subscribe</button>
      <button onClick={info}>Info</button>
    </div>
  );
};

export default App;
