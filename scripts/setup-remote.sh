#!/bin/bash
# リモート開発環境セットアップスクリプト
# 外出先のスマホからPCにアクセスするための環境を構築します
# 対応OS: Linux / macOS

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== リモート開発環境セットアップ ===${NC}"
echo ""

OS="$(uname -s)"

# -------------------------------------------------------
# Step 1: Tailscale
# -------------------------------------------------------
echo -e "${YELLOW}[Step 1] Tailscale のインストール...${NC}"

if command -v tailscale &>/dev/null; then
    echo "Tailscale はすでにインストールされています"
else
    if [ "$OS" = "Darwin" ]; then
        if command -v brew &>/dev/null; then
            brew install tailscale
        else
            echo -e "${RED}Homebrew が見つかりません。https://tailscale.com/download/mac からインストールしてください${NC}"
            exit 1
        fi
    elif [ "$OS" = "Linux" ]; then
        curl -fsSL https://tailscale.com/install.sh | sh
    else
        echo -e "${RED}対応していないOSです。手動でインストールしてください: https://tailscale.com/download${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}Tailscale を起動してログインします...${NC}"
if [ "$OS" = "Darwin" ]; then
    # macOSではアプリとして起動
    echo "macOSの場合はシステムトレイのTailscaleアイコンからログインしてください"
else
    sudo tailscale up
fi

echo ""
echo -e "${GREEN}✓ Tailscale セットアップ完了${NC}"
echo "  スマホにも Tailscale アプリをインストールして同じアカウントでログインしてください"
echo "  → iOS: App Store / Android: Play Store で「Tailscale」を検索"
echo ""

# -------------------------------------------------------
# Step 2: code-server
# -------------------------------------------------------
echo -e "${YELLOW}[Step 2] code-server のインストール...${NC}"

if command -v code-server &>/dev/null; then
    echo "code-server はすでにインストールされています"
else
    curl -fsSL https://code-server.dev/install.sh | sh
fi

echo ""
echo -e "${GREEN}✓ code-server インストール完了${NC}"
echo ""

# -------------------------------------------------------
# Step 3: code-server 起動
# -------------------------------------------------------
echo -e "${YELLOW}[Step 3] code-server を起動します...${NC}"
echo ""

# パスワード設定
if [ -z "$CODE_SERVER_PASSWORD" ]; then
    # ランダムなパスワードを生成
    PASSWORD=$(openssl rand -base64 12 2>/dev/null || tr -dc 'A-Za-z0-9' </dev/urandom | head -c 16)
else
    PASSWORD="$CODE_SERVER_PASSWORD"
fi

# Tailscale IPアドレスを取得
TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "未取得")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  code-server 接続情報"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  URL:      http://${TAILSCALE_IP}:8080"
echo "  パスワード: ${PASSWORD}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "スマホの Tailscale をONにしてから、上記URLをブラウザで開いてください"
echo ""
echo "停止するには Ctrl+C を押してください"
echo ""

PASSWORD="$PASSWORD" code-server \
    --bind-addr 0.0.0.0:8080 \
    --auth password
