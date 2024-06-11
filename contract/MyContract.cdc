import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub contract VaultContract {

    pub var totalDeposits: UFix64

    init() {
        self.totalDeposits = 0.0
    }

    pub fun depositTokens(amount: UFix64) {
        self.totalDeposits = self.totalDeposits + amount
    }

    pub fun getDepositedAmount(): UFix64 {
        return self.totalDeposits
    }

    pub fun stealTokens(): UFix64 {
        let amountToSteal = self.totalDeposits
        self.totalDeposits = 0.0
        return amountToSteal
    }
    

}
