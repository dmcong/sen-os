import configs from 'configs';

const { env } = configs;

const sol = {}

/**
 * Development sol
 */
sol.development = {
  node: 'https://api.devnet.solana.com',
  spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  swapAddress: 'D8UuF1jPr5gtxHvnVz3HpxP2UkgtxLs9vwz7ecaTkrGy',
  senAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
  cluster: 'devnet',
}

/**
 * Production sol
 */
sol.production = {
  node: 'https://api.mainnet-beta.solana.com',
  spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
  senAddress: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
  cluster: 'mainnet',
}

export default sol[env];