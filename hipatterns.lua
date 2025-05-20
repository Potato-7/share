asnovski/mini.hipatterns",
    -- 任意：必要なときだけロード
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

