"use client";

import { useMemo, useState } from "react";

const ranks = [
  { name: "Unranked", image: "/items/bronze.png" },
  { name: "Bronze", image: "/items/bronze.png" },
  { name: "Silver", image: "/items/silver.png" },
  { name: "Gold", image: "/items/gold.png" },
  { name: "Platinum", image: "/items/platinum.png" },
  { name: "Diamond", image: "/items/diamond.png" },
  { name: "Emerald", image: "/items/emerald.png" },
  { name: "Nightmare", image: "/items/nightmare.png" },
];

// Price of completing each step: Unranked→Bronze, Bronze→Silver, and so on.
const stepPrices = [0.99, 3, 6, 9, 13, 19, 27];

type CartItem = { from: number; to: number; price: number };

export default function Shop() {
  const [yourRank, setYourRank] = useState(0);
  const [targetRank, setTargetRank] = useState(1);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [configuring, setConfiguring] = useState(false);

  const price = useMemo(
    () => stepPrices.slice(yourRank, targetRank).reduce((total, step) => total + step, 0),
    [yourRank, targetRank],
  );

  const progress = (value: number, min: number, max: number) => `${((value - min) / (max - min)) * 100}%`;
  const estimatedHours = Math.max(1, targetRank - yourRank);

  const chooseYourRank = (value: number) => {
    const next = Math.min(value, ranks.length - 2);
    setYourRank(next);
    if (targetRank <= next) setTargetRank(next + 1);
  };

  const chooseTargetRank = (value: number) => {
    setTargetRank(Math.max(value, yourRank + 1));
  };

  return (
    <main>
      <header className="shop-header">
        <a className="brand" href="#top" aria-label="BedWars Shop"><img src="/bedwars-shop-logo.svg" alt="" />BedWars Shop</a>
        <p>BEDWARS RANKED CARRIES</p>
        <button className="cart-pill" type="button" onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>
          Cart <span>{cartItem ? 1 : 0}</span>
        </button>
      </header>

      <div className="shop-shell" id="top">
        <section className="catalog">
          {configuring ? (
            <>
              <div className="catalog-top">
                <div>
                  <button className="shop-back" type="button" onClick={() => setConfiguring(false)}>← Back to shop</button>
                  <h1>Configure your carry.</h1>
                  <p className="subcopy">Set where you are now and where you want to go. Your price updates instantly.</p>
                </div>
                <div className="shop-status"><i /> Carries online</div>
              </div>

              <div className="configurator">
                <div className="rank-preview">
                  <div className="preview-icon"><img src={ranks[targetRank].image} alt={`${ranks[targetRank].name} BedWars rank icon`} /></div>
                  <div>
                    <span>YOUR RANKED CARRY</span>
                    <h2>{ranks[yourRank].name} <b>→</b> {ranks[targetRank].name}</h2>
                    <p>Queue with an experienced teammate until you reach your selected target.</p>
                  </div>
                </div>

                <div className="slider-section">
                  <div className="slider-heading"><div><p>Your rank</p></div><strong>{ranks[yourRank].name}</strong></div>
                  <input
                    className="rank-slider"
                    type="range"
                    min="0"
                    max={ranks.length - 2}
                    step="1"
                    value={yourRank}
                    onChange={(event) => chooseYourRank(Number(event.target.value))}
                    style={{ "--fill": progress(yourRank, 0, ranks.length - 2) } as React.CSSProperties}
                    aria-label="Your current rank"
                  />
                  <div className="rank-labels">{ranks.slice(0, -1).map((rank, index) => <button type="button" className={yourRank === index ? "selected" : ""} onClick={() => chooseYourRank(index)} key={rank.name}>{rank.name}</button>)}</div>
                </div>

                <div className="slider-section">
                  <div className="slider-heading"><div><p>Target rank</p></div><strong>{ranks[targetRank].name}</strong></div>
                  <input
                    className="rank-slider"
                    type="range"
                    min="1"
                    max={ranks.length - 1}
                    step="1"
                    value={targetRank}
                    onChange={(event) => chooseTargetRank(Number(event.target.value))}
                    style={{ "--fill": progress(targetRank, 1, ranks.length - 1) } as React.CSSProperties}
                    aria-label="Your target rank"
                  />
                  <div className="rank-labels target-labels">{ranks.slice(1).map((rank, index) => {
                    const rankIndex = index + 1;
                    const disabled = rankIndex <= yourRank;
                    return <button type="button" disabled={disabled} className={targetRank === rankIndex ? "selected" : ""} onClick={() => chooseTargetRank(rankIndex)} key={rank.name}>{rank.name}</button>;
                  })}</div>
                </div>

                <div className="quote">
                  <div><span>ESTIMATED TIME</span><strong>{estimatedHours}–{estimatedHours + 2} hours</strong></div>
                  <div className="quote-price"><span>YOUR PRICE</span><strong>${price.toFixed(2)} <small>USD</small></strong></div>
                  <button type="button" onClick={() => setCartItem({ from: yourRank, to: targetRank, price })}>Add to cart <span>+</span></button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="catalog-top">
                <div>
                  <p className="crumb">SHOP / RANKED CARRIES</p>
                  <h1>Ranked Carries</h1>
                  <p className="subcopy">Choose a service, set your current and target rank, and get an instant price.</p>
                </div>
                <div className="shop-status"><i /> Carries online</div>
              </div>

              <div className="shop-items">
                <article className="shop-item">
                  <button className="shop-item-image" type="button" onClick={() => setConfiguring(true)} aria-label="Configure Ranked Carry">
                    <span>AVAILABLE NOW</span>
                    <img src="/items/nightmare.png" alt="Nightmare BedWars rank icon" />
                  </button>
                  <div className="shop-item-copy">
                    <span>BEDWARS SERVICE</span>
                    <h2>Ranked Carry</h2>
                    <p>Choose your current rank and target rank. Pricing scales with each rank step.</p>
                    <div className="shop-item-bottom">
                      <div><small>STARTING AT</small><strong>${stepPrices[0].toFixed(2)}</strong></div>
                      <button type="button" onClick={() => setConfiguring(true)}>Configure <span>→</span></button>
                    </div>
                  </div>
                </article>
              </div>
            </>
          )}
        </section>

        <aside className="cart" id="cart">
          <div className="cart-title"><div><p>YOUR CART</p><h2>{cartItem ? "1 item" : "Empty"}</h2></div><span>{cartItem ? 1 : 0}</span></div>
          {cartItem ? (
            <>
              <div className="cart-lines">
                <div className="cart-line">
                  <div className="cart-thumb"><img src={ranks[cartItem.to].image} alt="" /></div>
                  <div className="line-copy"><strong>Carry to {ranks[cartItem.to].name}</strong><span>${cartItem.price.toFixed(2)}</span><small>{ranks[cartItem.from].name} → {ranks[cartItem.to].name}</small></div>
                  <button className="remove" type="button" onClick={() => setCartItem(null)}>Remove</button>
                </div>
              </div>
              <div className="cart-summary"><div><span>Subtotal</span><b>${cartItem.price.toFixed(2)}</b></div><div><span>Service fee</span><b>$0.00</b></div></div>
              <div className="cart-total"><span>Total</span><strong>${cartItem.price.toFixed(2)}</strong></div>
              <button className="checkout" type="button" onClick={() => alert("Connect Stripe, PayPal, or another payment provider to accept live orders.")}>Checkout <span>→</span></button>
              <p className="secure">Secure one-time checkout</p>
            </>
          ) : (
            <div className="cart-empty"><div>+</div><strong>Your cart is empty</strong><span>Build your ranked carry to get started.</span></div>
          )}
          <div className="cart-help"><span>Need help choosing?</span><a href="mailto:support@example.com">Message support →</a></div>
        </aside>
      </div>

      <footer className="shop-footer">
        <span>© 2026 BedWars Shop</span>
        <p>Independent carry service. Not affiliated with Roblox Corporation or Easy.gg.</p>
        <a href="https://robloxbedwars.fandom.com/wiki/Ranked" target="_blank" rel="noreferrer">Rank images: BedWars Wiki ↗</a>
      </footer>
    </main>
  );
}
