# /v2/character

## GET

全キャラクターを取得する

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
