export const total = (items) =>
  items.reduce((s, l) => s + l.priceCents * l.quantity, 0);
export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const p = action.product;
      const old = state.find((l) => l.productId === p.id);
      return old
        ? state.map((l) =>
            l === old ? { ...l, quantity: Math.min(999, l.quantity + 1) } : l,
          )
        : [
            ...state,
            {
              productId: p.id,
              name: p.name,
              priceCents: p.priceCents,
              quantity: 1,
            },
          ];
    }
    case "quantity":
      return Number.isInteger(action.quantity) &&
        action.quantity >= 1 &&
        action.quantity <= 999
        ? state.map((l) =>
            l.productId === action.id ? { ...l, quantity: action.quantity } : l,
          )
        : state;
    case "remove":
      return state.filter((l) => l.productId !== action.id);
    case "replace":
      return action.lines.map(({ productId, name, priceCents, quantity }) => ({
        productId,
        name,
        priceCents,
        quantity,
      }));
    default:
      return state;
  }
}
