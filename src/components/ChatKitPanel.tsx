import {
  ChatKit,
  useChatKit,
} from "@openai/chatkit-react";
import {
  createClientSecretFetcher,
  workflowId,
} from "../lib/chatkitSession";

export function ChatKitPanel() {
  const { control } = useChatKit(
    {
      api: {
        getClientSecret: createClientSecretFetcher(
          workflowId,
        ),
      },
    },
  );

  return (
    <div className="flex h-[90vh] w-full rounded-2xl bg-white shadow-sm transition-colors dark:bg-slate-900">
      <ChatKit control={control} className="h-full w-full" />
    </div>
  );
}
