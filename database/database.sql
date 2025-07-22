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
   email VARCHAR(50),
   password VARCHAR(50),
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
