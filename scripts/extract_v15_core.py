from pathlib import Path

html = Path(__file__).resolve().parent.parent / "add" / "yomuyomu_v15_restored (1).html"
text = html.read_text(encoding="utf-8")
i = text.index("var UK=")
j = text.index("</script>", i)
s = text[i:j]
s = "var GG = window.YOMUYOMU_V15_GG;\nvar GG_N = window.YOMUYOMU_V15_GG_N;\n" + s
s = s.replace(
    "document.getElementById('app')",
    "document.querySelector('#screen-practice .yomy-v15-app')",
)
s = s.replace(
    "document.body.classList.toggle('dark',d)",
    "document.querySelector('#screen-practice .yomy-v15-shell')?.classList.toggle('dark',d)",
)
s = s.replace("if(t==='rank')buildLb();", "")
out = Path(__file__).resolve().parent.parent / "js" / "yomuyomu-v15-core.js"
out.write_text(s, encoding="utf-8")
print("wrote", out, "chars", len(s))
