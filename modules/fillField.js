// --------------------------------------------------
// fillField
// --------------------------------------------------
/**
 * Preenche qualquer tipo de campo: input, textarea, select, contenteditable.
 * @param {Object} options
 * @param {string|HTMLElement} options.target - Seletor CSS ou elemento DOM
 * @param {string} options.value - Valor a preencher
 * @param {boolean} [options.dispatchEvents=true] - Dispara eventos input/change
 */
function fillField({ target, value, dispatchEvents = true } = {}) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) throw new Error("Elemento não encontrado: " + target);

  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || el.isContentEditable) {
    if (el.isContentEditable) {
      el.innerHTML = value;
    } else {
      el.value = value;
    }
    if (dispatchEvents) {
      ["input", "change"].forEach(evt =>
        el.dispatchEvent(new Event(evt, { bubbles: true }))
      );
    }
    logger.info(`fillField: preenchido ${tag} com "${value}"`);
  } else if (tag === "select") {
    el.value = value;
    if (dispatchEvents)
      el.dispatchEvent(new Event("change", { bubbles: true }));
    logger.info(`fillField: select definido para "${value}"`);
  } else {
    throw new Error("Tipo de campo não suportado: " + tag);
  }
}
