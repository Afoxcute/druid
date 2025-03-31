import { env } from "~/env";

import { PasskeyKit, PasskeyServer, SACClient } from "passkey-kit";
import { Account, Keypair, StrKey } from "@stellar/stellar-sdk/minimal"
import { Buffer } from "buffer";
import { basicNodeSigner } from "@stellar/stellar-sdk/minimal/contract";
import { Server } from "@stellar/stellar-sdk/minimal/rpc";

export const rpc = new Server(env.NEXT_PUBLIC_RPC_URL);

export const mockPubkey = StrKey.encodeEd25519PublicKey(Buffer.alloc(32))
export const mockSource = new Account(mockPubkey, '0')

export const fundKeypair = new Promise<Keypair>(async (resolve) => {
    const now = new Date();

    now.setMinutes(0, 0, 0);

    const nowData = new TextEncoder().encode(now.getTime().toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', nowData);
    const keypair = Keypair.fromRawEd25519Seed(Buffer.from(hashBuffer))
    const publicKey = keypair.publicKey()

    rpc.getAccount(publicKey)
        .catch(() => rpc.requestAirdrop(publicKey))
        .catch(() => { })

    resolve(keypair)
})
export const fundPubkey = (await fundKeypair).publicKey()
export const fundSigner = basicNodeSigner(await fundKeypair, env.NEXT_PUBLIC_NETWORK_PASSPHRASE)

export const account = new PasskeyKit({
    rpcUrl: env.NEXT_PUBLIC_RPC_URL,
    networkPassphrase: env.NEXT_PUBLIC_NETWORK_PASSPHRASE,
    walletWasmHash: env.NEXT_PUBLIC_FACTORY_CONTRACT_ID,
});
// export const server = new PasskeyServer({
//     rpcUrl: env.RPC_URL,
//     launchtubeUrl: env.LAUNCHTUBE_URL,
//     launchtubeJwt: env.LAUNCHETUBE_JWT,
//     // mercuryProjectName: import.meta.env.VITE_mercuryProjectName,
//     mercuryUrl: env.MERCURYT_URL,
//     mercuryJwt: env.MERCURY_JWT,
// });

export const sac = new SACClient({
    rpcUrl: env.NEXT_PUBLIC_RPC_URL,
    networkPassphrase: env.NEXT_PUBLIC_NETWORK_PASSPHRASE,
});
export const native = sac.getSACClient(env.NEXT_PUBLIC_NATIVE_CONTRACT_ID)