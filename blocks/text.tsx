import { toast } from 'sonner';

import { Block } from '@/components/create-block';
import { DocumentSkeleton } from '@/components/document-skeleton';
import { Editor } from '@/components/editor';
import { CopyIcon, MessageIcon, PenIcon } from '@/components/icons';

export const textBlock: Block<
  'text',
  {
    suggestions: string[];
  }
> = new Block({
  kind: 'text',
  description: 'Useful for text content, like drafting essays and emails.',
  initialize: async ({ setMetadata }) => {
    setMetadata({
      suggestions: [],
    });
  },
  onStreamPart: ({ streamPart, setBlock }) => {
    if (streamPart.type === 'text-delta') {
      setBlock((draftBlock) => {
        return {
          ...draftBlock,
          content: draftBlock.content + streamPart.content,
          isVisible:
            draftBlock.status === 'streaming' &&
            draftBlock.content.length > 400 &&
            draftBlock.content.length < 450
              ? true
              : draftBlock.isVisible,
          status: 'streaming',
        };
      });
    }
  },
  content: ({ status, content, onSaveContent, isLoading, metadata }) => {
    if (isLoading) {
      return <DocumentSkeleton blockKind="text" />;
    }

    return (
      <>
        <div className="flex flex-row py-8 md:p-20 px-4">
          <Editor
            content={content}
            status={status}
            onSaveContent={onSaveContent}
          />
        </div>
      </>
    );
  },
  actions: [
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy to clipboard',
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard!');
      },
    },
  ],
  toolbar: [
    {
      icon: <PenIcon />,
      description: 'Add final polish',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Please add final polish and check for grammar, add section titles for better structure, and ensure everything reads smoothly.',
        });
      },
    },
    {
      icon: <MessageIcon />,
      description: 'Request suggestions',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Please add suggestions you have that could improve the writing.',
        });
      },
    },
  ],
});
