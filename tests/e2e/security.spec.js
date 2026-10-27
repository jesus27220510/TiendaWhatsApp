import { test, expect, loginUI } from "./fixtures.js";
test("HTTPS real protege cookie y ningún secreto persiste en navegador", async ({
  page,
  context,
  adminApi,
}) => {
  expect(adminApi.products).toHaveLength(3);
  await loginUI(page);
  const cookie = (await context.cookies()).find((c) => c.name === "tienda.sid");
  expect(cookie).toMatchObject({
    secure: true,
    httpOnly: true,
    sameSite: "Lax",
  });
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookies: document.cookie,
    })),
  ).toEqual({ local: 0, session: 0, cookies: "" });
});
