/**
 * @file automation.js
 * @description Versão corrigida da automação com espera explícita por elementos de modal.
 */

/**
 * Logger para registrar informações, avisos e erros no console.
 */
const logger = {
  info: (message, ...args) => console.log(`[INFO] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[WARN] ${message}`, ...args),
  error: (message, ...args) => console.error(`[ERROR] ${message}`, ...args),
  debug: (message, ...args) => console.log(`[DEBUG] ${message}`, ...args),
};

class CallAutomation {
  constructor() {
    this.config = {
      delays: {
        short: 300,
        medium: 800,
        long: 1500,
        veryLong: 2500,
      },
      maxRetries: 10,
      retryDelay: 300,
      elementTimeout: 8000,
    };
  }

  // Polyfill para Promise.allSettled se não existir
  promiseAllSettled(promises) {
    if (Promise.allSettled) {
      return Promise.allSettled(promises);
    }

    // Implementação manual do Promise.allSettled
    return Promise.all(
      promises.map(promise =>
        Promise.resolve(promise)
          .then(value => ({ status: "fulfilled", value }))
          .catch(reason => ({ status: "rejected", reason }))
      )
    );
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async waitForElement(selector, timeout) {
    const timeoutValue = timeout || this.config.elementTimeout;
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        const element = document.querySelector(selector);
        if (element && element.offsetParent !== null) {
          resolve(element);
        } else if (Date.now() - startTime > timeoutValue) {
          reject(
            new Error(
              `Elemento '${selector}' não encontrado ou não visível no tempo limite de ${timeoutValue}ms.`
            )
          );
        } else {
          setTimeout(check, this.config.retryDelay);
        }
      };
      check();
    });
  }

  fillField(element, value) {
    element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("keyup", { bubbles: true }));
  }

  /**
   * Versão melhorada da seleção de dropdown com debugging aprimorado
   */
  async selectAntdDropdownOption(containerSelector, searchTerm) {
    logger.info(
      `Tentando selecionar opção "${searchTerm}" em "${containerSelector}"`
    );

    try {
      // Primeiro, vamos verificar se o container existe
      const container = await this.waitForElement(containerSelector);

      const selectionArea = await this.waitForElement(
        `${containerSelector} .ant-select-selection`
      );
      logger.debug("Clicando na área de seleção");
      selectionArea.click();

      await this.wait(this.config.delays.medium);

      const searchField = await this.waitForElement(
        `${containerSelector} input.ant-select-search__field`,
        3000
      );

      // Limpar e inserir o termo de busca
      this.fillField(searchField, searchTerm);
      logger.debug(`Termo "${searchTerm}" inserido no campo de busca`);

      await this.wait(this.config.delays.long);

      const dropdownItems = document.querySelectorAll(
        ".ant-select-dropdown-menu-item"
      );
      if (dropdownItems.length === 0) {
        throw new Error("Nenhuma opção encontrada no dropdown após a busca.");
      }

      const availableOptions = Array.from(dropdownItems).map(item =>
        item.textContent.trim()
      );
      logger.debug(
        `Opções disponíveis para "${searchTerm}":`,
        availableOptions
      );

      let selectedItem =
        Array.from(dropdownItems).find(
          item => item.textContent.trim() === searchTerm
        ) ||
        Array.from(dropdownItems).find(item =>
          item.textContent.trim().includes(searchTerm)
        );

      if (!selectedItem) {
        throw new Error(
          `Opção "${searchTerm}" não encontrada. Opções disponíveis: ${availableOptions.join(
            ", "
          )}`
        );
      }

      logger.debug(`Clicando na opção: "${selectedItem.textContent.trim()}"`);
      selectedItem.click();
      await this.wait(this.config.delays.short);

      const backdrop = document.querySelector(
        ".nz-overlay-transparent-backdrop"
      );
      if (backdrop) {
        backdrop.click();
        await this.wait(this.config.delays.short);
      }

      logger.info(`Opção "${searchTerm}" selecionada com sucesso.`);
      return true;
    } catch (error) {
      logger.error(
        `Erro ao selecionar "${searchTerm}" em "${containerSelector}":`,
        error
      );

      try {
        const backdrop = document.querySelector(
          ".nz-overlay-transparent-backdrop"
        );
        if (backdrop) backdrop.click();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      } catch (e) {}

      return false;
    }
  }

  /**
   * TAREFA A: Prepara e envia a mensagem principal do chamado.
   */
  async handleMessageSending(mensagemFinal, comentarImportante) {
    logger.info("Iniciando Tarefa A: Envio de Mensagem.");
    try {
      let textArea = document.querySelector("textarea.text-area");
      if (!textArea || textArea.offsetParent === null) {
        logger.info("Editor de texto não visível, tentando abri-lo.");
        const toggleButton = await this.waitForElement("#toggle_upload");
        toggleButton.click();
        await this.wait(this.config.delays.medium);
        textArea = await this.waitForElement("textarea.text-area");
      }

      this.fillField(textArea, mensagemFinal);
      await this.wait(this.config.delays.short);

      if (comentarImportante) {
        logger.info("Marcando comentário como importante.");
        const importantButton = await this.waitForElement("#important");
        if (!importantButton.classList.contains("ant-switch-checked")) {
          importantButton.click();
          await this.waitForElement("#important.ant-switch-checked");
        }
      }

      const sendButton = await this.waitForElement("#send_button");
      if (sendButton.disabled) {
        logger.warn("Botão de envio desabilitado. Tentando reativar...");
        textArea.focus();
        this.fillField(textArea, mensagemFinal + " ");
        await this.wait(this.config.delays.short);
        this.fillField(textArea, mensagemFinal);
        await this.wait(this.config.delays.medium);
      }

      if (sendButton.disabled) {
        throw new Error("Não foi possível habilitar o botão de envio.");
      }

      logger.info("Enviando mensagem...");
      sendButton.click();

      await this.wait(this.config.delays.long);

      logger.info("Tarefa A concluída: Mensagem enviada.");
      return true;
    } catch (error) {
      logger.error("Falha na Tarefa A:", error);
      return false;
    }
  }

  /**
   * TAREFA B: Atualiza as tags do chamado, se necessário.
   */
  async handleTagUpdate(selectedProblemTag) {
    logger.info("Iniciando Tarefa B: Atualização de Tags.");
    try {
      if (!selectedProblemTag) {
        logger.warn("Nenhuma tag interna para verificar. Pulando Tarefa B.");
        return true;
      }

      await this.wait(this.config.delays.medium);

      const existingTags = Array.from(
        document.querySelectorAll(".tags-container .tag span")
      ).map(span => span.textContent.trim());
      logger.info(
        `Tags existentes: [${existingTags.join(
          ", "
        )}]. Tag a verificar: "${selectedProblemTag}"`
      );

      if (existingTags.includes(selectedProblemTag)) {
        logger.info("Tag já existe. Pulando adição.");
        return true;
      }

      logger.info("Adicionando nova tag...");

      const editableTag = await this.waitForElement(".editable-tag");
      editableTag.click();

      await this.wait(this.config.delays.medium);

      const success = await this.selectAntdDropdownOption(
        "#tags",
        selectedProblemTag
      );
      if (!success) {
        throw new Error(
          `Falha ao selecionar a tag "${selectedProblemTag}" no dropdown.`
        );
      }

      await this.wait(this.config.delays.medium);

      const confirmButton = await this.waitForElement(
        '[data-testid="btn-Concluir"]'
      );
      confirmButton.click();

      await this.wait(this.config.delays.long);

      logger.info("Tarefa B concluída: Tag adicionada.");
      return true;
    } catch (error) {
      logger.error("Falha na Tarefa B:", error);
      return false;
    }
  }

  // *** FUNÇÃO CORRIGIDA ***
  async finalizeExterno(aguardarChamado, etiquetaExterna) {
    logger.info('Executando finalização para "Externo".');
    await this.waitForElement("#forward").then(btn => btn.click());

    // ***** LINHA ADICIONADA: ESPERA EXPLÍCITA PELO MODAL *****
    logger.debug("Aguardando modal de encaminhamento aparecer...");
    await this.waitForElement(".ant-modal-wrap #sector"); // Espera pelo primeiro campo do modal
    logger.debug("Modal de encaminhamento detectado.");

    if (aguardarChamado) {
      logger.info('Marcando opção "Acompanhar chamado".');
      await this.waitForElement("#blocking").then(el => {
        if (!el.classList.contains("ant-switch-checked")) {
          el.click();
        }
      });
    }

    // O fluxo agora prossegue com segurança
    await this.selectAntdDropdownOption("#sector", "Suporte externo");

    // É provável que o campo #problem só apareça após selecionar o #sector.
    // Adicionamos uma espera por ele também.
    if (etiquetaExterna) {
      await this.waitForElement("#problem"); // Assumindo que o ID seja #problem
      await this.selectAntdDropdownOption("#problem", etiquetaExterna);
    }

    await this.waitForElement("#service"); // Assumindo que o ID seja #service
    await this.selectAntdDropdownOption("#service", "Internet");

    // O botão de encaminhar dentro do modal agora é o alvo
    const encaminharBtn = await this.waitForElement(
      ".ant-modal-footer button.ant-btn-primary"
    );
    encaminharBtn.click();

    logger.info('Finalização "Externo" concluída.');
    return true;
  }

  async finalizeLembrete() {
    logger.info('Executando finalização para "Lembrete".');
    await this.waitForElement(".more").then(btn => btn.click());
    await this.waitForElement(
      'nz-list-item:has(img[alt="Adicionar lembrete"])'
    ).then(item => item.click());

    const tituloInput = await this.waitForElement("input#titulo");
    this.fillField(tituloInput, "Lembrete de retorno de tratativa");

    await this.waitForElement(".modalFooter button.ant-btn-primary").then(btn =>
      btn.click()
    );
    logger.info('Finalização "Lembrete" concluída.');
    return true;
  }

  async finalizePadrao() {
    logger.info('Executando finalização "Padrão".');
    await this.waitForElement(".more").then(btn => btn.click());
    await this.waitForElement('nz-list-item:has(img[alt="Finalizar"])').then(
      item => item.click()
    );
    logger.info('Finalização "Padrão" concluída.');
    return true;
  }

  getAutomationData() {
    try {
      if (!window.problemaId || !window.dadosProblemas) {
        throw new Error(
          "Variáveis globais `problemaId` ou `dadosProblemas` não estão definidas."
        );
      }
      const problema = window.dadosProblemas.find(
        p => p.id === window.problemaId
      );
      if (!problema) {
        throw new Error(
          `Problema com id '${window.problemaId}' não encontrado em dadosProblemas.`
        );
      }

      const mensagemFinal = window.mensagemFinal || "";
      if (!mensagemFinal) {
        logger.warn("A mensagem final está vazia.");
      }

      const comentarImportante =
        document.getElementById("comentar-importante")?.checked || false;
      const aguardarChamado =
        document.getElementById("aguardar-chamado")?.checked || false;
      const usarLembrete =
        document.getElementById("usar-lembrete")?.checked || false;

      let tipoFinalizacao = "PADRAO";
      if (problema.externo) {
        tipoFinalizacao = "EXTERNO";
      } else if (usarLembrete) {
        tipoFinalizacao = "LEMBRETE";
      }

      return {
        mensagemFinal,
        comentarImportante,
        etiquetaInterna: problema.etiquetaInterna,
        etiquetaExterna: problema.etiquetaExterna,
        tipoFinalizacao,
        aguardarChamado,
      };
    } catch (error) {
      logger.error("Erro ao coletar dados da interface para automação:", error);
      return null;
    }
  }

  async execute() {
    logger.info("🤖 Automação iniciada.");
    const data = this.getAutomationData();

    if (!data) {
      logger.error(
        "Não foi possível iniciar a automação: dados da interface não encontrados ou inválidos."
      );
      return false;
    }
    logger.info("Dados para automação:", data);

    logger.info(
      "Iniciando tarefas assíncronas (Envio de mensagem e Atualização de tag)."
    );

    const results = await this.promiseAllSettled([
      this.handleMessageSending(data.mensagemFinal, data.comentarImportante),
      this.handleTagUpdate(data.etiquetaInterna),
    ]);

    const messageSent = results[0].status === "fulfilled" && results[0].value;
    const tagUpdated = results[1].status === "fulfilled" && results[1].value;

    logger.info(
      `Resultado da Tarefa A (Mensagem): ${messageSent ? "Sucesso" : "Falha"}`
    );
    logger.info(
      `Resultado da Tarefa B (Tags): ${tagUpdated ? "Sucesso" : "Falha"}`
    );

    if (results[0].status === "rejected")
      logger.error("Erro na Tarefa A:", results[0].reason);
    if (results[1].status === "rejected")
      logger.error("Erro na Tarefa B:", results[1].reason);

    if (!messageSent) {
      logger.error(
        "Tarefa A (envio de mensagem) falhou - abortando automação."
      );
      return false;
    }

    if (!tagUpdated && data.etiquetaInterna) {
      logger.warn(
        "Tarefa B (atualização de tags) falhou, mas continuando com a finalização."
      );
    }

    logger.info("Processamento das tarefas principais concluído.");
    await this.wait(this.config.delays.long);

    logger.info(`Iniciando finalização do tipo: ${data.tipoFinalizacao}.`);
    try {
      switch (data.tipoFinalizacao) {
        case "EXTERNO":
          await this.finalizeExterno(
            data.aguardarChamado,
            data.etiquetaExterna
          );
          break;
        case "LEMBRETE":
          await this.finalizeLembrete();
          break;
        case "PADRAO":
        default:
          await this.finalizePadrao();
          break;
      }
    } catch (error) {
      logger.error("Erro durante a etapa de finalização:", error);
      return false;
    }

    logger.info("🎉 Automação concluída com sucesso!");
    return true;
  }
}

// Função utilitária para executar a automação
async function executarAutomacao() {
  const automation = new CallAutomation();
  return await automation.execute();
}

// Disponibilizar globalmente para uso no console
window.CallAutomation = CallAutomation;
window.executarAutomacao = executarAutomacao;
