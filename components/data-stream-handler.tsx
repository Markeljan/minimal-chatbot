'use client';

import { initialBlockData, useBlock } from '@/hooks/use-block';
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';

import { BlockKind, blockDefinitions } from './block';

export type DataStreamDelta = {
  type:
    | 'text-delta'
    | 'code-delta'
    | 'image-delta'
    | 'title'
    | 'id'
    | 'clear'
    | 'finish'
    | 'user-message-id'
    | 'kind';
  content: string;
};

export function DataStreamHandler({ id }: { id: string }) {
  const [userMessageId, setUserMessageId] = useState<string | null>(null);
  const { data: dataStream } = useChat({ id });
  const { block, setBlock, setMetadata } = useBlock();
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    (newDeltas as DataStreamDelta[]).forEach((delta: DataStreamDelta) => {
      if (delta.type === 'user-message-id') {
        setUserMessageId(delta.content);
        return;
      }

      const blockDefinition = blockDefinitions.find(
        (blockDefinition) => blockDefinition.kind === block.kind,
      );

      if (blockDefinition?.onStreamPart) {
        blockDefinition.onStreamPart({
          streamPart: delta,
          setBlock,
          setMetadata,
        });
      }

      setBlock((draftBlock) => {
        if (!draftBlock) {
          return { ...initialBlockData, status: 'streaming' };
        }

        switch (delta.type) {
          case 'id':
            return {
              ...draftBlock,
              documentId: delta.content,
              status: 'streaming',
            };

          case 'title':
            return {
              ...draftBlock,
              title: delta.content,
              status: 'streaming',
            };

          case 'kind':
            return {
              ...draftBlock,
              kind: delta.content as BlockKind,
              status: 'streaming',
            };

          case 'clear':
            return {
              ...draftBlock,
              content: '',
              status: 'streaming',
            };

          case 'finish':
            return {
              ...draftBlock,
              status: 'idle',
            };

          default:
            return draftBlock;
        }
      });
    });
  }, [dataStream, setBlock, setMetadata, block.kind]);

  return null;
}
