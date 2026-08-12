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
      "default": "./dist/client/ExampleComponent.js"
    },
    "./svelte": {
      "types": "./dist/client/ExampleComponent.svelte-types.d.ts"
    },
    "./ssr": {
      "types": "./dist/server/ssr.d.ts",
      "default": "./dist/server/ssr.js"
    }
  },
  "customElements": "custom-elements.json"
}
```

Every build also emits a
[custom elements manifest](https://svebcomponents.dev/publishing/#ship-the-manifest)
and TypeScript types for the element.

The build also writes the Svelte template types, which the component package
exposes as `./svelte`. `apps/svelte-kit/src/svebcomponents.d.ts` opts in with a
single line, and the app then checks `<example-component>` like any other
element — unknown attributes and `increments="nope"` are errors.

They are not loaded automatically because the package does not declare `svelte`.
Declaring it would oblige every consumer to install Svelte, including one using
the element from a plain HTML page, and a component package should not force
that on people just to ship types. See
[typing elements in React & Vue](https://svebcomponents.dev/guides/framework-types/)
for the same recipe in other frameworks.

## Dependencies

Declare them for what they mean: `dependencies` is what your consumers must
install, `devDependencies` is what only you need. Bundling does not enter into
it — `dist/client` is loaded without a module resolver, so the browser build
inlines every bare specifier either way and stays loadable straight from a CDN.

That matters mostly for the case where you have no choice. If your published
element types name a type from another package, that package has to be a real
`dependency` or your consumers cannot resolve it; the bundle keeps working.

For the rare dependency the host should provide rather than you bundling it, opt
out:

```json
{
  "svebcomponents": { "neverBundle": ["@acme/design-system"] }
}
```

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
