import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Gym Tracker</Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-300">Dashboard</Link>
          <Link href="/history" className="hover:text-blue-300">History</Link>
          <Link href="/profile" className="hover:text-blue-300">Profile</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (hidden by default) */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="block px-3 py-2 hover:bg-gray-700">Dashboard</Link>
          <Link href="/history" className="block px-3 py-2 hover:bg-gray-700">History</Link>
          <Link href="/profile" className="block px-3 py-2 hover:bg-gray-700">Profile</Link>
        </div>
      </div>
    </nav>
  );
}