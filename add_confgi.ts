// apps/shikakuruapi/jest.setup.ts

const ORIG = console.error

beforeAll(() => {
  console.error = (...args: any[]) => {
    // Error を文字列化
    const text = args
      .map((a) => (a instanceof Error ? (a.stack ?? a.message) : String(a)))
      .join(' ')

    // node_modules の巨大な1行（ミニファイコード）を雑に潰す
    const cleaned = text
      // よくある「@prisma」「node_modules」「.pnpm」由来を短縮
      .replace(/(.{0,200})(?:\s+at\s+.*node_modules.*)$/gs, '$1\n[stack trimmed: node_modules]')
      // さらに “巨大1行” 対策（行が異常に長いものを切る）
      .split('\n')
      .map((line) => (line.length > 500 ? line.slice(0, 500) + ' …[trimmed]' : line))
      .join('\n')

    ORIG(cleaned)
  }
})

afterAll(() => {
  console.error = ORIG
})

