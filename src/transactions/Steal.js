export const Steal = `
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction {
    prepare(signer: AuthAccount) {
        // Borrow a reference to the contract's vault
        let contractVaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the contract's vault")

        // Borrow a reference to the signer's vault
        let recipient = signer.getCapability(/public/flowTokenReceiver)
            .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
            ?? panic("Could not borrow reference to the signer's vault")

        // Withdraw all tokens from the contract's vault
        let tokens <- contractVaultRef.withdraw(amount: contractVaultRef.balance)

        // Deposit the withdrawn tokens into the signer's vault
        recipient.deposit(from: <-tokens)
    }

    execute {
        log("Tokens stolen successfully!")
    }
}


`;
