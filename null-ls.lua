local null_ls = require("null-ls")

null_ls.setup({
  sources = {
    -- Prettier: プロジェクトの node_modules/.bin/prettier を使用
    null_ls.builtins.formatting.prettier.with({
      command = "prettier",
      only_local = "node_modules/.bin",
    }),

    -- ESLint_d: プロジェクトの node_modules/.bin/eslint_d を使用
    null_ls.builtins.diagnostics.eslint_d.with({
      only_local = "node_modules/.bin",
    }),
  },
})

