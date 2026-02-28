# /v2/staff/{staff_id}/character

## GET

指定したスタッフ ID に紐づく全キャラクターを取得する

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
    "characters": [
      {
        "id": 6,
        "staff": {
          "id": 1,
          "discord_id": 123456789012345,
          "discord_name": "",
          "vrc_display_names": [],
          "activated": "yes",
          "updated": "2024-03-20 19:18:52",
          "created": "2024-03-20 19:18:52"
        },
        "board_image_id": 2,
        "poster_image_id": null,
        "sign_image_id": null,
        "name": "fugafuga",
        "type": "cast",
        "comment": "",
        "personality": "",
        "topic": "",
        "x_id": "",
        "introduction_video_url": "",
        "birthday": "2024-03-20",
        "activated": "yes",
        "updated": "2024-03-20 19:46:38",
        "created": "2024-03-20 19:46:38"
      },
      {
        "id": 7,
        "staff": {
          "id": 1,
          "discord_id": 123456789012345,
          "discord_name": "",
          "vrc_display_names": [],
          "activated": "yes",
          "updated": "2024-03-20 19:18:52",
          "created": "2024-03-20 19:18:52"
        },
        "board_image_id": 3,
        "poster_image_id": null,
        "sign_image_id": null,
        "name": "test",
        "type": "cast",
        "comment": "",
        "personality": "",
        "topic": "",
        "x_id": "",
        "introduction_video_url": "",
        "birthday": "2024-03-20",
        "activated": "yes",
        "updated": "2024-03-20 19:58:06",
        "created": "2024-03-20 19:58:06"
      },
      {
        "id": 8,
        "staff": {
          "id": 1,
          "discord_id": 123456789012345,
          "discord_name": "",
          "vrc_display_names": [],
          "activated": "yes",
          "updated": "2024-03-20 19:18:52",
          "created": "2024-03-20 19:18:52"
        },
        "board_image_id": 4,
        "poster_image_id": null,
        "sign_image_id": null,
        "name": "test4",
        "type": "cast",
        "comment": "",
        "personality": "",
        "topic": "",
        "x_id": "",
        "introduction_video_url": "",
        "birthday": "2024-03-20",
        "activated": "yes",
        "updated": "2024-03-20 20:12:45",
        "created": "2024-03-20 20:12:45"
      }
    ]
  }
}
```

## POST

新規キャラクターを追加する

| パラメータ名           | データ型        | 必須かどうか | 備考                        |
| ---------------------- | --------------- | ------------ | --------------------------- |
| name                   | string          | no           | 有効かどうか(省略時は true) |
| type                   | enum(cast, boy) | no           | 種別(省略時は cast)         |
| comment                | string          | no           | 自己紹介・コメント          |
| personality            | string          | no           | 属性                        |
| topic                  | string          | no           | 話せる話題                  |
| x_id                   | string          | no           | X(旧 Twitter)ID             |
| introduction_video_url | string          | no           | 紹介動画の URL              |
| birthday               | Date            | no           | 誕生日(省略時は現在時刻)    |
| activated              | bool            | no           | 有効かどうか(省略時は true) |
| board_image            | File            | no           | ボード画像                  |
| poster_image           | File            | no           | ポスター画像                |
| sign_image             | File            | no           | サイン画像                  |

## レスポンス

- 201
  - 作成成功
- 400
  - リクエスト形式が不正(型不一致など)
- 401
  - 認証トークンが不正
- 403
  - 権限がない
    - 権限レベル 10 以上が必要

### 応答フォーマット

```
{"code":201,"response":{}}
```
