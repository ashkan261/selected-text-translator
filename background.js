function normalizeLanguage(tag) {
  if (!tag) return;
  if (/^zh/i.test(tag)) return /TW|HK|Hant/i.test(tag) ? "zh-TW" : "zh-CN";
  const base = tag.toLowerCase().split("-")[0];
  return languages.includes(base) ? base : undefined;
}

async function detect(text, hint) {
  const result = await browser.i18n.detectLanguage(text);
  const detected = normalizeLanguage(result.languages[0]?.language);
  if (result.isReliable && detected) return detected;
  if (/[پچژگ]/u.test(text) && !/[ٹڈڑںھ]/u.test(text)) return "fa";
  return normalizeLanguage(hint) || detected || (/^[a-z\s'-]+$/i.test(text) ? "en" : undefined);
}

// Break at whitespace when possible and keep separators outside the translation.
function splitText(text) {
  const encoder = new TextEncoder();
  const parts = [];
  while (text.length) {
    let bytes = 0, end = 0, boundary = 0;
    for (const char of text) {
      bytes += encoder.encode(char).length;
      if (bytes > 500) break;
      if (/\s/u.test(char) && end) boundary = end;
      end += char.length;
    }
    if (end < text.length && boundary) end = boundary;
    const segment = text.slice(0, end).trimEnd();
    const rest = text.slice(segment.length);
    const separator = rest.match(/^\s*/u)[0];
    parts.push({segment, separator});
    text = rest.slice(separator.length);
  }
  return parts;
}

async function translate(msg, signal) {
  const {source, target} = await browser.storage.local.get(defaults);
  const from = source === "auto" ? await detect(msg.text, msg.hint) : source;
  if (!languages.includes(from) || !languages.includes(target)) throw Error("Choose a source language in the extension settings.");
  if (from === target) return msg.text;
  let output = "";
  for (const {segment, separator} of splitText(msg.text)) {
    signal.throwIfAborted();
    const url = new URL("https://api.mymemory.translated.net/get");
    url.search = new URLSearchParams({q:segment, langpair:from+"|"+target});
    const res = await fetch(url, {signal, credentials:"omit", referrerPolicy:"no-referrer", cache:"no-store",redirect:"error"});
    if (res.status === 429) throw Error("Daily translation limit reached. Try again later.");
    if (!res.ok) throw Error("Translation service unavailable.");
    const data = await res.json();
    if (data.quotaFinished || Number(data.responseStatus) === 429) throw Error("Daily translation limit reached. Try again later.");
    const value = data.responseData?.translatedText;
    if (Number(data.responseStatus) !== 200 || typeof value !== "string" || !value.trim()) throw Error("Translation unavailable for this language pair.");
    output += value + separator;
  }
  return output;
}

// One connection per selection. Closing the card cancels outstanding requests.
browser.runtime.onConnect.addListener(port => {
  if (port.name !== "selection" || !port.sender.tab) return;
  const controller = new AbortController();
  port.onDisconnect.addListener(() => controller.abort());
  const receive = async msg => {
    port.onMessage.removeListener(receive);
    const timeout = setTimeout(() => controller.abort(), 45000);
    let reply;
    try {
      if (typeof msg.text !== "string" || !msg.text.trim()) throw Error("Select some text first.");
      if ([...msg.text].length > 5000) throw Error("Select up to 5,000 characters at a time.");
      reply = {text:await translate(msg, controller.signal)};
    } catch (e) {
      reply = {error:e.name === "AbortError" ? "Translation timed out." : e instanceof TypeError ? "Cannot reach MyMemory. Check your connection." : e.message};
    } finally {
      clearTimeout(timeout);
    }
    try { port.postMessage(reply); } catch { /* Selection was dismissed. */ }
  };
  port.onMessage.addListener(receive);
});
