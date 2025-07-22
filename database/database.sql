-- Création de la base de données
DROP DATABASE IF EXISTS project_spe_web;
CREATE DATABASE project_spe_web;
USE project_spe_web;

-- Tables
CREATE TABLE categories(
   Id_categories INT AUTO_INCREMENT,
   label VARCHAR(50),
   PRIMARY KEY(Id_categories)
) ENGINE=InnoDB;

CREATE TABLE users(
   Id_users INT AUTO_INCREMENT,
   last_name VARCHAR(50),
   first_name VARCHAR(50),
   email VARCHAR(50) UNIQUE,
   password VARCHAR(255),
   password_hash VARCHAR(255),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   last_login TIMESTAMP NULL,
   is_active BOOLEAN DEFAULT TRUE,
   PRIMARY KEY(Id_users)
) ENGINE=InnoDB;

CREATE TABLE products(
   Id_Products INT AUTO_INCREMENT,
   label VARCHAR(50),
   description TEXT,
   price DECIMAL(5,2),
   Id_categories INT NOT NULL,
   PRIMARY KEY(Id_Products),
   FOREIGN KEY(Id_categories) REFERENCES categories(Id_categories)
) ENGINE=InnoDB;

CREATE TABLE pictures(
   Id_Picture INT AUTO_INCREMENT,
   path VARCHAR(150),
   Id_Products INT NOT NULL,
   PRIMARY KEY(Id_Picture),
   FOREIGN KEY(Id_Products) REFERENCES products(Id_Products)
) ENGINE=InnoDB;

CREATE TABLE cart(
   Id_cart INT AUTO_INCREMENT,
   Id_users INT NOT NULL,
   Id_Products INT NOT NULL,
   quantity INT DEFAULT 1,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(Id_cart),
   FOREIGN KEY(Id_users) REFERENCES users(Id_users),
   FOREIGN KEY(Id_Products) REFERENCES products(Id_Products)
) ENGINE=InnoDB;

CREATE TABLE user_sessions(
   Id_session INT AUTO_INCREMENT,
   session_token VARCHAR(255) UNIQUE NOT NULL,
   Id_users INT NOT NULL,
   expires_at TIMESTAMP NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(Id_session),
   FOREIGN KEY(Id_users) REFERENCES users(Id_users)
) ENGINE=InnoDB;

CREATE TABLE csrf_tokens(
   Id_csrf INT AUTO_INCREMENT,
   token VARCHAR(255) UNIQUE NOT NULL,
   Id_users INT NOT NULL,
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
