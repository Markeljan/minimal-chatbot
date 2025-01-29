'use client';

import { type HTMLAttributes, type ReactNode, useState } from 'react';
import type { ExtraProps } from 'react-markdown';

import { cn } from '@/lib/utils';

type CodeBlockProps<T extends boolean> = {
  children: ReactNode;
  className?: string;
  inline?: T;
} & ExtraProps &
  (T extends true
    ? HTMLAttributes<HTMLElement>
    : HTMLAttributes<HTMLPreElement>);

export function CodeBlock<T extends boolean>({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps<T>) {
  const [output, setOutput] = useState<string | null>(null);
  const [tab, setTab] = useState<'code' | 'run'>('code');

  if (inline) {
    return (
      <code
        className={cn(
          'text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md',
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  } else {
    return (
      <div className="not-prose flex flex-col">
        {tab === 'code' && (
          <pre
            {...props}
            className={`text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900`}
          >
            <code className="whitespace-pre-wrap break-words">{children}</code>
          </pre>
        )}

        {tab === 'run' && output && (
          <div className="text-sm w-full overflow-x-auto bg-zinc-800 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 border-t-0 rounded-b-xl text-zinc-50">
            <code>{output}</code>
          </div>
        )}
      </div>
    );
  }
}
