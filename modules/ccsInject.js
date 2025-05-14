// Função para injetar os estilos CSS
function injetarCSS() {
  // Criar elemento style
  const style = document.createElement("style");
  style.textContent = `
    /* Estilos gerais da interface */
    #interface-atendimento {
        position: fixed;
        bottom: 20px;
        right: 20px; /* Mudado para direita */
        width: 90%;
        max-width: 320px; /* Aumentado de 240px para 320px conforme solicitado */
        max-height: 85vh;
        overflow-y: auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
        z-index: 9999;
        padding: 10px; /* Reduzido de 24px para 10px */
        display: flex;
        flex-direction: column;
        gap: 8px; /* Reduzido de 20px para 8px */
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    /* Estado minimizado */
    #interface-atendimento.minimizado {
        transform: translateY(calc(100% - 40px)); /* Reduzido de 60px para 40px */
        max-height: 40px; /* Reduzido de 60px para 40px */
        padding: 8px 10px; /* Reduzido de 12px 24px para 8px 10px */
        cursor: pointer;
        overflow: hidden;
    }
    
    /* Botão de minimizar/maximizar */
    #toggle-interface {
        position: absolute;
        right: 14px;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        background-color: #eef3f8;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s;
    }
    
    #toggle-interface:hover {
        background-color: #e2e8f0;
    }
    
    #toggle-interface::before {
        content: '';
        width: 8px; /* Reduzido de 12px para 8px */
        height: 2px;
        background-color: #64748B;
        transition: transform 0.3s;
    }
    
    #interface-atendimento.minimizado #toggle-interface::before {
        transform: rotate(180deg);
    }
    
    /* Cabeçalho */
    .atendimento-header {
        text-align: center;
        border-bottom: 1px solid #eef3f8;
        position: relative;
        margin: 0 -10px;
        padding: 0 10px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    #interface-atendimento.minimizado .atendimento-header {
        border-bottom: none;
    }
    
    .atendimento-header h2 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        color: #000C3E;
    }
    
    #interface-atendimento.minimizado .atendimento-header h2 {
        margin: 0;
    }
    
    #interface-atendimento.minimizado .atendimento-form,
    #interface-atendimento.minimizado .atendimento-botoes,
    #interface-atendimento.minimizado .atendimento-footer {
        display: none;
    }
    
    /* Seções do formulário */
    .atendimento-secao {
        padding: 10px 0; /* Reduzido de 16px para 10px */
    }
    
    /* Campos do formulário */
    .atendimento-campo {
        margin-bottom: 10px; /* Reduzido de 16px para 10px */
    }
    
    .atendimento-campo label {
        display: block;
        margin-bottom: 5px; /* Reduzido de 8px para 5px */
        font-size: 12px; /* Reduzido de 14px para 12px */
        font-weight: 600;
        color: #475569;
    }
    
    /* Checkbox para titular */
    .checkbox-titular {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 12px;
    }
    
    .checkbox-titular input[type="checkbox"] {
        margin-right: 4px;
        accent-color: #000b3c;
    }
    
    /* Inputs */
    .entrada-texto,
    .entrada-select,
    .entrada-textarea {
        width: 100%;
        padding: 8px 10px; /* Reduzido de 12px 16px para 8px 10px */
        border: 1px solid #cbd5e1;
        border-radius: 6px; /* Reduzido de 8px para 6px */
        font-size: 12px; /* Reduzido de 14px para 12px */
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .entrada-texto:focus,
    .entrada-select:focus,
    .entrada-textarea:focus {
        border-color: #000b3c;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); /* Reduzido de 3px para 2px */
        outline: none;
    }
    
    .entrada-textarea {
        resize: vertical;
        min-height: 60px; /* Reduzido de 80px para 60px */
    }
    
    /* Opções de radio */
    .opcoes-titular {
        display: flex;
        gap: 12px; /* Reduzido de 20px para 12px */
    }
    
    .radio-container {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 12px; /* Adicionado tamanho de fonte */
    }
    
    .radio-container input[type="radio"] {
        margin-right: 4px; /* Reduzido de 8px para 4px */
        accent-color: #000b3c;
    }
    
    /* Checkbox */
    .checkbox-container {
        display: flex;
        align-items: center;
        font-size: 12px; /* Adicionado tamanho de fonte */
    }
    
    .checkbox-container input[type="checkbox"] {
        margin-right: 4px; /* Reduzido de 8px para 4px */
        accent-color: #000b3c;
    }
    
    /* Autocomplete */
    .autocomplete-container {
        position: relative;
    }
    
    .autocomplete-lista {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        border: 1px solid #cbd5e1;
        border-radius: 6px; /* Reduzido de 8px para 6px */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Reduzido */
        max-height: 150px; /* Reduzido de 200px para 150px */
        overflow-y: auto;
        z-index: 1000;
    }
    
    .autocomplete-item {
        padding: 8px 10px; /* Reduzido de 12px 16px para 8px 10px */
        cursor: pointer;
        transition: background-color 0.2s;
        font-size: 12px; /* Adicionado tamanho de fonte */
    }
    
    .autocomplete-item:hover {
        background-color: #f1f5f9;
    }
    
    /* Preview */
    .preview-container {
        display: flex;
        flex-direction: column;
        gap: 10px; /* Reduzido de 16px para 10px */
    }
    
    .preview-etiquetas {
        display: flex;
        flex-wrap: wrap;
        gap: 8px; /* Reduzido de 12px para 8px */
    }
    
    .etiqueta {
        padding: 5px 8px; /* Reduzido de 8px 12px para 5px 8px */
        border-radius: 4px; /* Reduzido de 6px para 4px */
        font-size: 11px; /* Reduzido de 13px para 11px */
        display: flex;
        align-items: center;
        gap: 4px; /* Reduzido de 6px para 4px */
    }
    
    .etiqueta-interna {
        background-color: #EFF6FF;
        border: 1px solid #BFDBFE;
        color: #1E40AF;
    }
    
    .etiqueta-externa {
        background-color: #ECFDF5;
        border: 1px solid #A7F3D0;
        color: #065F46;
    }
    
    .etiqueta-titulo {
        font-weight: 600;
    }
    
    .preview-vazio {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px; /* Reduzido de 120px para 80px */
        background-color: #f8fafc;
        border-radius: 6px; /* Reduzido de 8px para 6px */
        color: #94a3b8;
        font-style: italic;
        font-size: 11px; /* Adicionado tamanho de fonte */
    }
    
    /* Botões */
    .atendimento-botoes {
        display: flex;
        justify-content: flex-end;
        gap: 8px; /* Reduzido de 16px para 8px */
        padding-top: 10px; /* Reduzido de 16px para 10px */
    }
    
    .btn {
        padding: 8px 12px; /* Reduzido de 12px 24px para 8px 12px */
        border-radius: 6px; /* Reduzido de 8px para 6px */
        font-size: 12px; /* Reduzido de 14px para 12px */
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
    }
    
    .btn-primario {
        background-color: #000b3c;
        color: white;
    }
    
    .btn-primario:hover {
        background-color: #000b3c;
    }
    
    .btn-secundario {
        background-color: #f1f5f9;
        color: #475569;
    }
    
    .btn-secundario:hover {
        background-color: #e2e8f0;
    }
    
    /* Rodapé */
    .atendimento-footer {
        text-align: center;
        font-size: 10px; /* Reduzido de 12px para 10px */
        color: #94a3b8;
    }
    
    /* Utilidades */
    .oculto {
        display: none !important;
    }
    
    .campos-adicionais {
        margin-top: 10px; /* Reduzido de 16px para 10px */
        padding-top: 10px; /* Reduzido de 16px para 10px */
        border-top: 1px dashed #eef3f8;
    }
    
    /* Responsividade */
    @media (max-width: 400px) {
        #interface-atendimento {
            width: 95%;
            padding: 8px; /* Reduzido de 16px para 8px */
            right: 5px; /* Reduzido de 10px para 5px */
            bottom: 5px; /* Reduzido de 10px para 5px */
        }
        
        .opcoes-titular {
            flex-direction: column;
            gap: 5px; /* Reduzido de 8px para 5px */
        }
        
        .atendimento-botoes {
            flex-direction: column;
        }
        
        .btn {
            width: 100%;
        }
    }
  `;

  // Adicionar ao head
  document.head.appendChild(style);
}

injetarCSS();
