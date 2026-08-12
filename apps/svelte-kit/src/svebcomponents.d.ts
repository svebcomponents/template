// Registers the component package's generated element types with Svelte's
// template types, so `<example-component>` is checked like any other element:
// unknown attributes and `increments="nope"` become errors.
//
// The package generates this augmentation and exposes it as `./svelte`. It is
// not loaded automatically because the package does not declare `svelte` — that
// would oblige every consumer to install it, including ones using the element
// from a plain HTML page. This app has Svelte, so it opts in.
//
// A `.d.ts` on purpose: the import is types-only and never reaches runtime.
import "@svebcomponents/example-component/svelte";
