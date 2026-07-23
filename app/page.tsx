"use client";

import { useState } from "react";

const carries = [
  {
    id: "gold",
    from: "Bronze",
    to: "Gold",
    price: 4.99,
    eta: "1–2 hours",
    tone: "bronze",
    description: "A quick climb for new ranked players.",
  },
  {
    id: "platinum",
    from: "Gold",
    to: "Platinum",
    price: 7.99,
    eta: "2–3 hours",
    tone: "gold",
    description: "Skip the grind and lock in Platinum.",
  },
  {
    id: "diamond",
    from: "Platinum",
    to: "Diamond",
    price: 11.99,
    eta: "3–5 hours",
    tone: "diamond",
    description: "Our most popular competitive push.",
    popular: true,
  },
  {
    id: "nightmare",
    from: "Diamond",
    to: "Nightmare",
    price: 19.99,
    eta: "5–8 hours",
    tone: "nightmare",
    description: "The complete top-rank carry experience.",
  },
];

export default function Home() {
  const [selected, setSelected] = useState(carries[2]);

  const chooseCarry = (carry: (typeof carries)[number]) => {
    setSelected(carry);
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="RankRush home">
          <span className="brand-mark">R</span>
          <span>RankRush</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#carries">Carries</a>
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-cta" href="#carries">View prices</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Online now · Average start in 6 min</div>
          <h1>Rank up.<br />Skip the grind.</h1>
          <p>Fast, private BedWars ranked carries with experienced teammates. Pick your target rank and queue when you’re ready.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#carries">Shop ranked carries <span>→</span></a>
            <a className="text-button" href="#how">See how it works</a>
          </div>
          <div className="trust-row" aria-label="Shop highlights">
            <div><strong>1,800+</strong><span>carries completed</span></div>
            <div><strong>4.9/5</strong><span>player rating</span></div>
            <div><strong>24/7</strong><span>support online</span></div>
          </div>
        </div>
        <div className="hero-art" aria-label="A clean display of BedWars ranked badges">
          <div className="art-caption"><span>LIVE ORDER</span><strong>Diamond push</strong></div>
          <div className="rank-stack">
            <div className="rank-card back-card"><span>GOLD</span></div>
            <div className="rank-card mid-card"><span>PLATINUM</span></div>
            <div className="rank-card front-card">
              <div className="rank-gem"><i /><b>D</b><i /></div>
              <span>DIAMOND</span>
              <small>Rank reached</small>
            </div>
          </div>
          <div className="art-status"><span className="status-dot" /> Carry complete <b>+42 RP</b></div>
        </div>
      </section>

      <section className="section" id="carries">
        <div className="section-heading">
          <div><span className="kicker">Simple pricing</span><h2>Choose your rank.</h2></div>
          <p>One clear price. No subscriptions, hidden fees, or surprise add-ons.</p>
        </div>
        <div className="product-grid">
          {carries.map((carry) => (
            <article className={`product-card ${carry.popular ? "is-popular" : ""}`} key={carry.id}>
              {carry.popular && <div className="popular-label">Most popular</div>}
              <div className={`product-picture ${carry.tone}`}>
                <div className="mini-rank"><i /><b>{carry.to.charAt(0)}</b><i /></div>
                <span>{carry.to}</span>
              </div>
              <div className="product-content">
                <div className="rank-route"><span>{carry.from}</span><b>→</b><span>{carry.to}</span></div>
                <p>{carry.description}</p>
                <div className="price"><strong>${carry.price.toFixed(2)}</strong><span>one time</span></div>
                <div className="eta"><span>◷</span> Estimated {carry.eta}</div>
                <button type="button" onClick={() => chooseCarry(carry)}>Choose carry <span>→</span></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="section-heading compact">
          <div><span className="kicker">The process</span><h2>Three steps. That’s it.</h2></div>
        </div>
        <div className="steps">
          <article><span>01</span><div className="step-icon">↗</div><h3>Pick your rank</h3><p>Choose the target that matches your current placement and checkout.</p></article>
          <article><span>02</span><div className="step-icon">⌁</div><h3>Join the queue</h3><p>We’ll match you with an experienced teammate and confirm your start time.</p></article>
          <article><span>03</span><div className="step-icon">✓</div><h3>Climb together</h3><p>Play alongside your carry, learn the strategy, and reach your new rank.</p></article>
        </div>
      </section>

      <section className="order-section" id="order">
        <div className="order-copy">
          <span className="kicker">Ready when you are</span>
          <h2>Your next rank is closer than it looks.</h2>
          <p>Checkout can be connected to your preferred payment provider when you’re ready to launch.</p>
        </div>
        <div className="order-card">
          <div className="order-top"><span>Selected carry</span><button type="button" onClick={() => document.getElementById("carries")?.scrollIntoView({ behavior: "smooth" })}>Change</button></div>
          <div className="order-product">
            <div className={`order-icon ${selected.tone}`}>{selected.to.charAt(0)}</div>
            <div><strong>{selected.from} → {selected.to}</strong><span>Estimated {selected.eta}</span></div>
            <b>${selected.price.toFixed(2)}</b>
          </div>
          <div className="order-total"><span>Total</span><strong>${selected.price.toFixed(2)} USD</strong></div>
          <button className="checkout-button" type="button" onClick={() => alert("Your shop design is ready. Connect Stripe, PayPal, or another payment provider to accept live orders.")}>Continue to checkout <span>→</span></button>
          <small>Secure checkout · One-time payment</small>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div><span className="kicker">FAQ</span><h2>Good to know.</h2></div>
        <div className="faq-list">
          <details><summary>Do I play during the carry?<span>+</span></summary><p>Yes. RankRush is designed as a play-with carry, so you stay on your own account and queue with an experienced teammate.</p></details>
          <details><summary>How quickly can we start?<span>+</span></summary><p>Most orders begin within 5–15 minutes when the shop is online. Larger rank pushes may need a short scheduling window.</p></details>
          <details><summary>What happens if we lose a match?<span>+</span></summary><p>Your package covers the target rank, not a fixed number of games. The carry continues until the agreed rank is reached.</p></details>
        </div>
      </section>

      <footer>
        <a className="brand" href="#top"><span className="brand-mark">R</span><span>RankRush</span></a>
        <p>Independent BedWars carry service. Not affiliated with Roblox Corporation or Easy.gg.</p>
        <div><a href="#faq">Terms</a><a href="#faq">Privacy</a><span>© 2026</span></div>
      </footer>
    </main>
  );
}
