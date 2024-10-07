CREATE TABLE IF NOT EXISTS `cities` (
  `idcity` INT NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `FK_idcountry` INT NOT NULL,
  PRIMARY KEY (`idcity`, `FK_idcountry`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `comments` (
  `idcomment` INT NOT NULL,
  `FK_idevent` INT NOT NULL,
  `FK_iduser` INT NOT NULL,
  `comment` VARCHAR(512) NOT NULL,
  `date_comment` DATE NOT NULL,
  PRIMARY KEY (`idcomment`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `country` (
  `idcountry` INT NOT NULL,
  `name_country` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idcountry`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `idcountry_UNIQUE` ON `country` (`idcountry` ASC) VISIBLE;

CREATE TABLE IF NOT EXISTS `event` (
  `idevent` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NULL,
  `description` VARCHAR(45) NULL,
  `number_of_ticket` INT NOT NULL,
  `photo` BLOB NULL,
  `contact_info` VARCHAR(45) NOT NULL,
  `FK_idevent_category` INT NOT NULL,
  `FK_idage_category` INT NOT NULL,
  `FK_idlocation` INT NOT NULL,
  `FK_idevent_status` INT NOT NULL,
  `event_sponsor_idevent_sponsor` INT NULL,
  PRIMARY KEY (`idevent`, `FK_idevent_category`, `FK_idage_category`, `FK_idlocation`, `FK_idevent_status`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `id_event_UNIQUE` ON `event` (`idevent` ASC) VISIBLE;

CREATE TABLE IF NOT EXISTS `event_category` (
  `idevent_category` INT NOT NULL,
  `category_type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idevent_category`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `event_locations` (
  `id_event_location` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `FK_idcity` INT NOT NULL,
  PRIMARY KEY (`id_event_location`, `FK_idcity`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `event_ticket` (
  `idevent_ticket` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `price` FLOAT NOT NULL,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `FK_idevent` INT NOT NULL,
  PRIMARY KEY (`idevent_ticket`, `FK_idevent`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `favourite_event` (
  `idfavourite_event` INT NOT NULL,
  `FK_idevent` INT NOT NULL,
  `FK_iduser` INT NOT NULL,
  PRIMARY KEY (`idfavourite_event`, `FK_idevent`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `order` (
  `idorder` INT NOT NULL,
  `data` DATE NOT NULL,
  `total_amount` FLOAT NOT NULL,
  `total_tax_amount` FLOAT NOT NULL,
  `FK_iduser` INT NOT NULL,
  PRIMARY KEY (`idorder`, `FK_iduser`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `order_ticket` (
  `idorder_ticket` INT NOT NULL,
  `FK_idevent_ticket` INT NOT NULL,
  `FK_idorder` INT NOT NULL,
  `FK_idticket_status` INT NOT NULL,
  PRIMARY KEY (`idorder_ticket`, `FK_idevent_ticket`, `FK_idorder`, `FK_idticket_status`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `payment` (
  `idpayment` INT NOT NULL,
  `FK_idorder` INT NOT NULL,
  `FK_idpayment_methods` INT NOT NULL,
  `FK_idpayment_status` INT NOT NULL,
  PRIMARY KEY (`idpayment`, `FK_idorder`, `FK_idpayment_methods`, `FK_idpayment_status`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `user` (
  `iduser` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `second_name` VARCHAR(45) NULL,
  `surname` VARCHAR(45) NOT NULL,
  `FK_iduser_type` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phonenumber` INT NOT NULL,
  `zipcode` VARCHAR(45) NOT NULL,
  `street` VARCHAR(45) NOT NULL,
  `FK_idcity` INT NOT NULL,
  `loyal_card_idloyal_card` INT NOT NULL,
  PRIMARY KEY (`iduser`, `FK_iduser_type`, `FK_idcity`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `user_type` (
  `iduser_type` INT NOT NULL,
  `name_type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`iduser_type`))
ENGINE = InnoDB;