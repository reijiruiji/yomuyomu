# AIに「ちゃんと手を抜け」と教育したら開発が変わった話

今回紹介するのは、じゃじゃじゃん！この「ponytail」ってアプリです。

（シュシュはついてきませんよ）

![AKB48的なポニーテール＋シュシュのイメージ](画像差し込み：ポニーテール+シュシュ)

アイコン、めっちゃキルアの兄ちゃんみたいじゃん…？

![HUNTER×HUNTER キルアの兄貴](画像差し込み：キルアの兄貴)

実際キルアの兄ちゃんが現実世界にいたら、こんな見た目で気だるそうにバグ修正してくれるんだろうな…

（ゲーム開発会社にいたら、このタイプの男性、愛想が良ければ人気者、愛想悪いとみんなが機嫌を伺う影のボスポジを確立しているに違いない）

そんな彼（？）の正体、つまりこのponytailというツールが一体何なのか、詳しく紹介していく。

## きっかけ

Claude Codeに何か頼むと、たまに「誰も頼んでない抽象化」や「将来のための設定ファイル」が生えてくることがある。動くものを書いてほしいだけなのに、気づくとinterfaceとfactoryとconfigが増えている。

これを直すプラグインがあった。名前が良い。**ponytail**。

## ponytailモードとは

一言でいうと「無駄に賢いシニアエンジニアに、サボらせるためのルールを叩き込む」プラグイン。

- これ本当に必要？（YAGNI）
- 標準ライブラリにある？ → あるなら使う
- OS/ブラウザのネイティブ機能でいける？ → それを使う
- 既存の依存関係で足りる？ → 新しいライブラリは追加しない
- 1行で書ける？ → 1行にする
- それでもダメなら、必要最小限のコードだけ書く

このハシゴを上から順に試して、最初に「これでいける」と思ったところで止まる。新しい依存関係を増やさない、誰も頼んでない抽象化を作らない、ボイラープレートを書かない。

導入は数十秒。`claude plugin marketplace add` してから `claude plugin install` するだけ（手順は記事末尾のスクリプト参照）。

## 開発環境を「見える化」する拡張

ついでにVS Code拡張も2つ入れてみた。

1. **pixel-agents** — Claude Codeのエージェントがピクセルアートのオフィスでちょこちょこ動く。実用性はゼロだが、画面を開いてるだけで楽しい。
2. **vscode-claude-status** — ステータスバーに「今日いくら分のトークンを使ったか」が出る。

この2つ目の拡張、最初ちょっとビビった。「今日$8.94、7日間$118.93、30日間$391.93」と出てきて、「えっ、月額3000円のはずなのに従量課金されてる！？」と一瞬パニックになった。

結論：杞憂だった。この拡張はAPIに繋がず、ローカルのログだけを見て「もしAPI従量課金だったらこの金額」を計算して表示しているだけ。実際の請求額は変わらない。サブスク勢は安心して数字を眺めて良い（むしろ「サブスクでこんなに使ってお得感がある」というのが分かって面白い）。

## 結局、毎回これ手動でやるの面倒じゃない？

ponytail入れて、拡張2つ入れて、AGENTS.mdにルール書いて……新しいPCやプロジェクトのたびにこれを手で繰り返すのはダルい。なので、AIにセットアップスクリプトを作らせた。

これをコピペして実行するだけで、上で紹介した環境が一発で整う。

### Mac/Linux/Git Bash/WSL 用

```bash
#!/usr/bin/env bash
set -e

claude plugin marketplace add DietrichGebert/ponytail
claude plugin install ponytail@ponytail

code --install-extension pablodelucca.pixel-agents
code --install-extension long-kudo.vscode-claude-status

cat >> "$HOME/AGENTS.md" <<'EOF'

# Ponytail, lazy senior dev mode
You are a lazy senior developer. Lazy means efficient, not careless.
1. Does this need to be built at all? (YAGNI)
2. Does the standard library already do this? Use it.
3. Does a native platform feature cover it? Use it.
4. Does an already-installed dependency solve it? Use it.
5. Can this be one line? Make it one line.
6. Only then: write the minimum code that works.
EOF

echo "done."
```

### Windows / PowerShell 用

```powershell
claude plugin marketplace add DietrichGebert/ponytail
claude plugin install ponytail@ponytail

code --install-extension pablodelucca.pixel-agents
code --install-extension long-kudo.vscode-claude-status

Add-Content -Path "$HOME\AGENTS.md" -Encoding utf8 -Value @'

# Ponytail, lazy senior dev mode
You are a lazy senior developer. Lazy means efficient, not careless.
1. Does this need to be built at all? (YAGNI)
2. Does the standard library already do this? Use it.
3. Does a native platform feature cover it? Use it.
4. Does an already-installed dependency solve it? Use it.
5. Can this be one line? Make it one line.
6. Only then: write the minimum code that works.
'@

Write-Host "done."
```

実行後はVS Codeを再起動すれば反映される。これだけで「AIに余計なものを作らせない」「使用状況を眺めて楽しむ」環境が手に入る。

---
*この記事自体もAIと一緒に書いた。手を抜くことについて書いた記事を、手を抜いて書くのは正しい姿勢だと思う。*
