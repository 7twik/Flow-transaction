export const Deposit=
`import VaultContract from 0xf50bf6c131609ba6
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction(amount: UFix64) {

    prepare(signer: AuthAccount) {
        let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")
        
        let deposit <- vaultRef.withdraw(amount: amount)
        VaultContract.depositTokens(amount: amount)

        // Destroy the withdrawn tokens, as they're recorded in the contract state
        destroy deposit
    }

    execute {
        log("Deposit successful!")
    }
}
`;