CREATE TABLE `products` (
  `item_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_name` text NOT NULL,
  `department_name` text,
  `price` double NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  `product_sales` double DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

CREATE TABLE `departments` (
  `department_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `department_name` text NOT NULL,
  `over_head_costs` decimal(11,0) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
