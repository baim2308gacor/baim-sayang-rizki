'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowDown, faArrowUpRightFromSquare, faMoon, faSun, faPaperPlane, faXmark, faMessage, faFish, faFutbol, faWandMagicSparkles, faArrowRight, faCompass, faHeart, faPalette } from '@fortawesome/free-solid-svg-icons';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function Portfolio() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accent, setAccent] = useState<'blue' | 'white' | 'green' | 'orange' | 'pink' | 'purple'>('blue');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activePage, setActivePage] = useState<'home' | 'about' | 'hobbies' | 'education' | 'contact'>('home');
  const [showIntro, setShowIntro] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: 'Hai! Aku asisten informasi Rizky. Mau tahu tentang hobi, sekolah, atau cita-citanya? Tanya aja 🙂' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { document.documentElement.dataset.accent = accent; }, [accent]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, loading, chatOpen]);

  async function sendMessage(event?: FormEvent, suggested?: string) {
    event?.preventDefault();
    const content = (suggested ?? input).trim();
    if (!content || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages); setInput(''); setLoading(true); setChatError('');
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: nextMessages.filter((m, i) => i > 0 || m.role === 'user').slice(-12) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Pesan belum terkirim.');
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'Ada kendala. Coba lagi, ya.');
    } finally { setLoading(false); }
  }

  const quickQuestions = ['Apa hobi Rizky?', 'Rizky sekolah di mana?', 'Apa cita-cita Rizky?'];

  return <main className="site-shell" data-page={activePage}>
    {showIntro && <section className="welcome-screen" aria-label="Welcome to my portfolio">
      <div className="welcome-glow welcome-glow-one" /><div className="welcome-glow welcome-glow-two" />
      <div className="welcome-topline"><span className="welcome-brand"><span className="brand-mark">r.</span> rizky<span className="brand-muted">/space</span></span><span className="welcome-edition">PERSONAL PORTFOLIO <span>·</span> 2026</span></div>
      <div className="welcome-center">
        <div className="welcome-orbit"><span className="welcome-orbit-dot" /><span className="welcome-orbit-core">r.</span></div>
        <p className="welcome-kicker"><span className="status-dot" /> A LITTLE SPACE ABOUT ME</p>
        <h1 className="welcome-title">Welcome to<br /><span className="gradient-text">my portfolio.</span></h1>
        <p className="welcome-description">Rizky&apos;s little corner of the internet.</p>
        <button className="button button-primary welcome-enter" onClick={() => setShowIntro(false)}>Explore portfolio <FontAwesomeIcon icon={faArrowRight} /></button>
        <button className="welcome-skip" onClick={() => setShowIntro(false)}>Lewati intro <span>↗</span></button>
      </div>
      <div className="welcome-bottomline"><span>MADE TO FEEL PERSONAL</span><span className="welcome-scroll-mark"><span /> SCROLL LESS, EXPLORE MORE</span><span>01 — INTRO</span></div>
    </section>}
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="topbar glass">
      <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); setActivePage('home'); }} aria-label="Rizky, beranda"><span className="brand-mark">r.</span><span>rizky<span className="brand-muted">/space</span></span></a>
      <nav className="nav-links" aria-label="Navigasi utama"><button className={activePage === 'home' ? 'active' : ''} onClick={() => setActivePage('home')}>Beranda</button><button className={activePage === 'about' ? 'active' : ''} onClick={() => setActivePage('about')}>Tentang</button><button className={activePage === 'hobbies' ? 'active' : ''} onClick={() => setActivePage('hobbies')}>Hobi</button><button className={activePage === 'education' ? 'active' : ''} onClick={() => setActivePage('education')}>Pendidikan</button><button className={activePage === 'contact' ? 'active' : ''} onClick={() => setActivePage('contact')}>Kontak</button></nav>
      <div className="topbar-tools"><button className="palette-toggle" onClick={() => setPaletteOpen(!paletteOpen)} aria-label="Atur warna latar" title="Atur warna"><FontAwesomeIcon icon={faPalette} /><span>Warna</span></button><button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Ganti tema" title="Ganti tema">{theme === 'dark' ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}<span>{theme === 'dark' ? 'Light' : 'Dark'}</span></button></div>
    </header>
    {paletteOpen && <div className="palette-panel glass" role="dialog" aria-label="Pilihan warna latar"><div className="palette-head"><strong>Warna canvas</strong><button onClick={() => setPaletteOpen(false)} aria-label="Tutup pilihan warna"><FontAwesomeIcon icon={faXmark} /></button></div><div className="palette-options">{([{id:'blue',label:'Neon blue',color:'#4d8dff'},{id:'white',label:'Ice white',color:'#f4f7ff'},{id:'green',label:'Acid green',color:'#7dff8a'},{id:'orange',label:'Neon orange',color:'#ff8a3d'},{id:'pink',label:'Hot pink',color:'#ff5bc8'},{id:'purple',label:'Violet',color:'#a18aff'}] as const).map((item) => <button key={item.id} className={`palette-swatch ${accent === item.id ? 'selected' : ''}`} onClick={() => setAccent(item.id)} aria-label={item.label} title={item.label}><span style={{background:item.color}} /><small>{item.label}</small></button>)}</div><p>Ganti glow dan garis canvas sesuai mood.</p></div>}

    <section className="hero section-wrap" id="home" data-view="home">
      <div className="hero-copy"><div className="eyebrow"><span className="status-dot" /> SEBUAH RUANG KECIL TENTANG AKU</div>
        <h1>Kenalan dulu,<br /><span className="gradient-text">aku Rizky.</span></h1>
        <p className="hero-lead">Memancing, main bola, dan punya mimpi besar buat masa depan.</p>
        <div className="hero-actions"><button className="button button-primary" onClick={() => setActivePage('about')}>Kenal lebih dekat <FontAwesomeIcon icon={faArrowRight} /></button><button className="text-link nav-text-button" onClick={() => setActivePage('hobbies')}>Lihat keseharianku <FontAwesomeIcon icon={faArrowDown} /></button></div>
        
      </div>
      <div className="hero-visual"><div className="photo-orbit orbit-a" /><div className="photo-orbit orbit-b" /><div className="hero-photo-frame"><Image src="/images/rizky-profile.jpg" alt="Foto profil M. Rizky Pratama" fill priority sizes="(max-width: 800px) 76vw, 420px" className="hero-photo" /></div><div className="photo-label glass"><span className="label-kicker">THIS IS ME</span><strong>M. Rizky Pratama</strong><span className="label-sub">Sedang bertumbuh, pelan-pelan.</span></div><div className="floating-note glass"><span className="note-icon"><FontAwesomeIcon icon={faCompass} /></span><span><small>FOCUS ON</small><strong>Masa depan</strong></span></div></div>
      <button className="scroll-cue" onClick={() => setActivePage('about')}><span>EXPLORE MORE</span><FontAwesomeIcon icon={faArrowDown} /></button>
    </section>

    <section className="intro-section section-wrap" id="about" data-view="about"><div className="section-heading"><span className="section-index">01 / SEDIKIT CERITA</span><span className="section-rule" /></div><div className="intro-grid"><h2>Nggak harus luar biasa.<br /><span className="muted-heading">Yang penting terus jalan.</span></h2><div className="intro-text"><p>Namaku M. Rizky Pratama. Aku masih belajar mengenal banyak hal, mencari pengalaman, dan menyusun rencana buat masa depan.</p><p>Aku menikmati waktu buat memancing atau main bola. Dua hal yang kelihatannya sederhana, tapi selalu jadi cara menyenangkan buat mengisi waktu luang.</p><div className="mini-facts"><div><span className="fact-label">TANGGAL LAHIR</span><strong>11 Juli 2010</strong></div><div><span className="fact-label">CITA-CITA</span><strong>Pengusaha / Polisi</strong></div></div></div></div></section>

    <section className="hobbies-section section-wrap" id="hobbies" data-view="hobbies"><div className="section-heading"><span className="section-index">02 / DI WAKTU LUANG</span><span className="section-rule" /></div><div className="section-title-row"><h2>Hal yang bikin<br /><span className="gradient-text">hari lebih seru.</span></h2><p>Nggak banyak gaya—ini dua hal yang paling aku suka buat dilakukan di luar rutinitas.</p></div><div className="hobby-grid">
      <article className="hobby-card fishing-card"><div className="hobby-image"><Image src="/images/mancing.jpg" alt="Pemandangan memancing di tepi sungai" fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div className="hobby-overlay" /><div className="hobby-card-content"><span className="hobby-number">HOBI 01</span><div className="hobby-icon"><FontAwesomeIcon icon={faFish} /></div><h3>Memancing</h3><p>Ada enaknya menikmati suasana yang tenang sambil nunggu umpan disambar. Buatku, memancing itu soal sabar dan menikmati prosesnya juga.</p><span className="hobby-tag">SANTAI SEJENAK</span></div></article>
      <article className="hobby-card football-card"><div className="hobby-image"><Image src="/images/sepak-bola.jpg" alt="Bola dan sepatu di lapangan sepak bola" fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div className="hobby-overlay" /><div className="hobby-card-content"><span className="hobby-number">HOBI 02</span><div className="hobby-icon"><FontAwesomeIcon icon={faFutbol} /></div><h3>Main bola</h3><p>Kalau lagi pengin lebih aktif, main bola jadi pilihan. Seru karena bisa gerak, latihan, dan menikmati permainan bareng teman.</p><span className="hobby-tag">GERAK TERUS</span></div></article>
    </div></section>

    <section className="dream-section section-wrap" data-view="about"><div className="dream-card glass"><div className="dream-orb" /><div className="dream-content"><span className="section-index">03 / NANTI MAU JADI APA?</span><h2>Punya mimpi,<br /><span className="gradient-text">sedang menuju ke sana.</span></h2><p>Aku punya dua cita-cita yang ingin terus aku pertimbangkan dan perjuangkan: menjadi pengusaha atau polisi. Perjalanan masih panjang, jadi sekarang waktunya belajar dan mempersiapkan diri.</p><div className="dream-pills"><span><FontAwesomeIcon icon={faCompass} /> Pengusaha</span><span><FontAwesomeIcon icon={faHeart} /> Polisi</span></div></div><div className="dream-side-note">ONE STEP<br />AT A TIME <span>↗</span></div></div></section>

    <section className="journey-section section-wrap" id="journey" data-view="education"><div className="section-heading"><span className="section-index">04 / PERJALANAN SEKOLAH</span><span className="section-rule" /></div><div className="journey-grid"><div><h2>Masih banyak<br /><span className="muted-heading">yang mau dipelajari.</span></h2><p className="journey-intro">Setiap jenjang punya ceritanya sendiri. Ini perjalanan sekolahku sejauh ini.</p><div className="school-photo"><Image src="/images/sekolah.jpg" alt="Gedung sekolah sebagai ilustrasi pendidikan" fill sizes="(max-width: 700px) 100vw, 40vw" /></div><span className="image-caption">BELAJAR, BERTUMBUH, MELANGKAH LAGI.</span></div><div className="timeline"><div className="timeline-item"><span className="timeline-dot" /><span className="timeline-step">01</span><div><h3>SD Taman Cahaya</h3><p>Awal perjalanan sekolah dan belajar hal-hal dasar.</p></div><span className="timeline-status">SELESAI</span></div><div className="timeline-item"><span className="timeline-dot" /><span className="timeline-step">02</span><div><h3>SMP Pesantren Modern Al-Barokah</h3><p>Melanjutkan belajar dan menambah pengalaman.</p></div><span className="timeline-status">SELESAI</span></div><div className="timeline-item current"><span className="timeline-dot" /><span className="timeline-step">03</span><div><h3>SMK S Teladan P. Siantar</h3><p>Melanjutkan perjalanan untuk mempersiapkan masa depan.</p></div><span className="timeline-status">PERJALANAN</span></div></div></div></section>

    <section className="contact-section section-wrap" id="contact" data-view="contact"><div className="contact-card"><div className="contact-copy"><span className="section-index">05 / TERHUBUNG</span><h2>Mau ngobrol?<br /><span className="gradient-text">Boleh banget.</span></h2><p>Kalau mau menyapa atau terhubung, bisa lewat akun di bawah ini.</p><div className="social-links"><a className="social-link" href="https://www.instagram.com/ryskyy_112/" target="_blank" rel="noreferrer"><span className="social-icon instagram-icon"><FontAwesomeIcon icon={faInstagram} /></span><span><small>INSTAGRAM</small><strong>@ryskyy_112</strong></span><FontAwesomeIcon className="social-arrow" icon={faArrowUpRightFromSquare} /></a><a className="social-link" href="https://wa.me/6289682985375" target="_blank" rel="noreferrer"><span className="social-icon whatsapp-icon"><FontAwesomeIcon icon={faWhatsapp} /></span><span><small>WHATSAPP</small><strong>Chat langsung</strong></span><FontAwesomeIcon className="social-arrow" icon={faArrowUpRightFromSquare} /></a></div></div><div className="contact-aside"><div className="contact-aside-glow" /><span className="aside-star">✳</span><p>“Pelan-pelan aja,<br />yang penting tetap<br /><span>punya arah.</span>”</p><span className="aside-caption">M. RIZKY PRATAMA · 2026</span></div></div></section>

    <footer className="footer section-wrap"><button className="brand footer-brand-button" onClick={() => setActivePage('home')}><span className="brand-mark">r.</span><span>rizky<span className="brand-muted">/space</span></span></button><span>All Right Reversed - 2026.</span><button onClick={() => setActivePage('home')} className="back-top back-top-button">KEMBALI KE BERANDA ↑</button></footer>

    <button className="chat-launcher" onClick={() => setChatOpen(true)} aria-label="Tanya AI tentang Rizky"><FontAwesomeIcon icon={faMessage} /><span>Tanya tentang Rizky</span><i /></button>
    {chatOpen && <div className="chat-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setChatOpen(false); }}><section className="chat-panel glass" role="dialog" aria-modal="true" aria-label="Asisten informasi Rizky"><header className="chat-header"><div className="chat-avatar"><FontAwesomeIcon icon={faWandMagicSparkles} /></div><div className="chat-heading"><strong>Teman ngobrol Rizky</strong><span><i /> AI assistant · siap bantu</span></div><button className="chat-close" onClick={() => setChatOpen(false)} aria-label="Tutup chat"><FontAwesomeIcon icon={faXmark} /></button></header><div className="chat-context">Tanya apa aja soal hobi, pendidikan, atau cita-cita Rizky.</div><div className="chat-messages">{messages.map((m, i) => <div key={i} className={`chat-message ${m.role === 'user' ? 'from-user' : 'from-ai'}`}><p>{m.content}</p></div>)}{loading && <div className="chat-message from-ai typing"><span /><span /><span /></div>}{chatError && <div className="chat-error">{chatError} <button onClick={() => sendMessage(undefined, messages[messages.length - 1]?.content)}>Coba lagi</button></div>}<div ref={bottomRef} /></div>{messages.length < 3 && <div className="quick-questions">{quickQuestions.map((q) => <button key={q} onClick={() => sendMessage(undefined, q)} disabled={loading}>{q}</button>)}</div>}<form className="chat-form" onSubmit={(e) => sendMessage(e)}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tulis pertanyaan..." maxLength={2000} aria-label="Pertanyaan untuk AI" /><button type="submit" disabled={!input.trim() || loading} aria-label="Kirim pesan"><FontAwesomeIcon icon={faPaperPlane} /></button></form><div className="chat-disclaimer">Jawaban AI berdasarkan informasi yang tersedia di halaman ini.</div></section></div>}
  </main>;
}
