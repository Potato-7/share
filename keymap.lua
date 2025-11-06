-- ~/.config/nvim/lua/plugins/my-keymaps.lua
return {
  -- which-key が <leader>p などをプレフィクス扱いしている場合に解除
  {
    "folke/which-key.nvim",
    opts = function(_, opts)
      opts.defaults = opts.defaults or {}
      opts.defaults["<leader>p"] = nil
      opts.defaults["<leader>y"] = nil
      opts.defaults["<leader>Y"] = nil
      opts.defaults["<leader>d"] = nil
    end,
  },

  -- キーマップ本体
  {
    -- ダミーのプラグイン定義: keys テーブルだけ使う
    keys = {
      -- ===== greatest remap ever =====
      { "<leader>p", '"_dP', mode = "x", desc = "Paste over (keep yank)", noremap = true, silent = true },

      -- ===== next greatest remap ever =====
      { "<leader>y", '"+y', mode = { "n", "v" }, desc = "Yank to system clipboard", noremap = true, silent = true },
      { "<leader>Y", '"+Y', mode = "n", desc = "Yank line to system clipboard", noremap = true, silent = true },
      { "<leader>d", '"_d', mode = { "n", "v" }, desc = "Delete to blackhole", noremap = true, silent = true },

      -- ===== 画面に写ってた周辺の便利 remap（任意） =====
      { "Y", "yg$", mode = "n", desc = "Yank to end of line", noremap = true, silent = true },
      { "n", "nzzzv", mode = "n", desc = "next match centered", noremap = true, silent = true },
      { "N", "Nzzzv", mode = "n", desc = "prev match centered", noremap = true, silent = true },
      { "J", "mzJ`z", mode = "n", desc = "join keep cursor", noremap = true, silent = true },
      { "<C-d>", "<C-d>zz", mode = "n", desc = "half page down centered", noremap = true, silent = true },
      { "<C-u>", "<C-u>zz", mode = "n", desc = "half page up centered", noremap = true, silent = true },
      { "<C-c>", "<Esc>", mode = "i", desc = "Ctrl-C behaves like Esc", noremap = true, silent = true },
    },
  },
}

