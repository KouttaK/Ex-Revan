class Logger {
  constructor(config = {}) {
    this.levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    this.config = Object.assign(
      {
        level: "INFO", // Nível mínimo para logar
        output: "console", // 'console' | 'remote'
        remoteUrl: null, // URL para envio remoto
        timestampFormat: "ISO", // 'ISO' | 'locale'
        format: "[{timestamp}] {level}: {message}",
        hooks: { before: null, after: null },
      },
      config
    );
  }
  log(level, message) {
    if (this.levels[level] < this.levels[this.config.level]) return;
    const ts =
      this.config.timestampFormat === "locale"
        ? new Date().toLocaleString()
        : new Date().toISOString();
    let formatted = this.config.format
      .replace("{timestamp}", ts)
      .replace("{level}", level)
      .replace("{message}", message);
    if (typeof this.config.hooks.before === "function")
      this.config.hooks.before(level, formatted);
    if (this.config.output === "console") {
      console[level.toLowerCase()](formatted);
    } else if (this.config.output === "remote" && this.config.remoteUrl) {
      fetch(this.config.remoteUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, message: formatted }),
      }).catch(err => console.error("Logger remote error", err));
    }
    if (typeof this.config.hooks.after === "function")
      this.config.hooks.after(level, formatted);
  }
  debug(msg) {
    this.log("DEBUG", msg);
  }
  info(msg) {
    this.log("INFO", msg);
  }
  warn(msg) {
    this.log("WARN", msg);
  }
  error(msg) {
    this.log("ERROR", msg);
  }
}
const logger = new Logger({ level: "DEBUG", output: "console" });
