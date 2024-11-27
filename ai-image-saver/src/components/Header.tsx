'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSession, signIn, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AI Image Generator
        </Link>
        {status === "authenticated" ? (
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={session.user?.image || ''} />
                <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <p className="text-sm font-medium">{session.user?.name}</p>
                <p className="text-xs text-gray-500">{session.user?.email}</p>
                <Button onClick={() => signOut()} className="w-full">Sign Out</Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
      </div>
    </header>
  )
}

