import { expect, test } from "@playwright/test";

// The guarantee the whole svebcomponents SSR story rests on: the element's
// shadow root arrives in the HTML payload as declarative shadow DOM, and the
// browser adopts that markup on upgrade instead of wiping and re-rendering it.
test("the custom element is server-rendered as declarative shadow DOM", async ({
  request,
}) => {
  const html = await (await request.get("/")).text();

  expect(html).toContain("<example-component");
  expect(html).toContain("shadowrootmode=");
  // the SSR pass ran the component, not just the tag
  expect(html).toMatch(/add 5 to 0/);
});

test("the server-rendered shadow DOM is hydrated in place", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForSelector("example-component", { state: "attached" });

  // mark the server-rendered node before the element upgrades
  const stamped = await page.evaluate(() => {
    const button = document
      .querySelector("example-component")
      ?.shadowRoot?.querySelector("button");
    if (!button) return false;
    button.setAttribute("data-ssr-stamp", "kept");
    return true;
  });
  expect(stamped, "SSR output must contain the rendered button").toBe(true);

  const button = page.locator("example-component").locator("button");
  await button.click();

  // same node, so hydration adopted the server markup rather than replacing it
  await expect(button).toHaveAttribute("data-ssr-stamp", "kept");
  await expect(button).toHaveText(/add 5 to 5/);
});
