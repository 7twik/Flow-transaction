export const Money=`
import VaultContrac from 0xf50bf6c131609ba6

pub fun main(): UFix64 {
    return VaultContrac.getDepositedAmount()
}
`;