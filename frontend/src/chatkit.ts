export default async function getChatKitSessionToken(
  deviceId: string,
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1",
      Authorization: "Bearer " + process.env.VITE_OPENAI_API_SECRET_KEY,
    },
    body: JSON.stringify({
      workflow: { id: "wf_6a125c8857cc81909cdde94d16b23fd103b4f7945a5f0e42" },
      user: deviceId,
    }),
  }),

  { client_secret } = await response.json();

  return client_secret;
}
