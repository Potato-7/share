return {
  "iamcco/markdown-preview.nvim",
  lazy = false,
  priority = 1000,

  -- ✅ PowerShellの相対パス問題を回避（Windows向け）
  build = function()
    local path = vim.fn.stdpath("data") .. "/lazy/markdown-preview.nvim/app"
    if vim.fn.isdirectory(path) == 0 then
      vim.fn.mkdir(path, "p")
    end
    vim.cmd("!cd " .. path .. " && npm install")
  end,

  init = function()
    vim.g.mkdp_echo_preview_url = 1
    vim.g.mkdp_browser = "edge" -- Windowsなら edge が安定
    vim.g.mkdp_auto_close = 0
    vim.g.mkdp_filetypes = { "markdown" }

    vim.keymap.set("n", "<leader>mp", "<cmd>MarkdownPreviewToggle<CR>", {
      desc = "Toggle Markdown Preview",
    })
  end,
}

