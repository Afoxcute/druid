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
      
      // Create temporary async functions to fetch user data
      async function fetchByEmail() {
        return await fetch(`/api/trpc/users.getUserByEmail?batch=1&input={"0":{"email":"${identifier}"}}`).then(res => res.json());
      }
      
      async function fetchByPhone() {
        return await fetch(`/api/trpc/users.getUserByPhone?batch=1&input={"0":{"phone":"${identifier}"}}`).then(res => res.json());
      }
      
      if (isEmail) {
        const response = await fetchByEmail();
        userData = response[0].result.data;
      } else {
        const response = await fetchByPhone();
        userData = response[0].result.data;
      }
      
      if (!userData) {
        throw new Error("User not found");
      }
      
      // Verify that the passkey address matches
      if (userData.passkeyCAddress !== passkeyCAddress) {
        throw new Error("Invalid passkey");
      }
      
      // Create a name field from firstName and lastName
      if (userData.firstName) {
        userData.name = userData.firstName + (userData.lastName ? ` ${userData.lastName}` : '');
      }
      
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
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