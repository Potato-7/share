-- ----------------------------------------
-- トリガー関数とトリガー設定
-- ----------------------------------------

-- 1) トリガー関数の定義
CREATE OR REPLACE FUNCTION set_update_timestamp()
  RETURNS TRIGGER AS $$
BEGIN
  -- UPDATE 時に update_dt のみを現在時刻に書き換える
  NEW.update_dt := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) m_user 用トリガー
DROP TRIGGER IF EXISTS trg_m_user_update ON m_user;
CREATE TRIGGER trg_m_user_update
  BEFORE UPDATE ON m_user
  FOR EACH ROW
  EXECUTE FUNCTION set_update_timestamp();

-- 3) m_product 用トリガー
DROP TRIGGER IF EXISTS trg_m_product_update ON m_product;
CREATE TRIGGER trg_m_product_update
  BEFORE UPDATE ON m_product
  FOR EACH ROW
  EXECUTE FUNCTION set_update_timestamp();

-- 4) t_sales 用トリガー
DROP TRIGGER IF EXISTS trg_t_sales_update ON t_sales;
CREATE TRIGGER trg_t_sales_update
  BEFORE UPDATE ON t_sales
  FOR EACH ROW
  EXECUTE FUNCTION set_update_timestamp();

