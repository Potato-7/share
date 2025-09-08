local map = vim.keymap.set
map("n", "<leader>ff", "<cmd>Telescope find_files<CR>", { desc = "Find Files" })
map("n", "<leader>lg", "<cmd>LazyGit<CR>", { desc = "Open LazyGit" })
