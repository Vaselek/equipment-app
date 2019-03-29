CREATE SCHEMA `officeWithDate` DEFAULT CHARACTER SET utf8 ;
USE `officeWithDate`;
CREATE TABLE `categories` (
	`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL
);
CREATE TABLE `locations` (
	`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL
);
CREATE TABLE `equipments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NULL,
  `location_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `image` VARCHAR(100) NULL,
  `account_date` DATE NULL,
  PRIMARY KEY (`id`),
  INDEX `category_id_fk_idx` (`category_id` ASC) VISIBLE,
  INDEX `location_id_fk_idx` (`location_id` ASC) VISIBLE,
  CONSTRAINT `category_id_fk`
    FOREIGN KEY (`category_id`)
    REFERENCES `categories` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
 CONSTRAINT `location_id_fk`
    FOREIGN KEY (`location_id`)
    REFERENCES `locations` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE);   

INSERT INTO `categories` (id, title, description)
VALUES
	(1, 'Furniture', 'Some furniture like tables, cupboards...'),
    (2, 'Computer equipment', 'Like PC, monitors, printers etc...'),
    (3, 'Home applicances', 'Appliances like refrigerators, TV etc...');

INSERT INTO `locations` (id, title, description)
VALUES
	(1, 'Office 1', 'Main Office'),
    (2, 'Director room', 'Where director sits'),
    (3, 'Teachers room', 'Where teachers have coffee break');    
    
INSERT INTO `equipments` (`id`, `category_id`, `location_id`, `title`, 
`description`, `account_date`)
VALUES
	(1, 1, 1, 'Table', 'Some cool table', '2019-10-10'),
	(2, 2, 2, 'PC', 'Macintosh', '2019-10-10'),
	(3, 3, 3, 'TV', 'Some TV', '2019-10-10');