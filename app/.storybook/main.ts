import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite",
  // Le plugin PWA (service worker Workbox) n'a pas de sens dans Storybook et
  // fait échouer le build statique (assets manager > 2 Mo refusés au précache).
  // Les plugins Vite peuvent être des groupes imbriqués : filtrage récursif.
  viteFinal: (viteConfig) => {
    const isPwa = (p: unknown): boolean =>
      Boolean(
        p &&
          typeof p === "object" &&
          "name" in p &&
          typeof (p as { name: unknown }).name === "string" &&
          ((p as { name: string }).name.startsWith("vite-plugin-pwa") ||
            (p as { name: string }).name.startsWith("vite-pwa")),
      );
    const strip = (plugins: unknown[]): unknown[] =>
      plugins
        .filter((p) => !isPwa(p))
        .map((p) => (Array.isArray(p) ? strip(p) : p));
    return {
      ...viteConfig,
      plugins: strip((viteConfig.plugins ?? []) as unknown[]),
    } as typeof viteConfig;
  },
};
export default config;