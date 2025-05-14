// Variáveis globais
let dadosProblemas = null;
let grausParentesco = null;
let isTitular = true;
let nomeCliente = "";
let parentesco = "";
let problemaId = null;
let mensagemFinal = "";

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
  container.className = "atendimento-container";

  // Cabeçalho
  const header = document.createElement("div");
  header.className = "atendimento-header";
  header.innerHTML = `
            <h2>Sistema de Atendimento</h2>
            <p>Preencha as informações abaixo para iniciar o atendimento</p>
        `;
  container.appendChild(header);

  // Formulário principal
  const mainForm = document.createElement("div");
  mainForm.className = "atendimento-form";

  // Seção 1: Identificação do Cliente
  const secaoIdentificacao = criarSecaoIdentificacao();
  mainForm.appendChild(secaoIdentificacao);

  // Seção 2: Seleção do Problema
  const secaoProblema = criarSecaoProblema();
  mainForm.appendChild(secaoProblema);

  // Seção 3: Pré-visualização
  const secaoPreview = criarSecaoPreview();
  mainForm.appendChild(secaoPreview);

  container.appendChild(mainForm);

  // Botões de ação
  const botoesAcao = document.createElement("div");
  botoesAcao.className = "atendimento-botoes";
  botoesAcao.innerHTML = `
            <button id="btn-editar" class="btn btn-secundario">Editar Mensagem</button>
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
}

// Função para criar a seção de identificação do cliente
function criarSecaoIdentificacao() {
  const secao = document.createElement("div");
  secao.className = "atendimento-secao";
  secao.innerHTML = `
            <h3>Identificação do Cliente</h3>
            <div class="atendimento-campo">
                <label>É o titular?</label>
                <div class="opcoes-titular">
                    <label class="radio-container">
                        <input type="radio" name="titular" value="sim" checked>
                        <span class="radio-texto">Sim</span>
                    </label>
                    <label class="radio-container">
                        <input type="radio" name="titular" value="nao">
                        <span class="radio-texto">Não</span>
                    </label>
                </div>
            </div>
            
            <div id="campos-nao-titular" class="campos-adicionais oculto">
                <div class="atendimento-campo">
                    <label for="nome-cliente">Primeiro Nome:</label>
                    <input type="text" id="nome-cliente" placeholder="Digite o primeiro nome" class="entrada-texto">
                </div>
                
                <div class="atendimento-campo">
                    <label for="parentesco-cliente">Grau de Parentesco:</label>
                    <select id="parentesco-cliente" class="entrada-select">
                        <option value="">Selecione o grau de parentesco</option>
                    </select>
                </div>
            </div>
        `;

  return secao;
}

// Função para criar a seção de seleção do problema
function criarSecaoProblema() {
  const secao = document.createElement("div");
  secao.className = "atendimento-secao";
  secao.innerHTML = `
            <h3>Seleção do Problema</h3>
            <div class="atendimento-campo">
                <label for="problema-cliente">Problema:</label>
                <div class="autocomplete-container">
                    <input type="text" id="problema-cliente" placeholder="Digite para buscar o problema" class="entrada-texto">
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

// Função para criar a seção de pré-visualização
function criarSecaoPreview() {
  const secao = document.createElement("div");
  secao.className = "atendimento-secao";
  secao.id = "secao-preview";
  secao.innerHTML = `
            <h3>Pré-visualização</h3>
            <div class="preview-container oculto" id="preview-container">
                <div class="preview-etiquetas">
                    <div class="etiqueta etiqueta-interna" id="etiqueta-interna">
                        <span class="etiqueta-titulo">Etiqueta Interna:</span>
                        <span class="etiqueta-valor"></span>
                    </div>
                    <div class="etiqueta etiqueta-externa oculto" id="etiqueta-externa">
                        <span class="etiqueta-titulo">Etiqueta Externa:</span>
                        <span class="etiqueta-valor"></span>
                    </div>
                </div>
                
                <div class="preview-mensagem">
                    <h4>Mensagem Final:</h4>
                    <textarea id="mensagem-final" class="entrada-textarea" rows="4" readonly></textarea>
                </div>
            </div>
            <div class="preview-vazio" id="preview-vazio">
                <p>Selecione um problema para visualizar a mensagem</p>
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
  const opcoesTitular = document.querySelectorAll('input[name="titular"]');
  opcoesTitular.forEach(opcao => {
    opcao.addEventListener("change", function () {
      const camposNaoTitular = document.getElementById("campos-nao-titular");
      isTitular = this.value === "sim";

      if (isTitular) {
        camposNaoTitular.classList.add("oculto");
        nomeCliente = "";
        parentesco = "";
      } else {
        camposNaoTitular.classList.remove("oculto");
      }

      atualizarPreview();
    });
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
    btnEditar.textContent = "Salvar Edição";

    btnEditar.onclick = function () {
      mensagemFinal = mensagemTextarea.value;
      mensagemTextarea.readOnly = true;
      btnEditar.textContent = "Editar Mensagem";
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

  let options = '<option value="">Selecione o grau de parentesco</option>';
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

iniciarInterface()