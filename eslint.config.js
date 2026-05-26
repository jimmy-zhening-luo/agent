import linted from "linted";

export default linted(
  {
    js: {
      files: ["frontend/*.{js,mjs}"],
    },
    ts: {
      files: ["frontend/src/**/*.{ts,tsx}"],
    },
    html: {
      files: [
        "frontend/*.{html}",
        "frontend/src/**/*.{html}",
      ],
    },
    css: {
      files: [
        "frontend/*.{css}",
        "frontend/src/**/*.{css}",
      ],
    },
    json: {
      files: ["frontend/package.json"],
    },
    jsonc: {
      files: [
        "frontend/tsconfig.json",
        "frontend/tsconfig.*.json",
      ],
    },
  },
);
