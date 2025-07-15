import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t mt-auto py-6">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>
          Made with <span className="text-red-500">♥</span> by{" "}
          <Link
            href="https://sonnguyenhoang.com"
            className="underline hover:text-primary transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Son Nguyen
          </Link>{" "}
          in 2025.
        </p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <Link
            href="https://github.com/sonnguyenhoang"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://linkedin.com/in/sonnguyenhoang"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
