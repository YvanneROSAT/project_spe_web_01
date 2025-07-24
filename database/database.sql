-- Création de la base de données
DROP DATABASE IF EXISTS project_spe_web;
CREATE DATABASE project_spe_web;
USE project_spe_web;

-- Tables avec IDs en VARCHAR pour correspondre au schéma Drizzle
CREATE TABLE categories(
   Id_categories VARCHAR(36),
   label VARCHAR(50),
   PRIMARY KEY(Id_categories)
) ENGINE=InnoDB;

CREATE TABLE users(
   Id_users VARCHAR(36),
   last_name VARCHAR(50) NOT NULL,
   first_name VARCHAR(50) NOT NULL,
   email VARCHAR(320) UNIQUE NOT NULL,
   password_hash VARCHAR(255) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
   last_login TIMESTAMP NULL,
   is_active BOOLEAN DEFAULT TRUE,
   PRIMARY KEY(Id_users)
) ENGINE=InnoDB;

CREATE TABLE products(
   Id_Products VARCHAR(36),
   label VARCHAR(50),
   description TEXT,
   price DECIMAL(5,2),
   Id_categories VARCHAR(36) NOT NULL,
   PRIMARY KEY(Id_Products),
   FOREIGN KEY(Id_categories) REFERENCES categories(Id_categories)
) ENGINE=InnoDB;

CREATE TABLE pictures(
   Id_Picture VARCHAR(36),
   path VARCHAR(150),
   Id_Products VARCHAR(36) NOT NULL,
   PRIMARY KEY(Id_Picture),
   FOREIGN KEY(Id_Products) REFERENCES products(Id_Products)
) ENGINE=InnoDB;

CREATE TABLE cart(
   Id_cart VARCHAR(36),
   Id_users VARCHAR(36) NOT NULL,
   Id_Products VARCHAR(36) NOT NULL,
   quantity INT DEFAULT 1,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(Id_cart),
   FOREIGN KEY(Id_users) REFERENCES users(Id_users),
   FOREIGN KEY(Id_Products) REFERENCES products(Id_Products)
) ENGINE=InnoDB;

CREATE TABLE user_sessions(
   Id_session VARCHAR(36),
   session_token VARCHAR(255) UNIQUE NOT NULL,
   Id_users VARCHAR(36) NOT NULL,
   expires_at TIMESTAMP NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(Id_session),
   FOREIGN KEY(Id_users) REFERENCES users(Id_users)
) ENGINE=InnoDB;

CREATE TABLE csrf_tokens(
   Id_csrf VARCHAR(36),
   token VARCHAR(255) UNIQUE NOT NULL,
   Id_users VARCHAR(36) NOT NULL,
   expires_at TIMESTAMP NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(Id_csrf),
   FOREIGN KEY(Id_users) REFERENCES users(Id_users)
) ENGINE=InnoDB;

CREATE TABLE csp_reports(
   Id_report INT AUTO_INCREMENT,
   report_data JSON NOT NULL,
   user_agent VARCHAR(255),
   ip_address VARCHAR(45),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(Id_report)
) ENGINE=InnoDB;