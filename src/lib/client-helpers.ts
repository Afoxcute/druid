import { env } from "~/env";

import { PasskeyKit, PasskeyServer, SACClient } from "passkey-kit";
import { Account, Keypair, StrKey } from "@stellar/stellar-sdk/minimal"
import { Buffer } from "buffer";
import { basicNodeSigner } from "@stellar/stellar-sdk/minimal/contract";
import { Server } from "@stellar/stellar-sdk/minimal/rpc";

export const rpc = new Server(env.NEXT_PUBLIC_RPC_URL);

export const mockPubkey = StrKey.encodeEd25519PublicKey(Buffer.alloc(32))
export const mockSource = new Account(mockPubkey, '0')

// Create a promise for the keypair that will be resolved later
let keypairPromise: Promise<Keypair>;
let fundPubkeyValue: string;
let fundSignerValue: any;

// Initialize the keypair and related values
export const initializeFundKeypair = async () => {
    if (!keypairPromise) {
        keypairPromise = new Promise<Keypair>(async (resolve) => {
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
        });
    }
    
    const keypair = await keypairPromise;
    fundPubkeyValue = keypair.publicKey();
    fundSignerValue = basicNodeSigner(keypair, env.NEXT_PUBLIC_NETWORK_PASSPHRASE);
    
    return {
        keypair,
        publicKey: fundPubkeyValue,
        signer: fundSignerValue
    };
};

// Getter functions to access the values after initialization
export const getFundKeypair = () => keypairPromise;
export const getFundPubkey = () => fundPubkeyValue;
export const getFundSigner = () => fundSignerValue;

// Initialize immediately if in a browser environment
if (typeof window !== 'undefined') {
    initializeFundKeypair().catch(console.error);
}

export const account = new PasskeyKit({
    rpcUrl: env.NEXT_PUBLIC_RPC_URL,
    networkPassphrase: env.NEXT_PUBLIC_NETWORK_PASSPHRASE,
    walletWasmHash: env.NEXT_PUBLIC_FACTORY_CONTRACT_ID,
});

// Server-side only component
// This should only be imported from server-side code
export const server = new PasskeyServer({
    rpcUrl: env.NEXT_PUBLIC_RPC_URL,
    launchtubeUrl: "https://testnet.launchtube.xyz", // Hardcoded for client
    launchtubeJwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4N2QyYmQ0ZGM0N2NhNDMxNTdkMmIxZTA5YWJhMDEyMjIzNTk4YzAzYzgxMjJjYjZmMTBlZDE2ZDY1Y2YzMTlmIiwiZXhwIjoxNzUwNDEyNzYwLCJjcmVkaXRzIjoxMDAwMDAwMDAwLCJpYXQiOjE3NDMxNTUxNjB9.Jrk_thIbYjBerDV6A8q3ikjBnG3e-PwD1HNG39DgPX8",                // Hardcoded for client
    mercuryUrl: "https://api.mercurydata.app",       // Hardcoded for client
    mercuryJwt: "JWT-placeholder",                   // Hardcoded for client
});

export const sac = new SACClient({
    rpcUrl: env.NEXT_PUBLIC_RPC_URL,
    networkPassphrase: env.NEXT_PUBLIC_NETWORK_PASSPHRASE,
});

// Initialize SACClient with the native contract ID
let nativeClient: any;
export const initializeNative = async () => {
    if (!nativeClient) {
        nativeClient = sac.getSACClient(env.NEXT_PUBLIC_NATIVE_CONTRACT_ID);
    }
    return nativeClient;
};

// Getter function for the native client
export const getNative = () => nativeClient;