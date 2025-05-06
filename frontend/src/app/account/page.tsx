'use client'

import AccountProfile from "@/components/account-profile"

export default function AccountPage() {
  return (
    <div className="flex h-full w-full flex-col p-4 lg:p-0">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="w-full max-w-4xl flex justify-center">
          <AccountProfile />
        </div>
      </div>
    </div>
  )
}

