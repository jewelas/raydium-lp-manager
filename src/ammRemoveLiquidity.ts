import assert from 'assert'

import { jsonInfo2PoolKeys, Liquidity, LiquidityPoolKeys, TokenAmount } from '@raydium-io/raydium-sdk'
import { Keypair, PublicKey } from '@solana/web3.js'

import { connection, DEFAULT_TOKEN, makeTxVersion, wallet } from '../config'
import { formatAmmKeysById } from './formatAmmKeysById'
import { buildAndSendTx, getWalletTokenAccount, sleepTime } from './util'
import { BN } from 'bn.js'

type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = {
  removeLpTokenAmount: TokenAmount
  targetPool: string
  walletTokenAccounts: WalletTokenAccounts
  wallet: Keypair
}

const THRESHOLD = new BN('1000000000000')
const REMOVE_LP_AMOUNT = new BN('1000000000')

async function ammRemoveLiquidity(input: TestTxInputInfo) {
  // -------- pre-action: fetch basic info --------
  const targetPoolInfo = await formatAmmKeysById(input.targetPool)
  assert(targetPoolInfo, 'cannot find the target pool')

  // -------- step 1: make instructions --------
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys
  const removeLiquidityInstructionResponse = await Liquidity.makeRemoveLiquidityInstructionSimple({
    connection,
    poolKeys,
    userKeys: {
      owner: input.wallet.publicKey,
      payer: input.wallet.publicKey,
      tokenAccounts: input.walletTokenAccounts,
    },
    amountIn: input.removeLpTokenAmount,
    makeTxVersion,
  })

  return { txids: await buildAndSendTx(removeLiquidityInstructionResponse.innerTransactions) }
}

async function howToUse() {
  const lpToken = DEFAULT_TOKEN['A-B-LP']
  const removeLpTokenAmount = new TokenAmount(lpToken, 1)
  const targetPool = 'BvUTtef5CXGodkuNsMGAan2KRPL4zGv3i4YDoM6RXVdV'
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)
}

async function main() {
  const lpToken = DEFAULT_TOKEN['A-B-LP']
  const removeLpTokenAmount = new TokenAmount(lpToken, REMOVE_LP_AMOUNT)
  const targetPool = 'BvUTtef5CXGodkuNsMGAan2KRPL4zGv3i4YDoM6RXVdV'
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)

  const poolInfo = await formatAmmKeysById(targetPool)

  setInterval(async () => {
    const baseVaultAmount = new BN(
      (await connection.getTokenAccountBalance(new PublicKey(poolInfo.baseVault))).value.amount
    )

    console.log(baseVaultAmount.toString())

    if (baseVaultAmount.gte(THRESHOLD)) {
      const txIds = await ammRemoveLiquidity({
        removeLpTokenAmount,
        targetPool,
        walletTokenAccounts,
        wallet: wallet,
      })
      console.log(txIds)
      await sleepTime(2000)
    }
  }, 10000)
}

main()
