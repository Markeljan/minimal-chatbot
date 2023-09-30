'use client'

import { useChat, type Message } from 'ai/react'
import { toast } from 'react-hot-toast'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'


export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[]
}

export function Chat({ initialMessages, className }: ChatProps) {
    const { messages, append, reload, stop, isLoading, input, setInput } =
        useChat({
            initialMessages,
            onResponse(response) {
                if (response.status === 401) {
                    toast.error(response.statusText)
                }
            }
        })
        
    return (
        <>
            <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
                {messages.length ? (
                    <>
                        <ChatList messages={messages} />
                        <ChatScrollAnchor trackVisibility={isLoading} />
                    </>
                ) : <></>
                }
            </div>
            <ChatPanel
                isLoading={isLoading}
                stop={stop}
                append={append}
                reload={reload}
                messages={messages}
                input={input}
                setInput={setInput}
            />
        </>
    )
}