# リモート開発環境ガイド

外出先のスマホから、ローカルPCの開発環境にアクセスするためのセットアップガイドです。

## 必要なもの

- PC（Windows / Mac / Linux）
- スマートフォン（iOS / Android）
- インターネット接続（PC・スマホそれぞれ）

---

## セットアップ概要

| ツール | 役割 |
|--------|------|
| **Tailscale** | スマホとPCを安全にVPN接続（ポート開放不要・無料） |
| **code-server** | ブラウザでVS Codeを使えるようにする |

---

## セットアップ手順

### Linux / macOS（自動スクリプト）

```bash
chmod +x scripts/setup-remote.sh
./scripts/setup-remote.sh
```

スクリプトが Tailscale と code-server を自動的にインストールして起動します。

---

### Windows（手動セットアップ）

#### Step 1: Tailscale インストール

1. [tailscale.com/download](https://tailscale.com/download) からWindowsインストーラをダウンロード
2. インストール後、Tailscaleにサインアップ（Googleアカウント等で可）
3. タスクトレイのTailscaleアイコンをクリック → 「Connect」

#### Step 2: code-server インストール

PowerShellを管理者権限で起動して実行：

```powershell
# Scoopを使う場合
scoop install code-server

# または公式バイナリを直接ダウンロード
# https://github.com/coder/code-server/releases から
# windows-amd64 の .exe をダウンロードして実行
```

#### Step 3: code-server 起動

```powershell
code-server --bind-addr 0.0.0.0:8080 --auth password
```

起動後、表示されたパスワードをメモしてください。

---

### スマホ側の設定

1. App Store / Play Store で **「Tailscale」** をインストール
2. PCと同じアカウントでログイン
3. TailscaleアプリでVPNをON
4. PCの Tailscale IPアドレスを確認（PCのTailscaleアプリ or `tailscale ip -4` コマンド）
5. スマホのブラウザで `http://<PCのTailscale IP>:8080` を開く
6. パスワードを入力 → VS Codeが使えるようになります

---

## 使い方

### スマホからVS Codeを開く

```
http://<PCのTailscale IP>:8080
```

- PCのすべてのファイル・フォルダにアクセス可能
- ターミナルも使える（Ctrl+` または メニュー → ターミナル）
- gitコマンドもそのまま使用可能

### スマホからSSHでターミナルアクセス

Tailscale接続中であれば、ターミナルアプリ（Termius等）から：

```
ssh <PCのユーザー名>@<PCのTailscale IP>
```

### 開発サーバーをスマホで確認する

code-serverのターミナル内で開発サーバーを起動：

```bash
# yomuyomuの場合
cd ~/path/to/yomuyomu
python -m http.server 5505
```

スマホブラウザで `http://<PCのTailscale IP>:5505` にアクセス

---

## Claudeとの開発継続

[claude.ai/code](https://claude.ai/code) はクラウドで動作しているため、**スマホのブラウザからそのまま使えます**。  
特別な設定は不要です。

---

## トラブルシューティング

| 症状 | 対処 |
|------|------|
| スマホからつながらない | スマホとPC両方でTailscaleがONか確認 |
| code-serverのURLが開けない | PC側のファイアウォールでポート8080を許可 |
| パスワードがわからない | `cat ~/.config/code-server/config.yaml` でパスワード確認 |
| Tailscale IPが変わった | Tailscaleのマイページで確認、またはPCで `tailscale ip -4` を実行 |

---

## セキュリティについて

- TailscaleはエンドツーエンドのWireGuard暗号化を使用しており、安全です
- code-serverはTailscale経由でのみアクセス可能（パブリックインターネットには公開されない）
- code-serverのパスワードは必ず設定してください
