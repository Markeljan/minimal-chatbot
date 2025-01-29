import { UseChatHelpers } from 'ai/react';
import { ComponentType, Dispatch, ReactNode, SetStateAction } from 'react';

import { UIBlock } from './block';
import { DataStreamDelta } from './data-stream-handler';

export type BlockActionContext<M = any> = {
  content: string;
  metadata: M;
  setMetadata: Dispatch<SetStateAction<M>>;
};

type BlockAction<M = any> = {
  icon: ReactNode;
  label?: string;
  description: string;
  onClick: (context: BlockActionContext) => Promise<void> | void;
  isDisabled?: (context: BlockActionContext) => boolean;
};

export type BlockToolbarContext = {
  appendMessage: UseChatHelpers['append'];
};

export type BlockToolbarItem = {
  description: string;
  icon: ReactNode;
  onClick: (context: BlockToolbarContext) => void;
};

interface BlockContent<M = any> {
  title: string;
  content: string;
  status: 'streaming' | 'idle';
  onSaveContent: (updatedContent: string, debounce: boolean) => void;
  isInline: boolean;
  isLoading: boolean;
  metadata: M;
  setMetadata: Dispatch<SetStateAction<M>>;
}

interface InitializeParameters<M = any> {
  documentId: string;
  setMetadata: Dispatch<SetStateAction<M>>;
}

export type BlockConfig<T extends string, M = any> = {
  kind: T;
  description: string;
  content: ComponentType<BlockContent<M>>;
  actions: Array<BlockAction<M>>;
  toolbar: BlockToolbarItem[];
  initialize?: (parameters: InitializeParameters<M>) => void;
  onStreamPart: (args: {
    setMetadata: Dispatch<SetStateAction<M>>;
    setBlock: Dispatch<SetStateAction<UIBlock>>;
    streamPart: DataStreamDelta;
  }) => void;
};

export class Block<T extends string, M = any> {
  readonly kind: T;
  readonly description: string;
  readonly content: ComponentType<BlockContent<M>>;
  readonly actions: Array<BlockAction<M>>;
  readonly toolbar: BlockToolbarItem[];
  readonly initialize?: (parameters: InitializeParameters<M>) => void;
  readonly onStreamPart: (args: {
    setMetadata: Dispatch<SetStateAction<M>>;
    setBlock: Dispatch<SetStateAction<UIBlock>>;
    streamPart: DataStreamDelta;
  }) => void;

  constructor(config: BlockConfig<T, M>) {
    this.kind = config.kind;
    this.description = config.description;
    this.content = config.content;
    this.actions = config.actions || [];
    this.toolbar = config.toolbar || [];
    this.initialize = config.initialize || (async () => ({}));
    this.onStreamPart = config.onStreamPart;
  }
}
