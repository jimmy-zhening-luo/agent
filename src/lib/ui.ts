import type { UseChatKitOptions } from "@openai/chatkit-react";

const ui: Omit<UseChatKitOptions, "api"> = {
  theme: {
    colorScheme: "dark",
    radius: "round",
  },
  frameTitle: "Xfinity Home Internet Support",
  composer: {
    placeholder: "Ask a question about your Xfinity Home Internet service...",
  },
  startScreen: {
    greeting: "Welcome to Xfinity Home Internet customer support! How may I assist you today?",
    prompts: [
      {
        label: "How do I reset my router?",
        prompt: "How do I reset my router?",
      },
      {
        label: "How do I set up my Xfinity Home Internet gateway?",
        prompt: "How do I set up my Xfinity Home Internet gateway?",
      },
    ],
  },
};

export { ui };
