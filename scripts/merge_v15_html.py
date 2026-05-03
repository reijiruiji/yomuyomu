"""Inject v15 tutorial + practice UI + overlays into index.html."""
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent


def between(txt: str, start_marker: str, end_marker: str) -> str:
    a = txt.index(start_marker)
    b = txt.index(end_marker, a)
    return txt[a:b]


text = (root / "add" / "yomuyomu_v15_restored (1).html").read_text(encoding="utf-8")

tutorial = between(text, "<!-- ════ TUTORIAL ════ -->", "<!-- ════ MAIN APP ════ -->")
main_app = between(text, "<!-- ════ MAIN APP ════ -->", "<!-- ════ 読経オーバーレイ ════ -->")
main_app = main_app.replace('    <button class="tab" data-t="rank">🏆 功徳</button>\n', "")
main_app = re.sub(
    r"\n  <!-- ── 功徳ランキング ── -->.*?</div>\n(?=</div>\s*$)",
    "",
    main_app,
    flags=re.S,
)

overlays = between(text, "<!-- ════ 読経オーバーレイ ════ -->", "<!-- Tutorial walkthrough -->")
tut_walk = between(text, "<!-- Tutorial walkthrough -->", "<script>")

practice_section = (
    '    <section id="screen-practice" class="screen">\n'
    '      <header>\n'
    '        <h1>お題目・勤行・暦</h1>\n'
    '        <p class="subtitle">タップカウンター・勤行カルーセル・六曜カレンダー（復元 UI）</p>\n'
    '      </header>\n'
    '      <div class="container">\n'
    '        <p style="margin-bottom:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">\n'
    '          <button type="button" class="btn btn-outline" id="btn-yomy-walkthrough">画面ガイド</button>\n'
    '          <button type="button" class="btn btn-outline" id="btn-yomy-reset-tutorial">チュートリアルをやり直す</button>\n'
    '        </p>\n'
    '        <div class="yomy-v15-shell">\n'
    + main_app.replace("<!-- ════ MAIN APP ════ -->\n", "")
    .replace('<div id="app">', '<div class="yomy-v15-app" style="display:none">', 1).strip()
    + "\n        </div>\n      </div>\n    </section>\n"
)

idx_path = root / "index.html"
idx_text = idx_path.read_text(encoding="utf-8")

idx_text = idx_text.replace(
    '  <link rel="stylesheet" href="/css/styles.css">',
    '  <link rel="stylesheet" href="/css/styles.css">\n  <link rel="stylesheet" href="/css/yomuyomu-v15.css">',
)

idx_text = idx_text.replace(
    "</nav>\n\n  <!-- ========== メインコンテンツエリア ========== -->",
    "</nav>\n\n" + tutorial + "\n  <!-- ========== メインコンテンツエリア ========== -->",
)

s = idx_text.index("    <!-- 勤行画面 -->")
e = idx_text.index("    <!-- 統計画面 -->")
idx_text = idx_text[:s] + practice_section + idx_text[e:]

idx_text = idx_text.replace(
    "</main>\n\n  <!-- ========== フッター ========== -->",
    overlays.strip() + "\n" + tut_walk.strip() + "\n\n</main>\n\n  <!-- ========== フッター ========== -->",
)

needle = '  <script src="/js/dev-tools.js"></script>'
inject = (
    '  <script src="/js/yomuyomu-v15-data.js"></script>\n'
    '  <script src="/js/yomuyomu-v15-core.js"></script>\n'
    + needle
)
idx_text = idx_text.replace(needle, inject)

idx_path.write_text(idx_text, encoding="utf-8")
print("ok")
