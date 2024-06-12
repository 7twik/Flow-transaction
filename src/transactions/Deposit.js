export const Deposit = `
import VaultContrac from 0xf50bf6c131609ba6
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction(amount: UFix64, recipient: Address) {

    prepare(signer: AuthAccount) {
        let sender = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow Provider reference to the Vault")

        let receiverAccount = getAccount(recipient)

        let receiver = receiverAccount.getCapability(/public/flowTokenReceiver)
            .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
            ?? panic("Could not borrow Receiver reference to the Vault")

        // Withdraw the specified amount from the sender's vault
        let tempVault <- sender.withdraw(amount: amount)
        receiver.deposit(from: <- tempVault)
        
        // Deposit the amount to the VaultContract
        VaultContrac.depositTokens(amount: amount)
    }

    execute {
        log("Deposit successful!")
    }
}
`;
