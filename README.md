> [!NOTE]
> svebcomponents is currently in beta. Its build, auto-options, SSR, and
> hydration workflows are ready for real-world evaluation and early production
> adoption. APIs may still change before 1.0.

# svebcomponents — Template

A template for getting started with building web components with `svelte` using
[svebcomponents](https://svebcomponents.dev).

```bash
pnpx degit svebcomponents/template my-project
cd my-project
pnpm install
pnpm dev
```

## What is in here

This is a small pnpm workspace:

- `components/example-component` — a Svelte custom element package built with
  `@svebcomponents/build`
- `apps/svelte-kit` — a SvelteKit app that server-renders and hydrates the
  custom element
- `configs/*` — shared eslint, prettier and TypeScript configuration

## The component

`src/ExampleComponent.svelte` declares its own tag and is itself the package
entrypoint — there is no entry module that re-exports it:

```svelte
<svelte:options customElement="example-component" />
```

`package.json` exports double as the build configuration. The `svebcomponents`
command maps `./dist/client/ExampleComponent.js` back to the same-basename
`src/ExampleComponent.svelte`, and the matching `./ssr` export adds the server
renderer:

```json
{
  "exports": {
    ".": {
      "types": "./dist/client/ExampleComponent.d.ts",
      "svelte": "./dist/client-svelte/ExampleComponent.js",
      "default": "./dist/client/ExampleComponent.js"
    },
    "./ssr": {
      "types": "./dist/server/ssr.d.ts",
      "svelte": "./dist/server-svelte/ssr.js",
      "default": "./dist/server/ssr.js"
    }
  },
  "customElements": "custom-elements.json"
}
```

Every build also emits a
[custom elements manifest](https://svebcomponents.dev/publishing/#ship-the-manifest)
and TypeScript types for the element.

`apps/svelte-kit/src/svebcomponents.d.ts` registers those types with Svelte's
template types, so the app checks `<example-component>` like any other element
— unknown attributes and `increments="nope"` are errors.

svebcomponents can generate that augmentation for you, but only for packages
that declare `svelte` as a required dependency of their consumers. This one
deliberately does not: a `dependency` or `peerDependency` is left external by
the build, which would stop `dist/client` from being a standalone bundle. The
eight-line augmentation lives in the app instead — see
[typing elements in React & Vue](https://svebcomponents.dev/guides/framework-types/)
for the same recipe in other frameworks.

## Where component dependencies go

Put a component package's dependencies in **`devDependencies`**. The browser
build inlines those, which is what makes `dist/client/*.js` loadable straight
from a CDN with no import map.

`dependencies` and `peerDependencies` are left external and survive into the
bundle as bare specifiers. `pnpm add` writes to `dependencies` by default, so
it is easy to produce a non-self-contained bundle without noticing — use
`pnpm add -D` in a component package. This applies to `svelte` itself: moving
it out of `devDependencies` shrinks `dist/client` from ~38 kB to ~4 kB and
leaves a bare `svelte` import no browser can resolve.

When something genuinely has to be both (a package whose types appear in your
public declarations, say), declare it in `dependencies` and name it in a
`svebcomponents.config.ts` under `deps.alwaysBundle`.

`tsdown` is a peer dependency of `@svebcomponents/build`, declared with an open
range. Pin it in your own `devDependencies` (this template catalogs it): with
`auto-install-peers`, pnpm otherwise installs the bottom of that range, and an
old tsdown silently ignores the bundling rules the build relies on.

## Server rendering

The app registers nothing by hand: importing the component package's `/ssr`
entry from `hooks.server.ts` installs the DOM shim and self-registers the
generated renderer, which reads its tag from `<svelte:options customElement>` at
build time.

## Scripts

`pnpm build`, `pnpm dev`, `pnpm check`, `pnpm lint`, `pnpm fix` and `pnpm test`
all run through turbo from the repo root.

End-to-end tests live in `apps/svelte-kit/e2e` and run against the production
build, asserting that the element is server-rendered as declarative shadow DOM
and hydrated in place:

```bash
pnpm build
pnpm --filter svelte-kit exec playwright install --with-deps chromium
pnpm --filter svelte-kit test:e2e
```

They are not part of `pnpm test` or CI, since they need browsers downloaded.

## Documentation

- [Getting started](https://svebcomponents.dev/getting-started/)
- [Authoring components](https://svebcomponents.dev/authoring/)
- [Publishing your package](https://svebcomponents.dev/publishing/)
- [Server rendering](https://svebcomponents.dev/server-rendering/)
