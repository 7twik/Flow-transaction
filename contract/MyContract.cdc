import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub contract StealableVa {

    pub resource Vault: FungibleToken.Receiver {
        pub var balance: UFix64
        pub var tokens: @FungibleToken.Vault

        init() {
            self.balance = 0.0
            self.tokens <- FlowToken.createEmptyVault()
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            self.tokens.deposit(from: <-from)
            self.balance = self.tokens.balance
        }

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            var withdrawnVault <- FlowToken.createEmptyVault()
            let withdrawnTokens <- self.tokens.withdraw(amount: amount)
            withdrawnVault.deposit(from: <-withdrawnTokens)
            self.balance = self.tokens.balance
            return <-withdrawnVault
        }

        destroy() {
            destroy self.tokens
        }
    }

    pub var vault: @Vault

    init() {
        self.vault <- create Vault()
    }

    pub fun deposit(from: @FungibleToken.Vault) {
        self.vault.deposit(from: <-from)
    }

    pub fun steal(): @FungibleToken.Vault {
        return <-self.vault.withdraw(amount: self.vault.balance)
    }

    pub fun getBalance(): UFix64 {
        return self.vault.balance
    }
}
