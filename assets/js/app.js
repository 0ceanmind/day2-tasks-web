/* Day 2 Tasks — auto-grow, autosave, export */
(function () {
  const KEY = "day2-tasks-v1";
  const areas = Array.from(document.querySelectorAll("textarea[data-f]"));
  const checks = Array.from(document.querySelectorAll("input[type=checkbox][data-c]"));

  function grow(el) {
    el.style.height = "auto";
    const cs = getComputedStyle(el);
    const border = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
    const min = parseFloat(cs.minHeight) || 0;
    el.style.height = Math.max(el.scrollHeight + border, min) + "px";
  }

  function load() {
    let data = {};
    try { data = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
    areas.forEach(el => { if (data[el.dataset.f] != null) el.value = data[el.dataset.f]; });
    checks.forEach(el => { if (data[el.dataset.c] != null) el.checked = !!data[el.dataset.c]; });
  }

  let t;
  function save() {
    clearTimeout(t);
    t = setTimeout(() => {
      const data = {};
      areas.forEach(el => { if (el.value) data[el.dataset.f] = el.value; });
      checks.forEach(el => { if (el.checked) data[el.dataset.c] = true; });
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    }, 250);
  }

  areas.forEach(el => {
    el.rows = 1;
    el.setAttribute("dir", "auto");
    el.addEventListener("input", () => { grow(el); save(); });
  });
  checks.forEach(el => el.addEventListener("change", save));

  function growAll() { areas.forEach(grow); }

  function fit() {
    const natural = 595.3 * (96 / 72);
    const scale = Math.min(1, (window.innerWidth - 16) / natural);
    document.documentElement.style.setProperty("--fit", scale.toFixed(4));
  }

  window.exportPDF = function () { growAll(); setTimeout(() => window.print(), 60); };
  window.clearAll = function () {
    if (!confirm("مسح كل المدخلات؟")) return;
    localStorage.removeItem(KEY);
    areas.forEach(el => { el.value = ""; grow(el); });
    checks.forEach(el => el.checked = false);
  };

  window.addEventListener("resize", fit);
  fit();
  load();
  growAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(growAll);
})();
