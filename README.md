# Ex-Revan
userscript para automatação Revan. 




# Modulos
# Documentação Detalhada dos Módulos (`/modules`)

Esta documentação descreve em detalhes os scripts contidos na pasta `/modules` do projeto Ex-Revan, com foco na explicação dos parâmetros de suas funções e exemplos práticos de uso. Os módulos `ccsInject.js` e `interface.js` foram omitidos conforme solicitado.

---

## 1. `click.js`

Este módulo fornece uma função para simular programaticamente um evento de clique em um elemento da página da web, incluindo tratamento de erro caso o elemento não seja encontrado.

### Funcionalidades Principais:

#### **`click(querySelector, errorMessage)`**

Simula um clique em um elemento DOM especificado por um seletor CSS.

* **Parâmetros:**
    * `querySelector` (String):
        * **Descrição:** Um seletor CSS (ex: `#meuId`, `.minhaClasse`, `button[type="submit"]`) usado para encontrar o elemento DOM que deve ser clicado.
        * **Obrigatório:** Sim
    * `errorMessage` (String):
        * **Descrição:** Uma mensagem de erro customizada a ser exibida e lançada como uma exceção (`Error`) se o elemento especificado pelo `querySelector` não for encontrado na página. Se este parâmetro não for fornecido ou for `null`/`undefined`, apenas uma mensagem de erro será logada no console (via `log.error`), mas nenhuma exceção será lançada, permitindo que o script continue a execução (se não houver outro tratamento de erro).
        * **Obrigatório:** Não

* **Retorna:**
    * `void` - Esta função não retorna um valor.

* **Comportamento:**
    1.  Tenta localizar o elemento no DOM usando `document.querySelector(querySelector)`.
    2.  Se o elemento for encontrado:
        * O método `element.click()` é chamado para simular um clique.
    3.  Se o elemento não for encontrado:
        * Uma mensagem de erro é registrada no console usando `log.error` (do módulo `logger.js`), incluindo o seletor que falhou.
        * Se `errorMessage` foi fornecido, um novo `Error` é lançado com essa mensagem.

* **Exemplos de Uso:**

    ```javascript
    // Importando a função e o logger (assumindo que está no mesmo diretório ou configurado no seu bundler/ambiente)
    import { click } from './modules/click.js';
    import { log } from './modules/logger.js'; // Necessário para o log interno da função 'click'

    // Exemplo 1: Clicar em um botão com um ID específico e lançar um erro se não encontrado.
    try {
      click('#submitOrderBtn', 'ERRO CRÍTICO: Botão de submeter pedido não encontrado na página!');
      log.info('Botão de submeter pedido clicado com sucesso.');
    } catch (e) {
      log.error(e.message); // Captura o erro lançado pela função click
    }

    // Exemplo 2: Clicar em um link com uma classe específica.
    // Se não encontrado, apenas loga o erro no console, não lança exceção.
    click('.nextPageLink');
    // O script continuará mesmo que '.nextPageLink' não exista,
    // mas uma mensagem de erro aparecerá no console.

    // Exemplo 3: Clicar no primeiro botão <button> da página.
    click('button', 'Não foi possível encontrar nenhum botão na página.');

    // Exemplo 4: Clicar em um elemento com um atributo específico.
    click('a[data-testid="user-profile-link"]', 'Link do perfil do usuário não encontrado.');
    ```

---

## 2. `dom-observer.js`

Este módulo implementa um observador de mutações no DOM (`MutationObserver`). Ele permite executar uma função de callback quando ocorrem alterações específicas na estrutura do DOM, como a adição de novos nós.

### Funcionalidades Principais:

#### **`observeDOM(callback, disconnectAfterFirstMatch = true, targetNode = document.body, options = { childList: true, subtree: true })`**

Configura e inicia um `MutationObserver` para monitorar mudanças no DOM e executar uma função de `callback` quando essas mudanças ocorrem.

* **Parâmetros:**
    * `callback` (Function):
        * **Descrição:** A função a ser executada quando uma mutação que corresponda às `options` de observação for detectada no `targetNode`. Esta função recebe a instância do `MutationObserver` como primeiro argumento e uma lista de `MutationRecord` como segundo argumento (`function callback(observer, mutationsList) { ... }`). Essa lista detalha cada mutação ocorrida, sendo crucial para o processamento das alterações.
        * **Obrigatório:** Sim
    * `disconnectAfterFirstMatch` (Boolean):
        * **Descrição:** Se `true` (padrão), o `MutationObserver` será automaticamente desconectado (`observer.disconnect()`) após a primeira vez que o `callback` for invocado. Se `false`, o observador continuará ativo e o `callback` poderá ser chamado múltiplas vezes até que seja desconectado manualmente.
        * **Obrigatório:** Não
        * **Valor Padrão:** `true`
    * `targetNode` (Node):
        * **Descrição:** O nó do DOM que o `MutationObserver` deve observar. Por padrão, é o `document.body`, o que significa que observará mudanças em todo o corpo do documento. Pode ser qualquer nó DOM específico (ex: `document.getElementById('meuContainer')`).
        * **Obrigatório:** Não
        * **Valor Padrão:** `document.body`
    * `options` (Object):
        * **Descrição:** Um objeto de configuração `MutationObserverInit` que especifica quais tipos de mutações devem ser observadas.
            * `childList` (Boolean): Observar adições ou remoções dos filhos do `targetNode`.
            * `subtree` (Boolean): Estender a observação a todos os descendentes do `targetNode`.
            * `attributes` (Boolean): Observar mudanças nos atributos do `targetNode`.
            * Outras opções incluem: `attributeOldValue`, `characterData`, `characterDataOldValue`, `attributeFilter`.
        * **Obrigatório:** Não
        * **Valor Padrão:** `{ childList: true, subtree: true }` (observa adição/remoção de nós filhos e em toda a subárvore).

* **Retorna:**
    * `MutationObserver` - A instância do `MutationObserver` criada. Isso pode ser útil se você precisar desconectar o observador externamente, embora o `disconnectAfterFirstMatch` e o argumento `observer` no `callback` geralmente cubram essa necessidade.

* **Comportamento:**
    1.  Cria uma nova instância de `MutationObserver` com uma função interna que:
        * Executa o `callback` fornecido, passando a instância do observador.
        * Se `disconnectAfterFirstMatch` for `true`, chama `observer.disconnect()` imediatamente após executar o `callback`.
    2.  Chama o método `observe()` na instância do `MutationObserver`, passando o `targetNode` e as `options`.

* **Exemplos de Uso:**

    ```javascript
    // Importando a função
    import { observeDOM } from './modules/dom-observer.js';
    import { log } from './modules/logger.js';

    // Exemplo 1: Esperar por um elemento com ID 'dynamicData' ser adicionado ao body
    // e então logar uma mensagem. Desconecta após a primeira ocorrência.
    log.info('Aguardando #dynamicData aparecer...');
    observeDOM((observer) => {
      const dynamicElement = document.getElementById('dynamicData');
      if (dynamicElement) {
        log.info('#dynamicData foi encontrado!', dynamicElement.textContent);
        // observer.disconnect(); // Não é necessário se disconnectAfterFirstMatch é true (padrão)
      }
    });

    // Exemplo 2: Observar continuamente por qualquer elemento adicionado a um div específico
    // com ID 'chatMessages'. Não desconecta automaticamente.
    const chatContainer = document.getElementById('chatMessages');
    if (chatContainer) {
      let messageCount = 0;
      const chatObserver = observeDOM(
        (observer) => { // O 'observer' é passado aqui
          messageCount++;
          log.info(`Nova mensagem no chat! Total: ${messageCount}`);
          if (messageCount > 10) {
            log.info('Muitas mensagens, parando de observar o chat.');
            observer.disconnect(); // Desconectar manualmente
          }
        },
        false, // disconnectAfterFirstMatch = false
        chatContainer, // targetNode
        { childList: true } // options: observar apenas filhos diretos, não a subárvore
      );
      // chatObserver pode ser usado para desconectar externamente se necessário:
      // setTimeout(() => chatObserver.disconnect(), 60000); // Desconecta após 1 minuto
    } else {
      log.error('Container do chat #chatMessages não encontrado.');
    }

    // Exemplo 3: Observar mudanças de atributos em um input específico
    const userInputField = document.getElementById('userInput');
    if (userInputField) {
      observeDOM(
        (observer, mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
              log.info(`O atributo 'disabled' do campo userInput mudou para: ${userInputField.disabled}`);
            }
          }
        },
        false, // Observar continuamente
        userInputField,
        { attributes: true } // Observar apenas atributos
      );
    }
    ```

---

## 3. `fillField.js`

Este módulo é destinado a preencher campos de formulário (como `<input>`, `<textarea>`, `<select>`) com um valor especificado. Ele também dispara eventos de input e change para garantir que qualquer lógica JavaScript associada (como validações ou reações a mudanças) seja acionada.

### Funcionalidades Principais:

#### **`fillField(querySelector, value, errorMessage)`**

Encontra um elemento de formulário usando um seletor CSS, define seu valor e dispara eventos de `input` e `change`.

* **Parâmetros:**
    * `querySelector` (String):
        * **Descrição:** Um seletor CSS para localizar o campo de formulário (ex: `input[name="email"]`, `#userAge`, `textarea.description`).
        * **Obrigatório:** Sim
    * `value` (String | Number | Boolean):
        * **Descrição:** O valor a ser atribuído ao campo. Para campos de texto e textareas, será uma string. Para checkboxes, esta função definirá a propriedade `value` do elemento, não diretamente seu estado `checked`. Para controlar o estado de marcação (marcado/desmarcado), manipule a propriedade `element.checked` e dispare um evento `change` manualmente, conforme detalhado na nota abaixo. Para selects, o valor que corresponde a uma das opções.
        * **Obrigatório:** Sim
    * `errorMessage` (String):
        * **Descrição:** Uma mensagem de erro customizada a ser exibida e lançada como uma exceção (`Error`) se o elemento especificado pelo `querySelector` não for encontrado. Se omitido, apenas loga no console.
        * **Obrigatório:** Não

* **Retorna:**
    * `void` - Esta função não retorna um valor.

* **Comportamento:**
    1.  Localiza o elemento usando `document.querySelector(querySelector)`.
    2.  Se o elemento for encontrado:
        * A propriedade `element.value` é definida com o `value` fornecido.
        * Um evento `input` é criado (`new Event('input', { bubbles: true, cancelable: true })`) e despachado no elemento.
        * Um evento `change` é criado (`new Event('change', { bubbles: true, cancelable: true })`) e despachado no elemento.
        * Isso ajuda a garantir que frameworks de frontend (React, Vue, Angular) ou listeners de eventos vanilla JS reajam à mudança de valor.
    3.  Se o elemento não for encontrado:
        * Loga um erro via `log.error`.
        * Se `errorMessage` foi fornecido, lança um `new Error(errorMessage)`.

* **Exemplos de Uso:**

    ```javascript
    // Importando a função
    import { fillField } from './modules/fillField.js';
    import { log } from './modules/logger.js';

    // Exemplo 1: Preencher um campo de texto com ID 'firstName'
    try {
      fillField('#firstName', 'João', 'Campo "Nome" não encontrado.');
      log.info('Campo "Nome" preenchido.');
    } catch (e) {
      log.error(e.message);
    }

    // Exemplo 2: Preencher uma textarea com a classe 'product-description'
    const longDescription = "Este é um produto excelente com muitas características...";
    fillField('textarea.product-description', longDescription); // Sem mensagem de erro customizada

    // Exemplo 3: Selecionar uma opção em um campo <select>
    // Suponha que o select#country tenha <option value="BR">Brasil</option>
    fillField('#country', 'BR', 'Campo de seleção de país não encontrado.');

    // Exemplo 4: Preencher um campo de input do tipo 'number'
    fillField('input[type="number"][name="quantity"]', 5, 'Campo de quantidade não encontrado.');

    // Nota sobre checkboxes/radios:
    // A função 'fillField' define 'element.value'. Para checkboxes ou radio buttons,
    // você normalmente manipula 'element.checked = true/false' e então dispara 'change'.
    // Se 'fillField' for usado em um checkbox, ele definirá o atributo 'value' do checkbox,
    // o que pode não ser o comportamento desejado para marcar/desmarcar.
    // Para marcar um checkbox:
    // const myCheckbox = document.getElementById('agreeTerms');
    // if (myCheckbox) {
    //   myCheckbox.checked = true;
    //   myCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
    // }
    ```

---

## 4. `helpers.js`

Este módulo é uma coleção de funções utilitárias diversas que podem ser usadas em diferentes partes da aplicação para realizar tarefas comuns.

### Funções Disponíveis:

#### **`delay(ms)`**

Cria uma pausa na execução de código assíncrono. Retorna uma `Promise` que resolve após o número especificado de milissegundos.

* **Parâmetros:**
    * `ms` (Number):
        * **Descrição:** O número de milissegundos que a Promise deve aguardar antes de ser resolvida.
        * **Obrigatório:** Sim

* **Retorna:**
    * `Promise<void>` - Uma Promise que resolve após o tempo `ms` especificado.

* **Exemplo de Uso:**

    ```javascript
    import { delay } from './modules/helpers.js';
    import { log } from './modules/logger.js';

    async function processItemsWithDelay() {
      const items = ['item1', 'item2', 'item3'];
      for (const item of items) {
        log.info(`Processando ${item}...`);
        // Simula um trabalho demorado
        await delay(1500); // Espera 1.5 segundos
        log.info(`${item} processado.`);
      }
      log.info('Todos os itens foram processados.');
    }

    processItemsWithDelay();
    ```

#### **`getQueryParam(paramName)`**

Extrai o valor de um parâmetro específico da query string da URL da página atual.

* **Parâmetros:**
    * `paramName` (String):
        * **Descrição:** O nome do parâmetro da query string cujo valor deve ser recuperado (ex: `userId`, `productId`).
        * **Obrigatório:** Sim

* **Retorna:**
    * `String | null` - O valor do parâmetro da query string se encontrado, ou `null` se o parâmetro não existir na URL.

* **Exemplo de Uso:**
    ```javascript
    import { getQueryParam } from './modules/helpers.js';
    import { log } from './modules/logger.js';

    // Suponha que a URL atual seja: [https://example.com/search?query=javascript&page=2](https://example.com/search?query=javascript&page=2)

    const searchTerm = getQueryParam('query'); // Retorna "javascript"
    log.info('Termo de busca:', searchTerm);

    const pageNumber = getQueryParam('page'); // Retorna "2"
    log.info('Número da página:', pageNumber);

    const nonExistentParam = getQueryParam('filter'); // Retorna null
    log.info('Parâmetro inexistente:', nonExistentParam);

    if (pageNumber) {
      const numericPage = parseInt(pageNumber, 10);
      log.info('Página como número:', numericPage);
    }
    ```

#### **`isValidProblemNumber(problemNumber)`**

Verifica se um dado número de problema é válido. No contexto deste script, um número de problema válido é um número inteiro positivo.

* **Parâmetros:**
    * `problemNumber` (String | Number):
        * **Descrição:** O número do problema a ser validado. Pode ser uma string (que será convertida para número) ou um número.
        * **Obrigatório:** Sim

* **Retorna:**
    * `Boolean` - `true` se o `problemNumber` for um número inteiro e maior que zero; `false` caso contrário.

* **Exemplo de Uso:**
    ```javascript
    import { isValidProblemNumber } from './modules/helpers.js';
    import { log } from './modules/logger.js';

    log.info("isValidProblemNumber('123'):", isValidProblemNumber('123')); // true
    log.info("isValidProblemNumber(456):", isValidProblemNumber(456));   // true
    log.info("isValidProblemNumber('abc'):", isValidProblemNumber('abc')); // false (não é número)
    log.info("isValidProblemNumber(0):", isValidProblemNumber(0));     // false (não é > 0)
    log.info("isValidProblemNumber(-5):", isValidProblemNumber(-5));    // false (não é > 0)
    log.info("isValidProblemNumber('12.3'):", isValidProblemNumber('12.3')); // true (parseInt('12.3') é 12)

    const inputProblemId = '789';
    if (isValidProblemNumber(inputProblemId)) {
      log.info(`ID do problema ${inputProblemId} é válido.`);
    } else {
      log.error(`ID do problema ${inputProblemId} é inválido.`);
    }
    ```
    *Observação Importante sobre `isValidProblemNumber`*: Devido ao uso de `parseInt`, strings como '12.3' são convertidas para o inteiro `12` e, se positivas, consideradas válidas. Se for necessária uma validação estrita que rejeite números com casas decimais (mesmo em formato de string), uma verificação adicional como `Number.isInteger(Number(problemNumber))` deve ser implementada.

#### **`extractProblemNumberFromURL(url)`**

Extrai o que se presume ser um "número de problema" de uma URL. A lógica assume que o número do problema é o último segmento numérico na path da URL.

* **Parâmetros:**
    * `url` (String):
        * **Descrição:** A URL da qual o número do problema deve ser extraído.
        * **Obrigatório:** Sim

* **Retorna:**
    * `String | null` - O número do problema extraído como uma string se um padrão numérico for encontrado no final da path da URL; `null` caso contrário.

* **Expressão Regular Utilizada:** `/\/(\d+)(?=\/?$)/`
    * `\/`: Corresponde ao caractere literal `/`.
    * `(\d+)`: Grupo de captura 1. Corresponde a um ou mais dígitos (o número do problema).
    * `(?=\/?$)`: Lookahead positivo. Assegura que o que se segue aos dígitos é:
        * `\/?`: Uma barra opcional.
        * `$`: O final da string.
        * Isso garante que estamos pegando um número que está no final de um segmento da URL.

* **Exemplo de Uso:**
    ```javascript
    import { extractProblemNumberFromURL } from './modules/helpers.js';
    import { log } from './modules/logger.js';

    const url1 = "[https://platform.example.com/problems/view/12345](https://platform.example.com/problems/view/12345)";
    log.info(`URL: ${url1} -> Problema: ${extractProblemNumberFromURL(url1)}`); // "12345"

    const url2 = "[https://example.com/archive/problem/987/](https://example.com/archive/problem/987/)"; // Com barra no final
    log.info(`URL: ${url2} -> Problema: ${extractProblemNumberFromURL(url2)}`); // "987"

    const url3 = "[https://example.com/user/123/submissions](https://example.com/user/123/submissions)"; // Não é o último segmento numérico que corresponde ao padrão
    log.info(`URL: ${url3} -> Problema: ${extractProblemNumberFromURL(url3)}`); // null (pois a regex procura /NUMERO no final)

    const url4 = "[https://example.com/problems/P101](https://example.com/problems/P101)";
    log.info(`URL: ${url4} -> Problema: ${extractProblemNumberFromURL(url4)}`); // null

    const url5 = "[https://example.com/page](https://example.com/page)";
    log.info(`URL: ${url5} -> Problema: ${extractProblemNumberFromURL(url5)}`); // null

    const currentProblemId = extractProblemNumberFromURL(window.location.href);
    if (currentProblemId) {
      log.info('ID do Problema da URL atual:', currentProblemId);
    } else {
      log.warn('Nenhum ID de problema encontrado na URL atual.');
    }
    ```

---

## 5. `logger.js`

Este módulo fornece um sistema de logging simples para registrar mensagens de informação e erro no console do navegador. As mensagens são prefixadas para facilitar a identificação da origem do log (neste caso, "[Revan INFO]" e "[Revan ERROR]").

### Funcionalidades Principais:

O módulo exporta um objeto chamado `log` que contém dois métodos: `info` e `error`.

#### **`log.info(message, ...optionalParams)`**

Registra uma mensagem informativa no console.

* **Parâmetros:**
    * `message` (any):
        * **Descrição:** A mensagem principal ou o objeto a ser logado. Pode ser uma string, número, objeto, etc.
        * **Obrigatório:** Sim
    * `...optionalParams` (any[]):
        * **Descrição:** Argumentos adicionais a serem logados após a mensagem principal. Semelhante a como `console.log` aceita múltiplos argumentos.
        * **Obrigatório:** Não

* **Comportamento:**
    * Chama `console.info()` internamente.
    * A saída no console será prefixada com `"[Revan INFO]"`, seguida pela `message` e quaisquer `optionalParams`.

* **Exemplo de Uso:**
    ```javascript
    import { log } from './modules/logger.js';

    log.info('Aplicação iniciada.');
    // Console: [Revan INFO] Aplicação iniciada.

    const user = { name: 'Alice', id: 101 };
    log.info('Dados do usuário carregados:', user);
    // Console: [Revan INFO] Dados do usuário carregados: {name: "Alice", id: 101}

    let count = 5;
    log.info('Contagem atual é', count, 'de', '10');
    // Console: [Revan INFO] Contagem atual é 5 de 10
    ```

#### **`log.error(message, ...optionalParams)`**

Registra uma mensagem de erro no console.

* **Parâmetros:**
    * `message` (any):
        * **Descrição:** A mensagem de erro principal ou o objeto de erro a ser logado.
        * **Obrigatório:** Sim
    * `...optionalParams` (any[]):
        * **Descrição:** Argumentos adicionais a serem logados. Pode incluir objetos de erro, stack traces, ou outros dados relevantes para o erro.
        * **Obrigatório:** Não

* **Comportamento:**
    * Chama `console.error()` internamente.
    * A saída no console será prefixada com `"[Revan ERROR]"`, seguida pela `message` e quaisquer `optionalParams`. Erros normalmente aparecem com destaque visual no console do navegador.

* **Exemplo de Uso:**
    ```javascript
    import { log } from './modules/logger.js';

    log.error('Falha ao conectar com o servidor.');
    // Console: [Revan ERROR] Falha ao conectar com o servidor.

    try {
      // Alguma operação que pode falhar
      throw new Error('Algo deu muito errado!');
    } catch (e) {
      log.error('Uma exceção ocorreu:', e.message, e.stack);
      // Console: [Revan ERROR] Uma exceção ocorreu: Algo deu muito errado! <stack trace>
    }

    const validationResult = { valid: false, issues: ['Campo X é obrigatório'] };
    if (!validationResult.valid) {
      log.error('Validação falhou:', validationResult.issues);
      // Console: [Revan ERROR] Validação falhou: ["Campo X é obrigatório"]
    }
    ```

---

