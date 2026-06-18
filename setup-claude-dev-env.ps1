# Claude Code 開発環境セットアップ（ponytailモード + ピクセルアート可視化 + トークン予測）
# Windows / PowerShell 対応。VS Code と Claude Code がインストール済みであることが前提。
$ErrorActionPreference = "Stop"

Write-Host "[1/3] ponytail プラグイン導入（レイジー・シニアdevモード）"
claude plugin marketplace add DietrichGebert/ponytail
claude plugin install ponytail@ponytail

Write-Host "[2/3] VS Code 拡張導入"
code --install-extension pablodelucca.pixel-agents       # エージェントをピクセルアートで可視化
code --install-extension long-kudo.vscode-claude-status   # 残トークン・燃焼率の推定表示

Write-Host "[3/3] AGENTS.md に ponytail ルールを配置（他のLLMツールにも効かせる用）"
$rules = @'

# Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does the standard library already do this? Use it.
3. Does a native platform feature cover it? Use it.
4. Does an already-installed dependency solve it? Use it.
5. Can this be one line? Make it one line.
6. Only then: write the minimum code that works.

Rules:

- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
'@
Add-Content -Path "$HOME\AGENTS.md" -Value $rules -Encoding utf8

Write-Host "done. VS Codeを再起動するとピクセルアートとステータスバーが反映されます。"
