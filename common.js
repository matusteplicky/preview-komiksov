// Turns "1-12, 20, 30-35" or "1-51 !13-15" or "all" into a list of page numbers.
function parsePages(spec, total) {
  const s = String(spec || "all").trim().toLowerCase();
  const range = (t) => {
    const m = t.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) return [];
    const a = +m[1], b = +(m[2] || m[1]);
    const out = [];
    for (let i = Math.min(a, b); i <= Math.max(a, b); i++) if (i >= 1 && i <= total) out.push(i);
    return out;
  };
  const tokens = s.split(/[\s,;]+/).filter(Boolean);
  let include = [], exclude = new Set();
  for (const t of tokens) {
    if (t === "all" || t === "vsetky") include.push(...range("1-" + total));
    else if (t[0] === "!") range(t.slice(1)).forEach((p) => exclude.add(p));
    else include.push(...range(t));
  }
  if (!include.length) include = range("1-" + total);
  const seen = new Set();
  return include.filter((p) => !exclude.has(p) && !seen.has(p) && seen.add(p));
}
async function loadBooks() {
  const r = await fetch("books.json", { cache: "no-cache" });
  return (await r.json()).books;
}
const pad = (n) => String(n).padStart(2, "0");
