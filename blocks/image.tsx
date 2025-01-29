import { toast } from 'sonner';

import { Block } from '@/components/create-block';
import { CopyIcon } from '@/components/icons';
import { ImageEditor } from '@/components/image-editor';

export const imageBlock: Block<
  'image',
  {
    content: string;
  }
> = new Block({
  kind: 'image',
  description: 'Useful for image generation',
  initialize: ({ setMetadata }) => {
    setMetadata({
      content: '',
    });
  },
  onStreamPart: ({ streamPart, setBlock }) => {
    if (streamPart.type === 'image-delta') {
      setBlock((draftBlock) => ({
        ...draftBlock,
        content: streamPart.content,
        isVisible: true,
        status: 'streaming',
      }));
    }
  },
  content: ImageEditor,
  actions: [
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy image to clipboard',
      onClick: ({ content }) => {
        const img = new Image();
        img.src = `data:image/png;base64,${content}`;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
              ]);
            }
          }, 'image/png');
        };

        toast.success('Copied image to clipboard!');
      },
    },
  ],
  toolbar: [],
});
