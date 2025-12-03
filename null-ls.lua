return {
  "jose-elias-alvarez/null-ls.nvim",
  dependencies = {
    "nvim-lua/plenary.nvim",
  },
  config = function()
    local null_ls = require("null-ls")

    null_ls.setup({
      sources = {
        null_ls.builtins.formatting.prettier.with({
          command = "prettier",
          only_local = "node_modules/.bin",
        }),
        null_ls.builtins.diagnostics.eslint_d.with({
          only_local = "node_modules/.bin",
        }),
      },
    })
  end,
}

