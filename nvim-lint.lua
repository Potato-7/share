return {
  "mfussenegger/nvim-lint",
  opts = {
    linters_by_ft = {
      javascript = { "eslint_d" },
      javascriptreact = { "eslint_d" },
      typescript = { "eslint_d" },
      typescriptreact = { "eslint_d" },
    },
    linters = {
      eslint_d = {
        cmd = "./node_modules/.bin/eslint_d",
      },
    },
  },
}

