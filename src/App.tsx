import {
  ChatKit,
  useChatKit,
} from "@openai/chatkit-react";

import { workflow } from "./lib/env";
import { createClientSecretFetcher } from "./lib/session";

export default function App() {
  const { control } = useChatKit(
    {
      api: {
        getClientSecret: createClientSecretFetcher(workflow),
      },
    },
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-end bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex h-[90vh] w-full rounded-2xl bg-white shadow-sm transition-colors dark:bg-slate-900">
          <ChatKit control={control} className="h-full w-full" />
        </div>
      </div>
    </main>
  );
}
