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
      workflow: { id: "wf_68df4b13b3588190a09d19288d4610ec0df388c3983f58d1" },
      user: deviceId,
    }),
  }),

  { client_secret } = await response.json();

  return client_secret;
}
