let anotacoes = []
let eventos = []
let userId = null

const labelTipo = {
    prova:     { label: 'Prova',     cor: '#ef4444', fundo: '#fee2e2' },
    entrega:   { label: 'Entrega',   cor: '#f59e0b', fundo: '#fffbeb' },
    seminario: { label: 'Seminário', cor: '#8b5cf6', fundo: '#ede9fe' },
    aula:      { label: 'Aula',      cor: '#2563eb', fundo: '#dbeafe' },
    outro:     { label: 'Outro',     cor: '#64748b', fundo: '#f1f5f9' },
}

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await db.auth.getUser()
    if (!user) return
    userId = user.id

    await Promise.all([carregarAnotacoes(), carregarEventos()])

    inicializarCalendario()
    inicializarModal()
    inicializarAnotacoes()
    renderizarAnotacoes()
})

// ─────────────────────────────────────────────
//  DB — Anotações
// ─────────────────────────────────────────────

async function carregarAnotacoes() {
    const { data, error } = await db
        .from('anotacoes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erro ao carregar anotações:', error)
        return
    }
    anotacoes = data || []
}

async function carregarEventos() {
    const { data, error } = await db
        .from('eventos')
        .select('*')
        .eq('user_id', userId)
        .order('data', { ascending: true })

    if (error) {
        console.error('Erro ao carregar eventos:', error)
        return
    }
    eventos = data || []
}

// ─────────────────────────────────────────────
//  CALENDÁRIO
// ─────────────────────────────────────────────

function inicializarCalendario() {
    const celulas = document.querySelectorAll('.cal-table td')

    celulas.forEach(td => {
        const textoNode = [...td.childNodes].find(n => n.nodeType === Node.TEXT_NODE)
        const dia = textoNode ? parseInt(textoNode.textContent.trim()) : NaN

        if (!isNaN(dia) && dia > 0) {
            td.style.cursor = 'pointer'
            td.setAttribute('data-dia', dia)

            td.addEventListener('mouseenter', () => {
                if (!td.classList.contains('hoje')) {
                    td.style.background = 'var(--primary-light)'
                }
            })
            td.addEventListener('mouseleave', () => {
                if (!td.classList.contains('hoje')) {
                    td.style.background = ''
                }
            })
            td.addEventListener('click', () => abrirModalDia(dia, td))
        }
    })
}

// ─────────────────────────────────────────────
//  MODAL
// ─────────────────────────────────────────────

function inicializarModal() {
    const overlay = document.createElement('div')
    overlay.id = 'modal-overlay'
    overlay.innerHTML = `
        <div id="modal-dia" role="dialog" aria-modal="true" aria-labelledby="modal-dia-titulo">
            <div id="modal-header">
                <h3 id="modal-dia-titulo"></h3>
                <button id="modal-fechar" title="Fechar" aria-label="Fechar modal">✕</button>
            </div>
            <div id="modal-corpo"></div>
            <div id="modal-footer">
                <button id="modal-nova-anotacao">+ Criar anotação para este dia</button>
            </div>
        </div>
    `
    document.body.appendChild(overlay)

    const style = document.createElement('style')
    style.textContent = `
        #modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(3px);
            z-index: 9999;
            align-items: center;
            justify-content: center;
        }
        #modal-overlay.ativo { display: flex; }
        #modal-dia {
            background: var(--surface);
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.18);
            width: 100%;
            max-width: 420px;
            margin: 1rem;
            overflow: hidden;
            animation: modalEntrar 0.22s ease;
        }
        @keyframes modalEntrar {
            from { opacity: 0; transform: translateY(14px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        #modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem 0.75rem;
            border-bottom: 1px solid var(--border);
        }
        #modal-dia-titulo {
            font-size: 1rem;
            font-weight: 700;
            color: var(--primary);
        }
        #modal-fechar {
            background: none;
            border: none;
            font-size: 1rem;
            color: var(--muted);
            cursor: pointer;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            transition: background 0.15s, color 0.15s;
        }
        #modal-fechar:hover {
            background: #fee2e2;
            color: #ef4444;
        }
        #modal-corpo {
            padding: 1rem 1.25rem;
            max-height: 55vh;
            overflow-y: auto;
        }
        .modal-evento {
            display: flex;
            gap: 0.75rem;
            padding: 0.7rem 0.85rem;
            border-radius: 8px;
            margin-bottom: 0.6rem;
            border-left: 4px solid transparent;
        }
        .modal-evento-icone { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
        .modal-evento-info strong { display: block; font-size: 0.88rem; margin-bottom: 0.15rem; }
        .modal-evento-info span { font-size: 0.8rem; color: var(--muted); }
        .modal-badge {
            display: inline-block;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.1rem 0.5rem;
            border-radius: 20px;
            margin-bottom: 0.3rem;
        }
        .modal-sem-eventos {
            color: var(--muted);
            font-size: 0.88rem;
            font-style: italic;
            padding: 0.25rem 0;
        }
        .modal-secao-titulo {
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.07em;
            margin: 0.75rem 0 0.5rem;
        }
        .modal-anotacao-item {
            background: var(--bg);
            border-radius: 8px;
            padding: 0.6rem 0.8rem;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
            border-left: 3px solid var(--border);
        }
        .modal-anotacao-item strong { display: block; margin-bottom: 0.15rem; font-size: 0.87rem; }
        .modal-anotacao-item p { margin: 0; color: var(--muted); font-size: 0.8rem; }
        #modal-footer { padding: 0.75rem 1.25rem; border-top: 1px solid var(--border); }
        #modal-nova-anotacao {
            background: none;
            border: 1.5px dashed var(--primary);
            color: var(--primary);
            border-radius: 6px;
            padding: 0.45rem 0.9rem;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            transition: background 0.15s;
        }
        #modal-nova-anotacao:hover { background: var(--primary-light); }
        .cal-table td[data-dia]:not(.hoje):hover {
            background: var(--primary-light) !important;
        }
    `
    document.head.appendChild(style)

    overlay.addEventListener('click', e => { if (e.target === overlay) fecharModal() })
    document.getElementById('modal-fechar').addEventListener('click', fecharModal)
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal() })
}

function abrirModalDia(dia, tdEl) {
    const overlay = document.getElementById('modal-overlay')
    const titulo  = document.getElementById('modal-dia-titulo')
    const corpo   = document.getElementById('modal-corpo')
    const btnNova = document.getElementById('modal-nova-anotacao')

    const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
    const data = new Date(2026, 4, dia)
    titulo.textContent = `${dia} de maio — ${diasSemana[data.getDay()]}`

    const dataISO = `2026-05-${String(dia).padStart(2,'0')}`
    const eventosDoDia = eventos.filter(ev => ev.data === dataISO)
    const anotacoesDoDia = anotacoes.filter(a => a.data === dataISO)

    let html = ''

    if (eventosDoDia.length > 0) {
        html += '<p class="modal-secao-titulo">Eventos</p>'
        eventosDoDia.forEach(ev => {
            const config = labelTipo[ev.tipo] || labelTipo.outro
            const icones = { prova: '📝', entrega: '📦', seminario: '🎤', aula: '📚', outro: '📌' }
            html += `
                <div class="modal-evento" style="background:${config.fundo}; border-left-color:${config.cor}">
                    <span class="modal-evento-icone">${icones[ev.tipo] || '📌'}</span>
                    <div class="modal-evento-info">
                        <span class="modal-badge" style="background:${config.fundo}; color:${config.cor}">${config.label}</span>
                        <strong>${escapeHtml(ev.titulo)}</strong>
                        <span>${escapeHtml(ev.descricao || '')}</span>
                    </div>
                </div>
            `
        })
    }

    if (anotacoesDoDia.length > 0) {
        html += '<p class="modal-secao-titulo">Suas anotações</p>'
        anotacoesDoDia.forEach(a => {
            html += `
                <div class="modal-anotacao-item">
                    <strong>${escapeHtml(a.titulo)}</strong>
                    ${a.conteudo ? `<p>${escapeHtml(a.conteudo)}</p>` : ''}
                </div>
            `
        })
    }

    if (eventosDoDia.length === 0 && anotacoesDoDia.length === 0) {
        html = '<p class="modal-sem-eventos">Nenhum evento ou anotação para este dia.</p>'
    }

    corpo.innerHTML = html

    btnNova.onclick = () => {
        fecharModal()
        abrirFormComData(dataISO)
    }

    overlay.classList.add('ativo')
    document.getElementById('modal-fechar').focus()
}

function fecharModal() {
    document.getElementById('modal-overlay').classList.remove('ativo')
}

// ─────────────────────────────────────────────
//  ANOTAÇÕES — UI + CRUD
// ─────────────────────────────────────────────

function inicializarAnotacoes() {
    const form = document.getElementById('form-nova-nota')
    if (form) {
        form.onsubmit = null
        form.addEventListener('submit', salvarAnotacao)
    }

    const btnNova = document.querySelector('.btn-nova-nota')
    if (btnNova) {
        btnNova.onclick = null
        btnNova.addEventListener('click', toggleFormNota)
    }

    const btnCancelar = document.querySelector('.btn-cancelar')
    if (btnCancelar) {
        btnCancelar.onclick = null
        btnCancelar.addEventListener('click', ocultarFormNota)
    }
}

async function salvarAnotacao(event) {
    event.preventDefault()

    const titulo     = document.getElementById('nova-titulo').value.trim()
    const prioridade = document.getElementById('nova-prioridade').value
    const conteudo   = document.getElementById('nova-conteudo').value.trim()
    const data       = document.getElementById('nova-data').value

    if (!titulo) return

    const { error } = await db.from('anotacoes').insert({
        user_id: userId,
        titulo,
        prioridade,
        conteudo: conteudo || null,
        data: data || null
    })

    if (error) {
        console.error('Erro ao salvar anotação:', error)
        return
    }

    await carregarAnotacoes()
    renderizarAnotacoes()
    ocultarFormNota()
    event.target.reset()
}

async function deletarAnotacao(id) {
    const { error } = await db.from('anotacoes').delete().eq('id', id)
    if (error) {
        console.error('Erro ao deletar anotação:', error)
        return
    }
    await carregarAnotacoes()
    renderizarAnotacoes()
}

function renderizarAnotacoes() {
    const container = document.getElementById('notas-container')
    if (!container) return

    if (anotacoes.length === 0) {
        container.innerHTML = '<p class="sem-notas">Nenhuma anotação ainda. Clique em "+ Nova" para começar.</p>'
        return
    }

    container.innerHTML = anotacoes.map(nota => {
        const classe = `nota-${nota.prioridade}`
        const dataFormatada = nota.data
            ? new Date(nota.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            : ''

        const labelPrioridade = {
            normal:     { texto: 'Normal',     cor: '#15803d' },
            importante: { texto: 'Importante', cor: '#b45309' },
            urgente:    { texto: 'Urgente',    cor: '#b91c1c' },
        }
        const lp = labelPrioridade[nota.prioridade] || labelPrioridade.normal

        return `
            <div class="nota ${classe}" data-id="${nota.id}" style="animation: notaEntrar 0.25s ease">
                <div class="nota-header">
                    <span class="nota-badge" style="color:${lp.cor}">${lp.texto}</span>
                    <span class="nota-data">${dataFormatada}</span>
                </div>
                <p class="nota-titulo">${escapeHtml(nota.titulo)}</p>
                ${nota.conteudo ? `<p class="nota-desc">${escapeHtml(nota.conteudo)}</p>` : ''}
                <button class="btn-deletar" onclick="deletarAnotacao(${nota.id})" title="Excluir">✕</button>
            </div>
        `
    }).join('')

    if (!document.getElementById('nota-anim-style')) {
        const s = document.createElement('style')
        s.id = 'nota-anim-style'
        s.textContent = `@keyframes notaEntrar { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }`
        document.head.appendChild(s)
    }
}

// ─────────────────────────────────────────────
//  FORMULÁRIO
// ─────────────────────────────────────────────

function toggleFormNota() {
    const form = document.getElementById('form-nova-nota')
    if (!form) return
    const visivel = form.style.display !== 'none'
    if (visivel) {
        ocultarFormNota()
    } else {
        form.style.display = 'block'
        document.getElementById('nova-titulo')?.focus()
    }
}

function ocultarFormNota() {
    const form = document.getElementById('form-nova-nota')
    if (form) {
        form.style.display = 'none'
        form.reset()
    }
}

function abrirFormComData(dataISO) {
    const form = document.getElementById('form-nova-nota')
    if (!form) return
    form.style.display = 'block'
    const inputData = document.getElementById('nova-data')
    if (inputData) inputData.value = dataISO
    document.getElementById('nova-titulo')?.focus()

    document.getElementById('anotacoes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ─────────────────────────────────────────────
//  UTIL
// ─────────────────────────────────────────────

function escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
}
