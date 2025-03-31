"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "~/trpc/react";

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
      
      console.log(`Attempting to login with ${isEmail ? 'email' : 'phone'}: ${identifier}`);
      console.log(`Passkey address: ${passkeyCAddress}`);
      
      try {
        // Create properly encoded fetch requests
        const encodedIdentifier = encodeURIComponent(identifier);
        const endpoint = isEmail 
          ? `/api/trpc/users.getUserByEmail?batch=1&input={"0":{"email":"${encodedIdentifier}"}}`
          : `/api/trpc/users.getUserByPhone?batch=1&input={"0":{"phone":"${encodedIdentifier}"}}`;
        
        console.log("Fetching from endpoint:", endpoint);
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API response:", data);
        
        if (data[0]?.result?.data) {
          userData = data[0].result.data;
        } else {
          console.error("Unexpected API response format:", data);
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw new Error("Failed to fetch user data");
      }
      
      if (!userData) {
        console.error("User not found for identifier:", identifier);
        throw new Error("User not found");
      }
      
      // Verify that the passkey address matches
      console.log("Database passkey address:", userData.passkeyCAddress);
      console.log("Provided passkey address:", passkeyCAddress);
      
      if (userData.passkeyCAddress !== passkeyCAddress) {
        console.error("Passkey mismatch", {
          stored: userData.passkeyCAddress,
          provided: passkeyCAddress
        });
        throw new Error("Invalid passkey");
      }
      
      // Create a name field from firstName and lastName
      if (userData.firstName) {
        userData.name = userData.firstName + (userData.lastName ? ` ${userData.lastName}` : '');
      }
      
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      console.log("Login successful for user:", userData.id);
    } catch (error: any) {
      console.error("Login error:", error.message, error.stack);
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