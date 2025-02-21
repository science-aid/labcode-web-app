# ベースイメージを指定（Node.jsのLTS版）
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY app/package*.json ./

# 依存関係をインストール
RUN npm install --production

# アプリケーションのソースコードをコピー
COPY app ./

# アプリを実行
CMD ["npm", "run", "dev"]
