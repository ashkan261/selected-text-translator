(() => {
  let card, port, started = false;
  const fa = browser.i18n.getUILanguage().startsWith("fa");
  const label = (en, persian) => fa ? persian : en;
  function dismiss() {
    const previous = port;
    port = undefined;
    previous?.disconnect();
    card?.remove();
    card = undefined;
  }
  function open(text, hint, x, y) {
    dismiss();
    const host = document.createElement("div");
    card = host;
    host.style.cssText = "all:initial!important;position:fixed!important;display:block!important;z-index:2147483647!important;margin:0!important;padding:0!important;border:0!important;";
    const root = host.attachShadow({mode:"closed"});
    const style = document.createElement("style");
    style.textContent = `
      section{box-sizing:border-box;width:max-content;min-width:min(160px,calc(100vw - 16px));max-width:min(390px,calc(100vw - 16px));max-height:calc(100vh - 16px);overflow:auto;background:white;color:#172033;border:1px solid #dbe0e8;border-radius:14px;box-shadow:0 5px 24px #18263b32;padding:13px 15px;font:15px/1.65 system-ui,sans-serif;text-align:start;color-scheme:light}
      p{margin:0;max-height:55vh;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere}
      button{background:#edf3fc;color:#25477e;border:0;border-radius:7px;padding:5px 12px;font:600 13px/1.5 system-ui,sans-serif;cursor:pointer;margin-top:10px}button:hover{background:#dfebfc}
    `;
    const panel = document.createElement("section");
    const result = document.createElement("p");
    panel.dir = fa ? "rtl" : "ltr";
    result.dir = "auto";
    result.setAttribute("role","status");
    result.textContent = label("Translating…","در حال ترجمه…");
    const copy = document.createElement("button");
    copy.hidden = true;
    copy.textContent = label("Copy","کپی");
    copy.onclick = async event => {
      if (!event.isTrusted) return;
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(result.textContent);
        else {
          const field = document.createElement("textarea");
          field.value = result.textContent;
          panel.append(field);
          field.select();
          const ok = document.execCommand("copy");
          field.remove();
          if (!ok) throw Error();
        }
        copy.textContent = label("Copied","کپی شد");
      } catch { copy.textContent = label("Select the translation and copy manually","متن ترجمه را انتخاب و کپی کنید"); }
    };
    panel.append(result,copy);
    root.append(style,panel);
    document.documentElement.append(host);
    function position() {
      const {width,height} = panel.getBoundingClientRect();
      const left = Math.max(8, Math.min(x+12,innerWidth-width-8));
      const top = y+height+16 <= innerHeight ? y+10 : Math.max(8,y-height-10);
      host.style.setProperty("left",left+"px","important");
      host.style.setProperty("top",top+"px","important");
    }
    position();
    const channel = browser.runtime.connect({name:"selection"});
    port = channel;
    channel.onMessage.addListener(reply => {
      if (card !== host) return;
      result.textContent = reply.error || reply.text;
      copy.hidden = !reply.text;
      position();
    });
    channel.onDisconnect.addListener(() => {
      if (port === channel && copy.hidden) result.textContent = label("Connection closed.","ارتباط قطع شد.");
    });
    channel.postMessage({text,hint});
  }
  document.addEventListener("mousedown", e => {
    if (!e.isTrusted) return;
    started = e.button === 0 && e.target !== card;
    if (e.target !== card) dismiss();
  },true);
  document.addEventListener("mouseup", e => {
    if (!e.isTrusted || !started || e.button !== 0) return;
    started = false;
    const field = document.activeElement;
    if (field?.matches('input[type=password]')) return;
    // Wait for the browser to finish double-click word selection.
    setTimeout(() => {
      const selection = window.getSelection();
      let text, node;
      if (field?.matches("textarea,input") && typeof field.selectionStart === "number") {
        text = field.value.slice(field.selectionStart,field.selectionEnd);
        node = field;
      } else {
        text = selection?.toString();
        node = selection?.anchorNode;
        if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;
      }
      if (text?.trim()) open(text.trim(), node?.closest?.("[lang]")?.lang || "", e.clientX,e.clientY);
    },0);
  },true);
  document.addEventListener("keydown", e => { if (e.key === "Escape") dismiss(); },true);
  window.addEventListener("pagehide",dismiss);
  window.addEventListener("resize",dismiss);
  document.addEventListener("scroll", e => { if (card && e.target !== card) dismiss(); },true);
})();
