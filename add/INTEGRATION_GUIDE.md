# Yomuyomu Odaimoku v15+ - 統合・デプロイガイド

## 📋 目次

1. [ファイル構成](#ファイル構成)
2. [セットアップ手順](#セットアップ手順)
3. [テスト実行](#テスト実行)
4. [デプロイ方法](#デプロイ方法)
5. [トラブルシューティング](#トラブルシューティング)
6. [パフォーマンス最適化](#パフォーマンス最適化)

---

## ファイル構成

```
yomuyomu-odaimoku/
├── index.html                 # メインページ
├── manifest.json              # PWA マニフェスト
├── service-worker.js          # Service Worker
├── css/
│   └── styles.css            # メインスタイルシート
├── js/
│   ├── config.js             # テキスト・用語定義
│   ├── utils.js              # ユーティリティ関数
│   ├── abilities.js          # 9能力定義
│   ├── storage.js            # ローカルストレージ管理
│   ├── schedule-config.js    # スケジュール管理
│   ├── practice.js           # 修行記録
│   ├── reflection.js         # 修行後プロンプト
│   ├── app.js                # メインアプリロジック
│   ├── ui.js                 # UI更新関数
│   ├── charts.js             # グラフ描画
│   └── dev-tools.js          # デバッグツール
├── images/                    # アイコン・画像
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── icon-maskable-192x192.png
│   ├── icon-maskable-512x512.png
│   └── badge-72x72.png
└── test-suite.js             # テストスイート

```

---

## セットアップ手順

### 1. ローカル環境での実行

#### 方法 A: Python の SimpleHTTPServer

```bash
# プロジェクトフォルダへ移動
cd /path/to/yomuyomu-odaimoku

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

ブラウザで `http://localhost:8000` を開く

#### 方法 B: Node.js の http-server

```bash
# インストール（初回のみ）
npm install -g http-server

# サーバー起動
http-server -p 8000
```

#### 方法 C: VS Code Live Server

VS Code の拡張機能「Live Server」をインストール → `index.html` 右クリック → "Open with Live Server"

### 2. HTTPS 設定（推奨）

Service Worker は HTTPS 環境が必須です。ローカルホストは例外。

**本番環境の場合:**
- Let's Encrypt で無料の SSL/TLS 証明書を取得
- Web サーバーで HTTPS を有効化

### 3. ファイルパーミッション確認

```bash
# すべてのファイルが読み取り可能か確認
ls -la

# ディレクトリが実行可能か確認
chmod +x css/ js/ images/
```

---

## テスト実行

### ステップ1: ブラウザを開く

`http://localhost:8000` を開く

### ステップ2: DevTools を起動

キーボード: **`Ctrl+Shift+D`** (Windows/Linux) または **`Cmd+Shift+D`** (Mac)

または ブラウザコンソール（F12）で：

```javascript
DevTools.showPanel()
```

### ステップ3: テストスイートを実行

index.html にテストスイートを追加（オプション）

```html
<script src="test-suite.js"></script>
```

ブラウザコンソールで：

```javascript
// すべてのテストを実行
TestSuite.runAll()

// 個別テスト
TestSuite.run('storage')
TestSuite.run('ui')
TestSuite.run('charts')
TestSuite.run('service-worker')
```

### ステップ4: Chrome DevTools で確認

**F12** を押して以下のタブを確認：

| タブ | 確認項目 |
|------|---------|
| **Application** | Service Worker 登録, ローカルストレージ, キャッシュ |
| **Network** | リクエスト数, 読み込み時間, キャッシュ有効性 |
| **Console** | エラー・警告・ログ出力 |
| **Performance** | 読み込み時間, FCP (First Contentful Paint) |

---

## デプロイ方法

### 方法 1: Vercel（推奨・無料）

```bash
# インストール
npm install -g vercel

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

**メリット:**
- HTTPS 自動設定
- CDN 配信
- CI/CD 統合

### 方法 2: GitHub Pages

```bash
# リポジトリをクローン
git clone https://github.com/your-repo.git
cd yomuyomu-odaimoku

# GitHub Pages ブランチを作成
git checkout --orphan gh-pages

# ファイルをステージ
git add .
git commit -m "Deploy to GitHub Pages"

# GitHub にプッシュ
git push -u origin gh-pages
```

`https://your-username.github.io/yomuyomu-odaimoku/` でアクセス可能

### 方法 3: Netlify

```bash
# netlify-cli をインストール
npm install -g netlify-cli

# デプロイ
netlify deploy

# 本番環境にデプロイ
netlify deploy --prod
```

### 方法 4: 自社サーバー

```bash
# ファイルをサーバーにアップロード
scp -r ./* user@server:/var/www/yomuyomu/

# Web サーバー設定（Nginx）
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL 証明書
    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    # Service Worker キャッシュ設定
    location /service-worker.js {
        add_header Cache-Control "max-age=0, must-revalidate";
    }

    # 静的ファイルキャッシュ
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        add_header Cache-Control "max-age=31536000, immutable";
    }

    # ルートをリダイレクト
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## トラブルシューティング

### 問題: Service Worker が登録されない

**原因:** HTTPS が有効でない（ローカルホスト除く）

**解決:**
```javascript
// Chrome DevTools > Application > Manifest
// スコープと URL を確認

// コンソールで確認
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log(regs)
})
```

### 問題: キャッシュが古いデータを返す

**解決:**
```javascript
// DevTools パネルで「キャッシュをクリア」
DevTools.clearStorage()

// または コンソール
caches.keys().then(names => {
  names.forEach(name => caches.delete(name))
})
```

### 問題: グラフが表示されない

**確認:**
```javascript
// Chart.js が読み込まれているか
typeof Chart !== 'undefined'  // true であること

// キャンバス要素が存在するか
document.getElementById('chart-practice-history')

// renderCharts() を手動実行
renderCharts()
```

**解決:**
```html
<!-- CDN を再確認 -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
```

### 問題: localStorage が満杯

**原因:** ブラウザのストレージ容量超過（通常 5-10MB）

**解決:**
```javascript
// データを削除
localStorage.clear()

// または DevTools で選別的に削除
DevTools.clearStorage()

// IndexedDB への移行を検討
```

### 問題: UI が反応しない

**確認:**
```javascript
// ui.js が読み込まれているか
typeof updateDashboard === 'function'

// storage.js が読み込まれているか
typeof StorageManager !== 'undefined'

// コンソールエラーを確認
// F12 > Console タブ
```

### 問題: 通知が表示されない

**確認:**
```javascript
// Permission を確認
Notification.permission  // 'granted' であること

// 許可をリクエスト
Notification.requestPermission()

// テスト通知を送信
DevTools.triggerTestNotification()
```

### 問題: ダッシュボード更新が遅い

**パフォーマンス計測:**
```javascript
// DevTools で計測
DevTools.measurePerformance()

// メモリ使用量を確認
DevTools.getMemoryUsage()

// 低速な関数をプロファイリング
console.time('updateDashboard')
updateDashboard()
console.timeEnd('updateDashboard')
```

---

## パフォーマンス最適化

### 1. イメージ最適化

```bash
# WebP フォーマットに変換
cwebp image.png -o image.webp

# 画像を圧縮
imagemin images/* --out-dir=images --plugin=mozjpeg --plugin=pngquant
```

### 2. JavaScript バンドリング

```bash
# webpack でバンドル化
npm install -D webpack webpack-cli
npx webpack

# または Rollup
npm install -D rollup
npx rollup -c
```

### 3. CSS の最小化

```bash
# cssnano で最小化
npm install -D cssnano
npx cssnano styles.css -o styles.min.css
```

### 4. Gzip 圧縮

```bash
# Nginx 設定
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 5. キャッシュ戦略の調整

```javascript
// service-worker.js 内で TTL を設定
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7日

// 定期的にキャッシュを更新
setInterval(() => {
  updateCaches()
}, 24 * 60 * 60 * 1000) // 毎日
```

---

## パフォーマンスチェックリスト

```
✅ Service Worker が正常に登録されている
✅ キャッシュが有効に機能している
✅ Chart.js が読み込まれている
✅ ローカルストレージにダミーデータがある
✅ ダッシュボード更新が 1 秒以内に完了
✅ グラフ描画が 2 秒以内に完了
✅ FCP が 1.5 秒以下
✅ メモリ使用量が 50MB 以下
✅ キャッシュサイズが 10MB 以下
✅ すべてのテストが PASS
```

---

## ブラウザ互換性

| ブラウザ | バージョン | 対応 |
|---------|----------|------|
| Chrome | 40+ | ✅ |
| Firefox | 44+ | ✅ |
| Safari | 11+ | ✅ (PWA 機能は限定) |
| Edge | 15+ | ✅ |
| Opera | 27+ | ✅ |
| IE 11 | - | ❌ (非対応) |

---

## 本番環境チェックリスト

```
セキュリティ:
  ☑ HTTPS が有効
  ☑ CSP (Content Security Policy) ヘッダーが設定
  ☑ XSS 対策実装
  ☑ localStorage 暗号化（オプション）

パフォーマンス:
  ☑ Lighthouse スコア > 90
  ☑ 読み込み時間 < 3秒
  ☑ キャッシュ有効期間が適切
  ☑ CDN で配信

機能:
  ☑ Service Worker が登録
  ☑ Push 通知が機能
  ☑ オフラインモードが動作
  ☑ すべてのグラフが表示

テスト:
  ☑ 全テストが PASS
  ☑ 複数ブラウザで検証
  ☑ モバイル環境で検証
  ☑ Network Throttling で検証
```

---

## サポート・デバッグ

### ブラウザコンソール使用例

```javascript
// アプリバージョン確認
console.log('App version:', DevTools.version)

// ストレージ検査
DevTools.inspectStorage()

// ダミーデータ生成
DevTools.generateMockData(30)

// パフォーマンス計測
DevTools.measurePerformance()

// キャッシュ状態確認
DevTools.getCacheStatus().then(console.log)

// 全テスト実行
TestSuite.runAll()
```

### ログレベル設定

```javascript
// development
window.NODE_ENV = 'development'  // デバッグログ表示

// production
window.NODE_ENV = 'production'   // デバッグログ非表示
```

---

## 更新・保守

### 定期メンテナンス

- **週1回:** キャッシュを確認
- **月1回:** 依存ライブラリを更新（Chart.js など）
- **四半期1回:** Lighthouse で性能監査
- **年1回:** 全テストスイート実行

### バージョンアップ手順

```bash
# 新しいバージョンをテスト
git checkout -b v2.0-feature

# デプロイ前に検証
TestSuite.runAll()

# マージと本番デプロイ
git merge main
git push origin main
vercel --prod
```

---

**最終確認:** すべてのチェックリストが完了し、テストが PASS すればデプロイ可能です。

問題が発生した場合は、トラブルシューティングセクションを参照してください。
