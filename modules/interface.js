// Variáveis globais
let dadosProblemas = null;
let grausParentesco = null;
let isTitular = true;
let nomeCliente = "";
let parentesco = "";
let problemaId = null;
let mensagemFinal = "";
let isSidebarAberto = false;

// Função principal para iniciar a interface
function iniciarInterface() {
  injetarCSS();
  fetch(
    "https://raw.githubusercontent.com/KouttaK/Ex-Revan/refs/heads/main/data/problemas.json"
  )
    .then(response => response.json())
    .then(data => {
      dadosProblemas = data.problemas;
      grausParentesco = data.grausParentesco;
      // Disponibiliza os dados globalmente para o script de automação
      window.dadosProblemas = dadosProblemas;
      criarInterfaceCompleta();
    })
    .catch(error => {
      console.error("Erro ao carregar dados:", error);
      const body = document.querySelector("body");
      if (body) {
        body.innerHTML =
          '<p style="color: red; text-align: center; margin-top: 50px;">Erro ao carregar dados da aplicação. Verifique o console para mais detalhes.</p>';
      }
    });
}

// Função principal para criar a interface
function criarInterfaceCompleta() {
  const overlay = document.createElement("div");
  overlay.id = "sidebar-overlay";
  document.body.appendChild(overlay);

  const container = document.createElement("div");
  container.id = "interface-atendimento";
  container.className = "atendimento-container sidebar";

  const header = document.createElement("div");
  header.className = "atendimento-header";
  header.innerHTML = `<h2>Máscara de atendimento</h2>`;
  container.appendChild(header);

  const searchAreaWrapper = document.createElement("div");
  searchAreaWrapper.id = "search-area-wrapper";

  const autocompleteContainer = document.createElement("div");
  autocompleteContainer.className = "autocomplete-container";

  const problemaInput = document.createElement("input");
  problemaInput.type = "text";
  problemaInput.id = "problema-cliente";
  problemaInput.placeholder = "Desconexão Chat - Internet";

  const autocompleteList = document.createElement("div");
  autocompleteList.id = "autocomplete-lista";
  autocompleteList.className = "autocomplete-lista oculto";

  autocompleteContainer.appendChild(problemaInput);
  autocompleteContainer.appendChild(autocompleteList);
  searchAreaWrapper.appendChild(autocompleteContainer);
  container.appendChild(searchAreaWrapper);

  const mainForm = document.createElement("div");
  mainForm.className = "atendimento-form";

  const secaoIdentificacao = criarSecaoIdentificacao();
  mainForm.appendChild(secaoIdentificacao);

  const secaoOpcoesProblema = criarSecaoOpcoesProblema();
  mainForm.appendChild(secaoOpcoesProblema);

  const secaoPreviewWrapper = document.createElement("div");
  secaoPreviewWrapper.className = "atendimento-secao preview-wrapper";
  const secaoPreview = criarSecaoPreview();
  secaoPreviewWrapper.appendChild(secaoPreview);
  mainForm.appendChild(secaoPreviewWrapper);

  container.appendChild(mainForm);

  const botoesAcaoDiv = document.createElement("div");
  botoesAcaoDiv.className = "atendimento-botoes";

  const btnFecharInferior = document.createElement("button");
  btnFecharInferior.id = "btn-fechar-sidebar-inferior";
  btnFecharInferior.type = "button";
  btnFecharInferior.setAttribute("aria-label", "Fechar interface");
  btnFecharInferior.innerHTML = "✕";
  botoesAcaoDiv.appendChild(btnFecharInferior);

  const botoesDireitaContainer = document.createElement("div");
  botoesDireitaContainer.className = "botoes-acao-direita";
  botoesDireitaContainer.innerHTML = `
    <button id="btn-editar" class="btn btn-secundario">Editar</button>
    <button id="btn-enviar" class="btn btn-primario">Enviar</button>
  `;
  botoesAcaoDiv.appendChild(botoesDireitaContainer);
  container.appendChild(botoesAcaoDiv);

  const footer = document.createElement("div");
  footer.className = "atendimento-footer";
  footer.innerHTML = `
    <p>Desenvolvido e mantido por Lucas Vinicius</p>
    <p><a href="https://github.com/KouttaK" target="_blank" rel="noopener noreferrer">GitHub: KouttaK</a></p>
  `;
  container.appendChild(footer);

  document.body.appendChild(container);

  const sidebarTrigger = document.createElement("div");
  sidebarTrigger.id = "sidebar-trigger";
  sidebarTrigger.textContent = "Ajuda";
  document.body.appendChild(sidebarTrigger);

  configurarEventos();
  configurarSidebarToggle();
}

function criarSecaoOpcoesProblema() {
  const secao = document.createElement("div");
  secao.className = "atendimento-secao";
  secao.id = "secao-opcoes-problema";
  secao.innerHTML = `
    <h3 class="opcoes-problema-titulo">Configurações de Envio</h3>
    <div id="opcoes-adicionais-problema">
        <div class="atendimento-campo checkbox-container">
            <input type="checkbox" id="comentar-importante">
            <label for="comentar-importante">Comentar como importante</label>
        </div>
        <div id="opcoes-externo" class="campos-adicionais oculto">
            <div class="atendimento-campo checkbox-container">
                <input type="checkbox" id="aguardar-chamado">
                <label for="aguardar-chamado">Acompanhar chamado</label>
            </div>
        </div>
        <div id="opcoes-interno" class="campos-adicionais oculto">
            <div class="atendimento-campo checkbox-container">
                <input type="checkbox" id="usar-lembrete">
                <label for="usar-lembrete">Criar lembrete</label>
            </div>
        </div>
    </div>
  `;
  const opcoesAdicionais = secao.querySelector("#opcoes-adicionais-problema");
  if (opcoesAdicionais) opcoesAdicionais.classList.add("oculto");

  return secao;
}

function configurarSidebarToggle() {
  const container = document.getElementById("interface-atendimento");
  const trigger = document.getElementById("sidebar-trigger");
  const closeBtnInferior = document.getElementById(
    "btn-fechar-sidebar-inferior"
  );
  const overlay = document.getElementById("sidebar-overlay");

  function abrirSidebar() {
    isSidebarAberto = true;
    document.body.classList.add("sidebar-aberta");
    if (container) container.classList.add("aberto");
    if (trigger) trigger.classList.add("oculto");
    if (overlay) {
      overlay.offsetHeight;
      overlay.classList.add("visivel");
    }
  }

  function fecharSidebar() {
    isSidebarAberto = false;
    document.body.classList.remove("sidebar-aberta");
    if (container) container.classList.remove("aberto");
    if (trigger) trigger.classList.remove("oculto");
    if (overlay) overlay.classList.remove("visivel");
  }

  if (trigger)
    trigger.addEventListener("click", e => {
      e.stopPropagation();
      if (!isSidebarAberto) abrirSidebar();
    });
  if (closeBtnInferior)
    closeBtnInferior.addEventListener("click", e => {
      e.stopPropagation();
      if (isSidebarAberto) fecharSidebar();
    });
  if (overlay)
    overlay.addEventListener("click", () => {
      if (isSidebarAberto) fecharSidebar();
    });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isSidebarAberto) fecharSidebar();
  });
}

function criarSecaoIdentificacao() {
  const secao = document.createElement("div");
  secao.className = "atendimento-secao";
  secao.innerHTML = `
    <div class="atendimento-campo">
        <label class="titular-selector-label">É o titular da conta?</label>
        <div class="titular-selector-container">
            <div class="titular-selector-option active" data-titular="true">Sim</div>
            <div class="titular-selector-option" data-titular="false">Não</div>
        </div>
    </div>
    <div id="campos-nao-titular" class="campos-adicionais oculto">
        <div class="atendimento-campo">
            <label for="nome-cliente">Primeiro Nome do Contato:</label>
            <input type="text" id="nome-cliente" placeholder="Digite o primeiro nome" class="entrada-texto">
        </div>
        <div class="atendimento-campo">
            <label for="parentesco-cliente">Grau de Parentesco com o Titular:</label>
            <select id="parentesco-cliente" class="entrada-select">
                <option value="">Selecione o parentesco</option>
            </select>
        </div>
    </div>
  `;
  return secao;
}

function criarSecaoPreview() {
  const conteudoPreview = document.createElement("div");
  conteudoPreview.id = "secao-preview-content";
  conteudoPreview.innerHTML = `
    <h3 style="display: block; font-size: 16px; font-weight: 600; color: #000C3E; border-bottom: 1px solid var(--cor-linha-divisoria); padding-bottom: 8px; ">Pré-visualização da Mensagem</h3>
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
        <div class="preview-mensagem" style="margin-top: 15px;">
            <label for="mensagem-final" style="font-weight: 500; font-size: 0.9rem; color: var(--cor-texto-label); display:block; margin-bottom: 5px;">Mensagem base:</label>
            <textarea id="mensagem-final" class="entrada-textarea" rows="4" readonly></textarea>
        </div>
    </div>
    <div class="preview-vazio" id="preview-vazio">
        <p>Preencha os campos para gerar a mensagem.</p>
    </div>
  `;
  return conteudoPreview;
}

// *** FUNÇÃO DE EVENTOS MODIFICADA ***
function configurarEventos() {
  const parentescoSelect = document.getElementById("parentesco-cliente");
  const titularOptions = document.querySelectorAll(".titular-selector-option");
  const camposNaoTitular = document.getElementById("campos-nao-titular");
  const nomeInput = document.getElementById("nome-cliente");
  const problemaInput = document.getElementById("problema-cliente");
  const autocompleteList = document.getElementById("autocomplete-lista");
  const btnEditar = document.getElementById("btn-editar");
  const btnEnviar = document.getElementById("btn-enviar");
  const mensagemTextarea = document.getElementById("mensagem-final");

  if (parentescoSelect) preencherSelectParentesco(parentescoSelect);

  titularOptions.forEach(option => {
    option.addEventListener("click", function () {
      titularOptions.forEach(opt => opt.classList.remove("active"));
      this.classList.add("active");
      isTitular = this.getAttribute("data-titular") === "true";
      camposNaoTitular.classList.toggle("oculto", isTitular);
      if (isTitular) {
        nomeCliente = "";
        parentesco = "";
        if (nomeInput) nomeInput.value = "";
        if (parentescoSelect) parentescoSelect.value = "";
      }
      atualizarPreview();
    });
  });

  if (nomeInput)
    nomeInput.addEventListener("input", function () {
      nomeCliente = this.value.trim();
      atualizarPreview();
    });

  if (parentescoSelect)
    parentescoSelect.addEventListener("change", function () {
      parentesco = this.value;
      atualizarPreview();
    });

  if (problemaInput && autocompleteList) {
    const handleAutocomplete = () => {
      const termo = problemaInput.value.toLowerCase();
      const resultados = buscarProblemas(termo);
      exibirResultadosAutocomplete(resultados, autocompleteList, problemaInput);
    };
    problemaInput.addEventListener("input", handleAutocomplete);
    problemaInput.addEventListener("focus", handleAutocomplete);
    document.addEventListener("click", event => {
      if (
        !problemaInput.contains(event.target) &&
        !autocompleteList.contains(event.target)
      ) {
        autocompleteList.classList.add("oculto");
      }
    });
  }

  if (btnEditar) {
    btnEditar.addEventListener("click", function () {
      if (!mensagemTextarea) return;
      if (mensagemTextarea.readOnly) {
        mensagemTextarea.readOnly = false;
        mensagemTextarea.focus();
        btnEditar.textContent = "Salvar";
        btnEditar.classList.replace("btn-secundario", "btn-primario");
        if (btnEnviar) btnEnviar.disabled = true;
      } else {
        mensagemFinal = mensagemTextarea.value;
        window.mensagemFinal = mensagemFinal; // Atualiza global
        mensagemTextarea.readOnly = true;
        btnEditar.textContent = "Editar";
        btnEditar.classList.replace("btn-primario", "btn-secundario");
        if (btnEnviar) btnEnviar.disabled = !problemaId;
      }
    });
  }

  // Listener de envio modificado para chamar a automação
  if (btnEnviar) {
    btnEnviar.addEventListener("click", async function () {
      if (!problemaId) {
        const previewVazio = document.getElementById("preview-vazio");
        if (previewVazio) {
          previewVazio.innerHTML =
            '<p style="color: #dc3545; font-weight: bold;">Selecione um problema!</p>';
          problemaInput?.focus();
          setTimeout(() => {
            if (previewVazio)
              previewVazio.innerHTML =
                "<p>Preencha os campos para gerar a mensagem.</p>";
          }, 3000);
        }
        return;
      }

      // Garante que a mensagem mais recente seja usada, mesmo sem clicar em 'Salvar'
      if (!mensagemTextarea.readOnly) {
        mensagemFinal = mensagemTextarea.value;
        window.mensagemFinal = mensagemFinal;
      }

      const btnOriginalText = this.textContent;
      this.textContent = "Enviando...";
      this.disabled = true;
      if (btnEditar) btnEditar.disabled = true;

      // *** INÍCIO DA INTEGRAÇÃO COM A AUTOMAÇÃO ***
      if (typeof CallAutomation !== "undefined") {
        const automation = new CallAutomation();
        const success = await automation.execute();

        if (success) {
          this.textContent = "Enviado!";
          this.classList.add("btn-enviado");
          setTimeout(resetarInterface, 2500);
        } else {
          this.textContent = "Falhou!";
          this.classList.remove("btn-enviado");
          setTimeout(() => {
            this.textContent = btnOriginalText;
            this.disabled = false;
            if (btnEditar) btnEditar.disabled = false;
          }, 3000);
        }
      } else {
        console.error(
          "Classe 'CallAutomation' não encontrada. Verifique se o script 'automation.js' está carregado."
        );
        this.textContent = "Erro!";
        setTimeout(() => {
          this.textContent = btnOriginalText;
          this.disabled = false;
          if (btnEditar) btnEditar.disabled = false;
        }, 3000);
      }
      // *** FIM DA INTEGRAÇÃO ***
    });
  }

  document
    .getElementById("aguardar-chamado")
    ?.addEventListener("change", atualizarPreview);
  document
    .getElementById("usar-lembrete")
    ?.addEventListener("change", atualizarPreview);
}

function resetarInterface() {
  problemaId = null;
  window.problemaId = null;
  isTitular = true;
  nomeCliente = "";
  parentesco = "";

  const problemaInputEl = document.getElementById("problema-cliente");
  if (problemaInputEl) problemaInputEl.value = "";

  document
    .querySelector(".titular-selector-option[data-titular='true']")
    ?.classList.add("active");
  document
    .querySelector(".titular-selector-option[data-titular='false']")
    ?.classList.remove("active");
  document.getElementById("campos-nao-titular")?.classList.add("oculto");
  const nomeInputEl = document.getElementById("nome-cliente");
  if (nomeInputEl) nomeInputEl.value = "";
  const parentescoSelectEl = document.getElementById("parentesco-cliente");
  if (parentescoSelectEl) parentescoSelectEl.value = "";

  const importanteCheckbox = document.getElementById("comentar-importante");
  if (importanteCheckbox) importanteCheckbox.checked = false;

  const btnEnviar = document.getElementById("btn-enviar");
  if (btnEnviar) {
    btnEnviar.textContent = "Enviar";
    btnEnviar.disabled = false;
    btnEnviar.classList.remove("btn-enviado");
  }

  const btnEditar = document.getElementById("btn-editar");
  const mensagemTextarea = document.getElementById("mensagem-final");
  if (btnEditar && mensagemTextarea) {
    mensagemTextarea.readOnly = true;
    btnEditar.textContent = "Editar";
    btnEditar.classList.replace("btn-primario", "btn-secundario");
    btnEditar.disabled = false;
  }

  atualizarPreview();
}

function preencherSelectParentesco(selectElement) {
  if (!grausParentesco || !selectElement) return;
  selectElement.innerHTML =
    '<option value="">Selecione o parentesco</option>' +
    grausParentesco
      .map(grau => `<option value="${grau.trim()}">${grau.trim()}</option>`)
      .join("");
}

function buscarProblemas(termo) {
  if (!dadosProblemas) return [];
  if (!termo) return dadosProblemas;
  const termoLower = termo.toLowerCase();
  return dadosProblemas.filter(
    p =>
      p.nome.toLowerCase().includes(termoLower) ||
      p.filtro?.some(f => f.toLowerCase().includes(termoLower))
  );
}

function exibirResultadosAutocomplete(resultados, listContainer, inputElement) {
  if (!listContainer || !inputElement) return;

  if (!resultados.length) {
    listContainer.innerHTML = `<div class="autocomplete-item" style="cursor: default;">Nenhum resultado</div>`;
    listContainer.classList.toggle("oculto", !inputElement.value);
    return;
  }

  listContainer.innerHTML = resultados
    .map(
      p => `<div class="autocomplete-item" data-id="${p.id}">${p.nome}</div>`
    )
    .join("");
  listContainer.classList.remove("oculto");

  listContainer
    .querySelectorAll(".autocomplete-item[data-id]")
    .forEach(item => {
      item.addEventListener("click", function () {
        selecionarProblema(parseInt(this.getAttribute("data-id"), 10));
        listContainer.classList.add("oculto");
        inputElement.focus();
      });
    });
}

function selecionarProblema(id) {
  const problema = dadosProblemas.find(p => p.id === id);
  if (!problema) return;

  problemaId = id;
  window.problemaId = id; // Atualiza variável global para automação
  document.getElementById("problema-cliente").value = problema.nome;

  const opcoesExterno = document.getElementById("opcoes-externo");
  const opcoesInterno = document.getElementById("opcoes-interno");
  const secaoOpcoesAdicionais = document.getElementById(
    "opcoes-adicionais-problema"
  );

  const hasOptions =
    problema.externo !== undefined || problema.lembrete !== undefined;
  secaoOpcoesAdicionais.classList.toggle("oculto", !hasOptions);

  if (hasOptions) {
    opcoesExterno.classList.toggle("oculto", !problema.externo);
    opcoesInterno.classList.toggle("oculto", problema.externo);

    if (problema.externo) {
      document.getElementById("aguardar-chamado").checked =
        problema.aguardar ?? true;
    } else {
      document.getElementById("usar-lembrete").checked =
        problema.lembrete ?? true;
    }
  }
  atualizarPreview();
}

function atualizarPreview() {
  const previewContainer = document.getElementById("preview-container");
  const previewVazio = document.getElementById("preview-vazio");
  const mensagemTextarea = document.getElementById("mensagem-final");
  const btnEnviar = document.getElementById("btn-enviar");
  const btnEditar = document.getElementById("btn-editar");

  if (!problemaId) {
    previewContainer.classList.add("oculto");
    previewVazio.classList.remove("oculto");
    mensagemTextarea.value = "";
    if (btnEnviar) btnEnviar.disabled = true;
    if (btnEditar) btnEditar.disabled = true;
    document
      .getElementById("opcoes-adicionais-problema")
      .classList.add("oculto");
    return;
  }

  if (btnEnviar) btnEnviar.disabled = false;
  if (btnEditar) btnEditar.disabled = false;
  previewContainer.classList.remove("oculto");
  previewVazio.classList.add("oculto");

  const problema = dadosProblemas.find(p => p.id === problemaId);
  if (!problema) return;

  // Atualiza etiquetas
  const etiquetaInternaEl = document
    .getElementById("etiqueta-interna")
    .querySelector(".etiqueta-valor");
  etiquetaInternaEl.textContent = problema.etiquetaInterna || "N/A";

  const etiquetaExternaEl = document.getElementById("etiqueta-externa");
  if (problema.externo && problema.etiquetaExterna) {
    etiquetaExternaEl.querySelector(".etiqueta-valor").textContent =
      problema.etiquetaExterna;
    etiquetaExternaEl.classList.remove("oculto");
  } else {
    etiquetaExternaEl.classList.add("oculto");
  }

  // Define prefixo
  let prefixo = isTitular
    ? "Titular"
    : nomeCliente && parentesco
    ? `${nomeCliente} (${parentesco})`
    : nomeCliente || `Contato (${parentesco || "Não inf."})`;

  // Define mensagem base
  let mensagemBase = problema.mensagem || "";
  if (problema.externo) {
    const aguardarChamado =
      document.getElementById("aguardar-chamado")?.checked;
    if (aguardarChamado === false && problema.mensagemSemAguardar)
      mensagemBase = problema.mensagemSemAguardar;
    else if (aguardarChamado === true && problema.mensagemComAguardar)
      mensagemBase = problema.mensagemComAguardar;
  } else {
    const usarLembrete = document.getElementById("usar-lembrete")?.checked;
    if (usarLembrete && problema.mensagemComLembrete)
      mensagemBase = problema.mensagemComLembrete;
    else if (!usarLembrete && problema.mensagemSemLembrete)
      mensagemBase = problema.mensagemSemLembrete;
  }

  mensagemFinal = `${prefixo} ${mensagemBase}`;
  window.mensagemFinal = mensagemFinal; // Atualiza global para automação

  if (mensagemTextarea.readOnly) {
    mensagemTextarea.value = mensagemFinal;
  }
}

// Inicia a aplicação
iniciarInterface();
