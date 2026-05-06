async function carregarAnotacoes() {
    const { data, error } = await db
        .from('anotacoes')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erro ao carregar anotações:', error)
        return
    }

    renderizarAnotacoes(data || [])
}

function renderizarAnotacoes(anotacoes) {
    const container = document.getElementById('notas-container')

    if (anotacoes.length === 0) {
        container.innerHTML = '<p class="sem-notas">Nenhuma anotação ainda. Clique em "+ Nova" para começar.</p>'
        return
    }

    container.innerHTML = anotacoes.map(nota => {
        const classe = `nota-${nota.prioridade}`
        const dataFormatada = nota.data_entrega
            ? new Date(nota.data_entrega + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            : ''
        return `
            <div class="nota ${classe}" data-id="${nota.id}">
                <div class="nota-header">
                    <span class="nota-badge">${capitalize(nota.prioridade)}</span>
                    <span class="nota-data">${dataFormatada}</span>
                </div>
                <p class="nota-titulo">${escapeHtml(nota.titulo)}</p>
                ${nota.conteudo ? `<p class="nota-desc">${escapeHtml(nota.conteudo)}</p>` : ''}
                <button class="btn-deletar" onclick="deletarAnotacao('${nota.id}')" title="Excluir">✕</button>
            </div>
        `
    }).join('')
}

async function salvarAnotacao(event) {
    event.preventDefault()

    const titulo = document.getElementById('nova-titulo').value.trim()
    const prioridade = document.getElementById('nova-prioridade').value
    const conteudo = document.getElementById('nova-conteudo').value.trim()
    const dataEntrega = document.getElementById('nova-data').value

    if (!titulo) return

    const { error } = await db.from('anotacoes').insert({
        titulo,
        prioridade,
        conteudo: conteudo || null,
        data_entrega: dataEntrega || null
    })

    if (error) {
        console.error('Erro ao salvar anotação:', error)
        return
    }

    document.getElementById('form-nova-nota').style.display = 'none'
    event.target.reset()
    carregarAnotacoes()
}

async function deletarAnotacao(id) {
    const { error } = await db.from('anotacoes').delete().eq('id', id)
    if (!error) carregarAnotacoes()
}

function mostrarFormNota() {
    const form = document.getElementById('form-nova-nota')
    form.style.display = form.style.display === 'none' ? 'block' : 'none'
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
}
