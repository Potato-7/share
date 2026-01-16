// jest.setup.ts
const originalPrepareStackTrace = Error.prepareStackTrace

Error.prepareStackTrace = (error, structuredStackTrace) => {
  const MAX_PRISMA_FRAMES = 3 // Prisma由来は先頭だけ残す（0にすると完全に消える）
  const prismaFrames: NodeJS.CallSite[] = []
  const appFrames: NodeJS.CallSite[] = []

  for (const cs of structuredStackTrace) {
    const fileName = cs.getFileName() || ''

    const isNodeModules = fileName.includes('node_modules')
    const isPrisma = fileName.includes('.prisma') || fileName.includes('@prisma')

    // 自分のコードは残す（node_modules じゃないもの）
    if (!isNodeModules) {
      appFrames.push(cs)
      continue
    }

    // Prismaは少しだけ残す（原因が Prisma っぽいときに役立つ）
    if (isPrisma && prismaFrames.length < MAX_PRISMA_FRAMES) {
      prismaFrames.push(cs)
    }
  }

  const filtered = [...appFrames, ...prismaFrames]

  // 既定の整形があるならそれに渡す
  if (originalPrepareStackTrace) {
    return originalPrepareStackTrace(error, filtered)
  }

  // フォールバック（通常ここには来ない）
  return `${error.name}: ${error.message}\n` + filtered.map(cs => `  at ${cs.toString()}`).join('\n')
}

