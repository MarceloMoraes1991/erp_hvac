/* ============================================================
   AUTENTICAÇÃO — Login / Logout
   ============================================================ */
const USUARIOS = [
  { usuario: 'admin',   senha: 'admin123', nome: 'Administrador', perfil: 'Admin',   initials: 'AD' },
  { usuario: 'tecnico', senha: 'tec123',   nome: 'Carlos Mendes', perfil: 'Técnico', initials: 'CM' },
];

let usuarioLogado = null;

function doLogin() {
  const user = document.getElementById('login-user').value.trim().toLowerCase();
  const pass = document.getElementById('login-pass').value;
  const errEl = document.getElementById('login-error');
  const btn   = document.querySelector('.login-btn');

  // Verifica usuário inativo antes de tudo
  const dbUser = DB.usuarios ? DB.usuarios.find(u => u.login === user) : null;
  if (dbUser && dbUser.status === 'Inativo') {
    errEl.textContent = 'Este usuário está inativo. Contacte o administrador.';
    errEl.style.display = 'flex';
    return;
  }

  btn.classList.add('loading');
  btn.textContent = 'Entrando...';

  setTimeout(() => {
    const found = USUARIOS.find(u => u.usuario === user && u.senha === pass);
    if (found) {
      usuarioLogado = found;
      errEl.style.display = 'none';
      errEl.textContent = 'Usuário ou senha incorretos.'; // reset msg
      document.getElementById('login-screen').classList.add('hidden');
      _atualizarSidebarUser();
      sessionStorage.setItem('hvac-user', JSON.stringify(found));
    } else {
      errEl.textContent = 'Usuário ou senha incorretos.';
      errEl.style.display = 'flex';
      document.getElementById('login-pass').value = '';
      document.getElementById('login-pass').focus();
      btn.classList.remove('loading');
      btn.innerHTML = 'Entrar <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
  }, 600);
}

function doLogout() {
  if (!confirm('Deseja sair do sistema?')) return;
  usuarioLogado = null;
  sessionStorage.removeItem('hvac-user');
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('login-screen').classList.remove('hidden');
  // Reset btn
  const btn = document.querySelector('.login-btn');
  btn.classList.remove('loading');
  btn.innerHTML = 'Entrar <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function toggleLoginPass(btn) {
  const input = document.getElementById('login-pass');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function _atualizarSidebarUser() {
  if (!usuarioLogado) return;
  const avatarEl = document.querySelector('.user-avatar');
  const nameEl   = document.querySelector('.user-name');
  const roleEl   = document.querySelector('.user-role');
  if (avatarEl) avatarEl.textContent = usuarioLogado.initials;
  if (nameEl)   nameEl.textContent   = usuarioLogado.nome;
  if (roleEl)   roleEl.textContent   = usuarioLogado.perfil;
  // Admin visibility
  _aplicarVisibilidadeAdmin();
  // Registra último acesso no DB
  if (DB.usuarios) {
    const idx = DB.usuarios.findIndex(u => u.login === usuarioLogado.login);
    if (idx !== -1) DB.usuarios[idx].ultimoAcesso = new Date().toISOString();
  }
}

/* ===================================================
   HVAC PRO — app.js  (v4)
   =================================================== */
'use strict';

let DB = {
  materiais: [
    { id:1, nome:'Filtro G4 250x250',    categoria:'Filtros',      qtd:48,  min:20, unidade:'un',   obs:'' },
    { id:2, nome:'Cabo cobre 6mm',        categoria:'Elétrico',     qtd:85,  min:30, unidade:'m',    obs:'' },
    { id:3, nome:'Mangueira dreno 3/4',   categoria:'Hidráulico',   qtd:12,  min:20, unidade:'m',    obs:'' },
    { id:4, nome:'Gás R-410A',            categoria:'Refrigerante', qtd:8,   min:5,  unidade:'kg',   obs:'' },
    { id:5, nome:'Suporte fixação L',     categoria:'Fixação',      qtd:34,  min:10, unidade:'un',   obs:'' },
    { id:6, nome:'Gás R-22',              categoria:'Refrigerante', qtd:3,   min:5,  unidade:'kg',   obs:'' },
    { id:7, nome:'Parafuso 3/8 x 50mm',   categoria:'Fixação',      qtd:200, min:50, unidade:'un',   obs:'' },
    { id:8, nome:'Fita autofusão',        categoria:'Outros',       qtd:15,  min:10, unidade:'rolo', obs:'' },
  ],
  // status: 'Estoque' | 'Instalado' | 'Manutenção'
  // Quando Instalado: clienteId/clienteNome preenchidos → some do estoque disponível
  maquinas: [
    { id:1, marca:'Midea',   modelo:'Split Inverter 9k',   btus:9000,  serie:'SN-MID-001', patrimonio:'PAT-001', status:'Estoque',   clienteId:null, clienteNome:'', dataInstalacao:'', localInstalacao:'', obs:'' },
    { id:2, marca:'Daikin',  modelo:'Split Inverter 12k',  btus:12000, serie:'SN-DAI-002', patrimonio:'PAT-002', status:'Instalado', clienteId:1,    clienteNome:'Residencial Silva',    dataInstalacao:'2025-03-15', localInstalacao:'Sala', obs:'' },
    { id:3, marca:'LG',      modelo:'Split Inverter 18k',  btus:18000, serie:'SN-LG-003',  patrimonio:'PAT-003', status:'Estoque',   clienteId:null, clienteNome:'', dataInstalacao:'', localInstalacao:'', obs:'' },
    { id:4, marca:'Samsung', modelo:'Cassete 24k',          btus:24000, serie:'SN-SAM-004', patrimonio:'PAT-004', status:'Manutenção',clienteId:null, clienteNome:'', dataInstalacao:'', localInstalacao:'', obs:'Compressor com defeito' },
    { id:5, marca:'Carrier', modelo:'Split Piso-Teto 30k', btus:30000, serie:'SN-CAR-005', patrimonio:'PAT-005', status:'Instalado', clienteId:2,    clienteNome:'Comercial Plaza LTDA', dataInstalacao:'2024-11-10', localInstalacao:'Escritório', obs:'' },
    { id:6, marca:'Hitachi', modelo:'Multi-Split 2x9k',    btus:18000, serie:'SN-HIT-006', patrimonio:'PAT-006', status:'Estoque',   clienteId:null, clienteNome:'', dataInstalacao:'', localInstalacao:'', obs:'' },
  ],
  ferramentas: [
    { id:1, nome:'Manifold digital',     total:4, disp:3, tecnico:1, manut:0, patrimonio:'FER-001' },
    { id:2, nome:'Bomba de vácuo',       total:3, disp:2, tecnico:1, manut:0, patrimonio:'FER-002' },
    { id:3, nome:'Balança de gás',       total:2, disp:1, tecnico:1, manut:0, patrimonio:'FER-003' },
    { id:4, nome:'Multímetro digital',   total:6, disp:4, tecnico:1, manut:1, patrimonio:'FER-004' },
    { id:5, nome:'Serra mármore',        total:2, disp:1, tecnico:0, manut:1, patrimonio:'FER-005' },
    { id:6, nome:'Furadeira de impacto', total:5, disp:3, tecnico:2, manut:0, patrimonio:'FER-006' },
  ],
  tecnicos: [
    { id:1, nome:'Carlos Mendes',  especialidade:'Instalação residencial', tel:'(11) 98765-0001', email:'carlos@hvacpro.com',  status:'Ativo' },
    { id:2, nome:'João Silva',     especialidade:'Manutenção industrial',  tel:'(11) 98765-0002', email:'joao@hvacpro.com',    status:'Ativo' },
    { id:3, nome:'Roberto Alves',  especialidade:'Refrigeração comercial', tel:'(11) 98765-0003', email:'roberto@hvacpro.com', status:'Ativo' },
    { id:4, nome:'Maria Paula',    especialidade:'Elétrica / Inverter',    tel:'(11) 98765-0004', email:'maria@hvacpro.com',   status:'Férias' },
  ],
  clientes: [
    { id:1, nome:'Residencial Silva',    tipo:'Residencial', doc:'123.456.789-00',     tel:'(11) 91234-5678', email:'silva@email.com',   end:'Rua das Flores, 120 — São Paulo, SP' },
    { id:2, nome:'Comercial Plaza LTDA', tipo:'Comercial',   doc:'12.345.678/0001-99', tel:'(11) 3456-7890',  email:'contato@plaza.com', end:'Av. Principal, 450 — São Paulo, SP' },
  ],
  movimentacoes: [
    { tipo:'in',  desc:'Filtro G4 — Compra NF 4521',            qty:'+50',   time:'Hoje 09:14' },
    { tipo:'out', desc:'Split 12k Daikin → Residencial Silva',  qty:'-1 un', time:'Hoje 08:30' },
    { tipo:'out', desc:'Cabo cobre 6mm — Instalação',           qty:'-15m',  time:'Ontem 16:45' },
    { tipo:'in',  desc:'Split 9k Midea — retorno ao estoque',   qty:'+1 un', time:'Ontem 14:00' },
    { tipo:'out', desc:'Mangueira dreno — Roberto Alves',       qty:'-3m',   time:'Ontem 11:20' },
  ],
  agenda: [
    { hora:'08:00', titulo:'Instalação Split 12k — Rua das Flores, 120', tecnico:'Carlos Mendes', duracao:'3h', tags:['Split 12k Daikin','Suporte x2','Dreno 2m'], alerta:false },
    { hora:'13:30', titulo:'Manutenção preventiva — Av. Principal, 450',  tecnico:'João Silva',    duracao:'2h', tags:['Filtros G4 x2','Gás R-410A'],               alerta:false },
    { hora:'09:00', titulo:'Instalação Cassete 24k — Centro Comercial',   tecnico:'Roberto Alves', duracao:'5h', tags:['Cassete 24k Samsung','Suporte teto'],        alerta:false, amanha:true },
  ],
  ordens: [
    { id:1, protocolo:'HVAC-2026-357476', data:'2026-04-02', hora:'11:22', status:'Concluída',
      clienteId:1, clienteNome:'Residencial Silva', morada:'Rua das Flores, 120 — São Paulo, SP',
      contacto:'(11) 91234-5678', solicitante:'', email:'silva@email.com', tecnicoNome:'Carlos Mendes',
      descricao:'Instalação Split 12k BTU',
      materiais:[{ materialId:3, nome:'Mangueira dreno 3/4', unidade:'m', qtdSol:2, qtdEnt:2, obs:'', checked:true }],
      cobres:[], obsGerais:'' }
  ],
  nextId: { materiais:9, maquinas:7, ferramentas:7, tecnicos:5, clientes:3, ordens:2 }
};

/* helper */
function getEquipsCliente(clienteId) {
  return DB.maquinas.filter(m => m.clienteId == clienteId && m.status === 'Instalado');
}

/* ============================================================ TEMA */
let currentTheme = localStorage.getItem('hvac-theme') || 'system';
let activePage   = 'dashboard';

function applyTheme(t) {
  const applied = t==='system' ? (matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light') : t;
  document.documentElement.setAttribute('data-applied-theme', applied);
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme===t));
  localStorage.setItem('hvac-theme', t); currentTheme = t;
}
function setTheme(t) { applyTheme(t); }
matchMedia('(prefers-color-scheme:dark)').addEventListener('change', ()=>{ if(currentTheme==='system') applyTheme('system'); });

/* ============================================================ NAVEGAÇÃO */
function showPage(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  document.getElementById('page-'+page)?.classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  const names={dashboard:'Dashboard',agenda:'Agenda',materiais:'Materiais',maquinas:'Equipamentos',
    ferramentas:'Ferramentas',tecnicos:'Técnicos',clientes:'Clientes',alocacoes:'Alocações',ordens:'Ordens de Serviço'};
  document.getElementById('breadcrumb').textContent = names[page]||page;
  activePage = page;
  renderPage(page);
  if (window.innerWidth<=680) document.getElementById('sidebar').classList.remove('mobile-open');
}
function renderPage(page) {
  if (page==='dashboard')  renderDashboard();
  else if (page==='agenda') renderAgenda();
  else if (page==='ordens') renderOSLista();
  else if (page==='usuarios') {
    if (usuarioLogado && usuarioLogado.perfil !== 'Admin') {
      toast('Acesso restrito a administradores.', 'error');
      showPage('dashboard');
      return;
    }
    renderUsuarios();
  }
  else { renderTable(page); updateCount(page); }
}
function toggleSidebar() {
  const s=document.getElementById('sidebar');
  window.innerWidth<=680 ? s.classList.toggle('mobile-open') : s.classList.toggle('collapsed');
}

/* ============================================================ DASHBOARD */
function renderDashboard() {
  document.getElementById('todayDate').textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  const low=DB.materiais.filter(m=>m.qtd>0&&m.qtd<m.min).length;
  const out=DB.materiais.filter(m=>m.qtd===0).length;
  const emEst=DB.maquinas.filter(m=>m.status==='Estoque').length;
  const inst=DB.maquinas.filter(m=>m.status==='Instalado').length;
  document.getElementById('dashKpis').innerHTML=`
    <div class="kpi-card"><div class="kpi-label">Materiais em estoque</div>
      <div class="kpi-value">${DB.materiais.reduce((s,m)=>s+m.qtd,0)}</div>
      <div class="kpi-sub">${DB.materiais.length} itens</div></div>
    <div class="kpi-card"><div class="kpi-label">Equipamentos disponíveis</div>
      <div class="kpi-value" style="color:var(--accent)">${emEst}</div>
      <div class="kpi-sub">${inst} instalados · ${DB.maquinas.filter(m=>m.status==='Manutenção').length} manutenção</div></div>
    <div class="kpi-card"><div class="kpi-label">Alertas de estoque</div>
      <div class="kpi-value" style="color:${out>0?'var(--danger)':'var(--warning)'}">${low+out}</div>
      <div class="kpi-sub">${out} sem estoque · ${low} baixo</div></div>
    <div class="kpi-card"><div class="kpi-label">Técnicos ativos</div>
      <div class="kpi-value">${DB.tecnicos.filter(t=>t.status==='Ativo').length}</div>
      <div class="kpi-sub">${DB.ordens.length} OS no sistema</div></div>`;
  document.getElementById('alertDot')?.classList.toggle('visible',low+out>0);
  document.getElementById('dashMovim').innerHTML=DB.movimentacoes.slice(0,8).map(m=>`
    <div class="movim-item">
      <div class="movim-dot ${m.tipo}">${m.tipo==='in'?'↑':'↓'}</div>
      <div class="movim-desc">${m.desc}</div>
      <div class="movim-qty ${m.tipo==='in'?'pos':'neg'}">${m.qty}</div>
      <div class="movim-time">${m.time}</div>
    </div>`).join('');
  const ev=DB.agenda.filter(e=>!e.amanha);
  document.getElementById('dashAgenda').innerHTML=ev.length?ev.map(renderEventHTML).join(''):'<p style="padding:20px;color:var(--text-muted);font-size:13px;text-align:center">Sem instalações hoje.</p>';
  const al=DB.materiais.filter(m=>m.qtd<m.min);
  document.getElementById('dashAlerts').innerHTML=al.length?al.map(m=>`
    <div class="alert-item">
      <span class="badge ${m.qtd===0?'badge-out':'badge-low'}">${m.qtd===0?'Sem estoque':'Baixo'}</span>
      <span class="alert-name">${m.nome}</span>
      <span class="alert-info">Atual: <strong>${m.qtd} ${m.unidade}</strong> · Mín: ${m.min}</span>
      <button class="btn btn-sm btn-outline" onclick="showPage('materiais')">Ver</button>
    </div>`).join(''):'<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px">Todos os itens OK.</div>';
}
function renderEventHTML(e) {
  return `<div class="agenda-event"><div class="agenda-time">${e.hora}</div>
    <div class="agenda-body"><div class="agenda-title">${e.titulo}</div>
    <div class="agenda-meta">${e.tecnico} · ${e.duracao}</div>
    <div class="agenda-tags">${e.tags.map(t=>`<span class="badge badge-gray">${t}</span>`).join('')}</div>
    </div></div>`;
}

/* ============================================================ AGENDA */
function renderAgenda() {
  const today=DB.agenda.filter(e=>!e.amanha); const am=DB.agenda.filter(e=>e.amanha);
  let html='';
  if(today.length) html+=`<div class="card" style="margin-bottom:14px"><div class="card-head"><span class="card-title">Hoje — ${new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long'})}</span></div>${today.map(renderEventHTML).join('')}</div>`;
  if(am.length){const tm=new Date();tm.setDate(tm.getDate()+1);html+=`<div class="card"><div class="card-head"><span class="card-title">Amanhã — ${tm.toLocaleDateString('pt-BR',{day:'2-digit',month:'long'})}</span></div>${am.map(renderEventHTML).join('')}</div>`;}
  document.getElementById('agendaList').innerHTML=html||'<p style="color:var(--text-muted);font-size:13px">Sem eventos.</p>';
}

/* ============================================================ TABELAS */
function getF(entity){const b=document.querySelector(`#page-${entity} .filter-bar`);if(!b)return{q:'',s1:'',s2:''};return{q:b.querySelector('.filter-input')?.value.toLowerCase()||'',s1:b.querySelectorAll('.filter-select')[0]?.value||'',s2:b.querySelectorAll('.filter-select')[1]?.value||''};}
function updateCount(entity){const el=document.getElementById(entity+'Count');if(!el||!DB[entity])return;el.textContent=`${DB[entity].length} registro${DB[entity].length!==1?'s':''}`;}
function fmtDate(d){if(!d)return'—';const[y,m,day]=d.split('-');return`${day}/${m}/${y}`;}
function formatDate(d){return fmtDate(d);}
function todayStr(){return new Date().toISOString().slice(0,10).replace(/-/g,'');}
function horaAgora(){return new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}
function initials(n){return(n||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();}
function matBadge(m){return m.qtd===0?'<span class="badge badge-out">Sem estoque</span>':m.qtd<m.min?'<span class="badge badge-low">Baixo</span>':'<span class="badge badge-ok">OK</span>';}
function maqBadge(s){return s==='Estoque'?'<span class="badge badge-ok">Estoque</span>':s==='Instalado'?'<span class="badge badge-blue">Instalado</span>':'<span class="badge badge-maint">Manutenção</span>';}
function tecBadge(s){return s==='Ativo'?'<span class="badge badge-ok">Ativo</span>':s==='Férias'?'<span class="badge badge-low">Férias</span>':'<span class="badge badge-gray">Inativo</span>';}
function actBtns(entity,id){return`<div class="row-actions">
  <button class="btn-icon" onclick="editItem('${entity}',${id})" title="Editar"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
  <button class="btn-icon danger" onclick="confirmDelete('${entity}',${id})" title="Excluir"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
</div>`;}

function renderTable(entity) {
  const tbody=document.getElementById('tbody-'+entity);
  const empty=document.getElementById('empty-'+entity);
  if(!tbody)return;
  const {q,s1,s2}=getF(entity);
  let rows='';let count=0;

  if(entity==='materiais'){
    const data=DB.materiais.filter(m=>{const st=m.qtd===0?'out':m.qtd<m.min?'low':'ok';return(!q||m.nome.toLowerCase().includes(q)||m.categoria.toLowerCase().includes(q))&&(!s1||m.categoria===s1)&&(!s2||st===s2);});
    count=data.length;
    rows=data.map(m=>`<tr><td>${m.nome}</td><td>${m.categoria}</td><td><strong>${m.qtd}</strong></td><td>${m.min}</td><td>${m.unidade}</td><td>${matBadge(m)}</td><td>${actBtns('materiais',m.id)}</td></tr>`).join('');
  }
  else if(entity==='maquinas'){
    const data=DB.maquinas.filter(m=>(!q||m.modelo.toLowerCase().includes(q)||m.marca.toLowerCase().includes(q)||m.serie.toLowerCase().includes(q))&&(!s1||m.status===s1));
    count=data.length;
    rows=data.map(m=>`<tr>
      <td>${m.modelo}</td><td>${m.marca}</td>
      <td class="mono">${m.btus.toLocaleString('pt-BR')} BTU</td>
      <td class="mono">${m.serie}</td><td class="mono">${m.patrimonio}</td>
      <td>${maqBadge(m.status)}</td>
      <td>${m.clienteNome?`<span style="color:var(--accent-text);font-size:12px;cursor:pointer" onclick="verEquipsCliente(${m.clienteId})">${m.clienteNome}</span>`:'<span style="color:var(--text-subtle)">—</span>'}</td>
      <td>${actBtns('maquinas',m.id)}</td>
    </tr>`).join('');
  }
  else if(entity==='ferramentas'){
    const data=DB.ferramentas.filter(f=>!q||f.nome.toLowerCase().includes(q));
    count=data.length;
    rows=data.map(f=>`<tr><td>${f.nome}</td><td><strong>${f.total}</strong></td><td><strong style="color:var(--success)">${f.disp}</strong></td><td>${f.tecnico}</td><td>${f.manut}</td><td class="mono">${f.patrimonio}</td><td>${actBtns('ferramentas',f.id)}</td></tr>`).join('');
  }
  else if(entity==='tecnicos'){
    const data=DB.tecnicos.filter(t=>(!q||t.nome.toLowerCase().includes(q)||t.especialidade.toLowerCase().includes(q))&&(!s1||t.status===s1));
    count=data.length;
    rows=data.map(t=>`<tr>
      <td><div class="tech-cell"><div class="tech-avatar">${initials(t.nome)}</div>${t.nome}</div></td>
      <td>${t.especialidade}</td><td>${t.tel}</td><td>${t.email}</td>
      <td>${tecBadge(t.status)}</td>
      <td>${actBtns('tecnicos',t.id)}</td>
    </tr>`).join('');
  }
  else if(entity==='clientes'){
    const data=DB.clientes.filter(c=>(!q||c.nome.toLowerCase().includes(q)||(c.doc||'').includes(q)||(c.end||'').toLowerCase().includes(q))&&(!s1||c.tipo===s1));
    count=data.length;
    rows=data.map(c=>{
      const equips=getEquipsCliente(c.id);
      return`<tr>
        <td><strong>${c.nome}</strong></td><td>${c.tipo}</td>
        <td class="mono">${c.doc||'—'}</td><td>${c.tel}</td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.end}</td>
        <td>${equips.length?`<span class="badge badge-blue" style="cursor:pointer" onclick="verEquipsCliente(${c.id})" title="Ver equipamentos instalados">${equips.length} equip. instalado${equips.length>1?'s':''}</span>`:'<span style="color:var(--text-subtle)">—</span>'}</td>
        <td><div class="row-actions">
          <button class="btn-icon" onclick="editItem('clientes',${c.id})" title="Editar"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
          <button class="btn-icon" title="Alocar equipamento" style="color:var(--success)" onclick="abrirAlocarEquip(${c.id})"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M16 7V5a2 2 0 00-4 0v2M12 12v4M10 14h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          <button class="btn-icon" title="Nova OS para este cliente" style="color:var(--accent)" onclick="abrirOSCliente(${c.id})"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
          <button class="btn-icon danger" onclick="confirmDelete('clientes',${c.id})" title="Excluir"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
        </div></td>
      </tr>`;
    }).join('');
  }

  tbody.innerHTML=rows;
  if(empty) empty.style.display=count===0?'block':'none';
  updateCount(entity);
}

/* ============================================================ MODAIS */
function openModal(id){document.getElementById(id)?.classList.add('open');}
function closeModal(id){document.getElementById(id)?.classList.remove('open');}
function overlayClose(e,id){if(e.target===e.currentTarget)closeModal(id);}
function openModalNew(modalId){
  const t={'modal-material':['modal-material-title','Novo Material'],'modal-maquina':['modal-maquina-title','Novo Equipamento'],'modal-ferramenta':['modal-ferramenta-title','Nova Ferramenta'],'modal-tecnico':['modal-tecnico-title','Novo Técnico'],'modal-cliente':['modal-cliente-title','Novo Cliente'],'modal-alocacao':['modal-alocacao-title','Nova Alocação']};
  if(t[modalId]){const[tid,title]=t[modalId];document.getElementById(tid).textContent=title;}
  document.querySelectorAll(`#${modalId} input`).forEach(i=>{if(i.type!=='hidden')i.value='';});
  document.querySelectorAll(`#${modalId} [type=hidden]`).forEach(i=>i.value='');
  openModal(modalId);
}

/* ============================================================ CRUD MATERIAIS */
function saveMaterial(){
  const id=document.getElementById('mat-id').value;
  const nome=document.getElementById('mat-nome').value.trim();
  const cat=document.getElementById('mat-categoria').value;
  const un=document.getElementById('mat-unidade').value;
  const qtd=parseFloat(document.getElementById('mat-qtd').value)||0;
  const min=parseFloat(document.getElementById('mat-min').value)||0;
  const obs=document.getElementById('mat-obs').value.trim();
  if(!nome||!cat||!un)return toast('Preencha os campos obrigatórios.','error');
  if(id){const i=DB.materiais.findIndex(m=>m.id==id);DB.materiais[i]={...DB.materiais[i],nome,categoria:cat,unidade:un,qtd,min,obs};toast('Material atualizado!','success');}
  else{DB.materiais.push({id:DB.nextId.materiais++,nome,categoria:cat,unidade:un,qtd,min,obs});toast('Material cadastrado!','success');}
  closeModal('modal-material');renderTable('materiais');
}

/* ============================================================ CRUD EQUIPAMENTOS */
function saveMaquina(){
  const id=document.getElementById('maq-id').value;
  const marca=document.getElementById('maq-marca').value.trim();
  const modelo=document.getElementById('maq-modelo').value.trim();
  const btus=parseInt(document.getElementById('maq-btus').value)||0;
  const status=document.getElementById('maq-status').value;
  const serie=document.getElementById('maq-serie').value.trim();
  const patrimonio=document.getElementById('maq-patrimonio').value.trim();
  const obs=document.getElementById('maq-obs').value.trim();
  if(!marca||!modelo||!serie)return toast('Preencha os campos obrigatórios.','error');
  if(id){
    const i=DB.maquinas.findIndex(m=>m.id==id);
    const prev=DB.maquinas[i];
    const clienteData=status==='Instalado'&&prev.clienteId?{clienteId:prev.clienteId,clienteNome:prev.clienteNome,dataInstalacao:prev.dataInstalacao,localInstalacao:prev.localInstalacao}:{clienteId:null,clienteNome:'',dataInstalacao:'',localInstalacao:''};
    DB.maquinas[i]={...prev,marca,modelo,btus,status,serie,patrimonio,obs,...clienteData};
    toast('Equipamento atualizado!','success');
  }else{DB.maquinas.push({id:DB.nextId.maquinas++,marca,modelo,btus,status,serie,patrimonio,obs,clienteId:null,clienteNome:'',dataInstalacao:'',localInstalacao:''});toast('Equipamento cadastrado!','success');}
  closeModal('modal-maquina');renderTable('maquinas');
}

/* ============================================================ ALOCAR EQUIPAMENTO → CLIENTE */
let _alocCliId=null;
function abrirAlocarEquip(clienteId){
  _alocCliId=clienteId;
  const c=DB.clientes.find(x=>x.id===clienteId);
  document.getElementById('aloc-equip-cliente').textContent=c?c.nome:'—';
  const disponiveis=DB.maquinas.filter(m=>m.status==='Estoque');
  document.getElementById('aloc-equip-sel').innerHTML='<option value="">Selecione o equipamento...</option>'+
    disponiveis.map(m=>`<option value="${m.id}">${m.marca} ${m.modelo} | Série: ${m.serie} | ${m.patrimonio}</option>`).join('');
  document.getElementById('aloc-equip-data').value=new Date().toISOString().slice(0,10);
  document.getElementById('aloc-equip-local').value='';
  document.getElementById('aloc-equip-obs').value='';
  openModal('modal-alocar-equip');
}
function salvarAlocacaoEquip(){
  const maqId=document.getElementById('aloc-equip-sel').value;
  const data=document.getElementById('aloc-equip-data').value;
  const local=document.getElementById('aloc-equip-local').value.trim();
  const obs=document.getElementById('aloc-equip-obs').value.trim();
  if(!maqId)return toast('Selecione um equipamento.','error');
  if(!data)return toast('Informe a data de instalação.','error');
  const i=DB.maquinas.findIndex(m=>m.id==maqId);
  if(i===-1)return;
  const c=DB.clientes.find(x=>x.id===_alocCliId);
  Object.assign(DB.maquinas[i],{status:'Instalado',clienteId:_alocCliId,clienteNome:c?c.nome:'',dataInstalacao:data,localInstalacao:local,obs});
  DB.movimentacoes.unshift({tipo:'out',desc:`${DB.maquinas[i].marca} ${DB.maquinas[i].modelo} → ${c?.nome||'cliente'}`,qty:'-1 un',time:horaAgora()});
  closeModal('modal-alocar-equip');
  renderTable('clientes');renderTable('maquinas');
  toast(`Equipamento instalado em ${c?.nome||'cliente'}!`,'success');
}
function desinstalarEquip(maqId){
  const i=DB.maquinas.findIndex(m=>m.id==maqId);
  if(i===-1)return;
  const m=DB.maquinas[i];
  Object.assign(DB.maquinas[i],{status:'Estoque',clienteId:null,clienteNome:'',dataInstalacao:'',localInstalacao:''});
  DB.movimentacoes.unshift({tipo:'in',desc:`${m.marca} ${m.modelo} — retorno ao estoque`,qty:'+1 un',time:horaAgora()});
  closeModal('modal-equip-cliente');
  renderTable('maquinas');renderTable('clientes');
  toast('Equipamento devolvido ao estoque.','success');
}
function verEquipsCliente(clienteId){
  const c=DB.clientes.find(x=>x.id===clienteId);
  const equips=getEquipsCliente(clienteId);
  document.getElementById('equip-cli-titulo').textContent=`Equipamentos instalados — ${c?.nome||''}`;
  document.getElementById('equip-cli-body').innerHTML=equips.length?equips.map(m=>`
    <div class="equip-cli-row">
      <div class="equip-cli-info">
        <div class="equip-cli-nome">${m.marca} ${m.modelo}</div>
        <div class="equip-cli-meta">
          Série: <strong>${m.serie}</strong> · Patrimônio: ${m.patrimonio}
          ${m.dataInstalacao?` · Instalado em ${fmtDate(m.dataInstalacao)}`:''}
          ${m.localInstalacao?` · Local: <em>${m.localInstalacao}</em>`:''}
          ${m.obs?` · Obs: ${m.obs}`:''}
        </div>
      </div>
      <div class="equip-cli-actions">
        <span class="badge badge-blue">Instalado</span>
        <button class="btn btn-sm btn-outline" style="color:var(--danger);border-color:var(--danger)" onclick="if(confirm('Devolver este equipamento ao estoque?')) desinstalarEquip(${m.id})">Devolver ao estoque</button>
      </div>
    </div>`).join(''):'<p style="color:var(--text-muted);font-size:13px;padding:8px 0">Nenhum equipamento instalado neste cliente.</p>';
  openModal('modal-equip-cliente');
}

/* ============================================================ CRUD FERRAMENTAS */
function saveFerramenta(){
  const id=document.getElementById('fer-id').value;
  const nome=document.getElementById('fer-nome').value.trim();
  const total=parseInt(document.getElementById('fer-total').value)||0;
  const disp=parseInt(document.getElementById('fer-disp').value)||0;
  const tecnico=parseInt(document.getElementById('fer-tecnico').value)||0;
  const manut=parseInt(document.getElementById('fer-manut').value)||0;
  const patrimonio=document.getElementById('fer-patrimonio').value.trim();
  if(!nome||!total)return toast('Preencha os campos obrigatórios.','error');
  if(id){const i=DB.ferramentas.findIndex(f=>f.id==id);DB.ferramentas[i]={...DB.ferramentas[i],nome,total,disp,tecnico,manut,patrimonio};toast('Ferramenta atualizada!','success');}
  else{DB.ferramentas.push({id:DB.nextId.ferramentas++,nome,total,disp,tecnico,manut,patrimonio});toast('Ferramenta cadastrada!','success');}
  closeModal('modal-ferramenta');renderTable('ferramentas');
}

/* ============================================================ CRUD TÉCNICOS */
function saveTecnico(){
  const id=document.getElementById('tec-id').value;
  const nome=document.getElementById('tec-nome').value.trim();
  const tel=document.getElementById('tec-tel').value.trim();
  const email=document.getElementById('tec-email').value.trim();
  const esp=document.getElementById('tec-esp').value;
  const status=document.getElementById('tec-status').value;
  if(!nome||!tel)return toast('Preencha os campos obrigatórios.','error');
  if(id){const i=DB.tecnicos.findIndex(t=>t.id==id);DB.tecnicos[i]={...DB.tecnicos[i],nome,tel,email,especialidade:esp,status};toast('Técnico atualizado!','success');}
  else{DB.tecnicos.push({id:DB.nextId.tecnicos++,nome,tel,email,especialidade:esp,status});toast('Técnico cadastrado!','success');}
  closeModal('modal-tecnico');renderTable('tecnicos');
}

/* ============================================================ CRUD CLIENTES */
function saveCliente(){
  const id=document.getElementById('cli-id').value;
  const nome=document.getElementById('cli-nome').value.trim();
  const tipo=document.getElementById('cli-tipo').value;
  const doc=document.getElementById('cli-doc').value.trim();
  const tel=document.getElementById('cli-tel').value.trim();
  const email=document.getElementById('cli-email').value.trim();
  const end=document.getElementById('cli-end').value.trim();
  if(!nome||!tel||!end)return toast('Preencha os campos obrigatórios.','error');
  if(id){
    const i=DB.clientes.findIndex(c=>c.id==id);
    DB.clientes[i]={...DB.clientes[i],nome,tipo,doc,tel,email,end};
    DB.maquinas.forEach(m=>{if(m.clienteId==id)m.clienteNome=nome;});
    toast('Cliente atualizado!','success');
  }else{DB.clientes.push({id:DB.nextId.clientes++,nome,tipo,doc,tel,email,end});toast('Cliente cadastrado!','success');}
  closeModal('modal-cliente');renderTable('clientes');
}

/* ============================================================ editItem */
function editItem(entity,id){
  const item=DB[entity]?.find(i=>i.id==id);if(!item)return;
  if(entity==='materiais'){
    document.getElementById('modal-material-title').textContent='Editar Material';
    ['mat-id','mat-nome','mat-categoria','mat-unidade','mat-qtd','mat-min','mat-obs'].forEach((fid,j)=>{
      const vals=[id,item.nome,item.categoria,item.unidade,item.qtd,item.min,item.obs||''];
      document.getElementById(fid).value=vals[j];});
    openModal('modal-material');
  }else if(entity==='maquinas'){
    document.getElementById('modal-maquina-title').textContent='Editar Equipamento';
    document.getElementById('maq-id').value=id;
    document.getElementById('maq-marca').value=item.marca;
    document.getElementById('maq-modelo').value=item.modelo;
    document.getElementById('maq-btus').value=item.btus;
    document.getElementById('maq-status').value=item.status;
    document.getElementById('maq-serie').value=item.serie;
    document.getElementById('maq-patrimonio').value=item.patrimonio;
    document.getElementById('maq-alocado').value=item.clienteNome||'';
    document.getElementById('maq-obs').value=item.obs||'';
    openModal('modal-maquina');
  }else if(entity==='ferramentas'){
    document.getElementById('modal-ferramenta-title').textContent='Editar Ferramenta';
    document.getElementById('fer-id').value=id;document.getElementById('fer-nome').value=item.nome;
    document.getElementById('fer-total').value=item.total;document.getElementById('fer-disp').value=item.disp;
    document.getElementById('fer-tecnico').value=item.tecnico;document.getElementById('fer-manut').value=item.manut;
    document.getElementById('fer-patrimonio').value=item.patrimonio||'';
    openModal('modal-ferramenta');
  }else if(entity==='tecnicos'){
    document.getElementById('modal-tecnico-title').textContent='Editar Técnico';
    document.getElementById('tec-id').value=id;document.getElementById('tec-nome').value=item.nome;
    document.getElementById('tec-tel').value=item.tel;document.getElementById('tec-email').value=item.email;
    document.getElementById('tec-esp').value=item.especialidade;document.getElementById('tec-status').value=item.status;
    openModal('modal-tecnico');
  }else if(entity==='clientes'){
    document.getElementById('modal-cliente-title').textContent='Editar Cliente';
    document.getElementById('cli-id').value=id;document.getElementById('cli-nome').value=item.nome;
    document.getElementById('cli-tipo').value=item.tipo;document.getElementById('cli-doc').value=item.doc||'';
    document.getElementById('cli-tel').value=item.tel;document.getElementById('cli-email').value=item.email||'';
    document.getElementById('cli-end').value=item.end;
    openModal('modal-cliente');
  }
}

/* ============================================================ EXCLUIR */
function confirmDelete(entity,id){
  const names={materiais:'material',maquinas:'equipamento',ferramentas:'ferramenta',tecnicos:'técnico',clientes:'cliente'};
  document.getElementById('delete-msg').textContent=`Excluir este ${names[entity]||'item'}? Esta ação não pode ser desfeita.`;
  document.getElementById('delete-confirm-btn').onclick=()=>deleteItem(entity,id);
  openModal('modal-delete');
}
function deleteItem(entity,id){
  if(entity==='clientes') DB.maquinas.forEach(m=>{if(m.clienteId==id){m.status='Estoque';m.clienteId=null;m.clienteNome='';}});
  DB[entity]=DB[entity].filter(i=>i.id!=id);
  closeModal('modal-delete');renderTable(entity);toast('Item excluído.','success');
}

/* ============================================================ BUSCA GLOBAL */
function handleGlobalSearch(q){
  if(!q)return;
  const bar=document.querySelector(`#page-${activePage} .filter-input`);
  if(bar){bar.value=q;renderTable(activePage);}
}

/* ============================================================ EXPORTAÇÃO */
function getTableData(entity){
  if(entity==='materiais') return{headers:['Material','Categoria','Quantidade','Mínimo','Unidade','Status'],rows:DB.materiais.map(m=>[m.nome,m.categoria,m.qtd,m.min,m.unidade,m.qtd===0?'Sem estoque':m.qtd<m.min?'Baixo':'OK'])};
  if(entity==='maquinas')  return{headers:['Modelo','Marca','BTUs','Nº Série','Patrimônio','Status','Cliente instalado'],rows:DB.maquinas.map(m=>[m.modelo,m.marca,m.btus,m.serie,m.patrimonio,m.status,m.clienteNome||'—'])};
  if(entity==='ferramentas') return{headers:['Ferramenta','Total','Disponível','Com técnico','Manutenção','Patrimônio'],rows:DB.ferramentas.map(f=>[f.nome,f.total,f.disp,f.tecnico,f.manut,f.patrimonio])};
  if(entity==='tecnicos')  return{headers:['Nome','Especialidade','Telefone','Email','Status'],rows:DB.tecnicos.map(t=>[t.nome,t.especialidade,t.tel,t.email,t.status])};
  if(entity==='clientes')  return{headers:['Nome','Tipo','CPF/CNPJ','Telefone','Email','Endereço','Equip. instalados'],rows:DB.clientes.map(c=>[c.nome,c.tipo,c.doc,c.tel,c.email,c.end,getEquipsCliente(c.id).length])};
  if(entity==='ordens')    return{headers:['Protocolo','Data','Cliente','Técnico','Descrição','Status'],rows:DB.ordens.map(o=>[o.protocolo,fmtDate(o.data),o.clienteNome||'',o.tecnicoNome||'',o.descricao||'',o.status])};
  return{headers:[],rows:[]};
}
function exportData(entity,format){
  const label={materiais:'Materiais',maquinas:'Equipamentos',ferramentas:'Ferramentas',tecnicos:'Tecnicos',clientes:'Clientes',ordens:'Ordens_Servico'}[entity]||entity;
  if(format==='xlsx') exportXLSX(entity,label);
  else if(format==='pdf') exportPDF(entity,label);
}
function exportXLSX(entity,label){
  try{const{headers,rows}=getTableData(entity);const wb=XLSX.utils.book_new();const ws=XLSX.utils.aoa_to_sheet([headers,...rows]);ws['!cols']=headers.map(()=>({wch:22}));XLSX.utils.book_append_sheet(wb,ws,label);XLSX.writeFile(wb,`HVAC_${label}_${todayStr()}.xlsx`);toast('Exportado!','success');}
  catch(e){toast('Erro ao exportar.','error');}
}
function exportPDF(entity,label){
  const{headers,rows}=getTableData(entity);const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>HVAC — ${label}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:11px;color:#111;padding:28px}
.hd{display:flex;justify-content:space-between;border-bottom:2px solid #1A56DB;padding-bottom:12px;margin-bottom:16px}
.ht{font-size:18px;font-weight:700;color:#1A56DB}.hm{font-size:10px;color:#666}h2{font-size:14px;margin-bottom:12px}
table{width:100%;border-collapse:collapse;font-size:10px}th{background:#F5F5F3;padding:7px 9px;text-align:left;font-weight:700;font-size:9px;text-transform:uppercase;color:#666;border-bottom:1px solid #E0E0E0}
td{padding:7px 9px;border-bottom:1px solid #EBEBEB;color:#111}.ft{margin-top:20px;font-size:10px;color:#999;text-align:center}
@media print{body{padding:14px}}</style></head><body>
<div class="hd"><div class="ht">HVAC Pro</div><div class="hm">Emitido em ${new Date().toLocaleString('pt-BR')}</div></div>
<h2>${label}</h2><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
<tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c??''}</td>`).join('')}</tr>`).join('')}</tbody></table>
<div class="ft">HVAC Pro · ${rows.length} registro(s)</div>
<script>window.onload=()=>{window.print()}<\/script></body></html>`);
  w.document.close();
}

/* ============================================================ TOAST */
let _tt;
function toast(msg,type=''){const t=document.getElementById('toast');t.textContent=msg;t.className=`toast ${type} show`;clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('show'),3000);}

/* ============================================================ INIT */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  // Verifica sessão existente (recarregamento de página)
  const saved = sessionStorage.getItem('hvac-user');
  if (saved) {
    try {
      usuarioLogado = JSON.parse(saved);
      document.getElementById('login-screen').classList.add('hidden');
      _atualizarSidebarUser();
    } catch(e) { sessionStorage.removeItem('hvac-user'); }
  }
  showPage('dashboard');
});


/* ============================================================
   ORDENS DE SERVIÇO
   - Materiais: baixa em TEMPO REAL ao digitar Qtd. Entregue
   - Técnico: select de DB.tecnicos
   - Cliente: select de DB.clientes (preenche dados automaticamente)
   ============================================================ */

let osEditId=null;
let osEquipRows=[];
let osMatRows=[];
let osCobreRows=[];

function abrirOSCliente(clienteId){showPage('ordens');setTimeout(()=>openNovaOS(clienteId),100);}

function gerarProtocolo(){return`HVAC-${new Date().getFullYear()}-${Math.floor(100000+Math.random()*900000)}`;}

function openNovaOS(preCliId){
  osEditId=null;osEquipRows=[];osMatRows=[];osCobreRows=[];
  document.getElementById('os-form-title').textContent='Nova Ordem de Serviço';
  const p=gerarProtocolo();_sp(p);
  document.getElementById('os-data').value=new Date().toISOString().slice(0,10);
  document.getElementById('os-hora').value=new Date().toTimeString().slice(0,5);
  document.getElementById('os-status').value='Em Aberto';
  ['os-morada','os-contacto','os-solicitante','os-email','os-descricao','os-obs-gerais'].forEach(id=>document.getElementById(id).value='');
  _popSels(preCliId||null,null);
  if(preCliId)setTimeout(()=>preencherCliente(),80);
  renderOSEquip();_addMatRow();renderOSMat();renderOSCobre();
  document.getElementById('os-lista-view').style.display='none';
  document.getElementById('os-form-view').style.display='block';
  document.querySelector('.content').scrollTop=0;
}

function _sp(p){document.getElementById('os-protocolo-display').textContent=p;document.getElementById('os-protocolo-footer').textContent=p;}

function _popSels(cliId,tecNome){
  document.getElementById('os-cliente').innerHTML='<option value="">Selecione o cliente...</option>'+
    DB.clientes.map(c=>`<option value="${c.id}" ${c.id==cliId?'selected':''}>${c.nome} (${c.tipo})</option>`).join('');
  document.getElementById('os-tecnico').innerHTML='<option value="">Selecione o técnico...</option>'+
    DB.tecnicos.filter(t=>t.status==='Ativo'||t.nome===tecNome)
      .map(t=>`<option value="${t.nome}" ${t.nome===tecNome?'selected':''}>${t.nome} — ${t.especialidade}</option>`).join('');
}

function preencherCliente(){
  const id=document.getElementById('os-cliente').value;if(!id)return;
  const c=DB.clientes.find(x=>x.id==id);if(!c)return;
  document.getElementById('os-morada').value=c.end||'';
  document.getElementById('os-contacto').value=c.tel||'';
  document.getElementById('os-email').value=c.email||'';
}

function voltarOSLista(){
  // Restaura estoque dos materiais baixados ao vivo sem ter salvo
  if(osEditId===null){
    osMatRows.forEach(r=>{
      if(!r.materialId||!(r._baixaAtual>0))return;
      const i=DB.materiais.findIndex(m=>m.id==r.materialId);
      if(i!==-1)DB.materiais[i].qtd+=r._baixaAtual;
    });
  }
  document.getElementById('os-lista-view').style.display='block';
  document.getElementById('os-form-view').style.display='none';
}

/* ---- Equipamentos da OS ---- */
function addOSEquip(data){
  osEquipRows.push(data||{maquinaId:'',modelo:'',serie:'',tipo:'Instalação',local:'',obs:''});
  renderOSEquip();
}

function renderOSEquip(){
  const tbody=document.getElementById('os-equip-body');if(!tbody)return;
  const tipoOpts=['Instalação','Manutenção','Reparação','Desmontagem','Substituição'];
  if(!osEquipRows.length){tbody.innerHTML=`<tr><td colspan="7" style="text-align:center;color:var(--text-subtle);font-size:12px;padding:14px">Nenhum equipamento adicionado. Clique em "+ Adicionar equipamento".</td></tr>`;return;}
  tbody.innerHTML=osEquipRows.map((r,i)=>`
    <tr>
      <td class="os-num-cell">${i+1}</td>
      <td style="min-width:200px">
        <select onchange="onEquipSel(${i},this)" style="width:100%">
          <option value="">— ou selecione do cadastro —</option>
          ${DB.maquinas.map(m=>`<option value="${m.id}" ${r.maquinaId==m.id?'selected':''}>${m.marca} ${m.modelo} | ${m.serie} | ${maqBadge(m.status).replace(/<[^>]+>/g,'')}</option>`).join('')}
        </select>
        <input type="text" placeholder="Modelo / Marca (se não listado)" value="${r.modelo||''}"
          style="margin-top:3px;font-size:11px;color:var(--text-muted);width:100%"
          onchange="osEquipRows[${i}].modelo=this.value">
      </td>
      <td><input type="text" placeholder="Nº de série" value="${r.serie||''}" onchange="osEquipRows[${i}].serie=this.value"></td>
      <td>
        <select onchange="osEquipRows[${i}].tipo=this.value">
          ${tipoOpts.map(t=>`<option ${r.tipo===t?'selected':''}>${t}</option>`).join('')}
        </select>
      </td>
      <td><input type="text" placeholder="Ex: Sala, 2º andar" value="${r.local||''}" onchange="osEquipRows[${i}].local=this.value"></td>
      <td><input type="text" placeholder="Obs." value="${r.obs||''}" onchange="osEquipRows[${i}].obs=this.value"></td>
      <td class="os-del-cell no-print">
        <button onclick="osEquipRows.splice(${i},1);renderOSEquip()" title="Remover">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </td>
    </tr>`).join('');
}

function onEquipSel(i,sel){
  const maq=DB.maquinas.find(m=>m.id==sel.value);
  if(!maq){osEquipRows[i].maquinaId='';return;}
  osEquipRows[i].maquinaId=maq.id;
  osEquipRows[i].modelo=`${maq.marca} ${maq.modelo}`;
  osEquipRows[i].serie=maq.serie;
  renderOSEquip();
}

/* ---- Materiais com baixa em tempo real ---- */
function _addMatRow(data){osMatRows.push(data||{materialId:'',nome:'',unidade:'',qtdSol:0,qtdEnt:0,_baixaAtual:0,obs:'',checked:false});}
function addOSMaterial(){_addMatRow();renderOSMat();}

function renderOSMat(){
  const tbody=document.getElementById('os-mat-body');if(!tbody)return;
  tbody.innerHTML=osMatRows.map((r,i)=>{
    const mat=r.materialId?DB.materiais.find(m=>m.id==r.materialId):null;
    const estoq=mat?mat.qtd:null;const semEst=mat&&mat.qtd===0;const baixoEst=mat&&mat.qtd>0&&mat.qtd<mat.min;
    return`<tr class="${semEst?'os-row-danger':baixoEst?'os-row-warning':''}">
      <td class="os-check-cell" onclick="toggleOSCheck(${i})">${r.checked?'✓':'☐'}</td>
      <td style="min-width:200px">
        <select onchange="onMatSel(${i},this)" style="width:100%">
          <option value="">— selecione o material —</option>
          ${DB.materiais.map(m=>{const st=m.qtd===0?'⚠ sem estoque':m.qtd<m.min?`↓ baixo (${m.qtd})`:m.qtd+' '+m.unidade;return`<option value="${m.id}" ${r.materialId==m.id?'selected':''}>${m.nome} | ${st}</option>`;}).join('')}
        </select>
      </td>
      <td><input type="text" value="${r.nome||''}" placeholder="Descrição" onchange="osMatRows[${i}].nome=this.value"></td>
      <td><input type="text" value="${r.unidade||''}" placeholder="Un." style="text-align:center;width:48px" onchange="osMatRows[${i}].unidade=this.value"></td>
      <td><input type="number" value="${r.qtdSol||''}" placeholder="0" min="0" style="text-align:center;width:60px" onchange="osMatRows[${i}].qtdSol=parseFloat(this.value)||0"></td>
      <td><input type="number" value="${r.qtdEnt||''}" placeholder="0" min="0" step="any" style="text-align:center;width:60px" oninput="onQtdEnt(${i},this)"></td>
      <td>${estoq!==null?`<span class="os-stock-tag ${semEst?'danger':baixoEst?'warning':'ok'}" id="stk-${i}">${estoq} ${mat.unidade}</span>`:`<span style="color:var(--text-subtle);font-size:11px" id="stk-${i}">—</span>`}</td>
      <td><input type="text" value="${r.obs||''}" placeholder="Obs." onchange="osMatRows[${i}].obs=this.value"></td>
      <td class="os-del-cell no-print"><button onclick="remMatRow(${i})" title="Remover"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></td>
    </tr>`;
  }).join('');
}

/* Baixa em tempo real: diff entre novo e baixa anterior já feita */
function onQtdEnt(i,input){
  const nova=parseFloat(input.value)||0;
  const diff=nova-(osMatRows[i]._baixaAtual||0);
  const matId=osMatRows[i].materialId;
  if(matId&&diff!==0){
    const idx=DB.materiais.findIndex(m=>m.id==matId);
    if(idx!==-1){
      DB.materiais[idx].qtd=Math.max(0,DB.materiais[idx].qtd-diff);
      // Atualiza célula de estoque ao vivo
      const mat=DB.materiais[idx];const semEst=mat.qtd===0;const baixoEst=mat.qtd>0&&mat.qtd<mat.min;
      const stk=document.getElementById(`stk-${i}`);
      if(stk){stk.textContent=`${mat.qtd} ${mat.unidade}`;stk.className=`os-stock-tag ${semEst?'danger':baixoEst?'warning':'ok'}`;}
      const tr=input.closest('tr');if(tr)tr.className=semEst?'os-row-danger':baixoEst?'os-row-warning':'';
      // Badge no topo
      const lo=DB.materiais.filter(m=>m.qtd>0&&m.qtd<m.min).length;const ot=DB.materiais.filter(m=>m.qtd===0).length;
      document.getElementById('alertDot')?.classList.toggle('visible',lo+ot>0);
    }
  }
  osMatRows[i].qtdEnt=nova;osMatRows[i]._baixaAtual=nova;
}

function onMatSel(i,sel){
  // Restaura baixa anterior ao trocar material
  if(osMatRows[i].materialId&&osMatRows[i]._baixaAtual>0){
    const pi=DB.materiais.findIndex(m=>m.id==osMatRows[i].materialId);
    if(pi!==-1)DB.materiais[pi].qtd+=osMatRows[i]._baixaAtual;
  }
  const mat=DB.materiais.find(m=>m.id==sel.value);
  if(!mat){osMatRows[i].materialId='';osMatRows[i]._baixaAtual=0;renderOSMat();return;}
  osMatRows[i].materialId=mat.id;osMatRows[i].nome=mat.nome;osMatRows[i].unidade=mat.unidade;
  osMatRows[i].qtdEnt=0;osMatRows[i]._baixaAtual=0;
  renderOSMat();
}

function toggleOSCheck(i){osMatRows[i].checked=!osMatRows[i].checked;renderOSMat();}

function remMatRow(i){
  // Devolve baixa ao remover a linha
  const r=osMatRows[i];
  if(r.materialId&&r._baixaAtual>0){const idx=DB.materiais.findIndex(m=>m.id==r.materialId);if(idx!==-1)DB.materiais[idx].qtd+=r._baixaAtual;}
  osMatRows.splice(i,1);renderOSMat();
}

/* ---- Tubos de cobre ---- */
function _addCobreRow(d){osCobreRows.push(d||{diametro:'',tipo:'',comprimento:'',qtdSol:'',qtdEnt:'',obs:''});}
function addOSCobre(){_addCobreRow();renderOSCobre();}
function renderOSCobre(){
  const tbody=document.getElementById('os-cobre-body');if(!tbody)return;
  const diams=['1/4"','3/8"','1/2"','5/8"','3/4"','7/8"','1"','1-1/8"'];const ligas=['Cobre L','Cobre K','Cobre M','Cobre ACR'];
  tbody.innerHTML=osCobreRows.map((r,i)=>`<tr>
    <td><select onchange="osCobreRows[${i}].diametro=this.value" style="width:100%"><option value="">...</option>${diams.map(d=>`<option ${r.diametro===d?'selected':''}>${d}</option>`).join('')}</select></td>
    <td><select onchange="osCobreRows[${i}].tipo=this.value" style="width:100%"><option value="">...</option>${ligas.map(l=>`<option ${r.tipo===l?'selected':''}>${l}</option>`).join('')}</select></td>
    <td><input type="number" value="${r.comprimento||''}" placeholder="0.0" min="0" step="0.1" onchange="osCobreRows[${i}].comprimento=this.value" style="text-align:center;width:80px"></td>
    <td><input type="number" value="${r.qtdSol||''}" placeholder="0" min="0" onchange="osCobreRows[${i}].qtdSol=this.value" style="text-align:center;width:64px"></td>
    <td><input type="number" value="${r.qtdEnt||''}" placeholder="0" min="0" onchange="osCobreRows[${i}].qtdEnt=this.value" style="text-align:center;width:64px"></td>
    <td><input type="text" value="${r.obs||''}" placeholder="Obs." onchange="osCobreRows[${i}].obs=this.value"></td>
    <td class="os-del-cell no-print"><button onclick="osCobreRows.splice(${i},1);renderOSCobre()" title="Remover"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></td>
  </tr>`).join('');
}

function removeOSRow(type,i){if(type==='mat')remMatRow(i);else if(type==='cobre'){osCobreRows.splice(i,1);renderOSCobre();}}

/* ---- Salvar OS ---- */
function salvarOS(){
  const cliSel=document.getElementById('os-cliente');
  const cliId=cliSel?.value;const cliNome=cliSel?.selectedOptions[0]?.text.split(' (')[0]||'';
  if(!cliId)return toast('Selecione o cliente.','error');
  if(!document.getElementById('os-data').value)return toast('Informe a data.','error');

  // Coleta equipamentos
  const equipamentos=osEquipRows.filter(e=>e.modelo||e.serie).map(e=>({...e}));

  const matTrs=document.querySelectorAll('#os-mat-body tr');
  const materiais=Array.from(matTrs).map((tr,i)=>{
    const sel=tr.querySelector('select');const inputs=tr.querySelectorAll('input');
    const checked=tr.querySelector('.os-check-cell')?.textContent.trim()==='✓';
    return{materialId:sel?.value||'',nome:inputs[0]?.value||'',unidade:inputs[1]?.value||'',
      qtdSol:parseFloat(inputs[2]?.value)||0,qtdEnt:parseFloat(inputs[3]?.value)||0,obs:inputs[4]?.value||'',checked};
  });

  const cobreTrs=document.querySelectorAll('#os-cobre-body tr');
  const cobres=Array.from(cobreTrs).map(tr=>{
    const sels=tr.querySelectorAll('select');const inputs=tr.querySelectorAll('input');
    return{diametro:sels[0]?.value||'',tipo:sels[1]?.value||'',comprimento:inputs[0]?.value||'',qtdSol:inputs[1]?.value||'',qtdEnt:inputs[2]?.value||'',obs:inputs[3]?.value||''};
  });

  const dados={
    protocolo:document.getElementById('os-protocolo-display').textContent,
    data:document.getElementById('os-data').value,hora:document.getElementById('os-hora').value,
    status:document.getElementById('os-status').value,
    clienteId:cliId,clienteNome:cliNome,
    morada:document.getElementById('os-morada').value,contacto:document.getElementById('os-contacto').value,
    solicitante:document.getElementById('os-solicitante').value,email:document.getElementById('os-email').value,
    tecnicoNome:document.getElementById('os-tecnico').value,descricao:document.getElementById('os-descricao').value,
    obsGerais:document.getElementById('os-obs-gerais').value,
    materiais,cobres,equipamentos
  };

  // Registra movimentações (a baixa já foi feita ao vivo, só registra no histórico)
  materiais.filter(m=>m.qtdEnt>0&&m.nome).forEach(m=>{
    DB.movimentacoes.unshift({tipo:'out',desc:`${m.nome} — OS ${dados.protocolo}`,qty:`-${m.qtdEnt} ${m.unidade}`,time:horaAgora()});
  });
  if(DB.movimentacoes.length>50)DB.movimentacoes=DB.movimentacoes.slice(0,50);

  if(osEditId!==null){const i=DB.ordens.findIndex(o=>o.id===osEditId);DB.ordens[i]={...DB.ordens[i],...dados};toast('OS atualizada!','success');}
  else{DB.ordens.unshift({id:DB.nextId.ordens++,...dados});toast('OS criada!','success');}

  // Zera _baixaAtual pois já consolidado
  osMatRows.forEach(r=>r._baixaAtual=0);
  document.getElementById('os-lista-view').style.display='block';
  document.getElementById('os-form-view').style.display='none';
  renderOSLista();
}

/* ---- Editar OS ---- */
function editOS(id){
  const os=DB.ordens.find(o=>o.id===id);if(!os)return;
  osEditId=id;
  // Restaura estoque dos materiais salvos (vai ser re-baixado ao carregar via oninput)
  (os.materiais||[]).forEach(m=>{
    if(!m.materialId||!(m.qtdEnt>0))return;
    const i=DB.materiais.findIndex(x=>x.id==m.materialId);if(i!==-1)DB.materiais[i].qtd+=m.qtdEnt;
  });
  document.getElementById('os-form-title').textContent=`Editar OS — ${os.protocolo}`;
  _sp(os.protocolo);
  document.getElementById('os-data').value=os.data||'';document.getElementById('os-hora').value=os.hora||'';
  document.getElementById('os-status').value=os.status||'Em Aberto';
  document.getElementById('os-morada').value=os.morada||'';document.getElementById('os-contacto').value=os.contacto||'';
  document.getElementById('os-solicitante').value=os.solicitante||'';document.getElementById('os-email').value=os.email||'';
  document.getElementById('os-descricao').value=os.descricao||'';document.getElementById('os-obs-gerais').value=os.obsGerais||'';
  _popSels(os.clienteId,os.tecnicoNome);
  // Carrega materiais com _baixaAtual=0 (estoque foi restaurado, usuário re-digita)
  osEquipRows=(os.equipamentos||[]).map(e=>({...e}));
  osMatRows=(os.materiais||[]).map(m=>({...m,_baixaAtual:0,qtdEnt:0}));
  osCobreRows=(os.cobres||[]).map(c=>({...c}));
  renderOSEquip();renderOSMat();renderOSCobre();
  document.getElementById('os-lista-view').style.display='none';
  document.getElementById('os-form-view').style.display='block';
  document.querySelector('.content').scrollTop=0;
}

/* ---- Lista OS ---- */
function renderOSLista(){
  const tbody=document.getElementById('tbody-ordens');const empty=document.getElementById('empty-ordens');if(!tbody)return;
  const bar=document.querySelector('#page-ordens .filter-bar');
  const q=bar?.querySelector('.filter-input')?.value.toLowerCase()||'';
  const st=bar?.querySelector('.filter-select')?.value||'';
  const sc={'Em Aberto':'os-status-aberto','Em Andamento':'os-status-andamento','Concluída':'os-status-concluida','Cancelada':'os-status-cancelada'};
  const data=DB.ordens.filter(o=>(!q||o.protocolo.toLowerCase().includes(q)||(o.clienteNome||'').toLowerCase().includes(q)||(o.tecnicoNome||'').toLowerCase().includes(q))&&(!st||o.status===st));
  empty.style.display=data.length===0?'block':'none';
  tbody.innerHTML=data.map(o=>`<tr>
    <td class="mono" style="font-weight:600;color:var(--accent)">${o.protocolo}</td>
    <td>${fmtDate(o.data)}</td><td><strong>${o.clienteNome||'—'}</strong></td>
    <td>${o.tecnicoNome||'<span style="color:var(--text-subtle)">—</span>'}</td>
    <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-muted)">${o.descricao||'—'}</td>
    <td><span class="badge ${sc[o.status]||'badge-gray'}">${o.status}</span></td>
    <td><div class="row-actions">
      <button class="btn-icon" onclick="editOS(${o.id})" title="Editar"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      <button class="btn-icon" onclick="imprimirOSById(${o.id})" title="Imprimir / PDF"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="6" y="14" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
      <button class="btn-icon danger" onclick="confirmDeleteOS(${o.id})" title="Excluir"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
    </div></td>
  </tr>`).join('');
  document.getElementById('ordensCount').textContent=`${DB.ordens.length} OS`;
}

function confirmDeleteOS(id){
  document.getElementById('delete-msg').textContent='Excluir esta OS? O estoque NÃO será restaurado automaticamente.';
  document.getElementById('delete-confirm-btn').onclick=()=>{DB.ordens=DB.ordens.filter(o=>o.id!==id);closeModal('modal-delete');renderOSLista();toast('OS excluída.','success');};
  openModal('modal-delete');
}

/* ---- Imprimir OS ---- */
function imprimirOS(){imprimirOSById(null,true);}
function imprimirOSById(id,fromForm){
  let os;
  if(fromForm){
    const cliSel=document.getElementById('os-cliente');
    const matTrs=document.querySelectorAll('#os-mat-body tr');
    const mat=Array.from(matTrs).map(tr=>{const inputs=tr.querySelectorAll('input');return{nome:inputs[0]?.value||'',unidade:inputs[1]?.value||'',qtdSol:inputs[2]?.value||'',qtdEnt:inputs[3]?.value||'',obs:inputs[4]?.value||'',checked:tr.querySelector('.os-check-cell')?.textContent.trim()==='✓'};});
    const cobreTrs=document.querySelectorAll('#os-cobre-body tr');
    const cob=Array.from(cobreTrs).map(tr=>{const sels=tr.querySelectorAll('select');const inputs=tr.querySelectorAll('input');return{diametro:sels[0]?.value||'',tipo:sels[1]?.value||'',comprimento:inputs[0]?.value||'',qtdSol:inputs[1]?.value||'',qtdEnt:inputs[2]?.value||''};});
    os={protocolo:document.getElementById('os-protocolo-display').textContent,data:document.getElementById('os-data').value,hora:document.getElementById('os-hora').value,status:document.getElementById('os-status').value,clienteNome:cliSel?.selectedOptions[0]?.text.split(' (')[0]||'',morada:document.getElementById('os-morada').value,contacto:document.getElementById('os-contacto').value,solicitante:document.getElementById('os-solicitante').value,email:document.getElementById('os-email').value,tecnicoNome:document.getElementById('os-tecnico').value,descricao:document.getElementById('os-descricao').value,obsGerais:document.getElementById('os-obs-gerais').value,materiais:mat,cobres:cob};
  }else{os=DB.ordens.find(o=>o.id===id);}
  if(!os)return;
  const sc={'Em Aberto':['#DBEAFE','#1E40AF'],'Em Andamento':['#FEF3C7','#92400E'],'Concluída':['#DCFCE7','#166534'],'Cancelada':['#FEE2E2','#991B1B']};
  const[sBg,sTx]=(sc[os.status]||['#F1EFE8','#5F5E5A']);
  const matR=(os.materiais||[]).filter(m=>m.nome).map(m=>`<tr><td style="text-align:center">${m.checked?'✓':'☐'}</td><td>${m.nome}</td><td style="text-align:center">${m.unidade||''}</td><td style="text-align:center">${m.qtdSol||''}</td><td style="text-align:center">${m.qtdEnt||''}</td><td>${m.obs||''}</td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;color:#aaa;font-style:italic">Nenhum material</td></tr>';
  const cobR=(os.cobres||[]).filter(c=>c.diametro).map(c=>`<tr><td>${c.diametro}</td><td>${c.tipo||''}</td><td style="text-align:center">${c.comprimento||''}m</td><td style="text-align:center">${c.qtdSol||''}</td><td style="text-align:center">${c.qtdEnt||''}</td></tr>`).join('');
  const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>OS ${os.protocolo}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:11px;color:#111;padding:22px}
.hd{display:grid;grid-template-columns:180px 1fr 190px;border-bottom:3px solid #1A56DB;background:#F9F9F8}
.la{display:flex;align-items:center;gap:10px;padding:13px 15px;border-right:1px solid #ddd}
.li{width:40px;height:40px;background:#1A56DB;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:17px;font-weight:700;flex-shrink:0}
.cn{font-size:14px;font-weight:700}.cs{font-size:10px;color:#666}
.ta{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:13px 15px;border-right:1px solid #ddd}
.dt{font-size:13px;font-weight:700;color:#1A56DB;text-align:center}
.pr{margin-top:5px;font-size:11px;font-weight:600;font-family:monospace;color:#555;background:#EEF2FF;padding:2px 9px;border-radius:100px}
.mt{padding:10px 13px;display:flex;flex-direction:column;gap:5px}
.ml{font-size:8px;font-weight:700;text-transform:uppercase;color:#999;letter-spacing:.08em}
.mv{font-size:11px;font-weight:600;color:#111;margin-top:1px}
.sb{display:inline-block;padding:2px 9px;border-radius:100px;font-size:10px;font-weight:700;background:${sBg};color:${sTx}}
.sc{border-bottom:1px solid #E0E0E0}.st{font-size:9px;font-weight:700;text-transform:uppercase;color:#fff;background:#1A56DB;padding:5px 13px}
.fi{padding:9px 13px;display:flex;flex-direction:column;gap:6px}.fr{display:flex;align-items:baseline;gap:7px;flex-wrap:wrap}
.fl{font-size:10px;font-weight:700;color:#666;min-width:68px;flex-shrink:0}.fv{font-size:11px;color:#111;border-bottom:1px solid #E0E0E0;flex:1;padding-bottom:2px;min-width:70px}
table{width:100%;border-collapse:collapse;font-size:10px}th{background:#F5F5F3;padding:6px 8px;text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;color:#666;border-bottom:1px solid #E0E0E0;white-space:nowrap}
td{padding:6px 8px;border-bottom:1px solid #EBEBEB;color:#111}.obs{padding:9px 13px;min-height:40px;font-size:11px}
.as{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #E0E0E0;background:#F9F9F8;margin-top:6px}
.ab{padding:38px 18px 13px;border-right:1px solid #E0E0E0;display:flex;flex-direction:column;align-items:center;gap:6px}
.ab:last-child{border-right:none}.al{width:100%;border-top:1px solid #333}.an{font-size:10px;color:#666;text-align:center}
.ft{background:#F5F5F3;border-top:1px solid #E0E0E0;padding:6px 13px;font-size:10px;color:#999;text-align:center;font-family:monospace}
@media print{body{padding:12px}@page{margin:8mm}}</style>
</head><body>
<div class="hd">
  <div class="la"><div class="li">H</div><div><div class="cn">HVAC Pro</div><div class="cs">Ar Condicionado</div></div></div>
  <div class="ta"><div class="dt">ORDEM DE SERVIÇO — SAÍDA DE MATERIAL</div><div class="pr">${os.protocolo}</div></div>
  <div class="mt"><div><div class="ml">Data / Hora</div><div class="mv">${fmtDate(os.data)} às ${os.hora||'—'}</div></div>
    <div style="margin-top:4px"><div class="ml">Status</div><div style="margin-top:2px"><span class="sb">${os.status}</span></div></div></div>
</div>
<div class="sc"><div class="st">DADOS DO CLIENTE / SOLICITANTE</div><div class="fi">
  <div class="fr"><span class="fl">Cliente:</span><span class="fv">${os.clienteNome||'—'}</span><span class="fl" style="margin-left:12px">Técnico:</span><span class="fv">${os.tecnicoNome||'—'}</span></div>
  <div class="fr"><span class="fl">Morada:</span><span class="fv">${os.morada||'—'}</span><span class="fl" style="margin-left:12px">Contacto:</span><span class="fv">${os.contacto||'—'}</span></div>
  <div class="fr"><span class="fl">Solicitante:</span><span class="fv">${os.solicitante||'—'}</span><span class="fl" style="margin-left:12px">E-mail:</span><span class="fv">${os.email||'—'}</span></div>
  <div class="fr"><span class="fl">Serviço:</span><span class="fv">${os.descricao||'—'}</span></div>
</div></div>
<div class="sc"><div class="st">MATERIAIS — SAÍDA DE ARMAZÉM</div>
<table><thead><tr><th>✓</th><th>Descrição</th><th>Un.</th><th>Qtd. Sol.</th><th>Qtd. Ent.</th><th>Obs.</th></tr></thead>
<tbody>${matR}</tbody></table></div>
${cobR?`<div class="sc"><div class="st">TUBOS DE COBRE</div><table><thead><tr><th>Diâmetro</th><th>Tipo</th><th>Comprimento</th><th>Qtd. Sol.</th><th>Qtd. Ent.</th></tr></thead><tbody>${cobR}</tbody></table></div>`:''}
<div class="sc"><div class="st">OBSERVAÇÕES GERAIS</div><div class="obs">${os.obsGerais||'—'}</div></div>
<div class="as">
  <div class="ab"><div class="al"></div><div class="an">Assinatura Solicitante</div></div>
  <div class="ab"><div class="al"></div><div class="an">Assinatura Resp. Armazém</div></div>
  <div class="ab"><div class="al"></div><div class="an">Assinatura Técnico</div></div>
</div>
<div class="ft">HVAC Pro — Protocolo: ${os.protocolo} · ${new Date().toLocaleString('pt-BR')}</div>
<script>window.onload=()=>{window.print()}<\/script></body></html>`);
  w.document.close();
}

/* ---- Compatibility stubs (old modal references) ---- */
function saveAlocacao() { toast('Use o botão "Alocar equipamento" na aba Clientes.', ''); }
function addClienteEquip() {}
function removeClienteEquip() {}
function renderClienteEquips() {}
function openModalNew(id) { openModal(id); }

/* ============================================================
   GESTÃO DE USUÁRIOS (Admin only)
   ============================================================ */

// Banco de usuários — persiste em memória (mesmo session do DB)
DB.usuarios = [
  {
    id: 1, nome: 'Administrador', login: 'admin', senha: 'admin123',
    perfil: 'Admin', email: 'admin@hvacpro.com', tel: '',
    status: 'Ativo', obs: '', initials: 'AD',
    ultimoAcesso: new Date().toISOString(),
    permissoes: ['dashboard','agenda','materiais','maquinas','ferramentas','tecnicos','clientes','alocacoes','ordens','usuarios']
  },
  {
    id: 2, nome: 'Carlos Mendes', login: 'tecnico', senha: 'tec123',
    perfil: 'Técnico', email: 'carlos@hvacpro.com', tel: '(11) 98765-0001',
    status: 'Ativo', obs: 'Técnico de instalação residencial', initials: 'CM',
    ultimoAcesso: null,
    permissoes: ['dashboard','agenda','ordens','clientes']
  },
];
DB.nextId.usuarios = 3;

// Permissões por perfil (preset)
const PERFIL_PERMISSOES = {
  'Admin':       ['dashboard','agenda','materiais','maquinas','ferramentas','tecnicos','clientes','alocacoes','ordens','usuarios'],
  'Gestor':      ['dashboard','agenda','materiais','maquinas','ferramentas','tecnicos','clientes','alocacoes','ordens'],
  'Técnico':     ['dashboard','agenda','ordens','clientes','materiais'],
  'Visualizador':['dashboard','agenda'],
};

const MODULOS = [
  { id:'dashboard',  label:'Dashboard' },
  { id:'agenda',     label:'Agenda' },
  { id:'materiais',  label:'Materiais' },
  { id:'maquinas',   label:'Equipamentos' },
  { id:'ferramentas',label:'Ferramentas' },
  { id:'tecnicos',   label:'Técnicos' },
  { id:'clientes',   label:'Clientes' },
  { id:'alocacoes',  label:'Alocações' },
  { id:'ordens',     label:'Ordens de Serviço' },
  { id:'usuarios',   label:'Usuários (Admin)' },
];

let _permSelecionadas = [];

/* ---------- Visibilidade: só admin vê o menu Usuários ---------- */
function _aplicarVisibilidadeAdmin() {
  const isAdmin = usuarioLogado?.perfil === 'Admin';
  document.querySelectorAll('.nav-admin-only').forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });
}

/* ---------- Abrir modal novo usuário ---------- */
function openModalNovoUsuario() {
  document.getElementById('modal-usuario-title').textContent = 'Novo Usuário';
  document.getElementById('usr-id').value     = '';
  document.getElementById('usr-nome').value   = '';
  document.getElementById('usr-login').value  = '';
  document.getElementById('usr-email').value  = '';
  document.getElementById('usr-tel').value    = '';
  document.getElementById('usr-senha').value  = '';
  document.getElementById('usr-senha2').value = '';
  document.getElementById('usr-obs').value    = '';
  document.getElementById('usr-perfil').value = 'Técnico';
  document.getElementById('usr-status').value = 'Ativo';
  document.getElementById('usr-senha-label').textContent = 'Senha *';
  document.getElementById('usr-avatar-preview').textContent = '?';
  document.getElementById('usr-pwd-match').style.display = 'none';
  _permSelecionadas = [...PERFIL_PERMISSOES['Técnico']];
  _renderPermGrid();
  openModal('modal-usuario');
}

/* ---------- Editar usuário ---------- */
function editUsuario(id) {
  const u = DB.usuarios.find(x => x.id === id);
  if (!u) return;
  document.getElementById('modal-usuario-title').textContent = 'Editar Usuário';
  document.getElementById('usr-id').value     = id;
  document.getElementById('usr-nome').value   = u.nome;
  document.getElementById('usr-login').value  = u.login;
  document.getElementById('usr-email').value  = u.email || '';
  document.getElementById('usr-tel').value    = u.tel || '';
  document.getElementById('usr-senha').value  = '';
  document.getElementById('usr-senha2').value = '';
  document.getElementById('usr-obs').value    = u.obs || '';
  document.getElementById('usr-perfil').value = u.perfil;
  document.getElementById('usr-status').value = u.status;
  document.getElementById('usr-senha-label').textContent = 'Nova senha (deixe em branco para manter)';
  document.getElementById('usr-avatar-preview').textContent = u.initials;
  document.getElementById('usr-pwd-match').style.display = 'none';
  _permSelecionadas = [...(u.permissoes || [])];
  _renderPermGrid();
  openModal('modal-usuario');
}

/* ---------- Grid de permissões ---------- */
function _renderPermGrid() {
  const perfil = document.getElementById('usr-perfil')?.value || 'Técnico';
  document.getElementById('perm-grid').innerHTML = MODULOS.map(m => {
    const ativo = _permSelecionadas.includes(m.id);
    return `
      <div class="perm-item ${ativo ? 'active' : ''}" onclick="togglePerm('${m.id}',this)">
        <div class="perm-check">
          ${ativo ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        </div>
        <span>${m.label}</span>
      </div>`;
  }).join('');
}

function togglePerm(modId, el) {
  if (_permSelecionadas.includes(modId)) {
    _permSelecionadas = _permSelecionadas.filter(p => p !== modId);
    el.classList.remove('active');
    el.querySelector('.perm-check').innerHTML = '';
  } else {
    _permSelecionadas.push(modId);
    el.classList.add('active');
    el.querySelector('.perm-check').innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
}

// Ao mudar o perfil, atualiza permissões preset
document.addEventListener('change', e => {
  if (e.target.id === 'usr-perfil') {
    _permSelecionadas = [...(PERFIL_PERMISSOES[e.target.value] || [])];
    _renderPermGrid();
  }
});

function atualizarPreviewAvatar() {
  const nome = document.getElementById('usr-nome').value.trim();
  const inits = nome.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('') || '?';
  document.getElementById('usr-avatar-preview').textContent = inits;
}

function togglePwd(inputId, btn) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* ---------- Salvar usuário ---------- */
function salvarUsuario() {
  const id     = document.getElementById('usr-id').value;
  const nome   = document.getElementById('usr-nome').value.trim();
  const login  = document.getElementById('usr-login').value.trim().toLowerCase();
  const email  = document.getElementById('usr-email').value.trim();
  const tel    = document.getElementById('usr-tel').value.trim();
  const perfil = document.getElementById('usr-perfil').value;
  const status = document.getElementById('usr-status').value;
  const obs    = document.getElementById('usr-obs').value.trim();
  const senha1 = document.getElementById('usr-senha').value;
  const senha2 = document.getElementById('usr-senha2').value;

  if (!nome)  return toast('Informe o nome completo.', 'error');
  if (!login) return toast('Informe o login.', 'error');

  // Valida login único
  const dupLogin = DB.usuarios.find(u => u.login === login && u.id != id);
  if (dupLogin) return toast('Este login já está em uso.', 'error');

  // Valida senha
  if (!id && !senha1) return toast('Defina uma senha para o novo usuário.', 'error');
  if (senha1 && senha1.length < 6) return toast('A senha deve ter no mínimo 6 caracteres.', 'error');
  if (senha1 && senha1 !== senha2) {
    document.getElementById('usr-pwd-match').style.display = 'block';
    document.getElementById('usr-pwd-match').textContent = '⚠ As senhas não coincidem.';
    document.getElementById('usr-pwd-match').style.color = 'var(--danger)';
    return;
  }

  const initials = nome.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('');
  const permissoes = _permSelecionadas.length ? _permSelecionadas : PERFIL_PERMISSOES[perfil];

  if (id) {
    const idx = DB.usuarios.findIndex(u => u.id == id);
    DB.usuarios[idx] = {
      ...DB.usuarios[idx], nome, login, email, tel, perfil, status, obs, initials, permissoes,
      ...(senha1 ? { senha: senha1 } : {})
    };
    // Atualiza sessão se o utilizador editado for o logado
    if (usuarioLogado && usuarioLogado.login === DB.usuarios[idx].login) {
      usuarioLogado = { ...DB.usuarios[idx] };
      sessionStorage.setItem('hvac-user', JSON.stringify(usuarioLogado));
      _atualizarSidebarUser();
    }
    // Sincroniza array USUARIOS para login funcionar
    _sincronizarUSUARIOS();
    toast('Usuário atualizado!', 'success');
  } else {
    const novo = { id: DB.nextId.usuarios++, nome, login, email, tel, perfil, status, obs,
      senha: senha1, initials, permissoes, ultimoAcesso: null };
    DB.usuarios.push(novo);
    _sincronizarUSUARIOS();
    toast('Usuário cadastrado!', 'success');
  }

  closeModal('modal-usuario');
  renderUsuarios();
}

/* Sincroniza DB.usuarios → USUARIOS (array usado pelo login) */
function _sincronizarUSUARIOS() {
  USUARIOS.length = 0;
  DB.usuarios.forEach(u => {
    USUARIOS.push({ usuario: u.login, senha: u.senha, nome: u.nome, perfil: u.perfil, initials: u.initials, status: u.status });
  });
}

/* ---------- Inativar / Ativar rápido ---------- */
function toggleStatusUsuario(id) {
  const idx = DB.usuarios.findIndex(u => u.id === id);
  if (idx === -1) return;
  const u = DB.usuarios[idx];
  if (u.login === 'admin') return toast('O admin não pode ser inativado.', 'error');
  if (usuarioLogado?.login === u.login) return toast('Não pode inativar o próprio usuário.', 'error');
  DB.usuarios[idx].status = u.status === 'Ativo' ? 'Inativo' : 'Ativo';
  _sincronizarUSUARIOS();
  renderUsuarios();
  toast(`Usuário ${DB.usuarios[idx].status === 'Ativo' ? 'ativado' : 'inativado'}.`, 'success');
}

/* ---------- Modal trocar senha ---------- */
function abrirTrocarSenha(id) {
  const u = DB.usuarios.find(x => x.id === id);
  if (!u) return;
  document.getElementById('troca-usr-id').value  = id;
  document.getElementById('troca-usr-nome').textContent = u.nome;
  document.getElementById('troca-senha1').value  = '';
  document.getElementById('troca-senha2').value  = '';
  document.getElementById('troca-match').style.display = 'none';
  openModal('modal-trocar-senha');
}

function salvarTrocaSenha() {
  const id     = document.getElementById('troca-usr-id').value;
  const senha1 = document.getElementById('troca-senha1').value;
  const senha2 = document.getElementById('troca-senha2').value;
  const matchEl = document.getElementById('troca-match');

  if (!senha1 || senha1.length < 6) return toast('Senha deve ter mínimo 6 caracteres.', 'error');
  if (senha1 !== senha2) {
    matchEl.style.display = 'block';
    matchEl.textContent = '⚠ As senhas não coincidem.';
    matchEl.style.color = 'var(--danger)';
    return;
  }
  const idx = DB.usuarios.findIndex(u => u.id == id);
  if (idx === -1) return;
  DB.usuarios[idx].senha = senha1;
  _sincronizarUSUARIOS();
  closeModal('modal-trocar-senha');
  toast('Senha alterada com sucesso!', 'success');
}

/* ---------- Excluir usuário ---------- */
function confirmarExcluirUsuario(id) {
  const u = DB.usuarios.find(x => x.id === id);
  if (!u) return;
  if (u.login === 'admin') return toast('O admin padrão não pode ser excluído.', 'error');
  if (usuarioLogado?.login === u.login) return toast('Não pode excluir o próprio usuário.', 'error');
  document.getElementById('delete-msg').textContent = `Excluir o utilizador "${u.nome}"? Esta ação não pode ser desfeita.`;
  document.getElementById('delete-confirm-btn').onclick = () => {
    DB.usuarios = DB.usuarios.filter(x => x.id !== id);
    _sincronizarUSUARIOS();
    closeModal('modal-delete');
    renderUsuarios();
    toast('Usuário excluído.', 'success');
  };
  openModal('modal-delete');
}

/* ---------- Render da tabela ---------- */
function renderUsuarios() {
  const tbody = document.getElementById('tbody-usuarios');
  const empty = document.getElementById('empty-usuarios');
  if (!tbody) return;

  const bar = document.querySelector('#page-usuarios .filter-bar');
  const q   = bar?.querySelector('.filter-input')?.value.toLowerCase() || '';
  const pf  = bar?.querySelectorAll('.filter-select')[0]?.value || '';
  const st  = bar?.querySelectorAll('.filter-select')[1]?.value || '';

  const perfilClass = { Admin:'perfil-admin', Gestor:'perfil-gestor', Técnico:'perfil-tecnico', Visualizador:'perfil-visualizador' };

  const data = DB.usuarios.filter(u =>
    (!q || u.nome.toLowerCase().includes(q) || u.login.toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q))
    && (!pf || u.perfil === pf)
    && (!st || u.status === st)
  );

  empty.style.display = data.length === 0 ? 'block' : 'none';

  tbody.innerHTML = data.map(u => `
    <tr class="${u.status === 'Inativo' ? 'row-inativo' : ''}">
      <td>
        <div class="tech-cell">
          <div class="tech-avatar" style="${u.status==='Inativo'?'opacity:.5':''}">${u.initials}</div>
          <div>
            <div style="font-weight:500">${u.nome}</div>
            ${u.tel ? `<div style="font-size:11px;color:var(--text-muted)">${u.tel}</div>` : ''}
          </div>
        </div>
      </td>
      <td class="mono">${u.login}</td>
      <td><span class="perfil-badge ${perfilClass[u.perfil]||''}">${u.perfil}</span></td>
      <td style="color:var(--text-muted);font-size:12px">${u.email || '—'}</td>
      <td style="font-size:12px;color:var(--text-muted)">${u.ultimoAcesso ? new Date(u.ultimoAcesso).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'}</td>
      <td><span class="badge ${u.status==='Ativo'?'badge-ok':'badge-gray'}">${u.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="btn-icon" onclick="editUsuario(${u.id})" title="Editar usuário">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <button class="btn-icon" onclick="abrirTrocarSenha(${u.id})" title="Trocar senha">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
          </button>
          <button class="btn-icon ${u.status==='Ativo'?'':'danger'}" onclick="toggleStatusUsuario(${u.id})" title="${u.status==='Ativo'?'Inativar usuário':'Ativar usuário'}">
            ${u.status === 'Ativo'
              ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
              : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            }
          </button>
          ${u.login !== 'admin' ? `
          <button class="btn-icon danger" onclick="confirmarExcluirUsuario(${u.id})" title="Excluir usuário">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>` : ''}
        </div>
      </td>
    </tr>`).join('');

  // KPIs
  const total   = DB.usuarios.length;
  const ativos  = DB.usuarios.filter(u=>u.status==='Ativo').length;
  const admins  = DB.usuarios.filter(u=>u.perfil==='Admin').length;
  const inativos= DB.usuarios.filter(u=>u.status==='Inativo').length;
  document.getElementById('usuarios-kpis').innerHTML = `
    <div class="kpi-card"><div class="kpi-label">Total de usuários</div><div class="kpi-value">${total}</div></div>
    <div class="kpi-card"><div class="kpi-label">Ativos</div><div class="kpi-value" style="color:var(--success)">${ativos}</div></div>
    <div class="kpi-card"><div class="kpi-label">Administradores</div><div class="kpi-value" style="color:var(--accent)">${admins}</div></div>
    <div class="kpi-card"><div class="kpi-label">Inativos</div><div class="kpi-value" style="color:var(--text-muted)">${inativos}</div></div>
  `;

  document.getElementById('usuariosCount').textContent = `${total} usuário${total!==1?'s':''}`;
}

/* ---------- Hook renderPage para usuarios ---------- */
// Inicializa sincronização do USUARIOS array com DB.usuarios
_sincronizarUSUARIOS();
