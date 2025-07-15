import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { toast } from "sonner";

type User = { id: string; email: string } | null;

const AuthCtx = createContext<{
  user: User;
  login: (t: string) => void;
  logout: () => void;
}>({ user: null, login: () => {}, logout: () => {} });

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data);
    } catch {
      localStorage.removeItem("urlvy_token");
      setUser(null);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("urlvy_token")) fetchMe();
  }, []);

  const login = (t: string) => {
    localStorage.setItem("urlvy_token", t);
    fetchMe();
    toast.success("Logged in");
  };

  const logout = () => {
    localStorage.removeItem("urlvy_token");
    setUser(null);
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
