"use client";

import { useMemo, useState } from "react";

const ranks = [
  { name: "Bronze", image: "/items/bronze.png" },
  { name: "Silver", image: "/items/silver.png" },
  { name: "Gold", image: "/items/gold.png" },
  { name: "Platinum", image: "/items/platinum.png" },
  { name: "Diamond", image: "/items/diamond.png" },
  { name: "Emerald", image: "/items/emerald.png" },
  { name: "Nightmare", image: "/items/nightmare.png" },
];

const stepPrices = [1.99, 2.99, 4.99, 6.99, 9.99, 14.99];

const games = [
  { name: "BedWars", image: "/games/bedwars.png", label: "RANKED CARRIES", description: "Rank up faster with an experienced teammate and instant step-by-step pricing.", available: true },
  { name: "Blox Fruits", image: "/games/blox-fruits.png", label: "SHOP OPEN", description: "Leveling, raid carries, and hands-on quest support for your next goal.", available: true },
  { name: "Pet Simulator 99", image: "/games/pet-simulator-99.png", label: "SHOP OPEN", description: "Choose a diamond package and order through Discord.", available: true },
];

const gamePaths = ["/bedwars", "/blox-fruits", "/ps99"];

const gameServices = [
  [
    { name: "Ranked Carry", description: "Choose your current rank and target rank. Pricing scales with each rank step.", price: 1.99, image: "/items/nightmare.png", artStyle: "icon" },
  ],
  [
    { name: "Leveling Run", description: "Focused leveling help tailored to your current progress and goal.", price: 4.99, image: "/items/blox-xp-boost.webp", artStyle: "icon" },
    { name: "Raid Carry", description: "Get an experienced teammate for a fast, coordinated raid clear.", price: 1.99, image: "/items/blox-microchip.webp", artStyle: "icon" },
    { name: "Boss & Quest Help", description: "Support with difficult bosses, quests, and progression roadblocks.", price: 3.99, image: "/items/blox-dough-king.webp", artStyle: "icon" },
  ],
  [
    { name: "Diamonds", description: "Choose from 100M to 10B diamonds and confirm your order through Discord.", price: 1.99, image: "/items/ps99-diamond.png", artStyle: "icon" },
  ],
];

type CartItem = { from: number; to: number; price: number };

const termsText = `By purchasing, requesting, scheduling, participating in, or otherwise making use of this ranked carry service (the "Service"), you irrevocably acknowledge, represent, warrant, and agree that you have voluntarily elected to receive gameplay assistance within Roblox BedWars and that you assume sole and exclusive responsibility for any and all consequences, whether known or unknown, foreseeable or unforeseeable, arising directly or indirectly from your participation in the Service, including, without limitation, changes to your account status, matchmaking outcomes, competitive ranking, seasonal progression, rewards, statistics, connection issues, software errors, game updates, moderation actions, suspensions, restrictions, warnings, temporary or permanent account bans, resets, rollbacks, or any other action taken by Roblox, the game's developers, or any automated or manual enforcement systems, all of which are entirely outside the Provider's possession, authority, influence, or control; accordingly, you expressly understand and agree that the Provider makes no representation or warranty, express or implied, regarding uninterrupted service, matchmaking quality, queue duration, completion time, or any particular competitive outcome, provided, however, that the Provider shall make commercially reasonable efforts to achieve a competitive result substantially similar to the requested objective, with the understanding that the requested rank, rating, division, or milestone constitutes an estimated target rather than a guaranteed outcome due to factors including but not limited to teammate performance, opponent skill, matchmaking variability, server instability, game updates, disconnects, and other unforeseen circumstances beyond the Provider's reasonable control, and that a final result reasonably close to the requested objective shall constitute satisfactory completion of the Service. The Customer further acknowledges and agrees that all listed prices are subject to negotiation at the sole discretion of the Provider; however, any negotiated, discounted, promotional, or otherwise reduced price shall result in modified expectations regarding the outcome of the Service, and the Provider shall no longer be obligated to meet any originally discussed or anticipated rank, rating, division, or competitive milestone, with any negotiated price arrangement being understood as an agreement that the Provider will make reasonable efforts toward completion without guaranteeing any specific rank or progression. Furthermore, under no circumstances shall the Provider be held liable for any direct, indirect, incidental, consequential, exemplary, punitive, special, or otherwise alleged damages, losses, expenses, claims, liabilities, or causes of action arising from or relating to the Service, including but not limited to account moderation, temporary or permanent bans, loss of cosmetics, Battle Pass rewards, ranked rewards, Robux, inventory, progression, digital assets, or account privileges, whether such action occurs before, during, or after completion of the Service. The Customer expressly acknowledges and agrees that all moderation actions are imposed solely at the discretion of Roblox and/or the game's developers and that the Provider bears no responsibility whatsoever for any warning, suspension, restriction, or permanent account ban regardless of whether such action occurs during, after, or as a result of participation in the Service. By proceeding with the Service, the Customer voluntarily assumes all associated risks, waives any claim for reimbursement, compensation, refund, replacement, damages, or other remedy arising from account enforcement, rank outcomes, or competitive performance to the fullest extent permitted by applicable law, agrees that all sales are final once the Service has commenced, and affirms that continued use of the Service constitutes unconditional acceptance of these Terms of Service in their entirety.`;

type ShopProps = { initialGame?: number; startInShop?: boolean };

export default function Shop({ initialGame = 0, startInShop = false }: ShopProps) {
  const [yourRank, setYourRank] = useState(0);
  const [targetRank, setTargetRank] = useState(1);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [configuring, setConfiguring] = useState(startInShop);
  const [showTerms, setShowTerms] = useState(false);
  const [activeGame, setActiveGame] = useState(initialGame);
  const [bedwarsConfiguring, setBedwarsConfiguring] = useState(false);
  const [configuringService, setConfiguringService] = useState<number | null>(null);
  const [optionA, setOptionA] = useState(1);
  const [optionB, setOptionB] = useState(1);

  const price = useMemo(
    () => Math.floor(stepPrices.slice(yourRank, targetRank).reduce((total, step) => total + step, 0)) + 0.99,
    [yourRank, targetRank],
  );

  const progress = (value: number, min: number, max: number) => `${((value - min) / (max - min)) * 100}%`;
  const estimatedHours = Math.max(1, targetRank - yourRank);
  const previousGame = (activeGame - 1 + games.length) % games.length;
  const nextGame = (activeGame + 1) % games.length;

  const serviceConfig = useMemo(() => {
    if (configuringService === null || activeGame === 0) return null;
    const service = gameServices[activeGame][configuringService];

    if (activeGame === 1 && configuringService === 0) {
      return { service, firstLabel: "Current level", firstMin: 100, firstMax: 2500, firstStep: 100, firstValue: `Level ${optionA}`, secondLabel: "Target level", secondMin: 200, secondMax: 2600, secondStep: 100, secondValue: `Level ${optionB}`, summary: `${optionA} → ${optionB}`, detail: "Choose your current and target Blox Fruits level.", price: Math.max(4.99, Math.ceil(Math.max(100, optionB - optionA) / 250) * 5 - 0.01) };
    }
    if (activeGame === 1 && configuringService === 1) {
      const difficulties = ["Normal", "Advanced"];
      return { service, firstLabel: "Number of raids", firstMin: 1, firstMax: 10, firstStep: 1, firstValue: `${optionA} raid${optionA === 1 ? "" : "s"}`, secondLabel: "Raid difficulty", secondMin: 1, secondMax: 2, secondStep: 1, secondValue: difficulties[optionB - 1], summary: `${optionA} ${difficulties[optionB - 1].toLowerCase()} raid${optionA === 1 ? "" : "s"}`, detail: "All configured totals end in .99.", price: optionA * (optionB === 1 ? 1 : 2) + 0.99 };
    }
    if (activeGame === 1) {
      const urgency = ["Standard", "Priority", "Express"];
      return { service, firstLabel: "Objectives", firstMin: 1, firstMax: 8, firstStep: 1, firstValue: `${optionA} objective${optionA === 1 ? "" : "s"}`, secondLabel: "Service speed", secondMin: 1, secondMax: 3, secondStep: 1, secondValue: urgency[optionB - 1], summary: `${optionA} objective${optionA === 1 ? "" : "s"} · ${urgency[optionB - 1]}`, detail: "Choose how many bosses or quests you need and your preferred speed.", price: optionA * 4 + (optionB - 1) * 3 - 0.01 };
    }

    const diamondAmount = optionA >= 1000 ? `${(optionA / 1000).toFixed(optionA % 1000 === 0 ? 0 : 1)}B` : `${optionA}M`;
    return { service, firstLabel: "Diamond amount", firstMin: 100, firstMax: 10000, firstStep: 100, firstValue: `${diamondAmount} diamonds`, secondLabel: "", secondMin: 1, secondMax: 1, secondStep: 1, secondValue: "", summary: `${diamondAmount} Diamonds`, detail: "Choose between 100M and 10B diamonds.", price: Math.round(1 + ((optionA - 100) / 9900) * 28) + 0.99 };
  }, [activeGame, configuringService, optionA, optionB]);

  const rotateGames = (direction: -1 | 1) => {
    setActiveGame((current) => (current + direction + games.length) % games.length);
  };

  const goToGame = (index: number) => {
    setActiveGame(index);
    setShowTerms(false);
    setConfiguring(false);
    setTimeout(() => document.getElementById("games")?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  const openGameShop = (index: number) => {
    window.location.href = gamePaths[index];
  };

  const chooseYourRank = (value: number) => {
    const next = Math.min(value, ranks.length - 2);
    setYourRank(next);
    if (targetRank <= next) setTargetRank(next + 1);
  };

  const chooseTargetRank = (value: number) => {
    setTargetRank(Math.max(value, yourRank + 1));
  };

  const openServiceConfigurator = (serviceIndex: number) => {
    if (activeGame === 0) {
      setBedwarsConfiguring(true);
      return;
    }
    setConfiguringService(serviceIndex);
    if (activeGame === 1 && serviceIndex === 0) {
      setOptionA(100);
      setOptionB(500);
    } else if (activeGame === 2) {
      setOptionA(100);
      setOptionB(1);
    } else {
      setOptionA(1);
      setOptionB(1);
    }
  };

  return (
    <main>
      <header className="shop-header">
        <a className="brand" href="/" aria-label="Return to Roblox Shop main menu"><img src="/roblox-shop-logo.png" alt="" />Roblox Shop</a>
        <nav className="shop-nav" aria-label="Main navigation">
          <button className={!configuring ? "active" : ""} type="button" onClick={() => { window.location.href = "/"; }}>Games</button>
          {games.map((game, index) => (
            <button key={game.name} className={activeGame === index && configuring ? "active" : ""} type="button" onClick={() => openGameShop(index)}>{game.name === "Pet Simulator 99" ? "PS99" : game.name}</button>
          ))}
        </nav>
      </header>

      <div className={showTerms ? "terms-shell" : "shop-shell"} id="top">
        {showTerms ? (
          <section className="terms-page">
            <p className="crumb">LEGAL / TERMS OF SERVICE</p>
            <h1>Terms of Service</h1>
            <p className="terms-intro">Please read these terms before purchasing or participating in a ranked carry.</p>
            <div className="terms-card">
              <p>{termsText}</p>
            </div>
          </section>
        ) : (
          <>
        <section className="catalog" id="games">
          {configuring ? (
            (activeGame === 0 && bedwarsConfiguring) || configuringService !== null ? (
            activeGame === 0 ? (
            <>
              <div className="catalog-top">
                <div>
                  <button className="shop-back" type="button" onClick={() => setBedwarsConfiguring(false)}>← Back to BedWars shop</button>
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
                  <div><span>ESTIMATED TIME</span><strong>{estimatedHours}–{estimatedHours + 2} hours</strong></div>
                  <div className="quote-price"><span>YOUR PRICE</span><strong>${price.toFixed(2)} <small>USD</small></strong></div>
                  <button type="button" onClick={() => { window.location.href = "https://discord.gg/2zb8fKtakY"; }}>Order on Discord <span>→</span></button>
                </div>
              </div>
            </>
            ) : serviceConfig ? (
              <>
                <div className="catalog-top">
                  <div>
                    <button className="shop-back" type="button" onClick={() => setConfiguringService(null)}>← Back to {games[activeGame].name} shop</button>
                    <h1>Configure {serviceConfig.service.name}.</h1>
                    <p className="subcopy">Adjust the sliders below. Your package and price update instantly.</p>
                  </div>
                  <div className="shop-status"><i /> Service online</div>
                </div>

                <div className="configurator">
                  <div className="rank-preview service-config-preview">
                    <div className="preview-icon"><img src={serviceConfig.service.name === "Leveling Run" ? "/items/green-up-arrow.png" : serviceConfig.service.image} alt={`${serviceConfig.service.name} artwork`} /></div>
                    <div>
                      <span>YOUR {games[activeGame].name.toUpperCase()} PACKAGE</span>
                      <h2>{serviceConfig.summary}</h2>
                      <p>{serviceConfig.detail}</p>
                    </div>
                  </div>

                  <div className="slider-section">
                    <div className="slider-heading"><div><p>{serviceConfig.firstLabel}</p></div><strong>{serviceConfig.firstValue}</strong></div>
                    <input className="rank-slider" type="range" min={serviceConfig.firstMin} max={serviceConfig.firstMax} step={serviceConfig.firstStep} value={optionA} onChange={(event) => { const value = Number(event.target.value); setOptionA(value); if (activeGame === 1 && configuringService === 0 && optionB <= value) setOptionB(Math.min(2600, value + 100)); }} style={{ "--fill": progress(optionA, serviceConfig.firstMin, serviceConfig.firstMax) } as React.CSSProperties} aria-label={serviceConfig.firstLabel} />
                  </div>

                  {activeGame !== 2 && (
                    <div className="slider-section">
                      <div className="slider-heading"><div><p>{serviceConfig.secondLabel}</p></div><strong>{serviceConfig.secondValue}</strong></div>
                      <input className="rank-slider" type="range" min={serviceConfig.secondMin} max={serviceConfig.secondMax} step={serviceConfig.secondStep} value={optionB} onChange={(event) => { const value = Number(event.target.value); setOptionB(activeGame === 1 && configuringService === 0 ? Math.max(value, optionA + 100) : value); }} style={{ "--fill": progress(optionB, serviceConfig.secondMin, serviceConfig.secondMax) } as React.CSSProperties} aria-label={serviceConfig.secondLabel} />
                    </div>
                  )}

                  <div className="quote">
                    <div><span>YOUR PACKAGE</span><strong>{serviceConfig.service.name}</strong></div>
                    <div className="quote-price"><span>YOUR PRICE</span><strong>${serviceConfig.price.toFixed(2)} <small>USD</small></strong></div>
                    <button type="button" onClick={() => { window.location.href = "https://discord.gg/2zb8fKtakY"; }}>Order on Discord <span>→</span></button>
                  </div>
                </div>
              </>
            ) : null
            ) : (
              <>
                <div className="catalog-top game-shop-heading">
                  <div>
                    <button className="shop-back" type="button" onClick={() => { window.location.href = "/"; }}>← Back to games</button>
                    <p className="crumb">ROBLOX SHOP / {games[activeGame].name.toUpperCase()}</p>
                    <h1>{games[activeGame].name} Shop</h1>
                    <p className="subcopy">Choose a service below, then continue to Discord to confirm the details and schedule it.</p>
                  </div>
                  <div className="shop-status"><i /> Shop online</div>
                </div>

                <div className="game-shop-hero">
                  <img src={games[activeGame].image} alt={`${games[activeGame].name} artwork`} />
                  <div>
                    <span>{games[activeGame].label}</span>
                    <h2>Choose your service.</h2>
                    <p>{games[activeGame].description}</p>
                  </div>
                </div>

                <div className={`service-grid ${gameServices[activeGame].length === 1 ? "single-service" : ""}`}>
                  {gameServices[activeGame].map((service, serviceIndex) => (
                    <article className={`service-card ${activeGame === 0 ? "bedwars-service-card" : ""}`} key={service.name}>
                      {activeGame === 0 ? (
                        <div className="bedwars-service-art">
                          <span>AVAILABLE NOW</span>
                          <div><img src={service.image} alt={`${service.name} artwork`} /></div>
                        </div>
                      ) : service.name === "Leveling Run" ? (
                        <div className="level-up-stage"><img src="/items/green-up-arrow.png" alt="Green level-up arrow" /></div>
                      ) : service.image === "/items/ps99-diamond.png" ? (
                        <div className="diamond-image-stage"><img src={service.image} alt={`${service.name} artwork`} /></div>
                      ) : (
                        <img className={`service-card-image ${activeGame === 0 ? "rank-art" : ""} ${service.artStyle === "icon" ? "item-art" : ""}`} src={service.image} alt={`${service.name} artwork`} />
                      )}
                      <div className="service-card-content">
                        <small>{games[activeGame].name.toUpperCase()} SERVICE</small>
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        <div className="service-card-bottom">
                          <div><span>STARTING AT</span><strong>${service.price.toFixed(2)}</strong></div>
                          <button type="button" onClick={() => openServiceConfigurator(serviceIndex)}>Configure →</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )
          ) : (
            <>
              <div className="catalog-top">
                <div>
                  <p className="crumb">ROBLOX SHOP / CHOOSE A GAME</p>
                  <h1>Pick your game.</h1>
                  <p className="subcopy">Browse our game shops. Use the arrows to loop through what is available now and what is coming next.</p>
                </div>
                <div className="shop-status"><i /> Shop online</div>
              </div>

              <div className="game-carousel" aria-label="Game selector">
                <button className="carousel-arrow carousel-arrow-left" type="button" onClick={() => rotateGames(-1)} aria-label="Show previous game">←</button>

                <button className="side-game side-game-left" type="button" onClick={() => setActiveGame(previousGame)} aria-label={`Select ${games[previousGame].name}`}>
                  <img src={games[previousGame].image} alt="" />
                  <span>{games[previousGame].name}</span>
                </button>

                <article className="active-game" aria-live="polite">
                  <div className="active-game-art">
                    <span>{games[activeGame].label}</span>
                    <img src={games[activeGame].image} alt={`${games[activeGame].name} game artwork`} />
                  </div>
                  <div className="active-game-copy">
                    <p>SELECTED GAME</p>
                    <h2>{games[activeGame].name}</h2>
                    <span>{games[activeGame].description}</span>
                    {games[activeGame].available ? (
                      <button type="button" onClick={() => openGameShop(activeGame)}>View shop <b>→</b></button>
                    ) : (
                      <button className="coming-soon" type="button" disabled>Coming soon</button>
                    )}
                  </div>
                </article>

                <button className="side-game side-game-right" type="button" onClick={() => setActiveGame(nextGame)} aria-label={`Select ${games[nextGame].name}`}>
                  <img src={games[nextGame].image} alt="" />
                  <span>{games[nextGame].name}</span>
                </button>

                <button className="carousel-arrow carousel-arrow-right" type="button" onClick={() => rotateGames(1)} aria-label="Show next game">→</button>
              </div>

              <div className="game-dots" aria-label="Choose a game">
                {games.map((game, index) => (
                  <button key={game.name} className={activeGame === index ? "active" : ""} type="button" onClick={() => setActiveGame(index)} aria-label={`Select ${game.name}`} aria-current={activeGame === index ? "true" : undefined} />
                ))}
              </div>

              <section className="all-games" id="all-games">
                <div className="all-games-heading">
                  <div>
                    <p className="crumb">ALL GAMES</p>
                    <h2>Browse every game.</h2>
                  </div>
                  <span>{games.length} games</span>
                </div>
                <div className="game-grid">
                  {games.map((game, index) => (
                    <button className="game-grid-card" type="button" key={game.name} onClick={() => openGameShop(index)}>
                      <img src={game.image} alt={`${game.name} artwork`} />
                      <div>
                        <small>{game.available ? "AVAILABLE NOW" : "COMING SOON"}</small>
                        <strong>{game.name}</strong>
                        <span>{game.description}</span>
                        <b>View shop →</b>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <div className="shop-items legacy-shop-item">
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
              <button className="checkout" type="button" onClick={() => { window.location.href = "https://discord.gg/2zb8fKtakY"; }}>Checkout <span>→</span></button>
              <p className="secure">Secure one-time checkout</p>
            </>
          ) : (
            <div className="cart-empty"><div>+</div><strong>Your cart is empty</strong><span>Build your ranked carry to get started.</span></div>
          )}
          <div className="cart-help"><span>Need help?</span><a href="https://discord.gg/2zb8fKtakY" target="_blank" rel="noreferrer">Message support →</a></div>
        </aside>
          </>
        )}
      </div>

      <footer className="shop-footer">
        <span>© 2026 Roblox Shop</span>
        <p>Independent game service. Not affiliated with Roblox Corporation or individual game creators.</p>
        <a href="https://www.roblox.com/" target="_blank" rel="noreferrer">Visit Roblox ↗</a>
      </footer>
    </main>
  );
}
