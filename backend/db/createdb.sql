-- Insert code to drop your other tables here
-- We must drop tables in this order to avoid foreign key constraints failing
-- for instance, we cannot drop users first because 'vote' has a foreign key
-- constraint on it.
--
DROP TABLE IF EXISTS `votes`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `answerchoices`;
DROP TABLE IF EXISTS `questions`;

-- Similarly, tables need to be created in this order to ensure a table
-- exists when a foreign key constraint is added that refers to it.
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `lastname` (`lastname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- -- Insert code to create the other tables you need

CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `answerchoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `questionid` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `question_must_exist` FOREIGN KEY (`questionid`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `votes` (
  `answerchoiceid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `questionid` int(11) NOT NULL,
  PRIMARY KEY (`answerchoiceid`, `userid`, `questionid`),
  CONSTRAINT `answerid_must_exist` FOREIGN KEY (`answerchoiceid`) REFERENCES `answerchoices` (`id`),
  CONSTRAINT `userid_must_exist` FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  CONSTRAINT `questionid_must_exist` FOREIGN KEY (`questionid`) REFERENCES `questions` (`id`),
  CONSTRAINT `question_answer_must_exist` FOREIGN KEY (`questionid`,`answerchoiceid`) REFERENCES `answerchoices` (`questionid`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

