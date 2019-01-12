CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` binary(60) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE TABLE `graduates` (
  `graduate_id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(35) NOT NULL,
  `last_name` VARCHAR(35) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `story` LONGTEXT NULL DEFAULT NULL,
  `year_of_graduate` SMALLINT(4) NOT NULL,
  `resume` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(200) NOT NULL,
  `github` VARCHAR(255) NULL DEFAULT NULL,
  `linkedin` VARCHAR(255) NULL DEFAULT NULL,
  `website` VARCHAR(255) NULL DEFAULT NULL,
  `image` VARCHAR(2000) NULL DEFAULT NULL,
  PRIMARY KEY (`graduate_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE TABLE `skills` (
  `skill_id` INT(11) NOT NULL AUTO_INCREMENT,
  `graduate_id` INT(11) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`skill_id`),
  KEY `graduate_id_skills_fk_idx` (`graduate_id`),
  CONSTRAINT `graduate_id_skills_fk`
    FOREIGN KEY (`graduate_id`)
    REFERENCES `graduates` (`graduate_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;
