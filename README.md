This is a minimal version of [`Vercel AI Chatbot`](https://github.com/vercel/ai-chatbot) updated to Next 13.5.

- removed database, auth, chat history


## Getting Started

First, add your ```OPENAI_API_KEY``` to .env.local:


Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

- make sure to add your ```OPENAI_API_KEY``` environment variable

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
