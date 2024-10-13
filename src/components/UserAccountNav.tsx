'use client';
import { User } from 'next-auth'
import React from 'react'
import { DropdownMenu, DropdownMenuContent , DropdownMenuTrigger , DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import UserAvatar from './UserAvatar';

type Props = {
    user: User
}

const UserAccountNav = ({ user }: Props) => {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger><UserAvatar user={user} /></DropdownMenuTrigger>
    <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/">Baka</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut().catch(console.error);
          }}
          className="text-red-600 cursor-pointer"
        >
          Sign out
          <LogOut className="w-4 h-4 ml-2 " />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default UserAccountNav