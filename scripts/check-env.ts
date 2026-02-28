import { getStrictServerEnv } from "../src/lib/env";

try {
  getStrictServerEnv();
  console.log("✅  必須のサーバー環境変数はすべて設定されています。");
} catch (error) {
  console.error("❌  必須の環境変数が不足しています。");
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
}
