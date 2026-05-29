import {
  ChatKit,
  useChatKit,
} from "@openai/chatkit-react";

import {
  endpoint,
  workflow,
} from "./lib/env";
import { createClientSecretFetcher } from "./lib/session";
import { ui } from "./lib/ui";

export default function App() {
  const { control } = useChatKit(
    {
      api: {
        getClientSecret: createClientSecretFetcher(
          endpoint,
          workflow,
        ),
      },
      ...ui,
    },
  );

  return (
    <main>
      <div style={{
        width: "100%",
        height: "95vh",
      }}>
        <ChatKit control={control}/>
      </div>
    </main>
  );
}
