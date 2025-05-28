// Função para injetar os estilos CSS
function injetarCSS() {
  // Criar elemento style
  const style = document.createElement("style");
  style.textContent = `
    /* Estilos gerais da interface */
    :root {
      /* Paleta Light Minimalista */
      --cor-primaria: #008ef7; 
      --cor-primaria-hover: #0056b3; 
      --cor-primaria-texto: #FFFFFF;
      
      --cor-header-fundo: #0D1A3F; 
      --cor-header-texto: #FFFFFF;
      --cor-searchbar-fundo: #FFFFFF;
      --cor-searchbar-texto: #333333;
      --sombra-searchbar: 0 4px 12px rgba(0,0,0,0.1); /* Sombra mais pronunciada */

      --cor-secundaria: #6c757d; 
      --cor-secundaria-hover: #5a6268;
      --cor-secundaria-texto: #FFFFFF;

      --cor-sucesso: #28a745; 
      --cor-sucesso-hover: #218838;
      
      --cor-fundo-sidebar: #ffffff; 
      --cor-fundo-elemento-hover: #F0F0F0; 
      
      --cor-borda: #DEE2E6; 
      --cor-borda-input: #CED4DA; 
      --cor-borda-input-focus: var(--cor-primaria);
      --cor-linha-divisoria: #E9ECEF; 

      --cor-texto-principal: #212529; 
      --cor-texto-secundario: #495057; 
      --cor-texto-label: #343A40;
      --cor-texto-input: #495057; 

      --sombra-sidebar: 2px 0 15px rgba(0, 0, 0, 0.08); 
      --sombra-input-focus: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); 
      --border-radius-padrao: 8px; 
      --font-family-padrao: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

      --svg-checkmark: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='2 6 4.5 8.5 10 3'%3E%3C/polyline%3E%3C/svg%3E");
    }

    body.sidebar-aberta {
      overflow: hidden;
    }

    #sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0); 
      backdrop-filter: blur(3px); 
      -webkit-backdrop-filter: blur(3px); 
      z-index: 998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease-in-out, background-color 0.3s ease-in-out, visibility 0s linear 0.3s; 
    }

    #sidebar-overlay.visivel {
      background-color: rgba(0, 0, 0, 0.15); 
      opacity: 1;
      visibility: visible;
      transition: opacity 0.3s ease-in-out, background-color 0.3s ease-in-out; 
    }

    .atendimento-container.sidebar {
      position: fixed;
      top: 0;
      right: -420px; /* Initial position, adjust as needed */
      width: 410px; /* Width of the sidebar */
      height: 100vh;
      box-shadow: var(--sombra-sidebar);
      background-color: var(--cor-header-fundo); 
      transition: right 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      font-family: var(--font-family-padrao);
      color: var(--cor-texto-principal);
    }
    
    .atendimento-container.sidebar.aberto {
      right: 0;
    }

    #sidebar-trigger {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 30px; 
      height: 120px; 
      background-color: var(--cor-primaria);
      color: var(--cor-primaria-texto);
      writing-mode: vertical-rl;
      text-orientation: mixed;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999;
      border-top-left-radius: var(--border-radius-padrao);
      border-bottom-left-radius: var(--border-radius-padrao);
      font-size: 13px; 
      font-weight: 500;
      padding: 10px 5px;
      box-shadow: -2px 2px 8px rgba(0,0,0,0.1);
      transition: right 0.3s ease-in-out, opacity 0.3s ease-in-out, background-color 0.2s ease;
      opacity: 1;
      letter-spacing: 0.5px;
    }
    #sidebar-trigger:hover {
      background-color: var(--cor-primaria-hover);
    }

    #sidebar-trigger.oculto {
      opacity: 0;
      right: -35px; 
      pointer-events: none;
    }

    .atendimento-container.sidebar .atendimento-header {
      display: flex;
      justify-content: center; 
      align-items: center;
      padding: 52px 22px 40px 22px; /* Adjusted padding-bottom for search bar overlap */
      background-color: var(--cor-header-fundo);
      color: var(--cor-header-texto);
      position: relative; 
      z-index: 1; 
      border-bottom: none; 
    }

    .atendimento-container.sidebar .atendimento-header h2 {
      margin: 0;
      font-size: 1.6rem; 
      font-weight: 500; 
    }
    
    #search-area-wrapper {
      padding: 0 25px;
      position: relative;
      z-index: 2;
      max-width: 320px;
      margin-bottom: 36px;
    }

    #problema-cliente { 
        width: 100%;
        padding: 14px 18px; 
        border: none; 
        border-radius: var(--border-radius-padrao);
        font-size: 0.95rem; 
        color: var(--cor-searchbar-texto);
        background-color: var(--cor-searchbar-fundo);
        box-shadow: var(--sombra-searchbar);
        margin-top: 0; 
    }
    #problema-cliente::placeholder {
        color: #868e96;
        opacity: 1;
    }
    #problema-cliente:focus {
        box-shadow: var(--sombra-input-focus), var(--sombra-searchbar); 
        outline: none;
    }
     .autocomplete-container { 
        position: relative; 
    }
    #autocomplete-lista { 
        position: absolute;
        top: calc(100% + 5px); 
        left: 0;
        right: 0;
        background: var(--cor-fundo-sidebar); 
        border: 1px solid var(--cor-borda);
        max-height: 200px; 
        overflow-y: auto;
        z-index: 1002; 
        border-radius: var(--border-radius-padrao); 
        box-shadow: 0 5px 12px rgba(0,0,0,0.1); 
        width: 354px;
    }
    .atendimento-container.sidebar .autocomplete-item {
      padding: 12px 16px; 
      cursor: pointer;
      font-size: 0.9rem;
      color: var(--cor-texto-principal);
      transition: background-color 0.15s ease, color 0.15s ease; 
      border-bottom: 1px solid var(--cor-linha-divisoria); 
    }
    .atendimento-container.sidebar .autocomplete-item:last-child {
        border-bottom: none; 
    }
    .atendimento-container.sidebar .autocomplete-item:hover {
      background-color: var(--cor-fundo-elemento-hover); 
      color: var(--cor-primaria); 
    }

    .atendimento-container.sidebar .atendimento-form {
      padding: 28px 25px 25px 25px; /* Adjusted padding-top for search bar overlap */
      overflow-y: auto;
      flex-grow: 1;
      background-color: var(--cor-fundo-sidebar); 
      position: relative; 
      z-index: 0; 
      border-top-left-radius: 20px; 
      border-top-right-radius: 20px;
      margin-top: -20px; 
    }
    .atendimento-container.sidebar .atendimento-form::-webkit-scrollbar {
      width: 8px;
    }
    .atendimento-container.sidebar .atendimento-form::-webkit-scrollbar-track {
      background: #f1f1f1; 
      border-radius: 10px;
    }
    .atendimento-container.sidebar .atendimento-form::-webkit-scrollbar-thumb {
      background: #ccc; 
      border-radius: 10px;
    }
    .atendimento-container.sidebar .atendimento-form::-webkit-scrollbar-thumb:hover {
      background: #aaa; 
    }

    .atendimento-container.sidebar .atendimento-secao {
      margin-bottom: 25px; 
      padding: 0; 
      border: none;
      background-color: transparent;
      box-shadow: none;
    }
     .atendimento-container.sidebar .atendimento-secao:last-child {
        margin-bottom: 0;
     }
    .atendimento-container.sidebar .atendimento-secao:not(:last-child)::after {
        content: '';
        display: block;
        height: 1px;
        border-top: 1px dotted var(--cor-linha-divisoria);
        margin-top: 25px; 
    }
    /* Styling for the new title in problem options */
    .atendimento-container.sidebar #secao-opcoes-problema .opcoes-problema-titulo {
        border-bottom: 1px solid var(--cor-linha-divisoria);
        padding-bottom: 8px;
        margin-top: 0; /* Reset top margin if needed */
    }


    .atendimento-container.sidebar .entrada-texto:not(#problema-cliente), 
    .atendimento-container.sidebar .entrada-select,
    .atendimento-container.sidebar .entrada-textarea {
      width: 100%;
      padding: 10px 14px; 
      border: 1px solid var(--cor-borda-input);
      border-radius: var(--border-radius-padrao);
      box-sizing: border-box;
      font-size: 0.9rem; 
      margin-top: 6px; 
      color: var(--cor-texto-input);
      background-color: #FFFFFF; 
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .atendimento-container.sidebar .entrada-texto:not(#problema-cliente)::placeholder,
    .atendimento-container.sidebar .entrada-textarea::placeholder {
        color: #868e96; 
        opacity: 1; 
    }
    .atendimento-container.sidebar .entrada-texto:not(#problema-cliente):focus,
    .atendimento-container.sidebar .entrada-select:focus,
    .atendimento-container.sidebar .entrada-textarea:focus {
      border-color: var(--cor-borda-input-focus);
      box-shadow: var(--sombra-input-focus);
      outline: none;
    }
    .atendimento-container.sidebar .entrada-textarea {
      resize: vertical;
      min-height: 70px; 
    }
    .atendimento-container.sidebar .entrada-select {
      appearance: none;
      -webkit-appearance: none; 
      -moz-appearance: none; 
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343A40' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M2 6l6 6 6-6'/%3E%3C/svg%3E"); 
      background-repeat: no-repeat;
      background-position: right 14px center; 
      background-size: 9px; 
      padding-right: 35px; 
    }
    .atendimento-container.sidebar .entrada-select option {
        background-color: #FFFFFF;
        color: var(--cor-texto-input);
    }

    .atendimento-container.sidebar .atendimento-campo > label:not(.titular-selector-label) { 
      font-weight: 500;
      font-size: 0.875rem; 
      color: var(--cor-texto-label);
      display: block;
      margin-bottom: 4px; 
    }
    .atendimento-container.sidebar .atendimento-campo {
        margin-bottom: 18px; 
    }
    .atendimento-container.sidebar .atendimento-campo:last-child {
        margin-bottom: 0; 
    }
    
    .titular-selector-label, .atendimento-container.sidebar #secao-opcoes-problema .opcoes-problema-titulo { 
        display: block;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #000C3E;
        margin: 0 auto;
    }
    .titular-selector-container {
      display: flex;
      border: 1px solid var(--cor-borda-input);
      border-radius: var(--border-radius-padrao);
      overflow: hidden; 
    }
    .titular-selector-option {
      flex: 1;
      padding: 9px 10px; 
      text-align: center;
      cursor: pointer;
      background-color: var(--cor-fundo-sidebar); 
      color: var(--cor-texto-secundario);
      font-size: 0.875rem; 
      font-weight: 500;
      transition: background-color 0.2s ease, color 0.2s ease;
      border-right: 1px solid var(--cor-borda-input); 
    }
    .titular-selector-option:last-child {
      border-right: none;
    }
    .titular-selector-option.active {
      background-color: var(--cor-primaria);
      color: var(--cor-primaria-texto);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); 
    }
    .titular-selector-option:hover:not(.active) {
      background-color: var(--cor-fundo-elemento-hover); 
    }
    
    .atendimento-container.sidebar .checkbox-container {
      display: flex;
      align-items: center;
      margin-top: 10px;
      cursor: pointer;
      position: relative;
      padding: 5px 0; 
    }
    .atendimento-container.sidebar .checkbox-container input[type="checkbox"] {
      opacity: 0;
      position: absolute;
      width: 1px; 
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }
    .atendimento-container.sidebar .checkbox-container label {
      font-weight: normal; 
      font-size: 0.9rem; 
      color: var(--cor-texto-label);
      padding-left: 28px; 
      position: relative;
      line-height: 18px; 
      user-select: none; 
    }
    .atendimento-container.sidebar .checkbox-container label::before { 
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      border: 1.5px solid var(--cor-borda-input); 
      background-color: #FFFFFF;
      border-radius: 4px; 
      transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
    }
    .atendimento-container.sidebar .checkbox-container input[type="checkbox"]:checked + label::before {
      background-color: var(--cor-primaria);
      border-color: var(--cor-primaria);
      background-image: var(--svg-checkmark); 
      background-repeat: no-repeat;
      background-position: center;
      background-size: 60%; 
    }
    .atendimento-container.sidebar .checkbox-container input[type="checkbox"]:focus + label::before {
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); 
    }
     .atendimento-container.sidebar .checkbox-container:hover label::before {
        border-color: var(--cor-primaria); 
    }

    .atendimento-container.sidebar .preview-wrapper { 
        background-color: transparent; 
        padding: 0; 
        border-radius: 0;
        border: none; 
    }
    .atendimento-container.sidebar .preview-container { 
      margin-top: 0; 
      padding: 0; 
      background-color: transparent; 
      border-radius: 0;
      border: none;
    }
    .atendimento-container.sidebar .preview-etiquetas .etiqueta {
      margin-bottom: 8px;
      padding: 5px 10px; 
      border-radius: var(--border-radius-padrao);
      font-size: 0.8rem; 
      font-weight: 500;
      display: inline-block; 
      margin-right: 6px;
    }
    .atendimento-container.sidebar .etiqueta-interna { background-color: #e9ecef; color: var(--cor-texto-secundario); border: 1px solid #dee2e6;}
    .atendimento-container.sidebar .etiqueta-externa { background-color: #cfe2ff; color: #004085; border: 1px solid #b8daff;} 
    .atendimento-container.sidebar .etiqueta-titulo { font-weight: 600; margin-right: 5px;}
    
    .atendimento-container.sidebar .preview-vazio { 
      text-align: center; 
      color: var(--cor-texto-secundario); 
      padding: 20px 15px; 
      font-style: italic;
      background-color: transparent; 
      border-radius: var(--border-radius-padrao);
      border: 1px dashed var(--cor-borda-input); 
    }
    .atendimento-container.sidebar .preview-vazio p { margin: 0; }

    .atendimento-container.sidebar .atendimento-botoes {
      padding: 18px 22px;
      border-top: 1px solid var(--cor-linha-divisoria); 
      background-color: var(--cor-fundo-sidebar); 
      display: flex;
      justify-content: space-between; 
      align-items: center; 
      gap: 10px; 
    }
    .atendimento-container.sidebar .botoes-acao-direita { 
        display: flex;
        gap: 10px;
    }
    .atendimento-container.sidebar .btn,
    .atendimento-container.sidebar #btn-fechar-sidebar-inferior { 
      padding: 8px 16px; 
      border: 1px solid transparent; 
      border-radius: var(--border-radius-padrao);
      cursor: pointer;
      font-size: 0.9rem; 
      font-weight: 500;
      transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
      line-height: 1.5;
    }
    .atendimento-container.sidebar #btn-fechar-sidebar-inferior {
        background-color: transparent;
        color: var(--cor-texto-secundario);
        border: 1px solid var(--cor-borda-input);
        font-size: 1.2rem; 
        padding: 6px 10px; 
    }
    .atendimento-container.sidebar #btn-fechar-sidebar-inferior:hover {
        background-color: var(--cor-fundo-elemento-hover);
        border-color: var(--cor-borda);
        color: var(--cor-texto-principal);
    }

    .atendimento-container.sidebar .btn:active {
        transform: translateY(1px);
    }
    .atendimento-container.sidebar .btn-primario {
      background-color: var(--cor-primaria);
      color: var(--cor-primaria-texto);
      border-color: var(--cor-primaria);
    }
    .atendimento-container.sidebar .btn-primario:hover:not(:disabled) { 
        background-color: var(--cor-primaria-hover); 
        border-color: var(--cor-primaria-hover);
        box-shadow: 0 2px 6px rgba(0, 123, 255, 0.15); 
    }
    .atendimento-container.sidebar .btn-secundario {
      background-color: #f8f9fa; 
      color: var(--cor-texto-principal);
      border: 1px solid var(--cor-borda-input); 
    }
    .atendimento-container.sidebar .btn-secundario:hover:not(:disabled) { 
        background-color: #e9ecef; 
        border-color: #ced4da;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); 
    }
     .atendimento-container.sidebar .btn:disabled {
        background-color: #e9ecef !important; 
        color: #adb5bd !important; 
        border-color: #dee2e6 !important;
        cursor: not-allowed !important;
        box-shadow: none !important;
        opacity: 0.75; 
    }
    .atendimento-container.sidebar .btn-enviado { 
        background-color: var(--cor-sucesso) !important;
        border-color: var(--cor-sucesso) !important;
        color: #fff !important;
    }

    .atendimento-container.sidebar .atendimento-footer {
      padding: 12px 22px; 
      text-align: center;
      font-size: 0.75rem; 
      color: var(--cor-texto-secundario);
      border-top: 1px solid var(--cor-linha-divisoria);
      background-color: var(--cor-fundo-sidebar); 
    }
    .atendimento-container.sidebar .atendimento-footer p {
        margin: 4px 0; /* Adjust spacing for multiple lines in footer */
    }
    .atendimento-container.sidebar .atendimento-footer a {
        color: var(--cor-primaria);
        text-decoration: none;
    }
    .atendimento-container.sidebar .atendimento-footer a:hover {
        text-decoration: underline;
    }


    .oculto {
      display: none !important;
    }
  `;

  // Adicionar ao head
  document.head.appendChild(style);
}

injetarCSS();
