# オープンデータ編集マップ

位置情報座標を含む CSV をドラッグ・アンド・ドロップするか、URL で指定すると、地図とスプレッドシート形式で位置情報データを編集し、新しいCSVデータをダウンロードすることができます。

<img width="1166" alt="スクリーンショット_2023-03-22_17_05_54" src="https://user-images.githubusercontent.com/1124652/226838649-d24c1d43-6832-461f-a74d-b50d2ceba455.png">

## 機能、使い方

- https://geolonia.github.io/opendata-editor/ を開きます。
- 位置情報座標を含むCSVファイルを画面にドラッグ・アンド・ドロップすると、地図上にアイコンが表示され、画面下にはスプレッドシート形式で各データが表示されます。
  - アイコンをクリックするとスプレッドシート上の対応するデータがハイライトされます。
  - 反対にスプレッドシート上のデータをクリックすると、地図上で対応するポイントがハイライトされます。
- 編集マップのURLのクエリパラメータにCSVファイルのURLを指定し、編集マップのリンクを作ることができます
  - 例: 高松市のオープンデータ(AED一覧)を編集マップで開くためのリンク: https://geolonia.github.io/opendata-editor/?data=https://opendata.takamatsu-fact.com/aed_location/data.csv
- スプレッドシートの左端の「編集」または「削除」ボタンで、各データの編集ができます。
- 地図左下の「データを追加」ボタンで、新規データを追加することができます。
- 右上の「エクスポート」ボタンを押せば、編集済みの CSVファイルをダウンロードすることができます。

## 仕様

### 出力されるCSV

出力されるCSVの[サンプルをダウンロード](https://opendata.takamatsu-fact.com/aed_location/data.csv)してください。

### CSV の位置情報座標列のカラムタイトル

以下の文字列があるデータをサポートしています。

- `latitude`, `longitude` 

## 追加予定の機能の案

- 地図画面で、新しい点データを作成する、点の位置をずらす、点を削除する
- 地図画面で、新しい点データの行を作成する、点を削除する

## ライセンス、利用規約、フィードバック

- ソースコードのライセンスは MIT ライセンスです。
- 機能改善のための提案、アイディアを歓迎しています。

# 開発者向け情報 / Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
