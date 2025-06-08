-- ~/.config/nvim/after/plugin/which-key.lua
local ok, wk = pcall(require, "which-key")
if not ok then return end

wk.setup {
  presets = {
    operators    = false,  -- d/c/y 系のフックを無効化
    motions      = true,
    text_objects = true,
    windows      = false,
    nav          = false,
  },
  triggers = "auto",
  triggers_blacklist = {
    n = { "d", "c", "y" },
    v = { "d", "c", "y" },
  },
}

