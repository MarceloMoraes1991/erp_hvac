/* ===================================================
   HVAC PRO — app.js
   =================================================== */

'use strict';

// ---- State ---- //
let DB = {
  materiais: [
    { id: 1, nome: 'Filtro G4 250x250', categoria: 'Filtros', qtd: 48, min: 20, unidade: 'un', obs: '' },
    { id: 2, nome: 'Cabo cobre 6mm', categoria: 'Elétrico', qtd: 85, min: 30, unidade: 'm', obs: '' },
    { id: 3, nome: 'Mangueira dreno 3/4', categoria: 'Hidráulico', qtd: 12, min: 20, unidade: 'm', obs: '' },
    { id: 4, nome: 'Gás R-410A', categoria: 'Refrigerante', qtd: 0, min: 5, unidade: 'kg', obs: 'Reposição urgente' },
    { id: 5, nome: 'Suporte fixação L', categoria: 'Fixação', qtd: 34, min: 10, unidade: 'un', obs: '' },
    { id: 6, nome: 'Gás R-22', categoria: 'Refrigerante', qtd: 3, min: 5, unidade: 'kg', obs: '' },
    { id: 7, nome: 'Parafuso 3/8 x 50mm', categoria: 'Fixação', qtd: 200, min: 50, unidade: 'un', obs: '' },
    { id: 8, nome: 'Fita autofusão', categoria: 'Outros', qtd: 15, min: 10, unidade: 'rolo', obs: '' },
  ],
  maquinas: [
    { id: 1, marca: 'Midea', modelo: 'Split Inverter 9k', btus: 9000, serie: 'SN-MID-001', patrimonio: 'PAT-001', status: 'Estoque', alocado: '', obs: '' },
    { id: 2, marca: 'Daikin', modelo: 'Split Inverter 12k', btus: 12000, serie: 'SN-DAI-002', patrimonio: 'PAT-002', status: 'Alocado', alocado: 'Carlos Mendes', obs: '' },
    { id: 3, marca: 'LG', modelo: 'Split Inverter 18k', btus: 18000, serie: 'SN-LG-003', patrimonio: 'PAT-003', status: 'Estoque', alocado: '', obs: '' },
    { id: 4, marca: 'Samsung', modelo: 'Cassete 24k', btus: 24000, serie: 'SN-SAM-004', patrimonio: 'PAT-004', status: 'Manutenção', alocado: '', obs: 'Compressor com defeito' },
    { id: 5, marca: 'Carrier', modelo: 'Split Piso-Teto 30k', btus: 30000, serie: 'SN-CAR-005', patrimonio: 'PAT-005', status: 'Alocado', alocado: 'João Silva', obs: '' },
    { id: 6, marca: 'Hitachi', modelo: 'Multi-Split 2x9k', btus: 18000, serie: 'SN-HIT-006', patrimonio: 'PAT-006', status: 'Estoque', alocado: '', obs: '' },
  ],
  ferramentas: [
    { id: 1, nome: 'Manifold digital', total: 4, disp: 3, tecnico: 1, manut: 0, patrimonio: 'FER-001' },
    { id: 2, nome: 'Bomba de vácuo', total: 3, disp: 2, tecnico: 1, manut: 0, patrimonio: 'FER-002' },
    { id: 3, nome: 'Balança de gás', total: 2, disp: 1, tecnico: 1, manut: 0, patrimonio: 'FER-003' },
    { id: 4, nome: 'Multímetro digital', total: 6, disp: 4, tecnico: 1, manut: 1, patrimonio: 'FER-004' },
    { id: 5, nome: 'Serra mármore', total: 2, disp: 1, tecnico: 0, manut: 1, patrimonio: 'FER-005' },
    { id: 6, nome: 'Furadeira de impacto', total: 5, disp: 3, tecnico: 2, manut: 0, patrimonio: 'FER-006' },
  ],
  tecnicos: [
    { id: 1, nome: 'Carlos Mendes', especialidade: 'Instalação residencial', tel: '(11) 98765-0001', email: 'carlos@hvacpro.com', status: 'Ativo' },
    { id: 2, nome: 'João Silva', especialidade: 'Manutenção industrial', tel: '(11) 98765-0002', email: 'joao@hvacpro.com', status: 'Ativo' },
    { id: 3, nome: 'Roberto Alves', especialidade: 'Refrigeração comercial', tel: '(11) 98765-0003', email: 'roberto@hvacpro.com', status: 'Ativo' },
    { id: 4, nome: 'Maria Paula', especialidade: 'Elétrica / Inverter', tel: '(11) 98765-0004', email: 'maria@hvacpro.com', status: 'Férias' },
  ],
  clientes: [
    {
      id: 1, nome: 'Residencial Silva', tipo: 'Residencial', doc: '123.456.789-00',
      tel: '(11) 91234-5678', email: 'silva@email.com',
      end: 'Rua das Flores, 120 — São Paulo, SP',
      equipamentos: [{ modelo: 'Split 12k Daikin', serie: 'SN-DAI-002', data: '2025-03-15' }]
    },
    {
      id: 2, nome: 'Comercial Plaza LTDA', tipo: 'Comercial', doc: '12.345.678/0001-99',
      tel: '(11) 3456-7890', email: 'contato@plaza.com',
      end: 'Av. Principal, 450 — São Paulo, SP',
      equipamentos: [{ modelo: 'Cassete 24k Samsung', serie: 'SN-SAM-004', data: '2024-11-10' }, { modelo: 'Split 18k LG', serie: 'SN-LG-003', data: '2024-11-10' }]
    },
  ],
  alocacoes: [
    { id: 1, responsavel: 'Carlos Mendes', item: 'Split 12k Daikin', tipo: 'Máquina', serie: 'SN-DAI-002', saida: '2026-04-09', retorno: '2026-04-09', motivo: 'Instalação Rua das Flores' },
    { id: 2, responsavel: 'Carlos Mendes', item: 'Manifold digital', tipo: 'Ferramenta', serie: 'FER-001', saida: '2026-04-09', retorno: '2026-04-09', motivo: 'Instalação' },
    { id: 3, responsavel: 'João Silva', item: 'Split Piso-Teto 30k Carrier', tipo: 'Máquina', serie: 'SN-CAR-005', saida: '2026-04-08', retorno: '2026-04-10', motivo: 'Manutenção Av. Principal' },
  ],
  movimentacoes: [
    { tipo: 'in', desc: 'Filtro G4 — Compra NF 4521', qty: '+50', time: 'Hoje 09:14' },
    { tipo: 'out', desc: 'Split 12k Daikin — Carlos Mendes', qty: '-1', time: 'Hoje 08:30' },
    { tipo: 'out', desc: 'Cabo cobre 6mm — Instalação', qty: '-15m', time: 'Ontem 16:45' },
    { tipo: 'in', desc: 'Split 9k Midea — Retorno João', qty: '+1', time: 'Ontem 14:00' },
    { tipo: 'out', desc: 'Mangueira dreno — Roberto', qty: '-3m', time: 'Ontem 11:20' },
    { tipo: 'in', desc: 'Parafuso 3/8 — Compra NF 4518', qty: '+100', time: 'Seg 13:00' },
    { tipo: 'out', desc: 'Gás R-22 — Carlos Mendes', qty: '-2kg', time: 'Seg 09:10' },
  ],
  agenda: [
    { hora: '08:00', titulo: 'Instalação Split 12k — Rua das Flores, 120', tecnico: 'Carlos Mendes', duracao: '3h', tags: ['Split 12k Daikin', 'Suporte x2', 'Dreno 2m'], alerta: false },
    { hora: '13:30', titulo: 'Manutenção preventiva — Av. Principal, 450', tecnico: 'João Silva', duracao: '2h', tags: ['Filtros G4 x2', 'Gás R-410A'], alerta: true },
    { hora: '09:00', titulo: 'Instalação Cassete 24k — Centro Comercial Plaza', tecnico: 'Roberto Alves', duracao: '5h', tags: ['Cassete 24k Samsung', 'Suporte teto'], alerta: false, amanha: true },
  ],
  nextId: { materiais: 9, maquinas: 7, ferramentas: 7, tecnicos: 5, clientes: 3, alocacoes: 4 }
};

let currentTheme = localStorage.getItem('hvac-theme') || 'system';
let activePage = 'dashboard';

// ---- Theme ---- //
function applyTheme(theme) {
  let applied = theme;
  if (theme === 'system') {
    applied = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-applied-theme', applied);
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
  localStorage.setItem('hvac-theme', theme);
  currentTheme = theme;
}

function setTheme(t) { applyTheme(t); }

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (currentTheme === 'system') applyTheme('system');
});

// ---- Navigation ---- //
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  const link = document.querySelector(`[data-page="${page}"]`);
  if (link) link.classList.add('active');
  const names = {
    dashboard: 'Dashboard', agenda: 'Agenda / Instalações',
    materiais: 'Materiais', maquinas: 'Equipamentos',
    ferramentas: 'Ferramentas', tecnicos: 'Técnicos',
    clientes: 'Clientes', alocacoes: 'Alocações'
  };
  document.getElementById('breadcrumb').textContent = names[page] || page;
  activePage = page;
  renderPage(page);
  // Mobile: close sidebar
  if (window.innerWidth <= 680) {
    document.getElementById('sidebar').classList.remove('mobile-open');
  }
}

function renderPage(page) {
  if (page === 'dashboard') renderDashboard();
  else if (page === 'agenda') renderAgenda();
  else if (page === 'materiais') { renderTable('materiais'); updateCount('materiais'); }
  else if (page === 'maquinas') { renderTable('maquinas'); updateCount('maquinas'); }
  else if (page === 'ferramentas') { renderTable('ferramentas'); updateCount('ferramentas'); }
  else if (page === 'tecnicos') { renderTable('tecnicos'); updateCount('tecnicos'); }
  else if (page === 'clientes') { renderTable('clientes'); updateCount('clientes'); }
  else if (page === 'alocacoes') { renderTable('alocacoes'); updateCount('alocacoes'); }
}

function toggleSidebar() {
  const s = document.getElementById('sidebar');
  if (window.innerWidth <= 680) {
    s.classList.toggle('mobile-open');
  } else {
    s.classList.toggle('collapsed');
  }
}

// ---- Dashboard ---- //
function renderDashboard() {
  // Date
  document.getElementById('todayDate').textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  // KPIs
  const low = DB.materiais.filter(m => m.qtd > 0 && m.qtd < m.min).length;
  const out = DB.materiais.filter(m => m.qtd === 0).length;
  const estoqueDisp = DB.maquinas.filter(m => m.status === 'Estoque').length;
  const alocadas = DB.maquinas.filter(m => m.status === 'Alocado').length;

  document.getElementById('dashKpis').innerHTML = `
    <div class="kpi-card">
      <div class="kpi-label">Materiais em estoque</div>
      <div class="kpi-value">${DB.materiais.reduce((s,m)=>s+m.qtd,0)}</div>
      <div class="kpi-sub">${DB.materiais.length} itens cadastrados</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Equipamentos disponíveis</div>
      <div class="kpi-value" style="color:var(--accent)">${estoqueDisp}</div>
      <div class="kpi-sub">${alocadas} alocados · ${DB.maquinas.filter(m=>m.status==='Manutenção').length} em manutenção</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Alertas de estoque</div>
      <div class="kpi-value" style="color:${out>0?'var(--danger)':'var(--warning)'}">${low + out}</div>
      <div class="kpi-sub">${out} sem estoque · ${low} estoque baixo</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Técnicos ativos</div>
      <div class="kpi-value">${DB.tecnicos.filter(t=>t.status==='Ativo').length}</div>
      <div class="kpi-sub">${DB.alocacoes.length} alocações em aberto</div>
    </div>
  `;

  // Alert dot
  const alertDot = document.getElementById('alertDot');
  if (low + out > 0) alertDot.classList.add('visible');
  else alertDot.classList.remove('visible');

  // Movimentação
  document.getElementById('dashMovim').innerHTML = DB.movimentacoes.map(m => `
    <div class="movim-item">
      <div class="movim-dot ${m.tipo}">${m.tipo==='in'?'↑':'↓'}</div>
      <div class="movim-desc">${m.desc}</div>
      <div class="movim-qty ${m.tipo==='in'?'pos':'neg'}">${m.qty}</div>
      <div class="movim-time">${m.time}</div>
    </div>
  `).join('');

  // Agenda
  const todayEvents = DB.agenda.filter(e => !e.amanha);
  document.getElementById('dashAgenda').innerHTML = todayEvents.length
    ? todayEvents.map(renderEventHTML).join('')
    : '<p style="padding:20px;color:var(--text-muted);font-size:13px;text-align:center">Sem instalações hoje.</p>';

  // Alerts
  const alerts = DB.materiais.filter(m => m.qtd < m.min);
  document.getElementById('dashAlerts').innerHTML = alerts.length
    ? alerts.map(m => `
      <div class="alert-item">
        <span class="badge ${m.qtd===0?'badge-out':'badge-low'}">${m.qtd===0?'Sem estoque':'Baixo'}</span>
        <span class="alert-name">${m.nome}</span>
        <span class="alert-info">Atual: <strong>${m.qtd} ${m.unidade}</strong> · Mínimo: ${m.min} ${m.unidade}</span>
        <button class="btn btn-sm btn-outline" onclick="showPage('materiais')">Ver estoque</button>
      </div>
    `).join('')
    : '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px">Todos os itens estão dentro do estoque mínimo.</div>';
}

function renderEventHTML(e) {
  return `
    <div class="agenda-event">
      <div class="agenda-time">${e.hora}</div>
      <div class="agenda-body">
        <div class="agenda-title">${e.titulo}</div>
        <div class="agenda-meta">${e.tecnico} · ${e.duracao}</div>
        <div class="agenda-tags">
          ${e.tags.map(t=>`<span class="badge ${e.alerta && t.includes('R-410A')?'badge-out':'badge-gray'}">${t}${e.alerta && t.includes('R-410A')?' ⚠':''}
          </span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

// ---- Agenda ---- //
function renderAgenda() {
  const today = DB.agenda.filter(e => !e.amanha);
  const amanha = DB.agenda.filter(e => e.amanha);
  let html = '';
  if (today.length) {
    html += `<div class="card" style="margin-bottom:14px">
      <div class="card-head"><span class="card-title">Hoje — ${new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long'})}</span></div>
      ${today.map(renderEventHTML).join('')}
    </div>`;
  }
  if (amanha.length) {
    const tm = new Date(); tm.setDate(tm.getDate()+1);
    html += `<div class="card">
      <div class="card-head"><span class="card-title">Amanhã — ${tm.toLocaleDateString('pt-BR',{day:'2-digit',month:'long'})}</span></div>
      ${amanha.map(renderEventHTML).join('')}
    </div>`;
  }
  document.getElementById('agendaList').innerHTML = html || '<p style="color:var(--text-muted);font-size:13px">Sem eventos agendados.</p>';
}

// ---- Tables ---- //
function getFilterValues(entity) {
  const bar = document.querySelector(`#page-${entity} .filter-bar`);
  if (!bar) return { q: '', s1: '', s2: '' };
  const inputs = bar.querySelectorAll('.filter-input');
  const selects = bar.querySelectorAll('.filter-select');
  return { q: inputs[0]?.value.toLowerCase()||'', s1: selects[0]?.value||'', s2: selects[1]?.value||'' };
}

function updateCount(entity) {
  const el = document.getElementById(entity+'Count');
  if (!el) return;
  el.textContent = `${DB[entity].length} registro${DB[entity].length!==1?'s':''}`;
}

function matStatus(m) {
  if (m.qtd === 0) return '<span class="badge badge-out">Sem estoque</span>';
  if (m.qtd < m.min) return '<span class="badge badge-low">Estoque baixo</span>';
  return '<span class="badge badge-ok">OK</span>';
}
function maqStatus(s) {
  if (s === 'Estoque') return '<span class="badge badge-ok">Estoque</span>';
  if (s === 'Alocado') return '<span class="badge badge-blue">Alocado</span>';
  return '<span class="badge badge-maint">Manutenção</span>';
}
function tecStatus(s) {
  if (s === 'Ativo') return '<span class="badge badge-ok">Ativo</span>';
  if (s === 'Férias') return '<span class="badge badge-low">Férias</span>';
  return '<span class="badge badge-gray">Inativo</span>';
}
function initials(name) {
  return name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
}
function actionBtns(entity, id) {
  return `<div class="row-actions">
    <button class="btn-icon" onclick="editItem('${entity}',${id})" title="Editar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="btn-icon danger" onclick="confirmDelete('${entity}',${id})" title="Excluir">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>`;
}

function renderTable(entity) {
  const tbody = document.getElementById('tbody-' + entity);
  const empty = document.getElementById('empty-' + entity);
  if (!tbody) return;
  const { q, s1, s2 } = getFilterValues(entity);

  let rows = '';
  let count = 0;

  if (entity === 'materiais') {
    let data = DB.materiais.filter(m => {
      const st = m.qtd===0?'out':(m.qtd<m.min?'low':'ok');
      return (!q || m.nome.toLowerCase().includes(q) || m.categoria.toLowerCase().includes(q))
        && (!s1 || m.categoria === s1)
        && (!s2 || st === s2);
    });
    count = data.length;
    rows = data.map(m => `<tr>
      <td>${m.nome}</td><td>${m.categoria}</td>
      <td><strong>${m.qtd}</strong></td><td>${m.min}</td>
      <td>${m.unidade}</td><td>${matStatus(m)}</td>
      <td>${actionBtns('materiais', m.id)}</td>
    </tr>`).join('');
  }

  else if (entity === 'maquinas') {
    let data = DB.maquinas.filter(m => {
      return (!q || m.modelo.toLowerCase().includes(q) || m.marca.toLowerCase().includes(q) || m.serie.toLowerCase().includes(q) || m.patrimonio.toLowerCase().includes(q))
        && (!s1 || m.status === s1);
    });
    count = data.length;
    rows = data.map(m => `<tr>
      <td>${m.modelo}</td><td>${m.marca}</td>
      <td class="mono">${m.btus.toLocaleString('pt-BR')} BTU</td>
      <td class="mono">${m.serie}</td><td class="mono">${m.patrimonio}</td>
      <td>${maqStatus(m.status)}</td>
      <td>${m.alocado || '<span style="color:var(--text-subtle)">—</span>'}</td>
      <td>${actionBtns('maquinas', m.id)}</td>
    </tr>`).join('');
  }

  else if (entity === 'ferramentas') {
    let data = DB.ferramentas.filter(f => !q || f.nome.toLowerCase().includes(q));
    count = data.length;
    rows = data.map(f => `<tr>
      <td>${f.nome}</td>
      <td><strong>${f.total}</strong></td>
      <td><strong style="color:var(--success)">${f.disp}</strong></td>
      <td>${f.tecnico}</td><td>${f.manut}</td>
      <td class="mono">${f.patrimonio}</td>
      <td>${actionBtns('ferramentas', f.id)}</td>
    </tr>`).join('');
  }

  else if (entity === 'tecnicos') {
    let data = DB.tecnicos.filter(t => {
      return (!q || t.nome.toLowerCase().includes(q) || t.especialidade.toLowerCase().includes(q))
        && (!s1 || t.status === s1);
    });
    count = data.length;
    rows = data.map(t => {
      const alocs = DB.alocacoes.filter(a => a.responsavel === t.nome).length;
      return `<tr>
        <td><div class="tech-cell"><div class="tech-avatar">${initials(t.nome)}</div>${t.nome}</div></td>
        <td>${t.especialidade}</td><td>${t.tel}</td><td>${t.email}</td>
        <td>${alocs > 0 ? `<span class="badge badge-blue">${alocs} ativa${alocs>1?'s':''}</span>` : '<span style="color:var(--text-subtle)">—</span>'}</td>
        <td>${tecStatus(t.status)}</td>
        <td>${actionBtns('tecnicos', t.id)}</td>
      </tr>`;
    }).join('');
  }

  else if (entity === 'clientes') {
    let data = DB.clientes.filter(c => {
      return (!q || c.nome.toLowerCase().includes(q) || c.doc.toLowerCase().includes(q) || c.end.toLowerCase().includes(q))
        && (!s1 || c.tipo === s1);
    });
    count = data.length;
    rows = data.map(c => `<tr>
      <td><strong>${c.nome}</strong></td>
      <td>${c.tipo}</td>
      <td class="mono">${c.doc}</td>
      <td>${c.tel}</td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.end}</td>
      <td>${c.equipamentos.length > 0
        ? `<span class="badge badge-blue">${c.equipamentos.length} equip.</span>`
        : '<span style="color:var(--text-subtle)">—</span>'
      }</td>
      <td>${actionBtns('clientes', c.id)}</td>
    </tr>`).join('');
  }

  else if (entity === 'alocacoes') {
    let data = DB.alocacoes.filter(a => {
      return (!q || a.responsavel.toLowerCase().includes(q) || a.item.toLowerCase().includes(q) || a.motivo.toLowerCase().includes(q))
        && (!s1 || a.tipo === s1);
    });
    count = data.length;
    rows = data.map(a => `<tr>
      <td>${a.responsavel}</td>
      <td>${a.item}</td>
      <td><span class="badge ${a.tipo==='Máquina'?'badge-blue':'badge-gray'}">${a.tipo}</span></td>
      <td class="mono">${a.serie}</td>
      <td>${formatDate(a.saida)}</td>
      <td>${a.retorno ? formatDate(a.retorno) : '<span style="color:var(--text-subtle)">—</span>'}</td>
      <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.motivo}</td>
      <td>${actionBtns('alocacoes', a.id)}</td>
    </tr>`).join('');
  }

  tbody.innerHTML = rows;
  empty.style.display = count === 0 ? 'block' : 'none';
  updateCount(entity);
}

function formatDate(d) {
  if (!d) return '—';
  const [y,m,day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// ---- Modals ---- //
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
function overlayClose(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

// ---- CRUD: Materiais ---- //
function saveMaterial() {
  const id = document.getElementById('mat-id').value;
  const nome = document.getElementById('mat-nome').value.trim();
  const categoria = document.getElementById('mat-categoria').value;
  const unidade = document.getElementById('mat-unidade').value;
  const qtd = parseInt(document.getElementById('mat-qtd').value) || 0;
  const min = parseInt(document.getElementById('mat-min').value) || 0;
  const obs = document.getElementById('mat-obs').value.trim();

  if (!nome || !categoria || !unidade) return toast('Preencha os campos obrigatórios.', 'error');

  if (id) {
    const idx = DB.materiais.findIndex(m => m.id == id);
    DB.materiais[idx] = { ...DB.materiais[idx], nome, categoria, unidade, qtd, min, obs };
    toast('Material atualizado com sucesso!', 'success');
  } else {
    DB.materiais.push({ id: DB.nextId.materiais++, nome, categoria, unidade, qtd, min, obs });
    toast('Material cadastrado com sucesso!', 'success');
  }
  closeModal('modal-material');
  renderTable('materiais');
  updateCount('materiais');
}

function editItem(entity, id) {
  const item = DB[entity].find(i => i.id == id);
  if (!item) return;

  if (entity === 'materiais') {
    document.getElementById('modal-material-title').textContent = 'Editar Material';
    document.getElementById('mat-id').value = id;
    document.getElementById('mat-nome').value = item.nome;
    document.getElementById('mat-categoria').value = item.categoria;
    document.getElementById('mat-unidade').value = item.unidade;
    document.getElementById('mat-qtd').value = item.qtd;
    document.getElementById('mat-min').value = item.min;
    document.getElementById('mat-obs').value = item.obs || '';
    openModal('modal-material');
  }
  else if (entity === 'maquinas') {
    document.getElementById('modal-maquina-title').textContent = 'Editar Equipamento';
    document.getElementById('maq-id').value = id;
    document.getElementById('maq-marca').value = item.marca;
    document.getElementById('maq-modelo').value = item.modelo;
    document.getElementById('maq-btus').value = item.btus;
    document.getElementById('maq-status').value = item.status;
    document.getElementById('maq-serie').value = item.serie;
    document.getElementById('maq-patrimonio').value = item.patrimonio;
    document.getElementById('maq-alocado').value = item.alocado || '';
    document.getElementById('maq-obs').value = item.obs || '';
    openModal('modal-maquina');
  }
  else if (entity === 'ferramentas') {
    document.getElementById('modal-ferramenta-title').textContent = 'Editar Ferramenta';
    document.getElementById('fer-id').value = id;
    document.getElementById('fer-nome').value = item.nome;
    document.getElementById('fer-total').value = item.total;
    document.getElementById('fer-disp').value = item.disp;
    document.getElementById('fer-tecnico').value = item.tecnico;
    document.getElementById('fer-manut').value = item.manut;
    document.getElementById('fer-patrimonio').value = item.patrimonio || '';
    openModal('modal-ferramenta');
  }
  else if (entity === 'tecnicos') {
    document.getElementById('modal-tecnico-title').textContent = 'Editar Técnico';
    document.getElementById('tec-id').value = id;
    document.getElementById('tec-nome').value = item.nome;
    document.getElementById('tec-tel').value = item.tel;
    document.getElementById('tec-email').value = item.email;
    document.getElementById('tec-esp').value = item.especialidade;
    document.getElementById('tec-status').value = item.status;
    openModal('modal-tecnico');
  }
  else if (entity === 'clientes') {
    document.getElementById('modal-cliente-title').textContent = 'Editar Cliente';
    document.getElementById('cli-id').value = id;
    document.getElementById('cli-nome').value = item.nome;
    document.getElementById('cli-tipo').value = item.tipo;
    document.getElementById('cli-doc').value = item.doc;
    document.getElementById('cli-tel').value = item.tel;
    document.getElementById('cli-email').value = item.email;
    document.getElementById('cli-end').value = item.end;
    renderClienteEquips(item.equipamentos || []);
    openModal('modal-cliente');
  }
  else if (entity === 'alocacoes') {
    document.getElementById('modal-alocacao-title').textContent = 'Editar Alocação';
    document.getElementById('aloc-id').value = id;
    document.getElementById('aloc-responsavel').value = item.responsavel;
    document.getElementById('aloc-tipo').value = item.tipo;
    document.getElementById('aloc-item').value = item.item;
    document.getElementById('aloc-serie').value = item.serie;
    document.getElementById('aloc-saida').value = item.saida;
    document.getElementById('aloc-retorno').value = item.retorno || '';
    document.getElementById('aloc-motivo').value = item.motivo;
    openModal('modal-alocacao');
  }
}

function resetModal(modalId, titleId, defaultTitle) {
  document.getElementById(titleId).textContent = defaultTitle;
  // reset all inputs inside modal
  document.querySelectorAll(`#${modalId} input:not([type=hidden])`).forEach(i => i.value = '');
  document.querySelectorAll(`#${modalId} [type=hidden]`).forEach(i => i.value = '');
}

// When open modal for NEW item, reset form
function openModalNew(modalId) {
  const titleMap = {
    'modal-material': ['modal-material-title', 'Novo Material'],
    'modal-maquina': ['modal-maquina-title', 'Novo Equipamento'],
    'modal-ferramenta': ['modal-ferramenta-title', 'Nova Ferramenta'],
    'modal-tecnico': ['modal-tecnico-title', 'Novo Técnico'],
    'modal-cliente': ['modal-cliente-title', 'Novo Cliente'],
    'modal-alocacao': ['modal-alocacao-title', 'Nova Alocação'],
  };
  if (titleMap[modalId]) {
    const [tid, title] = titleMap[modalId];
    document.getElementById(tid).textContent = title;
  }
  document.querySelectorAll(`#${modalId} input`).forEach(i => i.value = '');
  if (modalId === 'modal-cliente') renderClienteEquips([]);
  openModal(modalId);
}

// Override openModal to reset on new
const _origOpenModal = window.openModal;
document.querySelectorAll('[onclick*="openModal"]').forEach(btn => {
  const m = btn.getAttribute('onclick').match(/openModal\('(.+?)'\)/);
  if (m) {
    btn.setAttribute('onclick', `openModalNew('${m[1]}')`);
  }
});

// ---- CRUD: Máquinas ---- //
function saveMaquina() {
  const id = document.getElementById('maq-id').value;
  const marca = document.getElementById('maq-marca').value.trim();
  const modelo = document.getElementById('maq-modelo').value.trim();
  const btus = parseInt(document.getElementById('maq-btus').value) || 0;
  const status = document.getElementById('maq-status').value;
  const serie = document.getElementById('maq-serie').value.trim();
  const patrimonio = document.getElementById('maq-patrimonio').value.trim();
  const alocado = document.getElementById('maq-alocado').value.trim();
  const obs = document.getElementById('maq-obs').value.trim();

  if (!marca || !modelo || !serie) return toast('Preencha os campos obrigatórios.', 'error');

  if (id) {
    const idx = DB.maquinas.findIndex(m => m.id == id);
    DB.maquinas[idx] = { ...DB.maquinas[idx], marca, modelo, btus, status, serie, patrimonio, alocado, obs };
    toast('Equipamento atualizado!', 'success');
  } else {
    DB.maquinas.push({ id: DB.nextId.maquinas++, marca, modelo, btus, status, serie, patrimonio, alocado, obs });
    toast('Equipamento cadastrado!', 'success');
  }
  closeModal('modal-maquina');
  renderTable('maquinas');
}

// ---- CRUD: Ferramentas ---- //
function saveFerramenta() {
  const id = document.getElementById('fer-id').value;
  const nome = document.getElementById('fer-nome').value.trim();
  const total = parseInt(document.getElementById('fer-total').value) || 0;
  const disp = parseInt(document.getElementById('fer-disp').value) || 0;
  const tecnico = parseInt(document.getElementById('fer-tecnico').value) || 0;
  const manut = parseInt(document.getElementById('fer-manut').value) || 0;
  const patrimonio = document.getElementById('fer-patrimonio').value.trim();

  if (!nome || !total) return toast('Preencha os campos obrigatórios.', 'error');

  if (id) {
    const idx = DB.ferramentas.findIndex(f => f.id == id);
    DB.ferramentas[idx] = { ...DB.ferramentas[idx], nome, total, disp, tecnico, manut, patrimonio };
    toast('Ferramenta atualizada!', 'success');
  } else {
    DB.ferramentas.push({ id: DB.nextId.ferramentas++, nome, total, disp, tecnico, manut, patrimonio });
    toast('Ferramenta cadastrada!', 'success');
  }
  closeModal('modal-ferramenta');
  renderTable('ferramentas');
}

// ---- CRUD: Técnicos ---- //
function saveTecnico() {
  const id = document.getElementById('tec-id').value;
  const nome = document.getElementById('tec-nome').value.trim();
  const tel = document.getElementById('tec-tel').value.trim();
  const email = document.getElementById('tec-email').value.trim();
  const especialidade = document.getElementById('tec-esp').value;
  const status = document.getElementById('tec-status').value;

  if (!nome || !tel) return toast('Preencha os campos obrigatórios.', 'error');

  if (id) {
    const idx = DB.tecnicos.findIndex(t => t.id == id);
    DB.tecnicos[idx] = { ...DB.tecnicos[idx], nome, tel, email, especialidade, status };
    toast('Técnico atualizado!', 'success');
  } else {
    DB.tecnicos.push({ id: DB.nextId.tecnicos++, nome, tel, email, especialidade, status });
    toast('Técnico cadastrado!', 'success');
  }
  closeModal('modal-tecnico');
  renderTable('tecnicos');
}

// ---- CRUD: Clientes ---- //
let clienteEquips = [];

function renderClienteEquips(equips) {
  clienteEquips = equips.map(e => ({ ...e }));
  renderEquipList();
}

function renderEquipList() {
  const container = document.getElementById('cli-equip-list');
  container.innerHTML = clienteEquips.map((e, i) => `
    <div class="cli-equip-row">
      <input type="text" value="${e.modelo || ''}" placeholder="Modelo / Marca" onchange="clienteEquips[${i}].modelo=this.value">
      <input type="text" value="${e.serie || ''}" placeholder="Nº de série" onchange="clienteEquips[${i}].serie=this.value" style="max-width:160px">
      <input type="date" value="${e.data || ''}" onchange="clienteEquips[${i}].data=this.value" style="max-width:140px">
      <button class="btn-icon danger" onclick="removeClienteEquip(${i})">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
  `).join('');
}

function addClienteEquip() {
  clienteEquips.push({ modelo: '', serie: '', data: '' });
  renderEquipList();
}
function removeClienteEquip(i) {
  clienteEquips.splice(i, 1);
  renderEquipList();
}

function saveCliente() {
  const id = document.getElementById('cli-id').value;
  const nome = document.getElementById('cli-nome').value.trim();
  const tipo = document.getElementById('cli-tipo').value;
  const doc = document.getElementById('cli-doc').value.trim();
  const tel = document.getElementById('cli-tel').value.trim();
  const email = document.getElementById('cli-email').value.trim();
  const end = document.getElementById('cli-end').value.trim();
  // Collect equips from DOM
  const rows = document.querySelectorAll('#cli-equip-list .cli-equip-row');
  const equipamentos = Array.from(rows).map(row => {
    const inputs = row.querySelectorAll('input');
    return { modelo: inputs[0].value, serie: inputs[1].value, data: inputs[2].value };
  }).filter(e => e.modelo);

  if (!nome || !tel || !end) return toast('Preencha os campos obrigatórios.', 'error');

  if (id) {
    const idx = DB.clientes.findIndex(c => c.id == id);
    DB.clientes[idx] = { ...DB.clientes[idx], nome, tipo, doc, tel, email, end, equipamentos };
    toast('Cliente atualizado!', 'success');
  } else {
    DB.clientes.push({ id: DB.nextId.clientes++, nome, tipo, doc, tel, email, end, equipamentos });
    toast('Cliente cadastrado!', 'success');
  }
  closeModal('modal-cliente');
  renderTable('clientes');
}

// ---- CRUD: Alocações ---- //
function saveAlocacao() {
  const id = document.getElementById('aloc-id').value;
  const responsavel = document.getElementById('aloc-responsavel').value.trim();
  const tipo = document.getElementById('aloc-tipo').value;
  const item = document.getElementById('aloc-item').value.trim();
  const serie = document.getElementById('aloc-serie').value.trim();
  const saida = document.getElementById('aloc-saida').value;
  const retorno = document.getElementById('aloc-retorno').value;
  const motivo = document.getElementById('aloc-motivo').value.trim();

  if (!responsavel || !item || !saida) return toast('Preencha os campos obrigatórios.', 'error');

  if (id) {
    const idx = DB.alocacoes.findIndex(a => a.id == id);
    DB.alocacoes[idx] = { ...DB.alocacoes[idx], responsavel, tipo, item, serie, saida, retorno, motivo };
    toast('Alocação atualizada!', 'success');
  } else {
    DB.alocacoes.push({ id: DB.nextId.alocacoes++, responsavel, tipo, item, serie, saida, retorno, motivo });
    toast('Alocação registrada!', 'success');
  }
  closeModal('modal-alocacao');
  renderTable('alocacoes');
}

// ---- Delete ---- //
function confirmDelete(entity, id) {
  const names = { materiais: 'material', maquinas: 'equipamento', ferramentas: 'ferramenta', tecnicos: 'técnico', clientes: 'cliente', alocacoes: 'alocação' };
  document.getElementById('delete-msg').textContent = `Tem certeza que deseja excluir este ${names[entity] || 'item'}? Esta ação não pode ser desfeita.`;
  document.getElementById('delete-confirm-btn').onclick = () => deleteItem(entity, id);
  openModal('modal-delete');
}

function deleteItem(entity, id) {
  DB[entity] = DB[entity].filter(i => i.id != id);
  closeModal('modal-delete');
  renderTable(entity);
  toast('Item excluído com sucesso.', 'success');
}

// ---- Search ---- //
function handleGlobalSearch(q) {
  if (!q) return;
  // Simple: highlight active page search
  const bar = document.querySelector(`#page-${activePage} .filter-input`);
  if (bar) { bar.value = q; renderTable(activePage); }
}

// ---- Export ---- //
function exportData(entity, format) {
  const names = { materiais: 'Materiais', maquinas: 'Equipamentos', ferramentas: 'Ferramentas', tecnicos: 'Técnicos', clientes: 'Clientes', alocacoes: 'Alocações', agenda: 'Agenda' };
  const label = names[entity] || entity;

  if (format === 'xlsx') exportXLSX(entity, label);
  else if (format === 'pdf') exportPDF(entity, label);
}

function getTableData(entity) {
  if (entity === 'materiais') {
    return {
      headers: ['Material', 'Categoria', 'Quantidade', 'Mínimo', 'Unidade', 'Status'],
      rows: DB.materiais.map(m => [m.nome, m.categoria, m.qtd, m.min, m.unidade, m.qtd===0?'Sem estoque':m.qtd<m.min?'Baixo':'OK'])
    };
  }
  if (entity === 'maquinas') {
    return {
      headers: ['Modelo', 'Marca', 'BTUs', 'Nº Série', 'Patrimônio', 'Status', 'Alocado a'],
      rows: DB.maquinas.map(m => [m.modelo, m.marca, m.btus, m.serie, m.patrimonio, m.status, m.alocado||'—'])
    };
  }
  if (entity === 'ferramentas') {
    return {
      headers: ['Ferramenta', 'Total', 'Disponível', 'Com técnico', 'Manutenção', 'Patrimônio'],
      rows: DB.ferramentas.map(f => [f.nome, f.total, f.disp, f.tecnico, f.manut, f.patrimonio])
    };
  }
  if (entity === 'tecnicos') {
    return {
      headers: ['Nome', 'Especialidade', 'Telefone', 'Email', 'Status'],
      rows: DB.tecnicos.map(t => [t.nome, t.especialidade, t.tel, t.email, t.status])
    };
  }
  if (entity === 'clientes') {
    return {
      headers: ['Nome', 'Tipo', 'CPF/CNPJ', 'Telefone', 'Email', 'Endereço', 'Nº Equipamentos'],
      rows: DB.clientes.map(c => [c.nome, c.tipo, c.doc, c.tel, c.email, c.end, c.equipamentos.length])
    };
  }
  if (entity === 'alocacoes') {
    return {
      headers: ['Responsável', 'Item', 'Tipo', 'Nº Série', 'Saída', 'Retorno Prev.', 'Motivo'],
      rows: DB.alocacoes.map(a => [a.responsavel, a.item, a.tipo, a.serie, formatDate(a.saida), formatDate(a.retorno), a.motivo])
    };
  }
  if (entity === 'agenda') {
    return {
      headers: ['Hora', 'Título', 'Técnico', 'Duração', 'Materiais'],
      rows: DB.agenda.map(e => [e.hora, e.titulo, e.tecnico, e.duracao, e.tags.join(', ')])
    };
  }
  return { headers: [], rows: [] };
}

function exportXLSX(entity, label) {
  try {
    const { headers, rows } = getTableData(entity);
    const wsData = [headers, ...rows];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    // Column widths
    ws['!cols'] = headers.map(() => ({ wch: 20 }));
    XLSX.utils.book_append_sheet(wb, ws, label);
    XLSX.writeFile(wb, `HVAC_${label}_${todayStr()}.xlsx`);
    toast(`${label} exportado em Excel!`, 'success');
  } catch(e) {
    toast('Erro ao exportar Excel.', 'error');
  }
}

function exportPDF(entity, label) {
  const { headers, rows } = getTableData(entity);
  const w = window.open('', '_blank');
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>HVAC Pro — ${label}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', Arial, sans-serif; font-size: 12px; color: #1A1A18; padding: 32px; }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-bottom: 2px solid #1A56DB; padding-bottom: 16px; }
  .logo-text { font-size: 20px; font-weight: 700; color: #1A56DB; }
  .meta { font-size: 11px; color: #6B6B67; }
  h2 { font-size: 16px; margin-bottom: 14px; color: #1A1A18; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background: #F5F5F3; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B6B67; border-bottom: 1px solid #E4E4E0; }
  td { padding: 8px 10px; border-bottom: 1px solid #E4E4E0; color: #1A1A18; }
  tr:hover td { background: #F9F9F8; }
  .footer { margin-top: 24px; font-size: 10px; color: #9D9D99; text-align: center; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
<div class="header">
  <div class="logo-text">HVAC Pro</div>
  <div class="meta">Emitido em ${new Date().toLocaleString('pt-BR')}</div>
</div>
<h2>${label}</h2>
<table>
  <thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c??''}</td>`).join('')}</tr>`).join('')}</tbody>
</table>
<div class="footer">HVAC Pro — Sistema de Gestão de Estoque · ${rows.length} registro(s)</div>
<script>window.onload=()=>{window.print();}<\/script>
</body></html>`;
  w.document.write(html);
  w.document.close();
  toast(`${label} aberto para impressão/PDF!`, 'success');
}

function todayStr() {
  return new Date().toISOString().slice(0,10).replace(/-/g,'');
}

// ---- Toast ---- //
let toastTimer;
function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ---- Init ---- //
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  showPage('dashboard');

  // Default date for alocacao
  document.getElementById('aloc-saida').value = new Date().toISOString().slice(0,10);

  // Init clienteEquips
  renderClienteEquips([]);
});
