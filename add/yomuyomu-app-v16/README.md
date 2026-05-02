# よむよむお題目 v16

修行が『数字で証明される』アプリ。毎日のお題目・勤行を記録し、あなたの『成功パターン』を発見。

## 📦 ファイル構成

```
yomuyomu-app-v16/
├── index.html              # メイン HTML
├── manifest.json           # PWA 設定
├── service-worker.js       # バックグラウンド処理
│
├── css/
│   └── styles.css          # メインスタイル
│
├── js/
│   ├── config.js           # 固有単語・表現リスト（一元管理）
│   ├── utils.js            # ユーティリティ関数（パーリ語ベース）
│   ├── abilities.js        # 9つの能力定義
│   ├── storage.js          # データ永続化（localStorage）
│   ├── schedule-config.js  # スケジュール設定・Push通知
│   ├── practice.js         # 修行ログ記録
│   ├── reflection.js       # 修行後プロンプト
│   ├── app.js              # メイン初期化・チュートリアル
│   ├── ui.js               # UI更新関数（プレースホルダー）
│   ├── charts.js           # グラフ描画（プレースホルダー）
│   └── dev-tools.js        # デバッグツール（プレースホルダー）
│
└── icons/                  # PWA アイコン（別途用意）
```

## 🚀 セットアップ

### 1. ローカルで実行

```bash
# http-server をインストール（なければ）
npm install -g http-server

# ディレクトリで起動
cd yomuyomu-app-v16
http-server .

# ブラウザで http://localhost:8080 にアクセス
```

### 2. GitHub Pages でホスト

```bash
# リポジトリを作成
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/yomuyomu-app.git
git push -u origin main

# GitHub Pages 設定
# Settings > Pages > Source を "main branch" に設定
# URL: https://your-username.github.io/yomuyomu-app
```

## 💾 データ永続化

すべてのデータは localStorage に保存されます。

**ストレージキー**
- `practice_log_{YYYY-MM-DD}` - 修行ログ
- `ability_{pali_name}_{YYYY-MM-DD}` - 能力スコア
- `phala_{YYYY-MM-DD}` - 出来事ログ
- `schedule_chant` - お題目通知時間
- `tutorial_completed` - チュートリアル完了フラグ

## 🔧 デバッグモード

コンソール（F12 → Console）で以下を実行：

```javascript
window.enable_debug_mode()
// パスワード: namu_myoho_renge_kyo
```

デバッグパネルが左下に表示されます。

## 📝 テキスト一括変更

`js/config.js` を編集して、アプリ全体のテキストを一括変更可能です。

```javascript
const TERMINOLOGY = {
  PRACTICE_ACTIVITY: 'おべんぎょう',  // 『修行』の代わりの言葉
  CHANT: 'お題目',
  // ... その他の単語
};

const MESSAGES = {
  tutorial: { /* チュートリアル */ },
  main: { /* メイン画面 */ },
  // ... その他のメッセージ
};
```

## 🌐 PWA（ホーム画面に追加）

チュートリアル内で「ホーム画面に追加」を促します。

**iOS（Safari）**
1. 共有ボタン → 「ホーム画面に追加」

**Android（Chrome）**
1. メニュー → 「ホーム画面に追加」

## 📋 次の実装予定

- [ ] `js/ui.js` - ダッシュボード UI 更新関数
- [ ] `js/charts.js` - Chart.js グラフ描画
- [ ] `js/dev-tools.js` - ダミーデータ生成、データエクスポート
- [ ] `css/icons/` - PWA アイコン（192x192, 512x512, maskable）
- [ ] 覚醒度テスト実装
- [ ] カレンダービュー
- [ ] 相関分析グラフ
- [ ] 月次レポート生成

## 📞 パーリ語変数の説明

| 変数名 | 意味 | 例 |
|--------|------|-----|
| `divasam` | 日（パーリ語） | `get_divasam_ajja()` |
| `sattahassa` | 週 | `get_sattahassa_adi()` |
| `masam` | 月 | `get_masam_adi()` |
| `sadhana` | 修行 | `save_sadhana_log()` |
| `phala` | 果（出来事） | `save_phala_log()` |
| `ability` | 能力 | `save_ability_score()` |

## 📚 参考

- **Pali Terms（パーリ語能力体系）**：`js/abilities.js` 参照
- **固有単語リスト**：`js/config.js` の `TERMINOLOGY`
- **メッセージテンプレート**：`js/config.js` の `MESSAGES`

## ⚙️ 技術スタック

- **フロントエンド**：HTML5, CSS3, Vanilla JavaScript
- **データストア**：localStorage
- **グラフ**：Chart.js
- **PWA**：Service Worker, Web Manifest
- **デプロイ**：GitHub Pages / 任意のホスティング

## 🎨 カラースキーム

- **プライマリ**：#2e7d32（濃緑）
- **セカンダリ**：#1b5e20（深緑）
- **ライト**：#e8f5e9（薄緑）
- **アクセント**：#ffc107（黄）
- **テキスト**：#333333

---

**バージョン**：v16 Beta  
**最終更新**：2025-05-02  
**作者**：みずき（via Claude）
