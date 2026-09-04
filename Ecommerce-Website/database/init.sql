-- =========================================================
-- ECOMMERCE WEBSITE - DATABASE SEED DATA
-- =========================================================

BEGIN;

-- =========================================================
-- 1. SELLER
-- =========================================================

INSERT INTO sellers
    (seller_id, seller_name, created_at, updated_at)
VALUES
    ('SELLER001', 'Demo Seller', NOW(), NOW())
ON CONFLICT (seller_id) DO NOTHING;


-- =========================================================
-- 2. DELIVERY OPTIONS
-- =========================================================

INSERT INTO delivery_options
    (option_name, delivery_days, price)
VALUES
    ('Free Delivery', 20, 0.00),
    ('Standard Delivery', 12, 5.00)
ON CONFLICT (option_name) DO NOTHING;


-- =========================================================
-- 3. PRODUCT 001
-- =========================================================

INSERT INTO products
    (asin, title, availability)
VALUES
    ('B0DEMO001', 'Wireless Bluetooth Headphones', 'In Stock')
ON CONFLICT (asin) DO NOTHING;

INSERT INTO pricing
    (asin, initial_price, final_price, currency, discount, created_at, updated_at)
VALUES
    ('B0DEMO001', 79.99, 49.99, 'USD', 37.50, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_details
    (asin, description, model_number, date_first_available, rating, item_weight, product_dimensions, ingredients, features)
VALUES
    (
        'B0DEMO001',
        'Wireless Bluetooth headphones with clear sound and comfortable design.',
        'DH-100',
        '2026-01-15',
        4.5,
        '250 g',
        '18 x 16 x 8 cm',
        NULL,
        ARRAY[
            'Bluetooth 5.3',
            'Noise isolation',
            'Long battery life',
            'Built-in microphone'
        ]
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO media
    (asin, image_url, images, images_count)
VALUES
    (
        'B0DEMO001',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
        1
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO rankings
    (asin, root_bs_rank, bs_rank, subcategory_rank, badge, created_at, updated_at)
VALUES
    ('B0DEMO001', 1, 1, 1, 'Best Seller', NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_sellers
    (asin, seller_id)
VALUES
    ('B0DEMO001', 'SELLER001')
ON CONFLICT DO NOTHING;


-- =========================================================
-- 4. PRODUCT 002
-- =========================================================

INSERT INTO products
    (asin, title, availability)
VALUES
    ('B0DEMO002', 'Mechanical RGB Gaming Keyboard', 'In Stock')
ON CONFLICT (asin) DO NOTHING;

INSERT INTO pricing
    (asin, initial_price, final_price, currency, discount, created_at, updated_at)
VALUES
    ('B0DEMO002', 99.99, 79.99, 'USD', 20.00, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_details
    (asin, description, model_number, date_first_available, rating, item_weight, product_dimensions, ingredients, features)
VALUES
    (
        'B0DEMO002',
        'Mechanical gaming keyboard with RGB lighting and responsive switches.',
        'KB-RGB-100',
        '2026-01-20',
        4.6,
        '900 g',
        '44 x 14 x 4 cm',
        NULL,
        ARRAY[
            'RGB backlight',
            'Mechanical switches',
            'Anti-ghosting',
            'USB connection'
        ]
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO media
    (asin, image_url, images, images_count)
VALUES
    (
        'B0DEMO002',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
        ARRAY['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'],
        1
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO rankings
    (asin, root_bs_rank, bs_rank, subcategory_rank, badge, created_at, updated_at)
VALUES
    ('B0DEMO002', 2, 2, 2, 'Best Seller', NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_sellers
    (asin, seller_id)
VALUES
    ('B0DEMO002', 'SELLER001')
ON CONFLICT DO NOTHING;


-- =========================================================
-- 5. PRODUCT 003
-- =========================================================

INSERT INTO products
    (asin, title, availability)
VALUES
    ('B0DEMO003', 'Wireless Gaming Mouse', 'In Stock')
ON CONFLICT (asin) DO NOTHING;

INSERT INTO pricing
    (asin, initial_price, final_price, currency, discount, created_at, updated_at)
VALUES
    ('B0DEMO003', 59.99, 39.99, 'USD', 33.34, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_details
    (asin, description, model_number, date_first_available, rating, item_weight, product_dimensions, ingredients, features)
VALUES
    (
        'B0DEMO003',
        'Lightweight wireless gaming mouse designed for accurate and responsive gameplay.',
        'GM-W100',
        '2026-02-01',
        4.4,
        '95 g',
        '12 x 6 x 4 cm',
        NULL,
        ARRAY[
            'Wireless connectivity',
            'Adjustable DPI',
            'Ergonomic design',
            'Rechargeable battery'
        ]
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO media
    (asin, image_url, images, images_count)
VALUES
    (
        'B0DEMO003',
        'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600',
        ARRAY['https://images.unsplash.com/photo-1527814050087-3793815479db?w=600'],
        1
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO rankings
    (asin, root_bs_rank, bs_rank, subcategory_rank, badge, created_at, updated_at)
VALUES
    ('B0DEMO003', 3, 3, 3, NULL, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_sellers
    (asin, seller_id)
VALUES
    ('B0DEMO003', 'SELLER001')
ON CONFLICT DO NOTHING;


-- =========================================================
-- 6. PRODUCT 004
-- =========================================================

INSERT INTO products
    (asin, title, availability)
VALUES
    ('B0DEMO004', 'Smart Fitness Watch', 'In Stock')
ON CONFLICT (asin) DO NOTHING;

INSERT INTO pricing
    (asin, initial_price, final_price, currency, discount, created_at, updated_at)
VALUES
    ('B0DEMO004', 159.99, 129.99, 'USD', 18.75, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_details
    (asin, description, model_number, date_first_available, rating, item_weight, product_dimensions, ingredients, features)
VALUES
    (
        'B0DEMO004',
        'Smart fitness watch with activity tracking, heart-rate monitoring and notifications.',
        'FW-200',
        '2026-02-10',
        4.7,
        '45 g',
        '4.5 x 4.0 x 1.1 cm',
        NULL,
        ARRAY[
            'Fitness tracking',
            'Heart-rate monitoring',
            'Sleep tracking',
            'Smart notifications',
            'Water resistant'
        ]
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO media
    (asin, image_url, images, images_count)
VALUES
    (
        'B0DEMO004',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
        1
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO rankings
    (asin, root_bs_rank, bs_rank, subcategory_rank, badge, created_at, updated_at)
VALUES
    ('B0DEMO004', 4, 4, 4, 'Amazon''s Choice', NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_sellers
    (asin, seller_id)
VALUES
    ('B0DEMO004', 'SELLER001')
ON CONFLICT DO NOTHING;


-- =========================================================
-- 7. PRODUCT 005
-- =========================================================

INSERT INTO products
    (asin, title, availability)
VALUES
    ('B0DEMO005', '65W USB-C Fast Charger', 'In Stock')
ON CONFLICT (asin) DO NOTHING;

INSERT INTO pricing
    (asin, initial_price, final_price, currency, discount, created_at, updated_at)
VALUES
    ('B0DEMO005', 34.99, 24.99, 'USD', 28.58, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_details
    (asin, description, model_number, date_first_available, rating, item_weight, product_dimensions, ingredients, features)
VALUES
    (
        'B0DEMO005',
        'Compact 65W USB-C fast charger suitable for laptops, tablets and smartphones.',
        'CH-65W',
        '2026-02-15',
        4.5,
        '120 g',
        '7 x 5 x 3 cm',
        NULL,
        ARRAY[
            '65W fast charging',
            'USB-C PD',
            'Compact design',
            'Over-voltage protection'
        ]
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO media
    (asin, image_url, images, images_count)
VALUES
    (
        'B0DEMO005',
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
        ARRAY['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600'],
        1
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO rankings
    (asin, root_bs_rank, bs_rank, subcategory_rank, badge, created_at, updated_at)
VALUES
    ('B0DEMO005', 5, 5, 5, NULL, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_sellers
    (asin, seller_id)
VALUES
    ('B0DEMO005', 'SELLER001')
ON CONFLICT DO NOTHING;


-- =========================================================
-- 8. PRODUCT 006
-- =========================================================

INSERT INTO products
    (asin, title, availability)
VALUES
    ('B0DEMO006', 'Premium Laptop Backpack', 'In Stock')
ON CONFLICT (asin) DO NOTHING;

INSERT INTO pricing
    (asin, initial_price, final_price, currency, discount, created_at, updated_at)
VALUES
    ('B0DEMO006', 59.99, 44.99, 'USD', 25.00, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_details
    (asin, description, model_number, date_first_available, rating, item_weight, product_dimensions, ingredients, features)
VALUES
    (
        'B0DEMO006',
        'Durable laptop backpack with multiple compartments and padded laptop protection.',
        'LB-300',
        '2026-02-20',
        4.6,
        '750 g',
        '45 x 32 x 16 cm',
        NULL,
        ARRAY[
            'Laptop compartment',
            'Water resistant',
            'Multiple pockets',
            'Padded shoulder straps'
        ]
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO media
    (asin, image_url, images, images_count)
VALUES
    (
        'B0DEMO006',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
        ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
        1
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO rankings
    (asin, root_bs_rank, bs_rank, subcategory_rank, badge, created_at, updated_at)
VALUES
    ('B0DEMO006', 6, 6, 6, NULL, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_sellers
    (asin, seller_id)
VALUES
    ('B0DEMO006', 'SELLER001')
ON CONFLICT DO NOTHING;


-- =========================================================
-- 9. PRODUCT 007
-- =========================================================

INSERT INTO products
    (asin, title, availability)
VALUES
    ('B0DEMO007', 'Men''s Lightweight Running Shoes', 'In Stock')
ON CONFLICT (asin) DO NOTHING;

INSERT INTO pricing
    (asin, initial_price, final_price, currency, discount, created_at, updated_at)
VALUES
    ('B0DEMO007', 89.99, 69.99, 'USD', 22.22, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_details
    (asin, description, model_number, date_first_available, rating, item_weight, product_dimensions, ingredients, features)
VALUES
    (
        'B0DEMO007',
        'Lightweight running shoes designed for everyday training and comfortable movement.',
        'RS-400',
        '2026-03-01',
        4.5,
        '600 g',
        '34 x 22 x 13 cm',
        NULL,
        ARRAY[
            'Lightweight construction',
            'Breathable upper',
            'Cushioned sole',
            'Non-slip outsole'
        ]
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO media
    (asin, image_url, images, images_count)
VALUES
    (
        'B0DEMO007',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
        1
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO rankings
    (asin, root_bs_rank, bs_rank, subcategory_rank, badge, created_at, updated_at)
VALUES
    ('B0DEMO007', 7, 7, 7, 'Best Seller', NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_sellers
    (asin, seller_id)
VALUES
    ('B0DEMO007', 'SELLER001')
ON CONFLICT DO NOTHING;


-- =========================================================
-- 10. PRODUCT 008
-- =========================================================

INSERT INTO products
    (asin, title, availability)
VALUES
    ('B0DEMO008', 'Men''s Premium Cotton T-Shirt', 'In Stock')
ON CONFLICT (asin) DO NOTHING;

INSERT INTO pricing
    (asin, initial_price, final_price, currency, discount, created_at, updated_at)
VALUES
    ('B0DEMO008', 39.99, 29.99, 'USD', 25.00, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_details
    (asin, description, model_number, date_first_available, rating, item_weight, product_dimensions, ingredients, features)
VALUES
    (
        'B0DEMO008',
        'Premium cotton T-shirt with a comfortable fit for everyday wear.',
        'TS-500',
        '2026-03-05',
        4.3,
        '200 g',
        '30 x 25 x 2 cm',
        '100% Cotton',
        ARRAY[
            '100% cotton',
            'Soft fabric',
            'Regular fit',
            'Machine washable'
        ]
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO media
    (asin, image_url, images, images_count)
VALUES
    (
        'B0DEMO008',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
        1
    )
ON CONFLICT (asin) DO NOTHING;

INSERT INTO rankings
    (asin, root_bs_rank, bs_rank, subcategory_rank, badge, created_at, updated_at)
VALUES
    ('B0DEMO008', 8, 8, 8, NULL, NOW(), NOW())
ON CONFLICT (asin) DO NOTHING;

INSERT INTO product_sellers
    (asin, seller_id)
VALUES
    ('B0DEMO008', 'SELLER001')
ON CONFLICT DO NOTHING;


-- =========================================================
-- COMPLETE
-- =========================================================

COMMIT;
