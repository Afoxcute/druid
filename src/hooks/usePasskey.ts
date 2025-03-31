import { useState } from "react";
import { api } from "~/trpc/react";
import { useContractStore } from "~/hooks/stores/useContractStore";
import { useKeyStore } from "~/hooks/stores/useKeyStore";
import { ClientTRPCErrorHandler } from "~/lib/utils";
import toast from "react-hot-toast";
import { account } from "~/lib/client-helpers";

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
      
      const user = "payu";
      
      // Use the simplified createWallet function that handles the transaction internally
      const result = await account.createWallet(user, identifier);
      
      // Store the returned values
      const { keyIdBase64, contractId: cid } = result;
      
      // Store in Zustand
      setKeyId(keyIdBase64);
      setContractId(cid);
      
      // Determine if the identifier is an email or phone
      const isEmail = identifier.includes('@');
      
      // Save the signer info to your backend
      await saveSigner.mutateAsync({
        contractId: cid,
        signerId: keyIdBase64,
        [isEmail ? 'email' : 'phone']: identifier,
      });
      
      toast.success("Successfully created passkey wallet");
      return cid;
    } catch (err) {
      toast.error(
        (err as Error)?.message ?? "Failed to create Stellar passkey",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const connect = async (): Promise<string> => {
    try {
      setLoading(true);
      const { keyIdBase64, contractId: cid } = await account.connectWallet();

      setKeyId(keyIdBase64);
      setContractId(cid);

      console.log("KeyId: ", keyIdBase64);
      console.log("ContractId: ", cid);
      toast.success(`Successfully connected with passkey`);
      return cid;
    } catch (err) {
      toast.error((err as Error)?.message ?? "Failed to connect with passkey");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sign = async (xdr: string): Promise<string> => {
    console.log("will sign,", keyId);
    const signedXDR = await account.sign(xdr, { keyId: String(keyId) });
    console.log("signed xdr", typeof signedXDR, signedXDR);
    return signedXDR.toXDR();
  };

  return { create, loading, error, sign, connect };
};
