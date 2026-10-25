import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, ChartColumn, Check, ChevronLeft, ChevronRight, CircleAlert, Copy, Download, Eye,
  KeyRound, LayoutGrid, List, Package, Plus, Search, Settings, ShieldCheck, Star, Tag, Ticket,
  Trash2, Upload, Users, X,
} from 'lucide-react';
import { Select } from '../../components/Select';
import '../../styles/design.css';

type Sample = {
  id: string;
  name: string;
  dev: string;
  category: string;
  desc: string;
  downloads: number;
  rating: number;
  version: string;
  price: number;
  sale?: number;
  early?: boolean;
};

const SAMPLES: Sample[] = [
  { id: 'harvest-economy', name: 'Harvest Economy', dev: 'fieldwork', category: 'Economy', desc: 'Shops, auctions and a player-run currency with per-world balances and a clean admin ledger.', downloads: 18420, rating: 4.8, version: '3.2.0', price: 1299, sale: 25 },
  { id: 'lantern-warps', name: 'Lantern Warps', dev: 'northlight', category: 'Utilities', desc: 'Named warps, homes and spawn points with cooldowns, costs and per-group limits.', downloads: 52110, rating: 4.6, version: '1.9.4', price: 0 },
  { id: 'gourd-guard', name: 'Gourd Guard', dev: 'patchwatch', category: 'Admin Tools', desc: 'Claim land, roll back griefs and inspect block history down to the tick.', downloads: 9034, rating: 4.9, version: '0.8.1', price: 899, early: true },
  { id: 'chatterbox', name: 'Chatterbox', dev: 'orchard', category: 'Chat', desc: 'Channels, mentions, filters and a moderation queue that does not get in the way.', downloads: 27650, rating: 4.3, version: '2.4.0', price: 0 },
  { id: 'terraform', name: 'Terraform', dev: 'loam', category: 'World Management', desc: 'Brush-based world editing with undo history, schematics and async block placement.', downloads: 14980, rating: 4.7, version: '5.0.2', price: 1999 },
  { id: 'patch-notes', name: 'Patch Notes', dev: 'fieldwork', category: 'Fun', desc: 'Seasonal events, quests and an in-game changelog players actually read.', downloads: 3120, rating: 4.1, version: '1.0.0', price: 499 },
];

const CATEGORIES = ['All', 'Admin Tools', 'Economy', 'Fun', 'World Management', 'Utilities', 'Chat', 'Other'];

const LANGUAGES = ['English', 'Deutsch', 'Français', 'Español', 'Italiano', 'Nederlands', 'Português', 'Polski', 'Русский', 'Türkçe', '日本語', '한국어', '中文'];

const SWATCHES = [
  ['ink', 'Ink', 'Page'], ['surface', 'Surface', 'Header, cards, footer'], ['sunk', 'Sunk', 'Inputs'],
  ['line', 'Line', 'Resting borders'], ['line-2', 'Line 2', 'Control borders'], ['fg', 'Foreground', 'Text, outline buttons'],
  ['muted', 'Muted', 'Secondary text'], ['pumpkin', 'Pumpkin', 'Primary, marks, shadows'], ['success', 'Success', 'Free, stable, ready'],
  ['warning', 'Warning', 'Beta, partly'], ['danger', 'Danger', 'Errors, destructive'], ['info', 'Info', 'Pre-order, notes'],
];

const SECTIONS = [
  ['Colour', 'colour'], ['Type', 'type'], ['Controls', 'controls'], ['Indicators', 'indicators'],
  ['Catalogue', 'catalogue'], ['Plugin page', 'detail'], ['Data', 'data'], ['Feedback', 'feedback'], ['Studio', 'studio'],
];

const gap = (value: string) => ({ '--gap': value } as CSSProperties);

const euro = (cents: number) => `€${(cents / 100).toFixed(2)}`;

const Price = ({ cents, sale, large }: { cents: number; sale?: number; large?: boolean }) => {
  const size = large ? ' cost-lg' : '';
  if (cents === 0) return <span className={`cost cost-free${size}`}>Free</span>;
  if (!sale) return <span className={`cost${size}`}>{euro(cents)}</span>;
  return (
    <span className={`cost cost-sale${size}`}>
      <s>{euro(cents)}</s>
      {euro(Math.round(cents * (1 - sale / 100)))}
    </span>
  );
};

const Stars = ({ value }: { value: number }) => (
  <span className="stars" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map(i => <Star key={i} className={i <= Math.round(value) ? '' : 'off'} />)}
  </span>
);

const Placeholder = ({ name }: { name: string }) => (
  <div className="placeholder">
    <span className="avatar">{name.charAt(0)}</span>
  </div>
);

const Entry = ({ p }: { p: Sample }) => (
  <a className="entry" href="#catalogue">
    <div className="entry-cover">
      <Placeholder name={p.name} />
      <div className="entry-flags">
        {p.sale && <span className="sticker sticker-sm">−{p.sale}%</span>}
        {p.early && <span className="sticker sticker-sm sticker-warning">Early access</span>}
      </div>
    </div>
    <div className="entry-body">
      <div className="entry-meta">
        <span className="label">{p.category}</span>
        <span className="label mono">v{p.version}</span>
      </div>
      <h3 className="entry-name">{p.name}</h3>
      <p className="entry-by">by <strong>{p.dev}</strong></p>
      <p className="entry-desc">{p.desc}</p>
      <div className="entry-foot">
        <span className="entry-stat"><Download />{p.downloads.toLocaleString()}</span>
        <span className="entry-stat"><Star />{p.rating.toFixed(1)}</span>
        <Price cents={p.price} sale={p.sale} />
      </div>
    </div>
  </a>
);

const Row = ({ p }: { p: Sample }) => (
  <a className="listing-row" href="#catalogue">
    <span className="avatar">{p.name.charAt(0)}</span>
    <div className="listing-main">
      <div className="row" style={gap('10px')}>
        <span className="h3">{p.name}</span>
        <span className="label mono">v{p.version}</span>
      </div>
      <p className="entry-desc">{p.desc}</p>
    </div>
    <span className="entry-stat hide-sm"><Download />{p.downloads.toLocaleString()}</span>
    <span className="entry-stat hide-sm"><Star />{p.rating.toFixed(1)}</span>
    <Price cents={p.price} sale={p.sale} />
  </a>
);

const Band = ({ id, title, aside, surface, children }: { id: string; title: ReactNode; aside?: string; surface?: boolean; children: ReactNode }) => (
  <section className={`band${surface ? ' band-surface' : ''}`} id={id}>
    <div className="page sect">
      <header className="sect-head">
        <h2 className="sect-title">{title}</h2>
        {aside && <p className="sect-aside">{aside}</p>}
      </header>
      {children}
    </div>
  </section>
);

const Swatches = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!ref.current) return;
    const style = getComputedStyle(ref.current);
    setValues(Object.fromEntries(SWATCHES.map(([token]) => [token, style.getPropertyValue(`--${token}`).trim()])));
  }, []);

  return (
    <div className="ds-swatches" ref={ref}>
      {SWATCHES.map(([token, name, use]) => (
        <div className="ds-swatch" key={token}>
          <div className="ds-swatch-chip" style={{ background: `var(--${token})` }} />
          <div className="ds-swatch-meta">
            <strong>{name}</strong>
            <span className="mono small">--{token} · {values[token]}</span>
            <span className="small">{use}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Masthead = () => (
  <header className="masthead">
    <div className="page">
      <div className="masthead-bar">
        <Link to="/" className="brand">
          <img src="/icon.png" alt="" />
          <span className="brand-name">Pumpkin <span>Market</span></span>
        </Link>
        <nav className="navlinks" aria-label="Main">
          <a href="#catalogue" aria-current="page">Browse</a>
          <a href="#studio">Studio</a>
          <a href="https://pumpkinmc.org">Docs</a>
        </nav>
        <label className="search">
          <Search />
          <input className="input" type="search" placeholder="Search plugins" aria-label="Search plugins" />
          <span className="kbd">/</span>
        </label>
        <div className="masthead-actions">
          <a className="button button-sm hide-sm" href="#controls">Log in</a>
          <a className="button button-primary button-sm" href="#controls">Sign up</a>
        </div>
      </div>
    </div>
  </header>
);

const Colophon = () => {
  const [language, setLanguage] = useState('English');
  return (
    <footer className="colophon">
      <div className="page">
        <div className="colophon-grid">
          <div className="stack" style={gap('14px')}>
            <span className="brand"><img src="/icon.png" alt="" /><span className="brand-name">Pumpkin <span>Market</span></span></span>
          </div>
          <div className="stack" style={gap('14px')}>
            <span className="label">Market</span>
            <ul><li><a href="#catalogue">Browse</a></li><li><a href="#catalogue">New releases</a></li><li><a href="#catalogue">On sale</a></li></ul>
          </div>
          <div className="stack" style={gap('14px')}>
            <span className="label">Developers</span>
            <ul><li><a href="#studio">Studio</a></li><li><a href="#studio">Publish a plugin</a></li><li><a href="#studio">Developer terms</a></li></ul>
          </div>
          <div className="stack" style={gap('14px')}>
            <span className="label">Legal</span>
            <ul><li><a href="#top">Terms</a></li><li><a href="#top">Privacy</a></li><li><a href="#top">Guidelines</a></li><li><button type="button">Cookie preferences</button></li></ul>
          </div>
        </div>
        <div className="colophon-base">
          <span>© 2026 PumpkinMC · GPL-3.0</span>
          <span className="spacer" />
          <Select options={LANGUAGES} value={language} onChange={setLanguage} aria-label="Language" className="ds-language" />
        </div>
      </div>
    </footer>
  );
};

const DesignSystemPage = () => {
  const [featured, setFeatured] = useState(0);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [pricing, setPricing] = useState('paid');
  const [category, setCategory] = useState('Economy');
  const [rail, setRail] = useState('All');
  const [tab, setTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const hero = SAMPLES[featured];

  const copy = () => {
    navigator.clipboard?.writeText('ppm install harvest-economy');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const fakeSave = () => {
    setBusy(true);
    setTimeout(() => setBusy(false), 1400);
  };

  return (
    <div className="ds market" id="top">
      <Masthead />

      <section className="ds-hero">
        <div className="page ds-hero-grid">
          <div className="stack" style={gap('24px')}>
            <span className="sticker sticker-success">Design system · draft</span>
            <h1 className="display-1">Plugins for a server that boots in <span className="mark">5 ms.</span></h1>
            <p className="lede">
              The Market speaks the same language as <strong>pumpkinmc.org</strong>: heavy Bricolage type,
              3px borders, hard offset shadows and pumpkin orange used like a highlighter.
            </p>
            <div className="row" style={gap('16px')}>
              <a className="button button-primary button-lg" href="#catalogue">Browse plugins<Download /></a>
              <a className="link" href="#controls">See the controls</a>
            </div>
          </div>
          <nav className="ds-index" aria-label="Sections">
            <span className="label">On this page</span>
            {SECTIONS.map(([title, id], i) => (
              <a key={id} href={`#${id}`}><span className="pumpkin num">{String(i + 1).padStart(2, '0')}</span>{title}<ArrowUpRight /></a>
            ))}
          </nav>
        </div>
      </section>

      <Band id="colour" title={<>The <span className="mark">palette</span></>} aside="Lifted straight from pumpkinmc.org. Near-black ink, one surface grey, pumpkin for anything you should look at.">
        <Swatches />
      </Band>

      <Band id="type" surface title={<>Bricolage, <span className="mark">loud</span></>} aside="Bricolage Grotesque 800 for anything that names something. JetBrains Mono only for commands, versions and keys.">
        <div>
          <div className="ds-specimen"><span className="label">display-1 · 68</span><span className="display-1">Harvest <span className="mark">Economy</span></span></div>
          <div className="ds-specimen"><span className="label">display-2 · 48</span><span className="display-2">Plugins worth installing</span></div>
          <div className="ds-specimen"><span className="label">h1 · 36</span><span className="h1">New this week</span></div>
          <div className="ds-specimen"><span className="label">h2 · 28</span><span className="h2 pumpkin">~100 MB at idle</span></div>
          <div className="ds-specimen"><span className="label">h3 · 18</span><span className="h3">Per-world balances</span></div>
          <div className="ds-specimen"><span className="label">lede · 18</span><p className="lede">Shops, auctions and a player-run currency. <strong>No database to set up.</strong> Drop it in and run it.</p></div>
          <div className="ds-specimen"><span className="label">body · 16</span><p className="body" style={{ maxWidth: '66ch' }}>Balances are stored per world and synced on join. Admins can freeze an account, reverse a transaction or export the full ledger as CSV.</p></div>
          <div className="ds-specimen"><span className="label">label · 13</span><span className="label label-fg">Startup time</span></div>
          <div className="ds-specimen"><span className="label">mono</span><span className="mono">ppm install harvest-economy · v3.2.0</span></div>
        </div>
      </Band>

      <Band id="controls" title={<>Press <span className="mark">here</span></>} aside="Every button sits on a hard shadow and lifts toward you on hover. Press it and it lands flat.">
        <div className="ds-grid-2">
          <div className="ds-demo">
            <span className="label">Buttons</span>
            <div className="row" style={gap('16px')}>
              <button className="button button-primary">Buy licence<span className="button-fact">€9.74</span></button>
              <button className="button">Star on GitHub</button>
              <button className="button button-ghost">Cancel</button>
              <button className="button button-danger">Delete</button>
            </div>
            <div className="row" style={gap('16px')}>
              <button className="button button-primary button-lg"><Download />Download<span className="button-fact">412 KB</span></button>
              <button className="button button-sm"><Plus />New coupon</button>
              <button className="button button-icon" aria-label="Settings"><Settings /></button>
            </div>
            <div className="row" style={gap('16px')}>
              <button className="button button-flat">Flat, inside panels</button>
              <button className="button" disabled>Disabled</button>
              <button className="button button-primary" aria-busy={busy} onClick={fakeSave}>Save changes</button>
            </div>

            <span className="label" style={{ marginTop: 20 }}>Chips</span>
            <div className="segmented" role="group" aria-label="Pricing model">
              {['Free', 'Paid', 'Adwall'].map(v => (
                <button key={v} aria-pressed={pricing === v.toLowerCase()} onClick={() => setPricing(v.toLowerCase())}>{v}</button>
              ))}
            </div>

            <span className="label" style={{ marginTop: 20 }}>Choices</span>
            <label className="choice"><input type="checkbox" className="check" defaultChecked /><span>Notify me about updates<span className="small">One email per release, never marketing.</span></span></label>
            <label className="choice"><input type="checkbox" className="check" /><span>Include pre-releases</span></label>
            <label className="choice"><input type="radio" name="track" className="radio" defaultChecked /><span>Stable</span></label>
            <label className="choice"><input type="radio" name="track" className="radio" /><span>Beta</span></label>
            <label className="choice" style={{ alignItems: 'center' }}><input type="checkbox" role="switch" className="toggle" defaultChecked /><span>Sale active</span></label>
          </div>

          <div className="ds-demo">
            <span className="label">Fields</span>
            <div className="fields" style={{ '--cols': 2 } as CSSProperties}>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span className="field-label">Plugin name</span>
                <span className="control"><input className="input" defaultValue="Harvest Economy" /></span>
                <span className="field-hint">Shown on the listing and in search.</span>
              </label>
              <label className="field">
                <span className="field-label">Price <em>excl. VAT</em></span>
                <span className="control"><span className="affix">€</span><input className="input num" defaultValue="12.99" inputMode="decimal" /></span>
              </label>
              <label className="field">
                <span className="field-label" id="ds-category">Category</span>
                <Select options={CATEGORIES.slice(1)} value={category} onChange={setCategory} aria-labelledby="ds-category" />
              </label>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span className="field-label">Source link</span>
                <span className="control"><input className="input" defaultValue="github.com/fieldwork" aria-invalid="true" /></span>
                <span className="field-error"><CircleAlert size={14} />Enter a full URL, starting with https://</span>
              </label>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span className="field-label">Release notes</span>
                <span className="control"><textarea className="input" defaultValue="Fixed balance desync when switching worlds." /></span>
              </label>
              <label className="field">
                <span className="field-label">Plugin ID</span>
                <span className="control"><input className="input mono" value="plg_7Hq2Kd" disabled readOnly /></span>
              </label>
              <label className="field">
                <span className="field-label">Sale discount</span>
                <span className="control"><input className="input num" defaultValue="25" /><span className="affix">%</span></span>
              </label>
            </div>
          </div>
        </div>
      </Band>

      <Band id="indicators" surface title={<>Small <span className="mark">signals</span></>}>
        <div className="ds-grid-3">
          <div className="ds-demo">
            <span className="label">Stickers</span>
            <div className="row" style={gap('14px')}>
              <span className="sticker sticker-success">Ready</span>
              <span className="sticker">−25%</span>
              <span className="sticker sticker-warning">Early access</span>
              <span className="sticker sticker-fg">Staff pick</span>
            </div>
            <span className="label" style={{ marginTop: 12 }}>Tags</span>
            <div className="row" style={gap('8px')}>
              <span className="tag tag-solid tag-success">Stable</span>
              <span className="tag tag-solid tag-warning">Beta</span>
              <span className="tag tag-solid tag-danger">Rejected</span>
              <span className="tag">Loading</span>
              <span className="tag tag-fg">Economy</span>
              <span className="tag tag-pumpkin">Verified</span>
              <span className="tag tag-info">Pre-order</span>
              <span className="tag tag-fg"><Tag />wasm32</span>
            </div>
          </div>
          <div className="ds-demo">
            <span className="label">Price</span>
            <div className="stack" style={gap('10px')}>
              <Price cents={0} />
              <Price cents={1999} />
              <Price cents={1299} sale={25} />
              <Price cents={1299} sale={25} large />
            </div>
            <span className="label" style={{ marginTop: 12 }}>Rating</span>
            <div className="row"><Stars value={4.6} /><span className="small">4.6 · 212 reviews</span></div>
            <span className="label" style={{ marginTop: 12 }}>Meter</span>
            <div className="meter"><span style={{ width: '72%' }} /></div>
            <div className="meter meter-pumpkin"><span style={{ width: '38%' }} /></div>
          </div>
          <div className="ds-demo">
            <span className="label">Status</span>
            <div className="stack" style={gap('10px')}>
              <span className="status"><span className="mark-box mark-box-success"><Check /></span>Published</span>
              <span className="status"><span className="mark-box mark-box-warning"><CircleAlert /></span>Under review</span>
              <span className="status"><span className="mark-box mark-box-danger"><X /></span>Suspended</span>
              <span className="status"><span className="dot" />Draft</span>
            </div>
            <span className="label" style={{ marginTop: 12 }}>Avatar · keys · loading</span>
            <div className="row" style={gap('10px')}>
              <span className="avatar">H</span>
              <span className="avatar avatar-fg">L</span>
              <span className="avatar avatar-ghost">G</span>
              <span className="kbd">/</span><span className="kbd">Ctrl</span><span className="kbd">K</span>
              <span className="loading" />
            </div>
          </div>
        </div>
      </Band>

      <Band id="catalogue" title={<>The <span className="mark">catalogue</span></>} aside="Home, search and author pages. Cards rest on a grey edge and light up pumpkin on hover.">
        <div>
          <div className="feature">
            <div className="feature-cover"><Placeholder name={hero.name} /></div>
            <div className="feature-body">
              <div className="row">
                <span className="sticker sticker-success">Featured</span>
                <span className="spacer" />
                <span className="label">{hero.category}</span>
              </div>
              <h3 className="display-2">{hero.name}</h3>
              <p className="entry-by">by <strong>{hero.dev}</strong></p>
              <p className="lede" style={{ fontSize: 'var(--t-16)' }}>{hero.desc}</p>
              <dl className="specs">
                <dt>Version</dt><dd className="mono">{hero.version}</dd>
                <dt>Downloads</dt><dd>{hero.downloads.toLocaleString()}</dd>
                <dt>Rating</dt><dd><span className="row" style={{ justifyContent: 'flex-end', ...gap('8px') }}><Stars value={hero.rating} />{hero.rating.toFixed(1)}</span></dd>
              </dl>
              <div className="row" style={{ marginTop: 'auto', ...gap('16px') }}>
                <Price cents={hero.price} sale={hero.sale} large />
                <span className="spacer" />
                <a className="button button-primary" href="#detail">View plugin<ArrowUpRight /></a>
              </div>
            </div>
          </div>
          <div className="feature-steps">
            {SAMPLES.slice(0, 4).map((p, i) => (
              <button key={p.id} className="feature-step" aria-current={i === featured} onClick={() => setFeatured(i)}>
                <span className="num">0{i + 1}</span>{p.name}
              </button>
            ))}
          </div>
        </div>

        <nav className="rail" aria-label="Categories">
          {CATEGORIES.map(c => (
            <a key={c} href="#catalogue" aria-current={rail === c ? 'page' : undefined} onClick={e => { e.preventDefault(); setRail(c); }}>{c}</a>
          ))}
        </nav>

        <div className="row">
          <h3 className="h1">Most installed</h3>
          <span className="spacer" />
          <div className="segmented" role="group" aria-label="Layout">
            <button aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')}><LayoutGrid size={15} />Grid</button>
            <button aria-pressed={layout === 'list'} onClick={() => setLayout('list')}><List size={15} />List</button>
          </div>
        </div>
        {layout === 'grid' ? (
          <div className="catalogue">{SAMPLES.map(p => <Entry key={p.id} p={p} />)}</div>
        ) : (
          <div className="listing">{SAMPLES.map(p => <Row key={p.id} p={p} />)}</div>
        )}
      </Band>

      <Band id="detail" surface title={<>Plugin <span className="mark">page</span></>} aside="Composed from the parts above.">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href="#catalogue">Market</a><ChevronRight />
          <a href="#catalogue">Economy</a><ChevronRight />
          <span aria-current="page">Harvest Economy</span>
        </nav>
        <div className="ds-detail">
          <div className="stack" style={gap('28px')}>
            <div className="row" style={{ alignItems: 'flex-start', ...gap('20px') }}>
              <span className="avatar" style={{ '--size': '84px' } as CSSProperties}>H</span>
              <div className="stack" style={{ flex: 1, minWidth: 0, ...gap('10px') }}>
                <h3 className="display-2">Harvest Economy</h3>
                <div className="row" style={gap('10px')}>
                  <span className="entry-by">by <a className="link" href="#detail">fieldwork</a></span>
                  <span className="tag tag-solid tag-success">Stable</span>
                  <span className="tag tag-fg">Economy</span>
                  <span className="sticker sticker-sm">−25%</span>
                </div>
              </div>
            </div>
            <div className="tabs" role="tablist">
              {[['overview', 'Overview'], ['versions', 'Versions', '14'], ['reviews', 'Reviews', '212'], ['commands', 'Commands', '9']].map(([id, label, count]) => (
                <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
                  {label}{count && <span className="count">{count}</span>}
                </button>
              ))}
            </div>
            {tab === 'reviews' ? (
              <div className="ds-ratings">
                <div className="stack" style={gap('8px')}>
                  <span className="stat-value">4.8</span>
                  <Stars value={4.8} />
                  <span className="small">212 reviews</span>
                </div>
                <div className="ds-ratings-bars">
                  {[[5, 82], [4, 12], [3, 4], [2, 1], [1, 1]].map(([n, pct]) => (
                    <div key={n}>
                      <span className="small">{n}</span>
                      <div className="meter meter-pumpkin"><span style={{ width: `${pct}%` }} /></div>
                      <span className="small" style={{ textAlign: 'right' }}>{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="stack">
                <p className="body">Harvest Economy gives every world its own currency, with shops players run themselves and an auction house that settles instantly. Balances live in your database, not a flat file.</p>
                <h4 className="h2">What's new in <span className="pumpkin">3.2.0</span></h4>
                <ul className="body ds-list">
                  <li>Fixed balance desync when switching worlds.</li>
                  <li>Auction fees are now configurable per category.</li>
                </ul>
              </div>
            )}
          </div>
          <aside className="ds-detail-aside">
            <div className="panel panel-pumpkin">
              <div className="panel-body stack">
                <Price cents={1299} sale={25} large />
                <span className="small">Sale ends in 3 days. One licence covers one server network.</span>
                <button className="button button-primary button-lg button-block">Buy licence</button>
                <div className="cmd">
                  <code>ppm install harvest-economy</code>
                  <button onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'Copied' : 'Copy'}</button>
                </div>
              </div>
            </div>
            <dl className="specs">
              <dt>Version</dt><dd className="mono">3.2.0</dd>
              <dt>Updated</dt><dd>Oct 22, 2026</dd>
              <dt>Released</dt><dd>Mar 9, 2025</dd>
              <dt>Size</dt><dd>412 KB</dd>
              <dt>Downloads</dt><dd>18,420</dd>
              <dt>Source</dt><dd><a className="link link-pumpkin" href="#detail">GitHub</a></dd>
            </dl>
          </aside>
        </div>
      </Band>

      <Band id="data" title={<>Numbers, <span className="mark">big</span></>} aside="Studio analytics, licences and the staff panel. Tables use the checklist look from pumpkinmc.org.">
        <div className="stats">
          <div className="stat"><span className="label">Downloads · 30d</span><span className="stat-value">4,812</span><span className="stat-delta up">+12.4% vs prior</span></div>
          <div className="stat"><span className="label">Revenue · 30d</span><span className="stat-value pumpkin">€1,204</span><span className="stat-delta up">+3.1%</span></div>
          <div className="stat"><span className="label">Page views</span><span className="stat-value">21.7<small>k</small></span><span className="stat-delta down">−4.0%</span></div>
          <div className="stat"><span className="label">Rating</span><span className="stat-value">4.8</span><span className="stat-delta">212 reviews</span></div>
        </div>
        <div className="scroll-x">
          <table className="ledger">
            <thead>
              <tr><th>Licence</th><th>Status</th><th>Issued</th><th className="end">Amount</th><th /></tr>
            </thead>
            <tbody>
              {[
                ['HRV-7K2Q-91XD', 'northlight', 'success', Check, 'Active', 'Oct 21, 2026', 974],
                ['HRV-3MZP-08AL', 'loam', 'success', Check, 'Active', 'Oct 19, 2026', 1299],
                ['HRV-Q0WE-55TR', 'orchard', 'warning', CircleAlert, 'Refund pending', 'Oct 12, 2026', 1299],
                ['HRV-LL8V-2CJN', 'patchwatch', 'danger', X, 'Revoked', 'Sep 30, 2026', 0],
              ].map(([key, holder, tone, Icon, status, date, amount]) => {
                const Mark = Icon as typeof Check;
                return (
                  <tr key={key as string}>
                    <td><strong>{holder as string}</strong><span className="ledger-sub mono">{key as string}</span></td>
                    <td><span className="status"><span className={`mark-box mark-box-${tone}`}><Mark /></span>{status as string}</span></td>
                    <td className="muted">{date as string}</td>
                    <td className="end"><strong>{euro(amount as number)}</strong></td>
                    <td className="end"><button className="button button-ghost button-sm button-icon" aria-label="Revoke"><Trash2 /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="row">
          <span className="small">Showing 1–4 of 38</span>
          <span className="spacer" />
          <nav className="pager" aria-label="Pagination">
            <button className="button button-flat" aria-label="Previous"><ChevronLeft /></button>
            <button className="button button-flat" aria-current="page">1</button>
            <button className="button button-flat">2</button>
            <button className="button button-flat">3</button>
            <span className="muted">…</span>
            <button className="button button-flat">10</button>
            <button className="button button-flat" aria-label="Next"><ChevronRight /></button>
          </nav>
        </div>
      </Band>

      <Band id="feedback" surface title={<>Heads <span className="mark">up</span></>} aside="Notices borrow the Early Development box: a hard border, a matching shadow and a tilted sticker.">
        <div className="stack" style={gap('28px')}>
          <div className="notice">
            <span className="sticker sticker-success">Early development</span>
            <p className="notice-text"><strong>This plugin is not finished.</strong> Configs can change between versions. Run it on a test server first and keep backups.</p>
          </div>
          <div className="notice notice-warning">
            <span className="sticker sticker-warning">Payouts</span>
            <p className="notice-text"><strong>Payout details missing.</strong> Add a bank account before your first sale settles.</p>
            <button className="button button-sm">Add account</button>
          </div>
          <div className="notice notice-danger">
            <span className="sticker sticker-danger">Rejected</span>
            <p className="notice-text"><strong>Upload rejected.</strong> The .wasm file exports no plugin entry point.</p>
          </div>
          <div className="notice notice-plain">
            <span className="sticker sticker-fg">Review</span>
            <p className="notice-text"><strong>Review takes up to 48 hours.</strong> We check every upload for malware and broken manifests.</p>
          </div>
        </div>
        <div className="ds-grid-2">
          <div className="ds-demo">
            <span className="label">Toast</span>
            <div className="toast" role="status"><span className="mark-box"><Check /></span>Licence key copied<button className="button button-sm button-flat">Undo</button></div>
            <span className="label" style={{ marginTop: 20 }}>Dialog</span>
            <button className="button" onClick={() => dialog.current?.showModal()}>Transfer ownership</button>
          </div>
          <div className="blank">
            <span className="h2">No plugins <span className="mark">yet</span></span>
            <p className="small">Upload a .wasm build to create your first listing. It stays a draft until you publish.</p>
            <button className="button button-primary"><Upload />Upload plugin</button>
          </div>
        </div>
        <dialog className="sheet" ref={dialog}>
          <form method="dialog">
            <div className="sheet-head">
              <div className="stack" style={{ flex: 1, ...gap('10px') }}>
                <span className="sticker sticker-danger sticker-sm">Danger zone</span>
                <h3 className="h1">Transfer ownership</h3>
              </div>
              <button className="button button-ghost button-icon" aria-label="Close"><X /></button>
            </div>
            <div className="sheet-body">
              <p className="small">The new owner gets full control of Harvest Economy, its licences and future payouts.</p>
              <label className="field">
                <span className="field-label">New owner</span>
                <span className="control"><input className="input" placeholder="username" /></span>
              </label>
              <label className="field">
                <span className="field-label">Type <em>harvest-economy</em> to confirm</span>
                <span className="control"><input className="input mono" /></span>
              </label>
            </div>
            <div className="sheet-foot">
              <button className="button button-ghost">Cancel</button>
              <button className="button button-danger" value="confirm">Transfer</button>
            </div>
          </form>
        </dialog>
      </Band>

      <Band id="studio" title={<>The <span className="mark">studio</span></>} aside="Developer dashboard shell.">
        <div className="ds-studio">
          <nav className="ds-studio-nav sidenav" aria-label="Studio">
            <span className="sidenav-group label">Workspace</span>
            <a href="#studio"><Package />Plugins<span className="count">6</span></a>
            <a href="#studio"><Users />Audience</a>
            <a href="#studio"><ChartColumn />Analytics</a>
            <span className="sidenav-group label">Harvest Economy</span>
            <a href="#studio"><Eye />Store listing</a>
            <a href="#studio" aria-current="page"><Tag />Pricing</a>
            <a href="#studio"><KeyRound />Licences<span className="count">38</span></a>
            <a href="#studio"><Ticket />Coupons</a>
            <a href="#studio"><ShieldCheck />Danger zone</a>
          </nav>
          <div className="ds-studio-main">
            <div className="row">
              <h3 className="display-2">Pricing</h3>
              <span className="spacer" />
              <span className="status"><span className="mark-box mark-box-success"><Check /></span>Published</span>
            </div>
            <div className="panel">
              <div className="panel-head"><span className="h3">Model</span></div>
              <div className="panel-body stack" style={gap('20px')}>
                <div className="segmented" role="group" aria-label="Pricing model">
                  {['Free', 'Paid', 'Adwall'].map(v => (
                    <button key={v} aria-pressed={pricing === v.toLowerCase()} onClick={() => setPricing(v.toLowerCase())}>{v}</button>
                  ))}
                </div>
                <div className="fields" style={{ '--cols': 3 } as CSSProperties}>
                  <label className="field">
                    <span className="field-label">Base price</span>
                    <span className="control"><span className="affix">€</span><input className="input num" defaultValue="12.99" /></span>
                  </label>
                  <label className="field">
                    <span className="field-label">Sale discount</span>
                    <span className="control"><input className="input num" defaultValue="25" /><span className="affix">%</span></span>
                  </label>
                  <label className="field">
                    <span className="field-label">Customer pays</span>
                    <span className="control"><span className="affix">€</span><input className="input num" value="9.74" disabled readOnly /></span>
                  </label>
                </div>
                <label className="choice" style={{ alignItems: 'center' }}><input type="checkbox" role="switch" className="toggle" defaultChecked /><span>Sale active until Oct 28, 2026</span></label>
              </div>
              <div className="panel-foot">
                <button className="button button-ghost">Discard</button>
                <button className="button button-primary" aria-busy={busy} onClick={fakeSave}>Save pricing</button>
              </div>
            </div>
          </div>
        </div>
      </Band>

      <Colophon />
    </div>
  );
};

export default DesignSystemPage;
