CREATE TABLE User
(
  ID_User INT NOT NULL auto_increment,
  Name_User VARCHAR(255) NOT NULL,
  BirthDate_User date NOT NULL,
  Pass_User VARCHAR(255) NOT NULL,
  PRIMARY KEY (ID_User),
);

CREATE TABLE `Cocktail_User` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`id_user` INT NOT NULL,
	`id_Cocktail` INT NOT NULL,
	`Name_Cocktail` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
);

ALTER TABLE `Cocktail_User` ADD CONSTRAINT `Cocktail_User_fk0` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`);


