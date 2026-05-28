const SESSION_ENDPOINT = "/api/create-session",
readEnvString = (value: unknown) => typeof value === "string"
  && value.trim()
  || undefined;

export const workflowId = (
  () => {
    const id = readEnvString(
      import
        .meta
        .env
        .VITE_CHATKIT_WORKFLOW_ID,
    );

    if (!id)
      throw new ReferenceError("No VITE_CHATKIT_WORKFLOW_ID environmental variable found.");

    return id;
  }
)();

export function createClientSecretFetcher(workflow: string) {
  return async (currentSecret: string | null) => {
    if (currentSecret)
      return currentSecret;

    const response = await fetch(
      SESSION_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            workflow: {
              id: workflow,
            },
          },
        ),
      },
    ),
    payload = (
      await response
        .json()
        .catch()
    ) as {
      client_secret?: string;
      error?: string;
    };

    if (!response.ok)
      throw new Error(
        payload.error
        ?? "Failed to initiate ChatKit session with server.",
      );

    if (!payload.client_secret)
      throw new Error("Missing client secret in server response.");

    return payload.client_secret;
  };
}
