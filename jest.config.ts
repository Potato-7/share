// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',

  // ここがポイント：整形ロジックを読み込む
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // 自分のコードのスタックは欲しいので短すぎない値に
  stackTraceLimit: 30,

  // 余計な装飾を減らして Amazon Q に投げやすく
  verbose: false,
}

export default config
