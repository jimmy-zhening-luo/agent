export const workflow = (
  () => {
    const readEnv = (value: unknown) => typeof value === "string"
      && value.trim()
      || undefined,
    id = readEnv(
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
