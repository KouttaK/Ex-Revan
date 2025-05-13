// --------------------------------------------------
// Observador para elementos dinâmicos (MutationObserver)
// --------------------------------------------------
/**
 * Observa o DOM para um elemento que atenda a condição e executa callback
 * @param {Function} conditionFn - Função que recebe o document e retorna o elemento
 * @param {Function} callback - O que fazer quando encontrar o elemento
 * @param {Object} [config] - Configuração do observer
 */
function observeAndClick(conditionFn, callback, config = {}) {
  const { timeout = 10000 } = config;
  const start = Date.now();
  const observer = new MutationObserver((_, obs) => {
    const el = conditionFn(document);
    if (el) {
      logger.info("Elemento dinâmico encontrado, clicando...");
      el.click();
      callback(el);
      obs.disconnect();
    } else if (Date.now() - start > timeout) {
      logger.error("Timeout observando elemento dinâmico");
      obs.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
