# エンドポイント名

## メソッド

対応しうるメソッドは GET/POST/PUT/PATCH/DELETE です。  
必要なパラメータは以下のようなテーブルで表現されます。

| パラメータ名 | データ型 | 必須かどうか | 備考 |
| ------------ | -------- | ------------ | ---- |
| test         | string   | yes          |      |

リクエストは`application/json`もしくは`multipart/form-data`,`application/x-www-form-urlencoded`のいずれかの必要があります。

- データ型一覧
  - int
    - 整数
  - string
    - 文字列
  - bool
    - ブール値(true,yes / false,no)
  - enum()
    - ()内で指定されているデータの何れか
  - DateTime
    - Y-m-d T:i:s 形式の日時データ
  - Date
    - Y-m-d 形式の日付データ
  - File
    - ファイルデータ
      - `multipart/form-data`でファイルを直接渡すか、ファイルの内容を Base64 に変換した文字列を渡すことが可能です。

## レスポンス

500 系エラーは API 側のロジックの不具合であるため記載していません。

- ステータスコード
  - 発生する条件

### 応答フォーマット

応答フォーマットの code 及び response はどのエンドポイントも共通です。
code が 200 以外の場合、response はエラーの詳細になります。

成功の例

```
{"code":200,"response":{"hello":"world"}}
```

エラーの例

```
{"code":404,"response":{"message":"Route\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093"}}
```
