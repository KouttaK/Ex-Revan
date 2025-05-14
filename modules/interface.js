// Variáveis globais
let dadosProblemas = null;
let grausParentesco = null;
let isTitular = true;
let nomeCliente = "";
let parentesco = "";
let problemaId = null;
let mensagemFinal = "";
let isMinimizado = true; // Começa minimizado

// Função principal para iniciar a interface
function iniciarInterface() {
  // Carregar dados do JSON externo
  fetch(
    "https://raw.githubusercontent.com/KouttaK/Ex-Revan/refs/heads/main/data/problemas.json"
  )
    .then(response => response.json())
    .then(data => {
      dadosProblemas = data.problemas;
      grausParentesco = data.grausParentesco;
      criarInterfaceCompleta();
    })
    .catch(error => {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados. Verifique o console para mais detalhes.");
    });
}

// Função para criar o contêiner principal da interface
function criarInterfaceCompleta() {
  // Criar contêiner principal
  const container = document.createElement("div");
  container.id = "interface-atendimento";
  container.className = "atendimento-container minimizado"; // Iniciar minimizado

  // Cabeçalho
  const header = document.createElement("div");
  header.className = "atendimento-header";
  header.innerHTML = `
    <h2>Máscara de atendimento</h2>
    <button id="toggle-interface" type="button" aria-label="Minimizar/Maximizar interface"></button>
  `;
  container.appendChild(header);

  // Formulário principal
  const mainForm = document.createElement("div");
  mainForm.className = "atendimento-form";

  // Seção 1: Identificação do Cliente (sem título)
  const secaoIdentificacao = criarSecaoIdentificacao();
  mainForm.appendChild(secaoIdentificacao);

  // Seção 2: Seleção do Problema (sem título)
  const secaoProblema = criarSecaoProblema();
  mainForm.appendChild(secaoProblema);

  // Seção 3: Pré-visualização (sem título)
  const secaoPreview = criarSecaoPreview();
  mainForm.appendChild(secaoPreview);

  container.appendChild(mainForm);

  // Botões de ação
  const botoesAcao = document.createElement("div");
  botoesAcao.className = "atendimento-botoes";
  botoesAcao.innerHTML = `
    <button id="btn-editar" class="btn btn-secundario">Editar</button>
    <button id="btn-enviar" class="btn btn-primario">Enviar</button>
  `;
  container.appendChild(botoesAcao);

  // Rodapé
  const footer = document.createElement("div");
  footer.className = "atendimento-footer";
  footer.innerHTML = `
    <p>Desenvolvido com ❤️ para otimizar seu atendimento</p>
  `;
  container.appendChild(footer);

  // Adicionar interface ao corpo da página
  document.body.appendChild(container);

  // Configurar os eventos
  configurarEventos();

  // Configurar evento de toggle para minimizar/maximizar
  configurarToggle();
}

// Função para configurar o evento de toggle para minimizar/maximizar
function configurarToggle() {
  const container = document.getElementById("interface-atendimento");
  const toggleBtn = document.getElementById("toggle-interface");

  // Função para alternar entre minimizado e maximizado
  function toggleMinimizar() {
    isMinimizado = !isMinimizado;

    if (isMinimizado) {
      container.classList.add("minimizado");
    } else {
      container.classList.remove("minimizado");
    }
  }

  // Evento para o botão de toggle
  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevenir propagação para o container
    toggleMinimizar();
  });

  // Evento para o clique no cabeçalho quando minimizado
  container.addEventListener("click", function (e) {
    if (isMinimizado && e.target !== toggleBtn) {
      toggleMinimizar();
    }
  });
}

// Função para criar a seção de identificação do cliente (sem título)
function criarSecaoIdentificacao() {
  const secao = document.createElement("div");
  secao.className = "atendimento-secao";
  secao.innerHTML = `
    <div class="atendimento-campo">
        <label class="checkbox-titular">
            <input type="checkbox" id="checkbox-titular" checked>
            <span>É o titular</span>
        </label>
    </div>
    
    <div id="campos-nao-titular" class="campos-adicionais oculto">
        <div class="atendimento-campo">
            <label for="nome-cliente">Primeiro Nome:</label>
            <input type="text" id="nome-cliente" placeholder="Digite o primeiro nome" class="entrada-texto">
        </div>
        
        <div class="atendimento-campo">
            <label for="parentesco-cliente">Grau de Parentesco:</label>
            <select id="parentesco-cliente" class="entrada-select">
                <option value="">Selecione o parentesco</option>
            </select>
        </div>
    </div>
  `;

  return secao;
}

// Função para criar a seção de seleção do problema (sem título)
function criarSecaoProblema() {
  const secao = document.createElement("div");
  secao.className = "atendimento-secao";
  secao.innerHTML = `
    <div class="atendimento-campo">
        <label for="problema-cliente">Problema:</label>
        <div class="autocomplete-container">
            <input type="text" id="problema-cliente" placeholder="Digite para buscar" class="entrada-texto">
            <div id="autocomplete-lista" class="autocomplete-lista oculto"></div>
        </div>
    </div>
    
    <div id="opcoes-externo" class="campos-adicionais oculto">
        <div class="atendimento-campo checkbox-container">
            <input type="checkbox" id="aguardar-chamado">
            <label for="aguardar-chamado">Aguardar chamado</label>
        </div>
    </div>
    
    <div id="opcoes-interno" class="campos-adicionais oculto">
        <div class="atendimento-campo checkbox-container">
            <input type="checkbox" id="usar-lembrete">
            <label for="usar-lembrete">Usar lembrete do sistema</label>
        </div>
    </div>
  `;

  return secao;
}

// Função para criar a seção de pré-visualização (sem título)
function criarSecaoPreview() {
  const secao = document.createElement("div");
  secao.className = "atendimento-secao";
  secao.id = "secao-preview";
  secao.innerHTML = `
    <div class="preview-container oculto" id="preview-container">
        <div class="preview-etiquetas">
            <div class="etiqueta etiqueta-interna" id="etiqueta-interna">
                <span class="etiqueta-titulo">Interna:</span>
                <span class="etiqueta-valor"></span>
            </div>
            <div class="etiqueta etiqueta-externa oculto" id="etiqueta-externa">
                <span class="etiqueta-titulo">Externa:</span>
                <span class="etiqueta-valor"></span>
            </div>
        </div>
        
        <div class="preview-mensagem">
            <textarea id="mensagem-final" class="entrada-textarea" rows="3" readonly></textarea>
        </div>
    </div>
    <div class="preview-vazio" id="preview-vazio">
        <p>Selecione um problema</p>
    </div>
  `;

  return secao;
}

// Função para configurar os eventos da interface
function configurarEventos() {
  // Preencher select de parentesco
  const parentescoSelect = document.getElementById("parentesco-cliente");
  preencherSelectParentesco(parentescoSelect);

  // Evento para mostrar/ocultar campos de não titular
  const checkboxTitular = document.getElementById("checkbox-titular");
  checkboxTitular.addEventListener("change", function () {
    const camposNaoTitular = document.getElementById("campos-nao-titular");
    isTitular = this.checked;

    if (isTitular) {
      camposNaoTitular.classList.add("oculto");
      nomeCliente = "";
      parentesco = "";
    } else {
      camposNaoTitular.classList.remove("oculto");
    }

    atualizarPreview();
  });

  // Eventos para campos de não titular
  const nomeInput = document.getElementById("nome-cliente");
  nomeInput.addEventListener("input", function () {
    nomeCliente = this.value.trim();
    atualizarPreview();
  });

  parentescoSelect.addEventListener("change", function () {
    parentesco = this.value;
    atualizarPreview();
  });

  // Configurar autocomplete para problemas
  const problemaInput = document.getElementById("problema-cliente");
  const autocompleteList = document.getElementById("autocomplete-lista");

  problemaInput.addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    const resultados = buscarProblemas(termo);
    exibirResultadosAutocomplete(resultados, autocompleteList);
  });

  problemaInput.addEventListener("focus", function () {
    if (this.value) {
      const resultados = buscarProblemas(this.value.toLowerCase());
      exibirResultadosAutocomplete(resultados, autocompleteList);
    }
  });

  // Remover lista de autocomplete ao clicar fora
  document.addEventListener("click", function (event) {
    if (
      !problemaInput.contains(event.target) &&
      !autocompleteList.contains(event.target)
    ) {
      autocompleteList.classList.add("oculto");
    }
  });

  // Botões de ação
  const btnEditar = document.getElementById("btn-editar");
  btnEditar.addEventListener("click", function () {
    const mensagemTextarea = document.getElementById("mensagem-final");
    mensagemTextarea.readOnly = false;
    mensagemTextarea.focus();
    btnEditar.textContent = "Salvar";

    btnEditar.onclick = function () {
      mensagemFinal = mensagemTextarea.value;
      mensagemTextarea.readOnly = true;
      btnEditar.textContent = "Editar";
      btnEditar.onclick = this.onclick;
    };
  });

  const btnEnviar = document.getElementById("btn-enviar");
  btnEnviar.addEventListener("click", function () {
    if (!problemaId) {
      alert("Por favor, selecione um problema para continuar.");
      return;
    }

    // Aqui você pode implementar a lógica de envio
    const dadosEnvio = {
      isTitular,
      nomeCliente,
      parentesco,
      problemaId,
      mensagemFinal,
    };

    console.log("Dados para envio:", dadosEnvio);
    alert("Mensagem enviada com sucesso!");

    // Você pode adicionar aqui a lógica para enviar os dados para algum sistema
  });
}

// Função para preencher o select de parentesco
function preencherSelectParentesco(select) {
  if (!grausParentesco || !grausParentesco.length) return;

  let options = '<option value="">Selecione o parentesco</option>';
  grausParentesco.forEach(grau => {
    options += `<option value="${grau}">${grau}</option>`;
  });

  select.innerHTML = options;
}

// Função para buscar problemas pelo termo digitado
function buscarProblemas(termo) {
  if (!dadosProblemas || !dadosProblemas.length) return [];
  if (!termo) return dadosProblemas;

  return dadosProblemas.filter(problema => {
    // Busca pelo nome do problema
    if (problema.nome.toLowerCase().includes(termo)) return true;

    // Busca nos termos de filtro
    if (
      problema.filtro &&
      problema.filtro.some(filtro => filtro.toLowerCase().includes(termo))
    )
      return true;

    return false;
  });
}

// Função para exibir resultados do autocomplete
function exibirResultadosAutocomplete(resultados, container) {
  if (!resultados.length) {
    container.classList.add("oculto");
    return;
  }

  let html = "";
  resultados.forEach(problema => {
    html += `<div class="autocomplete-item" data-id="${problema.id}">${problema.nome}</div>`;
  });

  container.innerHTML = html;
  container.classList.remove("oculto");

  // Adicionar eventos aos items
  const items = container.querySelectorAll(".autocomplete-item");
  items.forEach(item => {
    item.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"), 10);
      selecionarProblema(id);
      container.classList.add("oculto");
    });
  });
}

// Função para selecionar um problema
function selecionarProblema(id) {
  const problema = dadosProblemas.find(p => p.id === id);
  if (!problema) return;

  problemaId = id;
  document.getElementById("problema-cliente").value = problema.nome;

  // Exibir opções conforme o tipo do problema
  const opcoesExterno = document.getElementById("opcoes-externo");
  const opcoesInterno = document.getElementById("opcoes-interno");

  opcoesExterno.classList.add("oculto");
  opcoesInterno.classList.add("oculto");

  if (problema.externo) {
    opcoesExterno.classList.remove("oculto");
    // Configurar estado da checkbox conforme o problema
    document.getElementById("aguardar-chamado").checked = problema.aguardar;
  } else {
    opcoesInterno.classList.remove("oculto");
    // Configurar estado da checkbox conforme o problema
    document.getElementById("usar-lembrete").checked = problema.lembrete;
  }

  atualizarPreview();
}

// Função para atualizar a pré-visualização
function atualizarPreview() {
  const previewContainer = document.getElementById("preview-container");
  const previewVazio = document.getElementById("preview-vazio");

  if (!problemaId) {
    previewContainer.classList.add("oculto");
    previewVazio.classList.remove("oculto");
    return;
  }

  previewContainer.classList.remove("oculto");
  previewVazio.classList.add("oculto");

  const problema = dadosProblemas.find(p => p.id === problemaId);
  if (!problema) return;

  // Atualizar etiquetas
  const etiquetaInterna = document.getElementById("etiqueta-interna");
  etiquetaInterna.querySelector(".etiqueta-valor").textContent =
    problema.etiquetaInterna;

  const etiquetaExterna = document.getElementById("etiqueta-externa");
  if (problema.externo && problema.etiquetaExterna) {
    etiquetaExterna.classList.remove("oculto");
    etiquetaExterna.querySelector(".etiqueta-valor").textContent =
      problema.etiquetaExterna;
  } else {
    etiquetaExterna.classList.add("oculto");
  }

  // Compor a mensagem final
  let prefixo = "Titular";

  if (!isTitular) {
    if (nomeCliente && parentesco) {
      prefixo = `${nomeCliente} (${parentesco})`;
    } else if (nomeCliente) {
      prefixo = nomeCliente;
    } else {
      prefixo = "Cliente";
    }
  }

  mensagemFinal = `${prefixo} ${problema.mensagem}`;
  document.getElementById("mensagem-final").value = mensagemFinal;
}
iniciarInterface();
