'use client'
import { useTransition } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { IconMoon, IconSpinner, IconSun } from '@/components/ui/icons'
import useIsClientMounted from '@/lib/hooks/use-is-client-mounted'


export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [_, startTransition] = useTransition()
    const isClientMounted = useIsClientMounted()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => {
                startTransition(() => {
                    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
                })
            }}
        >
            {isClientMounted ? (
                <>
                    {resolvedTheme === 'light' ? (
                        <IconSun className="transition-all" />
                    ) : (
                        <IconMoon className="transition-all" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </>
            ) : <IconSpinner className='animate-spin' />}
        </Button>
    )
}