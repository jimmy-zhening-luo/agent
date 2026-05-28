import {
  ChatKit,
  useChatKit,
} from "@openai/chatkit-react";
import { workflow } from "../lib/env";
import { createClientSecretFetcher } from "../lib/session";

export function ChatKitPanel() {
  const { control } = useChatKit(
    {
      api: {
        getClientSecret: createClientSecretFetcher(workflow),
      },
    },
  );

  return (
    <div className="flex h-[90vh] w-full rounded-2xl bg-white shadow-sm transition-colors dark:bg-slate-900">
      <ChatKit control={control} className="h-full w-full" />
    </div>
  );
}
