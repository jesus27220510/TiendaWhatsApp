import React from "react";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { CartProvider, useCart } from "../src/state/CartProvider.jsx";
import Cart from "../src/components/Cart.jsx";
import { prepareCheckout } from "../src/services/checkout.js";
import { api } from "../src/services/api.js";
vi.mock("../src/services/checkout.js", () => ({ prepareCheckout: vi.fn() }));
vi.mock("../src/services/api.js", () => ({ api: vi.fn() }));
beforeEach(() => {
  api.mockReset().mockResolvedValue({ whatsappConfigured: true });
  prepareCheckout.mockReset();
});
afterEach(() => vi.restoreAllMocks());
function Harness() {
  const { dispatch } = useCart();
  return (
    <>
      <button
        onClick={() =>
          dispatch({
            type: "add",
            product: { id: "a", name: "Café", priceCents: 1250 },
          })
        }
      >
        Añadir
      </button>
      <Cart />
    </>
  );
}
const button = () => screen.getByRole("button", { name: /Finalizar pedido/ });
const show = () =>
  render(
    <CartProvider>
      <Harness />
    </CartProvider>,
  );
async function add() {
  fireEvent.click(screen.getByText("Añadir"));
  await waitFor(() => expect(button()).toBeEnabled());
}
function popup() {
  return {
    opener: {},
    document: { body: {} },
    location: { replace: vi.fn() },
    close: vi.fn(),
    closed: false,
  };
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
}
test("avisa del carrito vacío y de la revisión manual antes de salir", async () => {
  const open = vi.spyOn(window, "open").mockReturnValue(null);
  show();
  await screen.findByText(/Agrega al menos un producto/);
  expect(button()).toBeDisabled();
  expect(screen.getByText(/Necesitas acceso a WhatsApp/)).toHaveTextContent(
    /lo envíes tú/,
  );
  expect(open).not.toHaveBeenCalled();
});
test("número ausente deshabilita y permite volver a comprobar sin perder selección", async () => {
  api.mockResolvedValue({ whatsappConfigured: false });
  show();
  fireEvent.click(screen.getByText("Añadir"));
  expect(
    await screen.findByText(/WhatsApp no está configurado/),
  ).toBeInTheDocument();
  expect(button()).toBeDisabled();
  expect(screen.getByLabelText("Cantidad de Café")).toHaveValue("1");
  api.mockResolvedValue({ whatsappConfigured: true });
  fireEvent.click(screen.getByRole("button", { name: "Comprobar WhatsApp" }));
  await waitFor(() => expect(button()).toBeEnabled());
});
test("fallo de configuración bloquea y ofrece reintento", async () => {
  api.mockRejectedValue(new Error("Sin conexión"));
  show();
  fireEvent.click(screen.getByText("Añadir"));
  expect(
    await screen.findByText(/No se pudo comprobar WhatsApp/),
  ).toBeInTheDocument();
  expect(button()).toBeDisabled();
  api.mockResolvedValue({ whatsappConfigured: true });
  fireEvent.click(screen.getByRole("button", { name: "Comprobar WhatsApp" }));
  await waitFor(() => expect(button()).toBeEnabled());
});
test("ventana bloqueada ofrece enlace explícito y lo invalida al cambiar o vaciar", async () => {
  vi.spyOn(window, "open").mockReturnValue(null);
  prepareCheckout.mockResolvedValue({
    whatsappUrl: "https://wa.me/51999888777?text=hola",
  });
  show();
  await add();
  fireEvent.click(button());
  expect(
    await screen.findByRole("link", { name: /Abrir mensaje/ }),
  ).toHaveAttribute("target", "_blank");
  fireEvent.change(screen.getByLabelText("Cantidad de Café"), {
    target: { value: "2" },
  });
  fireEvent.blur(screen.getByLabelText("Cantidad de Café"));
  expect(
    screen.queryByRole("link", { name: /Abrir mensaje/ }),
  ).not.toBeInTheDocument();
  fireEvent.click(button());
  await screen.findByRole("link", { name: /Abrir mensaje/ });
  fireEvent.click(screen.getByRole("button", { name: "Quitar Café" }));
  expect(
    screen.queryByRole("link", { name: /Abrir mensaje/ }),
  ).not.toBeInTheDocument();
  expect(button()).toBeDisabled();
});
test("abre solamente el enlace preparado y conserva el carrito", async () => {
  const tab = popup();
  vi.spyOn(window, "open").mockReturnValue(tab);
  const url = "https://wa.me/51999888777?text=pedido";
  prepareCheckout.mockResolvedValue({ whatsappUrl: url });
  show();
  await add();
  fireEvent.click(button());
  await waitFor(() => expect(tab.location.replace).toHaveBeenCalledWith(url));
  expect(prepareCheckout).toHaveBeenCalledWith([
    { productId: "a", name: "Café", priceCents: 1250, quantity: 1 },
  ]);
  expect(screen.getByLabelText("Cantidad de Café")).toHaveValue("1");
});
test("cambio de catálogo cierra ventana y exige revisar", async () => {
  const tab = popup();
  vi.spyOn(window, "open").mockReturnValue(tab);
  prepareCheckout.mockRejectedValue({
    code: "CART_CHANGED",
    message: "Revisa tu carrito",
    data: { lines: [], changes: [{ previousName: "Café", type: "removed" }] },
  });
  show();
  await add();
  fireEvent.click(button());
  expect(await screen.findByText(/Revisa tu carrito/)).toBeInTheDocument();
  expect(tab.close).toHaveBeenCalledOnce();
  expect(button()).toBeDisabled();
});
test("no abre respuesta anterior cuando cambia el carrito durante la petición", async () => {
  const tab = popup(),
    pending = deferred();
  vi.spyOn(window, "open").mockReturnValue(tab);
  prepareCheckout.mockReturnValue(pending.promise);
  show();
  await add();
  fireEvent.click(button());
  fireEvent.click(screen.getByText("Añadir"));
  await act(async () =>
    pending.resolve({ whatsappUrl: "https://wa.me/51999888777?text=anterior" }),
  );
  expect(tab.location.replace).not.toHaveBeenCalled();
  expect(tab.close).toHaveBeenCalled();
  expect(screen.getByLabelText("Cantidad de Café")).toHaveValue("2");
  expect(screen.getByText(/Tu carrito cambió/)).toBeInTheDocument();
});
test("un CART_CHANGED antiguo no sobrescribe una selección posterior", async () => {
  const tab = popup(),
    pending = deferred();
  vi.spyOn(window, "open").mockReturnValue(tab);
  prepareCheckout.mockReturnValue(pending.promise);
  show();
  await add();
  fireEvent.click(button());
  fireEvent.click(screen.getByText("Añadir"));
  await act(async () =>
    pending.reject({
      code: "CART_CHANGED",
      message: "Cambió",
      data: { lines: [], changes: [{ previousName: "Café", type: "removed" }] },
    }),
  );
  expect(screen.getByLabelText("Cantidad de Café")).toHaveValue("2");
  expect(screen.getByText(/Tu carrito cambió/)).toBeInTheDocument();
});
test("número retirado en servidor bloquea nuevos intentos y conserva el carrito", async () => {
  const tab = popup();
  vi.spyOn(window, "open").mockReturnValue(tab);
  prepareCheckout.mockRejectedValue({
    code: "WHATSAPP_UNAVAILABLE",
    message: "WhatsApp no está configurado. Intenta más tarde.",
  });
  show();
  await add();
  fireEvent.click(button());
  await waitFor(() => expect(button()).toBeDisabled());
  expect(
    await screen.findByText(/WhatsApp no está configurado/),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Cantidad de Café")).toHaveValue("1");
  expect(tab.close).toHaveBeenCalled();
});
test("volver de otra pestaña comprueba la configuración nuevamente", async () => {
  show();
  await add();
  api.mockResolvedValue({ whatsappConfigured: false });
  fireEvent.focus(window);
  expect(
    await screen.findByText(/WhatsApp no está configurado/),
  ).toBeInTheDocument();
  expect(button()).toBeDisabled();
  expect(screen.getByLabelText("Cantidad de Café")).toHaveValue("1");
});
