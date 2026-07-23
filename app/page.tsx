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

const stepPrices = [0.99, 3, 6, 9, 13, 19, 27];
const winCarryStartPrice = 2.99;

type Section = "ranked" | "wins";
type CartItem =
  | { type: "ranked"; from: number; to: number; price: number }
  | { type: "wins"; wins: number; price: number };

export default function Shop() {
  const [section, setSection] = useState<Section>("ranked");
  const [configuring, setConfiguring] = useState(false);
  const [yourRank, setYourRank] = useState(0);
  const [targetRank, setTargetRank] = useState(1);
  const [wins, setWins] = useState(5);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  const rankPrice = useMemo(
    () => stepPrices.slice(yourRank, targetRank).reduce((total, step) => total + step, 0),
    [yourRank, targetRank],
  );
  const winPrice = winCarryStartPrice + ((wins - 5) / 5) * 2.25;

  const progress = (value: number, min: number, max: number) => `${((value - min) / (max - min)) * 100}%`;
  const estimatedRankHours = Math.max(1, targetRank - yourRank);
  const estimatedWinHours = Math.max(1, Math.ceil(wins / 10));

  const chooseYourRank = (value: number) => {
    const next = Math.min(value, ranks.length - 2);
    setYourRank(next);
    if (targetRank <= next) setTargetRank(next + 1);
  };

  const chooseTargetRank = (value: number) => {
    setTargetRank(Math.max(value, yourRank + 1));
  };

  const chooseSection = (next: Section) => {
    setSection(next);
    setConfiguring(false);
  };

  const isRanked = section === "ranked";

  return (
    <main>
      <header className="shop-header">
        <a className="brand" href="#top" aria-label="BedWars Shop"><img src="/bedwars-shop-logo.svg" alt="" />BedWars Shop</a>
        <nav className="shop-nav" aria-label="Shop sections">
          <button className={isRanked ? "active" : ""} type="button" onClick={() => chooseSection("ranked")}>Ranked Carries</button>
          <button className={!isRanked ? "active" : ""} type="button" onClick={() => chooseSection("wins")}>Win Carries</button>
        </nav>
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
                  <p className="subcopy">{isRanked ? "Set where you are now and where you want to go." : "Choose how many wins you want us to secure."} Your price updates instantly.</p>
                </div>
                <div className="shop-status"><i /> Carries online</div>
              </div>

              {isRanked ? (
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
                    <input className="rank-slider" type="range" min="0" max={ranks.length - 2} step="1" value={yourRank} onChange={(event) => chooseYourRank(Number(event.target.value))} style={{ "--fill": progress(yourRank, 0, ranks.length - 2) } as React.CSSProperties} aria-label="Your current rank" />
                    <div className="rank-labels">{ranks.slice(0, -1).map((rank, index) => <button type="button" className={yourRank === index ? "selected" : ""} onClick={() => chooseYourRank(index)} key={rank.name}>{rank.name}</button>)}</div>
                  </div>

                  <div className="slider-section">
                    <div className="slider-heading"><div><p>Target rank</p></div><strong>{ranks[targetRank].name}</strong></div>
                    <input className="rank-slider" type="range" min="1" max={ranks.length - 1} step="1" value={targetRank} onChange={(event) => chooseTargetRank(Number(event.target.value))} style={{ "--fill": progress(targetRank, 1, ranks.length - 1) } as React.CSSProperties} aria-label="Your target rank" />
                    <div className="rank-labels target-labels">{ranks.slice(1).map((rank, index) => {
                      const rankIndex = index + 1;
                      const disabled = rankIndex <= yourRank;
                      return <button type="button" disabled={disabled} className={targetRank === rankIndex ? "selected" : ""} onClick={() => chooseTargetRank(rankIndex)} key={rank.name}>{rank.name}</button>;
                    })}</div>
                  </div>

                  <div className="quote">
                    <div><span>ESTIMATED TIME</span><strong>{estimatedRankHours}–{estimatedRankHours + 2} hours</strong></div>
                    <div className="quote-price"><span>YOUR PRICE</span><strong>${rankPrice.toFixed(2)} <small>USD</small></strong></div>
                    <button type="button" onClick={() => setCartItem({ type: "ranked", from: yourRank, to: targetRank, price: rankPrice })}>Add to cart <span>+</span></button>
                  </div>
                </div>
              ) : (
                <div className="configurator">
                  <div className="rank-preview win-preview">
                    <div className="preview-icon"><img src="/win-carry.svg" alt="BedWars win carry trophy" /></div>
                    <div>
                      <span>YOUR WIN CARRY</span>
                      <h2>{wins} Wins</h2>
                      <p>Queue with an experienced teammate and collect the exact number of wins you choose.</p>
                    </div>
                  </div>

                  <div className="slider-section win-slider-section">
                    <div className="slider-heading"><div><p>Number of wins</p></div><strong>{wins} wins</strong></div>
                    <input className="rank-slider" type="range" min="5" max="100" step="5" value={wins} onChange={(event) => setWins(Number(event.target.value))} style={{ "--fill": progress(wins, 5, 100) } as React.CSSProperties} aria-label="Number of wins" />
                    <div className="win-labels"><span>5</span><span>25</span><span>50</span><span>75</span><span>100 wins</span></div>
                  </div>

                  <div className="quote">
                    <div><span>ESTIMATED TIME</span><strong>{estimatedWinHours}–{estimatedWinHours + 1} hours</strong></div>
                    <div className="quote-price"><span>YOUR PRICE</span><strong>${winPrice.toFixed(2)} <small>USD</small></strong></div>
                    <button type="button" onClick={() => setCartItem({ type: "wins", wins, price: winPrice })}>Add to cart <span>+</span></button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="catalog-top">
                <div>
                  <p className="crumb">SHOP / {isRanked ? "RANKED CARRIES" : "WIN CARRIES"}</p>
                  <h1>{isRanked ? "Ranked Carries" : "Win Carries"}</h1>
                  <p className="subcopy">{isRanked ? "Choose your current and target rank, and get an instant price." : "Choose any amount from 5 to 100 wins and get an instant price."}</p>
                </div>
                <div className="shop-status"><i /> Carries online</div>
              </div>

              <div className="shop-items">
                <article className="shop-item">
                  <button className="shop-item-image" type="button" onClick={() => setConfiguring(true)} aria-label={`Configure ${isRanked ? "Ranked Carry" : "Win Carry"}`}>
                    <span>AVAILABLE NOW</span>
                    <img src={isRanked ? "/items/nightmare.png" : "/win-carry.svg"} alt={isRanked ? "Nightmare BedWars rank icon" : "BedWars win carry trophy"} />
                  </button>
                  <div className="shop-item-copy">
                    <span>BEDWARS SERVICE</span>
                    <h2>{isRanked ? "Ranked Carry" : "Win Carry"}</h2>
                    <p>{isRanked ? "Choose your current rank and target rank. Pricing scales with each rank step." : "Choose from 5 to 100 wins. Pricing updates with every five-win step."}</p>
                    <div className="shop-item-bottom">
                      <div><small>STARTING AT</small><strong>${(isRanked ? stepPrices[0] : winCarryStartPrice).toFixed(2)}</strong></div>
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
                  <div className="cart-thumb"><img src={cartItem.type === "ranked" ? ranks[cartItem.to].image : "/win-carry.svg"} alt="" /></div>
                  <div className="line-copy">
                    <strong>{cartItem.type === "ranked" ? `Carry to ${ranks[cartItem.to].name}` : `${cartItem.wins} Win Carry`}</strong>
                    <span>${cartItem.price.toFixed(2)}</span>
                    <small>{cartItem.type === "ranked" ? `${ranks[cartItem.from].name} → ${ranks[cartItem.to].name}` : `${cartItem.wins} guaranteed wins`}</small>
                  </div>
                  <button className="remove" type="button" onClick={() => setCartItem(null)}>Remove</button>
                </div>
              </div>
              <div className="cart-summary"><div><span>Subtotal</span><b>${cartItem.price.toFixed(2)}</b></div><div><span>Service fee</span><b>$0.00</b></div></div>
              <div className="cart-total"><span>Total</span><strong>${cartItem.price.toFixed(2)}</strong></div>
              <button className="checkout" type="button" onClick={() => alert("Connect Stripe, PayPal, or another payment provider to accept live orders.")}>Checkout <span>→</span></button>
              <p className="secure">Secure one-time checkout</p>
            </>
          ) : (
            <div className="cart-empty"><div>+</div><strong>Your cart is empty</strong><span>Add a carry to get started.</span></div>
          )}
          <div className="cart-help"><span>Need help?</span><a href="https://discord.gg/2zb8fKtakY" target="_blank" rel="noreferrer">Message support →</a></div>
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
