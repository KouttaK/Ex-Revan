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
      criarInterfaceCompleta();
    })
    .catch(error => {
      console.error("Erro ao carregar dados:", error);
      // Exibir mensagem de erro para o usuário de forma mais amigável seria ideal aqui
      const body = document.querySelector('body');
      if (body) {
        body.innerHTML = '<p style="color: red; text-align: center; margin-top: 50px;">Erro ao carregar dados da aplicação. Verifique o console para mais detalhes.</p>';
      }
    });
}

// Função principal para iniciar a interface
function criarInterfaceCompleta() {
  const overlay = document.createElement("div");
  overlay.id = "sidebar-overlay";
  document.body.appendChild(overlay);

  const container = document.createElement("div");
  container.id = "interface-atendimento";
  container.className = "atendimento-container sidebar"; 

  // Header
  const header = document.createElement("div");
  header.className = "atendimento-header";
  header.innerHTML = `<h2>Máscara de atendimento</h2>`;
  container.appendChild(header);

  // Nova área para a barra de pesquisa
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


  // Formulário principal
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

  // Botões de Ação
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

  // Footer MODIFICADO
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

// Função para criar a seção de opções do problema MODIFICADA
function criarSecaoOpcoesProblema() {
  const secao = document.createElement("div");
  secao.className = "atendimento-secao"; 
  secao.id = "secao-opcoes-problema"; 
  // Adicionado título e nova checkbox "Comentar como importante"
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
  if(opcoesAdicionais) opcoesAdicionais.classList.add("oculto"); 
  
  return secao;
}


// Função para configurar o toggle do sidebar
function configurarSidebarToggle() {
  const container = document.getElementById("interface-atendimento");
  const trigger = document.getElementById("sidebar-trigger");
  const closeBtnInferior = document.getElementById("btn-fechar-sidebar-inferior"); 
  const overlay = document.getElementById("sidebar-overlay");

  function abrirSidebar() {
    isSidebarAberto = true;
    document.body.classList.add("sidebar-aberta");
    if(container) container.classList.add("aberto");
    if(trigger) trigger.classList.add("oculto"); 
    if(overlay) {
        overlay.offsetHeight; 
        overlay.classList.add("visivel");
    }
  }

  function fecharSidebar() {
    isSidebarAberto = false;
    document.body.classList.remove("sidebar-aberta");
    if(container) container.classList.remove("aberto");
    if(trigger) trigger.classList.remove("oculto"); 
    if(overlay) overlay.classList.remove("visivel");
  }

  if (trigger) {
    trigger.addEventListener("click", function (e) {
        e.stopPropagation(); 
        if (!isSidebarAberto) {
        abrirSidebar();
        }
    });
  }

  if (closeBtnInferior) {
    closeBtnInferior.addEventListener("click", function (e) {
        e.stopPropagation();
        if (isSidebarAberto) {
        fecharSidebar();
        }
    });
  }
  
  if (overlay) {
    overlay.addEventListener("click", function() {
        if (isSidebarAberto) {
        fecharSidebar();
        }
    });
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && isSidebarAberto) {
      fecharSidebar();
    }
  });
}

// Função para criar a seção de identificação do cliente com seletor segmentado
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

// Função para criar a seção de pré-visualização
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

// Função para configurar os eventos da interface
function configurarEventos() {
  const parentescoSelect = document.getElementById("parentesco-cliente");
  if (parentescoSelect) {
    preencherSelectParentesco(parentescoSelect);
  }

  const titularOptions = document.querySelectorAll(".titular-selector-option");
  const camposNaoTitular = document.getElementById("campos-nao-titular");

  titularOptions.forEach(option => {
    option.addEventListener("click", function() {
      titularOptions.forEach(opt => opt.classList.remove("active"));
      this.classList.add("active");
      isTitular = this.getAttribute("data-titular") === "true";

      if (camposNaoTitular) {
        camposNaoTitular.classList.toggle("oculto", isTitular);
      }
      if (isTitular) {
        nomeCliente = "";
        parentesco = "";
        const nomeInput = document.getElementById("nome-cliente");
        if (nomeInput) nomeInput.value = "";
        if (parentescoSelect) parentescoSelect.value = "";
      }
      atualizarPreview();
    });
  });
  if (camposNaoTitular && isTitular) {
    camposNaoTitular.classList.add("oculto");
  }


  const nomeInput = document.getElementById("nome-cliente");
  if (nomeInput) {
    nomeInput.addEventListener("input", function () {
      nomeCliente = this.value.trim();
      atualizarPreview();
    });
  }

  if (parentescoSelect) {
    parentescoSelect.addEventListener("change", function () {
      parentesco = this.value;
      atualizarPreview();
    });
  }

  const problemaInput = document.getElementById("problema-cliente");
  const autocompleteList = document.getElementById("autocomplete-lista");

  if (problemaInput && autocompleteList) {
    problemaInput.addEventListener("input", function () {
      const termo = this.value.toLowerCase();
      const resultados = buscarProblemas(termo);
      exibirResultadosAutocomplete(resultados, autocompleteList, problemaInput);
    });

    problemaInput.addEventListener("focus", function () {
      const termo = this.value.toLowerCase();
      const resultados = buscarProblemas(termo); 
      exibirResultadosAutocomplete(resultados, autocompleteList, problemaInput);
    });

    document.addEventListener("click", function (event) {
      if (
        problemaInput && !problemaInput.contains(event.target) &&
        autocompleteList && !autocompleteList.contains(event.target)
      ) {
        autocompleteList.classList.add("oculto");
      }
    });
  }
  
  const btnEditar = document.getElementById("btn-editar");
  const btnEnviar = document.getElementById("btn-enviar"); 

  if (btnEditar && btnEnviar) { 
    btnEditar.addEventListener("click", function () {
      const mensagemTextarea = document.getElementById("mensagem-final");
      if (!mensagemTextarea) return;
      
      if (mensagemTextarea.readOnly) {
        const problema = dadosProblemas.find(p => p.id === problemaId);
        let prefixo = isTitular ? "Titular" : (nomeCliente && parentesco ? `${nomeCliente} (${parentesco})` : (nomeCliente ? nomeCliente : (parentesco ? `Contato (${parentesco})` : "Contato")));
        let mensagemBaseEditavel = problema ? problema.mensagem : ""; 
        
        if (problema) {
            if (problema.externo) {
                const aguardarChamado = document.getElementById("aguardar-chamado")?.checked;
                if (aguardarChamado === false && problema.mensagemSemAguardar) { 
                    mensagemBaseEditavel = problema.mensagemSemAguardar;
                } else if (aguardarChamado === true && problema.mensagemComAguardar) {
                    mensagemBaseEditavel = problema.mensagemComAguardar;
                }
            } else { 
                const usarLembrete = document.getElementById("usar-lembrete")?.checked;
                if (usarLembrete === true && problema.mensagemComLembrete) {
                    mensagemBaseEditavel = problema.mensagemComLembrete;
                } else if (usarLembrete === false && problema.mensagemSemLembrete) {
                    mensagemBaseEditavel = problema.mensagemSemLembrete || problema.mensagem;
                }
            }
        }

        mensagemTextarea.value = `${prefixo} ${mensagemBaseEditavel}`;
        mensagemTextarea.readOnly = false;
        mensagemTextarea.focus();
        mensagemTextarea.select();
        btnEditar.textContent = "Salvar";
        btnEditar.classList.remove("btn-secundario");
        btnEditar.classList.add("btn-primario"); 
        btnEnviar.disabled = true; 
      } else {
        mensagemFinal = mensagemTextarea.value; 
        mensagemTextarea.readOnly = true;
        btnEditar.textContent = "Editar";
        btnEditar.classList.remove("btn-primario");
        btnEditar.classList.add("btn-secundario");
        btnEnviar.disabled = false; 
      }
    });
  }

  if (btnEnviar) {
    btnEnviar.addEventListener("click", function () {
      if (!problemaId) {
        console.warn("Por favor, selecione um problema para continuar.");
        const previewVazio = document.getElementById("preview-vazio");
        const problemaInputEl = document.getElementById("problema-cliente");
        if(previewVazio) {
            previewVazio.innerHTML = '<p style="color: #dc3545; font-weight: bold;">Selecione um problema!</p>';
            if (problemaInputEl) problemaInputEl.focus();
            setTimeout(() => {
                 if(previewVazio) previewVazio.innerHTML = '<p>Preencha os campos para gerar a mensagem.</p>';
            }, 3000);
        }
        return;
      }

      const mensagemTextarea = document.getElementById("mensagem-final");
      let mensagemParaEnvio = "";

      if (mensagemTextarea && !mensagemTextarea.readOnly) { 
          mensagemParaEnvio = mensagemTextarea.value;
          mensagemTextarea.readOnly = true; 
          if(btnEditar) { 
            btnEditar.textContent = "Editar";
            btnEditar.classList.remove("btn-primario");
            btnEditar.classList.add("btn-secundario");
          }
      } else {
          atualizarPreview(); 
          mensagemParaEnvio = mensagemFinal; 
      }
      
      const problemaSelecionado = dadosProblemas.find(p => p.id === problemaId);
      const comentarImportanteCheckbox = document.getElementById("comentar-importante"); // Get new checkbox state
      const dadosEnvio = {
        isTitular,
        nomeCliente: nomeCliente || (isTitular ? "Titular" : ""),
        parentesco: parentesco || (isTitular ? "" : "Não informado"),
        problemaId,
        problemaNome: problemaSelecionado?.nome || "Não encontrado",
        mensagemFinal: mensagemParaEnvio, 
        etiquetaInterna: problemaSelecionado?.etiquetaInterna || "",
        etiquetaExterna: problemaSelecionado?.etiquetaExterna || "",
        comentarImportante: comentarImportanteCheckbox ? comentarImportanteCheckbox.checked : false // Add new checkbox state
      };

      console.log("Dados para envio:", dadosEnvio);
      
      const btnEnviarOriginalText = btnEnviar.textContent;
      btnEnviar.textContent = "Enviando...";
      btnEnviar.disabled = true;

      setTimeout(() => {
        if (mensagemTextarea) {
            mensagemTextarea.value = "Mensagem enviada com sucesso!"; 
            mensagemTextarea.style.borderColor = "var(--cor-sucesso)"; 
        }

        btnEnviar.textContent = "Enviado!";
        btnEnviar.classList.add("btn-enviado"); 

        setTimeout(() => {
          const problemaInputEl = document.getElementById("problema-cliente");
          if (problemaInputEl) problemaInputEl.value = "";
          problemaId = null;
          
          const simOption = document.querySelector(".titular-selector-option[data-titular='true']");
          const naoOption = document.querySelector(".titular-selector-option[data-titular='false']");
          if (simOption && naoOption) {
              simOption.classList.add("active");
              naoOption.classList.remove("active");
              isTitular = true;
              if (camposNaoTitular) camposNaoTitular.classList.add("oculto");
              const nomeInputEl = document.getElementById("nome-cliente");
              if (nomeInputEl) nomeInputEl.value = "";
              if (parentescoSelect) parentescoSelect.value = "";
          }
           if (comentarImportanteCheckbox) comentarImportanteCheckbox.checked = false; // Reset new checkbox
          
          if (mensagemTextarea) {
            mensagemTextarea.style.borderColor = "var(--cor-borda-input)"; 
          }
          btnEnviar.textContent = btnEnviarOriginalText;
          btnEnviar.disabled = false; 
          btnEnviar.classList.remove("btn-enviado"); 
          
          if (btnEditar && mensagemTextarea) { 
              mensagemTextarea.readOnly = true;
              btnEditar.textContent = "Editar";
              btnEditar.classList.remove("btn-primario");
              btnEditar.classList.add("btn-secundario");
          }
           atualizarPreview(); 
        }, 2500);
      }, 1000);
    });
  }

    const aguardarChamadoCheckbox = document.getElementById('aguardar-chamado');
    if (aguardarChamadoCheckbox) {
        aguardarChamadoCheckbox.addEventListener('change', atualizarPreview);
    }

    const usarLembreteCheckbox = document.getElementById('usar-lembrete');
    if (usarLembreteCheckbox) {
        usarLembreteCheckbox.addEventListener('change', atualizarPreview);
    }
    // Note: The new "comentar-importante" checkbox does not call atualizarPreview on change by default.
    // If its state needs to affect the preview message, an event listener should be added for it as well.
}

function preencherSelectParentesco(selectElement) {
  if (!grausParentesco || !grausParentesco.length || !selectElement) return;
  let optionsHTML = '<option value="">Selecione o parentesco</option>';
  grausParentesco.forEach(grau => {
    const trimmedGrau = grau.trim();
    optionsHTML += `<option value="${trimmedGrau}">${trimmedGrau}</option>`;
  });
  selectElement.innerHTML = optionsHTML;
}

function buscarProblemas(termo) {
  if (!dadosProblemas || !dadosProblemas.length) return [];
  const termoLower = termo.toLowerCase();
  if (!termoLower) return dadosProblemas; 

  return dadosProblemas.filter(problema => {
    if (problema.nome.toLowerCase().includes(termoLower)) return true;
    if (
      problema.filtro &&
      problema.filtro.some(f => f.toLowerCase().includes(termoLower))
    )
      return true;
    return false;
  });
}

function exibirResultadosAutocomplete(resultados, listContainer, inputElement) {
  if (!listContainer || !inputElement) return;

  if (!resultados.length && inputElement.value) { 
    listContainer.innerHTML = `<div class="autocomplete-item" style="color: var(--cor-texto-secundario); cursor: default;">Nenhum resultado encontrado</div>`;
    listContainer.classList.remove("oculto");
    return;
  }
  if (!resultados.length && !inputElement.value) { 
     listContainer.classList.add("oculto");
     return;
  }

  let html = "";
  resultados.forEach(problema => {
    html += `<div class="autocomplete-item" data-id="${problema.id}">${problema.nome}</div>`;
  });

  listContainer.innerHTML = html;
  listContainer.classList.remove("oculto");

  const items = listContainer.querySelectorAll(".autocomplete-item[data-id]"); 
  items.forEach(item => {
    item.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"), 10);
      selecionarProblema(id);
      listContainer.classList.add("oculto");
      if(inputElement) inputElement.focus(); 
    });
  });
}

function selecionarProblema(id) {
  const problema = dadosProblemas.find(p => p.id === id);
  if (!problema) return;

  problemaId = id;
  const problemaInput = document.getElementById("problema-cliente");
  if (problemaInput) problemaInput.value = problema.nome;

  const opcoesExterno = document.getElementById("opcoes-externo");
  const opcoesInterno = document.getElementById("opcoes-interno");
  const aguardarChamadoCheckbox = document.getElementById("aguardar-chamado");
  const usarLembreteCheckbox = document.getElementById("usar-lembrete");
  const secaoOpcoesAdicionais = document.getElementById("opcoes-adicionais-problema"); 

  if (opcoesExterno) opcoesExterno.classList.add("oculto");
  if (opcoesInterno) opcoesInterno.classList.add("oculto");
  
  // Control visibility of the entire #opcoes-adicionais-problema block
  if (problema.externo !== undefined || problema.interno !== undefined || problema.lembrete !== undefined || problema.aguardar !== undefined) { 
      if (secaoOpcoesAdicionais) secaoOpcoesAdicionais.classList.remove("oculto");

      if (problema.externo) { 
        if (opcoesExterno) opcoesExterno.classList.remove("oculto");
        if (aguardarChamadoCheckbox) aguardarChamadoCheckbox.checked = problema.aguardar !== undefined ? problema.aguardar : true; 
      } else { 
        if (opcoesInterno) opcoesInterno.classList.remove("oculto");
        if (usarLembreteCheckbox) usarLembreteCheckbox.checked = problema.lembrete !== undefined ? problema.lembrete : true; 
      }
  } else {
      // If no specific options, hide the whole additional options block
      if (secaoOpcoesAdicionais) secaoOpcoesAdicionais.classList.add("oculto");
  }
  atualizarPreview();
}

function atualizarPreview() {
  const previewContainer = document.getElementById("preview-container");
  const previewVazio = document.getElementById("preview-vazio");
  const mensagemTextarea = document.getElementById("mensagem-final");

  if (!previewContainer || !previewVazio || !mensagemTextarea) return;

  const secaoOpcoesAdicionais = document.getElementById("opcoes-adicionais-problema"); // Get the container

  if (!problemaId) {
    previewContainer.classList.add("oculto");
    if(previewVazio) {
        previewVazio.classList.remove("oculto");
        previewVazio.innerHTML = '<p>Preencha os campos para gerar a mensagem.</p>'; 
    }
    mensagemTextarea.value = "";
    const etiquetaInternaEl = document.getElementById("etiqueta-interna");
    if (etiquetaInternaEl) {
        const valorEl = etiquetaInternaEl.querySelector(".etiqueta-valor");
        if (valorEl) valorEl.textContent = "";
    }
    const etiquetaExternaEl = document.getElementById("etiqueta-externa");
    if (etiquetaExternaEl) {
        const valorEl = etiquetaExternaEl.querySelector(".etiqueta-valor");
        if (valorEl) valorEl.textContent = "";
        etiquetaExternaEl.classList.add("oculto");
    }
    if (secaoOpcoesAdicionais) secaoOpcoesAdicionais.classList.add("oculto"); // Hide if no problem
    return;
  }

  previewContainer.classList.remove("oculto");
  if(previewVazio) previewVazio.classList.add("oculto");

  const problema = dadosProblemas.find(p => p.id === problemaId); 
  if (!problema) return; 

  // Show #opcoes-adicionais-problema if a problem is selected and has options
  if (problema.externo !== undefined || problema.interno !== undefined || problema.lembrete !== undefined || problema.aguardar !== undefined) {
      if(secaoOpcoesAdicionais) secaoOpcoesAdicionais.classList.remove("oculto");
  } else {
      if(secaoOpcoesAdicionais) secaoOpcoesAdicionais.classList.add("oculto");
  }


  const etiquetaInternaEl = document.getElementById("etiqueta-interna");
  if (etiquetaInternaEl) {
      const valorEl = etiquetaInternaEl.querySelector(".etiqueta-valor");
      if (valorEl) valorEl.textContent = problema.etiquetaInterna || "N/A";
  }

  const etiquetaExternaEl = document.getElementById("etiqueta-externa");
  if (etiquetaExternaEl) {
    if (problema.externo && problema.etiquetaExterna) {
      etiquetaExternaEl.classList.remove("oculto");
      const valorEl = etiquetaExternaEl.querySelector(".etiqueta-valor");
      if(valorEl) valorEl.textContent = problema.etiquetaExterna;
    } else {
      etiquetaExternaEl.classList.add("oculto");
    }
  }

  let prefixo = "Titular";
  if (!isTitular) {
    if (nomeCliente && parentesco) {
      prefixo = `${nomeCliente} (${parentesco})`;
    } else if (nomeCliente) {
      prefixo = nomeCliente;
    } else if (parentesco) {
        prefixo = `Contato (${parentesco})`; 
    }
     else {
      prefixo = "Contato"; 
    }
  }

  let mensagemBase = problema.mensagem || ""; 

  if (problema.externo) {
    const aguardarChamado = document.getElementById("aguardar-chamado")?.checked;
    if (aguardarChamado === false && problema.mensagemSemAguardar) { 
        mensagemBase = problema.mensagemSemAguardar;
    } else if (aguardarChamado === true && problema.mensagemComAguardar) {
        mensagemBase = problema.mensagemComAguardar;
    } 
  } else { 
    const usarLembrete = document.getElementById("usar-lembrete")?.checked;
    if (usarLembrete === true && problema.mensagemComLembrete) {
        mensagemBase = problema.mensagemComLembrete;
    } else if (usarLembrete === false && problema.mensagemSemLembrete) {
        mensagemBase = problema.mensagemSemLembrete;
    } 
  }

  mensagemFinal = `${prefixo} ${mensagemBase}`; 
  
  if (mensagemTextarea.readOnly) {
    mensagemTextarea.value = mensagemFinal;
  }
}

iniciarInterface();