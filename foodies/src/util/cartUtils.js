export const getCartItemCount = (cartItems = [], quantities = {}) =>
  cartItems.reduce((count, food) => {
    const quantity = Number(quantities[food.id]) || 0;
    return count + (quantity > 0 ? quantity : 0);
  }, 0);

export const calculateCartTotals = (cartItems, quantities) => {
  const subtotal = cartItems.reduce(
    (acc, food) => acc + food.price * quantities[food.id],
    0
  );
  const shipping = subtotal === 0 ? 0.0 : 10;
  const tax = subtotal * 0.1; //10%
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
};
export const resolveFoodItem = (item, foodList = []) => {
  if (!item || !foodList || foodList.length === 0) return null;
  const targetId = item.foodId || item.id;
  if (targetId) {
    const byId = foodList.find((f) => f.id === targetId);
    if (byId) return byId;
  }

  const rawName = (item.name || "").trim().toLowerCase();
  if (!rawName) return null;

  const byExactName = foodList.find((f) => f.name.trim().toLowerCase() === rawName);
  if (byExactName) return byExactName;

  const bySubstring = foodList.find((f) => {
    const fn = f.name.trim().toLowerCase();
    return fn.includes(rawName) || rawName.includes(fn);
  });
  if (bySubstring) return bySubstring;

  const tokens = rawName.split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length > 0) {
    const byTokens = foodList.find((f) => {
      const fn = f.name.trim().toLowerCase();
      return tokens.every((t) => fn.includes(t));
    });
    if (byTokens) return byTokens;
  }

  return null;
};
