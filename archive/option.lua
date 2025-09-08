    -- 任意：必要なときだけロード
werShell (Core) があれば pwsh.exe、なければ従来の powershell.exe
vim.opt.shell = vim.fn.executable("pwsh.exe") == 1 and "pwsh.exe" or "powershell.exe"

-- PowerShell を非対話／UTF-8 モードで起動
vim.opt.shellcmdflag = table.concat({
  "-NoLogo",
  "-NoProfile",
  "-NonInteractive",
  "-ExecutionPolicy RemoteSigned",
  "-Command"
}, " ")

-- stderr も含めて UTF-8 で受け取り、最後にシェルの終了コードを返す
vim.opt.shellredir = [[2>&1 | Out-File -FilePath %s -Encoding UTF8; exit $LastExitCode]]

-- make や filter 時のパイプも同様に
vim.opt.shellpipe  = [[2>&1 | Out-File -FilePath %s -Encoding UTF8; exit $LastExitCode]]

-- 引用／クオートまわりは空に
vim.opt.shellquote  = ""
vim.opt.shellxquote = ""
    event = { "BufReadPost", "BufNewFile" },
    -- または `lazy = false` で常時ロード
    -- lazy = false,
    config = function()
      -- デフォルトの高亮パターンを使う場合
      require("mini.hipatterns").setup({
        -- デフォルトで用意されているハイライターをそのまま使う
        highlighters = {
          -- HEX カラーコード (#rrggbb/#rgb) を背景色プレビュー
          hex_color = require("mini.hipatterns").gen_highlighter.hex_color(),
          -- URL を下線
          url = require("mini.hipatterns").gen_highlighter.url(),
          -- TODO/FIX/HACK/NOTE/TODO
          todo = require("mini.hipatterns").gen_highlighter.todo({ cue = { "TODO", "FIX", "HACK", "NOTE" } }),
        },
      })
    end,
  },
}

