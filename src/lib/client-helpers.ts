import { env } from "~/env";

import { PasskeyKit, SACClient } from "passkey-kit";
import { Buffer } from "buffer";
import { Server } from "@stellar/stellar-sdk/minimal/rpc";

export const rpc = new Server(env.RPC_URL);





export const account = new PasskeyKit({
    rpcUrl: env.NEXT_PUBLIC_RPC_URL,
    networkPassphrase: env.NEXT_PUBLIC_NETWORK_PASSPHRASE,
    walletWasmHash: env.NEXT_PUBLIC_FACTORY_CONTRACT_ID,
});

export const sac = new SACClient({
    rpcUrl: env.NEXT_PUBLIC_RPC_URL,
    networkPassphrase: env.NEXT_PUBLIC_NETWORK_PASSPHRASE,
});
export const native = sac.getSACClient(env.NEXT_PUBLIC_NATIVE_CONTRACT_ID)