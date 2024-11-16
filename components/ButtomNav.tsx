'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Home, Map } from 'lucide-react'

const BottomNav = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 animate-slide-up">
      <Link href="/" className={`flex flex-col items-center ${pathname === '/' ? 'text-blue-500' : 'text-gray-500'}`}>
        <Home className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </Link>
      <Link href="/gallery" className={`flex flex-col items-center ${pathname === '/gallery' ? 'text-blue-500' : 'text-gray-500'}`}>
        <Map className="w-6 h-6" />
        <span className="text-xs">Map</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center ${pathname === '/profile' ? 'text-blue-500' : 'text-gray-500'}`}>
        <User className="w-6 h-6" />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  )
}

export default BottomNav