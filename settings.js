(async () => {
  const fa = browser.i18n.getUILanguage().startsWith("fa");
  if (fa) {
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
    document.querySelector('[for="source"]').textContent = "زبان مبدأ";
    document.querySelector('[for="target"]').textContent = "زبان مقصد";
    document.querySelector("#status + p").textContent = "متن انتخاب‌شده برای ترجمه به MyMemory ارسال می‌شود. تنظیمات زبان روی همین دستگاه ذخیره می‌شود.";
  }
  const saved = await browser.storage.local.get(defaults);
  const locale = browser.i18n.getUILanguage();
  const names = new Intl.DisplayNames(locale, {type:"language"});
  for (const key of ["source","target"]) {
    const select = document.getElementById(key);
    if (key === "source") select.add(new Option(fa ? "تشخیص خودکار" : "Detect automatically", "auto"));
    for (const code of [...languages].sort((a,b) => names.of(a).localeCompare(names.of(b),locale))) {
      select.add(new Option(code === "fa" && !fa ? names.of(code)+" (فارسی)" : names.of(code),code));
    }
    select.value = saved[key];
    select.onchange = async () => {
      await browser.storage.local.set({[key]:select.value});
      document.getElementById("status").textContent = fa ? "ذخیره شد" : "Saved";
    };
  }
})();
