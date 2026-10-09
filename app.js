/* ==========================================================
   Refugio Mobile — lógica de la aplicación
   TB2 Lean Management · Design Sprint · UPC
   ========================================================== */

(function () {
  "use strict";

  const KEY = "refugio_mobile_v2";

  /* ───────── Estado ───────── */

  function estadoInicial() {
    return {
      alias: null,
      grado: null,
      avatar: AVATARES[0],
      intereses: [],
      entradas: [],            // { texto, fecha, compartida: null | idPsicologo | "equipo" }
      animos: [],
      posts: JSON.parse(JSON.stringify(POSTS_SEMILLA)),
      forumPosts: JSON.parse(JSON.stringify(FORUM_POSTS)),
      chats: {},
      alertaCerrada: null,
      canal: "todos",
      semaforo: null,          // "verde" | "amarillo" | "rojo" | null (no usarlo)
      cita: null,              // { psi, slot }
      citaModo: false,
      privacidadVista: false,
      encuesta: [],            // respuestas de la miniencuesta
      encuestaMostrada: false,
      wrappedVisto: false,
      avatarCat: "animales"    // categoría de avatar seleccionada
    };
  }

  let S = cargar();
  let postActivo = null;
  let psiActivo = null;
  let canalNuevoPost = "desahogo";
  let fotoNueva = null;
  let citaPend = null;
  let encuestaOp = null;
  let foroActivo = null;
  let foroPostActivo = null;
  let wrappedSlide = 0;

  function cargar() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return estadoInicial();
      return Object.assign(estadoInicial(), JSON.parse(raw));
    } catch (e) { return estadoInicial(); }
  }
  function guardar() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  /* ───────── Utilidades ───────── */

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._tid);
    t._tid = setTimeout(() => { t.hidden = true; }, 2400);
  }

  function hora() {
    return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  }

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  /* Avatar 3D (imagen); si no existe, muestra el emoji */
  function av(a, cls) {
    const src = AVATAR_IMG[a];
    return src
      ? `<img class="${cls || "avimg"}" src="${src}" alt="" draggable="false">`
      : `<span class="${cls || "av-emoji"}" style="font-size:inherit">${esc(a)}</span>`;
  }

  const SVG_HEART = '<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 6.6A4.5 4.5 0 0 1 20 9.5c0 6.1-8 11-8 11Z"/></svg>';
  const SVG_COM = '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4V5Z"/></svg>';
  const SVG_SAVE = '<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4V4Z"/></svg>';
  const SVG_CHK = '<svg class="sem__chk" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const SVG_UP = '<svg viewBox="0 0 24 24"><path d="M12 4l7 7H5l7-7Z"/></svg>';
  const SVG_DOWN = '<svg viewBox="0 0 24 24"><path d="M12 20l-7-7h14l-7 7Z"/></svg>';

  /* ───────── Navegación ───────── */

  const CON_TABS = ["feed", "foros", "espacio", "apoyo", "perfil"];

  function ir(pantalla) {
    $$(".screen").forEach(s => { s.hidden = s.dataset.screen !== pantalla; });
    const tabs = $("#tabs");
    tabs.hidden = !CON_TABS.includes(pantalla);
    $$(".tab").forEach(t => t.classList.toggle("is-on", t.dataset.nav === pantalla));

    if (pantalla === "feed")        { pintarBarraMe(); pintarCanales(); pintarSemanal(); pintarFeed(); }
    if (pantalla === "espacio")     { pintarSemaforo(); pintarTags(); pintarEntradas(); }
    if (pantalla === "apoyo")       { pintarApoyo(); }
    if (pantalla === "perfil")      { pintarPerfil(); pintarWrappedTrigger(); }
    if (pantalla === "checkin")     { $$(".mood").forEach(m => m.classList.remove("is-on")); }
    if (pantalla === "foros")       { pintarForos(); }
    if (pantalla === "foro-detail") { pintarForoDetail(); }
    if (pantalla === "foro-post")   { pintarForoPost(); }

    const act = document.querySelector(".screen:not([hidden])");
    if (act) act.scrollTop = 0;
  }

  /* ───────── Registro ───────── */

  function pintarAvatarTabs() {
    const cont = $("#avatar-tabs");
    cont.innerHTML = "";
    AVATAR_CATEGORIAS.forEach(cat => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "avatar-tab" + (S.avatarCat === cat.id ? " is-on" : "");
      b.innerHTML = `<span>${cat.emoji}</span>${esc(cat.nombre)}`;
      b.addEventListener("click", () => {
        S.avatarCat = cat.id;
        pintarAvatarTabs();
        pintarAvatares();
      });
      cont.appendChild(b);
    });
  }

  function pintarAvatares() {
    const cont = $("#avatar-picker");
    cont.innerHTML = "";
    const cat = AVATAR_CATEGORIAS.find(c => c.id === S.avatarCat) || AVATAR_CATEGORIAS[0];
    cat.avatares.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "av" + (a === S.avatar ? " is-on" : "");
      b.innerHTML = av(a);
      b.style.fontSize = "1.5rem";
      b.addEventListener("click", () => {
        $$(".av").forEach(x => x.classList.remove("is-on"));
        b.classList.add("is-on");
        S.avatar = a;
      });
      cont.appendChild(b);
    });
  }

  $("#form-register").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    S.alias = (fd.get("alias") || "").trim() || "Anónimo";
    S.grado = fd.get("grado");
    guardar();
    ir("checkin");
    if (!S.privacidadVista) abrirPrivacidad();
  });

  /* ───────── Privacidad (solo en el primer ingreso) ───────── */

  function abrirPrivacidad() { $("#sheet-privacy").hidden = false; }
  function cerrarPrivacidad() {
    $("#sheet-privacy").hidden = true;
    S.privacidadVista = true;
    guardar();
  }

  /* ───────── Check-in (independiente del semáforo) ───────── */

  $("#moods").addEventListener("click", (e) => {
    const b = e.target.closest(".mood");
    if (!b) return;
    $$(".mood").forEach(m => m.classList.remove("is-on"));
    b.classList.add("is-on");
    S.animos.push({ v: Number(b.dataset.value), fecha: Date.now() });
    guardar();
    setTimeout(() => {
      ir("feed");
      if (animoBajo()) toast("Recuerda que puedes hablar con alguien en Apoyo 💛");
    }, 420);
  });

  function animoBajo() {
    const ult = S.animos.slice(-3);
    return ult.length >= 3 && ult.every(a => a.v <= 2);
  }

  /* ───────── Barra / canales ───────── */

  function pintarBarraMe() {
    $("#bar-me").innerHTML = av(S.avatar);
  }

  function pintarCanales() {
    const cont = $("#channels");
    cont.innerHTML = "";
    CANALES.forEach(c => {
      const b = document.createElement("button");
      b.className = "chan" + (S.canal === c.id ? " is-on" : "");
      b.innerHTML = `<span>${c.emoji}</span>${esc(c.nombre)}`;
      b.addEventListener("click", () => {
        S.canal = c.id; guardar(); pintarCanales(); pintarFeed();
      });
      cont.appendChild(b);
    });
  }

  /* Indicador semanal anónimo */
  function pintarSemanal() {
    const n = BUSCARON_APOYO_BASE + (S.cita ? 1 : 0);
    const caras = ["🦊", "🐼", "🦉"].map(a => `<span class="weekly__av">${av(a)}</span>`).join("");
    $("#weekly").innerHTML = `
      <div class="weekly">
        <div class="weekly__stack">${caras}</div>
        <p class="weekly__txt"><b>Esta semana, ${n} alumnos ya buscaron apoyo.</b>
        <span>Sin nombres. Pedir ayuda es más común de lo que parece.</span></p>
      </div>`;
  }

  /* ───────── Publicaciones (estilo red social) ───────── */

  function nombreCanal(id) {
    const c = CANALES.find(x => x.id === id);
    return c ? c.emoji + " " + c.nombre : id;
  }

  function mediaHTML(p) {
    const pop = `<span class="heart-pop">${SVG_HEART}</span>`;
    if (p.foto) {
      return `<div class="post__media" data-media>
        <img class="pimg" src="${p.foto}" data-seed="${esc(p.id)}" alt="" loading="lazy" draggable="false">${pop}</div>`;
    }
    return `<div class="post__media post__media--text chan-${esc(p.canal)}" data-media>
      <p>${esc(p.titulo)}</p>${pop}</div>`;
  }

  function textoComentarios(n) {
    if (!n) return "Sé el primero en comentar";
    return n === 1 ? "Ver 1 comentario" : "Ver los " + n + " comentarios";
  }

  function postHTML(p, detalle) {
    const n = p.comentarios.length;
    return `
      <div class="post__top">
        <div class="ring"><div class="post__av">${av(p.avatar)}</div></div>
        <div class="post__who">
          <span class="post__author">${esc(p.autor)}</span>
          <span class="post__meta">${esc(p.tiempo)}${p.externo ? " · Otro colegio" : ""}</span>
        </div>
        <span class="post__chan">${nombreCanal(p.canal)}</span>
      </div>
      ${mediaHTML(p)}
      <div class="post__bar">
        <button class="act act--like ${p.voto === 1 ? "is-liked" : ""}" data-like aria-label="Me gusta">${SVG_HEART}</button>
        ${detalle ? "" : `<button class="act" data-open aria-label="Comentarios">${SVG_COM}</button>`}
        <button class="act act--save ${p.guardado ? "is-on" : ""}" data-save aria-label="Guardar">${SVG_SAVE}</button>
      </div>
      <p class="post__likes"><b>${p.votos}</b> me gusta</p>
      <div class="post__cap">
        <h3 class="post__title">${esc(p.titulo)}</h3>
        <p class="post__text ${detalle ? "" : "post__text--clamp"}">${esc(p.texto)}</p>
      </div>
      ${detalle ? "" : `<button class="post__more" data-open>${textoComentarios(n)}</button>`}`;
  }

  function fotoFallback(img) {
    if (!img.dataset.tried) {
      img.dataset.tried = "1";
      img.src = "https://picsum.photos/seed/" + encodeURIComponent(img.dataset.seed || "refugio") + "/800/1000";
    } else {
      const m = img.parentElement;
      if (m) m.classList.add("is-broken");
      img.remove();
    }
  }

  function sincronizarLike(root, p) {
    const b = root.querySelector("[data-like]");
    b.classList.toggle("is-liked", p.voto === 1);
    root.querySelector(".post__likes b").textContent = p.votos;
  }

  function conectarPost(root, p) {
    root.querySelector("[data-like]").addEventListener("click", (ev) => {
      ev.stopPropagation();
      votar(p, 1);
      sincronizarLike(root, p);
    });
    root.querySelector("[data-save]").addEventListener("click", (ev) => {
      ev.stopPropagation();
      p.guardado = !p.guardado; guardar();
      ev.currentTarget.classList.toggle("is-on", p.guardado);
      toast(p.guardado ? "Guardado" : "Quitado de guardados");
    });
    root.querySelectorAll("[data-open]").forEach(b => {
      b.addEventListener("click", (ev) => { ev.stopPropagation(); abrirPost(p); });
    });
    const media = root.querySelector("[data-media]");
    media.addEventListener("dblclick", (ev) => {
      ev.stopPropagation();
      if (p.voto !== 1) { votar(p, 1); sincronizarLike(root, p); }
      const h = media.querySelector(".heart-pop");
      h.classList.remove("go"); void h.offsetWidth; h.classList.add("go");
    });
    media.addEventListener("click", (ev) => ev.stopPropagation());
    root.querySelectorAll("img.pimg").forEach(i => i.addEventListener("error", () => fotoFallback(i)));
  }

  function pintarFeed() {
    const cont = $("#feed");
    cont.innerHTML = "";
    const lista = S.canal === "todos" ? S.posts : S.posts.filter(p => p.canal === S.canal);

    if (!lista.length) {
      cont.innerHTML = '<p class="empty">Todavía no hay publicaciones en este canal.<br>Anímate a ser el primero.</p>';
      return;
    }

    lista.forEach(p => {
      const art = document.createElement("article");
      art.className = "post";
      art.innerHTML = postHTML(p, false);
      conectarPost(art, p);
      art.addEventListener("click", () => abrirPost(p));
      cont.appendChild(art);
    });
  }

  function votar(obj, dir) {
    if (obj.voto === dir) { obj.votos -= dir; obj.voto = 0; }
    else { obj.votos += dir - obj.voto; obj.voto = dir; }
    guardar();
  }

  /* ───────── Detalle del post ───────── */

  function abrirPost(p) {
    postActivo = p;
    ir("post");
    pintarPost();
  }

  function pintarPost() {
    const p = postActivo;
    if (!p) return;
    const cont = $("#post-detail");
    cont.innerHTML = `
      <article class="post" style="cursor:default" id="post-art">${postHTML(p, true)}</article>
      <h4 class="comments__h">${p.comentarios.length} comentario${p.comentarios.length === 1 ? "" : "s"}</h4>
      <div class="comments" id="comments"></div>`;

    conectarPost($("#post-art"), p);

    const cbox = $("#comments");
    p.comentarios.forEach(c => {
      const d = document.createElement("div");
      d.className = "comment";
      d.innerHTML = `
        <div class="comment__av">${av(c.avatar)}</div>
        <div class="comment__body">
          <div class="comment__top">
            <span class="comment__who">${esc(c.autor)}</span>
            <span class="comment__time">${esc(c.tiempo)}</span>
          </div>
          <p class="comment__txt">${esc(c.texto)}</p>
          <button class="cheart ${c.voto === 1 ? "is-liked" : ""}" data-like>${SVG_HEART}<span>${c.votos}</span></button>
        </div>`;
      d.querySelector("[data-like]").addEventListener("click", () => {
        votar(c, 1);
        pintarPost();
      });
      cbox.appendChild(d);
    });
  }

  $("#comment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = $("#comment-input");
    const txt = inp.value.trim();
    if (!txt || !postActivo) return;
    postActivo.comentarios.push({
      id: "c" + Date.now(), autor: S.alias, avatar: S.avatar,
      texto: txt, votos: 1, voto: 1, tiempo: "ahora"
    });
    inp.value = "";
    toast("Comentario publicado");
    const primera = !S.encuestaMostrada;
    if (primera) S.encuestaMostrada = true;
    guardar();
    pintarPost();
    if (primera) setTimeout(abrirEncuesta, 700);
  });

  /* ───────── Miniencuesta (al dejar el primer comentario) ───────── */

  function abrirEncuesta() {
    encuestaOp = null;
    $$(".survey__opt").forEach(b => b.classList.remove("is-on"));
    $("#survey-text").value = "";
    $("#sheet-survey").hidden = false;
  }

  $("#survey-opts").addEventListener("click", (e) => {
    const b = e.target.closest(".survey__opt");
    if (!b) return;
    $$(".survey__opt").forEach(x => x.classList.remove("is-on"));
    b.classList.add("is-on");
    encuestaOp = b.dataset.op;
  });

  function enviarEncuesta() {
    if (!encuestaOp) { toast("Elige una opción"); return; }
    S.encuesta.push({
      op: encuestaOp,
      texto: $("#survey-text").value.trim(),
      fecha: Date.now()
    });
    guardar();
    $("#sheet-survey").hidden = true;
    toast("Gracias por tu respuesta 💚");
  }

  /* ───────── Crear publicación ───────── */

  function reducirImagen(file, max, cb) {
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * k);
        c.height = Math.round(im.height * k);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/jpeg", 0.72));
      };
      im.onerror = () => cb(null);
      im.src = fr.result;
    };
    fr.onerror = () => cb(null);
    fr.readAsDataURL(file);
  }

  function limpiarFoto() {
    fotoNueva = null;
    $("#post-photo").value = "";
    $("#photo-prev").hidden = true;
    $("#photo-pick").hidden = false;
  }

  $("#post-photo").addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    reducirImagen(f, 900, (url) => {
      if (!url) { toast("No se pudo cargar esa foto"); return; }
      fotoNueva = url;
      $("#photo-prev-img").src = url;
      $("#photo-prev").hidden = false;
      $("#photo-pick").hidden = true;
    });
  });
  $("#photo-prev-x").addEventListener("click", limpiarFoto);

  function abrirCompose() {
    $("#post-as").innerHTML = av(S.avatar, "avimg avimg--xs") + " " + esc(S.alias);
    const cont = $("#post-channels");
    cont.innerHTML = "";
    CANALES.filter(c => c.id !== "todos").forEach((c, i) => {
      if (i === 0) canalNuevoPost = c.id;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chan" + (i === 0 ? " is-on" : "");
      b.innerHTML = `<span>${c.emoji}</span>${esc(c.nombre)}`;
      b.addEventListener("click", () => {
        cont.querySelectorAll(".chan").forEach(x => x.classList.remove("is-on"));
        b.classList.add("is-on");
        canalNuevoPost = c.id;
      });
      cont.appendChild(b);
    });
    limpiarFoto();
    $("#sheet-compose").hidden = false;
  }

  $("#form-post").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    S.posts.unshift({
      id: "post" + Date.now(),
      autor: S.alias, avatar: S.avatar, canal: canalNuevoPost, tiempo: "ahora",
      titulo: (fd.get("titulo") || "").trim(),
      texto: (fd.get("texto") || "").trim(),
      foto: fotoNueva || null,
      votos: 1, voto: 1, guardado: false, comentarios: []
    });
    guardar();
    e.target.reset();
    limpiarFoto();
    $("#sheet-compose").hidden = true;
    S.canal = "todos";
    pintarCanales(); pintarFeed();
    toast("Publicado de forma anónima ✨");
  });

  /* ───────── Mi espacio: semáforo personal ───────── */

  const SEM = {
    verde:    { n: "Verde",    t: "No necesito hablar con nadie" },
    amarillo: { n: "Amarillo", t: "Quizá hable con alguien" },
    rojo:     { n: "Rojo",     t: "Quiero hablar con el psicólogo" }
  };

  function psiDeCita() {
    return S.cita ? PSICOLOGOS.find(p => p.id === S.cita.psi) : null;
  }

  function pintarSemaforo() {
    const c = $("#semaforo-card");
    const opts = Object.keys(SEM).map(k => `
      <button class="sem__opt sem--${k} ${S.semaforo === k ? "is-on" : ""}" data-sem="${k}">
        <i class="sem__dot"></i>
        <span class="sem__txt"><b>${SEM[k].n}</b><small>${SEM[k].t}</small></span>
        ${SVG_CHK}
      </button>`).join("");

    let accion = "";
    if (S.semaforo === "rojo") {
      const p = psiDeCita();
      accion = p
        ? `<p class="sem__info">Tu cita: <b>${esc(p.nombre)} · ${esc(S.cita.slot)}</b></p>
           <button class="btn btn--ghost btn--full" data-action="ver-cita">Ver mi cita</button>`
        : `<button class="btn btn--primary btn--full" data-action="pedir-cita">Pedir cita</button>`;
    } else if (S.semaforo === "amarillo") {
      accion = '<p class="sem__info">Cuando quieras, puedes pasar a rojo y pedir tu cita desde aquí.</p>';
    } else if (S.semaforo === "verde") {
      accion = '<p class="sem__info">Perfecto. Esto estará aquí cuando lo necesites.</p>';
    } else {
      accion = '<p class="sem__info">Elige un color cuando quieras. Es opcional.</p>';
    }

    c.innerHTML = `
      <div class="sem__head">
        <h3 class="card__title">Mi semáforo</h3>
        <span class="sem__lock">🔒 Solo tú</span>
      </div>
      <p class="card__sub">Cámbialo cuando quieras. No depende de tu ánimo ni de tu check-in.</p>
      <div class="sem__opts">${opts}</div>
      ${accion}
      ${S.semaforo ? '<button class="link-btn" data-action="quitar-semaforo">No quiero usar el semáforo</button>' : ""}
      <p class="sem__priv">El equipo de psicología solo ve cuántos alumnos hay en amarillo o rojo. Nunca quién.</p>`;
  }

  $("#semaforo-card").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sem]");
    if (!b) return;
    S.semaforo = b.dataset.sem;
    guardar();
    pintarSemaforo();
    if (S.semaforo === "rojo") toast("Listo. Si quieres, pide tu cita desde aquí");
    else toast("Semáforo en " + SEM[S.semaforo].n.toLowerCase());
  });

  function pintarTags() {
    const cont = $("#tags");
    cont.innerHTML = "";
    INTERESES.forEach(t => {
      const b = document.createElement("button");
      const on = S.intereses.includes(t);
      b.className = "tag" + (on ? " is-on" : "");
      b.textContent = t;
      b.addEventListener("click", () => {
        const i = S.intereses.indexOf(t);
        if (i >= 0) S.intereses.splice(i, 1); else S.intereses.push(t);
        guardar(); pintarTags();
      });
      cont.appendChild(b);
    });
  }

  function pintarEntradas() {
    const cont = $("#entries");
    cont.innerHTML = "";
    if (!S.entradas.length) {
      cont.innerHTML = '<p class="empty">Aún no has escrito nada.<br>Este espacio te espera cuando quieras.</p>';
      return;
    }
    S.entradas.map((e, i) => ({ e, i })).reverse().forEach(({ e, i }) => {
      const d = document.createElement("div");
      d.className = "entry";
      const f = new Date(e.fecha).toLocaleDateString("es-PE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
      let pie;
      if (e.compartida) {
        const p = PSICOLOGOS.find(x => x.id === e.compartida);
        const quien = p ? p.nombre : "el equipo de psicología";
        pie = `<span class="entry__badge">Compartida con ${esc(quien)}</span>
               <button class="entry__share" data-share>Dejar de compartir</button>`;
      } else {
        pie = `<span class="entry__priv">🔒 Solo tú</span>
               <button class="entry__share" data-share>Compartir con el psicólogo</button>`;
      }
      d.innerHTML = `<span class="entry__date">${f}</span><p class="entry__txt">${esc(e.texto)}</p><div class="entry__foot">${pie}</div>`;
      d.querySelector("[data-share]").addEventListener("click", () => compartirEntrada(i));
      cont.appendChild(d);
    });
  }

  /* Nada se comparte automáticamente: el estudiante decide entrada por entrada */
  function compartirEntrada(i) {
    const e = S.entradas[i];
    if (!e) return;
    if (e.compartida) {
      e.compartida = null; guardar(); pintarEntradas();
      toast("Dejaste de compartirla");
      return;
    }
    const p = psiDeCita();
    const quien = p ? p.nombre : "el equipo de psicología";
    if (!confirm("¿Compartir esta entrada con " + quien + "? Solo la verá esa persona y puedes dejar de compartirla cuando quieras.")) return;
    e.compartida = p ? p.id : "equipo";
    guardar(); pintarEntradas();
    toast("Entrada compartida con " + quien);
  }

  /* ───────── Apoyo ───────── */

  function conteoEquipo() {
    const c = { amarillo: CONTEO_BASE.amarillo, rojo: CONTEO_BASE.rojo };
    if (S.semaforo === "amarillo") c.amarillo++;
    if (S.semaforo === "rojo") c.rojo++;
    return c;
  }

  function pintarApoyo() {
    const alerta = $("#alert-card");
    const cerrada = S.alertaCerrada && (Date.now() - S.alertaCerrada < 120000);
    alerta.hidden = !(animoBajo() && !cerrada);

    /* Modo "elegir horario" (al pedir cita desde el rojo) */
    $("#cita-intro").innerHTML = S.citaModo ? `
      <div class="card card--cita">
        <h3 class="card__title">Elige tu horario</h3>
        <p class="card__sub">Toca un horario disponible. Solo tú y la persona que elijas lo sabrán.</p>
        <button class="link-btn" data-action="cancelar-modo-cita">Ahora no</button>
      </div>` : "";

    const p = psiDeCita();
    $("#cita-card").innerHTML = (p && !S.citaModo) ? `
      <div class="card card--cita">
        <h3 class="card__title">Mi cita</h3>
        <p class="cita__line"><b>${esc(p.nombre)}</b> · ${esc(S.cita.slot)}</p>
        <p class="card__sub">Solo tú y ${esc(p.nombre.split(" ")[0])} lo saben. No aparece en Comunidad ni en tu perfil.</p>
        <div class="cita__btns">
          <button class="btn btn--primary btn--small" data-action="chat-cita">Escribirle</button>
          <button class="btn btn--ghost btn--small" data-action="cambiar-cita">Cambiar horario</button>
          <button class="btn btn--ghost btn--small" data-action="cancelar-cita">Cancelar</button>
        </div>
      </div>` : "";

    $("#apoyo-lead").hidden = S.citaModo;

    const cont = $("#psi-list");
    cont.innerHTML = "";
    PSICOLOGOS.forEach(ps => {
      const b = document.createElement(S.citaModo ? "div" : "button");
      b.className = "psi" + (S.citaModo ? " psi--cita" : "");
      const slots = S.citaModo
        ? `<div class="slots">${ps.citas.map(s => `<button type="button" class="slot" data-psi="${ps.id}" data-slot="${esc(s)}">${esc(s)}</button>`).join("")}</div>`
        : "";
      b.innerHTML = `
        <div class="psi__av" style="background:${ps.color}">
          ${ps.inicial}
          <span class="psi__dot dot--${ps.estado.replace(/\s/g, ".")}"></span>
        </div>
        <div class="psi__body">
          <p class="psi__name">${esc(ps.nombre)}</p>
          <p class="psi__rol">${esc(ps.rol)}</p>
          <div class="psi__status" style="color:${colorEstado(ps.estado)}">
            <i style="background:${colorEstado(ps.estado)}"></i>${etiquetaEstado(ps.estado)}
          </div>
          <p class="psi__meta">${esc(ps.horario)}<br>${esc(ps.responde)}</p>
          ${slots}
        </div>`;
      if (S.citaModo) {
        b.querySelectorAll(".slot").forEach(sl => {
          sl.addEventListener("click", () => abrirSheetCita(ps, sl.dataset.slot));
        });
      } else {
        b.addEventListener("click", () => abrirChat(ps));
      }
      cont.appendChild(b);
    });

    /* Lo que ve el equipo de psicología: solo números, nunca nombres */
    const n = conteoEquipo();
    $("#psi-view").innerHTML = `
      <div class="card card--soft">
        <h3 class="card__title">Lo que ve el equipo de psicología</h3>
        <p class="card__sub">Solo números, nunca nombres. Así organizan sus horarios.</p>
        <div class="count">
          <div class="count__box count--amarillo"><b>${n.amarillo}</b><span>alumnos en amarillo</span></div>
          <div class="count__box count--rojo"><b>${n.rojo}</b><span>alumnos en rojo</span></div>
        </div>
      </div>`;
  }

  function colorEstado(e) {
    if (e === "en linea") return "#58CC02";
    if (e === "ocupado") return "#FF9600";
    return "#999999";
  }
  function etiquetaEstado(e) {
    if (e === "en linea") return "En línea ahora";
    if (e === "ocupado") return "Ocupado · te responderá luego";
    return "Desconectado";
  }

  /* ───────── Pedir cita ───────── */

  function abrirSheetCita(ps, slot) {
    citaPend = { psi: ps.id, slot: slot };
    $("#cita-body").innerHTML = `
      <div class="cita__sum">
        <div class="psi__av" style="background:${ps.color}">${ps.inicial}</div>
        <div>
          <p class="psi__name">${esc(ps.nombre)}</p>
          <p class="psi__rol">${esc(ps.rol)}</p>
          <p class="cita__line"><b>${esc(slot)}</b></p>
        </div>
      </div>
      <p class="note note--sm">Solo tú y ${esc(ps.nombre.split(" ")[0])} sabrán de esta cita. No aparece en Comunidad ni en tu perfil.</p>
      <button class="btn btn--primary btn--full" data-action="confirmar-cita">Confirmar cita</button>
      <button class="link-btn" data-action="close-cita">Elegir otro horario</button>`;
    $("#sheet-cita").hidden = false;
  }

  function confirmarCita() {
    if (!citaPend) return;
    S.cita = citaPend;
    S.citaModo = false;
    guardar();
    $("#sheet-cita").hidden = true;
    const p = psiDeCita();
    pintarApoyo();
    toast("Cita confirmada ✨ Solo tú y " + p.nombre.split(" ")[0] + " lo saben");
    citaPend = null;
  }

  /* ───────── Chat ───────── */

  function abrirChat(p) {
    psiActivo = p;
    ir("chat");

    $("#chat-head").innerHTML = `
      <div class="chat-head__av" style="background:${p.color}">
        ${p.inicial}
        <span class="psi__dot" style="background:${colorEstado(p.estado)}"></span>
      </div>
      <div class="chat-head__info">
        <span class="chat-head__name">${esc(p.nombre)}</span>
        <span class="chat-head__st"><i style="background:${colorEstado(p.estado)}"></i>${etiquetaEstado(p.estado)}</span>
      </div>`;

    if (!S.chats[p.id]) {
      S.chats[p.id] = [{
        de: "psi",
        texto: `Hola${S.alias ? ", " + S.alias : ""}. Soy ${p.nombre.split(" ")[0]}, ${p.rol.toLowerCase()} del colegio. ${p.bio}`,
        hora: hora()
      }];
      guardar();
    }
    pintarChat();
  }

  function pintarChat() {
    const box = $("#chat-messages");
    box.innerHTML = `<p class="chat__sys">🔒 Esta conversación es privada. Nadie de tu salón puede verla. Tú decides qué le cuentas.</p>`;
    (S.chats[psiActivo.id] || []).forEach(m => {
      const d = document.createElement("div");
      d.className = "bubble bubble--" + (m.de === "psi" ? "psi" : "me");
      d.innerHTML = `${esc(m.texto)}<span class="bubble__t">${esc(m.hora)}</span>`;
      box.appendChild(d);
    });
    box.scrollTop = box.scrollHeight;
  }

  let idxResp = 0;
  $("#chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = $("#chat-input");
    const txt = inp.value.trim();
    if (!txt || !psiActivo) return;

    S.chats[psiActivo.id].push({ de: "me", texto: txt, hora: hora() });
    guardar(); inp.value = ""; pintarChat();

    const box = $("#chat-messages");
    const t = document.createElement("div");
    t.className = "typing";
    t.innerHTML = "<i></i><i></i><i></i>";
    box.appendChild(t);
    box.scrollTop = box.scrollHeight;

    setTimeout(() => {
      t.remove();
      S.chats[psiActivo.id].push({
        de: "psi",
        texto: RESPUESTAS_PSICOLOGO[idxResp % RESPUESTAS_PSICOLOGO.length],
        hora: hora()
      });
      idxResp++;
      guardar(); pintarChat();
    }, 1300);
  });

  /* ───────── Perfil ───────── */

  function copiar(txt) {
    const ok = () => toast("Copiado");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(ok).catch(() => toast("No se pudo copiar"));
    } else {
      const ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) { toast("No se pudo copiar"); }
      ta.remove();
    }
  }

  function pintarPerfil() {
    $("#profile").innerHTML = `
      <div class="profile__av">${av(S.avatar)}</div>
      <p class="profile__name">${esc(S.alias || "Anónimo")}</p>
      <p class="profile__grade">${esc(S.grado || "—")}</p>
      <div class="profile__stats">
        <div class="profile__stat"><b>${S.posts.filter(p => p.autor === S.alias).length}</b><span>publicaciones</span></div>
        <div class="profile__stat"><b>${S.entradas.length}</b><span>entradas</span></div>
        <div class="profile__stat"><b>${S.intereses.length}</b><span>intereses</span></div>
      </div>`;

    const chart = $("#mood-chart");
    chart.innerHTML = "";
    const ult = S.animos.slice(-7);
    if (!ult.length) {
      chart.innerHTML = '<p class="empty" style="width:100%">Aún no has hecho ningún check-in.</p>';
    } else {
      ult.forEach((a) => {
        const col = document.createElement("div");
        col.className = "chart__col";
        const caras = ["", "😞", "😕", "😐", "🙂", "😄"];
        col.innerHTML = `
          <div class="chart__bar" style="height:${a.v * 18}%; background:${a.v <= 2 ? "#FF4B4B" : a.v === 3 ? "#FF9600" : "#58CC02"}"></div>
          <span class="chart__lbl">${caras[a.v]}</span>`;
        chart.appendChild(col);
      });
    }

    const sr = $("#survey-results");
    if (S.encuesta.length) {
      sr.innerHTML = `
        <div class="card">
          <h3 class="card__title">Mis respuestas de la encuesta</h3>
          <p class="card__sub">Las guardamos solo en este navegador.</p>
          ${S.encuesta.map(r => `<p class="survey__row"><b>${esc(r.op)}</b>${r.texto ? " · " + esc(r.texto) : ""}</p>`).join("")}
          <button class="btn btn--ghost btn--small" data-action="copiar-encuesta">Copiar respuestas</button>
        </div>`;
    } else {
      sr.innerHTML = "";
    }
  }

  /* ═══════════════════════════════════════════════════════
     FOROS TIPO REDDIT
     ═══════════════════════════════════════════════════════ */

  function pintarForos() {
    const cont = $("#forums-list");
    cont.innerHTML = "";
    FOROS.forEach(f => {
      const b = document.createElement("button");
      b.className = "forum-card";
      b.innerHTML = `
        <div class="forum__icon" style="background:${f.color}">${f.emoji}</div>
        <div class="forum__body">
          <p class="forum__name">${esc(f.nombre)}</p>
          <p class="forum__desc">${esc(f.desc)}</p>
          <div class="forum__stats">
            <span>${f.miembros} miembros</span>
            <span class="online">● ${f.online} en línea</span>
          </div>
        </div>
        <span class="forum__arrow">›</span>`;
      b.addEventListener("click", () => {
        foroActivo = f;
        ir("foro-detail");
      });
      cont.appendChild(b);
    });
  }

  function pintarForoDetail() {
    if (!foroActivo) return;
    const f = foroActivo;
    $("#foro-detail-title").textContent = f.nombre;

    $("#foro-header").innerHTML = `
      <div class="forum-header">
        <div class="forum-header__icon" style="background:${f.color}">${f.emoji}</div>
        <div class="forum-header__body">
          <p class="forum-header__name">${esc(f.nombre)}</p>
          <p class="forum-header__desc">${esc(f.desc)}</p>
          <div class="forum-header__stats">
            <span>${f.miembros} miembros</span>
            <span class="online">● ${f.online} en línea</span>
            <span>Creado ${f.creado}</span>
          </div>
        </div>
      </div>`;

    const cont = $("#foro-posts");
    cont.innerHTML = "";
    const posts = S.forumPosts.filter(p => p.foro === f.id);

    if (!posts.length) {
      cont.innerHTML = '<p class="empty" style="padding:30px">Aún no hay publicaciones en este foro.<br>Sé el primero en postear.</p>';
      return;
    }

    posts.forEach(p => {
      const d = document.createElement("div");
      d.className = "fpost";
      d.innerHTML = `
        <div class="fpost__top">
          <span class="fpost__av">${av(p.avatar)}</span>
          <span class="fpost__who">${esc(p.autor)}</span>
          <span class="fpost__time">${esc(p.tiempo)}</span>
        </div>
        <h3 class="fpost__title">${esc(p.titulo)}</h3>
        <p class="fpost__text">${esc(p.texto)}</p>
        <div class="fpost__bar">
          <button class="fpost__vote ${p.voto === 1 ? 'up' : ''}" data-fvote="up">${SVG_UP} ${p.upvotes}</button>
          <button class="fpost__vote ${p.voto === -1 ? 'down' : ''}" data-fvote="down">${SVG_DOWN} ${p.downvotes}</button>
          <span class="fpost__comments">${SVG_COM} ${p.comentarios.length}</span>
        </div>`;

      d.querySelector('[data-fvote="up"]').addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (p.voto === 1) { p.upvotes--; p.voto = 0; }
        else { if (p.voto === -1) p.downvotes--; p.upvotes++; p.voto = 1; }
        guardar(); pintarForoDetail();
      });
      d.querySelector('[data-fvote="down"]').addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (p.voto === -1) { p.downvotes--; p.voto = 0; }
        else { if (p.voto === 1) p.upvotes--; p.downvotes++; p.voto = -1; }
        guardar(); pintarForoDetail();
      });
      d.addEventListener("click", () => {
        foroPostActivo = p;
        ir("foro-post");
      });
      cont.appendChild(d);
    });
  }

  function pintarForoPost() {
    if (!foroPostActivo) return;
    const p = foroPostActivo;

    $("#fpost-detail").innerHTML = `
      <div class="fpost-detail__top">
        <div class="fpost-detail__av">${av(p.avatar)}</div>
        <div>
          <span class="fpost-detail__who">${esc(p.autor)}</span>
          <span class="fpost-detail__time"> · ${esc(p.tiempo)}</span>
        </div>
      </div>
      <h3 class="fpost-detail__title">${esc(p.titulo)}</h3>
      <p class="fpost-detail__text">${esc(p.texto)}</p>
      <div class="fpost-detail__bar">
        <button class="fpost__vote ${p.voto === 1 ? 'up' : ''}" data-fvote="up">${SVG_UP} ${p.upvotes}</button>
        <button class="fpost__vote ${p.voto === -1 ? 'down' : ''}" data-fvote="down">${SVG_DOWN} ${p.downvotes}</button>
        <span class="fpost__comments">${SVG_COM} ${p.comentarios.length} comentarios</span>
      </div>`;

    $("#fpost-detail").querySelector('[data-fvote="up"]').addEventListener("click", () => {
      if (p.voto === 1) { p.upvotes--; p.voto = 0; }
      else { if (p.voto === -1) p.downvotes--; p.upvotes++; p.voto = 1; }
      guardar(); pintarForoPost();
    });
    $("#fpost-detail").querySelector('[data-fvote="down"]').addEventListener("click", () => {
      if (p.voto === -1) { p.downvotes--; p.voto = 0; }
      else { if (p.voto === 1) p.upvotes--; p.downvotes++; p.voto = -1; }
      guardar(); pintarForoPost();
    });

    const cbox = $("#foro-comments");
    cbox.innerHTML = `<h4 class="comments__h">${p.comentarios.length} comentario${p.comentarios.length === 1 ? "" : "s"}</h4>`;
    p.comentarios.forEach(c => {
      const d = document.createElement("div");
      d.className = "comment";
      d.innerHTML = `
        <div class="comment__av">${av(c.avatar)}</div>
        <div class="comment__body">
          <div class="comment__top">
            <span class="comment__who">${esc(c.autor)}</span>
            <span class="comment__time">${esc(c.tiempo)}</span>
          </div>
          <p class="comment__txt">${esc(c.texto)}</p>
          <button class="cheart ${c.voto === 1 ? "is-liked" : ""}" data-like>${SVG_HEART}<span>${c.upvotes}</span></button>
        </div>`;
      d.querySelector("[data-like]").addEventListener("click", () => {
        if (c.voto === 1) { c.upvotes--; c.voto = 0; }
        else { c.upvotes++; c.voto = 1; }
        guardar(); pintarForoPost();
      });
      cbox.appendChild(d);
    });
  }

  $("#foro-comment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = $("#foro-comment-input");
    const txt = inp.value.trim();
    if (!txt || !foroPostActivo) return;
    foroPostActivo.comentarios.push({
      id: "fc" + Date.now(), autor: S.alias, avatar: S.avatar,
      texto: txt, upvotes: 1, voto: 1, tiempo: "ahora"
    });
    inp.value = "";
    toast("Comentario publicado");
    guardar();
    pintarForoPost();
  });

  /* ═══════════════════════════════════════════════════════
     RESUMEN ANUAL — SPOTIFY WRAPPED STYLE
     ═══════════════════════════════════════════════════════ */

  function pintarWrappedTrigger() {
    const cont = $("#wrapped-trigger");
    cont.innerHTML = `
      <button class="wrapped-btn" data-action="open-wrapped">
        <span class="wrapped-btn__icon">✨</span>
        <div class="wrapped-btn__text">
          <p class="wrapped-btn__title">Tu Resumen ${WRAPPED_DATA.year}</p>
          <p class="wrapped-btn__sub">Descubre cómo fue tu año emocional</p>
        </div>
        <span class="wrapped-btn__arrow">›</span>
      </button>`;
  }

  const WRAPPED_SLIDES = [
    // Slide 1: Intro
    function () {
      return `
        <div class="wrapped-slide ws-bg-1">
          <div class="wrapped-nav"><div class="wrapped-nav__left" data-ws="prev"></div><div class="wrapped-nav__right" data-ws="next"></div></div>
          <span class="wrapped-slide__emoji">🏠</span>
          <h2 class="wrapped-slide__title">Tu Año en Refugio</h2>
          <p class="wrapped-slide__sub">Un resumen de tu año emocional. Solo tú puedes verlo.</p>
          <p class="wrapped-slide__stat">${WRAPPED_DATA.year}</p>
          <div class="wrapped-private">🔒 Privado — solo tú</div>
        </div>`;
    },
    // Slide 2: Emociones predominantes
    function () {
      const bars = WRAPPED_DATA.emociones.map(e => `
        <div class="wrapped-bar-row">
          <span class="wrapped-bar-emoji">${e.emoji}</span>
          <div class="wrapped-bar-track"><div class="wrapped-bar-fill" style="width:${e.pct}%;background:${e.color}"></div></div>
          <span class="wrapped-bar-pct">${e.pct}%</span>
        </div>`).join("");
      return `
        <div class="wrapped-slide ws-bg-2">
          <div class="wrapped-nav"><div class="wrapped-nav__left" data-ws="prev"></div><div class="wrapped-nav__right" data-ws="next"></div></div>
          <p class="wrapped-slide__label">Tus emociones este año</p>
          <h2 class="wrapped-slide__title">Tu emoción top fue<br>"${WRAPPED_DATA.emocionTop.nombre}" ${WRAPPED_DATA.emocionTop.emoji}</h2>
          <div class="wrapped-bars">${bars}</div>
          <p class="wrapped-slide__note">Basado en ${WRAPPED_DATA.totalCheckins} check-ins</p>
        </div>`;
    },
    // Slide 3: Veces al psicólogo
    function () {
      return `
        <div class="wrapped-slide ws-bg-3">
          <div class="wrapped-nav"><div class="wrapped-nav__left" data-ws="prev"></div><div class="wrapped-nav__right" data-ws="next"></div></div>
          <span class="wrapped-slide__emoji">🧠</span>
          <p class="wrapped-slide__label">Apoyo profesional</p>
          <p class="wrapped-slide__stat">${WRAPPED_DATA.vecesAlPsicologo}</p>
          <h2 class="wrapped-slide__title">veces acudiste a un psicólogo</h2>
          <p class="wrapped-slide__sub">Pedir ayuda fue un acto de valentía. Cada sesión cuenta. 💪</p>
        </div>`;
    },
    // Slide 4: Comentario más likeado
    function () {
      return `
        <div class="wrapped-slide ws-bg-4">
          <div class="wrapped-nav"><div class="wrapped-nav__left" data-ws="prev"></div><div class="wrapped-nav__right" data-ws="next"></div></div>
          <span class="wrapped-slide__emoji">❤️</span>
          <p class="wrapped-slide__label">Tu comentario más querido</p>
          <h2 class="wrapped-slide__title" style="font-size:1.2rem;font-weight:600">"${esc(WRAPPED_DATA.comentarioTop.texto)}"</h2>
          <p class="wrapped-slide__stat">${WRAPPED_DATA.comentarioTop.likes}</p>
          <p class="wrapped-slide__sub">personas conectaron con tus palabras</p>
          <p class="wrapped-slide__note">En: "${esc(WRAPPED_DATA.comentarioTop.post)}"</p>
        </div>`;
    },
    // Slide 5: Emoji más usado
    function () {
      return `
        <div class="wrapped-slide ws-bg-5">
          <div class="wrapped-nav"><div class="wrapped-nav__left" data-ws="prev"></div><div class="wrapped-nav__right" data-ws="next"></div></div>
          <p class="wrapped-slide__label">Tu emoji favorito</p>
          <p class="wrapped-slide__stat" style="font-size:5rem">${WRAPPED_DATA.emojiMasUsado.emoji}</p>
          <h2 class="wrapped-slide__title">Lo marcaste ${WRAPPED_DATA.emojiMasUsado.veces} veces</h2>
          <p class="wrapped-slide__sub">Tu emoción más frecuente fue "${WRAPPED_DATA.emojiMasUsado.nombre}"</p>
        </div>`;
    },
    // Slide 6: Gustos principales
    function () {
      const tags = WRAPPED_DATA.gustosTop.map(g => `<span class="wrapped-tag">${esc(g)}</span>`).join("");
      return `
        <div class="wrapped-slide ws-bg-6">
          <div class="wrapped-nav"><div class="wrapped-nav__left" data-ws="prev"></div><div class="wrapped-nav__right" data-ws="next"></div></div>
          <span class="wrapped-slide__emoji">🎯</span>
          <p class="wrapped-slide__label">Lo que te define</p>
          <h2 class="wrapped-slide__title">Tus gustos principales</h2>
          <div class="wrapped-tags">${tags}</div>
          <p class="wrapped-slide__sub">Esto es lo que elegiste este año. ¿Cambiará el próximo?</p>
        </div>`;
    },
    // Slide 7: Proceso emocional anual
    function () {
      const d = WRAPPED_DATA.procesoEmocional;
      const meses = d.meses;
      const maxV = 5;
      const w = 280, h = 120, pad = 10;
      const stepX = (w - 2 * pad) / (meses.length - 1);
      let path = "";
      meses.forEach((m, i) => {
        const x = pad + i * stepX;
        const y = h - pad - ((m.valor / maxV) * (h - 2 * pad));
        path += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
      });

      const mejora = d.mejora;
      const arrow = mejora ? "📈" : "📉";
      const pct = d.pctMejora;

      return `
        <div class="wrapped-slide ws-bg-7">
          <div class="wrapped-nav"><div class="wrapped-nav__left" data-ws="prev"></div><div class="wrapped-nav__right" data-ws="next"></div></div>
          <span class="wrapped-slide__emoji">${arrow}</span>
          <p class="wrapped-slide__label">Tu proceso emocional</p>
          <h2 class="wrapped-slide__title">${mejora ? "¡Mejoraste!" : "Fue un año duro"}</h2>
          <p class="wrapped-slide__stat" style="font-size:2.5rem">+${pct}%</p>
          <p class="wrapped-slide__sub">${mejora ? "Tu bienestar emocional subió este año. ¡Sigue así!" : "Pero cada paso cuenta. El próximo año será mejor."}</p>
          <div class="wrapped-chart">
            <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#FF4B4B"/>
                  <stop offset="100%" stop-color="#58CC02"/>
                </linearGradient>
              </defs>
              <path d="${path}" fill="none" stroke="url(#wg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="wrapped-chart__labels">
              <span>Ene</span><span>Jun</span><span>Dic</span>
            </div>
          </div>
          <div class="wrapped-private">🔒 Solo tú puedes ver esto</div>
        </div>`;
    }
  ];

  function abrirWrapped() {
    wrappedSlide = 0;
    pintarWrappedSlide();
    $("#wrapped-overlay").hidden = false;
  }

  function cerrarWrapped() {
    $("#wrapped-overlay").hidden = true;
    S.wrappedVisto = true;
    guardar();
  }

  function pintarWrappedSlide() {
    const total = WRAPPED_SLIDES.length;
    const idx = wrappedSlide;

    const progressBars = WRAPPED_SLIDES.map((_, i) => {
      const pct = i < idx ? 100 : (i === idx ? 100 : 0);
      return `<div class="wrapped-progress__bar"><div class="wrapped-progress__fill" style="width:${pct}%"></div></div>`;
    }).join("");

    const overlay = $("#wrapped-overlay");
    overlay.innerHTML = `
      <div class="wrapped-overlay">
        <div class="wrapped-progress">${progressBars}</div>
        <button class="wrapped-close" data-action="close-wrapped">
          <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        ${WRAPPED_SLIDES[idx]()}
      </div>`;

    // Navigation
    overlay.querySelectorAll('[data-ws="prev"]').forEach(el => {
      el.addEventListener("click", () => {
        if (wrappedSlide > 0) { wrappedSlide--; pintarWrappedSlide(); }
      });
    });
    overlay.querySelectorAll('[data-ws="next"]').forEach(el => {
      el.addEventListener("click", () => {
        if (wrappedSlide < total - 1) { wrappedSlide++; pintarWrappedSlide(); }
        else cerrarWrapped();
      });
    });
  }

  /* ───────── Acciones globales ───────── */

  document.body.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;

    if (a === "start")            ir(S.alias ? "checkin" : "register");
    else if (a === "go-splash")   ir("splash");
    else if (a === "skip-checkin") ir("feed");
    else if (a === "go-feed")     ir("feed");
    else if (a === "go-foros")    ir("foros");
    else if (a === "go-espacio")  ir("espacio");
    else if (a === "go-apoyo")    ir("apoyo");
    else if (a === "go-perfil")   ir("perfil");
    else if (a === "go-foro-back") {
      if (foroActivo) ir("foro-detail");
      else ir("foros");
    }
    else if (a === "open-compose") abrirCompose();
    else if (a === "close-compose") $("#sheet-compose").hidden = true;
    else if (a === "open-first-chat") abrirChat(PSICOLOGOS[0]);
    else if (a === "open-privacy") abrirPrivacidad();
    else if (a === "close-privacy") cerrarPrivacidad();
    else if (a === "close-survey") $("#sheet-survey").hidden = true;
    else if (a === "send-survey") enviarEncuesta();
    else if (a === "copiar-encuesta") {
      copiar(S.encuesta.map(r => r.op + (r.texto ? " - " + r.texto : "")).join("\n"));
    }
    else if (a === "pedir-cita") { S.citaModo = true; guardar(); ir("apoyo"); }
    else if (a === "ver-cita") { S.citaModo = false; guardar(); ir("apoyo"); }
    else if (a === "cambiar-cita") { S.citaModo = true; guardar(); pintarApoyo(); }
    else if (a === "cancelar-modo-cita") { S.citaModo = false; guardar(); pintarApoyo(); }
    else if (a === "cancelar-cita") {
      S.cita = null; S.citaModo = false; guardar(); pintarApoyo();
      toast("Cita cancelada");
    }
    else if (a === "chat-cita") { const p = psiDeCita(); if (p) abrirChat(p); }
    else if (a === "confirmar-cita") confirmarCita();
    else if (a === "close-cita") $("#sheet-cita").hidden = true;
    else if (a === "quitar-semaforo") {
      S.semaforo = null; guardar(); pintarSemaforo();
      toast("Semáforo desactivado. Puedes volver a usarlo cuando quieras");
    }
    else if (a === "save-entry") {
      const inp = $("#journal-input");
      const txt = inp.value.trim();
      if (!txt) { toast("Escribe algo primero"); return; }
      S.entradas.push({ texto: txt, fecha: Date.now(), compartida: null });
      guardar(); inp.value = ""; pintarEntradas();
      toast("Guardado en tu diario 🔒");
    }
    else if (a === "open-wrapped") { abrirWrapped(); }
    else if (a === "close-wrapped") { cerrarWrapped(); }
    else if (a === "reset") {
      if (confirm("¿Borrar todos los datos de la demo y empezar de nuevo?")) {
        localStorage.removeItem(KEY);
        S = estadoInicial();
        pintarAvatarTabs();
        pintarAvatares();
        ir("splash");
      }
    }
  });

  ["#sheet-compose", "#sheet-cita", "#sheet-survey"].forEach(id => {
    $(id).addEventListener("click", (e) => {
      if (e.target.id === id.slice(1)) $(id).hidden = true;
    });
  });

  /* ───────── Inicio ───────── */

  pintarAvatarTabs();
  pintarAvatares();
  if (S.alias) ir("checkin");
  else ir("splash");

})();
