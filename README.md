# オープンデータ編集マップ

位置情報座標を含む CSV をドラッグ・アンド・ドロップするか、URL で指定すると、地図とスプレッドシート形式で位置情報データを編集し、新しいCSVデータをダウンロードすることができます。

<img width="1166" alt="スクリーンショット_2023-03-22_17_05_54" src="https://user-images.githubusercontent.com/1124652/226838649-d24c1d43-6832-461f-a74d-b50d2ceba455.png">

## Web アプリケーション版の機能、使い方 (一般ユーザー向け)

- https://geolonia.github.io/opendata-editor/ を開きます。
- 位置情報座標を含むCSVファイルまたはExcelファイルを画面にドラッグ・アンド・ドロップすると、地図上にアイコンが表示され、画面下にはスプレッドシート形式で各データが表示されます。
  - アイコンをクリックするとスプレッドシート上の対応するデータがハイライトされます。
  - 反対にスプレッドシート上のデータをクリックすると、地図上で対応するポイントがハイライトされます。
- 編集マップのURLのクエリパラメータにCSVファイルのURLを指定し、編集マップのリンクを作ることができます
  - 例: 高松市のオープンデータ(AED一覧)を編集マップで開くためのリンク: https://geolonia.github.io/opendata-editor/?data=https://opendata.takamatsu-fact.com/aed_location/data.csv
- スプレッドシートの左端の「編集」または「削除」ボタンで、各データの編集ができます。
- 地図右下の「データを追加」ボタンで、新規データを追加することができます。
- 右上の「エクスポート」ボタンを押せば、編集済みの CSVファイルをダウンロードすることができます。

## 仕様

### 出力されるCSV

出力されるCSVの[サンプルをダウンロード](https://opendata.takamatsu-fact.com/aed_location/data.csv)してください。

### CSV の位置情報座標列のカラムタイトル

以下の文字列があるデータをサポートしています。

- `latitude`, `longitude`

## コンポーネントとして使う (開発者向け)

### インストール

```shell
npm install @geolonia/opendata-editor
```

### 使い方

```typescript
import { OpenDataEditor } from '@geolonia/opendata-editor';
import '@geolonia/opendata-editor/style.css';

export const Page = (): JSX.Element => {
  return (
    <>
      <OpenDataEditor />
    </>
  );
};
```

## ライセンス、利用規約、フィードバック

- ソースコードのライセンスは MIT ライセンスです。
- 機能改善のための提案、アイディアを歓迎しています。

# 開発者向け情報

## ローカル環境構築

以下のコマンドで環境を用意してください。

```
$ git clone git@github.com:geolonia/opendata-editor.git
$ cd opendata-editor
$ npm install
```

以下のコマンドで起動します。

```
$ npm run dev
```

http://localhost:3000/opendata-editor またはポート番号3000が使えないときは、コンソール上に表示されるURLにアクセスして下さい。

## リリース

Web 版は main ブランチに変更がマージされたタイミングでリリースされます。

ライブラリー版は Release が作成されたタイミングで npmjs.com に publish されます。事前に package.json の `version` を上げることを忘れないで下さい。
