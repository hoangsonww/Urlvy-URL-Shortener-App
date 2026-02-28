import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <div className="shell-glow" />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
