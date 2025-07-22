-- Création de la base de données
DROP DATABASE IF EXISTS project_spe_web;
CREATE DATABASE project_spe_web;
USE project_spe_web;

-- Tables
CREATE TABLE catégories(
   Id_catégories INT AUTO_INCREMENT,
   libelle VARCHAR(50),
   PRIMARY KEY(Id_catégories)
) ENGINE=InnoDB;

CREATE TABLE users(
   Id_users INT AUTO_INCREMENT,
   last_name VARCHAR(50),
   first_name VARCHAR(50),
   email VARCHAR(50),
   password VARCHAR(50),
   PRIMARY KEY(Id_users)
) ENGINE=InnoDB;

CREATE TABLE produits(
   Id_Produits INT AUTO_INCREMENT,
   libelle VARCHAR(50),
   description TEXT,
   prix DECIMAL(5,2),
   Id_catégories INT NOT NULL,
   PRIMARY KEY(Id_Produits),
   FOREIGN KEY(Id_catégories) REFERENCES catégories(Id_catégories)
) ENGINE=InnoDB;

CREATE TABLE Images(
   Id_Images INT AUTO_INCREMENT,
   path VARCHAR(150),
   Id_Produits INT NOT NULL,
   PRIMARY KEY(Id_Images),
   FOREIGN KEY(Id_Produits) REFERENCES produits(Id_Produits)
) ENGINE=InnoDB;
