"use client";

import React, { useEffect, useRef, useState } from "react";

/* ----------------------------- DATA ----------------------------- */

const NAV = ["Features", "How it works", "Stats", "Reviews", "Pricing"];

const WORDS = ["Faster.", "Smarter.", "Premium.", "Limitless."];

const LOGOS = [
  "VERCEL", "NEXTJS", "REACT", "NODE", "MONGODB", "POSTGRES",
  "STRIPE", "FIGMA", "GITHUB", "DOCKER", "TAILWIND", "PRISMA",
];

const FEATURES = [
  { icon: "⚡", title: "Lightning Fast", text: "Server-side rendering aur edge delivery ke saath har page milliseconds me load hota hai." },
  { icon: "🛡️", title: "Bank-grade Security", text: "End-to-end encryption, role based access aur automatic threat monitoring built-in." },
  { icon: "🎨", title: "Pixel-perfect Design", text: "Har component carefully crafted hai taaki aapka brand premium aur trustworthy lage." },
  { icon: "🤖", title: "AI Powered", text: "Smart automation jo repetitive kaam khud kar deta hai, aap sirf growth par focus karo." },
  { icon: "📈", title: "Realtime Analytics", text: "Live dashboards se turant samjho ki users kya kar rahe hain aur kahan se aa rahe hain." },
  { icon: "🌍", title: "Global Scale", text: "Ek click me poori duniya me deploy karo, traffic spike aaye to bhi zero downtime." },
];

const STEPS = [
  { n: "01", title: "Connect", text: "Apna project ya idea connect karo. Setup sirf kuch minute ka hai." },
  { n: "02", title: "Customize", text: "Design, content aur workflow ko apne brand ke hisaab se customize karo." },
  { n: "03", title: "Launch", text: "Ek click me deploy karo aur duniya ko apna kaam dikhao." },
];

const STATS = [
  { value: 12500, suffix: "+", label: "Happy Users" },
  { value: 99, suffix: ".9%", label: "Uptime" },
  { value: 340, suffix: "+", label: "Projects Shipped" },
  { value: 48, suffix: "ms", label: "Avg Response" },
];

const REVIEWS = [
  { name: "Aarav Sharma", role: "Founder, Startly", text: "Itna smooth aur premium experience maine pehle kabhi nahi dekha. Hamare conversions 2x ho gaye." },
  { name: "Priya Verma", role: "Product Designer", text: "Animations itne clean hain ki client dekhte hi impress ho gaya. Totally worth it." },
  { name: "Rohit Singh", role: "CTO, CloudNest", text: "Performance aur design dono top class. Deploy karna bhi bahut aasan tha." },
];

const PLANS = [
  { name: "Starter", price: "₹0", note: "Hamesha free", feats: ["1 Project", "Basic Analytics", "Community Support"], hot: false },
  { name: "Pro", price: "₹999", note: "per month", feats: ["Unlimited Projects", "Advanced Analytics", "Priority Support", "Custom Domain"], hot: true },
  { name: "Enterprise", price: "Custom", note: "Aapke hisaab se", feats: ["Dedicated Manager", "SLA Guarantee", "SSO & Audit Logs", "Custom Integrations"], hot: false },
];

/* --------------------------- HELPERS ---------------------------- */

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${show ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1800;
        const tick = (t) => {
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.floor(eased * value));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setN(value);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function SpotCard({ children, className = "" }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={`spot ${className}`} onMouseMove={onMove}>
      {children}
    </div>
  );
}

/* ----------------------------- PAGE ----------------------------- */

const Page = () => {
  const [wordIdx, setWordIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const glowRef = useRef(null);

  // typing effect
  useEffect(() => {
    const word = WORDS[wordIdx];
    const speed = deleting ? 50 : 110;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, typed.length + 1);
        setTyped(next);
        if (next === word) setTimeout(() => setDeleting(true), 1200);
      } else {
        const next = word.slice(0, typed.length - 1);
        setTyped(next);
        if (next === "") {
          setDeleting(false);
          setWordIdx((i) => (i + 1) % WORDS.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [typed, deleting, wordIdx]);

  // scroll progress + navbar
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrolled(h.scrollTop > 30);
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // cursor glow
  useEffect(() => {
    const move = (e) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const go = (id) => {
    setMenu(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const ids = ["features", "how", "stats", "reviews", "pricing"];

  return (
    <div className="root">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* progress bar */}
      <div className="progress" style={{ width: `${progress}%` }} />

      {/* background */}
      <div className="bg">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
        <div className="grid" />
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="dot"
            style={{
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i * 0.7) % 9}s`,
              animationDuration: `${9 + ((i * 3) % 8)}s`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
            }}
          />
        ))}
      </div>
      <div className="cursor-glow" ref={glowRef} />

      {/* navbar */}
      <header className={`nav ${scrolled ? "nav-s" : ""}`}>
        <div className="nav-in">
          <a className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="logo">N</span>
            <span>Nova<b>Verse</b></span>
          </a>
          <nav className="links">
            {NAV.map((n, i) => (
              <a key={n} onClick={() => go(ids[i])}>{n}</a>
            ))}
          </nav>
          <div className="nav-cta">
            <button className="btn ghost sm">Login</button>
            <button className="btn primary sm" onClick={() => go("pricing")}>Get Started</button>
          </div>
          <button className={`burger ${menu ? "open" : ""}`} onClick={() => setMenu(!menu)} aria-label="menu">
            <i /><i /><i />
          </button>
        </div>
        <div className={`mobile ${menu ? "show" : ""}`}>
          {NAV.map((n, i) => (
            <a key={n} onClick={() => go(ids[i])}>{n}</a>
          ))}
          <button className="btn primary" onClick={() => go("pricing")}>Get Started</button>
        </div>
      </header>

      {/* hero */}
      <section className="hero">
        <div className="badge">
          <span className="pulse" /> Naya version live hai — v2.0 🚀
        </div>
        <h1 className="h1">
          Apna Business Banao
          <br />
          <span className="grad">{typed}</span>
          <span className="caret" />
        </h1>
        <p className="sub">
          Ek premium platform jo design, speed aur automation ko ek jagah laata hai —
          taaki aap sirf grow karne par dhyan do, baaki sab hum sambhal lenge.
        </p>
        <div className="hero-cta">
          <button className="btn primary lg shine" onClick={() => go("pricing")}>
            Free Me Shuru Karo <span className="arrow">→</span>
          </button>
          <button className="btn ghost lg" onClick={() => go("how")}>
            ▶ Kaise Kaam Karta Hai
          </button>
        </div>
        <div className="trust">
          <div className="avatars">
            {["#7c5cff", "#00d4ff", "#ff5ca8", "#ffb84d"].map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </div>
          <p><b>12,500+</b> log already use kar rahe hain ⭐⭐⭐⭐⭐</p>
        </div>

        {/* floating mock dashboard */}
        <div className="mock">
          <div className="mock-bar">
            <i /><i /><i />
            <span>novaverse.app/dashboard</span>
          </div>
          <div className="mock-body">
            <div className="mock-side">
              {[1, 2, 3, 4, 5].map((x) => (<div key={x} className="ms" />))}
            </div>
            <div className="mock-main">
              <div className="mock-row">
                {[0, 1, 2].map((x) => (
                  <div key={x} className="mk">
                    <small>{["Revenue", "Users", "Growth"][x]}</small>
                    <b>{["₹4.2L", "12.5K", "+38%"][x]}</b>
                  </div>
                ))}
              </div>
              <div className="chart">
                {[40, 65, 50, 80, 60, 95, 75, 100, 85, 110].map((h, i) => (
                  <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="float f1">✅ Deploy successful</div>
          <div className="float f2">📈 +128 new users</div>
        </div>
      </section>

      {/* marquee */}
      <section className="marq">
        <p>Aaj ke best tools ke saath compatible</p>
        <div className="marq-track">
          <div className="marq-row">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="sec">
        <Reveal>
          <div className="head">
            <span className="tag">FEATURES</span>
            <h2>Sab kuch jo aapko <span className="grad">chahiye</span></h2>
            <p>Powerful features jo aapke kaam ko aasan, tez aur professional banate hain.</p>
          </div>
        </Reveal>
        <div className="cards">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <SpotCard className="card">
                <div className="ico">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </SpotCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="sec">
        <Reveal>
          <div className="head">
            <span className="tag">HOW IT WORKS</span>
            <h2>Sirf <span className="grad">3 steps</span> me live</h2>
            <p>Koi complicated setup nahi. Seedha, simple aur fast.</p>
          </div>
        </Reveal>
        <div className="steps">
          <div className="line" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 140}>
              <div className="step">
                <div className="num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* stats */}
      <section id="stats" className="sec">
        <Reveal>
          <div className="stats">
            {STATS.map((s) => (
              <div key={s.label} className="stat">
                <b className="grad"><Counter value={s.value} suffix={s.suffix} /></b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* reviews */}
      <section id="reviews" className="sec">
        <Reveal>
          <div className="head">
            <span className="tag">REVIEWS</span>
            <h2>Log <span className="grad">kya kehte</span> hain</h2>
            <p>Hamare users ka real feedback, bina kisi filter ke.</p>
          </div>
        </Reveal>
        <div className="cards three">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 120}>
              <SpotCard className="card rev">
                <div className="stars">★★★★★</div>
                <p>“{r.text}”</p>
                <div className="who">
                  <span className="av">{r.name[0]}</span>
                  <div>
                    <b>{r.name}</b>
                    <small>{r.role}</small>
                  </div>
                </div>
              </SpotCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="sec">
        <Reveal>
          <div className="head">
            <span className="tag">PRICING</span>
            <h2>Simple aur <span className="grad">transparent</span> pricing</h2>
            <p>Koi hidden charges nahi. Jab chaho upgrade ya cancel karo.</p>
          </div>
        </Reveal>
        <div className="cards three">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 120}>
              <SpotCard className={`card plan ${p.hot ? "hot" : ""}`}>
                {p.hot && <div className="ribbon">Most Popular</div>}
                <h3>{p.name}</h3>
                <div className="price">{p.price}<small> {p.note}</small></div>
                <ul>
                  {p.feats.map((f) => (<li key={f}>✓ {f}</li>))}
                </ul>
                <button className={`btn ${p.hot ? "primary shine" : "ghost"} full`}>
                  {p.name === "Enterprise" ? "Contact Sales" : "Shuru Karo"}
                </button>
              </SpotCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* final CTA */}
      <section className="sec">
        <Reveal>
          <div className="cta">
            <h2>Taiyaar ho apna agla <span className="grad">level</span> unlock karne ke liye?</h2>
            <p>Aaj hi join karo aur dekho kaise ek premium experience aapke business ko badal deta hai.</p>
            <button className="btn primary lg shine">Abhi Start Karo <span className="arrow">→</span></button>
          </div>
        </Reveal>
      </section>

      {/* footer */}
      <footer className="foot">
        <div className="foot-in">
          <div className="brand">
            <span className="logo">N</span>
            <span>Nova<b>Verse</b></span>
          </div>
          <div className="foot-links">
            {NAV.map((n, i) => (<a key={n} onClick={() => go(ids[i])}>{n}</a>))}
          </div>
          <p>© 2026 NovaVerse. Made with ❤️ in India.</p>
        </div>
      </footer>
    </div>
  );
};

export default Page;

/* ----------------------------- CSS ------------------------------ */

const css = `
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#05060f}
.root{
  --bg:#05060f;--fg:#eef0ff;--mute:#9aa0c3;
  --a:#7c5cff;--b:#00d4ff;--c:#ff5ca8;
  --glass:rgba(255,255,255,.04);--bd:rgba(255,255,255,.09);
  min-height:100vh;background:var(--bg);color:var(--fg);overflow-x:hidden;position:relative;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  -webkit-font-smoothing:antialiased;
}
a{cursor:pointer;text-decoration:none;color:inherit}
.grad{background:linear-gradient(110deg,var(--a),var(--b),var(--c),var(--a));background-size:250% auto;
  -webkit-background-clip:text;background-clip:text;color:transparent;animation:gmove 6s linear infinite}
@keyframes gmove{to{background-position:250% center}}

.progress{position:fixed;top:0;left:0;height:3px;z-index:200;background:linear-gradient(90deg,var(--a),var(--b),var(--c));box-shadow:0 0 12px var(--a)}

/* background */
.bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.orb{position:absolute;border-radius:50%;filter:blur(110px);opacity:.45}
.o1{width:520px;height:520px;background:var(--a);top:-120px;left:-120px;animation:fl1 16s ease-in-out infinite}
.o2{width:460px;height:460px;background:var(--b);top:30%;right:-140px;opacity:.3;animation:fl2 19s ease-in-out infinite}
.o3{width:420px;height:420px;background:var(--c);bottom:-120px;left:30%;opacity:.25;animation:fl1 22s ease-in-out infinite reverse}
@keyframes fl1{50%{transform:translate(90px,70px) scale(1.15)}}
@keyframes fl2{50%{transform:translate(-80px,-60px) scale(1.1)}}
.grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size:56px 56px;
  mask-image:radial-gradient(ellipse at 50% 20%,#000 20%,transparent 75%);
  -webkit-mask-image:radial-gradient(ellipse at 50% 20%,#000 20%,transparent 75%)}
.dot{position:absolute;bottom:-10px;border-radius:50%;background:#fff;opacity:0;animation:rise linear infinite}
@keyframes rise{0%{transform:translateY(0);opacity:0}10%{opacity:.7}100%{transform:translateY(-110vh);opacity:0}}
.cursor-glow{position:fixed;top:0;left:0;width:500px;height:500px;border-radius:50%;z-index:1;pointer-events:none;
  background:radial-gradient(circle,rgba(124,92,255,.16),transparent 65%);transition:transform .15s ease-out}

/* nav */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 24px;transition:.35s}
.nav-s{padding:10px 24px}
.nav-in{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;
  padding:10px 18px;border-radius:18px;border:1px solid transparent;transition:.35s}
.nav-s .nav-in{background:rgba(10,12,28,.65);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-color:var(--bd);
  box-shadow:0 10px 40px rgba(0,0,0,.35)}
.brand{display:flex;align-items:center;gap:10px;font-weight:600;font-size:19px;letter-spacing:-.3px}
.brand b{background:linear-gradient(90deg,var(--b),var(--a));-webkit-background-clip:text;background-clip:text;color:transparent}
.logo{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-weight:800;
  background:linear-gradient(135deg,var(--a),var(--b));box-shadow:0 0 22px rgba(124,92,255,.6)}
.links{display:flex;gap:6px}
.links a{padding:8px 14px;border-radius:10px;font-size:14px;color:var(--mute);transition:.25s}
.links a:hover{color:#fff;background:var(--glass)}
.nav-cta{display:flex;gap:10px}
.burger{display:none;background:none;border:0;width:36px;height:36px;cursor:pointer;flex-direction:column;justify-content:center;gap:6px;align-items:center}
.burger i{width:22px;height:2px;background:#fff;border-radius:2px;transition:.3s}
.burger.open i:nth-child(1){transform:translateY(8px) rotate(45deg)}
.burger.open i:nth-child(2){opacity:0}
.burger.open i:nth-child(3){transform:translateY(-8px) rotate(-45deg)}
.mobile{display:none}

/* buttons */
.btn{font:inherit;border:0;cursor:pointer;border-radius:12px;padding:12px 22px;font-weight:600;font-size:15px;color:#fff;
  transition:transform .25s,box-shadow .25s,background .25s;position:relative;overflow:hidden}
.btn.sm{padding:9px 16px;font-size:14px}
.btn.lg{padding:16px 30px;font-size:16px;border-radius:14px}
.btn.full{width:100%;margin-top:auto}
.btn.primary{background:linear-gradient(135deg,var(--a),#5b8cff 55%,var(--b));box-shadow:0 8px 30px rgba(124,92,255,.45)}
.btn.primary:hover{transform:translateY(-3px);box-shadow:0 14px 44px rgba(124,92,255,.65)}
.btn.ghost{background:var(--glass);border:1px solid var(--bd);backdrop-filter:blur(10px)}
.btn.ghost:hover{background:rgba(255,255,255,.09);transform:translateY(-3px)}
.shine::after{content:"";position:absolute;top:0;left:-80%;width:50%;height:100%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-20deg);animation:shine 3.4s infinite}
@keyframes shine{0%{left:-80%}40%,100%{left:140%}}
.arrow{display:inline-block;transition:transform .25s}
.btn:hover .arrow{transform:translateX(5px)}

/* hero */
.hero{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:170px 24px 80px;text-align:center}
.badge{display:inline-flex;align-items:center;gap:10px;padding:8px 18px;border-radius:99px;font-size:13px;color:#cfd3ff;
  background:var(--glass);border:1px solid var(--bd);backdrop-filter:blur(10px);animation:up .8s both}
.pulse{width:8px;height:8px;border-radius:50%;background:#35e0a1;box-shadow:0 0 0 0 rgba(53,224,161,.7);animation:pl 2s infinite}
@keyframes pl{70%{box-shadow:0 0 0 10px rgba(53,224,161,0)}100%{box-shadow:0 0 0 0 rgba(53,224,161,0)}}
.h1{font-size:clamp(42px,7.4vw,88px);line-height:1.04;letter-spacing:-2.5px;font-weight:800;margin:26px 0 22px;animation:up .9s .12s both}
.caret{display:inline-block;width:4px;height:.85em;background:var(--b);margin-left:6px;vertical-align:-.08em;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.sub{max-width:640px;margin:0 auto;font-size:clamp(16px,2vw,19px);line-height:1.7;color:var(--mute);animation:up .9s .25s both}
.hero-cta{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-top:38px;animation:up .9s .38s both}
.trust{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:34px;color:var(--mute);font-size:14px;animation:up .9s .5s both;flex-wrap:wrap}
.trust b{color:#fff}
.avatars{display:flex}
.avatars span{width:34px;height:34px;border-radius:50%;border:2px solid var(--bg);margin-left:-10px}
.avatars span:first-child{margin-left:0}
@keyframes up{from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:none}}

/* mock dashboard */
.mock{position:relative;margin:80px auto 0;max-width:900px;border-radius:20px;border:1px solid var(--bd);
  background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));backdrop-filter:blur(14px);
  box-shadow:0 40px 120px rgba(124,92,255,.28),0 0 0 1px rgba(255,255,255,.03) inset;
  transform:perspective(1400px) rotateX(9deg);animation:mockin 1.2s .6s both,bob 7s 1.8s ease-in-out infinite}
@keyframes mockin{from{opacity:0;transform:perspective(1400px) rotateX(24deg) translateY(80px)}to{opacity:1;transform:perspective(1400px) rotateX(9deg)}}
@keyframes bob{50%{transform:perspective(1400px) rotateX(7deg) translateY(-12px)}}
.mock-bar{display:flex;align-items:center;gap:7px;padding:14px 18px;border-bottom:1px solid var(--bd)}
.mock-bar i{width:11px;height:11px;border-radius:50%;background:#ff5f57}
.mock-bar i:nth-child(2){background:#febc2e}
.mock-bar i:nth-child(3){background:#28c840}
.mock-bar span{margin-left:14px;font-size:12px;color:var(--mute);background:rgba(255,255,255,.05);padding:4px 14px;border-radius:8px}
.mock-body{display:flex;gap:18px;padding:20px;text-align:left}
.mock-side{width:56px;display:flex;flex-direction:column;gap:12px}
.ms{height:36px;border-radius:10px;background:rgba(255,255,255,.06)}
.ms:first-child{background:linear-gradient(135deg,var(--a),var(--b))}
.mock-main{flex:1;min-width:0}
.mock-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.mk{padding:14px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid var(--bd)}
.mk small{display:block;color:var(--mute);font-size:12px;margin-bottom:6px}
.mk b{font-size:clamp(16px,2.6vw,24px)}
.chart{display:flex;align-items:flex-end;gap:10px;height:170px;margin-top:16px;padding:16px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid var(--bd)}
.chart span{flex:1;border-radius:7px 7px 3px 3px;background:linear-gradient(180deg,var(--b),var(--a));transform-origin:bottom;animation:grow 1.2s both}
@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.float{position:absolute;padding:10px 16px;border-radius:12px;font-size:13px;font-weight:600;
  background:rgba(14,16,36,.85);border:1px solid var(--bd);backdrop-filter:blur(12px);box-shadow:0 14px 40px rgba(0,0,0,.45)}
.f1{top:60px;right:-30px;animation:fy 5s ease-in-out infinite}
.f2{bottom:40px;left:-30px;animation:fy 6s 1s ease-in-out infinite}
@keyframes fy{50%{transform:translateY(-14px)}}

/* marquee */
.marq{position:relative;z-index:2;padding:30px 0 70px;text-align:center}
.marq p{color:var(--mute);font-size:13px;letter-spacing:2px;text-transform:uppercase;margin-bottom:26px}
.marq-track{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent)}
.marq-row{display:flex;gap:64px;width:max-content;animation:mq 32s linear infinite}
.marq-row span{font-weight:800;font-size:22px;letter-spacing:2px;color:rgba(255,255,255,.28);transition:.3s}
.marq-row span:hover{color:#fff}
@keyframes mq{to{transform:translateX(-50%)}}

/* sections */
.sec{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:90px 24px}
.head{text-align:center;max-width:640px;margin:0 auto 60px}
.tag{display:inline-block;font-size:12px;letter-spacing:3px;font-weight:700;color:var(--b);padding:6px 16px;border-radius:99px;
  background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.25)}
.head h2{font-size:clamp(30px,4.6vw,52px);letter-spacing:-1.5px;margin:18px 0 14px;line-height:1.12}
.head p{color:var(--mute);line-height:1.7;font-size:17px}
.reveal{opacity:0;transform:translateY(44px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)}
.reveal.in{opacity:1;transform:none}

/* cards */
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.cards>.reveal{display:flex}
.spot{--mx:50%;--my:50%;position:relative;width:100%;border-radius:20px;padding:30px;border:1px solid var(--bd);
  background:var(--glass);overflow:hidden;transition:transform .35s,border-color .35s;display:flex;flex-direction:column}
.spot::before{content:"";position:absolute;inset:0;opacity:0;transition:opacity .35s;pointer-events:none;
  background:radial-gradient(380px circle at var(--mx) var(--my),rgba(124,92,255,.22),transparent 60%)}
.spot:hover{transform:translateY(-8px);border-color:rgba(124,92,255,.5)}
.spot:hover::before{opacity:1}
.card h3{font-size:21px;margin:18px 0 10px;letter-spacing:-.3px}
.card p{color:var(--mute);line-height:1.7;font-size:15px}
.ico{width:54px;height:54px;border-radius:15px;display:grid;place-items:center;font-size:26px;
  background:linear-gradient(135deg,rgba(124,92,255,.25),rgba(0,212,255,.18));border:1px solid var(--bd)}

/* steps */
.steps{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.line{position:absolute;top:34px;left:16%;right:16%;height:2px;background:linear-gradient(90deg,var(--a),var(--b),var(--c));opacity:.4}
.step{text-align:center;padding:0 10px}
.num{position:relative;width:70px;height:70px;margin:0 auto 22px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:20px;
  background:var(--bg);border:2px solid transparent;
  background-image:linear-gradient(var(--bg),var(--bg)),linear-gradient(135deg,var(--a),var(--b));background-origin:border-box;background-clip:padding-box,border-box;
  box-shadow:0 0 34px rgba(124,92,255,.4)}
.step h3{font-size:22px;margin-bottom:10px}
.step p{color:var(--mute);line-height:1.7}

/* stats */
.stats{display:grid;grid-template-columns:repeat(4,1fr);border-radius:26px;border:1px solid var(--bd);
  background:linear-gradient(135deg,rgba(124,92,255,.12),rgba(0,212,255,.06));padding:46px 20px;backdrop-filter:blur(10px)}
.stat{text-align:center;padding:10px;border-right:1px solid var(--bd)}
.stat:last-child{border-right:0}
.stat b{display:block;font-size:clamp(32px,5vw,58px);font-weight:800;letter-spacing:-1.5px}
.stat span{color:var(--mute);font-size:15px}

/* reviews */
.stars{color:#ffc857;letter-spacing:3px;font-size:16px;margin-bottom:14px}
.rev p{font-size:16px;color:#d6d9f5;flex:1}
.who{display:flex;align-items:center;gap:12px;margin-top:24px}
.av{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:700;background:linear-gradient(135deg,var(--a),var(--c))}
.who b{display:block;font-size:15px}
.who small{color:var(--mute)}

/* pricing */
.plan{padding:34px}
.plan h3{margin-top:0}
.price{font-size:46px;font-weight:800;letter-spacing:-1.5px;margin:6px 0 20px}
.price small{font-size:14px;color:var(--mute);font-weight:500;letter-spacing:0}
.plan ul{list-style:none;display:grid;gap:12px;margin-bottom:28px;color:#d0d4f5;font-size:15px}
.plan.hot{border-color:rgba(124,92,255,.7);background:linear-gradient(180deg,rgba(124,92,255,.16),rgba(255,255,255,.03));
  box-shadow:0 20px 70px rgba(124,92,255,.3);transform:scale(1.04)}
.plan.hot:hover{transform:scale(1.04) translateY(-8px)}
.ribbon{position:absolute;top:16px;right:16px;font-size:11px;font-weight:700;letter-spacing:1px;padding:5px 12px;border-radius:99px;
  background:linear-gradient(90deg,var(--a),var(--c));text-transform:uppercase}

/* cta */
.cta{position:relative;text-align:center;padding:80px 28px;border-radius:30px;border:1px solid var(--bd);overflow:hidden;
  background:radial-gradient(circle at 50% 0%,rgba(124,92,255,.35),transparent 60%),var(--glass)}
.cta h2{font-size:clamp(28px,4.6vw,54px);letter-spacing:-1.5px;max-width:760px;margin:0 auto 18px;line-height:1.12}
.cta p{color:var(--mute);max-width:560px;margin:0 auto 34px;line-height:1.7;font-size:17px}

/* footer */
.foot{position:relative;z-index:2;border-top:1px solid var(--bd);padding:44px 24px;margin-top:30px}
.foot-in{max-width:1180px;margin:0 auto;display:flex;flex-wrap:wrap;gap:22px;align-items:center;justify-content:space-between}
.foot-links{display:flex;gap:22px;flex-wrap:wrap}
.foot-links a{color:var(--mute);font-size:14px;transition:.2s}
.foot-links a:hover{color:#fff}
.foot p{color:var(--mute);font-size:14px}

/* responsive */
@media(max-width:960px){
  .links,.nav-cta{display:none}
  .burger{display:flex}
  .mobile{display:flex;flex-direction:column;gap:6px;max-width:1180px;margin:10px auto 0;padding:0 18px;border-radius:18px;
    background:rgba(10,12,28,.92);backdrop-filter:blur(18px);border:1px solid var(--bd);max-height:0;overflow:hidden;opacity:0;transition:.4s}
  .mobile.show{max-height:420px;opacity:1;padding:18px}
  .mobile a{padding:12px 10px;color:var(--mute);border-radius:10px}
  .mobile a:hover{background:var(--glass);color:#fff}
  .cards,.cards.three{grid-template-columns:1fr 1fr}
  .stats{grid-template-columns:1fr 1fr;gap:20px}
  .stat:nth-child(2){border-right:0}
}
@media(max-width:680px){
  .hero{padding-top:140px}
  .cards,.cards.three,.steps{grid-template-columns:1fr}
  .line{display:none}
  .plan.hot,.plan.hot:hover{transform:none}
  .f1,.f2{display:none}
  .mock-side{display:none}
  .sec{padding:60px 20px}
  .stat{border-right:0}
}
@media(prefers-reduced-motion:reduce){
  *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
`;
