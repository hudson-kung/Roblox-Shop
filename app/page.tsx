"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  from: string;
  to: string;
  price: number;
  image: string;
  eta: string;
  category: "starter" | "advanced" | "elite";
  badge?: string;
};

const products: Product[] = [
  { id: "to-bronze", name: "Carry to Bronze", from: "Current rank", to: "Bronze", price: 4.99, image: "/items/bronze.png", eta: "30–60 min", category: "starter", badge: "Starter" },
  { id: "to-silver", name: "Carry to Silver", from: "Current rank", to: "Silver", price: 6.99, image: "/items/silver.png", eta: "1–2 hours", category: "starter" },
  { id: "to-gold", name: "Carry to Gold", from: "Current rank", to: "Gold", price: 9.99, image: "/items/gold.png", eta: "2–3 hours", category: "starter", badge: "Popular" },
  { id: "to-platinum", name: "Carry to Platinum", from: "Current rank", to: "Platinum", price: 14.99, image: "/items/platinum.png", eta: "3–4 hours", category: "advanced" },
  { id: "to-diamond", name: "Carry to Diamond", from: "Current rank", to: "Diamond", price: 19.99, image: "/items/diamond.png", eta: "4–6 hours", category: "advanced", badge: "Best seller" },
  { id: "to-emerald", name: "Carry to Emerald", from: "Current rank", to: "Emerald", price: 24.99, image: "/items/emerald.png", eta: "6–8 hours", category: "elite" },
  { id: "to-nightmare", name: "Carry to Nightmare", from: "Current rank", to: "Nightmare", price: 34.99, image: "/items/nightmare.png", eta: "8–12 hours", category: "elite", badge: "Premium" },
];

const filters = [
  { id: "all", label: "All ranks" },
  { id: "starter", label: "Bronze–Gold" },
  { id: "advanced", label: "Platinum–Diamond" },
  { id: "elite", label: "Emerald–Nightmare" },
];

export default function Shop() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});

  const visible = useMemo(() => products.filter((product) => {
    const matchesFilter = filter === "all" || product.category === filter;
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) || product.to.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  }), [filter, query]);

  const cartLines = products.filter((product) => cart[product.id]);
  const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const subtotal = cartLines.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  const add = (id: string) => setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  const change = (id: string, delta: number) => setCart((current) => {
    const next = Math.max(0, (current[id] ?? 0) + delta);
    const updated = { ...current, [id]: next };
    if (!next) delete updated[id];
    return updated;
  });

  return (
    <main>
      <header className="shop-header">
        <a className="brand" href="#top" aria-label="RankRush shop home"><span>R</span>RankRush</a>
        <div className="header-search">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search carries" aria-label="Search carries" />
        </div>
        <button className="cart-pill" type="button" onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>
          Cart <span>{itemCount}</span>
        </button>
      </header>

      <div className="shop-shell" id="top">
        <section className="catalog">
          <div className="catalog-top">
            <div>
              <p className="crumb">SHOP / RANKED CARRIES</p>
              <h1>Ranked Carries</h1>
              <p className="subcopy">Choose a package, add it to your cart, and queue with an experienced BedWars teammate.</p>
            </div>
            <div className="shop-status"><i /> Carries online</div>
          </div>

          <div className="toolbar">
            <div className="filters" role="group" aria-label="Filter products">
              {filters.map((item) => <button className={filter === item.id ? "active" : ""} type="button" key={item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}
            </div>
            <span>{visible.length} items</span>
          </div>

          {visible.length ? (
            <div className="items-grid">
              {visible.map((product) => (
                <article className="item-card" key={product.id}>
                  <div className="item-image">
                    {product.badge && <span className="item-badge">{product.badge}</span>}
                    <img src={product.image} alt={`${product.to} BedWars rank icon`} />
                    <span className="image-rank">{product.to}</span>
                  </div>
                  <div className="item-info">
                    <span className="item-type">TARGET RANK</span>
                    <h2>{product.name}</h2>
                    <div className="route"><span>{product.from}</span><b>→</b><span>{product.to}</span></div>
                    <div className="delivery"><span>◷</span> Estimated {product.eta}</div>
                    <div className="item-bottom">
                      <div className="item-price"><strong>${product.price.toFixed(2)}</strong><span>USD</span></div>
                      <button type="button" onClick={() => add(product.id)} aria-label={`Add ${product.name} to cart`}>Add <span>＋</span></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="empty-search"><strong>No carries found.</strong><span>Try a different search or filter.</span></div>}
        </section>

        <aside className="cart" id="cart">
          <div className="cart-title"><div><p>YOUR CART</p><h2>{itemCount ? `${itemCount} item${itemCount === 1 ? "" : "s"}` : "Empty"}</h2></div><span>{itemCount}</span></div>
          {cartLines.length ? (
            <>
              <div className="cart-lines">
                {cartLines.map((product) => (
                  <div className="cart-line" key={product.id}>
                    <div className="cart-thumb"><img src={product.image} alt="" /></div>
                    <div className="line-copy"><strong>{product.name}</strong><span>${product.price.toFixed(2)}</span><div className="quantity"><button type="button" onClick={() => change(product.id, -1)} aria-label={`Remove one ${product.name}`}>−</button><span>{cart[product.id]}</span><button type="button" onClick={() => change(product.id, 1)} aria-label={`Add one ${product.name}`}>+</button></div></div>
                  </div>
                ))}
              </div>
              <div className="cart-summary"><div><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div><div><span>Service fee</span><b>$0.00</b></div></div>
              <div className="cart-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div>
              <button className="checkout" type="button" onClick={() => alert("Connect Stripe, PayPal, or another payment provider to accept live orders.")}>Checkout <span>→</span></button>
              <p className="secure">🔒 Secure one-time checkout</p>
            </>
          ) : (
            <div className="cart-empty"><div>＋</div><strong>Your cart is empty</strong><span>Add a ranked carry to get started.</span></div>
          )}
          <div className="cart-help"><span>Need help choosing?</span><a href="mailto:support@example.com">Message support →</a></div>
        </aside>
      </div>

      <footer className="shop-footer">
        <span>© 2026 RankRush</span>
        <p>Independent carry service. Not affiliated with Roblox Corporation or Easy.gg.</p>
        <a href="https://robloxbedwars.fandom.com/wiki/Ranked" target="_blank" rel="noreferrer">Rank images: BedWars Wiki ↗</a>
      </footer>
    </main>
  );
}
