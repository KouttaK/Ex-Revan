// ==UserScript==
// @name         Máscara de Atendimento v4.8
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Sistema de automação com filtros avançados, interface e seção de resumo aprimorados. Lógica de seleção ajustada para maior precisão e flexibilidade.
// @author       KoutaK
// @match        *://*/* // IMPORTANTE: Substitua pelo domínio específico do sistema
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  // ═══════════════════════════════════════════════════════════════════
  // 📋 CONFIGURAÇÃO CENTRALIZADA
  // ═══════════════════════════════════════════════════════════════════
  const CONFIG = {
    // ATENÇÃO: Substitua pelas URLs corretas dos seus arquivos no GitHub Raw
    GITHUB_JSON_URL: "https://raw.githubusercontent.com/KouttaK/Ex-Revan/main/data/problemas.json",
    CSS_URL: "https://raw.githubusercontent.com/KouttaK/Ex-Revan/refs/heads/main/infra/styles.css",
    HTML_URL: "https://raw.githubusercontent.com/KouttaK/Ex-Revan/refs/heads/main/infra/modal.html",
    SELECTORS: {
      MAIN_TEXT_AREA: ".text-area",
      MAIN_SEND_BUTTON: "#send_button",
      UPLOAD_BUTTON: "#toggle_upload",
      IMPORTANT_BUTTON: "#important",
      FORWARD_BUTTON: "#forward",
      MORE_BUTTON: ".more",
      TAG_ADD_BUTTON: "//nz-tag[contains(@class, 'editable-tag')]",
      TAG_INPUT: "//*[@id='tags']//input",
      SECTOR_SELECT: "//nz-select[@id='sector']//input",
      PROBLEM_SELECT: "//nz-select[@id='problem']//input",
      SERVICE_SELECT:
        "//nz-select[@id='service' and not(contains(@class, 'ant-select-disabled'))]//input",
      GENERIC_DROPDOWN_MENU:
        "//div[contains(@class, 'ant-select-dropdown') and not(contains(@class, 'ant-select-dropdown-hidden'))]//ul[contains(@class, 'ant-select-dropdown-menu')]",
    },
    TIMING: {
      DEFAULT_WAIT: 500,
      ELEMENT_TIMEOUT: 5000,
      CLICK_WAIT: 300,
      TYPE_WAIT: 200,
      ANIMATION_DURATION: 400,
      TOAST_DURATION: 4000,
      FILTER_WAIT: 400,
    },
    UI: { MODAL_MAX_HEIGHT: "85vh" },
  };

  // ═════════════════════════════════════════════════════════════════
  // ✅ FUNÇÕES UTILITÁRIAS ATUALIZADAS
  // ═════════════════════════════════════════════════════════════════

  /**
   * Normaliza um texto para comparação, removendo acentos, espaços extras,
   * convertendo para minúsculas e aparando espaços no início/fim.
   * @param {string} text O texto a ser normalizado.
   * @returns {string} O texto normalizado.
   */
  const normalizeText = (text = "") => {
    if (typeof text !== 'string') return '';
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  };

  const waitForElementEnabled = async (selector, isXPath = false, timeout = 10000) => {
    const log = (msg, status = 'info') => {
      const prefix = "[Service Selection]";
      switch (status) {
        case 'success': console.log(`%c${prefix} ✅ ${msg}`, 'color: #10b981; font-weight: bold;'); break;
        case 'error': console.error(`${prefix} ❌ ${msg}`); break;
        case 'wait': console.log(`%c${prefix} ⏳ ${msg}`, 'color: #f59e0b;'); break;
        default: console.info(`%c${prefix} ➡️ ${msg}`, 'color: #3b82f6;'); break;
      }
    };

    log(`Aguardando elemento ser habilitado: '${selector}'`, 'wait');
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const element = isXPath
          ? document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
          : document.querySelector(selector);

        if (element) {
          const isDisabled =
            element.closest('nz-select')?.classList.contains('ant-select-disabled') ||
            element.classList.contains('ant-select-disabled') ||
            element.disabled;

            if (!isDisabled) {
              log(`Elemento habilitado encontrado: '${selector}'`, 'success');
              return element;
            }
        }
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        log(`Erro ao verificar elemento: ${err.message}`, 'error');
        await new Promise(r => setTimeout(r, 200));
      }
    }
    log(`Timeout: Elemento não habilitado após ${timeout}ms: '${selector}'`, 'error');
    return null;
  };


  // ═════════════════════════════════════════════════════════════════
  // 🧠 CLASSE PRINCIPAL
  // ═════════════════════════════════════════════════════════════════
  class AttendanceAutomation {
    constructor() {
      this.allItems = [];
      this.filteredItems = [];
      this.selectedFilters = [];
      this.availableFilters = [];
      this.selectedItem = null;
      this.finalMessage = "";
      this.isLoading = false;
      this.isFilterExpanded = true;
      this.cssContent = "";
      this.htmlContent = "";
      this.accordionStates = {
        messageCard: true,
        tagCard: true,
        actionCard: true
      };
      this.init();
    }

    async init() {
      try {
        await this.loadAssets();
        const tempBtn = document.getElementById("automationFloatingBtn");
        if (tempBtn) {
            tempBtn.remove();
        }

        this.injectStyles();
        this.injectHTML();

        this.setupEventListeners();
        this.setupAccordionFunctionality();
        this.setupFilters();
        this.filteredItems = [...this.allItems];
        this.showToast("Automação carregada.", "success");
      } catch (error) {
        console.error("Erro na inicialização:", error);
        this.showToast("Falha ao carregar a automação.", "error");

        const tempBtnOnError = document.getElementById("automationFloatingBtn");
        if (tempBtnOnError) {
            tempBtnOnError.remove();
        }
      }
    }

    injectStyles() {
      const s = document.createElement("style");
      s.textContent = this.cssContent;
      document.head.appendChild(s);
    }

    injectHTML() {
      const c = document.createElement("div");
      c.id = "ua-container";
      c.innerHTML = this.htmlContent;
      document.body.appendChild(c);
    }

    async loadAssets() {
      const btn = document.createElement("button");
      btn.id = "automationFloatingBtn";
      btn.className = "ua-automation-floating-btn";
      btn.title = "Carregando...";
      document.body.appendChild(btn);
      const iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-240h560v-400H200v400Z"></path></svg>';

      try {
        this.setLoading(true, btn);

        const [jsonResponse, cssResponse, htmlResponse] = await Promise.all([
            fetch(CONFIG.GITHUB_JSON_URL),
            fetch(CONFIG.CSS_URL),
            fetch(CONFIG.HTML_URL)
        ]);

        if (!jsonResponse.ok) throw new Error(`Falha ao buscar JSON: ${jsonResponse.statusText}`);
        if (!cssResponse.ok) throw new Error(`Falha ao buscar CSS: ${cssResponse.statusText}`);
        if (!htmlResponse.ok) throw new Error(`Falha ao buscar HTML: ${htmlResponse.statusText}`);
        
        const jsonData = await jsonResponse.json();
        this.cssContent = await cssResponse.text();
        this.htmlContent = await htmlResponse.text();

        this.allItems = jsonData.problemas || [];
        if (this.allItems.length === 0) throw new Error("Nenhum problema encontrado no JSON");

      } catch (error) {
        console.error("Erro ao carregar assets:", error);
        this.showToast(error.message, "error");
        throw error;
      } finally {
        this.setLoading(false, btn, iconSVG);
        const tempBtn = document.getElementById("automationFloatingBtn");
        if (tempBtn && !document.getElementById("ua-container")) {
            tempBtn.title = "Abrir Automação (Ctrl + Espaço)";
        }
      }
    }

    setupEventListeners() {
      const floatingBtn = document.getElementById("automationFloatingBtn");
      if (floatingBtn.getAttribute('data-listener-attached')) return;
      
      floatingBtn.addEventListener("click", () => this.toggleModal(true));
      this.makeDraggable(floatingBtn);
      floatingBtn.setAttribute('data-listener-attached', 'true');

      document
        .getElementById("automationOverlay")
        .addEventListener("click", () => this.toggleModal(false));

      const searchInput = document.getElementById("searchInput");
      searchInput.addEventListener("input", this.handleSearch.bind(this));
      searchInput.addEventListener(
        "keydown",
        this.handleSearchKeydown.bind(this)
      );

      document
        .getElementById("clearButton")
        .addEventListener("click", this.resetSelection.bind(this));
      document
        .getElementById("dropdown")
        .addEventListener("click", this.handleDropdownClick.bind(this));

      document
        .getElementById("filterAccordionHeader")
        .addEventListener("click", this.toggleFilterAccordion.bind(this));

      document
        .getElementById("clearFiltersBtn")
        .addEventListener("click", this.clearAllFilters.bind(this));

      [
        "holderCheckbox",
        "speakerInput",
        "relationshipSelect",
        "observationsTextarea",
        "externalCallCheckbox",
        "reminderCheckbox",
        "importantCheckbox",
        "fallbackTagCheckbox",
      ].forEach(id =>
        document
          .getElementById(id)
          .addEventListener("input", this.updatePreview.bind(this))
      );

      document
        .getElementById("editButton")
        .addEventListener("click", this.openEditModal.bind(this));
      document
        .getElementById("sendButton")
        .addEventListener("click", this.executeAutomation.bind(this));
      document
        .getElementById("saveEditButton")
        .addEventListener("click", this.saveEdit.bind(this));
      document
        .getElementById("cancelEditButton")
        .addEventListener("click", () => this.toggleEditModal(false));
      document.addEventListener("keydown", this.handleGlobalKeydown.bind(this));

      document.addEventListener("click", (e) => {
        try {
          if (e.target?.classList?.contains("ua-checkmark")) {
            const checkbox = e.target.previousElementSibling;
            if (checkbox?.type === "checkbox") {
              checkbox.checked = !checkbox.checked;
              checkbox.dispatchEvent(new Event("input", { bubbles: true }));
              checkbox.dispatchEvent(new Event("change", { bubbles: true }));
            }
            return;
          }
          const container = e.target.closest?.(".ua-checkbox-container");
          if (container) {
            if (e.target.closest("input") || e.target.closest("label") || e.target.closest(".ua-checkmark")) return;
            const checkbox = container.querySelector('input[type="checkbox"]');
            if (checkbox) {
              checkbox.checked = !checkbox.checked;
              checkbox.dispatchEvent(new Event("input", { bubbles: true }));
              checkbox.dispatchEvent(new Event("change", { bubbles: true }));
            }
            return;
          }
        } catch (err) {
          console.error("[UA] Erro no listener global de click:", err);
        }
      });
    }

    setupAccordionFunctionality() {
      window.toggleAccordion = (cardId) => {
        this.accordionStates[cardId] = !this.accordionStates[cardId];
        const content = document.getElementById(`${cardId}Content`);
        const icon = document.getElementById(`${cardId}Icon`);
        content.classList.toggle("ua-expanded", this.accordionStates[cardId]);
        icon.classList.toggle("ua-expanded", this.accordionStates[cardId]);
      };
    }

    setupFilters() {
      const allFilters = new Set();
      this.allItems.forEach(item => {
        if (item.filtro && Array.isArray(item.filtro)) {
          item.filtro.forEach(filter => allFilters.add(filter));
        }
      });

      this.availableFilters = Array.from(allFilters).sort();
      this.renderFilterOptions();
      this.updateFilterCount();
    }

    renderFilterOptions() {
      const filterOptions = document.getElementById("filterOptions");
      filterOptions.innerHTML = "";

      this.availableFilters.forEach(filter => {
        const filterOption = document.createElement("label");
        filterOption.className = "ua-filter-option";
        filterOption.innerHTML = `
          <input type="checkbox" value="${filter}" data-filter="${filter}">
          <span class="ua-checkmark"></span>
          <span class="ua-filter-label">${filter}</span>
        `;

        const checkbox = filterOption.querySelector('input[type="checkbox"]');
        checkbox.addEventListener("change", (e) => {
          this.handleFilterChange(filter, e.target.checked);
        });

        filterOptions.appendChild(filterOption);
      });
    }

    toggleFilterAccordion() {
      this.isFilterExpanded = !this.isFilterExpanded;
      const content = document.getElementById("filterAccordionContent");
      const icon = document.getElementById("filterAccordionIcon");

      content.classList.toggle("ua-expanded", this.isFilterExpanded);
      icon.classList.toggle("ua-expanded", this.isFilterExpanded);
    }

    handleFilterChange(filter, isChecked) {
      if (isChecked) {
        if (!this.selectedFilters.includes(filter)) {
          this.selectedFilters.push(filter);
        }
      } else {
        this.selectedFilters = this.selectedFilters.filter(f => f !== filter);
      }

      this.updateFilteredItems();
      this.updateFilterCount();
      this.updateClearFiltersButton();
    }

    updateFilteredItems() {
      if (this.selectedFilters.length === 0) {
        this.filteredItems = [...this.allItems];
      } else {
        this.filteredItems = this.allItems.filter(item => {
          if (!item.filtro || !Array.isArray(item.filtro)) return false;
          return this.selectedFilters.some(selectedFilter =>
            item.filtro.includes(selectedFilter)
          );
        });
      }

      const searchInput = document.getElementById("searchInput");
      if (this.filteredItems.length === 0) {
        searchInput.value = "";
        searchInput.disabled = true;
        searchInput.placeholder = "Nenhum item para os filtros selecionados";
        this.showDropdown(false);
      } else {
        searchInput.disabled = false;
        searchInput.placeholder = "Buscar problema...";
      }

      if (searchInput.value.trim()) {
        this.handleSearch({ target: searchInput });
      }
    }

    updateFilterCount() {
      const badge = document.getElementById("filterCountBadge");
      const count = this.selectedFilters.length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    clearAllFilters() {
      this.selectedFilters = [];
      document
        .querySelectorAll('#filterOptions input[type="checkbox"]')
        .forEach(cb => (cb.checked = false));
      this.updateFilteredItems();
      this.updateFilterCount();
      this.updateClearFiltersButton();
    }

    updateClearFiltersButton() {
      const clearBtn = document.getElementById("clearFiltersBtn");
      clearBtn.classList.toggle("ua-hidden", this.selectedFilters.length === 0);
    }

    setLoading(isLoading, button, defaultContent = "") {
      this.isLoading = isLoading;
      if (!button) return;
      button.disabled = isLoading;
      button.innerHTML = isLoading
        ? '<div class="ua-loading-spinner"></div>'
        : defaultContent;
    }

    toggleModal(show) {
      const modal = document.getElementById("automationModal");
      const overlay = document.getElementById("automationOverlay");
      const btn = document.getElementById("automationFloatingBtn");

      btn.classList.toggle("ua-hidden-by-modal", show);

      if (show) {
        modal.classList.add("ua-show");
        overlay.classList.add("ua-show");
        document.getElementById("searchInput").focus();
      } else {
        modal.classList.remove("ua-show");
        overlay.classList.remove("ua-show");
        this.toggleEditModal(false);
      }
    }

    toggleEditModal(show) {
      document.getElementById("editModal").classList.toggle("ua-show", show);
      if (show) document.getElementById("editMessageTextarea").focus();
    }

    handleSearch(e) {
      const query = normalizeText(e.target.value);
      document.getElementById("clearButton").classList.toggle("ua-hidden", !query);
    
      if (query) {
        const filtered = this.filteredItems.filter(item => {
          const normalizedName = normalizeText(item.nome);
          const normalizedMessage = normalizeText(item.mensagem);
          return normalizedName.includes(query) || normalizedMessage.includes(query);
        });
        this.populateDropdown(filtered, query);
        this.showDropdown(true);
      } else {
        this.showDropdown(false);
      }
    }

    handleSearchKeydown(e) {
      const items = document.querySelectorAll("#dropdown li:not(.ua-dropdown-no-results)");
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        this.navigateDropdown(e.key, items);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const s = document.querySelector("#dropdown li.selected");
        if (s) s.click();
      } else if (e.key === "Escape") {
        this.showDropdown(false);
      }
    }

    navigateDropdown(key, items) {
      if (items.length === 0) return;
      let i = Array.from(items).findIndex(it =>
        it.classList.contains("selected")
      );
      if (i !== -1) items[i].classList.remove("selected");
      if (key === "ArrowDown") i = i < items.length - 1 ? i + 1 : 0;
      else if (key === "ArrowUp") i = i > 0 ? i - 1 : items.length - 1;
      items[i].classList.add("selected");
      items[i].scrollIntoView({ block: "nearest" });
    }

    populateDropdown(items, filter = "") {
      const d = document.getElementById("dropdown");
      if (items.length === 0 && filter) {
          d.innerHTML = `<li class="ua-dropdown-no-results">Nenhum problema encontrado para "${filter}"</li>`;
      } else {
          d.innerHTML = items
              .map(
                  i =>
                      `<li data-id="${i.id}" title="${
              i.mensagem ? i.mensagem.substring(0, 100) + "..." : ""
            }">${i.nome}</li>`
              )
              .join("");
      }
    }

    showDropdown(show) {
      document.getElementById("dropdown").classList.toggle("ua-show", show);
    }

    handleDropdownClick(e) {
      if (e.target.tagName !== "LI" || e.target.classList.contains("ua-dropdown-no-results")) return;
      const id = e.target.dataset.id;
      this.selectedItem = this.allItems.find(i => i.id == id);
      if (this.selectedItem) {
        document.getElementById("searchInput").value = this.selectedItem.nome;
        this.showDropdown(false);
        this.updateUIForSelectedItem();
      }
    }

    resetSelection() {
      this.selectedItem = null;
      const s = document.getElementById("searchInput");
      s.value = "";
      s.dispatchEvent(new Event("input"));
      this.hideRightPanelAndFooter();
    }

    validateProblemServiceConfig(item) {
      const log = this.logStep.bind(this);
      if (!item.externo) {
        log("Item não é externo - sem validação de serviço");
        return true;
      }
      
      const useFallback = document.getElementById("fallbackTagCheckbox").checked;
      const etiquetaExterna = (useFallback || !item.etiquetaExterna) ? item.etiquetaExternaFallback : item.etiquetaExterna;

      if (!etiquetaExterna) {
        log("AVISO: Item externo sem etiqueta externa configurada (principal ou fallback)", 'wait');
        return false;
      }
      if (!item.servicoExterno) {
        log("AVISO: Item externo sem serviço externo configurado", 'wait');
      }
      log(`Config OK - Problema: '${etiquetaExterna}', Serviço: '${item.servicoExterno || 'Nenhum'}'`, 'success');
      return true;
    }

    updateUIForSelectedItem() {
      this.showRightPanelAndFooter();
      document.getElementById("specificationSection").classList.remove("ua-hidden");

      const { externo, aguardar, lembrete } = this.selectedItem;
      document
        .getElementById("externalCallLabel")
        .classList.toggle("ua-hidden", !externo);
      document.getElementById("externalCallCheckbox").checked = false;
      document
        .getElementById("reminderLabel")
        .classList.toggle("ua-hidden", externo);
      document.getElementById("reminderCheckbox").checked =
        !externo && lembrete;

      this.validateProblemServiceConfig(this.selectedItem);

      this.updatePreview();
      this.updateTagPreview();
      this.updateActionPreview();
    }

    showRightPanelAndFooter() {
      document.getElementById("modalRightPanel").classList.remove("ua-hidden");
      document.getElementById("modalFooter").classList.remove("ua-hidden");
      document.getElementById("modalLeftPanel").classList.remove("ua-full-width");
    }

    hideRightPanelAndFooter() {
      document.getElementById("modalRightPanel").classList.add("ua-hidden");
      document.getElementById("modalFooter").classList.add("ua-hidden");
      document.getElementById("modalLeftPanel").classList.add("ua-full-width");
      document.getElementById("specificationSection").classList.add("ua-hidden");
    }

    updatePreview() {
      if (!this.selectedItem) return;

      const isHolder = document.getElementById("holderCheckbox").checked;
      document.getElementById("speakerInfo").classList.toggle("ua-hidden", isHolder);

      const speaker = document.getElementById("speakerInput").value.trim();
      const relation = document.getElementById("relationshipSelect").value;
      const obs = document.getElementById("observationsTextarea").value.trim();

      const mainMsg = this.selectedItem.mensagem || "";
      const obsText = obs ? `\n\nObservações:\n${obs}` : "";

      let message = "";

      if (isHolder) {
        message = `O titular ${mainMsg}${obsText}`;
      } else if (speaker) {
        const relationshipText = relation ? ` (${relation})` : ` (Não informado)`;
        message = `${speaker}${relationshipText}\n\n${mainMsg}${obsText}`;
      } else {
        message = `O cliente ${mainMsg}${obsText}`;
      }

      this.finalMessage = message;
      this.updateMessagePreview();
      this.updateTagPreview();
      this.updateActionPreview();
    }

    updateMessagePreview() {
      const messagePreview = document.getElementById("messagePreview");
      messagePreview.textContent = this.finalMessage;

      const charCount = this.finalMessage.length;
      const wordCount = this.finalMessage.trim().split(/\s+/).filter(w => w.length > 0).length;

      const messageStats = messagePreview.parentElement.querySelector('.ua-message-stats');
      if (messageStats) {
        messageStats.querySelector('.ua-char-count').innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
          </svg>
          ${charCount} caracteres
        `;
        messageStats.querySelector('.ua-word-count').innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          ${wordCount} palavras
        `;
      }
    }

    updateTagPreview() {
      if (!this.selectedItem) return;
      const tagPreview = document.getElementById("tagPreview");
      const tagGrid = tagPreview.querySelector(".ua-tag-grid");
      const useFallback = document.getElementById("fallbackTagCheckbox").checked;
      let tags = [];

      const etiquetaInterna = (useFallback || !this.selectedItem.etiquetaInterna)
        ? this.selectedItem.etiquetaInternaFallback
        : this.selectedItem.etiquetaInterna;
        
      if (etiquetaInterna) {
        tags.push({ text: etiquetaInterna, type: 'internal', category: 'Interna' });
      }

      if (this.selectedItem.externo) {
        const etiquetaExterna = (useFallback || !this.selectedItem.etiquetaExterna)
          ? this.selectedItem.etiquetaExternaFallback
          : this.selectedItem.etiquetaExterna;
        if (etiquetaExterna) {
            tags.push({ text: etiquetaExterna, type: 'external', category: 'Externa' });
        }
      }

      if (this.selectedItem.servicoExterno) {
        tags.push({ text: this.selectedItem.servicoExterno, type: 'service', category: 'Serviço' });
      }

      if (tags.length > 0) {
        const grouped = tags.reduce((acc, tag) => {
          (acc[tag.category] = acc[tag.category] || []).push(tag);
          return acc;
        }, {});
        tagGrid.innerHTML = Object.entries(grouped).map(([cat, arr]) => `
          <div class="ua-tag-group">
            <div class="ua-tag-group-title">${cat}</div>
            <div class="ua-tag-list">
              ${arr.map(t => `<span class="ua-tag-item ${t.type}">${t.text}</span>`).join('')}
            </div>
          </div>
        `).join('');
        tagPreview.classList.remove("ua-hidden");
      } else {
        tagGrid.innerHTML = `<div class="ua-empty-state">
          <svg class="ua-empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6"></path>
          </svg>
          <div class="ua-empty-state-text">Nenhuma tag será aplicada</div>
        </div>`;
        tagPreview.classList.add("ua-hidden");
      }
    }

    updateActionPreview() {
      if (!this.selectedItem) return;
      const actionPreview = document.getElementById("actionPreview");
      const actionList = actionPreview.querySelector(".ua-action-list");
      let actions = [];

      if (document.getElementById("importantCheckbox").checked) {
        actions.push({ text: "Marcar como chamado importante", icon: "alert-circle" });
      }

      if (this.selectedItem.externo) {
        actions.push({ text: "Encaminhar para suporte externo", icon: "external-link" });
        if (document.getElementById("externalCallCheckbox").checked) {
          actions.push({ text: "Aguardar chamado externo", icon: "clock" });
        }
      }

      if (!this.selectedItem.externo && document.getElementById("reminderCheckbox").checked) {
        actions.push({ text: "Adicionar lembrete de retorno", icon: "bell" });
      }

      if (!this.selectedItem.externo && !document.getElementById("reminderCheckbox").checked) {
        actions.push({ text: "Finalizar atendimento", icon: "check-circle" });
      }

      const getIconSVG = (iconName) => {
        const icons = {
          'alert-circle': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
          'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15,3 21,3 21,9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
          'clock': '<circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline>',
          'bell': '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
          'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>'
        };
        return `<svg class="ua-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[iconName] || icons['check-circle']}</svg>`;
      };

      if (actions.length > 0) {
        actionList.innerHTML = actions.map(action =>
          `<div class="ua-action-item">
            ${getIconSVG(action.icon)}
            <span>${action.text}</span>
          </div>`
        ).join('');
        actionPreview.classList.remove("ua-hidden");
      } else {
        actionList.innerHTML = `<div class="ua-empty-state">
          <svg class="ua-empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <div class="ua-empty-state-text">Nenhuma ação será executada</div>
        </div>`;
        actionPreview.classList.add("ua-hidden");
      }
    }

    openEditModal() {
      document.getElementById("editMessageTextarea").value = this.finalMessage;
      this.toggleEditModal(true);
    }

    saveEdit() {
      this.finalMessage = document.getElementById("editMessageTextarea").value;
      document.getElementById("messagePreview").textContent = this.finalMessage;
      this.toggleEditModal(false);
      this.showToast("Mensagem atualizada.", "success");
    }

    makeDraggable(element) {
      let isDragging = false;
      let startX, startY, initialTop, initialRight;

      element.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', endDrag);

      element.addEventListener('touchstart', startDrag, { passive: false });
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('touchend', endDrag);

      function startDrag(e) {
        if (e.type === 'mousedown' && e.button !== 0) return;
        e.preventDefault();
        isDragging = true;
        element.classList.add('ua-dragging');
        element.style.userSelect = 'none';
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        startX = clientX;
        startY = clientY;
        const rect = element.getBoundingClientRect();
        initialTop = rect.top;
        initialRight = window.innerWidth - rect.right;
      }

      function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        let newTop = initialTop + deltaY;
        let newRight = initialRight - deltaX;
        const rect = element.getBoundingClientRect();
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));
        newRight = Math.max(0, Math.min(newRight, window.innerWidth - rect.width));
        element.style.left = 'auto';
        element.style.right = `${newRight}px`;
        element.style.top = `${newTop}px`;
      }

      function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        element.classList.remove('ua-dragging');
        element.style.userSelect = '';
      }
    }

    handleGlobalKeydown(e) {
      if (
        e.key === "Escape" &&
        document.getElementById("automationModal").classList.contains("ua-show")
      )
        this.toggleModal(false);
      if (e.ctrlKey && (e.key === " " || e.code === "Space")) {
        e.preventDefault();
        this.toggleModal(
          !document.getElementById("automationModal").classList.contains("ua-show")
        );
      }
    }

    showToast(message, type = "success") {
      const t = document.createElement("div");
      t.className = `ua-toast ${type}`;
      t.textContent = message;
      document.body.appendChild(t);
      t.offsetHeight;
      t.classList.add("ua-show");
      setTimeout(() => {
        t.classList.remove("ua-show");
        setTimeout(() => t.remove(), 500);
      }, CONFIG.TIMING.TOAST_DURATION);
    }

    logStep(message, status = 'info') {
      const prefix = "[UA Log]";
      switch (status) {
        case 'success':
          console.log(`%c${prefix} ✅ ${message}`, 'color: #10b981; font-weight: bold;');
          break;
        case 'error':
          console.error(`${prefix} ❌ ${message}`);
          break;
        case 'wait':
          console.log(`%c${prefix} ⏳ ${message}`, 'color: #f59e0b;');
          break;
        case 'info':
        default:
          console.info(`%c${prefix} ➡️ ${message}`, 'color: #3b82f6;');
          break;
      }
    }
    
    async executeExternalForwardingFlow(selectedItem, useFallback) {
        const { SELECTORS, TIMING } = CONFIG;
        const log = this.logStep.bind(this);
        const h = {
            wait: async (ms) => {
                log(`Aguardando por ${ms}ms...`, 'wait');
                return new Promise(res => setTimeout(res, ms));
            },
            find: async (s, xpath = false, t = TIMING.ELEMENT_TIMEOUT) => {
                const startTime = Date.now();
                while (Date.now() - startTime < t) {
                    const el = xpath ?
                        document.evaluate(s, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue :
                        document.querySelector(s);
                    if (el) return el;
                    await new Promise(res => setTimeout(res, 200));
                }
                return null;
            },
            click: async (s, xpath = false) => {
                const el = await h.find(s, xpath);
                if (el) {
                    el.click();
                    await h.wait(TIMING.CLICK_WAIT);
                    return true;
                }
                return false;
            },
            type: async (s, txt, xpath = false) => {
                const el = await h.find(s, xpath);
                if (el) {
                    el.value = txt;
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                    await h.wait(TIMING.TYPE_WAIT);
                    return true;
                }
                return false;
            },
        };

        const etiquetaExternaSearchText = (useFallback || !selectedItem.etiquetaExterna) ?
            selectedItem.etiquetaExternaFallback :
            selectedItem.etiquetaExterna;

        if (!etiquetaExternaSearchText) {
            throw new Error("Etiqueta Externa de busca não foi definida para este item.");
        }

        log("Iniciando fluxo de encaminhamento externo.");
        await h.click(SELECTORS.FORWARD_BUTTON);
        await h.wait(TIMING.ANIMATION_DURATION + 200);

        if (document.getElementById("externalCallCheckbox").checked) {
            log("Opção 'Aguardar chamado externo' selecionada.");
            if (!(await h.click("//lib-input-switch//button", true))) {
                throw new Error("Não foi possível clicar no botão SWITCH de 'Aguardar chamado externo'.");
            }
        }
        
        log("Selecionando setor 'suporte externo'.");
        await h.click(SELECTORS.SECTOR_SELECT, true);
        const normalizedSector = normalizeText("suporte externo");
        const sectorOption = await h.find(`//li[contains(@class, 'ant-select-dropdown-menu-item') and normalize-space(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${normalizedSector}']`, true);
        if(!sectorOption) throw new Error("Opção de setor 'suporte externo' não encontrada.");
        sectorOption.click();
        await h.wait(TIMING.CLICK_WAIT);

        log(`Buscando Etiqueta Externa: '${etiquetaExternaSearchText}'`);
        await h.click(SELECTORS.PROBLEM_SELECT, true);
        await h.type(SELECTORS.PROBLEM_SELECT, etiquetaExternaSearchText, true);
        await h.wait(TIMING.FILTER_WAIT);
        
        const problemOptionsNodeList = document.evaluate(`${SELECTORS.GENERIC_DROPDOWN_MENU}//li`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let matchedProblemOption = null;
        for (let i = 0; i < problemOptionsNodeList.snapshotLength; i++) {
            const opt = problemOptionsNodeList.snapshotItem(i);
            if (normalizeText(opt.textContent) === normalizeText(etiquetaExternaSearchText)) {
                matchedProblemOption = opt;
                break;
            }
        }

        if (!matchedProblemOption) {
            throw new Error(`Nenhuma Etiqueta Externa encontrada para '${etiquetaExternaSearchText}'`);
        }

        const selectedProblemText = matchedProblemOption.textContent.trim();
        log(`Etiqueta Externa encontrada e selecionada: '${selectedProblemText}'`, 'success');
        matchedProblemOption.click();
        await h.wait(TIMING.CLICK_WAIT);

        const isMpcRequired = normalizeText(selectedProblemText).includes("mpc");
        log(`Verificação MPC: ${isMpcRequired ? 'OBRIGATÓRIO' : 'NÃO OBRIGATÓRIO'}`);

        log("Aguardando habilitação do campo de serviço...");
        const serviceElement = await waitForElementEnabled(SELECTORS.SERVICE_SELECT, true, 10000);
        if (!serviceElement) throw new Error("Campo de serviço não foi habilitado.");

        await h.click(SELECTORS.SERVICE_SELECT, true);
        await h.wait(TIMING.FILTER_WAIT);

        const serviceOptionsNodeList = document.evaluate(`${SELECTORS.GENERIC_DROPDOWN_MENU}//li`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const serviceOptions = [];
        for (let i = 0; i < serviceOptionsNodeList.snapshotLength; i++) {
            serviceOptions.push(serviceOptionsNodeList.snapshotItem(i));
        }
        const availableServices = serviceOptions.map(opt => normalizeText(opt.textContent));
        log(`Serviços disponíveis: [${availableServices.join(', ')}]`);

        let serviceToSelect = null;

        if (isMpcRequired) {
            if (availableServices.includes(normalizeText("reparo mpc"))) {
                serviceToSelect = normalizeText("reparo mpc");
            } else {
                log("Serviço 'reparo mpc' não encontrado. Selecionando a primeira opção disponível.", 'wait');
                await h.type(SELECTORS.SERVICE_SELECT, '', true); // Limpa o campo
                await h.wait(TIMING.CLICK_WAIT);
                const firstOption = await h.find(`${SELECTORS.GENERIC_DROPDOWN_MENU}//li[1]`, true);
                if (firstOption) {
                    firstOption.click();
                    await h.wait(TIMING.CLICK_WAIT);
                    await h.click("[data-testid='btn-Continuar']");
                    log("Fluxo de encaminhamento externo finalizado com a primeira opção.", 'success');
                    return;
                } else {
                    throw new Error("Regra MPC: Serviço 'reparo mpc' não encontrado e nenhuma outra opção disponível.");
                }
            }
        } else {
            const priorityList = [
                normalizeText(selectedItem.servicoExterno),
                normalizeText("reparo rápido"),
                normalizeText("reparo físico"),
                normalizeText("serviço adicional"),
                normalizeText("reparo mpc")
            ].filter(Boolean);

            for (const priority of priorityList) {
                if (availableServices.includes(priority)) {
                    serviceToSelect = priority;
                    break;
                }
            }

            if (!serviceToSelect) {
                 throw new Error("Nenhum serviço prioritário ou de fallback foi encontrado.");
            }
        }

        log(`Serviço selecionado pela lógica: '${serviceToSelect}'`, 'success');
        const serviceOptionToClick = serviceOptions.find(opt => normalizeText(opt.textContent) === serviceToSelect);
        if (serviceOptionToClick) {
            serviceOptionToClick.click();
            await h.wait(TIMING.CLICK_WAIT);
        } else {
            throw new Error(`Elemento da opção de serviço '${serviceToSelect}' não pôde ser clicado.`);
        }

        await h.click("[data-testid='btn-Continuar']");
        log("Fluxo de encaminhamento externo finalizado.", 'success');
    }
    
    async executeAutomation() {
      if (!this.selectedItem || this.isLoading) return;

      this.logStep("================ INICIANDO AUTOMAÇÃO ================", "info");

      const sendButton = document.getElementById("sendButton");
      this.setLoading(true, sendButton, "📤 Enviar");
      this.toggleModal(false);

      const { SELECTORS, TIMING } = CONFIG;
      const log = this.logStep.bind(this);
      const useFallback = document.getElementById("fallbackTagCheckbox").checked;

      const h = {
        wait: async (ms) => {
          log(`Aguardando por ${ms}ms...`, 'wait');
          return new Promise(res => setTimeout(res, ms));
        },
        find: async (s, xpath = false, t = TIMING.ELEMENT_TIMEOUT) => {
          log(`Buscando elemento: '${s}' (XPath: ${xpath})`);
          const startTime = Date.now();
          while (Date.now() - startTime < t) {
            const el = xpath
              ? document.evaluate(s, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
              : document.querySelector(s);
            if (el) {
              log(`Elemento encontrado: '${s}'`, 'success');
              return el;
            }
            await new Promise(res => setTimeout(res, 200));
          }
          log(`Elemento NÃO encontrado após ${t}ms: '${s}'`, 'error');
          return null;
        },
        click: async (s, xpath = false) => {
          log(`Tentando clicar no elemento: '${s}'`);
          const el = await h.find(s, xpath);
          if (el) {
            el.click();
            await h.wait(TIMING.CLICK_WAIT);
            log(`Clique realizado com sucesso em: '${s}'`, 'success');
            return true;
          }
          log(`Falha ao clicar: elemento não encontrado '${s}'`, 'error');
          return false;
        },
        type: async (s, txt, xpath = false) => {
          log(`Tentando digitar no elemento: '${s}'`);
          const el = await h.find(s, xpath);
          if (el) {
            el.value = txt;
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
            await h.wait(TIMING.TYPE_WAIT);
            log(`Texto inserido com sucesso em: '${s}'`, 'success');
            return true;
          }
          log(`Falha ao digitar: elemento não encontrado '${s}'`, 'error');
          return false;
        },
      };
      
      const handleNzSelect = async ({ inputSelector, valueToType, optionText }) => {
        log(`Iniciando seleção em dropdown. Opção desejada: '${optionText}'`);
      
        if (!(await h.click(inputSelector, true))) {
          throw new Error(`Não foi possível clicar no input do select: ${inputSelector}`);
        }
      
        if (!(await h.find(SELECTORS.GENERIC_DROPDOWN_MENU, true))) {
          throw new Error("Dropdown do select não apareceu.");
        }
      
        if (valueToType) {
          if (!(await h.type(inputSelector, valueToType, true))) {
            throw new Error(`Não foi possível digitar em: ${inputSelector}`);
          }
          await h.wait(TIMING.FILTER_WAIT);
        }
      
        const normalizedOptionText = normalizeText(optionText);
        const optionSelector = `//li[contains(@class, 'ant-select-dropdown-menu-item') and normalize-space(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${normalizedOptionText}']`;
        
        if (await h.click(optionSelector, true)) {
          log(`Opção '${optionText}' encontrada e clicada com sucesso.`, 'success');
        } else {
          throw new Error(`Não foi possível encontrar a opção exata: ${optionText}`);
        }
      };

      try {
        log("Etapa 1 & 2: Executando envio de mensagem e etiquetagem interna em paralelo.");
        const automationTasks = [];

        const sendMessageTask = async () => {
          log("Sub-tarefa: Inserir e enviar mensagem principal.");
          if (!(await h.find(SELECTORS.MAIN_TEXT_AREA))) {
            log(`Área de texto principal ('${SELECTORS.MAIN_TEXT_AREA}') não encontrada. Tentando clicar no botão de upload para revelá-la.`);
            await h.click(SELECTORS.UPLOAD_BUTTON);
          }
          if (!(await h.type(SELECTORS.MAIN_TEXT_AREA, this.finalMessage))) {
            throw new Error("Não foi possível digitar na área de texto.");
          }

          if (document.getElementById("importantCheckbox").checked) {
            log("Chamado marcado como importante. Tentando clicar no botão de importância.");
            await h.click(SELECTORS.IMPORTANT_BUTTON);
          }
          
          if (!(await h.click(SELECTORS.MAIN_SEND_BUTTON))) {
            throw new Error("Não foi possível clicar no envio principal.");
          }
        };
        automationTasks.push(sendMessageTask());
        
        const etiquetaInterna = (useFallback || !this.selectedItem.etiquetaInterna)
          ? this.selectedItem.etiquetaInternaFallback
          : this.selectedItem.etiquetaInterna;

        if (etiquetaInterna) {
          const addInternalTagTask = async () => {
            log("Sub-tarefa: Aplicar tag interna.");
            if (await h.click(SELECTORS.TAG_ADD_BUTTON, true)) {
              await handleNzSelect({
                inputSelector: SELECTORS.TAG_INPUT,
                valueToType: etiquetaInterna,
                optionText: etiquetaInterna,
              });
              await h.click("[data-testid='btn-Concluir']");
            } else {
              log("Botão de adicionar tag não encontrado, pulando etapa de tag.", 'wait');
            }
          };
          automationTasks.push(addInternalTagTask());
        }

        await Promise.all(automationTasks);
        log("Etapas de mensagem e tag concluídas.", 'success');
        
        log("Etapa 3: Iniciando ações pós-envio.");
        if (this.selectedItem.externo) {
          await this.executeExternalForwardingFlow(this.selectedItem, useFallback);
        } else if (document.getElementById("reminderCheckbox").checked) {
          log("Adicionando lembrete.");
          if (await h.click(SELECTORS.MORE_BUTTON)) {
            await h.click("//nz-list-item[span[text()='Adicionar lembrete']]", true);
            await h.type("#titulo", "Fazer retorno");
            await h.click("//button/span[contains(text(), 'Concluir')]", true);
            log("Lembrete adicionado com sucesso.", 'success');
          }
        } else {
          log("Finalizando atendimento (padrão).");
          if (await h.click(SELECTORS.MORE_BUTTON)) {
            await h.click("//nz-list-item[span[text()='Finalizar']]", true);
            log("Atendimento finalizado com sucesso.", 'success');
          }
        }

        this.showToast("Automação concluída com sucesso!", "success");
        log("================ AUTOMAÇÃO CONCLUÍDA ================", "success");

      } catch (error) {
        log(`ERRO na automação: ${error.message}`, "error");
        console.error("Stacktrace do erro:", error);
        this.showToast(error.message, "error");
      } finally {
        this.setLoading(false, sendButton, "📤 Enviar");
        this.resetSelection();
        log("Limpeza finalizada e estado inicial restaurado.", "info");
      }
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      AttendanceAutomation
    };
  }

  new AttendanceAutomation();
})();
