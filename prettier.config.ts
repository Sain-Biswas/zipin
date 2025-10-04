import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";

const configuration = {
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  experimentalTernaries: true,
  singleAttributePerLine: true,

  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/app/globals.css"
} satisfies Config & PluginOptions;

export default configuration;
