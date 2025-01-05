'use client'

import { StreamChat } from 'stream-chat'
import { Chat, Channel, ChannelList, Window, MessageList, MessageInput } from 'stream-chat-react'
// @ts-ignore
import 'stream-chat-react/dist/css/v2/index.css'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useState, useEffect } from 'react'
import { useUserinfoStore } from '@/stores/userinfoStore'
import { useAuthStore } from '@/stores/authStore'

const API_KEY = process.env.NEXT_PUBLIC_STREAM_KEY ?? '';
const chatClient = StreamChat.getInstance(API_KEY);

const MessagesPage = () => {
  const [clientReady, setClientReady] = useState(false)
  const { user } = useAuthStore()
  const userInfo = useUserinfoStore((state) => state.userInfo)
  const fetchBasicInfo = useUserinfoStore((state) => state.fetchBasicInfo)

  useEffect(() => {
    if (user?.user_id) {
      fetchBasicInfo(user.user_id)
    }
  }, [user, fetchBasicInfo])

  useEffect(() => {
    const initChat = async () => {
      if (!user?.user_id || !chatClient || !userInfo) return

      try {
        const userId = user.user_id.toString();

        // Obtenir le token depuis notre API
        const response = await fetch('/api/stream/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        const { token } = await response.json();
        if (!token) throw new Error('Token non reçu');

        await chatClient.connectUser(
          {
            id: userId,
            name: userInfo.first_name || 'Utilisateur',
            image: userInfo.photo_url || undefined,
          },
          token
        )
        setClientReady(true)
      } catch (error) {
        console.error('Erreur de connexion au chat:', error)
      }
    }

    initChat()

    return () => {
      if (clientReady) {
        chatClient?.disconnectUser()
      }
    }
  }, [user, userInfo, clientReady])

  if (!user || !userInfo) {
    return <div>Chargement des informations utilisateur...</div>
  }

  if (!clientReady || !chatClient) {
    return <div>Chargement du chat...</div>
  }

  return (
    <>
	<div className="flex items-center gap-4 p-4">
	<SidebarTrigger className="text-xl" />
	<Separator orientation="vertical" className="mr-2 h-4" />
	<Breadcrumb>
	  <BreadcrumbList>
		<BreadcrumbItem>
		  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
		  <BreadcrumbLink className="text-xl">Messages</BreadcrumbLink>
		</BreadcrumbItem>
	  </BreadcrumbList>
	</Breadcrumb>
		</div>
      <div className="grid gap-8">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-[600px]">
          <Chat client={chatClient}>
            <div className="flex h-full">
              <div className="w-1/4 border-r dark:border-gray-800">
                <ChannelList
                  filters={{}}
                  sort={{}}
                  options={{}}
                />
              </div>
              <div className="w-3/4">
                <Channel>
                  <Window>
                    <MessageList />
                    <MessageInput />
                  </Window>
                </Channel>
              </div>
            </div>
          </Chat>
        </div>
      </div>
    </>
  )
}

export default MessagesPage
