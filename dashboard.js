// Elementos do DOM
const dashboard = document.querySelector('#dashboard');
const dashboardContent = document.querySelector('#dashboardContent');
const modalContainer = document.querySelector('#modalContainer');
const modalTitle = document.querySelector('#modalTitle');
const modalContent = document.querySelector('#modalContent');
const btnCloseModal = document.querySelector('#btnCloseModal');
const btnLogout = document.querySelector('#btnLogout');

let tipoUsuarioAtual = 'Administrador'; // Definido inicialmente, deve ser atualizado após o login

// Função para carregar o conteúdo do dashboard
export function carregarDashboard(tipoUsuario) {
    tipoUsuarioAtual = tipoUsuario;
    let url = 'http://localhost:3000/usuarios';
    if (tipoUsuario === 'LiderCelula') {
        // Assumindo que há um endpoint para buscar usuários de uma célula específica
        url += '/celula/1'; // Substitua '1' pelo ID da célula do líder
    } else if (tipoUsuario === 'UsuarioComum') {
        // Assumindo que o ID do usuário está armazenado em algum lugar (por exemplo, localStorage)
        const usuarioId = localStorage.getItem('usuarioId');
        url += `/${usuarioId}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(dados => {
            let conteudo = '';
            switch (tipoUsuario) {
                case 'Administrador':
                    conteudo = gerarConteudoAdmin(dados);
                    break;
                case 'LiderCelula':
                    conteudo = gerarConteudoLider(dados);
                    break;
                case 'UsuarioComum':
                    conteudo = gerarConteudoUsuario(dados);
                    break;
            }
            dashboardContent.innerHTML = conteudo;
            adicionarEventosDashboard();
        })
        .catch(error => {
            console.error('Erro ao carregar os dados da dashboard:', error);
            dashboardContent.innerHTML = '<p class="text-red-500">Erro ao carregar os dados. Por favor, tente novamente mais tarde.</p>';
        });
}

function gerarConteudoAdmin(dados) {
    let html = '<h2 class="text-2xl font-bold mb-4">Painel do Administrador</h2>';
    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    
    dados.forEach(usuario => {
        html += `
            <div class="card bg-base-100 shadow-xl user-card">
                <div class="card-body">
                    <h3 class="card-title">${usuario.nomeCompleto}</h3>
                    <p>Email: ${usuario.email}</p>
                    <p>Tipo: ${usuario.tipoUsuario}</p>
                    <div class="card-actions justify-end mt-2">
                        <button class="btn btn-primary btn-sm btn-detalhes" data-id="${usuario.id}">Detalhes</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function gerarConteudoLider(dados) {
    let html = '<h2 class="text-2xl font-bold mb-4">Painel do Líder de Célula</h2>';
    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    
    dados.forEach(usuario => {
        html += `
            <div class="card bg-base-100 shadow-xl user-card">
                <div class="card-body">
                    <h3 class="card-title">${usuario.nomeCompleto}</h3>
                    <p>Email: ${usuario.email}</p>
                    <p>Célula: ${usuario.nomeCelula}</p>
                    <div class="card-actions justify-end mt-2">
                        <button class="btn btn-primary btn-sm btn-detalhes" data-id="${usuario.id}">Detalhes</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function gerarConteudoUsuario(dados) {
    const usuario = dados;
    let html = '<h2 class="text-2xl font-bold mb-4">Meu Perfil</h2>';
    html += `
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h3 class="card-title">${usuario.nomeCompleto}</h3>
                <p>Email: ${usuario.email}</p>
                <p>Telefone: ${usuario.telefone}</p>
                <p>Célula: ${usuario.nomeCelula || 'Não participa'}</p>
                <div class="card-actions justify-end mt-2">
                    <button class="btn btn-primary btn-sm btn-detalhes" data-id="${usuario.id}">Ver Mais Detalhes</button>
                </div>
            </div>
        </div>
    `;
    return html;
}

function adicionarEventosDashboard() {
    const btnDetalhes = document.querySelectorAll('.btn-detalhes');
    btnDetalhes.forEach(btn => {
        btn.addEventListener('click', () => mostrarDetalhesUsuario(btn.dataset.id));
    });
}

function mostrarDetalhesUsuario(id) {
    fetch(`http://localhost:3000/usuarios/${id}`)
        .then(response => response.json())
        .then(usuario => {
            modalTitle.textContent = `Detalhes de ${usuario.nomeCompleto}`;
            let conteudo = `
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Telefone:</strong> ${usuario.telefone}</p>
                <p><strong>Data de Nascimento:</strong> ${new Date(usuario.dataNascimento).toLocaleDateString()}</p>
                <p><strong>Concluiu Batismo:</strong> ${usuario.concluiuBatismo ? 'Sim' : 'Não'}</p>
                <p><strong>Participou do Café:</strong> ${usuario.participouCafe ? 'Sim' : 'Não'}</p>
                <p><strong>Participa de Ministério:</strong> ${usuario.participaMinisterio ? 'Sim' : 'Não'}</p>
                <p><strong>Ministério:</strong> ${usuario.nomeMinisterio || 'Não participa'}</p>
                <p><strong>Participa de Célula:</strong> ${usuario.participaCelula ? 'Sim' : 'Não'}</p>
                <p><strong>Célula:</strong> ${usuario.nomeCelula || 'Não participa'}</p>
                <h4 class="font-semibold mt-2">Cursos Concluídos:</h4>
                <ul>
                    ${usuario.cursoMeuNovoCaminho ? '<li>Meu Novo Caminho</li>' : ''}
                    ${usuario.cursoVidaDevocional ? '<li>Vida Devocional</li>' : ''}
                    ${usuario.cursoFamiliaCrista ? '<li>Família Cristã</li>' : ''}
                    ${usuario.cursoVidaProsperidade ? '<li>Vida de Prosperidade</li>' : ''}
                    ${usuario.cursoPrincipiosAutoridade ? '<li>Princípios de Autoridade</li>' : ''}
                    ${usuario.cursoVidaEspirito ? '<li>Vida no Espírito</li>' : ''}
                    ${usuario.cursoCaraterCristo ? '<li>Caráter de Cristo</li>' : ''}
                    ${usuario.cursoIdentidadesRestauradas ? '<li>Identidades Restauradas</li>' : ''}
                </ul>
            `;

            if (tipoUsuarioAtual === 'Administrador' || (tipoUsuarioAtual === 'LiderCelula' && usuario.tipoUsuario !== 'Administrador')) {
                conteudo += `
                    <div class="flex justify-end mt-4">
                        <button class="btn btn-primary btn-sm mr-2" onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button class="btn btn-error btn-sm mr-2" onclick="deletarUsuario(${usuario.id})">Deletar</button>
                `;
                
                if (tipoUsuarioAtual === 'Administrador' && usuario.tipoUsuario !== 'Administrador') {
                    conteudo += `
                        <button class="btn btn-info btn-sm" onclick="tornarLider(${usuario.id})">Tornar Líder</button>
                    `;
                }
                
                conteudo += `</div>`;
            }

            modalContent.innerHTML = conteudo;
            modalContainer.classList.add('modal-open');
        })
        .catch(error => {
            console.error('Erro ao carregar detalhes do usuário:', error);
            modalContent.innerHTML = '<p class="text-red-500">Erro ao carregar detalhes. Por favor, tente novamente.</p>';
        });
}

function editarUsuario(id) {
    // Implementar lógica de edição
    console.log(`Editar usuário ${id}`);
    // Aqui você pode abrir um novo modal com um formulário de edição
    // ou redirecionar para uma página de edição
}

function deletarUsuario(id) {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
        fetch(`http://localhost:3000/usuarios/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert('Usuário deletado com sucesso');
                fecharModal();
                carregarDashboard(tipoUsuarioAtual); // Recarregar a dashboard
            })
            .catch(error => {
                console.error('Erro ao deletar usuário:', error);
                alert('Erro ao deletar usuário');
            });
    }
}

function tornarLider(id) {
    if (confirm('Tem certeza que deseja tornar este usuário um líder de célula?')) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tipoUsuario: 'LiderCelula' })
        })
        .then(response => response.json())
        .then(data => {
            alert('Usuário promovido a líder de célula com sucesso');
            fecharModal();
            carregarDashboard(tipoUsuarioAtual); // Recarregar a dashboard
        })
        .catch(error => {
            console.error('Erro ao promover usuário:', error);
            alert('Erro ao promover usuário');
        });
    }
}

function fecharModal() {
    modalContainer.classList.remove('modal-open');
}

// Event listeners
btnCloseModal.addEventListener('click', fecharModal);
btnLogout.addEventListener('click', () => {
    // Implementar lógica de logout
    console.log('Logout');
    // Redirecionar para a página de login ou limpar a sessão
});

// Inicialização da dashboard
carregarDashboard(tipoUsuarioAtual);
