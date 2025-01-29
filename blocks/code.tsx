import { toast } from 'sonner';

import { CodeEditor } from '@/components/code-editor';
import {
  Console,
  ConsoleOutput,
  ConsoleOutputContent,
} from '@/components/console';
import { Block } from '@/components/create-block';
import { CopyIcon, LogsIcon, MessageIcon, PlayIcon } from '@/components/icons';
import { generateUUID } from '@/lib/utils';

const OUTPUT_HANDLERS = {
  matplotlib: `
    import io
    import base64
    from matplotlib import pyplot as plt

    # Clear any existing plots
    plt.clf()
    plt.close('all')

    # Switch to agg backend
    plt.switch_backend('agg')

    def setup_matplotlib_output():
        def custom_show():
            if plt.gcf().get_size_inches().prod() * plt.gcf().dpi ** 2 > 25_000_000:
                print("Warning: Plot size too large, reducing quality")
                plt.gcf().set_dpi(100)

            png_buf = io.BytesIO()
            plt.savefig(png_buf, format='png')
            png_buf.seek(0)
            png_base64 = base64.b64encode(png_buf.read()).decode('utf-8')
            print(f'data:image/png;base64,{png_base64}')
            png_buf.close()

            plt.clf()
            plt.close('all')

        plt.show = custom_show
  `,
  basic: `
    # Basic output capture setup
  `,
};

function detectRequiredHandlers(code: string): string[] {
  const handlers: string[] = ['basic'];

  if (code.includes('matplotlib') || code.includes('plt.')) {
    handlers.push('matplotlib');
  }

  return handlers;
}

export const codeBlock: Block<
  'code',
  {
    outputs: Array<ConsoleOutput>;
  }
> = new Block({
  kind: 'code',
  description:
    'Useful for code generation; Code execution is only available for python code.',
  initialize: async ({ setMetadata }) => {
    setMetadata({
      outputs: [],
    });
  },
  onStreamPart: ({ streamPart, setBlock }) => {
    if (streamPart.type === 'code-delta') {
      setBlock((draftBlock) => ({
        ...draftBlock,
        content: streamPart.content,
        isVisible:
          draftBlock.status === 'streaming' &&
          draftBlock.content.length > 300 &&
          draftBlock.content.length < 310
            ? true
            : draftBlock.isVisible,
        status: 'streaming',
      }));
    }
  },
  content: ({ metadata, setMetadata, ...props }) => {
    return (
      <>
        <div className="px-1">
          <CodeEditor {...props} />
        </div>

        {metadata?.outputs && (
          <Console
            consoleOutputs={metadata.outputs}
            setConsoleOutputs={() => {
              setMetadata({
                ...metadata,
                outputs: [],
              });
            }}
          />
        )}
      </>
    );
  },
  actions: [
    {
      icon: <PlayIcon size={18} />,
      label: 'Run',
      description: 'Execute code',
      onClick: async ({ content, setMetadata }) => {
        const runId = generateUUID();
        const outputContent: Array<ConsoleOutputContent> = [];

        setMetadata(
          (metadata: {
            outputs: Array<ConsoleOutput>;
          }) => ({
            ...metadata,
            outputs: [
              ...metadata.outputs,
              {
                id: runId,
                contents: [],
                status: 'in_progress',
              },
            ],
          }),
        );

        try {
          // @ts-expect-error - loadPyodide is not defined
          const currentPyodideInstance = await globalThis.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
          });

          currentPyodideInstance.setStdout({
            batched: (output: string) => {
              outputContent.push({
                type: output.startsWith('data:image/png;base64')
                  ? 'image'
                  : 'text',
                value: output,
              });
            },
          });

          await currentPyodideInstance.loadPackagesFromImports(content, {
            messageCallback: (message: string) => {
              setMetadata(
                (metadata: {
                  outputs: Array<ConsoleOutput>;
                }) => ({
                  ...metadata,
                  outputs: [
                    ...metadata.outputs.filter((output) => output.id !== runId),
                    {
                      id: runId,
                      contents: [{ type: 'text', value: message }],
                      status: 'loading_packages',
                    },
                  ],
                }),
              );
            },
          });

          const requiredHandlers = detectRequiredHandlers(content);
          for (const handler of requiredHandlers) {
            if (OUTPUT_HANDLERS[handler as keyof typeof OUTPUT_HANDLERS]) {
              await currentPyodideInstance.runPythonAsync(
                OUTPUT_HANDLERS[handler as keyof typeof OUTPUT_HANDLERS],
              );

              if (handler === 'matplotlib') {
                await currentPyodideInstance.runPythonAsync(
                  'setup_matplotlib_output()',
                );
              }
            }
          }

          await currentPyodideInstance.runPythonAsync(content);

          setMetadata(
            (metadata: {
              outputs: Array<ConsoleOutput>;
            }) => ({
              ...metadata,
              outputs: [
                ...metadata.outputs.filter((output) => output.id !== runId),
                {
                  id: runId,
                  contents: outputContent,
                  status: 'completed',
                },
              ],
            }),
          );
        } catch (error) {
          setMetadata(
            (metadata: {
              outputs: Array<ConsoleOutput>;
            }) => ({
              ...metadata,
              outputs: [
                ...metadata.outputs.filter((output) => output.id !== runId),
                {
                  id: runId,
                  contents: [
                    {
                      type: 'text',
                      value:
                        error instanceof Error ? error.message : String(error),
                    },
                  ],
                  status: 'failed',
                },
              ],
            }),
          );
        }
      },
    },
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy code to clipboard',
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard!');
      },
    },
  ],
  toolbar: [
    {
      icon: <MessageIcon />,
      description: 'Add comments',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Add comments to the code snippet for understanding',
        });
      },
    },
    {
      icon: <LogsIcon />,
      description: 'Add logs',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Add logs to the code snippet for debugging',
        });
      },
    },
  ],
});
