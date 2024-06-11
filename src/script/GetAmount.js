export const Money=`
import VaultContract from 0xf50bf6c131609ba6

pub fun main(): UFix64 {
    return VaultContract.getDepositedAmount()
}
`;