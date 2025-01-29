import { Dispatch, SetStateAction, memo, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { UIBlock, blockDefinitions } from './block';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import type { BlockActionContext } from '@/components/create-block';

interface BlockActionsProps {
  block: UIBlock;
  metadata: any;
  setMetadata: Dispatch<SetStateAction<any>>;
}

function PureBlockActions({ block, metadata, setMetadata }: BlockActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const blockDefinition = blockDefinitions.find(
    (definition) => definition.kind === block.kind,
  );

  if (!blockDefinition) {
    throw new Error('Block definition not found!');
  }

  const actionContext = {
    content: block.content,
    metadata,
    setMetadata,
  } satisfies BlockActionContext;

  return (
    <div className="flex flex-row gap-1">
      {blockDefinition.actions.map((action) => (
        <Tooltip key={action.description}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn('h-fit dark:hover:bg-zinc-700', {
                'p-2': !action.label,
                'py-1.5 px-2': action.label,
              })}
              onClick={async () => {
                setIsLoading(true);
                try {
                  await Promise.resolve(action.onClick(actionContext));
                } catch (error) {
                  toast.error('Failed to execute action');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={
                isLoading || block.status === 'streaming'
                  ? true
                  : action.isDisabled
                    ? action.isDisabled(actionContext)
                    : false
              }
            >
              {action.icon}
              {action.label}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{action.description}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export const BlockActions = memo(
  PureBlockActions,
  (prevProps: BlockActionsProps, nextProps: BlockActionsProps) => {
    if (prevProps.block.status !== nextProps.block.status) return false;
    if (prevProps.metadata !== nextProps.metadata) return false;

    return true;
  },
) as (props: BlockActionsProps) => JSX.Element;
