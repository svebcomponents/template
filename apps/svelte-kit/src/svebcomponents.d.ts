// Registers the component package's generated element types with Svelte's
// template types, so `<example-component>` is checked like any other element:
// unknown attributes and `increments="nope"` become errors.
//
// svebcomponents can do this for you, but only for packages that declare
// `svelte` as a required dependency of their consumers. This one deliberately
// does not — that would make the build treat Svelte as external and stop
// `dist/client` from being a standalone bundle. So the augmentation lives here
// instead, in the application that actually has Svelte.
//
// See https://svebcomponents.dev/guides/framework-types/
import type { HTMLAttributes } from "svelte/elements";
import type {
  ExampleComponentElement,
  ExampleComponentAttributes,
} from "@svebcomponents/example-component";

declare module "svelte/elements" {
  interface SvelteHTMLElements {
    "example-component": HTMLAttributes<ExampleComponentElement> &
      ExampleComponentAttributes;
  }
}
