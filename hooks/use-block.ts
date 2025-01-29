'use client';

import { useCallback, useMemo, useState } from 'react';

import { UIBlock } from '@/components/block';

// Initial state for a new block
export const initialBlockData: UIBlock = {
  documentId: 'init',
  content: '',
  kind: 'text',
  title: '',
  status: 'idle',
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
};

// Main hook for managing block state
export function useBlock() {
  const [block, setBlock] = useState<UIBlock>(initialBlockData);
  const [metadata, setMetadata] = useState<any>();

  // Wrapper to handle both direct updates and updater functions
  const setBlockWrapper = useCallback(
    (updater: UIBlock | ((current: UIBlock) => UIBlock)) => {
      setBlock((current) => {
        return typeof updater === 'function' ? updater(current) : updater;
      });
    },
    [],
  );

  return useMemo(
    () => ({
      block,
      setBlock: setBlockWrapper,
      metadata,
      setMetadata,
    }),
    [block, setBlockWrapper, metadata],
  );
}
