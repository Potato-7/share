
-- ~/.config/nvim/lua/plugins/mini-hipatterns.lua
return {
  {
    "echasnovski/mini.hipatterns",
    lazy = true,
    ft   = { "css", "scss", "html", "javascript", "typescript", "markdown" },
    config = function()
      local hip = require("mini.hipatterns")

      -- 共通: 0–255 の文字列を数値に
      local to_num = function(s) return tonumber(s) end

      -- rgb() → #rrggbb
      local rgb_color = function(_, m)
        local r, g, b = m:match("rgb%((%d+),%s*(%d+),%s*(%d+)%)")
        return hip.compute_hex_color_group(
          string.format("#%02x%02x%02x", to_num(r), to_num(g), to_num(b)),
          "bg"
        )
      end

      -- rgba() → アルファを掛けた #rrggbb
      local rgba_color = function(_, m)
        local r, g, b, a = m:match("rgba%((%d+),%s*(%d+),%s*(%d+),%s*(%d*%.?%d+)%)")
        a = tonumber(a); if not a or a<0 or a>1 then return false end
        return hip.compute_hex_color_group(
          string.format(
            "#%02x%02x%02x",
            math.floor(to_num(r)*a),
            math.floor(to_num(g)*a),
            math.floor(to_num(b)*a)
          ),
          "bg"
        )
      end

      -- hsl() → #rrggbb
      local hsl_color = function(_, m)
        local h, s, l = m:match("hsl%((%d+),%s*(%d+)%%%%,%s*(%d+)%%%%%)")
        h, s, l = tonumber(h), tonumber(s)/100, tonumber(l)/100
        -- HSL → RGB の変換
        local function hue2rgb(p, q, t)
          if t < 0 then t = t + 1 end
          if t > 1 then t = t - 1 end
          if t < 1/6 then return p + (q-p)*6*t end
          if t < 1/2 then return q end
          if t < 2/3 then return p + (q-p)*(2/3-t)*6 end
          return p
        end
        local r, g, b
        if s == 0 then
          r, g, b = l, l, l
        else
          local q = l < 0.5 and (l * (1 + s)) or (l + s - l*s)
          local p = 2*l - q
          r = hue2rgb(p, q, h/360 + 1/3)
          g = hue2rgb(p, q, h/360)
          b = hue2rgb(p, q, h/360 - 1/3)
        end
        return hip.compute_hex_color_group(
          string.format("#%02x%02x%02x", r*255, g*255, b*255),
          "bg"
        )
      end

      -- hsla() → アルファを掛けた #rrggbb
      local hsla_color = function(_, m)
        local h, s, l, a = m:match("hsla%((%d+),%s*(%d+)%%%%,%s*(%d+)%%%%,%s*(%d*%.?%d+)%)")
        a = tonumber(a); if not a or a<0 or a>1 then return false end
        -- 上の hsl_color を再利用してベース色取得
        local base = hsl_color(_, m:gsub("hsla", "hsl"))
        -- compute_hex_color_group はテーブルや関数も受け取るので、
        -- 一度色文字列だけ取り出してからアルファ合成する簡易版
        -- （小数点誤差はありますが概ねOK）
        local hex = base:match("#%x%x%x%x%x%x")
        local r = tonumber(hex:sub(2,3),16) * a
        local g = tonumber(hex:sub(4,5),16) * a
        local b = tonumber(hex:sub(6,7),16) * a
        return hip.compute_hex_color_group(
          string.format("#%02x%02x%02x", r, g, b),
          "bg"
        )
      end

      hip.setup({
        highlighters = {
          -- #RRGGBB / #RGB
          hex_color       = hip.gen_highlighter.hex_color({ style = "background" }),
          -- 短縮 #RGB
          hex_color_short = {
            pattern = "#%x%x%x%f[%X]",
            group   = hip.gen_highlighter.hex_color(),
          },

          -- rgb/rgba
          rgb_color  = { pattern = "rgb%(%d+,%s*%d+,%s*%d+%)",          group = rgb_color    },
          rgba_color = { pattern = "rgba%(%d+,%s*%d+,%s*%d+,%s*%d*%.?%d+%)", group = rgba_color },

          -- hsl/hsla
          hsl_color  = { pattern = "hsl%(%d+,%s*%d+%%%%,%s*%d+%%%%%)",       group = hsl_color  },
          hsla_color = { pattern = "hsla%(%d+,%s*%d+%%%%,%s*%d+%%%%,%s*%d*%.?%d+%)", group = hsla_color },
        },
      })
    end,
  },
}
