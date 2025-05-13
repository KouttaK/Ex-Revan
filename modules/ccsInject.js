// Injetar CSS
const injetarCSS = () => {
  const style = document.createElement("style");
  style.textContent = `
        /* Estilos gerais do formulário de automação */
        .automacao-container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 20px auto;
            padding: 25px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .automacao-header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
        }

        .automacao-header h2 {
            color: #2c3e50;
            margin: 0;
            font-weight: 600;
        }

        .automacao-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .form-group label {
            font-weight: 500;
            color: #4a5568;
            font-size: 14px;
        }

        .form-row {
            display: flex;
            gap: 15px;
        }

        .form-row .form-group {
            flex: 1;
        }

        input[type="text"], 
        select, 
        .search-input {
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        input[type="text"]:focus, 
        select:focus, 
        .search-input:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            outline: none;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .checkbox-group input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: #3498db;
        }

        .search-container {
            position: relative;
        }

        .search-input {
            width: 100%;
            padding-right: 35px;
        }

        .search-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
        }

        .results-container {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            max-height: 200px;
            overflow-y: auto;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 0 0 6px 6px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10;
            display: none;
        }

        .results-container.active {
            display: block;
        }

        .results-container .result-item {
            padding: 10px 12px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .results-container .result-item:hover {
            background-color: #f1f5f9;
        }

        .preview-section {
            margin-top: 20px;
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background-color: #f8fafc;
        }

        .preview-section h3 {
            color: #2c3e50;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: 600;
        }

        .preview-item {
            margin-bottom: 12px;
        }

        .preview-item .label {
            font-weight: 500;
            font-size: 13px;
            color: #64748b;
            margin-bottom: 4px;
        }

        .preview-item .value {
            font-size: 14px;
            color: #334155;
            padding: 8px 10px;
            background-color: white;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }

        .preview-item .editable {
            min-height: 80px;
            padding: 10px;
        }

        .button-group {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 25px;
        }

        .btn {
            padding: 10px 18px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            font-size: 14px;
        }

        .btn-primary {
            background-color: #3498db;
            color: white;
        }

        .btn-primary:hover {
            background-color: #2980b9;
        }

        .btn-outline {
            background-color: transparent;
            border: 1px solid #3498db;
            color: #3498db;
        }

        .btn-outline:hover {
            background-color: #f1f9ff;
        }

        .hidden {
            display: none;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .badge-info {
            background-color: #e0f2fe;
            color: #0369a1;
        }

        .badge-warning {
            background-color: #fef3c7;
            color: #92400e;
        }

        [contenteditable]:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .accordion {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
        }

        .accordion-header {
            padding: 12px 16px;
            background-color: #f8fafc;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 500;
        }

        .accordion-content {
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }

        .accordion-content.active {
            padding: 16px;
            max-height: 500px;
        }
        `;
  document.head.appendChild(style);
};
