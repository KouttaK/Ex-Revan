// ==UserScript==
// @name         Máscara de Atendimento v4.6 - Enhanced UI with Redesigned Right Panel
// @namespace    http://tampermonkey.net/
// @version      4.6-redesigned
// @description  Sistema de automação com filtros avançados, interface melhorada e seção de resumo redesenhada para consistência visual.
// @author       Assistant & User
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
    GITHUB_JSON_URL:
      "https://raw.githubusercontent.com/KouttaK/Ex-Revan/main/data/problemas.json",
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

  // ═══════════════════════════════════════════════════════════════════
  // 🎨 ESTILOS MODERNOS E ELEGANTES (Enhanced with Redesigned Right Panel)
  // ═══════════════════════════════════════════════════════════════════
  const CSS_STYLES = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --primary-light: #dbeafe;
    --success-color: #10b981;
    --success-hover: #059669;
    --success-light: #d1fae5;
    --warning-color: #f59e0b;
    --warning-hover: #d97706;
    --warning-light: #fef3c7;
    --danger-color: #ef4444;
    --danger-hover: #dc2626;
    --danger-light: #fee2e2;
    --secondary-color: #6b7280;
    --secondary-hover: #4b5563;
    --light-color: #f8fafc;
    --dark-color: #1e293b;
    --border-color: #e2e8f0;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    --border-radius: 12px;
    --border-radius-sm: 8px;
    --border-radius-lg: 16px;
    --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06);
    --box-shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04);
    --box-shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, .25);
    --transition: all .3s cubic-bezier(.4, 0, .2, 1);
    --transition-fast: all .15s ease-out;
    --gradient-primary: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
    --gradient-success: linear-gradient(135deg, var(--success-color) 0%, var(--success-hover) 100%)
    --gradient-card: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    --gradient-message: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    --card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --card-shadow-hover: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    
    /* Redesigned Right Panel Variables - UPDATED TO ORANGE GRADIENT */
    --right-panel-gradient: linear-gradient(135deg, #f03200 0%, #e02500 50%, #d41f00 100%);
    --right-panel-card-bg: rgba(255, 255, 255, 0.1);
    --right-panel-card-border: rgba(255, 255, 255, 0.2);
    --right-panel-text: #ffffff;
    --right-panel-text-secondary: rgba(255, 255, 255, 0.8);
    --right-panel-text-muted: rgba(255, 255, 255, 0.6);
}

.ua-automation-floating-btn {
    position: fixed;
    top: 96px;
    right: 24px;
    width: 56px;
    height: 56px;
    background: var(--gradient-primary);
    color: white;
    border: none;
    border-radius: var(--border-radius-lg);
    cursor: grab;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    box-shadow: var(--box-shadow-lg);
    transition: var(--transition);
    user-select: none;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, .1);
    touch-action: none;
}

.ua-automation-floating-btn:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: var(--box-shadow-xl)
}

.ua-automation-floating-btn:active {
    transform: scale(.95);
    cursor: grabbing;
}

.ua-automation-floating-btn.ua-hidden-by-modal {
    opacity: 0;
    pointer-events: none;
    transform: scale(.8)
}

.ua-automation-floating-btn.ua-dragging {
    cursor: grabbing;
    transform: scale(1.05);
    z-index: 10005;
}

.ua-automation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, .7);
    backdrop-filter: blur(8px);
    z-index: 10000;
    opacity: 0;
    transition: var(--transition);
    pointer-events: none
}

.ua-automation-overlay.ua-show {
    opacity: 1;
    pointer-events: auto
}

.ua-automation-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(.9);
    width: 100%;
    max-width: 84vh;
    max-height:${CONFIG.UI.MODAL_MAX_HEIGHT};
    min-height: 50%;
    background: white;
    border-radius: var(--border-radius-lg);
    z-index: 10001;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transition: var(--transition);
    overflow: hidden;
    pointer-events: none;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.ua-automation-modal.ua-show {
    opacity: 1;
    transform: translate(-50%, -50%);
    pointer-events: auto
}

.ua-automation-modal-content {
    flex-grow: 1;
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;
    background: white;
    position: relative;
    display: flex;
    min-height: 400px;
}

/* Left Panel - Options */
.ua-modal-left-panel {
    flex: 1;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
    padding: 24px;
    overflow-y: auto;
    position: relative;
    transition: var(--transition);
}

.ua-modal-left-panel.ua-full-width {
    flex: 1;
}

.ua-left-panel-header {
    margin: 0 0 14px 0;
    padding-bottom: 16px;
}

.ua-left-panel-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -.025em;
    color: white;
    text-align: center;
}

.ua-modal-left-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(35deg, rgb(0 89 218) 0%, rgb(0 22 85) 50%, rgb(12 62 171) 100%);
    pointer-events: none;
}

.ua-modal-left-panel > * {
    position: relative;
    z-index: 1;
}

/* ═══════════════════════════════════════════════════════════════════
   🎯 ENHANCED ACCORDION FILTER SECTION
   ═══════════════════════════════════════════════════════════════════ */

.ua-filter-section {
    margin-bottom: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
    transition: var(--transition);
}

.ua-filter-accordion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: var(--transition-fast);
    user-select: none;
}

.ua-filter-accordion-header:hover {
    background: rgba(255, 255, 255, 0.1);
}

.ua-filter-header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.ua-filter-header-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: white;
}

.ua-filter-count-badge {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 20px;
    text-align: center;
}

.ua-filter-accordion-icon {
    color: white;
    transition: var(--transition);
    width: 20px;
    height: 20px;
}

.ua-filter-accordion-icon.ua-expanded {
    transform: rotate(180deg);
}

.ua-clear-filters-btn {
    background: rgba(239, 68, 68, 0.2);
    color: white;
    border: 1px solid rgba(239, 68, 68, 0.4);
    padding: 6px 12px;
    border-radius: var(--border-radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-fast);
    margin-left: 8px;
}

.ua-clear-filters-btn:hover {
    background: var(--danger-color);
    border-color: var(--danger-color);
    transform: translateY(-1px);
}

.ua-filter-accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ua-filter-accordion-content.ua-expanded {
    max-height: 500px;
}

.ua-filter-options {
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

/* ═══════════════════════════════════════════════════════════════════
   ✅ ENHANCED CHECKBOX STYLING (Consistent across all sections)
   ═══════════════════════════════════════════════════════════════════ */

.ua-filter-option,
.ua-checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 12px;
    border-radius: var(--border-radius-sm);
    transition: var(--transition-fast);
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    user-select: none;
}

.ua-filter-option:hover,
.ua-checkbox-container:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
}

.ua-filter-option:active,
.ua-checkbox-container:active {
    transform: translateY(0);
}

/* Custom Checkbox Styling */
.ua-filter-option input[type="checkbox"],
.ua-checkbox-container input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    left: 12px;
    margin: 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.ua-filter-label,
.ua-checkbox-container label {
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
    margin-left: 32px;
    cursor: pointer;
    line-height: 1.4;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    flex: 1;
}

/* Custom Checkmark */
.ua-checkmark {
    position: absolute;
    left: 12px;
    height: 20px;
    width: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    transition: var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}

.ua-filter-option:hover .ua-checkmark,
.ua-checkbox-container:hover .ua-checkmark {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
}

.ua-filter-option input:checked ~ .ua-checkmark,
.ua-checkbox-container input:checked ~ .ua-checkmark {
    background: white;
    border-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.ua-checkmark::after {
    content: "";
    position: absolute;
    display: none;
    width: 6px;
    height: 10px;
    border: solid var(--primary-color);
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}

.ua-filter-option input:checked ~ .ua-checkmark::after,
.ua-checkbox-container input:checked ~ .ua-checkmark::after {
    display: block;
}

/* ═══════════════════════════════════════════════════════════════════
   🎨 REDESIGNED RIGHT PANEL - RESUMO DO ENVIO (UPDATED WITH ORANGE GRADIENT)
   ═══════════════════════════════════════════════════════════════════ */

/* Right Panel - REDESIGNED to match left panel styling with ORANGE gradient */
.ua-modal-right-panel {
    flex: 1;
    background: var(--right-panel-gradient);
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.ua-modal-right-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgb(0 89 218) 0%, rgb(0 22 85) 50%, rgb(12 62 171) 100%);
    pointer-events: none;
}

.ua-modal-right-panel > * {
    position: relative;
    z-index: 1;
}

.ua-preview-section {
    margin: 0;
    padding: 8px 24px 24px;
    flex: 1;
    overflow-y: auto;
}

.ua-preview-section h3 {
    color: var(--right-panel-text);
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -.025em;
    text-align: center;
    padding: 16px 0;
    position: relative;
    border: 0;
}

.ua-preview-section h3 svg {
    color: var(--right-panel-text);
}

/* Enhanced Summary Container - Accordion Style */
.ua-summary-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* REDESIGNED Summary Cards - Accordion Style */
.ua-summary-card {
    background: var(--right-panel-card-bg);
    border-radius: var(--border-radius);
    backdrop-filter: blur(10px);
    border: 1px solid var(--right-panel-card-border);
    overflow: hidden;
    transition: var(--transition);
}

.ua-summary-card:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
}

/* REDESIGNED Card Headers - Accordion Style */
.ua-automation-card-header {
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: var(--transition-fast);
    user-select: none;
}

.ua-automation-card-header:hover {
    background: rgba(255, 255, 255, 0.1);
}

.ua-automation-card-header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.ua-automation-card-header h4 {
    font-size: 1.125rem;
    margin: 0;
    font-weight: 600;
    color: var(--right-panel-text);
}

.ua-card-icon {
    width: 20px;
    height: 20px;
    color: var(--right-panel-text);
    flex-shrink: 0;
}

.ua-card-badge {
    background: rgba(16, 185, 129, 0.2);
    color: var(--right-panel-text);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid rgba(16, 185, 129, 0.4);
}

.ua-accordion-icon {
    color: var(--right-panel-text);
    transition: var(--transition);
    width: 16px;
    height: 16px;
}

.ua-accordion-icon.ua-expanded {
    transform: rotate(180deg);
}

/* REDESIGNED Card Content */
.ua-card-content {
    padding: 20px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ua-card-content.ua-expanded {
    max-height: 600px;
}

/* REDESIGNED Message Preview */
.ua-message-preview {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: var(--border-radius-sm);
    white-space: pre-wrap;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 0.875rem;
    min-height: 140px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--right-panel-text);
    line-height: 1.6;
    position: relative;
    backdrop-filter: blur(10px);
    transition: var(--transition);
}

.ua-message-preview:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
}

/* REDESIGNED Character Counter */
.ua-message-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.75rem;
    color: var(--right-panel-text-secondary);
}

.ua-char-count,
.ua-word-count {
    display: flex;
    align-items: center;
    gap: 6px;
}

.ua-char-count svg,
.ua-word-count svg {
    color: var(--right-panel-text-secondary);
}

/* REDESIGNED Tag Preview Styles */
.ua-tag-preview {
    margin: 0;
    padding: 0;
}

.ua-tag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.ua-tag-group {
    background: rgba(255, 255, 255, 0.1);
    padding: 12px;
    border-radius: var(--border-radius-sm);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
}

.ua-tag-group-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--right-panel-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
}

.ua-tag-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.ua-tag-item {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    color: var(--right-panel-text);
    padding: 6px 12px;
    border-radius: 14px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: var(--transition-fast);
    backdrop-filter: blur(10px);
}

.ua-tag-item:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
}

.ua-tag-item.external {
    background: rgba(245, 158, 11, 0.3);
    border-color: rgba(245, 158, 11, 0.4);
}

.ua-tag-item.external:hover {
    background: rgba(245, 158, 11, 0.4);
    border-color: rgba(245, 158, 11, 0.5);
}

.ua-tag-item.service {
    background: rgba(16, 185, 129, 0.3);
    border-color: rgba(16, 185, 129, 0.4);
}

.ua-tag-item.service:hover {
    background: rgba(16, 185, 129, 0.4);
    border-color: rgba(16, 185, 129, 0.5);
}

/* REDESIGNED Action Preview Styles */
.ua-action-preview {
    margin: 0;
    padding: 0;
}

.ua-action-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ua-action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-sm);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--right-panel-text);
    transition: var(--transition-fast);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.ua-action-item:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateX(4px);
}

.ua-action-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: rgba(16, 185, 129, 0.8);
    transition: var(--transition-fast);
}

.ua-action-item:hover::before {
    width: 4px;
    background: rgba(16, 185, 129, 1);
}

.ua-action-icon {
    width: 16px;
    height: 16px;
    color: var(--right-panel-text);
    flex-shrink: 0;
}

/* REDESIGNED Empty States */
.ua-empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--right-panel-text-muted);
}

.ua-empty-state-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
    opacity: 0.5;
    color: var(--right-panel-text-muted);
}

.ua-empty-state-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--right-panel-text-secondary);
}

.ua-automation-modal-content::-webkit-scrollbar {
    width: 8px
}

.ua-automation-modal-content::-webkit-scrollbar-track {
    background: var(--light-color);
    border-radius: 4px
}

.ua-automation-modal-content::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
    border-radius: 4px;
    transition: var(--transition-fast)
}

.ua-automation-modal-content::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-hover)
}

.ua-automation-modal-footer {
    padding: 24px 32px;
    background: linear-gradient(90deg, #001550, #00185c);
}

.ua-search-container {
    position: relative;
    margin-bottom: 24px;
    z-index: 10;
}

.ua-search-input {
    width: 100%;
    padding: 16px 48px 16px 20px;
    box-sizing: border-box;
    border: 0;
    font-size: 1rem;
    font-family: inherit;
    transition: var(--transition);
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
}

.ua-search-input:focus {
    outline: none;
    background: #ffffff42;
    transform: translateY(-1px);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.ua-search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.ua-clear-button {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(239, 68, 68, 0.1);
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: var(--danger-color);
    padding: 8px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-fast);
    backdrop-filter: blur(10px);
}

.ua-clear-button:hover {
    background: var(--danger-color);
    color: white;
    transform: translateY(-50%) scale(1.1);
}

.ua-dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border-top: none;
    margin-top: 4px;
    box-shadow: var(--box-shadow-lg);
    z-index: 1000;
    list-style: none;
    padding: 0;
    margin-left: 0;
    margin-right: 0;
    max-height: 240px;
    overflow-y: auto;
    overflow-x: hidden;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
}

.ua-dropdown-content::-webkit-scrollbar {
    width: 6px;
}

.ua-dropdown-content::-webkit-scrollbar-track {
    background: var(--light-color);
    border-radius: 3px;
}

.ua-dropdown-content::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
    border-radius: 3px;
}

.ua-dropdown-content::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-hover);
}

.ua-dropdown-content.ua-show {
    display: block;
    animation: slideDown .2s ease-out
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-8px)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

.ua-dropdown-content li {
    padding: 16px 20px;
    cursor: pointer;
    transition: var(--transition-fast);
    border-bottom: 1px solid #e2e8f047;
    font-weight: 500;
    color: white;
}

.ua-dropdown-content li:hover,
.ua-dropdown-content li.selected {
    background: #bdd6ff24;
    color: white;
    transform: translateX(4px)
}

.ua-dropdown-content li:last-child {
    border-bottom: none
}

/* ═══════════════════════════════════════════════════════════════════
   ⚙️ ENHANCED SPECIFICATIONS SECTION
   ═══════════════════════════════════════════════════════════════════ */

.ua-form-section {
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: var(--transition);
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.ua-form-section h3 {
    margin: 0 0 20px 0;
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.ua-form-input,
.ua-form-select {
    width: 100%;
    padding: 14px 16px;
    margin-top: 8px;
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-sm);
    font-size: .95rem;
    font-family: inherit;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transition: var(--transition);
    backdrop-filter: blur(10px);
}

.ua-form-input:focus,
.ua-form-select:focus {
    outline: none;
    border-color: white;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.15);
}

.ua-form-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

/* ═══════════════════════════════════════════════════════════════════
   📝 ENHANCED TEXTAREA STYLING
   ═══════════════════════════════════════════════════════════════════ */

.ua-form-textarea {
    width: 100%;
    padding: 16px;
    margin-top: 8px;
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-sm);
    font-size: .95rem;
    font-family: inherit;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transition: var(--transition);
    backdrop-filter: blur(10px);
    resize: vertical;
    min-height: 100px;
    line-height: 1.6;
    position: relative;
}

.ua-form-textarea:focus {
    outline: none;
    border-color: white;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.15);
}

.ua-form-textarea::placeholder {
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
}

/* Custom resize handle styling */
.ua-form-textarea::-webkit-resizer {
    background: linear-gradient(-45deg, 
        transparent 0%, 
        transparent 25%, 
        rgba(255, 255, 255, 0.3) 25%, 
        rgba(255, 255, 255, 0.3) 50%, 
        transparent 50%, 
        transparent 75%, 
        rgba(255, 255, 255, 0.3) 75%);
    border-radius: 0 0 var(--border-radius-sm) 0;
}

/* Specifications Container Grid */
#checkboxesContainer {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .ua-preview-section {
        padding: 16px;
    }
    
    .ua-preview-section h3 {
        font-size: 1.25rem;
        padding: 12px 0;
    }
    
    .ua-summary-container {
        gap: 12px;
    }
    
    .ua-card-content {
        padding: 16px;
    }
    
    .ua-tag-grid {
        grid-template-columns: 1fr;
        gap: 8px;
    }
    
    .ua-message-preview {
        font-size: 0.8rem;
        min-height: 120px;
        padding: 16px;
    }
}

.ua-btn {
    padding: 14px 28px;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    transition: var(--transition);
    text-transform: none;
    letter-spacing: -.025em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: var(--box-shadow)
}

.ua-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .2), transparent);
    transition: left .5s
}

.ua-btn:hover::before {
    left: 100%
}

.ua-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg)
}

.ua-btn:active {
    transform: translateY(0)
}

.ua-btn:disabled {
    cursor: not-allowed;
    opacity: .6;
    transform: none !important
}

.ua-btn-primary {
    background: var(--gradient-primary);
    color: white
}

.ua-btn-success {
    background: var(--gradient-success);
    color: white
}

.ua-btn-secondary {
    background: linear-gradient(135deg, #0e3da3 0%, #0157d3 100%);
    color: white;
}

.ua-button-container {
    display: flex;
    gap: 16px;
    justify-content: space-between
}

.ua-button-container .ua-btn {
    flex: 1;
    min-height: 52px
}

.ua-edit-modal {
    position: fixed;
    z-index: 10002;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, .8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition);
    pointer-events: none
}

.ua-edit-modal.ua-show {
    opacity: 1;
    pointer-events: auto
}

.ua-edit-modal-content {
    background: white;
    padding: 32px;
    width: 90%;
    max-width: 800px;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--box-shadow-xl);
    transform: scale(.9);
    transition: var(--transition);
    border: 1px solid var(--border-color)
}

.ua-edit-modal.ua-show .ua-edit-modal-content {
    transform: scale(1)
}

.ua-edit-modal h3 {
    margin: 0 0 24px 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 12px
}

.ua-edit-modal-textarea {
    width: 100%;
    min-height: 320px;
    padding: 20px;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: .9rem;
    resize: vertical;
    transition: var(--transition);
    line-height: 1.6;
    background: linear-gradient(135deg, #fff 0%, #f8fafc 100%)
}

.ua-edit-modal-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px var(--primary-light)
}

.ua-edit-modal-buttons {
    margin-top: 24px;
    display: flex;
    gap: 16px;
    justify-content: flex-end
}

.ua-loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, .3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}

.ua-toast {
    position: fixed;
    top: 24px;
    right: -400px;
    padding: 16px 24px;
    background: var(--success-color);
    color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-lg);
    z-index: 10003;
    transition: right .5s cubic-bezier(.68, -.55, .27, 1.55);
    font-family: inherit;
    font-weight: 500;
    max-width: 350px;
    border: 1px solid rgba(255, 255, 255, .2)
}

.ua-toast.ua-show {
    right: 24px
}

.ua-toast.error {
    background: var(--danger-color)
}

.ua-toast.warning {
    background: var(--warning-color);
    color: var(--dark-color)
}

.ua-hidden {
    display: none !important
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

.ua-form-section {
    animation: fadeInUp .3s ease-out
}

/* ═══════════════════════════════════════════════════════════════════
   📱 RESPONSIVE DESIGN ENHANCEMENTS
   ═══════════════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
    .ua-automation-modal {
        width: 95%;
        max-height: 90vh;
    }

    .ua-automation-modal-content {
        flex-direction: column;
    }

    .ua-modal-left-panel,
    .ua-modal-right-panel {
        flex: none;
    }

    .ua-modal-left-panel {
        min-height: 300px;
    }

    .ua-automation-modal-content {
        padding: 20px
    }

    .ua-automation-modal-footer {
        padding: 16px 20px
    }

    .ua-button-container {
        flex-direction: column
    }

    .ua-edit-modal-content {
        width: 95%;
        padding: 20px
    }

    /* Mobile filter options - single column */
    .ua-filter-options {
        grid-template-columns: 1fr;
    }

    /* Adjust accordion content max-height for mobile */
    .ua-filter-accordion-content.ua-expanded {
        max-height: 400px;
    }

    /* Mobile specifications grid */
    #checkboxesContainer {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .ua-filter-accordion-header {
        padding: 16px;
    }

    .ua-filter-options {
        padding: 16px;
        gap: 8px;
    }

    .ua-filter-option,
    .ua-checkbox-container {
        padding: 10px;
    }

    .ua-form-section {
        padding: 16px;
    }

    .ua-filter-header-content h3 {
        font-size: 1rem;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .ua-filter-option,
    .ua-checkbox-container {
        border-width: 2px;
    }

    .ua-checkmark {
        border-width: 3px;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}`;

  const HTML_STRUCTURE = `<button id="automationFloatingBtn" class="ua-automation-floating-btn" title="Abrir Automação (Ctrl + Espaço)"></button>
<div id="automationOverlay" class="ua-automation-overlay"></div>
<div id="automationModal" class="ua-automation-modal">
    <div class="ua-automation-modal-content">
        <div class="ua-modal-left-panel" id="modalLeftPanel">
            <div class="ua-left-panel-header">
                <h2>Máscara de Atendimento</h2>
            </div>
            
            <!-- Enhanced Accordion Filter Section -->
            <div class="ua-filter-section" id="filterSection">
                <div class="ua-filter-accordion-header" id="filterAccordionHeader">
                    <div class="ua-filter-header-content">
                        <h3>🔍 Filtros</h3>
                        <span class="ua-filter-count-badge" id="filterCountBadge">0</span>
                        <button class="ua-clear-filters-btn ua-hidden" id="clearFiltersBtn" title="Limpar todos os filtros">
                            Limpar
                        </button>
                    </div>
                    <svg class="ua-filter-accordion-icon" id="filterAccordionIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </div>
                <div class="ua-filter-accordion-content ua-expanded" id="filterAccordionContent">
                    <div class="ua-filter-options" id="filterOptions">
                        <!-- Filtros serão inseridos dinamicamente aqui -->
                    </div>
                </div>
            </div>
            
            <div class="ua-search-container">
                <input type="text" id="searchInput" class="ua-search-input" placeholder="Buscar problema..." autocomplete="off">
                <button class="ua-clear-button ua-hidden" id="clearButton" title="Limpar busca">×</button>
                <ul id="dropdown" class="ua-dropdown-content"></ul>
            </div>
            
            <!-- Enhanced Specifications Section -->
            <div id="specificationSection" class="ua-form-section ua-hidden">
                <h3>⚙️ Especificações do Atendimento</h3>
                <div class="ua-checkbox-container">
                    <input type="checkbox" id="holderCheckbox" checked>
                    <span class="ua-checkmark"></span>
                    <label for="holderCheckbox">👤 Fala com o titular</label>
                </div>
                <div id="speakerInfo" class="ua-hidden">
                    <input type="text" id="speakerInput" class="ua-form-input" placeholder="Nome de quem fala...">
                    <select id="relationshipSelect" class="ua-form-select">
                        <option value="" disabled selected>Selecione o grau de parentesco</option>
                        <option value="Cônjuge">Cônjuge</option>
                        <option value="Filho(a)">Filho(a)</option>
                        <option value="Pai/Mãe">Pai/Mãe</option>
                        <option value="Irmão(ã)">Irmão(ã)</option>
                        <option value="Avô/Avó">Avô/Avó</option>
                        <option value="Tio(a)">Tio(a)</option>
                        <option value="Primo(a)">Primo(a)</option>
                        <option value="Outro">Outro</option>
                    </select>
                </div>
                <textarea id="observationsTextarea" class="ua-form-textarea" placeholder="Digite suas observações adicionais aqui..."></textarea>
                <div id="checkboxesContainer">
                    <div class="ua-checkbox-container ua-hidden" id="externalCallLabel">
                        <input type="checkbox" id="externalCallCheckbox">
                        <span class="ua-checkmark"></span>
                        <label for="externalCallCheckbox">📞 Aguardar chamado externo</label>
                    </div>
                    <div class="ua-checkbox-container ua-hidden" id="reminderLabel">
                        <input type="checkbox" id="reminderCheckbox">
                        <span class="ua-checkmark"></span>
                        <label for="reminderCheckbox">⏰ Finalizar com lembrete</label>
                    </div>
                    <div class="ua-checkbox-container">
                        <input type="checkbox" id="importantCheckbox">
                        <span class="ua-checkmark"></span>
                        <label for="importantCheckbox">⚠️ Chamado importante</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="ua-modal-right-panel ua-hidden" id="modalRightPanel">
            <div id="previewSection" class="ua-preview-section">
                <h3>
                    Resumo do Envio
                </h3>
                
                <div class="ua-summary-container">
                    <!-- Message Preview Card - Now Accordion Style -->
                    <div class="ua-summary-card message-card">
                        <div class="ua-automation-card-header" onclick="toggleAccordion('messageCard')">
                            <div class="ua-automation-card-header-content">
                                <svg class="ua-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <h4>Prévia da Mensagem</h4>
                            </div>
                            <svg class="ua-accordion-icon ua-expanded" id="messageCardIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                        </div>
                        <div class="ua-card-content ua-expanded" id="messageCardContent">
                            <div id="messagePreview" class="ua-message-preview"></div>
                            <div class="ua-message-stats">
                                <div class="ua-char-count"></div>
                                <div class="ua-word-count"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tags Preview Card - Now Accordion Style -->
                    <div id="tagPreview" class="ua-summary-card tags-card ua-hidden">
                        <div class="ua-automation-card-header" onclick="toggleAccordion('tagCard')">
                            <div class="ua-automation-card-header-content">
                                <svg class="ua-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                </svg>
                                <h4>Tags e Etiquetas</h4>
                            </div>
                            <svg class="ua-accordion-icon ua-expanded" id="tagCardIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                        </div>
                        <div class="ua-card-content ua-expanded" id="tagCardContent">
                            <div class="ua-tag-grid"></div>
                        </div>
                    </div>
                    
                    <!-- Actions Preview Card - Now Accordion Style -->
                    <div id="actionPreview" class="ua-summary-card actions-card ua-hidden">
                        <div class="ua-automation-card-header" onclick="toggleAccordion('actionCard')">
                            <div class="ua-automation-card-header-content">
                                <svg class="ua-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                                <h4>Ações do Sistema</h4>
                                <span class="ua-card-badge">Auto</span>
                            </div>
                            <svg class="ua-accordion-icon ua-expanded" id="actionCardIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                        </div>
                        <div class="ua-card-content ua-expanded" id="actionCardContent">
                            <div class="ua-action-list"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="ua-automation-modal-footer ua-hidden" id="modalFooter">
        <div class="ua-button-container" id="buttonContainer">
            <button class="ua-btn ua-btn-secondary" id="editButton">✏️ Editar</button>
            <button class="ua-btn ua-btn-success" id="sendButton">📤 Enviar</button>
        </div>
    </div>
</div>
<div id="editModal" class="ua-edit-modal">
    <div class="ua-edit-modal-content">
        <h3>✏️ Editar Mensagem</h3>
        <textarea id="editMessageTextarea" class="ua-edit-modal-textarea"></textarea>
        <div class="ua-edit-modal-buttons">
            <button class="ua-btn ua-btn-secondary" id="cancelEditButton">Cancelar</button>
            <button class="ua-btn ua-btn-primary" id="saveEditButton">💾 Salvar</button>
        </div>
    </div>
</div>`;

  // ═══════════════════════════════════════════════════════════════════
  // 🧠 CLASSE PRINCIPAL - AUTOMAÇÃO DE ATENDIMENTO (Enhanced)
  // ═══════════════════════════════════════════════════════════════════
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
      this.accordionStates = {
        messageCard: true,
        tagCard: true,
        actionCard: true
      };
      this.init();
    }

    async init() {
      this.injectStyles();
      this.injectHTML();
      this.setupEventListeners();
      this.setupAccordionFunctionality();
      await this.loadData();
    }

    injectStyles() {
      const s = document.createElement("style");
      s.textContent = CSS_STYLES;
      document.head.appendChild(s);
    }

    injectHTML() {
      const c = document.createElement("div");
      c.innerHTML = HTML_STRUCTURE;
      document.body.appendChild(c);
    }

    setupEventListeners() {
      const floatingBtn = document.getElementById("automationFloatingBtn");
      floatingBtn.addEventListener("click", () => this.toggleModal(true));
      this.makeDraggable(floatingBtn);

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

      // Enhanced accordion event listeners
      document
        .getElementById("filterAccordionHeader")
        .addEventListener("click", this.toggleFilterAccordion.bind(this));

      // Filter event listeners
      document
        .getElementById("clearFiltersBtn")
        .addEventListener("click", this.clearAllFilters.bind(this));

      // Enhanced specifications event listeners
      [
        "holderCheckbox",
        "speakerInput",
        "relationshipSelect",
        "observationsTextarea",
        "externalCallCheckbox",
        "reminderCheckbox",
        "importantCheckbox",
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
    }

    // New method to setup accordion functionality for right panel
    setupAccordionFunctionality() {
      // Make toggleAccordion available globally for onclick handlers
      window.toggleAccordion = (cardId) => {
        this.accordionStates[cardId] = !this.accordionStates[cardId];
        const content = document.getElementById(`${cardId}Content`);
        const icon = document.getElementById(`${cardId}Icon`);
        
        content.classList.toggle("ua-expanded", this.accordionStates[cardId]);
        icon.classList.toggle("ua-expanded", this.accordionStates[cardId]);
      };
    }

    async loadData() {
      const btn = document.getElementById("automationFloatingBtn");
      const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-240h560v-400H200v400Z"/></svg>`;
      try {
        this.setLoading(true, btn);
        const response = await fetch(CONFIG.GITHUB_JSON_URL);
        if (!response.ok)
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        this.allItems = data.problemas || [];
        if (this.allItems.length === 0)
          throw new Error("Nenhum problema encontrado no JSON");
        
        this.setupFilters();
        this.filteredItems = [...this.allItems];
        this.showToast("Automação carregada.", "success");
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        this.showToast("Erro ao carregar dados.", "error");
      } finally {
        this.setLoading(false, btn, iconSVG);
      }
    }

    setupFilters() {
      // Extract unique filters from all items
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
      
      // Clear search if no items match current filters
      const searchInput = document.getElementById("searchInput");
      if (this.filteredItems.length === 0) {
        searchInput.value = "";
        this.showDropdown(false);
      } else if (searchInput.value.trim()) {
        // Refresh search results with new filtered items
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
      
      // Uncheck all filter checkboxes
      const filterCheckboxes = document.querySelectorAll('#filterOptions input[type="checkbox"]');
      filterCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      
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
      const filter = e.target.value.toLowerCase().trim();
      document
        .getElementById("clearButton")
        .classList.toggle("ua-hidden", !filter);
      if (filter) {
        const f = this.filteredItems.filter(
          i =>
            i.nome.toLowerCase().includes(filter) ||
            (i.mensagem && i.mensagem.toLowerCase().includes(filter))
        );
        this.populateDropdown(f);
        this.showDropdown(f.length > 0);
      } else {
        this.showDropdown(false);
      }
    }

    handleSearchKeydown(e) {
      const items = document.querySelectorAll("#dropdown li");
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

    populateDropdown(items) {
      const d = document.getElementById("dropdown");
      d.innerHTML = items
        .map(
          i =>
            `<li data-id="${i.id}" title="${
              i.mensagem ? i.mensagem.substring(0, 100) + "..." : ""
            }">${i.nome}</li>`
        )
        .join("");
    }

    showDropdown(show) {
      document.getElementById("dropdown").classList.toggle("ua-show", show);
    }

    handleDropdownClick(e) {
      if (e.target.tagName !== "LI") return;
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

    updateUIForSelectedItem() {
      this.showRightPanelAndFooter();
      
      document.getElementById("specificationSection").classList.remove("ua-hidden");
      
      const { externo, aguardar, lembrete } = this.selectedItem;
      document
        .getElementById("externalCallLabel")
        .classList.toggle("ua-hidden", !externo);
      // Set "aguardar chamado" checkbox to unchecked by default
      document.getElementById("externalCallCheckbox").checked = false;
      document
        .getElementById("reminderLabel")
        .classList.toggle("ua-hidden", externo);
      document.getElementById("reminderCheckbox").checked =
        !externo && lembrete;
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
            // Caso 1: Fala com o titular.
            message = `O titular ${mainMsg}${obsText}`;
        } else {
            if (speaker) {
                // Caso 2: Não é o titular, mas o nome de quem fala foi preenchido.
                const relationshipText = relation ? ` (${relation})` : ` (Não informado)`;
                message = `${speaker}${relationshipText}\n\n${mainMsg}${obsText}`;
            } else {
                // Caso 3: Não é o titular e o nome não foi preenchido.
                message = `O cliente ${mainMsg}${obsText}`;
            }
        }

        this.finalMessage = message;
        this.updateMessagePreview();
        this.updateTagPreview();
        this.updateActionPreview();
    }

    updateMessagePreview() {
        const messagePreview = document.getElementById("messagePreview");
        messagePreview.textContent = this.finalMessage;
        
        // Update message statistics
        const charCount = this.finalMessage.length;
        const wordCount = this.finalMessage.trim().split(/\s+/).filter(word => word.length > 0).length;
        
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
      
      let tags = [];
      
      // Add internal tag if exists
      if (this.selectedItem.etiquetaInterna) {
        tags.push({
          text: this.selectedItem.etiquetaInterna,
          type: 'internal',
          category: 'Interna'
        });
      }
      
      // Add external tag if exists
      if (this.selectedItem.externo && this.selectedItem.etiquetaExterna) {
        tags.push({
          text: this.selectedItem.etiquetaExterna,
          type: 'external',
          category: 'Externa'
        });
      }
      
      // Add service tag if exists
      if (this.selectedItem.servicoExterno) {
        tags.push({
          text: this.selectedItem.servicoExterno,
          type: 'service',
          category: 'Serviço'
        });
      }
      
      if (tags.length > 0) {
        // Group tags by category
        const groupedTags = tags.reduce((groups, tag) => {
          if (!groups[tag.category]) groups[tag.category] = [];
          groups[tag.category].push(tag);
          return groups;
        }, {});
        
        tagGrid.innerHTML = Object.entries(groupedTags).map(([category, categoryTags]) => `
          <div class="ua-tag-group">
            <div class="ua-tag-group-title">${category}</div>
            <div class="ua-tag-list">
              ${categoryTags.map(tag => `<span class="ua-tag-item ${tag.type}">${tag.text}</span>`).join('')}
            </div>
          </div>
        `).join('');
        tagPreview.classList.remove("ua-hidden");
      } else {
        tagGrid.innerHTML = `
          <div class="ua-empty-state">
            <svg class="ua-empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6"></path>
            </svg>
            <div class="ua-empty-state-text">Nenhuma tag será aplicada</div>
          </div>
        `;
        tagPreview.classList.add("ua-hidden");
      }
    }

    updateActionPreview() {
      if (!this.selectedItem) return;
      
      const actionPreview = document.getElementById("actionPreview");
      const actionList = actionPreview.querySelector(".ua-action-list");
      
      let actions = [];
      
      // Check for important checkbox
      if (document.getElementById("importantCheckbox").checked) {
        actions.push({
          text: "Marcar como chamado importante",
          icon: "alert-circle"
        });
      }
      
      // Check for external forwarding
      if (this.selectedItem.externo) {
        actions.push({
          text: "Encaminhar para suporte externo",
          icon: "external-link"
        });
        
        if (document.getElementById("externalCallCheckbox").checked) {
          actions.push({
            text: "Aguardar chamado externo",
            icon: "clock"
          });
        }
      }
      
      // Check for reminder
      if (!this.selectedItem.externo && document.getElementById("reminderCheckbox").checked) {
        actions.push({
          text: "Adicionar lembrete de retorno",
          icon: "bell"
        });
      }
      
      // Default action
      if (!this.selectedItem.externo && !document.getElementById("reminderCheckbox").checked) {
        actions.push({
          text: "Finalizar atendimento",
          icon: "check-circle"
        });
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
        actionList.innerHTML = `
          <div class="ua-empty-state">
            <svg class="ua-empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <div class="ua-empty-state-text">Nenhuma ação será executada</div>
          </div>
        `;
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

    async executeAutomation() {
      if (!this.selectedItem || this.isLoading) return;
      const sendButton = document.getElementById("sendButton");
      this.setLoading(true, sendButton, "📤 Enviar");
      this.toggleModal(false);

      const { SELECTORS, TIMING } = CONFIG;
      const h = {
        wait: ms => new Promise(res => setTimeout(res, ms)),
        find: async (s, xpath = false, t = TIMING.ELEMENT_TIMEOUT) => {
          for (let i = 0; i < t / 200; i++) {
            const el = xpath
              ? document.evaluate(s, document, null, 9, null).singleNodeValue
              : document.querySelector(s);
            if (el) return el;
            await h.wait(200);
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
          console.warn(`Click falhou: ${s}`);
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
          console.warn(`Type falhou: ${s}`);
          return false;
        },
      };

      const handleNzSelect = async ({
        inputSelector,
        valueToType,
        optionText,
      }) => {
        if (!(await h.click(inputSelector, true)))
          throw new Error(
            `Não foi possível clicar no input do select: ${inputSelector}`
          );
        if (!(await h.find(SELECTORS.GENERIC_DROPDOWN_MENU, true)))
          throw new Error("Dropdown do select não apareceu.");
        if (valueToType) {
          if (!(await h.type(inputSelector, valueToType, true)))
            throw new Error(`Não foi possível digitar em: ${inputSelector}`);
          await h.wait(TIMING.FILTER_WAIT);
        }
        const optionSelector = `//li[contains(@class, 'ant-select-dropdown-menu-item') and contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${optionText.toLowerCase()}')]`;
        if (!(await h.click(optionSelector, true)))
          throw new Error(`Não foi possível selecionar a opção: ${optionText}`);
      };

      try {
        if (!(await h.find(SELECTORS.MAIN_TEXT_AREA)))
          await h.click(SELECTORS.UPLOAD_BUTTON);
        if (!(await h.type(SELECTORS.MAIN_TEXT_AREA, this.finalMessage)))
          throw new Error("Não foi possível digitar na área de texto.");
        if (document.getElementById("importantCheckbox").checked)
          await h.click(SELECTORS.IMPORTANT_BUTTON);
        if (!(await h.click(SELECTORS.MAIN_SEND_BUTTON)))
          throw new Error("Não foi possível clicar no envio principal.");
        await h.wait(TIMING.DEFAULT_WAIT);

        if (this.selectedItem.etiquetaInterna) {
          if (await h.click(SELECTORS.TAG_ADD_BUTTON, true)) {
            await handleNzSelect({
              inputSelector: SELECTORS.TAG_INPUT,
              valueToType: this.selectedItem.etiquetaInterna,
              optionText: this.selectedItem.etiquetaInterna,
            });
            await h.click("[data-testid='btn-Concluir']");
          } else {
            console.warn(
              "Botão de adicionar tag não encontrado, pulando etapa."
            );
          }
        }

        if (this.selectedItem.externo) {
          await h.click(SELECTORS.FORWARD_BUTTON);
          if (document.getElementById("externalCallCheckbox").checked)
            await h.click("//lib-input-switch//button", true);

          await handleNzSelect({
            inputSelector: SELECTORS.SECTOR_SELECT,
            optionText: "suporte externo",
          });
          await handleNzSelect({
            inputSelector: SELECTORS.PROBLEM_SELECT,
            valueToType: this.selectedItem.etiquetaExterna,
            optionText: this.selectedItem.etiquetaExterna,
          });
          
          await h.wait(TIMING.DEFAULT_WAIT); // Aguarda para o campo de serviço ser habilitado

          if (this.selectedItem.servicoExterno) {
            await handleNzSelect({
              inputSelector: SELECTORS.SERVICE_SELECT,
              valueToType: this.selectedItem.servicoExterno,
              optionText: this.selectedItem.servicoExterno,
            });
          }
          await h.click("[data-testid='btn-Continuar']");
        } else if (document.getElementById("reminderCheckbox").checked) {
          if (await h.click(SELECTORS.MORE_BUTTON)) {
            await h.click(
              "//nz-list-item[span[text()='Adicionar lembrete']]",
              true
            );
            await h.type("#titulo", "Fazer retorno");
            await h.click("//button/span[contains(text(), 'Concluir')]", true);
          }
        } else {
          if (await h.click(SELECTORS.MORE_BUTTON))
            await h.click("//nz-list-item[span[text()='Finalizar']]", true);
        }
        this.showToast("Automação concluída com sucesso!", "success");
      } catch (error) {
        console.error("Erro na automação:", error);
        this.showToast(error.message, "error");
      } finally {
        this.setLoading(false, sendButton, "📤 Enviar");
        this.resetSelection();
      }
    }
  }

  new AttendanceAutomation();
})();
