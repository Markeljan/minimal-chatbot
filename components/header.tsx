import {
    IconNextChat,
} from '@/components/ui/icons'
import { ThemeToggle } from '@/components/theme-toggle'

export async function Header() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-end w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
            <div className="absolute flex items-center left-0 lg:left-1/2 lg:-translate-x-1/2 gap-2 px-4 pointer-events-none">
                <p className='text-lg'>AI Chatbot</p>
                <IconNextChat className="w-6 h-6 dark:hidden" inverted />
                <IconNextChat className="hidden w-6 h-6 dark:block" />
            </div>

            <ThemeToggle />

        </header>
    )
}