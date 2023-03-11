CREATE TABLE User
(
  ID_User INT NOT NULL auto_increment,
  Name_User VARCHAR(255) NOT NULL,
  BirthDate_User date NOT NULL,
  Pass_User VARCHAR(255) NOT NULL,
  PRIMARY KEY (ID_User),
);