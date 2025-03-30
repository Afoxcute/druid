import { useState } from "react";
import { api } from "~/trpc/react";
import { useContractStore } from "~/hooks/stores/useContractStore";
import { useKeyStore } from "~/hooks/stores/useKeyStore";
import { ClientTRPCErrorHandler } from "~/lib/utils";
import toast from "react-hot-toast";
import { account } from "~/lib/client-helpers";
import base64url from "base64url";

export const usePasskey = (identifier: string) => {
  const [loading, setLoading] = useState(false);
  const setContractId = useContractStore((state) => state.setContractId);
  const setKeyId = useKeyStore((state) => state.setKeyId);

  const { keyId } = useKeyStore.getState();

  const saveSigner = api.stellar.saveSigner.useMutation({
    onError: ClientTRPCErrorHandler,
  });

  // Initialize tRPC mutation
  const { mutateAsync: sendTransaction, error } = api.stellar.send.useMutation({
    onError: ClientTRPCErrorHandler,
  });

  // Create a function to handle the wallet creation process
  const create = async (): Promise<string> => {
    try {
      setLoading(true);
      
      // Use either email or phone as the user identifier
      if (!identifier) {
        throw new Error("Email or phone is required to create a passkey");
      }
      
      const user = "payu"; // App name or user context
      
      // Call the createWallet method with proper parameters
      const result = await account.createWallet(user, identifier);
      
      // Destructure all properties correctly
      const {
        keyId: keyIdBuffer,
        keyIdBase64,
        contractId: cid,
        signedTx
      } = result;
      
      // Convert keyId to base64url for storage if needed
      const keyIdBase64Url = base64url(keyIdBuffer);
      
      // Send the transaction to the Stellar network
      const txResult = await sendTransaction({
        xdr: signedTx.toXDR(),
      });
      
      if (txResult?.success) {
        // Store keyId and contractId in Zustand store
        setKeyId(keyIdBase64); // Use the base64 version
        setContractId(cid);

        // Determine if the identifier is an email or phone
        const isEmail = identifier.includes('@');
        
        await saveSigner.mutateAsync({
          contractId: cid,
          signerId: keyIdBase64,
          [isEmail ? 'email' : 'phone']: identifier,
        });
        
        return cid;
      }
      
      throw new Error("Failed to create Stellar passkey wallet");
    } catch (err) {
      const errorMessage = (err as Error)?.message ?? "Failed to create Stellar passkey";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const connect = async (): Promise<string> => {
    try {
      setLoading(true);
      
      // Connect to an existing wallet
      const result = await account.connectWallet({
        keyId: keyId || undefined, // Convert null to undefined
        getContractId: async (keyId) => {
          // Fetch the contract ID from your local storage or API
          // This is a simple approach for demo purposes
          const contractId = localStorage.getItem("contractId");
          if (!contractId) {
            throw new Error("Contract ID not found");
          }
          return contractId;
        },
      });
      
      const { keyIdBase64, contractId: cid } = result;

      // Store in state management
      setKeyId(keyIdBase64);
      setContractId(cid);

      console.log("KeyId: ", keyIdBase64);
      console.log("ContractId: ", cid);
      toast.success(`Successfully connected with passkey`);
      return cid;
    } catch (err) {
      const errorMessage = (err as Error)?.message ?? "Failed to connect with passkey";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sign = async (xdr: string): Promise<string> => {
    console.log("will sign with keyId:", keyId);
    const signedXDR = await account.sign(xdr, { keyId: String(keyId) });
    console.log("signed xdr", typeof signedXDR, signedXDR);
    return signedXDR.toXDR();
  };

  return { create, loading, error, sign, connect };
};
