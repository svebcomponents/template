// Importing the component package's `/ssr` entry installs the server DOM shim
// and registers the generated element renderer. The renderer reads its own tag
// from `<svelte:options customElement>` at build time, so there is nothing to
// register by hand.
import "@svebcomponents/example-component/ssr";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  return await resolve(event);
};
