import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronDown,
  ExternalLink, Search, Share2, Sparkles,
} from 'lucide-react';
import logo from '../assets/presentto-logo.png';
import { categories, posts, tools } from './data.js';

gsap.registerPlugin(useGSAP);
const EcosystemScene = lazy(() => import('./EcosystemScene.jsx'));

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric', month: 'long', year: 'numeric',
});

function getSavedPosts() {
  try {
    return new Set(JSON.parse(localStorage.getItem('presentto-saved-posts') || '[]'));
  } catch {
    return new Set();
  }
}

function Header({ activeView, onNavigate }) {
  return (
    <header className="site-header sticky top-0 z-30">
      <nav className="header-inner shell mx-auto grid grid-cols-[1fr_auto_1fr] items-center" aria-label="Navegación principal">
        <button className={`nav-link justify-self-start ${activeView === 'feed' ? 'is-active' : ''}`} onClick={() => onNavigate('feed')} aria-current={activeView === 'feed' ? 'page' : undefined}>
          <span className="nav-dot" />Feed
        </button>
        <a className="brand flex items-center justify-center" href="#feed" onClick={(event) => { event.preventDefault(); onNavigate('feed'); }} aria-label="Presentto Comunity, ir al Feed">
          <img src={logo} alt="" />
          <span className="brand-copy"><strong>Presentto</strong><small>COMUNITY</small></span>
        </a>
        <button className={`nav-link justify-self-end ${activeView === 'tools' ? 'is-active' : ''}`} onClick={() => onNavigate('tools')} aria-current={activeView === 'tools' ? 'page' : undefined}>
          Tools<ArrowUpRight size={15} strokeWidth={1.8} />
        </button>
      </nav>
    </header>
  );
}

function SectionEyebrow({ children, light = false }) {
  return <span className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-dot" />{children}</span>;
}

function FeedCard({ post, saved, onSave, onShare }) {
  const date = dateFormatter.format(new Date(`${post.date}T12:00:00`));
  return (
    <article className="feed-card group">
      <div className="feed-meta">
        <span className="publisher-avatar"><img src={logo} alt="" /></span>
        <span className="publisher-name">Presentto <Check size={12} strokeWidth={3} /></span>
        <span className="meta-divider">·</span><span>Comunity</span>
        <time dateTime={post.date}>{date}</time>
      </div>
      <div className="feed-copy">
        <span className={`post-label label-${post.label.toLowerCase()}`}>{post.label}</span>
        <h3>{post.title}</h3>
        <p>{post.text}</p>
      </div>
      {post.image && <img className="post-image" src={post.image} alt={post.alt} loading="lazy" />}
      <div className="post-footer">
        <span className="post-topic">{post.tag}</span>
        <div className="post-actions">
          <button className={`quiet-action ${saved ? 'is-saved' : ''}`} onClick={() => onSave(post.id)} aria-pressed={saved} aria-label={saved ? 'Quitar de guardados' : 'Guardar publicación'}>
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Guardado' : 'Guardar'}
          </button>
          <button className="quiet-action" onClick={() => onShare(post)} aria-label="Compartir publicación"><Share2 size={15} />Compartir</button>
        </div>
      </div>
    </article>
  );
}

function FeedView({ onNavigate, notify }) {
  const [filter, setFilter] = useState('Todas');
  const [savedPosts, setSavedPosts] = useState(getSavedPosts);
  const [showSaved, setShowSaved] = useState(false);
  const visiblePosts = useMemo(() => posts.filter((post) => {
    const matchesFilter = filter === 'Todas' || post.label === filter;
    return matchesFilter && (!showSaved || savedPosts.has(post.id));
  }), [filter, savedPosts, showSaved]);

  function toggleSaved(id) {
    const next = new Set(savedPosts);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSavedPosts(next);
    localStorage.setItem('presentto-saved-posts', JSON.stringify([...next]));
    notify(next.has(id) ? 'Guardado en este dispositivo.' : 'Quitado de tus guardados.');
  }

  async function sharePost(post) {
    const url = `${window.location.origin}${window.location.pathname}#feed`;
    try {
      if (navigator.share) await navigator.share({ title: post.title, text: post.title, url });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${post.title} — ${url}`);
        notify('Enlace copiado.');
      } else notify('Puedes copiar el enlace de esta página para compartir.');
    } catch (error) {
      if (error.name !== 'AbortError') notify('No se pudo compartir en este momento.');
    }
  }

  return (
    <div className="view-content">
      <section className="feed-hero shell mx-auto">
        <div className="hero-copy page-reveal">
          <SectionEyebrow>Un ecosistema para emprender</SectionEyebrow>
          <h1>Tu negocio merece <em>llegar más lejos.</em></h1>
          <p>Ideas prácticas, herramientas digitales y señales para avanzar. Un espacio abierto para quienes están construyendo algo propio, en internet y más allá.</p>
          <div className="hero-cta-row">
            <button className="button button-dark" onClick={() => onNavigate('tools')}>Explorar herramientas <ArrowRight size={15} /></button>
            <a className="underlined-link" href="https://presentto.online" target="_blank" rel="noreferrer">Conocer Presentto <ArrowUpRight size={14} /></a>
          </div>
          <div className="hero-index"><span>01</span><span className="index-line" /><span>Comunidad en movimiento</span></div>
        </div>
        <div className="hero-art page-reveal"><Suspense fallback={<div className="scene-loading" aria-hidden="true"><span /></div>}><EcosystemScene /></Suspense></div>
        <div className="hero-bottomline"><span>Una idea puede abrir muchos caminos.</span><ArrowDown size={16} /></div>
      </section>

      <div className="editorial-strip">
        <div className="shell editorial-inner mx-auto"><span className="editorial-stamp"><Sparkles size={14} />Nota editorial</span><p><strong>Un feed hecho para aportar.</strong> Las publicaciones son comunicados, explicaciones y recursos preparados por Presentto. La comunidad puede leer y guardar; solo Presentto publica.</p><span className="editorial-signature">Presentto, para quienes emprenden.</span></div>
      </div>

      <section className="feed-section shell mx-auto" aria-labelledby="feed-section-title">
        <div className="feed-main-column">
          <div className="section-heading page-reveal">
            <div><SectionEyebrow>Ideas para avanzar</SectionEyebrow><h2 id="feed-section-title">Lo que vale la pena saber<span className="heading-period">.</span></h2><p>Perspectivas, guías y novedades para construir tu presencia digital.</p></div>
            <button className={`saved-toggle ${showSaved ? 'is-selected' : ''}`} onClick={() => setShowSaved((value) => !value)} aria-pressed={showSaved}><Bookmark size={15} />{showSaved ? 'Ver todo' : 'Guardados'}<span>{savedPosts.size}</span></button>
          </div>
          <div className="feed-filters" role="group" aria-label="Filtrar publicaciones">
            {['Todas', 'Guía', 'Presentto', 'Idea'].map((item) => <button key={item} className={`filter-pill ${filter === item ? 'is-selected' : ''}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item === 'Todas' ? 'Todo' : item === 'Presentto' ? 'Novedades' : `${item}${item === 'Guía' ? 's' : 's'}`}</button>)}
          </div>
          <div className="feed-list" aria-live="polite">
            {visiblePosts.map((post) => <FeedCard key={post.id} post={post} saved={savedPosts.has(post.id)} onSave={toggleSaved} onShare={sharePost} />)}
            {visiblePosts.length === 0 && <div className="empty-panel"><Bookmark size={20} /><strong>Aún no guardas publicaciones.</strong><span>Guarda una idea y volverá a aparecer aquí.</span></div>}
          </div>
        </div>

        <aside className="feed-sidebar">
          <section className="side-module side-feature">
            <span className="side-kicker">Empieza por aquí <ArrowUpRight size={13} /></span>
            <h3>Una herramienta útil puede liberar horas.</h3>
            <p>Encuentra opciones para crear, organizar, comunicar y vender, con pasos concretos para ponerlas en marcha.</p>
            <button className="side-link" onClick={() => onNavigate('tools')}>Descubrir Tools <ArrowRight size={14} /></button>
          </section>
          <section className="side-module map-module">
            <span className="side-kicker">Presentto MAP</span>
            <h3>Los negocios también merecen ser encontrados.</h3>
            <p>Explora iniciativas y sitios web de Colombia en el mapa de Presentto.</p>
            <a className="side-link" href="https://map.presentto.online" target="_blank" rel="noreferrer">Abrir el mapa <ExternalLink size={13} /></a>
            <div className="map-coordinate"><span>CO</span><span>4°42' N · 74°13' O</span></div>
          </section>
          <blockquote className="side-quote"><span>Una idea Presentto</span><p>“Lo digital no reemplaza tu idea. Le da más caminos para encontrarse con el mundo.”</p></blockquote>
        </aside>
      </section>
    </div>
  );
}

function ToolCard({ tool, index }) {
  const initials = tool.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return (
    <article className="tool-card page-reveal" style={{ '--card-index': index }}>
      <div className="tool-card-top"><span className={`tool-mark mark-${tool.category}`}>{initials}</span>{tool.badge && <span className="tool-badge">{tool.badge}</span>}</div>
      <span className="tool-category-label">{tool.category === 'crear' ? 'Crear imágenes' : tool.category === 'ordenar' ? 'Organizar' : 'Comunicar y vender'}</span>
      <h3>{tool.name}</h3><p className="tool-description">{tool.description}</p>
      <details className="tool-details"><summary>Cómo empezar <ChevronDown size={15} /></summary><ol>{tool.steps.map((step) => <li key={step}>{step}</li>)}</ol></details>
      <a className="tool-visit" href={tool.url} target="_blank" rel="noreferrer">Visitar herramienta <ArrowUpRight size={15} /></a>
    </article>
  );
}

function ToolsView() {
  const [category, setCategory] = useState('todas');
  const [query, setQuery] = useState('');
  const filteredTools = useMemo(() => tools.filter((tool) => {
    const matchesCategory = category === 'todas' || tool.category === category;
    const searchable = `${tool.name} ${tool.description} ${tool.category}`.toLocaleLowerCase('es');
    return matchesCategory && searchable.includes(query.trim().toLocaleLowerCase('es'));
  }), [category, query]);

  return (
    <div className="view-content">
      <section className="tools-hero-band">
        <div className="shell tools-hero-inner mx-auto">
          <div className="tools-intro page-reveal"><SectionEyebrow>Una caja de herramientas para tu negocio</SectionEyebrow><h1>Menos vueltas.<br /><em>Más negocio.</em></h1><p>Un directorio práctico para resolver tareas reales: crear una imagen, ordenar tus cuentas, encontrar clientes y cuidar tu tiempo. Cada ficha explica para qué sirve y cómo empezar.</p></div>
          <aside className="recommendation-note page-reveal"><span className="recommendation-number">01 <span>/ 24</span></span><Sparkles size={18} /><strong>¿Empiezas con diseño?</strong><p>Para crear piezas visuales sin complicarte, nuestra recomendación para empezar es Canva.</p><span className="note-underline" /></aside>
          <div className="tools-band-bottom"><span>Elegidas pensando en el día a día de un negocio.</span><span>01 — 24 herramientas seleccionadas</span></div>
        </div>
      </section>

      <section className="tool-directory shell mx-auto" aria-labelledby="tools-title">
        <div className="directory-heading page-reveal"><div><SectionEyebrow>Explora por necesidad</SectionEyebrow><h2 id="tools-title">Tu siguiente paso, <em>más claro.</em></h2></div><p>Los planes y funciones pueden cambiar; revisa las condiciones vigentes de cada servicio.</p></div>
        <div className="directory-controls">
          <div className="category-tabs" role="group" aria-label="Filtrar herramientas por categoría">{categories.map((item) => <button className={`category-tab ${category === item.id ? 'is-active' : ''}`} key={item.id} onClick={() => setCategory(item.id)} aria-pressed={category === item.id}>{item.label}<span>{item.id === 'todas' ? tools.length : tools.filter((tool) => tool.category === item.id).length}</span></button>)}</div>
          <label className="search-box"><Search size={16} /><span className="sr-only">Buscar herramienta</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar herramienta..." /></label>
        </div>
        <p className="result-count" aria-live="polite">Mostrando <strong>{filteredTools.length}</strong> de {tools.length} herramientas</p>
        <div className="tools-grid" aria-live="polite">{filteredTools.map((tool, index) => <ToolCard key={tool.name} tool={tool} index={index} />)}</div>
        {filteredTools.length === 0 && <div className="empty-panel tool-empty"><Search size={20} /><strong>No encontramos coincidencias.</strong><span>Prueba otra palabra o categoría.</span></div>}
      </section>

      <section className="starter-section shell mx-auto">
        <div className="starter-heading"><SectionEyebrow>Una ruta sencilla</SectionEyebrow><h2>Empieza por hacer espacio<span className="heading-period">.</span></h2><p>Tres movimientos pequeños para poner tu ecosistema digital a trabajar.</p></div>
        <div className="starter-grid">
          <article className="starter-card"><span className="starter-index">01 / ORDENAR</span><h3>Centraliza tus pendientes</h3><p>Elige una fuente de verdad para tus tareas en Trello o Notion. Un lugar confiable evita que los próximos pasos se pierdan entre chats.</p><span className="starter-tool">Notion · Trello</span></article>
          <article className="starter-card"><span className="starter-index">02 / PRESENTARTE</span><h3>Haz que te encuentren</h3><p>Completa tu perfil de negocio en Google y WhatsApp Business con horarios, ubicación, catálogo y una forma clara de contactarte.</p><span className="starter-tool">Google · WhatsApp</span></article>
          <article className="starter-card"><span className="starter-index">03 / COMUNICAR</span><h3>Publica con intención</h3><p>Prepara una pieza útil en Canva y programa tus publicaciones. Revisa qué conversación genera, no solo cuántos likes.</p><span className="starter-tool">Canva · Metricool</span></article>
        </div>
      </section>
    </div>
  );
}

function Footer({ onNavigate }) {
  return <footer className="site-footer"><div className="shell footer-inner mx-auto"><a href="#feed" className="footer-brand" onClick={(event) => { event.preventDefault(); onNavigate('feed'); }}><img src={logo} alt="" /><span><strong>Presentto Comunity</strong><small>Un ecosistema para quienes emprenden.</small></span></a><span className="footer-right">© 2026 Presentto <a href="https://presentto.online" target="_blank" rel="noreferrer">Presentto Online <ExternalLink size={12} /></a><a href="https://map.presentto.online" target="_blank" rel="noreferrer">Presentto MAP <ExternalLink size={12} /></a></span></div></footer>;
}

export default function App() {
  const [activeView, setActiveView] = useState(() => window.location.hash === '#tools' ? 'tools' : 'feed');
  const [toast, setToast] = useState('');
  const contentRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const syncHash = () => setActiveView(window.location.hash === '#tools' ? 'tools' : 'feed');
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, []);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.page-reveal', { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.72, stagger: 0.07, ease: 'power3.out', clearProps: 'all',
      });
      gsap.fromTo('.feed-card', { y: 12, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.52, stagger: 0.08, delay: 0.12, ease: 'power2.out', clearProps: 'all',
      });
    });
    return () => media.revert();
  }, { scope: contentRef, dependencies: [activeView], revertOnUpdate: true });

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function navigate(view) {
    if (view === activeView) return;
    window.history.pushState(null, '', `#${view}`);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function notify(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  }

  return (
    <>
      <a className="skip-link" href="#main">Saltar al contenido</a>
      <Header activeView={activeView} onNavigate={navigate} />
      <main id="main" ref={contentRef}>
        {activeView === 'feed' ? <FeedView onNavigate={navigate} notify={notify} /> : <ToolsView />}
      </main>
      <Footer onNavigate={navigate} />
      <div className={`toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
