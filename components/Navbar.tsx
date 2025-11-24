import Link from 'next/link';
import { PenSquare } from 'lucide-react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-black/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-white/80 transition-colors">
          Blog<span className="text-white/40">.app</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/editor" className="btn btn-primary flex items-center gap-2 text-sm">
              <PenSquare size={16} />
              New Post
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="btn btn-ghost text-sm">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary text-sm">Sign Up</button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
