import {
  ENDPOINT as _ENDPOINT,
  Currency,
  DEVNET_PROGRAM_ID,
  LOOKUP_TABLE_CACHE,
  MAINNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  Token,
  TOKEN_PROGRAM_ID,
  TxVersion,
} from '@raydium-io/raydium-sdk'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'

export const rpcUrl: string = 'https://api.devnet.solana.com'
export const rpcToken: string | undefined = undefined

export const wallet = Keypair.fromSecretKey(Buffer.from('<WALLET_PRIVATE_KEY>'))

export const connection = new Connection('https://api.devnet.solana.com')

export const PROGRAMIDS = DEVNET_PROGRAM_ID

export const ENDPOINT = _ENDPOINT

export const RAYDIUM_MAINNET_API = undefined

export const makeTxVersion = TxVersion.V0 // LEGACY

export const addLookupTableInfo = undefined // only mainnet. other = undefined

export const DEFAULT_TOKEN = {
  A: new Token(TOKEN_PROGRAM_ID, new PublicKey('4fYazNDtFCLRV58YEavMvNNk4BPPnH2CMSUNANLoabTE'), 9, 'A', 'A'),
  B: new Token(TOKEN_PROGRAM_ID, new PublicKey('4qWFcxXhh4az1hVPSQ14vpuUwakNNu6zxNX9pgFyC9Bq'), 9, 'B', 'B'),
  ['A-B-LP']: new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('4B8b2zV9TFd46apijwebNSFr9gRwkrc2JZWSXM2QqXCx'),
    9,
    'A-B',
    'A-B'
  ),
}
