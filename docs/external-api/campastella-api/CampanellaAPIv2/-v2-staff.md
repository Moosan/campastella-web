# /v2/staff

## GET

全スタッフを取得する

| パラメータ名   | データ型 | 必須かどうか | 備考                                |
| -------------- | -------- | ------------ | ----------------------------------- |
| activated_only | bool     | no           | activated が yes のもののみ取得する |

## レスポンス

- 200
  - 取得成功
- 401
  - 認証トークンが不正
- 403
  - 権限がない
    - 権限レベル 0 以上が必要

### 応答フォーマット

```
{
  "code": 200,
  "response": {
    "staffs": [
      {
        "id": 1,
        "discord_id": 123456789012345,
        "discord_name": "",
        "vrc_display_names": [],
        "activated": "yes",
        "updated": "2024-03-20 19:18:52",
        "created": "2024-03-20 19:18:52"
      },
      {
        "id": 2,
        "discord_id": 123,
        "discord_name": "",
        "vrc_display_names": [],
        "activated": "yes",
        "updated": "2024-03-20 23:35:21",
        "created": "2024-03-20 23:35:21"
      },
      {
        "id": 3,
        "discord_id": 368029521376575500,
        "discord_name": "",
        "vrc_display_names": [],
        "activated": "yes",
        "updated": "2024-03-20 23:45:33",
        "created": "2024-03-20 23:36:39"
      }
    ]
  }
}
```

## POST

新規スタッフを追加する

| パラメータ名 | データ型 | 必須かどうか | 備考                        |
| ------------ | -------- | ------------ | --------------------------- |
| discord_id   | int      | yes          | Discord の ID(18 桁の数字)  |
| discord_name | string   | no           | Discord の表示名            |
| activated    | bool     | no           | 有効かどうか(省略時は true) |
|              |          |              |                             |

## レスポンス

- 201
  - 作成成功
- 400
  - 必須パラメータが存在しない / リクエスト形式が不正(型不一致など)
- 401
  - 認証トークンが不正
- 403
  - 権限がない
    - 権限レベル 10 以上が必要
- 409
  - データ衝突エラー
    - 同一の discordId が既に登録されている

### 応答フォーマット

```
{"code":201,"response":{}}
```
