
-- ~/.config/nvim/lua/plugins/mini-hipatterns.lua
return {
  {
    "echasnovski/mini.hipatterns",
    lazy = true,
    ft   = { "css", "scss", "html", "javascript", "typescript", "markdown" },
    config = function()
      local hip = require("mini.hipatterns")
      local to_num = tonumber

      -- hex → 背景プレビュー
      local hex_opts = { style = "background" }

      -- rgb() → #rrggbb
      local rgb_color = function(_, m)
        local r, g, b = m:match("rgb%((%d+),%s*(%d+),%s*(%d+)%)")
        return hip.compute_hex_color_group(
          string.format("#%02x%02x%02x", to_num(r), to_num(g), to_num(b)),
          "bg"
        )
      end

      -- rgba() → α乗算 #rrggbb
      local rgba_color = function(_, m)
        local r, g, b, a = m:match("rgba%((%d+),%s*(%d+),%s*(%d+),%s*([%d%.]+)%)")
        a = to_num(a)
        if not a or a < 0 or a > 1 then return false end
        local rr = math.floor(to_num(r) * a)
        local gg = math.floor(to_num(g) * a)
        local bb = math.floor(to_num(b) * a)
        return hip.compute_hex_color_group(
          string.format("#%02x%02x%02x", rr, gg, bb),
          "bg"
        )
      end

      -- hsl() / hsla() は既存コードと同じ
      local hsl_color = function(_, m)
        local h, s, l = m:match("hsl%((%d+),%s*(%d+)%%,%s*(%d+)%%%)")
        h, s, l = to_num(h), to_num(s)/100, to_num(l)/100
        local function hue2rgb(p, q, t)
          if t<0 then t=t+1 end; if t>1 then t=t-1 end
          if t<1/6 then return p+(q-p)*6*t end
          if t<1/2 then return q end
          if t<2/3 then return p+(q-p)*(2/3-t)*6 end
          return p
        end
        local r, g, b
        if s==0 then r,g,b=l,l,l
        else
          local q = l<0.5 and l*(1+s) or l+s-l*s
          local p = 2*l - q
          r = hue2rgb(p,q,h/360+1/3)
          g = hue2rgb(p,q,h/360)
          b = hue2rgb(p,q,h/360-1/3)
        end
        return hip.compute_hex_color_group(
          string.format("#%02x%02x%02x", r*255, g*255, b*255),
          "bg"
        )
      end
      local hsla_color = function(_, m)
        local a = m:match("hsla%([^,]+,[^,]+,[^,]+,([%d%.]+)%)")
        a = to_num(a)
        if not a or a<0 or a>1 then return false end
        local base = hsl_color(nil, m:gsub("^hsla", "hsl"))
        local hex = base:match("#%x%x%x%x%x%x")
        local r = math.floor(to_num(hex:sub(2,3),16)*a)
        local g = math.floor(to_num(hex:sub(4,5),16)*a)
        local b = math.floor(to_num(hex:sub(6,7),16)*a)
        return hip.compute_hex_color_group(
          string.format("#%02x%02x%02x", r, g, b),
          "bg"
        )
      end

      hip.setup({
        highlighters = {
          -- #rrggbb / #rgb
          hex_color       = hip.gen_highlighter.hex_color(hex_opts),
          hex_color_short = {
            pattern = "#%x%x%x%f[%X]",
            group   = hip.gen_highlighter.hex_color(),
          },

          -- rgb / rgba
          rgb_color  = { pattern = "rgb%(%d+,%s*%d+,%s*%d+%)",     group = rgb_color  },
          rgba_color = { pattern = "rgba%(%d+,%s*%d+,%s*%d+,%s*[%d%.]+%)", group = rgba_color },

          -- hsl / hsla
          hsl_color  = { pattern = "hsl%(%d+,%s*%d+%%,%s*%d+%%%)",       group = hsl_color  },
          hsla_color = { pattern = "hsla%(%d+,%s*%d+%%,%s*%d+%%,%s*[%d%.]+%)", group = hsla_color },
        },
      })
    end,
  },
}
