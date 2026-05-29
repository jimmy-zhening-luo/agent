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
    <main>
      <div style={{ width: "100%", height: "95vh" }}>
        <ChatKit control={control}/>
      </div>
    </main>
  );
}
