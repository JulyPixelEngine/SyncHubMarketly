CREATE TABLE IF NOT EXISTS users (
    id         BIGSERIAL    PRIMARY KEY,
    username   VARCHAR(100) NOT NULL,
    first_name VARCHAR(100),
    last_name  VARCHAR(100),
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    phone      VARCHAR(20),
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS menus (
    id          BIGSERIAL    PRIMARY KEY,
    menu_code   VARCHAR(50)  NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    icon        VARCHAR(50),
    parent_id   BIGINT       REFERENCES menus(id) ON DELETE CASCADE,
    sort_order  INT          NOT NULL DEFAULT 0,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_menus (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    menu_id BIGINT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, menu_id)
);

-- 기본 역할 데이터
INSERT INTO roles (name, description) VALUES ('ROLE_USER', '일반 사용자') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, description) VALUES ('ROLE_ADMIN', '관리자') ON CONFLICT (name) DO NOTHING;

-- 기본 메뉴 데이터
INSERT INTO menus (menu_code, name, icon, parent_id, sort_order) VALUES ('DASHBOARD', 'Dashboard', 'home', NULL, 1) ON CONFLICT (menu_code) DO NOTHING;
INSERT INTO menus (menu_code, name, icon, parent_id, sort_order) VALUES ('PRODUCTS', 'Products', 'box', NULL, 2) ON CONFLICT (menu_code) DO NOTHING;
INSERT INTO menus (menu_code, name, icon, parent_id, sort_order) VALUES ('ANALYTICS', 'Analytics', 'chart', NULL, 3) ON CONFLICT (menu_code) DO NOTHING;
INSERT INTO menus (menu_code, name, icon, parent_id, sort_order) VALUES ('CUSTOMERS', 'Customers', 'users', NULL, 4) ON CONFLICT (menu_code) DO NOTHING;
INSERT INTO menus (menu_code, name, icon, parent_id, sort_order) VALUES ('SETTINGS', 'Settings', 'settings', NULL, 5) ON CONFLICT (menu_code) DO NOTHING;

-- 모든 메뉴에 ROLE_USER, ROLE_ADMIN 부여
INSERT INTO role_menus (role_id, menu_id) SELECT r.id, m.id FROM roles r, menus m WHERE r.name = 'ROLE_USER' ON CONFLICT DO NOTHING;
INSERT INTO role_menus (role_id, menu_id) SELECT r.id, m.id FROM roles r, menus m WHERE r.name = 'ROLE_ADMIN' ON CONFLICT DO NOTHING;

-- ========================================
-- Scraper 관련 테이블
-- ========================================

CREATE TABLE IF NOT EXISTS scrape_categories (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    target_url  VARCHAR(500) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scrape_jobs (
    id               BIGSERIAL    PRIMARY KEY,
    status           VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    total_categories INT          NOT NULL DEFAULT 0,
    scraped_count    INT          NOT NULL DEFAULT 0,
    error_message    TEXT,
    started_at       TIMESTAMP,
    completed_at     TIMESTAMP,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scraped_products (
    id            BIGSERIAL     PRIMARY KEY,
    job_id        BIGINT        NOT NULL REFERENCES scrape_jobs(id) ON DELETE CASCADE,
    category_id   BIGINT        NOT NULL REFERENCES scrape_categories(id) ON DELETE CASCADE,
    rank          INT           NOT NULL,
    product_name  VARCHAR(500)  NOT NULL,
    price         VARCHAR(100),
    image_url     VARCHAR(1000),
    product_url   VARCHAR(1000),
    source_site   VARCHAR(200),
    extra_data    TEXT,
    scraped_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scraped_products_job_id ON scraped_products(job_id);
CREATE INDEX IF NOT EXISTS idx_scraped_products_category_id ON scraped_products(category_id);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_status ON scrape_jobs(status);

-- 기본 스크래핑 카테고리 (예시)
INSERT INTO scrape_categories (name, target_url) VALUES ('Electronics', 'https://example.com/ranking/electronics') ON CONFLICT (name) DO NOTHING;
INSERT INTO scrape_categories (name, target_url) VALUES ('Fashion', 'https://example.com/ranking/fashion') ON CONFLICT (name) DO NOTHING;
INSERT INTO scrape_categories (name, target_url) VALUES ('Home & Living', 'https://example.com/ranking/home') ON CONFLICT (name) DO NOTHING;

-- Scraper 메뉴 추가
INSERT INTO menus (menu_code, name, icon, parent_id, sort_order) VALUES ('SCRAPER', 'Scraper', 'search', NULL, 6) ON CONFLICT (menu_code) DO NOTHING;

-- Scraper 메뉴 권한 부여
INSERT INTO role_menus (role_id, menu_id)
SELECT r.id, m.id FROM roles r, menus m WHERE r.name IN ('ROLE_USER', 'ROLE_ADMIN') AND m.menu_code = 'SCRAPER' ON CONFLICT DO NOTHING;
