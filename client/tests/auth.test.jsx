import React from "react";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RequireAdmin from "../src/components/RequireAdmin.jsx";
import { me, login } from "../src/services/auth.js";
vi.mock("../src/services/auth.js", () => ({ me: vi.fn(), login: vi.fn() }));
test("sesión ausente presenta login; error no revela existencia de usuario", async () => {
  me.mockRejectedValue({ status: 401 });
  login.mockRejectedValue(new Error("Usuario o contraseña incorrectos."));
  render(<RequireAdmin>{() => <p>Panel privado</p>}</RequireAdmin>);
  expect(await screen.findByLabelText("Usuario")).toBeInTheDocument();
  expect(screen.queryByText("Panel privado")).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Usuario"), {
    target: { value: "admin" },
  });
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: "incorrecta" },
  });
  fireEvent.submit(
    screen.getByRole("button", { name: "Ingresar al panel" }).closest("form"),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Usuario o contraseña incorrectos.",
  );
  expect(localStorage.length).toBe(0);
});
