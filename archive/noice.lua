ne_popup)を無効化して、
    -- すべての :cmd や / 検索は下部の普通の cmdline で表示
    opts = {
      cmdline = {
        view = "cmdline",
      },
      messages = {
        view = "split",        -- :messages を水平分割に流す（お好みで）
      },
      views = {
        cmdline_popup = { enabled = false },
        popupmenu      = { enabled = false },
      },
      presets = {
        bottom_search         = false,  -- / 検索のポップアップをオフ
        command_palette       = false,  -- コマンドパレット風もオフ
        long_message_to_split = true,   -- 長いメッセージは split に流す
      },
    },
  },
}
