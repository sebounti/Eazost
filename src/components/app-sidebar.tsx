"use client"

import Link from "next/link"
import {
	ChevronUp,
	Home,
	Inbox,
	LogOut,
	MapPin,
	ShoppingCart,
	User2,
	MessageCircle,
	KeyRound
} from "lucide-react"
import { useEffect, useCallback } from "react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

// Stores
import { useUserinfoStore } from "@/stores/userinfoStore"

// Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Logement",
    url: "/dashboard/property",
    icon: Inbox,
  },
  {
    title: "Carte information",
    url: "/dashboard/infoCard",
    icon: MapPin,
  },
  {
    title: "Boutique",
    url: "/dashboard/ShopManage",
    icon: ShoppingCart,
  },
  {
	title: "Code Access",
	url: "/dashboard/acessCode",
	icon: KeyRound,
  },
  {
	title: "Messagerie",
	url: "/dashboard/Messages",
	icon: MessageCircle,
  },
  {
    title: "Deconnexion",
    url: "#",
    icon: LogOut,
    className: "text-red-500",
    onClick: () => signOut({ callbackUrl: '/login' })
  },
]

export function AppSidebar() {
  const { data: session, status } = useSession()
  const userInfo = useUserinfoStore((state) => state.userInfo)
  const fetchUserInfo = useUserinfoStore((state) => state.fetchBasicInfo)

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserInfo(session.user.id.toString())
    }
  }, [session?.user?.id, fetchUserInfo])

  // Si la session est en cours de chargement
  if (status === "loading") {
    return <div>Chargement...</div>
  }

  // Si l'utilisateur n'est pas connecté
  if (status === "unauthenticated") {
    window.location.href = "/login"
    return null
  }

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 h-full bg-slate-100"
      style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}
    >
      <SidebarContent>
        <SidebarHeader>
        </SidebarHeader>
        <SidebarGroup className="flex px-4 py-8">
          <SidebarGroupLabel className="text-lg font-bold text-black">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="flex py-4 items-center text-xl gap-4">
                    {item.onClick ? (
                      <button onClick={item.onClick} className="flex items-center gap-4 w-full">
                        <item.icon width={64} height={64} className="text-amber-500"/>
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <Link href={item.url} className="flex items-center gap-4 w-full">
                        <item.icon width={64} height={64} className="text-amber-500"/>
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4 p-2 h-18 group-data-[collapsible=icon]:items-center">
        <SidebarMenu className="w-full h-full">
          <SidebarMenuItem className="w-full h-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full h-full p-4">
                  <div className="flex items-center gap-3 w-full ">
                    {userInfo?.photo_url ? (
                      <Avatar>
                        <AvatarImage src={userInfo.photo_url} />
                      </Avatar>
                    ) : (
                      <User2 className="w-10 h-10 p-2 bg-gray-100 rounded-xl" />
                    )}
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-lg">{userInfo?.first_name || "Prénom"}</span>
                      <span className="text-sm text-gray-500">{session?.user?.email || "Email"}</span>
                    </div>
                    <ChevronUp className="ml-auto" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="text-sm bg-white text-gray-700 hover:bg-amber-200">
                  <Link href="/dashboard/account/profile">
                    <span>Mon compte</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-gray-700 hover:bg-amber-200">
                  <Link href="/dashboard/account/settings">
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-gray-700 hover:bg-amber-200">
                  <Link href="/logout">
                    <span>Déconnexion</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
