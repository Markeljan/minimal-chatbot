import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
    return (
        <p
            className={cn(
                'px-2 text-center text-xs leading-normal text-muted-foreground',
                className
            )}
            {...props}
        >
            Created by{' '}
            <ExternalLink href="https://github.com/markeljan/minimal-chatbot">Markeljan</ExternalLink>{' '}
            based on{' '}
            <ExternalLink href="https://github.com/vercel-labs/ai-chatbot">Vercel AI Chatbot</ExternalLink>
        </p>
    )
}