import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo and Description */}
          <div className="text-center">
            <Image
              alt="Logo"
              width={50}
              height={50}
              src="/logo.png"
              className="mx-auto w-40 h-40"
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/portfolio"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex space-x-6">
            <Link
              href="https://facebook.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://twitter.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://instagram.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="https://linkedin.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://github.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Proco. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}