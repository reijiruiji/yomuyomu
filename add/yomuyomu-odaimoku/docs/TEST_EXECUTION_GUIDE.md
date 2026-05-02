# Yomuyomu Odaimoku v15+ - テスト実行ガイド＆チェックリスト

## 📊 テスト実行フロー

### 1. **ローカル環境での確認**

```bash
# ターミナル
cd /path/to/yomuyomu-odaimoku
python -m http.server 8000

# ブラウザ
http://localhost:8000
```

### 2. **Chrome DevTools で確認**

**F12** キーで開く → 以下を確認

#### Application タブ
```
☑ Manifest
  - 短い名前: よむよむ
  - テーマカラー: #2d7a4a
  - アイコン: 192x192, 512x512, maskable

☑ Service Workers
  - 登録ステータス: active
  - スコープ: /
  - 更新: 自動確認中

☑ Storage
  - Local Storage: user_data キーが存在
  - Cache Storage: yomuyomu-v1-static, dynamic, images
```

#### Console タブ
```javascript
✅ [SW] Service Worker loaded - Version: yomuyomu-v1
✅ [DevTools] v1.0.0 initialized
✅ [Charts] Initializing all charts
✅ All charts initialized
```

#### Network タブ
```
リクエスト一覧:
  index.html          - 状態: 200 (キャッシュから)
  styles.css          - 状態: 200 (キャッシュから)
  config.js           - 状態: 200 (キャッシュから)
  storage.js          - 状態: 200 (キャッシュから)
  ui.js               - 状態: 200 (キャッシュから)
  charts.js           - 状態: 200 (キャッシュから)
  service-worker.js   - 状態: 200 (キャッシュから)
  chart.min.js        - 状態: 200 (CDN)

キャッシュ戦略の確認:
  - 静的ファイル (CSS/JS): CacheFirst (キャッシュを優先)
  - HTML: NetworkFirst (新しい方を優先)
  - 画像: CacheFirst (キャッシュを優先)
```

---

## 🧪 ブラウザコンソールテスト

### ステップ1: モジュール存在確認

コンソール（F12 > Console）で実行：

```javascript
// === 基本モジュール確認 ===
console.log('TERMINOLOGY:', typeof TERMINOLOGY)       // object
console.log('MESSAGES:', typeof MESSAGES)             // object
console.log('AWAKENING_ABILITIES:', typeof AWAKENING_ABILITIES) // object

// === 関数確認 ===
console.log('get_message:', typeof get_message)       // function
console.log('StorageManager:', typeof StorageManager) // object
console.log('updateDashboard:', typeof updateDashboard) // function
console.log('showToast:', typeof showToast)           // function
console.log('renderCharts:', typeof renderCharts)     // function
console.log('DevTools:', typeof DevTools)             // object
console.log('TestSuite:', typeof TestSuite)           // object
```

**期待される出力:**
```
TERMINOLOGY: object
MESSAGES: object
AWAKENING_ABILITIES: object
get_message: function
StorageManager: object
updateDashboard: function
showToast: function
renderCharts: function
DevTools: object
TestSuite: object
```

### ステップ2: ストレージテスト

```javascript
// === ローカルストレージ確認 ===
localStorage.getItem('user_data')  // null または JSON 文字列

// === ダミーデータ生成 ===
DevTools.generateMockData(30)  // 30日分のデータを生成

// === 確認 ===
const userData = JSON.parse(localStorage.getItem('user_data'))
console.log('User data:', userData)
console.log('Sessions:', userData.sessions.length)  // 30 前後
```

**期待される出力:**
```javascript
{
  "name": "テストユーザー",
  "email": null,
  "sessions": [
    {
      "date": "2024-04-02",
      "count_chanting": 45,
      "count_gongyo": 12,
      "merit_chanting": 225,
      "merit_gongyo": 60,
      "duration": 2345,
      "notes": "テストセッション"
    },
    // ... 30日分のデータ
  ]
}
```

### ステップ3: UI 更新テスト

```javascript
// === ダッシュボード更新 ===
updateDashboard()

// === 結果確認 ===
document.getElementById('stat-today-count').textContent  // 数値が表示されている
document.getElementById('stat-week-count').textContent   // 数値が表示されている
document.getElementById('stat-month-count').textContent  // 数値が表示されている

// === トースト通知テスト ===
showSuccess('成功しました')
showError('エラーが発生しました')
showWarning('警告です')
showInfo('情報です')
```

### ステップ4: グラフテスト

```javascript
// === グラフ初期化 ===
renderCharts()

// === 確認 ===
document.getElementById('chart-practice-history')  // Canvas 要素が存在
document.getElementById('chart-merit-breakdown')    // Canvas 要素が存在
document.getElementById('chart-ability-scores')     // Canvas 要素が存在
document.getElementById('chart-practice-composition') // Canvas 要素が存在
```

### ステップ5: DevTools テスト

```javascript
// === パネル表示 ===
DevTools.showPanel()  // 画面右下に緑色のパネルが表示

// === ストレージ検査 ===
DevTools.inspectStorage()  // JSON形式でストレージの内容を表示

// === パフォーマンス計測 ===
DevTools.measurePerformance()
// 出力例:
// {
//   "domContentLoaded": 125.50,
//   "loadComplete": 245.30,
//   "firstPaint": 85.20,
//   "firstContentfulPaint": 120.40,
//   "resourceCount": 12,
//   "totalResourceSize": 245120
// }

// === メモリ使用量 ===
DevTools.getMemoryUsage()
// 出力例:
// {
//   "usedJSHeapSize": "15.35 MB",
//   "totalJSHeapSize": "28.50 MB",
//   "jsHeapSizeLimit": "2000.00 MB"
// }

// === キャッシュ状態 ===
DevTools.getCacheStatus().then(console.log)
// 出力例:
// {
//   "yomuyomu-v1-static": {
//     "count": 9,
//     "urls": ["/index.html", "/css/styles.css", ...]
//   },
//   "yomuyomu-v1-dynamic": {
//     "count": 3,
//     "urls": [...]
//   }
// }
```

### ステップ6: テストスイート実行

```javascript
// === すべてのテストを実行 ===
TestSuite.runAll()

// === 期待される出力（例） ===
// ✅ TERMINOLOGY が定義されている
// ✅ MESSAGES が定義されている
// ✅ get_message() が機能する
// ✅ StorageManager が定義されている
// ... (全12カテゴリ、約50テスト)
// 
// ========== テスト結果 ==========
// ✅ 合格: 48
// ❌ 失敗: 2
// 📊 成功率: 96.0%

// === 個別テスト実行 ===
TestSuite.run('storage')     // ストレージテスト
TestSuite.run('ui')          // UI テスト
TestSuite.run('charts')      // グラフテスト
TestSuite.run('service-worker')  // Service Worker テスト
```

---

## ✅ チェックリスト

### 機能テスト

```
☑ ダッシュボード画面が表示される
☑ 本日の統計が表示される
☑ 週間統計が表示される
☑ 月間統計が表示される
☑ グラフ（修行量推移）が表示される
☑ グラフ（功徳内訳）が表示される
☑ グラフ（能力スコア）が表示される
☑ グラフ（修行内訳）が表示される
☑ アチーブメントバッジが表示される
☑ ナビゲーション切り替えが機能
☑ 勤行画面でカウント機能が動作
☑ リーダーボード画面が表示
☑ 設定画面が表示
```

### UI テスト

```
☑ トースト通知が表示される
☑ モーダル（確認ダイアログ）が動作
☑ フォーム検証が機能
☑ ボタンクリック反応が良好
☑ レスポンシブデザイン（モバイル・タブレット・デスクトップ）
☑ ダーク/ライトモードの切り替え（OS 設定）
```

### 通知テスト

```
☑ Push 通知の許可プロンプトが表示
☑ Test 通知を送信可能
☑ 通知クリックでアプリがフォーカス
☑ 通知が正しく表示される（タイトル・本文・アイコン）
```

### キャッシュ・オフラインテスト

```
☑ オンライン状態で全機能が動作
☑ DevTools でネットワークを Offline に設定
☑ オフライン状態でキャッシュから読み込み
☑ Service Worker が正常に機能
☑ キャッシュが自動更新される
```

### パフォーマンステスト

```
☑ 初期読み込み < 3秒
☑ ダッシュボード更新 < 1秒
☑ グラフ描画 < 2秒
☑ メモリ使用量 < 50MB
☑ CPU 使用率が低い（アイドル時）
☑ FCP (First Contentful Paint) < 1.5秒
☑ LCP (Largest Contentful Paint) < 2.5秒
```

### ブラウザ互換性テスト

```
☑ Chrome (最新版)
☑ Firefox (最新版)
☑ Safari (最新版)
☑ Edge (最新版)
☑ モバイル Safari (iOS)
☑ Chrome Mobile (Android)
```

---

## 🐛 よくあるエラーと対処法

### エラー: "Chart is not defined"

```javascript
// 原因: Chart.js が読み込まれていない
// 確認
typeof Chart !== 'undefined'  // false なら未読み込み

// 対処
// index.html に以下を確認
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
```

### エラー: "StorageManager is not defined"

```javascript
// 原因: storage.js が読み込まれていない
// 確認
typeof StorageManager !== 'undefined'  // false なら未読み込み

// 対処: index.html のスクリプト順序を確認
// ✓ 正しい順序:
//   1. config.js
//   2. utils.js
//   3. storage.js
//   4. その他のモジュール
```

### エラー: "Service Worker registration failed"

```javascript
// 原因: HTTPS が無効（ローカルホスト除く）
// 確認
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log(regs.length === 0 ? 'Not registered' : 'Registered')
})

// 対処
// ローカル開発: http://localhost:8000 で実行
// 本番環境: HTTPS を有効化
```

### エラー: "localStorage quota exceeded"

```javascript
// 原因: ローカルストレージが満杯
// 確認
localStorage.length  // アイテム数

// 対処
DevTools.clearStorage()  // すべクリア
// または
localStorage.removeItem('user_data')  // 特定項目削除
```

---

## 📈 テスト結果レポート例

### 実装完了時の期待される結果

```
🧪 Yomuyomu Odaimoku - Integration Test Suite v1.0.0
================================================

--- config.js テスト ---
✅ TERMINOLOGY が定義されている
✅ MESSAGES が定義されている
✅ get_message() が機能する
✅ get_term() が機能する

--- storage.js テスト ---
✅ StorageManager が定義されている
✅ ローカルストレージにアクセス可能
✅ ユーザーデータを取得可能
✅ ダミーデータを保存・取得

--- abilities.js テスト ---
✅ AWAKENING_ABILITIES が定義されている
✅ 9つの能力が定義されている

--- ui.js テスト ---
✅ showToast() が定義されている
✅ showSuccess() が定義されている
✅ updateDashboard() が定義されている
✅ formatTime() が定義されている
✅ formatTime() が正しく機能する
✅ calculateCurrentStreak() が定義されている

--- charts.js テスト ---
✅ Chart.js ライブラリが読み込まれている
✅ renderCharts() が定義されている
✅ updateCharts() が定義されている
✅ Chart カラー定義が正しい

--- service-worker.js テスト ---
✅ Service Worker が登録されている
✅ Notifications API が利用可能
✅ Cache API が利用可能

--- dev-tools.js テスト ---
✅ DevTools が定義されている
✅ DevTools.inspectStorage() が定義されている
✅ DevTools.generateMockData() が定義されている
✅ DevTools.measurePerformance() が定義されている

--- DOM 構造テスト ---
✅ メインコンテナが存在する
✅ ナビゲーションが存在する
✅ ダッシュボード画面が存在する
✅ 統計キャンバス要素が存在する
✅ フッターが存在する

--- データフロー統合テスト ---
✅ ダミーデータを生成・保存・取得
✅ ストリーク計算が機能する

--- UI 更新テスト ---
✅ ダッシュボード要素が更新可能
✅ モーダル機能が機能する
✅ トースト通知が機能する

--- パフォーマンステスト ---
✅ ページ読み込み時間を計測
   ⏱️  読み込み時間: 1245ms
✅ ローカルストレージ読み取り速度
   ⏱️  100回読み取り: 12.34ms

--- エラーハンドリングテスト ---
✅ 無効な日付を処理
✅ 空のデータを処理

========== テスト結果 ==========
┌─────────────┬────────────────────────────┐
│ (index)     │ Values                     │
├─────────────┼────────────────────────────┤
│ 0           │ '✅ PASS TERMINOLOGY...'   │
│ 1           │ '✅ PASS MESSAGES...'      │
│ ...         │ ...                        │
│ 48          │ '✅ PASS エラー処理'       │
└─────────────┴────────────────────────────┘

✅ 合格: 48
❌ 失敗: 0
📊 成功率: 100.0%
```

---

## 🚀 デプロイ前チェックリスト

```
コード品質:
  ☑ すべてのテストが PASS
  ☑ コンソールエラーがない
  ☑ コンソール警告が最小限
  ☑ コードレビュー完了

パフォーマンス:
  ☑ Lighthouse スコア > 90
  ☑ 読み込み時間 < 3秒
  ☑ メモリリークなし
  ☑ キャッシュ戦略が最適

セキュリティ:
  ☑ HTTPS が有効
  ☑ XSS 対策済み
  ☑ CSRF トークンなし (SPA のため)
  ☑ 敏感な情報は localStorage に保存していない

アクセシビリティ:
  ☑ 色のコントラスト比が十分
  ☑ キーボード操作が可能
  ☑ スクリーンリーダー対応
  ☑ モバイルフレンドリー

ドキュメント:
  ☑ README が完成
  ☑ API ドキュメントが完成
  ☑ トラブルシューティングガイドが完成
  ☑ デプロイ手順が記載

テスト:
  ☑ ユニットテスト: PASS
  ☑ 統合テスト: PASS
  ☑ E2E テスト: PASS
  ☑ ブラウザ互換性: OK
```

---

**すべてのチェックが完了したら、デプロイに進みます。**
