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
