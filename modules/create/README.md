# @geolonia/create-opendata-editor

https://geolonia.github.io/opendata-editor/ で公開されている opendata-editor と同様のものを、自分で用意したサーバー上でセルフホストできます。  
本パッケージはテンプレート生成用のパッケージです。

## 動作要件

Node.js v18 以上 (最新の LTS 版を推奨)

## セルフホストの手順

### 1. テンプレートの作成

```sh
npm create @geolonia/opendata-editor
npm install
```

上記のコマンドによって、下記のファイルが生成されます。

/
├── .editorconfig
├── .gitignore
├── index.html
├── package.json
├── public
│   └── robots.txt
└── src
    └── index.ts

### 2. カスタマイズ

必要に応じて各ファイルを編集して下さい。  
主な修正点としては以下の通りです:

- index.html
  - favicon の設定
  - セルフホストした opendata-editor を検索にヒットさせたい場合は `<meta name="robots" content="noindex" />` の削除
    - デフォルトでは検索よけをする設定になっています。
  - API キーを `<script src="https://cdn.geolonia.com/v1/embed?geolonia-api-key=YOUR-API-KEY"></script>` に対して設定
    - [一部のホスティングサービスのドメイン](https://docs.geolonia.com/tutorial/002/#%E5%AF%BE%E8%B1%A1%E3%81%A8%E3%81%AA%E3%82%8B-url-%E3%81%8A%E3%82%88%E3%81%B3%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9)においては YOUR-API-KEY のままでも動作します。
- public/robots.txt
  - セルフホストした opendata-editor を検索にヒットさせたい場合は `Disallow: /` の削除
    - デフォルトでは検索よけをする設定になっています。

### 3. ローカル環境でのテスト

ローカル環境でテストしたい場合、プロジェクトルート (package.json があるディレクトリー) で以下のコマンドを実行することで http://localhost:3000 でアクセスできるようになります。

```sh
npm run dev
```

### 4. ビルドとデプロイ

以下のコマンドによって、dist/ ディレクトリーの中にビルド済みファイルが生成されます。

```sh
npm run build
```

生成されたファイルにはサーバーサイドで動作するプログラムは含みませんので、

- GitHub Pages
- Cloudflare Pages
- AWS S3
- Vercel

などの静的サイトホスティングにデプロイすることで動作します。
