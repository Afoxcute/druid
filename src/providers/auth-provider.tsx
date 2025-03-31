"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  passkeyCAddress?: string | null;
  name?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, passkeyCAddress: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state from localStorage on client
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, passkeyCAddress: string) => {
    setIsLoading(true);
    try {
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      let userData;
      
      // Fetch user data
      if (isEmail) {
        const response = await fetch(
          `/api/trpc/users.getUserByEmail?input=${encodeURIComponent(JSON.stringify({ email: identifier }))}`
        );
        
        if (!response.ok) {
          console.error('Error fetching user data: HTTP error!', response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        userData = json.result.data;
      } else {
        const response = await fetch(
          `/api/trpc/users.getUserByPhone?input=${encodeURIComponent(JSON.stringify({ phone: identifier }))}`
        );
        
        if (!response.ok) {
          console.error('Error fetching user data: HTTP error!', response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        userData = json.result.data;
      }
      
      if (!userData) {
        throw new Error("User not found");
      }
      
      // Verify the passkey address if one exists
      if (userData.passkeyCAddress && userData.passkeyCAddress !== passkeyCAddress) {
        throw new Error("Invalid passkey");
      }
      
      // Update passkey address if not already set
      if (!userData.passkeyCAddress) {
        try {
          // Create signer object with proper type definition
          const saveSigner: {
            contractId: string;
            signerId: string;
            email?: string;
            phone?: string;
          } = {
            contractId: passkeyCAddress,
            signerId: userData.id.toString(),
          };
          
          if (isEmail) {
            saveSigner.email = identifier;
          } else {
            saveSigner.phone = identifier;
          }
          
          const response = await fetch('/api/trpc/stellar.saveSigner', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              json: saveSigner
            }),
          });
          
          if (!response.ok) {
            console.error('Error saving signer:', response.status);
          }
          
          // Update the local user data
          userData.passkeyCAddress = passkeyCAddress;
        } catch (error) {
          console.error('Error saving signer:', error);
          // Continue anyway - user can still log in
        }
      }
      
      // Create a display name
      if (userData.firstName) {
        userData.name = userData.firstName + (userData.lastName ? ` ${userData.lastName}` : '');
      }
      
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    router.push("/auth/signin");
  };

  // Auth redirection logic
  useEffect(() => {
    if (isLoading) return; // Skip during initial load

    const isAuthRoute = pathname.startsWith("/auth/");
    const isPublicRoute = pathname === "/" || isAuthRoute;

    if (!user && !isPublicRoute) {
      // Not authenticated and trying to access protected route
      router.push("/auth/signin");
    } else if (user && isAuthRoute) {
      // Already authenticated but trying to access auth routes
      router.push("/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 