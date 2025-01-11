import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next"], // Extend the base Next.js rules.
    rules: {
      "react/no-unescaped-entities": "off", // Allow unescaped characters in React.
      "@next/next/no-page-custom-font": "off", // Disable the Next.js font custom rule.
    },
  }),
];

export default eslintConfig;
