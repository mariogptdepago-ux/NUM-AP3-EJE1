window.PVI_APP = (() => {
  const root = document.getElementById('app');
  const state = {
    session: null,
    descriptors: [],
    skills: [],
    commonErrors: [],
    questions: [],
    descriptor: null,
    currentSkill: null,
    skillStates: {},
    activeQuestion: null,
    activeStartedAt: null,
    selected: null,
    checked: false,
    sessionAttempts: [],
    reviewQueue: [],
    burnedQuestions: new Set(),
    warning: '',
    matchSelection: { left: null, right: null },
    matchPairs: {},
    simSide: 'left',
    simNear: 85
  };

  const SKILL_THEMES = {
    concepto_limite: {
      name: 'Blanco y negro',
      bg: '#f7f7f7',
      card: '#ffffff',
      primary: '#111111',
      primaryDark: '#000000',
      secondary: '#444444',
      accent: '#000000',
      accentDark: '#111111',
      text: '#111111',
      muted: '#555555',
      border: '#d7d7d7',
      graph: '#111111',
      graphSecondary: '#666666'
    },
    valor_vs_limite: {
      name: 'Escala de grises',
      bg: '#eeeeee',
      card: '#ffffff',
      primary: '#686868',
      primaryDark: '#353535',
      secondary: '#9a9a9a',
      accent: '#2f2f2f',
      accentDark: '#1f1f1f',
      text: '#202020',
      muted: '#666666',
      border: '#cccccc',
      graph: '#555555',
      graphSecondary: '#a0a0a0'
    },
    tablas: {
      name: 'Azul y blanco',
      bg: '#f2f8ff',
      card: '#ffffff',
      primary: '#1f78ff',
      primaryDark: '#0d47a1',
      secondary: '#73b3ff',
      accent: '#0057ff',
      accentDark: '#003fb8',
      text: '#102033',
      muted: '#536a83',
      border: '#cfe3ff',
      graph: '#1f78ff',
      graphSecondary: '#0d47a1'
    },
    graficas: {
      name: 'Naranja, negro y blanco',
      bg: '#fff7ef',
      card: '#ffffff',
      primary: '#f57c00',
      primaryDark: '#111111',
      secondary: '#ffb45e',
      accent: '#111111',
      accentDark: '#000000',
      text: '#1b1b1b',
      muted: '#6c5540',
      border: '#ffd7aa',
      graph: '#f57c00',
      graphSecondary: '#111111'
    },
    limite_lateral_izquierdo: {
      name: 'Verde oscuro y blanco',
      bg: '#f2fbf5',
      card: '#ffffff',
      primary: '#0c7a43',
      primaryDark: '#064f2a',
      secondary: '#7ed9a8',
      accent: '#0a5c36',
      accentDark: '#05351f',
      text: '#10251a',
      muted: '#51695c',
      border: '#c9ead8',
      graph: '#0c7a43',
      graphSecondary: '#064f2a'
    },
    limite_lateral_derecho: {
      name: 'Morado y blanco',
      bg: '#f8f3ff',
      card: '#ffffff',
      primary: '#7b2cff',
      primaryDark: '#4b148c',
      secondary: '#bb91ff',
      accent: '#5f20c7',
      accentDark: '#3e0f86',
      text: '#241334',
      muted: '#685579',
      border: '#decaff',
      graph: '#7b2cff',
      graphSecondary: '#4b148c'
    },
    limite_bilateral: {
      name: 'Rojo vino y blanco',
      bg: '#fff4f6',
      card: '#ffffff',
      primary: '#9f1239',
      primaryDark: '#65051f',
      secondary: '#f08aa5',
      accent: '#be123c',
      accentDark: '#800020',
      text: '#2a1018',
      muted: '#76545e',
      border: '#f5c2cf',
      graph: '#9f1239',
      graphSecondary: '#65051f'
    },
    huecos_saltos: {
      name: 'Turquesa y blanco',
      bg: '#f0fffc',
      card: '#ffffff',
      primary: '#00a693',
      primaryDark: '#00796b',
      secondary: '#7ae0d4',
      accent: '#008b7a',
      accentDark: '#005c50',
      text: '#0d2825',
      muted: '#4d706b',
      border: '#bfeee8',
      graph: '#00a693',
      graphSecondary: '#00796b'
    },
    expresiones_algebraicas: {
      name: 'Mostaza, negro y blanco',
      bg: '#fffaf0',
      card: '#ffffff',
      primary: '#d99a00',
      primaryDark: '#111111',
      secondary: '#ffd166',
      accent: '#111111',
      accentDark: '#000000',
      text: '#1f1a10',
      muted: '#6c6046',
      border: '#ffe3a0',
      graph: '#d99a00',
      graphSecondary: '#111111'
    },
    aplicacion: {
      name: 'Azul petróleo y blanco',
      bg: '#eef8fb',
      card: '#ffffff',
      primary: '#006d77',
      primaryDark: '#003f45',
      secondary: '#83c5be',
      accent: '#00525a',
      accentDark: '#003238',
      text: '#0d2529',
      muted: '#526c72',
      border: '#bfdee4',
      graph: '#006d77',
      graphSecondary: '#003f45'
    },
    sintesis: {
      name: 'Multicolor institucional suave',
      bg: '#f7f8ff',
      card: '#ffffff',
      primary: '#2563eb',
      primaryDark: '#7c3aed',
      secondary: '#22c55e',
      accent: '#f97316',
      accentDark: '#c2410c',
      text: '#111827',
      muted: '#64748b',
      border: '#dbe4ff',
      graph: '#2563eb',
      graphSecondary: '#f97316'
    }
  };

  function getSkillTheme(skillId = state.currentSkill?.id) {
    return SKILL_THEMES[skillId] || SKILL_THEMES.tablas;
  }

  function applySkillTheme(skillId = state.currentSkill?.id) {
    const theme = getSkillTheme(skillId);
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--bg', theme.bg);
    rootStyle.setProperty('--card', theme.card);
    rootStyle.setProperty('--primary', theme.primary);
    rootStyle.setProperty('--primary-dark', theme.primaryDark);
    rootStyle.setProperty('--secondary', theme.secondary);
    rootStyle.setProperty('--accent', theme.accent);
    rootStyle.setProperty('--accent-dark', theme.accentDark);
    rootStyle.setProperty('--ink', theme.text);
    rootStyle.setProperty('--text', theme.text);
    rootStyle.setProperty('--muted', theme.muted);
    rootStyle.setProperty('--border', theme.border);
    rootStyle.setProperty('--graph-main', theme.graph);
    rootStyle.setProperty('--graph-secondary', theme.graphSecondary);
    document.body.dataset.skillTheme = skillId || 'default';
  }

  async function loadJSON(path) {
    const res = await fetch(path);
    return await res.json();
  }

  async function init() {
    state.session = PVI_AUTH.getSession();
    if (!state.session) return renderLogin();
    await loadData();
    initSkillStates();
    renderDashboard();
  }

  async function loadData() {
    const [descriptors, skills, commonErrors, questions] = await Promise.all([
      loadJSON('data/descriptors.json'),
      loadJSON('data/skills.json'),
      loadJSON('data/common_errors.json'),
      loadJSON('data/questions_limits.json')
    ]);
    state.descriptors = descriptors;
    state.skills = skills;
    state.commonErrors = commonErrors;
    state.questions = questions;
    state.descriptor = descriptors[0];
  }

  function initSkillStates() {
    state.skills.forEach(skill => {
      state.skillStates[skill.id] = PVI_SPACING.initialSkillState(skill);
    });
  }

  function stripHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.textContent || div.innerText || '';
  }

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function renderLogin() {
    applySkillTheme('tablas');
    root.innerHTML = `
      <section class="card login-box">
        <div class="brand"><div class="logo">PVI</div><div><h1>Pablo VI Math App</h1><p>Entrenamiento adaptativo gratuito</p></div></div>
        <div class="form-stack">
          <input id="username" placeholder="Usuario" autocomplete="username" />
          <input id="password" type="password" placeholder="Contraseña" autocomplete="current-password" />
          <label><input id="keepSession" type="checkbox" style="width:auto" /> Mantener sesión abierta</label>
          <button class="btn primary" id="loginBtn">Iniciar sesión</button>
          <p id="loginMsg" class="bad"></p>
          <small>Demo: usuario <strong>demo</strong>, contraseña <strong>1234</strong>. Superusuario: <strong>admin</strong> / <strong>admin123</strong>.</small>
        </div>
      </section>
    `;
    document.getElementById('loginBtn').addEventListener('click', async () => {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const keep = document.getElementById('keepSession').checked;
      const res = await PVI_AUTH.login(username, password, keep);
      if (!res.ok) { document.getElementById('loginMsg').textContent = res.message || 'No se pudo iniciar sesión.'; return; }
      state.session = PVI_AUTH.getSession();
      await loadData(); initSkillStates(); renderDashboard();
    });
  }

  function renderTopbar() {
    const u = state.session.user;
    return `
      <header class="topbar">
        <div class="brand"><div class="logo">PVI</div><div><h1>${PVI_CONFIG.APP_NAME}</h1><p>${state.descriptor.learning}</p></div></div>
        <div>
          <span class="badge">${u.fullName} ${u.grade ? '· ' + u.grade : ''}</span>
          <button class="btn secondary" onclick="PVI_AUTH.logout()">Salir</button>
        </div>
      </header>
    `;
  }

  function renderDashboard() {
    applySkillTheme('tablas');
    PVI_SESSION_GUARD.stop();
    const cert = certificationStatus();
    const levels = state.skills.map((skill, idx) => {
      const ss = state.skillStates[skill.id];
      const pct = Math.round(ss.mastery * 100);
      const rec = Math.round(PVI_SPACING.recall(ss) * 100);
      const mastered = isSkillCertified(ss);
      const locked = idx > 0 && !isSkillCertified(state.skillStates[state.skills[idx - 1].id]) && ss.attempts === 0;
      return `
        <article class="level-card ${locked ? 'locked' : ''}">
          <span class="badge">Nivel ${idx + 1}</span>
          <h2>${skill.name}</h2>
          <p>${skill.purpose}</p>
          <div class="progress"><span style="width:${pct}%"></span></div>
          <small>Dominio: ${pct}% · Recuperabilidad: ${rec}% · Intentos: ${ss.attempts}/20</small>
          <button class="btn ${mastered ? 'secondary' : 'primary'}" ${locked ? 'disabled' : ''} onclick="PVI_APP.startSkill('${skill.id}')">${mastered ? 'Repasar' : 'Entrenar'}</button>
        </article>`;
    }).join('');
    const global = globalStats();
    root.innerHTML = `
      ${renderTopbar()}
      <section class="card">
        <span class="badge">Eje temático: ${state.descriptor.axis}</span>
        <h2>${state.descriptor.name}</h2>
        <p><strong>Descriptor:</strong> ${state.descriptor.descriptors[0]}</p>
        <div class="grid three">
          <div class="stat">Dominio global<span>${Math.round(global.mastery*100)}%</span></div>
          <div class="stat">Recuperabilidad<span>${Math.round(global.recall*100)}%</span></div>
          <div class="stat">Microhabilidades certificables<span>${cert.masteredSkills}/${state.skills.length}</span></div>
        </div>
      </section>
      <section class="grid levels" style="margin-top:18px">${levels}</section>
      <section class="card" style="margin-top:18px">
        <h2>Reportes y certificación</h2>
        ${renderCertificationStatus(cert)}
        <div class="grid three">
          <button class="btn secondary" onclick="PVI_APP.downloadReportHTML()">Descargar informe HTML</button>
          <button class="btn secondary" onclick="PVI_APP.downloadReportCSV()">Descargar CSV</button>
          <button class="btn primary" ${cert.canIssue ? '' : 'disabled'} onclick="PVI_APP.issueCertificate()">Emitir mini diploma</button>
        </div>
        <div id="certificateArea" style="margin-top:18px"></div>
      </section>
    `;
  }

  function globalStats() {
    const vals = Object.values(state.skillStates);
    return {
      mastery: vals.reduce((s,x)=>s+x.mastery,0) / vals.length,
      recall: vals.reduce((s,x)=>s+PVI_SPACING.recall(x),0) / vals.length,
      mastered: vals.filter(PVI_SPACING.isMastered).length
    };
  }


  function isSkillCertified(ss) {
    return ss.attempts >= 20 && ss.mastery >= 0.85 && PVI_SPACING.recall(ss) >= 0.75 && ss.streak >= 3;
  }

  function certificationStatus() {
    const rows = state.skills.map(skill => {
      const ss = state.skillStates[skill.id];
      const recall = PVI_SPACING.recall(ss);
      const missing = [];
      if (ss.attempts < 20) missing.push(`faltan ${20 - ss.attempts} intentos`);
      if (ss.mastery < 0.85) missing.push(`dominio ${Math.round(ss.mastery*100)}% < 85%`);
      if (recall < 0.75) missing.push(`recuperabilidad ${Math.round(recall*100)}% < 75%`);
      if (ss.streak < 3) missing.push(`racha ${ss.streak}/3`);
      return {
        skillId: skill.id,
        skill: skill.name,
        attempts: ss.attempts,
        mastery: ss.mastery,
        recall,
        streak: ss.streak,
        certified: missing.length === 0,
        missing
      };
    });
    const global = globalStats();
    const masteredSkills = rows.filter(r => r.certified).length;
    const totalAttempts = state.sessionAttempts.length;
    const wrong = state.sessionAttempts.filter(a => !a.correct).length;
    const dueReviews = rows.filter(r => r.recall < 0.75).length;
    const canIssue = rows.every(r => r.certified) && global.mastery >= 0.85 && global.recall >= 0.75 && totalAttempts > 0;
    return {
      rows,
      canIssue,
      masteredSkills,
      totalSkills: rows.length,
      global,
      totalAttempts,
      wrong,
      dueReviews,
      requirements: {
        attemptsPerSkill: 20,
        mastery: 0.85,
        recall: 0.75,
        streak: 3
      }
    };
  }

  function renderCertificationStatus(cert) {
    const pending = cert.rows.filter(r => !r.certified).slice(0, 5);
    const pendingList = pending.length
      ? `<ul>${pending.map(r => `<li><strong>${r.skill}:</strong> ${r.missing.join('; ')}</li>`).join('')}</ul>`
      : `<p class="ok">Descriptor listo para certificación.</p>`;
    return `
      <div class="cert-status ${cert.canIssue ? 'ready' : 'pending'}">
        <h3>${cert.canIssue ? 'Certificación habilitada' : 'Certificación bloqueada'}</h3>
        <p>El mini diploma solo se emite cuando todas las microhabilidades cumplen: 20 intentos, dominio ≥ 85%, recuperabilidad ≥ 75% y racha mínima de 3 aciertos.</p>
        <div class="grid three">
          <div class="stat">Microhabilidades<span>${cert.masteredSkills}/${cert.totalSkills}</span></div>
          <div class="stat">Dominio global<span>${Math.round(cert.global.mastery*100)}%</span></div>
          <div class="stat">Recuperabilidad<span>${Math.round(cert.global.recall*100)}%</span></div>
        </div>
        ${pendingList}
      </div>
    `;
  }

  function startSkill(skillId) {
    state.currentSkill = state.skills.find(s => s.id === skillId);
    applySkillTheme(skillId);
    state.reviewQueue = [];
    nextQuestion();
    PVI_SESSION_GUARD.requestFullscreen();
    PVI_SESSION_GUARD.start(handleViolation);
  }

  function getQuestionsForSkill(skillId) {
    return state.questions.filter(q => q.skillId === skillId);
  }

  function chooseQuestion() {
    if (state.reviewQueue.length) return state.reviewQueue.shift();
    const skillId = state.currentSkill.id;
    const ss = state.skillStates[skillId];
    const families = [...new Set(getQuestionsForSkill(skillId).map(q => q.familyId))];
    const neededFamily = families.find(f => !ss.history.some(h => h.familyId === f && h.correct));
    const familyId = neededFamily || families[Math.floor(Math.random() * families.length)];
    return chooseVariant(familyId, 0);
  }

  function chooseVariant(familyId, minVariant = 0) {
    const options = state.questions.filter(q => q.familyId === familyId && !state.burnedQuestions.has(q.id));
    return options.find(q => q.variantIndex >= minVariant) || options[0] || state.questions.find(q => q.familyId === familyId);
  }

  function resetInteractionState() {
    state.selected = null;
    state.checked = false;
    state.matchSelection = { left: null, right: null };
    state.matchPairs = {};
    state.simSide = state.activeQuestion?.requiredSide || 'left';
    state.simNear = 85;
  }

  function nextQuestion() {
    state.activeQuestion = chooseQuestion();
    state.activeStartedAt = Date.now();
    resetInteractionState();
    renderQuestion();
  }

  function renderQuestion() {
    const q = state.activeQuestion;
    const ss = state.skillStates[state.currentSkill.id];
    const errors = state.commonErrors.filter(e => e.skillId === state.currentSkill.id).slice(0, 4).map(e => `<li><strong>${e.name}:</strong> ${e.shortHint}</li>`).join('');
    const activity = renderActivity(q);
    root.innerHTML = `
      ${renderTopbar()}
      <div class="question-layout">
        <section class="card">
          ${state.warning ? `<div class="session-warning">${state.warning}</div>` : ''}
          <span class="badge">${state.currentSkill.name} · Pregunta ${ss.attempts + 1}/20 · ${typeLabel(q.type)}</span><span class="badge theme-badge">Paleta: ${getSkillTheme().name}</span>
          <h2 class="question-title">${q.prompt}</h2>
          ${activity}
          <div id="feedback" class="feedback"></div>
          <div style="margin-top:16px"><button id="checkBtn" class="btn primary" disabled onclick="PVI_APP.checkAnswer()">Comprobar</button></div>
        </section>
        <aside class="side-panel">
          <div class="stat">Dominio<span>${Math.round(ss.mastery*100)}%</span></div>
          <div class="stat">Recuperabilidad<span>${Math.round(PVI_SPACING.recall(ss)*100)}%</span></div>
          <div class="stat">Racha<span>${ss.streak}</span></div>
          <div class="card"><h2>Errores frecuentes</h2><ul>${errors}</ul></div>
        </aside>
      </div>
    `;
    afterRenderActivity(q);
  }

  function typeLabel(type) {
    return {
      multiple_choice:'Conceptual',
      table_choice:'Tabla',
      graph_choice:'Gráfica',
      match:'Relacionar',
      simulator:'Simulador'
    }[type] || 'Actividad';
  }

  function renderActivity(q) {
    const table = q.table ? `<div class="table-wrap"><table><thead><tr>${q.table.headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${q.table.rows.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '';
    const graph = q.graph ? `<div class="canvas-card"><canvas id="graphCanvas" width="900" height="420" aria-label="Gráfica de la pregunta"></canvas></div>` : '';
    const sim = q.type === 'simulator' ? `
      <div class="sim-controls">
        <strong>Acercamiento:</strong>
        <div class="side-toggle">
          <button type="button" id="leftSide" class="${state.simSide === 'left' ? 'active' : ''}" onclick="PVI_APP.setSimSide('left')">Izquierda</button>
          <button type="button" id="rightSide" class="${state.simSide === 'right' ? 'active' : ''}" onclick="PVI_APP.setSimSide('right')">Derecha</button>
        </div>
        <label>Qué tan cerca está x del punto:
          <input id="nearRange" type="range" min="1" max="100" value="${state.simNear}" oninput="PVI_APP.setSimNear(this.value)" class="${state.simSide === 'right' ? 'range-rtl' : ''}" />
        </label>
        <div class="readout"><div id="xRead">x≈</div><div id="yRead">f(x)≈</div></div>
      </div>` : '';
    if (q.type === 'match') return renderMatch(q);
    return `${table}${graph}${sim}${renderOptions(q)}`;
  }

  function renderOptions(q) {
    if (!q.options) return '';
    return `<div class="options">${q.options.map((op, i) => `<button class="option" data-i="${i}" onclick="PVI_APP.selectOption(${i})">${op}</button>`).join('')}</div>`;
  }

  function renderMatch(q) {
    const leftCards = q.pairs.map((p, i) => ({ id:`L${i}`, html:p.left }));
    const rightCards = shuffle(q.pairs.map((p, i) => ({ id:`R${i}`, html:p.right })));
    return `
      <div class="match-area">
        <div class="match-col"><h3>Elemento</h3>${leftCards.map(c=>`<button class="pair-card" data-side="left" data-id="${c.id}" onclick="PVI_APP.selectPair('${c.id}','left')">${c.html}</button>`).join('')}</div>
        <div class="match-col"><h3>Significado</h3>${rightCards.map(c=>`<button class="pair-card" data-side="right" data-id="${c.id}" onclick="PVI_APP.selectPair('${c.id}','right')">${c.html}</button>`).join('')}</div>
      </div>
      <p class="hint-line">Selecciona una tarjeta de la izquierda y luego su pareja de la derecha.</p>`;
  }

  function afterRenderActivity(q) {
    if (q.graph) drawGraph(q);
  }

  function selectOption(i) {
    if (state.checked) return;
    state.selected = i;
    document.querySelectorAll('.option').forEach(btn => btn.classList.toggle('selected', Number(btn.dataset.i) === i));
    document.getElementById('checkBtn').disabled = false;
  }

  function selectPair(id, side) {
    if (state.checked) return;
    const el = document.querySelector(`.pair-card[data-id="${id}"]`);
    if (!el || el.classList.contains('paired')) return;
    state.matchSelection[side] = id;
    document.querySelectorAll(`.pair-card[data-side="${side}"]`).forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    if (state.matchSelection.left && state.matchSelection.right) {
      state.matchPairs[state.matchSelection.left] = state.matchSelection.right;
      const leftEl = document.querySelector(`.pair-card[data-id="${state.matchSelection.left}"]`);
      const rightEl = document.querySelector(`.pair-card[data-id="${state.matchSelection.right}"]`);
      leftEl.classList.add('paired'); rightEl.classList.add('paired');
      leftEl.classList.remove('selected'); rightEl.classList.remove('selected');
      state.matchSelection = { left:null, right:null };
      document.getElementById('checkBtn').disabled = Object.keys(state.matchPairs).length !== state.activeQuestion.pairs.length;
    }
  }

  function setSimSide(side) {
    state.simSide = side;
    document.querySelectorAll('.side-toggle button').forEach(btn => btn.classList.remove('active'));
    const id = side === 'left' ? 'leftSide' : 'rightSide';
    const btn = document.getElementById(id);
    if (btn) btn.classList.add('active');
    const range = document.getElementById('nearRange');
    if (range) range.classList.toggle('range-rtl', side === 'right');
    drawGraph(state.activeQuestion);
  }

  function setSimNear(value) {
    state.simNear = Number(value);
    drawGraph(state.activeQuestion);
  }

  function graphY(g, x) {
    if (g.kind === 'linear') return g.m * x + g.b;
    if (g.kind === 'jump') return x < g.a ? g.leftValue + 0.18*(x-g.a) : g.rightValue + 0.18*(x-g.a);
    if (g.kind === 'constantHole') return g.value;
    if (g.kind === 'absRatio') {
      if (Math.abs(x - g.a) < 1e-8) return NaN;
      return Math.abs(x - g.a) / (x - g.a);
    }
    return NaN;
  }

  function drawGraph(q) {
    const canvas = document.getElementById('graphCanvas');
    if (!canvas || !q.graph) return;
    const ctx = canvas.getContext('2d');
    const g = q.graph;
    const theme = getSkillTheme(q.skillId);
    const graphMain = theme.graph;
    const graphSecondary = theme.graphSecondary;
    const gridColor = theme.border;
    const textColor = theme.text;
    const W = canvas.width, H = canvas.height, pad = 48;
    const sx = x => pad + ((x - g.xMin) / (g.xMax - g.xMin)) * (W - 2*pad);
    const sy = y => H - pad - ((y - g.yMin) / (g.yMax - g.yMin)) * (H - 2*pad);
    ctx.clearRect(0,0,W,H);

    ctx.lineWidth = 1; ctx.strokeStyle = gridColor; ctx.fillStyle = theme.muted; ctx.font = '13px system-ui';
    for (let x=Math.ceil(g.xMin); x<=Math.floor(g.xMax); x++) {
      ctx.beginPath(); ctx.moveTo(sx(x), pad); ctx.lineTo(sx(x), H-pad); ctx.stroke();
      if (x !== 0) ctx.fillText(String(x), sx(x)-4, Math.min(H-pad+18, Math.max(pad+14, sy(0)+18)));
    }
    for (let y=Math.ceil(g.yMin); y<=Math.floor(g.yMax); y++) {
      ctx.beginPath(); ctx.moveTo(pad, sy(y)); ctx.lineTo(W-pad, sy(y)); ctx.stroke();
      if (y !== 0) ctx.fillText(String(y), Math.min(W-pad-18, Math.max(6, sx(0)-24)), sy(y)+4);
    }
    ctx.strokeStyle = textColor; ctx.lineWidth = 2;
    if (g.yMin < 0 && g.yMax > 0) { ctx.beginPath(); ctx.moveTo(sx(g.xMin), sy(0)); ctx.lineTo(sx(g.xMax), sy(0)); ctx.stroke(); }
    if (g.xMin < 0 && g.xMax > 0) { ctx.beginPath(); ctx.moveTo(sx(0), sy(g.yMin)); ctx.lineTo(sx(0), sy(g.yMax)); ctx.stroke(); }

    ctx.strokeStyle = graphMain; ctx.lineWidth = 4;
    let drawing = false;
    const n = 900;
    for (let i=0; i<=n; i++) {
      const x = g.xMin + (i/n)*(g.xMax-g.xMin);
      const y = graphY(g,x);
      if (!Number.isFinite(y) || y < g.yMin-2 || y > g.yMax+2 || Math.abs(x-g.a)<0.006) { drawing=false; continue; }
      if (!drawing) { ctx.beginPath(); ctx.moveTo(sx(x), sy(y)); drawing=true; }
      else ctx.lineTo(sx(x), sy(y));
      ctx.stroke();
    }

    ctx.setLineDash([7,7]); ctx.strokeStyle = graphSecondary; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sx(g.a), pad); ctx.lineTo(sx(g.a), H-pad); ctx.stroke(); ctx.setLineDash([]);

    (g.holes || []).forEach(h => {
      ctx.beginPath(); ctx.fillStyle='white'; ctx.strokeStyle=textColor; ctx.lineWidth=3;
      ctx.arc(sx(h.x), sy(h.y), 8, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    });
    (g.filled || []).forEach(p => {
      ctx.beginPath(); ctx.fillStyle=textColor; ctx.strokeStyle=textColor; ctx.lineWidth=3;
      ctx.arc(sx(p.x), sy(p.y), 8, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    });

    if (q.type === 'simulator') {
      const closeness = state.simNear / 100;
      const epsilon = Math.pow(1.04 - closeness, 3) * 2.4 + 0.008;
      const xProbe = state.simSide === 'left' ? g.a - epsilon : g.a + epsilon;
      const yProbe = graphY(g, xProbe);
      if (Number.isFinite(yProbe)) {
        ctx.beginPath(); ctx.fillStyle=theme.secondary; ctx.strokeStyle=theme.primaryDark; ctx.lineWidth=3;
        ctx.arc(sx(xProbe), sy(yProbe), 9, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      const xr = document.getElementById('xRead'), yr = document.getElementById('yRead');
      if (xr) xr.innerHTML = `x ≈ <strong>${formatNumber(xProbe)}</strong>`;
      if (yr) yr.innerHTML = `f(x) ≈ <strong>${formatNumber(yProbe)}</strong>`;
    }

    ctx.fillStyle = textColor; ctx.font = 'bold 16px system-ui'; ctx.fillText(g.label || 'Gráfica', pad, 26);
    ctx.fillStyle = graphSecondary; ctx.fillText(`x → ${g.a}`, sx(g.a)+8, pad+18);
  }

  function formatNumber(v) {
    if (!Number.isFinite(v)) return 'no definido';
    if (Math.abs(v) > 9999) return v.toExponential(2);
    return (Math.round(v * 10000) / 10000).toString();
  }

  async function checkAnswer() {
    const q = state.activeQuestion;
    let ok = false;
    if (q.type === 'match') {
      ok = q.pairs.every((_, i) => state.matchPairs[`L${i}`] === `R${i}`);
      document.querySelectorAll('.pair-card').forEach(el => {
        const id = el.dataset.id;
        if (id.startsWith('L')) {
          const expected = 'R' + id.slice(1);
          const actual = state.matchPairs[id];
          if (actual !== expected) {
            el.classList.add('wrongpair');
            const r = document.querySelector(`.pair-card[data-id="${actual}"]`);
            if (r) r.classList.add('wrongpair');
          }
        }
        el.disabled = true;
      });
    } else {
      ok = state.selected === q.answer;
      document.querySelectorAll('.option').forEach(btn => {
        const i = Number(btn.dataset.i);
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('correct');
        if (i === state.selected && i !== q.answer) btn.classList.add('wrong');
      });
    }
    await finalizeQuestion(ok, false, 'answered');
  }

  function selectedText(q) {
    if (q.type === 'match') return Object.entries(state.matchPairs).map(([l,r]) => `${l}->${r}`).join(', ');
    return state.selected === null ? '' : q.options[state.selected];
  }

  function expectedText(q) {
    if (q.type === 'match') return 'Todas las parejas correctas';
    return q.options[q.answer];
  }

  async function finalizeQuestion(ok, lost, reason) {
    if (state.checked) return;
    state.checked = true;
    const q = state.activeQuestion;
    const ss = state.skillStates[state.currentSkill.id];
    const responseMs = Date.now() - state.activeStartedAt;
    const { recallBefore } = PVI_SPACING.updateSkill(ss, q, ok && !lost, responseMs);
    const attempt = {
      attemptId: `${state.session.user.userId}_${Date.now()}`,
      userId: state.session.user.userId,
      descriptorId: state.descriptor.id,
      skillId: q.skillId,
      questionId: q.id,
      familyId: q.familyId,
      variantIndex: q.variantIndex,
      questionType: q.type,
      correct: ok && !lost,
      lost,
      burned: lost,
      reason,
      responseMs,
      selected: selectedText(q),
      expected: expectedText(q),
      prompt: stripHTML(q.prompt),
      masteryAfter: ss.mastery,
      recallBefore,
      timestamp: new Date().toISOString()
    };
    state.sessionAttempts.push(attempt);
    await PVI_API.saveAttempt(attempt);
    await PVI_API.saveProgress({ userId: state.session.user.userId, descriptorId: state.descriptor.id, skillId: q.skillId, ...ss });

    const fb = document.getElementById('feedback');
    if (!fb) return;
    if (ok && !lost) {
      fb.className = 'feedback show ok';
      fb.innerHTML = `Correcto. ${q.feedbackCorrect}`;
    } else {
      const twin = chooseVariant(q.familyId, q.variantIndex + 1);
      if (twin && twin.id !== q.id) state.reviewQueue.push(twin);
      fb.className = 'feedback show no';
      fb.innerHTML = `${lost ? 'Pregunta perdida por salida de sesión.' : 'Casi.'} <strong>Nota corta:</strong> ${q.feedbackWrong}<br>Se programó una pregunta gemela para refuerzo.`;
    }
    const btn = document.getElementById('checkBtn');
    btn.textContent = PVI_SPACING.isMastered(ss) || ss.attempts >= 20 ? 'Finalizar nivel' : 'Continuar';
    btn.disabled = false;
    btn.onclick = () => {
      if (PVI_SPACING.isMastered(ss) || ss.attempts >= 20) { PVI_SESSION_GUARD.stop(); renderDashboard(); }
      else nextQuestion();
    };
  }

  async function handleViolation(type, detail) {
    if (!state.activeQuestion || state.checked) return;
    state.warning = detail;
    const q = state.activeQuestion;
    state.burnedQuestions.add(q.id);
    const replacement = chooseVariant(q.familyId, q.variantIndex + 1);
    await PVI_API.saveEvent({ eventId:`evt_${Date.now()}`, userId:state.session.user.userId, descriptorId:state.descriptor.id, questionId:q.id, eventType:type, detail, timestamp:new Date().toISOString() });
    await PVI_API.burnQuestion({ userId:state.session.user.userId, questionId:q.id, familyId:q.familyId, reason:type, replacementQuestionId: replacement?.id || '', timestamp:new Date().toISOString() });
    await finalizeQuestion(false, true, type);
  }

  function reportData() {
    const certification = certificationStatus();
    const skillRows = state.skills.map(skill => {
      const ss = state.skillStates[skill.id];
      return {
        skillId:skill.id,
        skill:skill.name,
        correct:ss.correct,
        wrong:ss.wrong,
        attempts:ss.attempts,
        streak:ss.streak,
        mastery:ss.mastery,
        recall:PVI_SPACING.recall(ss),
        halfLifeHours:ss.halfLifeHours,
        lastPracticeAt:ss.lastPracticeAt,
        nextReviewAt:ss.nextReviewAt,
        avgSeconds:ss.attempts ? ss.totalMs / ss.attempts / 1000 : 0,
        certified:isSkillCertified(ss),
        history:ss.history || []
      };
    });
    const attempts = state.sessionAttempts.map((a, i) => ({...a, order:i+1}));
    const byDifficulty = {};
    const byType = {};
    attempts.forEach(a => {
      const q = state.questions.find(x => x.id === a.questionId);
      const diff = q ? `Nivel ${q.difficulty}` : 'Sin dato';
      if (!byDifficulty[diff]) byDifficulty[diff] = { label: diff, attempts:0, correct:0, wrong:0, totalMs:0 };
      byDifficulty[diff].attempts += 1;
      byDifficulty[diff].correct += a.correct ? 1 : 0;
      byDifficulty[diff].wrong += a.correct ? 0 : 1;
      byDifficulty[diff].totalMs += a.responseMs || 0;

      const type = a.questionType || 'sin_tipo';
      if (!byType[type]) byType[type] = { label: type, attempts:0, correct:0, wrong:0, totalMs:0 };
      byType[type].attempts += 1;
      byType[type].correct += a.correct ? 1 : 0;
      byType[type].wrong += a.correct ? 0 : 1;
      byType[type].totalMs += a.responseMs || 0;
    });
    const normalizeGroups = groups => Object.values(groups).map(g => ({
      ...g,
      accuracy: g.attempts ? g.correct / g.attempts : 0,
      avgSeconds: g.attempts ? g.totalMs / g.attempts / 1000 : 0
    }));
    return {
      appVersion:'PVI adaptive limits app - spaced repetition edition',
      user:state.session.user,
      descriptor:state.descriptor,
      generatedAt:new Date().toLocaleString('es-CO'),
      generatedAtISO:new Date().toISOString(),
      visualTheme: state.currentSkill ? getSkillTheme(state.currentSkill.id).name : 'General',
      model:{
        mastery:'PFA simplificado: dominio = sigmoid(beta + gamma*aciertos + rho*errores)',
        forgetting:'HLR simplificado: recuperabilidad R(t)=2^(-elapsedHours/halfLifeHours)',
        repetition:'Cola adaptativa: errores y preguntas perdidas generan preguntas gemelas; el repaso se prioriza por dominio, recuperabilidad y errores recientes.',
        certification:'Diploma habilitado solo con 20 intentos por microhabilidad, dominio >= 85%, recuperabilidad >= 75% y racha >= 3.'
      },
      skills:skillRows,
      attempts,
      byDifficulty:normalizeGroups(byDifficulty),
      byType:normalizeGroups(byType),
      global:globalStats(),
      certification
    };
  }

  function downloadText(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function downloadReportCSV() {
    const data = reportData();
    const rows = [[
      'intento','fecha_iso','usuario_id','nombre_estudiante','grado','descriptor_id',
      'microhabilidad_id','pregunta_id','tipo_pregunta','familia','variante','dificultad',
      'correcta','perdida','motivo','tiempo_segundos','respuesta_estudiante','respuesta_esperada',
      'enunciado','dominio_despues','recuperabilidad_antes','vida_media_horas_despues',
      'dominio_global','recuperabilidad_global','certificacion_habilitada'
    ]];
    data.attempts.forEach((a,i)=>{
      const q = state.questions.find(x => x.id === a.questionId) || {};
      const ss = state.skillStates[a.skillId] || {};
      rows.push([
        i+1,
        a.timestamp,
        a.userId,
        data.user.fullName,
        data.user.grade || '',
        data.descriptor.id,
        a.skillId,
        a.questionId,
        a.questionType || q.type || '',
        a.familyId,
        a.variantIndex,
        q.difficulty || '',
        a.correct?'si':'no',
        a.lost?'si':'no',
        a.reason || '',
        ((a.responseMs || 0)/1000).toFixed(2),
        a.selected || '',
        a.expected || '',
        a.prompt || stripHTML(q.prompt || ''),
        Number(a.masteryAfter || 0).toFixed(4),
        Number(a.recallBefore || 0).toFixed(4),
        Number(ss.halfLifeHours || 0).toFixed(4),
        Number(data.global.mastery || 0).toFixed(4),
        Number(data.global.recall || 0).toFixed(4),
        data.certification.canIssue?'si':'no'
      ]);
    });
    const csv = rows.map(r=>r.map(c=>`"${String(c??'').replaceAll('"','""')}"`).join(';')).join('\n');
    downloadText('metadata_microhabilidades_limites.csv', csv, 'text/csv;charset=utf-8');
  }

  function downloadReportHTML() {
    const data = reportData();
    const safeData = JSON.stringify(data).replaceAll('<','\\u003c');
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Informe adaptativo de microhabilidades</title>
<style>
:root{--bg:#f4f8fb;--card:#fff;--ink:#17202a;--muted:#607080;--primary:#26a7ff;--primary-dark:#0878c9;--accent:#58cc02;--danger:#ff4b4b;--border:#d9e7f2}
*{box-sizing:border-box}
body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--bg);color:var(--ink)}
main{max-width:1200px;margin:0 auto;padding:30px 18px 48px}
section,header{background:var(--card);border:2px solid var(--border);border-radius:24px;padding:24px;margin-bottom:18px;box-shadow:0 12px 30px rgba(18,59,94,.08)}
h1{margin:0 0 8px;color:var(--primary-dark);font-size:2rem}
h2{margin:0 0 16px;color:var(--primary-dark)}
p{color:var(--muted);line-height:1.5}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.card{border:2px solid var(--border);border-radius:18px;padding:16px;background:#fbfdff;font-weight:850}
.card span{display:block;color:var(--primary-dark);font-size:1.5rem;margin-top:5px}
.charts{display:grid;grid-template-columns:1fr 1fr;gap:18px}
canvas{width:100%;height:330px;border:2px solid var(--border);border-radius:18px;background:white}
table{width:100%;border-collapse:collapse;font-size:.9rem}
th,td{border-bottom:1px solid var(--border);padding:9px;text-align:left;vertical-align:top}
th{background:#f6fbff;color:var(--primary-dark)}
.ok{color:#267000;font-weight:900}.bad{color:#9a1e1e;font-weight:900}
.note{background:#f6fbff;border:2px solid var(--border);border-radius:18px;padding:14px}
@media(max-width:900px){.grid,.charts{grid-template-columns:1fr}}
</style>
</head>
<body>
<main>
<header>
<h1>Informe adaptativo de microhabilidades</h1>
<p><strong>Estudiante:</strong> ${data.user.fullName} ${data.user.grade ? '· '+data.user.grade : ''}<br>
<strong>Fecha:</strong> ${data.generatedAt}<br>
<strong>Eje:</strong> ${data.descriptor.axis}<br>
<strong>Descriptor:</strong> ${data.descriptor.descriptors.join('; ')}</p>
</header>

<section>
<h2>Resumen y estado de certificación</h2>
<div class="grid">
<div class="card">Dominio global<span>${Math.round(data.global.mastery*100)}%</span></div>
<div class="card">Recuperabilidad<span>${Math.round(data.global.recall*100)}%</span></div>
<div class="card">Microhabilidades certificables<span>${data.certification.masteredSkills}/${data.certification.totalSkills}</span></div>
<div class="card">Diploma<span>${data.certification.canIssue?'Habilitado':'Bloqueado'}</span></div>
<div class="card">Intentos registrados<span>${data.attempts.length}</span></div>
<div class="card">Fallas<span>${data.attempts.filter(a=>!a.correct).length}</span></div>
<div class="card">Preguntas perdidas<span>${data.attempts.filter(a=>a.lost).length}</span></div>
<div class="card">Modelos<span>PFA + HLR</span></div>
</div>
<p class="note"><strong>Criterio de diploma:</strong> 20 intentos por microhabilidad, dominio ≥ 85%, recuperabilidad ≥ 75% y racha mínima de 3 aciertos. El dominio se estima con PFA simplificado y la recuperabilidad con una curva de olvido tipo HLR.</p>
</section>

<section>
<h2>Gráficos de progreso</h2>
<div class="charts">
<canvas id="masteryChart" width="900" height="420"></canvas>
<canvas id="recallChart" width="900" height="420"></canvas>
<canvas id="errorsChart" width="900" height="420"></canvas>
<canvas id="timeChart" width="900" height="420"></canvas>
<canvas id="difficultyChart" width="900" height="420"></canvas>
<canvas id="typeChart" width="900" height="420"></canvas>
<canvas id="progressChart" width="900" height="420"></canvas>
<canvas id="forgettingChart" width="900" height="420"></canvas>
</div>
</section>

<section>
<h2>Dominio por microhabilidad</h2>
<table>
<thead><tr><th>Microhabilidad</th><th>Intentos</th><th>Aciertos</th><th>Fallas</th><th>Racha</th><th>Dominio</th><th>Recuperabilidad</th><th>Vida media</th><th>Tiempo prom.</th><th>Certificable</th></tr></thead>
<tbody>
${data.skills.map(s=>`<tr><td>${s.skill}</td><td>${s.attempts}</td><td>${s.correct}</td><td>${s.wrong}</td><td>${s.streak}</td><td>${Math.round(s.mastery*100)}%</td><td>${Math.round(s.recall*100)}%</td><td>${formatHalfLife(s.halfLifeHours)}</td><td>${s.avgSeconds.toFixed(1)} s</td><td class="${s.certified?'ok':'bad'}">${s.certified?'Sí':'No'}</td></tr>`).join('')}
</tbody>
</table>
</section>

<section>
<h2>Intentos y metadatos</h2>
<table>
<thead><tr><th>#</th><th>Fecha</th><th>Microhabilidad</th><th>Pregunta</th><th>Tipo</th><th>Resultado</th><th>Perdida</th><th>Tiempo</th><th>Respuesta</th><th>Esperada</th></tr></thead>
<tbody>
${data.attempts.map((a,i)=>`<tr><td>${i+1}</td><td>${a.timestamp||''}</td><td>${a.skillId}</td><td>${a.questionId}</td><td>${a.questionType||''}</td><td class="${a.correct?'ok':'bad'}">${a.correct?'Correcta':'Falló'}</td><td>${a.lost?'Sí':'No'}</td><td>${((a.responseMs||0)/1000).toFixed(1)} s</td><td>${a.selected||''}</td><td>${a.expected||''}</td></tr>`).join('')}
</tbody>
</table>
</section>
</main>

<script>
const reportData = ${safeData};

function shortLabel(label){ return String(label||'').replace('Estimación mediante ','').replace('Límite ','Lím. ').slice(0,18); }
function drawBar(canvasId, labels, values, title, suffix='%'){
  const canvas=document.getElementById(canvasId), ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,pad=58;
  ctx.clearRect(0,0,W,H); ctx.fillStyle=textColor; ctx.font='bold 22px system-ui'; ctx.fillText(title,pad,32);
  const max=Math.max(1,...values); const slot=(W-2*pad)/Math.max(1,labels.length); const bw=slot*.64;
  labels.forEach((lab,i)=>{
    const x=pad+i*slot+slot*.18; const h=(H-120)*(values[i]/max); const y=H-pad-h;
    ctx.fillStyle=i%2?'#0878c9':'#26a7ff'; ctx.fillRect(x,y,bw,h);
    ctx.fillStyle=textColor; ctx.font='bold 13px system-ui'; ctx.fillText(String(Math.round(values[i]))+suffix,x,y-7);
    ctx.save(); ctx.translate(x+bw/2,H-18); ctx.rotate(-Math.PI/5); ctx.font='11px system-ui'; ctx.fillText(shortLabel(lab),0,0); ctx.restore();
  });
}
function drawLine(canvasId, values, title, suffix='%'){
  const canvas=document.getElementById(canvasId), ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,pad=58;
  ctx.clearRect(0,0,W,H); ctx.fillStyle=textColor; ctx.font='bold 22px system-ui'; ctx.fillText(title,pad,32);
  ctx.strokeStyle='#d9e7f2'; ctx.lineWidth=1;
  for(let i=0;i<=5;i++){ const y=H-pad-i*(H-2*pad)/5; ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(W-pad,y); ctx.stroke(); ctx.fillStyle='#607080'; ctx.font='12px system-ui'; ctx.fillText(String(i*20)+suffix,10,y+4); }
  ctx.strokeStyle='#0878ff'; ctx.lineWidth=3; ctx.beginPath();
  values.forEach((v,i)=>{ const x=pad+(values.length===1?0:i*(W-2*pad)/(values.length-1)); const y=H-pad-(Math.max(0,Math.min(100,v))/100)*(H-2*pad); if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();
}
function drawMultiLine(canvasId, series, title){
  const canvas=document.getElementById(canvasId), ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,pad=58;
  const colors=['#26a7ff','#0878c9','#58cc02','#ff4b4b','#ffc800','#7a5cff','#00b8a9','#ff8a00','#444','#9c27b0','#795548'];
  ctx.clearRect(0,0,W,H); ctx.fillStyle=textColor; ctx.font='bold 22px system-ui'; ctx.fillText(title,pad,32);
  ctx.strokeStyle='#d9e7f2'; ctx.lineWidth=1;
  for(let i=0;i<=5;i++){ const y=H-pad-i*(H-2*pad)/5; ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(W-pad,y); ctx.stroke(); ctx.fillStyle='#607080'; ctx.font='12px system-ui'; ctx.fillText(String(i*20)+'%',10,y+4); }
  series.forEach((s,idx)=>{
    if(!s.values.length)return; ctx.strokeStyle=colors[idx%colors.length]; ctx.lineWidth=2.5; ctx.beginPath();
    s.values.forEach((v,i)=>{ const x=pad+(s.values.length===1?0:i*(W-2*pad)/(s.values.length-1)); const y=H-pad-(Math.max(0,Math.min(100,v))/100)*(H-2*pad); if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); });
    ctx.stroke(); ctx.fillStyle=colors[idx%colors.length]; ctx.font='11px system-ui'; ctx.fillText(shortLabel(s.label),W-pad-170,60+idx*16);
  });
}
const skills=reportData.skills;
drawBar('masteryChart',skills.map(s=>s.skill),skills.map(s=>s.mastery*100),'Dominio por microhabilidad');
drawBar('recallChart',skills.map(s=>s.skill),skills.map(s=>s.recall*100),'Recuperabilidad actual');
drawBar('errorsChart',skills.map(s=>s.skill),skills.map(s=>s.wrong),'Fallas por microhabilidad','');
drawBar('timeChart',skills.map(s=>s.skill),skills.map(s=>s.avgSeconds),'Tiempo promedio','s');
drawBar('difficultyChart',reportData.byDifficulty.map(d=>d.label),reportData.byDifficulty.map(d=>d.accuracy*100),'Precisión por dificultad');
drawBar('typeChart',reportData.byType.map(d=>d.label),reportData.byType.map(d=>d.accuracy*100),'Precisión por tipo de pregunta');
let ok=0; const progress=reportData.attempts.map((a,i)=>{if(a.correct)ok++; return ok/(i+1)*100;});
drawLine('progressChart',progress,'Precisión acumulada');
const forget=skills.filter(s=>s.attempts>0).map(s=>({label:s.skill,values:Array.from({length:8},(_,d)=>Math.pow(2,-(d*24)/Math.max(.03,s.halfLifeHours))*100)}));
drawMultiLine('forgettingChart',forget,'Curvas de olvido estimadas');
</script>
</body></html>`;
    downloadText('informe_adaptativo_microhabilidades.html', html, 'text/html;charset=utf-8');
  }

  function formatHalfLife(hours) {
    if (!Number.isFinite(hours)) return '0 min';
    if (hours < 1) return `${Math.max(1, Math.round(hours*60))} min`;
    if (hours < 24) return `${hours.toFixed(1)} h`;
    return `${(hours/24).toFixed(1)} días`;
  }

  async function issueCertificate() {
    const certStatus = certificationStatus();
    const area = document.getElementById('certificateArea');
    if (!certStatus.canIssue) {
      const pending = certStatus.rows.filter(r => !r.certified)
        .map(r => `<li><strong>${r.skill}:</strong> ${r.missing.join('; ')}</li>`).join('');
      if (area) {
        area.innerHTML = `<div class="cert-status pending"><h3>No se puede emitir todavía</h3><p>El descriptor aún no ha sido completado con evidencia suficiente de dominio y recuperación espaciada.</p><ul>${pending}</ul></div>`;
      }
      return;
    }
    const global = globalStats();
    const payload = {
      studentId: state.session.user.userId,
      studentName: state.session.user.fullName,
      grade: state.session.user.grade,
      axisId: state.descriptor.id,
      axisName: state.descriptor.axis,
      descriptors: state.descriptor.descriptors,
      mastery: global.mastery,
      retrievability: global.recall,
      issuedBy: state.session.user.userId,
      evidence: {
        model: 'PFA + HLR',
        skills: certStatus.rows,
        attempts: state.sessionAttempts.length,
        generatedAt: new Date().toISOString()
      }
    };
    const res = await PVI_API.issueCertificate(payload);
    if (!area) return;
    if (!res.ok) { area.innerHTML = `<p class="bad">${res.message || 'No se pudo emitir.'}</p>`; return; }
    area.innerHTML = `<div class="no-print"><button class="btn secondary" onclick="window.print()">Imprimir / Guardar PDF</button></div>${PVI_CERT.renderCertificate(res.certificate)}`;
  }

  return { init, startSkill, selectOption, selectPair, setSimSide, setSimNear, checkAnswer, downloadReportCSV, downloadReportHTML, issueCertificate };
})();

PVI_APP.init();
