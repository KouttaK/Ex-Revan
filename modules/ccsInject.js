function injetarCSS() {
  // Criar elemento style
  const style = document.createElement("style");
  style.textContent = `
            /* Estilos gerais da interface */
            #interface-atendimento {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 600px;
                max-height: 85vh;
                overflow-y: auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #333;
                z-index: 9999;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            /* Cabeçalho */
            .atendimento-header {
                text-align: center;
                padding-bottom: 16px;
                border-bottom: 1px solid #eaeaea;
            }
            
            .atendimento-header h2 {
                font-size: 24px;
                margin: 0 0 8px 0;
                color: #2563EB;
            }
            
            .atendimento-header p {
                margin: 0;
                font-size: 14px;
                color: #64748B;
            }
            
            /* Seções do formulário */
            .atendimento-secao {
                padding: 16px 0;
                border-bottom: 1px solid #eaeaea;
            }
            
            .atendimento-secao h3 {
                font-size: 18px;
                margin: 0 0 16px 0;
                color: #334155;
            }
            
            /* Campos do formulário */
            .atendimento-campo {
                margin-bottom: 16px;
            }
            
            .atendimento-campo label {
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 600;
                color: #475569;
            }
            
            /* Inputs */
            .entrada-texto,
            .entrada-select,
            .entrada-textarea {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            
            .entrada-texto:focus,
            .entrada-select:focus,
            .entrada-textarea:focus {
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
                outline: none;
            }
            
            .entrada-textarea {
                resize: vertical;
                min-height: 80px;
            }
            
            /* Opções de radio */
            .opcoes-titular {
                display: flex;
                gap: 20px;
            }
            
            .radio-container {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            
            .radio-container input[type="radio"] {
                margin-right: 8px;
                accent-color: #2563eb;
            }
            
            /* Checkbox */
            .checkbox-container {
                display: flex;
                align-items: center;
            }
            
            .checkbox-container input[type="checkbox"] {
                margin-right: 8px;
                accent-color: #2563eb;
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
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;
            }
            
            .autocomplete-item {
                padding: 12px 16px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .autocomplete-item:hover {
                background-color: #f1f5f9;
            }
            
            /* Preview */
            .preview-container {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            
            .preview-etiquetas {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
            }
            
            .etiqueta {
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
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
                height: 120px;
                background-color: #f8fafc;
                border-radius: 8px;
                color: #94a3b8;
                font-style: italic;
            }
            
            /* Botões */
            .atendimento-botoes {
                display: flex;
                justify-content: flex-end;
                gap: 16px;
                padding-top: 16px;
            }
            
            .btn {
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }
            
            .btn-primario {
                background-color: #2563eb;
                color: white;
            }
            
            .btn-primario:hover {
                background-color: #1d4ed8;
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
                font-size: 12px;
                color: #94a3b8;
            }
            
            /* Utilidades */
            .oculto {
                display: none !important;
            }
            
            .campos-adicionais {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px dashed #eaeaea;
            }
            
            /* Responsividade */
            @media (max-width: 640px) {
                #interface-atendimento {
                    width: 95%;
                    padding: 16px;
                }
                
                .opcoes-titular {
                    flex-direction: column;
                    gap: 8px;
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
