-- ========================================================
-- DATABASE ARCHITECTURE: INVENTORY MANAGEMENT SYSTEM (IMS)
-- ========================================================

-- 1. Create Products Master Table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Initial Relational Core Mock Data
INSERT INTO products (product_name, category, price, stock_quantity) VALUES
('Logitech MX Master 3S', 'Peripherals', 8999.00, 15),
('Samsung T7 1TB SSD', 'Storage', 9500.00, 3),
('Dell UltraSharp 27"', 'Electronics', 32000.00, 8);


-- ========================================================
-- ADVANCED BUSINESS LOGIC OPERATIONS QUERIES
-- ========================================================

-- Query A: Get Total Count, Low Stock Warnings, and Financial Valuation Matrix
SELECT 
    COUNT(product_id) AS total_distinct_items,
    SUM(CASE WHEN stock_quantity <= 5 THEN 1 ELSE 0 END) AS low_stock_alerts,
    SUM(price * stock_quantity) AS gross_inventory_valuation
FROM products;

-- Query B: Filter specifically out all products triggered on Low Stock Threshold
SELECT product_id, product_name, category, stock_quantity 
FROM products 
WHERE stock_quantity <= 5 
ORDER BY stock_quantity ASC;

-- Query C: Transaction Simulation (Deduct Stock when an item is sold)
UPDATE products 
SET stock_quantity = stock_quantity - 1 
WHERE product_id = 101 AND stock_quantity > 0;

-- Query D: Bulk Restock Supply Operation
UPDATE products 
SET stock_quantity = stock_quantity + 50 
WHERE category = 'Storage';

-- ========================================================
-- QUERY E: UPDATE PRODUCT RECORD (SaaS Edit Operations)
-- ========================================================
-- जब फ्रंटएंड पर 'Update Product' बटन दबाया जाता है, तो यह क्वेरी चलती है:
UPDATE products 
SET 
    product_name = 'Logitech MX Master 3S (Updated Name)', 
    category = 'Peripherals', 
    price = 9200.00, 
    stock_quantity = 20
WHERE product_id = 101;