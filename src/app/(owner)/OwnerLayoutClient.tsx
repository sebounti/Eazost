"use client";

import { useSession } from "next-auth/react";
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function OwnerLayoutClient({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
