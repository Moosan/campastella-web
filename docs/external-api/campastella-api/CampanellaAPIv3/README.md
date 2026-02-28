# Campanella API v3 仕様

v3 では API パス体系を `/{domain}/v3/<group>/<resource>` に整理し、画像・ログ・削除系の挙動が強化されています。  
このドキュメントでは v2 の仕様書をベースに、[更新ドキュメント](../v3.md)の変更点を反映した完全な v3 版仕様をまとめています。

## 共通事項

| 項目 | 内容 |
| ---- | ---- |
| ベース URL | `${EXTERNAL_API_BASE_URL}` (例: `https://api.campanella.jp`) |
| コンテンツタイプ | `application/json`（ファイル upload は `multipart/form-data`） |
| 認証 | Bearer Token (下記 `POST /v3/dev/auth_token` で取得) |
| レスポンス形式 | `{"code": <HTTP Status>, "response": <payload>}` |

### 認証

#### `POST /v3/dev/auth_token`

| パラメータ | 型 | 必須 | 説明 |
| ---------- | -- | ---- | ---- |
| `email` | string | yes | 管理者アカウントのメール |
| `password` | string | yes | パスワード |

**レスポンス例**

```json
{
  "code": 201,
  "response": {
    "token": "xxxxxxxx",
    "expires_in": 3600
  }
}
```

#### `DELETE /v3/dev/auth_token`

| パラメータ | 型 | 必須 | 説明 |
| ---------- | -- | ---- | ---- |
| `token` | string | yes | 無効化したいトークン |

---

## CMS: スタッフ & キャラクター

### データ構造

```json
{
  "id": 1,
  "discord_id": 123456789012345678,
  "discord_name": "SampleUser",
  "vrc_display_names": [],
  "activated": "yes",
  "created": "2024-03-20 19:18:52",
  "updated": "2024-04-01 10:00:00"
}
```

```json
{
  "id": 10,
  "staff": { "...": "staff summary" },
  "name": "Campanella",
  "type": "cast",
  "comment": "",
  "personality": "",
  "topic": "",
  "x_id": "",
  "introduction_video_url": "",
  "birthday": "2024-03-20",
  "board_image": { "id": 2, "variants": { "original": "...", "square": "..." } },
  "poster_image": null,
  "event_poster_image": null,
  "sign_image": null,
  "activated": "yes",
  "created": "2024-03-20 19:46:38",
  "updated": "2024-03-20 20:12:45"
}
```

画像フィールド (`*_image`) は `{ id: number, variants: Record<string, string> }` の形になり、`variants.original` のほか最適化済みサイズが含まれます。

### `GET /v3/cms/staff`

全スタッフ一覧。`activated_only` パラメータは廃止され、 `activated` 状態でフィルタする場合はクライアントで絞込む。

### `POST /v3/cms/staff`

| パラメータ | 型 | 必須 | 備考 |
| ---------- | -- | ---- | ---- |
| `discord_id` | int | yes | 18 桁 Discord ID |
| `discord_name` | string | no | 256 文字まで |
| `activated` | bool | no | default: true |

### `GET /v3/cms/staff/:id`

指定スタッフ取得。

### `PUT /v3/cms/staff/:id`

body は POST と同じ。

### `DELETE /v3/cms/staff/:id`

| クエリ | 型 | 必須 | 備考 |
| ------ | -- | ---- | ---- |
| `force` | bool | no | true で参照関係を強制削除 |

### `GET /v3/cms/staff/:staff_id/character`

スタッフに紐づくキャラクター一覧。レスポンスは上記構造。

### `POST /v3/cms/staff/:staff_id/character`

| パラメータ | 型 | 必須 | 備考 |
| ---------- | -- | ---- | ---- |
| `name` | string | yes | 256 文字まで |
| `type` | enum(`cast`,`boy`) | no | default `cast` |
| `comment` | string | no | 2048 文字まで |
| `personality` | string | no |
| `topic` | string | no |
| `x_id` | string | no |
| `introduction_video_url` | string(url) | no |
| `birthday` | Date | no | `YYYY-MM-DD` (JST 解釈) |
| `activated` | bool | no | default true |
| `board_image` | file | no |
| `poster_image` | file | no |
| `event_poster_image` | file | no |
| `sign_image` | file | no |

作成成功時、`Location` ヘッダーに `/v3/cms/staff/{staff_id}/character/{new_id}`。

### `GET /v3/cms/staff/:staff_id/character/:character_id`

単一キャラクターの取得。

### `PUT /v3/cms/staff/:staff_id/character/:character_id`

POST と同じパラメータを送信。画像ファイルを省略した場合は既存を維持。`event_poster_image` も更新可能。

### `DELETE /v3/cms/staff/:staff_id/character/:character_id`

| クエリ | 型 | 必須 | 備考 |
| ------ | -- | ---- | ---- |
| `force` | bool | no | true で関連リソースを強制削除 |

### `DELETE /v3/cms/staff/:staff_id/character/:character_id/image/:type`

`type` は `board`, `poster`, `event_poster`, `sign` のいずれか。指定画像のみ削除しキャラクター本体は残します。

### `GET /v3/cms/character`

スタッフに紐付くキャラクターをまとめて取得。レスポンス構造は `/staff/:id/character` と同じですが `staff` が常に含まれます。

---

## CMS: VRC ID

### `GET /v3/cms/staff/:staff_id/vrc_id`

指定スタッフに紐づく VRC ID 一覧を取得。

### `PUT /v3/cms/staff/:staff_id/vrc_id`

| パラメータ | 型 | 必須 | 備考 |
| ---------- | -- | ---- | ---- |
| `vrc_display_name` | string | yes | 256 文字まで |
| `vrc_id` | string | yes | 256 文字まで |

新規追加 / 更新どちらも `200 OK` を返すようになりました。

### `DELETE /v3/cms/staff/:staff_id/vrc_id`

| パラメータ | 型 | 必須 | 備考 |
| ---------- | -- | ---- | ---- |
| `vrc_display_name` | string | yes | 削除対象を指定 |

---

## CMS: VRC Display Message / Image

### `GET /v3/cms/vrc_display_message`

全メッセージ取得。

### `POST /v3/cms/vrc_display_message`

| パラメータ | 型 | 必須 | 備考 |
| ---------- | -- | ---- | ---- |
| `key` | string | yes | 1〜256 文字、英数/`_`/`-`/`.` のみ |
| `content` | string | yes | 2048 文字まで |

### `GET/PUT/DELETE /v3/cms/vrc_display_message/:key`

キーでメッセージ取得 / 更新 / 削除。`PUT` の `content` も 2048 文字制限。

### `GET /v3/cms/vrc_display_image`

登録済み画像の一覧。

### `POST /v3/cms/vrc_display_image`

| パラメータ | 型 | 必須 | 備考 |
| ---------- | -- | ---- | ---- |
| `key` | string | yes | 1〜256 文字、英数/`_`/`-`/`.` |
| `image` | file | yes | PNG/JPEG |

### `GET/PUT/DELETE /v3/cms/vrc_display_image/:key`

- `GET`: 単一画像を取得。レスポンスは `{key, image_url, updated}`。
- `PUT`: `image` パラメータで差し替え。
- `DELETE`: レコード削除。

### `DELETE /v3/cms/vrc_display_image/:key/image`

キーは残しつつ画像データのみ削除。

---

## VRC: World Context

### `GET /v3/vrc/world_context`

ワールド表示用の集約情報を返却。`character` オブジェクトは v3 構造に統一され、画像は `variants` を持つ形に変更。日時パラメータは JST の UNIX タイムスタンプとして解釈されます。

---

## 参考

- 旧仕様: [Campanella API v2](../CampanellaAPIv2)
- v2→v3 変更差分: [v3.md](../v3.md)

`CampanellaAPIv3` 以下のドキュメントを増やしたい場合は、本ファイルを分割しても構いません。
