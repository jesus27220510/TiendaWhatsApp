import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../state/CartProvider.jsx";
import { prepareCheckout } from "../services/checkout.js";
import { api } from "../services/api.js";

export default function CheckoutButton() {
  const { items, dispatch } = useCart();
  const latestItems = useRef(items);
  latestItems.current = items;
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [link, setLink] = useState(null);
  const [storeStatus, setStoreStatus] = useState("checking"),
    [checkVersion, setCheckVersion] = useState(0);
  const checkAgain = () => setCheckVersion((v) => v + 1);
  useEffect(() => {
    let active = true;
    setStoreStatus("checking");
    api("/store")
      .then((data) => {
        if (active)
          setStoreStatus(
            data.whatsappConfigured === true ? "ready" : "missing",
          );
      })
      .catch(() => {
        if (active) setStoreStatus("error");
      });
    return () => {
      active = false;
    };
  }, [checkVersion]);
  useEffect(() => {
    const refresh = () => setCheckVersion((v) => v + 1);
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);
  function closePopup(popup) {
    if (popup && !popup.closed) popup.close();
  }
  async function finish() {
    if (busy || !items.length || storeStatus !== "ready") return;
    const snapshot = items;
    setBusy(true);
    setMessage("");
    setLink(null);
    let popup = null;
    try {
      popup = window.open("about:blank", "_blank");
      if (popup) {
        popup.opener = null;
        popup.document.title = "Preparando pedido";
        popup.document.body.textContent = "Verificando tu pedido…";
      }
    } catch {
      closePopup(popup);
      popup = null;
    }
    try {
      const result = await prepareCheckout(snapshot);
      if (latestItems.current !== snapshot) {
        closePopup(popup);
        setMessage("Tu carrito cambió. Revísalo y finaliza nuevamente.");
        return;
      }
      if (popup && !popup.closed) {
        try {
          popup.location.replace(result.whatsappUrl);
        } catch {
          closePopup(popup);
          setLink({ url: result.whatsappUrl, items: snapshot });
        }
      } else setLink({ url: result.whatsappUrl, items: snapshot });
      setMessage(
        "Revisa el mensaje en WhatsApp y envíalo si deseas. Tu carrito se conserva aquí.",
      );
    } catch (e) {
      closePopup(popup);
      if (latestItems.current !== snapshot) {
        setMessage("Tu carrito cambió. Revísalo y finaliza nuevamente.");
        return;
      }
      if (e.code === "CART_CHANGED") {
        dispatch({ type: "replace", lines: e.data.lines });
        setMessage(
          e.message +
            " " +
            e.data.changes
              .map(
                (c) =>
                  c.previousName +
                  (c.type === "removed"
                    ? " ya no está disponible."
                    : " cambió."),
              )
              .join(" "),
        );
      } else if (e.code === "WHATSAPP_UNAVAILABLE") {
        setStoreStatus("missing");
        setMessage("");
      } else setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  const usableLink =
    link && link.items === items && items.length > 0 && storeStatus === "ready";
  return (
    <>
      <p className="cart-note">
        Necesitas acceso a WhatsApp. Se abrirá el mensaje para que lo revises y
        lo envíes tú.
      </p>
      {!items.length && (
        <p className="notice" role="status">
          Agrega al menos un producto para preparar tu pedido.
        </p>
      )}
      {storeStatus === "checking" && (
        <p className="cart-note" role="status">
          Comprobando WhatsApp del negocio…
        </p>
      )}
      {(storeStatus === "missing" || storeStatus === "error") && (
        <div className="notice" role="status">
          <p>
            {storeStatus === "missing"
              ? "WhatsApp no está configurado. Intenta más tarde."
              : "No se pudo comprobar WhatsApp. Intenta nuevamente."}
          </p>
          <button type="button" className="secondary" onClick={checkAgain}>
            Comprobar WhatsApp
          </button>
        </div>
      )}
      <button
        className="checkout-button"
        disabled={!items.length || busy || storeStatus !== "ready"}
        onClick={finish}
      >
        {busy ? "Verificando pedido…" : "Finalizar pedido por WhatsApp"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      {usableLink && (
        <a
          className="button"
          target="_blank"
          rel="noopener noreferrer"
          href={link.url}
        >
          Abrir mensaje en WhatsApp ↗
        </a>
      )}
    </>
  );
}
