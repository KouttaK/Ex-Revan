async function clickElement({
  selector,
  timeout = 5000,
  retries = 3,
  delay = 500,
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const start = Date.now();
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const el =
        typeof selector === "function"
          ? selector()
          : document.querySelector(selector);
      if (el) {
        el.click();
        logger.info(`Clique bem-sucedido em ${selector}`);
        onSuccess(el);
        return el;
      }
      if (Date.now() - start >= timeout)
        throw new Error(`Timeout aguardando ${selector}`);
      await new Promise(r => setTimeout(r, delay));
    } catch (err) {
      logger.warn(`Tentativa ${attempt} falhou: ${err.message}`);
      if (attempt === retries) {
        onError(err);
        throw err;
      }
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// --------------------------------------------------
// Função clickByTextWords
// --------------------------------------------------
/**
 * Clica no primeiro elemento que contenha todas as palavras-chave.
 * Ignora acentos e case.
 * @param {Object} options
 * @param {string} options.selector - Seletor de container (ex: 'ul li')
 * @param {string} options.text - Frase com palavras-chave
 * @param {number} [options.timeout=5000]
 * @param {number} [options.retries=3]
 * @param {number} [options.delay=300]
 * @param {Function} [options.onSuccess]
 * @param {Function} [options.onError]
 */
async function clickByTextWords({
  selector,
  text,
  timeout = 5000,
  retries = 3,
  delay = 300,
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const keywords = normalizeText(text).split(/\s+/).filter(Boolean);
  const start = Date.now();
  for (let attempt = 1; attempt <= retries; attempt++) {
    const nodes = document.querySelectorAll(selector);
    for (let el of nodes) {
      if (typeof el.textContent !== "string") continue;
      const contentNorm = normalizeText(el.textContent);
      if (keywords.every(w => contentNorm.includes(w))) {
        el.click();
        logger.info(
          `clickByTextWords: elemento clicado: "${el.textContent.trim()}"`
        );
        onSuccess(el);
        return el;
      }
    }
    if (Date.now() - start >= timeout) {
      const err = new Error(`Timeout aguardando texto "${text}"`);
      logger.error(err.message);
      onError(err);
      throw err;
    }
    await new Promise(r => setTimeout(r, delay));
  }
}

/**
 * Aguarda o elemento existir e perder atributos específicos antes de clicar.
 * @param {Object} options
 * @param {string|Function} options.selector - Seletor CSS ou função que retorna elemento
 * @param {string[]} options.attributes - Lista de atributos que devem ser removidos/molhados
 * @param {number} [options.timeout=5000]
 * @param {number} [options.checkInterval=200]
 * @param {Function} [options.onSuccess]
 * @param {Function} [options.onError]
 */
async function clickWhenAttributeRemoved({
  selector,
  attributes = [],
  timeout = 5000,
  checkInterval = 200,
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const start = Date.now();
  try {
    while (Date.now() - start < timeout) {
      const el =
        typeof selector === "function"
          ? selector()
          : document.querySelector(selector);
      if (el) {
        const hasAny = attributes.some(attr => el.hasAttribute(attr));
        if (!hasAny) {
          el.click();
          logger.info(
            `clickWhenAttributeRemoved: clicado após remover atributos: ${attributes}`
          );
          onSuccess(el);
          return el;
        }
      }
      await new Promise(r => setTimeout(r, checkInterval));
    }
    throw new Error(`Timeout aguardando remoção de atributos ${attributes}`);
  } catch (err) {
    logger.error(err.message);
    onError(err);
    throw err;
  }
}
