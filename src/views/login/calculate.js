
/** You are given coins of different denominations and a total amount of money amount. Write a function to compute the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1. You may assume that you have an infinite number of each kind of coin.
 *
Input: coins = [1,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1
Example 2:
Input: coins = [2], amount = 3
Output: -1} value
 */
export const calculateCoins = (amount, coins = [50, 25, 10, 5]) => {
  let remaining = amount;

  // we're going to have to track the amount as we sub from the value
  const numberOfCoins = coins.reduce((total, coin) => {
    const count = Math.floor(remaining / coin);

    remaining = amount % coin;

    return total + count;
  }, 0);

  if (!numberOfCoins || remaining) {
    return -1;
  }

  return numberOfCoins;
};