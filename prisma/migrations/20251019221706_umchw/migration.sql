-- CreateTable
CREATE TABLE `alarm` (
    `alarm_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NOT NULL,
    `detail` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` BIGINT UNSIGNED NOT NULL,

    INDEX `idx_alarm_user`(`user_id`),
    PRIMARY KEY (`alarm_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_category` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `uk_food_category_name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry` (
    `inquiry_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `sub` VARCHAR(200) NULL,
    `detail` TEXT NULL,
    `pic` JSON NULL,
    `answer` BOOLEAN NULL DEFAULT false,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_inquiry_user`(`user_id`),
    PRIMARY KEY (`inquiry_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission` (
    `mission_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `detail` VARCHAR(255) NULL,
    `compensation` INTEGER NULL DEFAULT 0,
    `restaurant_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_mission_restaurant`(`restaurant_id`),
    PRIMARY KEY (`mission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `my_mission` (
    `my_mission_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `state` VARCHAR(30) NOT NULL,
    `classification_num` INTEGER NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` BIGINT UNSIGNED NOT NULL,
    `mission_id` BIGINT UNSIGNED NOT NULL,

    INDEX `idx_mm_mission`(`mission_id`),
    INDEX `idx_mm_user`(`user_id`),
    PRIMARY KEY (`my_mission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `point` (
    `point_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `history` VARCHAR(255) NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` BIGINT UNSIGNED NOT NULL,
    `my_mission_id` BIGINT UNSIGNED NULL,

    INDEX `idx_point_my_mission`(`my_mission_id`),
    INDEX `idx_point_user`(`user_id`),
    PRIMARY KEY (`point_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant` (
    `restaurant_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(255) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `operatingHours` VARCHAR(150) NULL,
    `pic` JSON NULL,
    `foodType` JSON NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`restaurant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `review_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `score` FLOAT NOT NULL,
    `detail` TEXT NULL,
    `pic` JSON NULL,
    `restaurant_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_review_rest`(`restaurant_id`),
    INDEX `idx_review_user`(`user_id`),
    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `terms_of_service` (
    `term_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `first` VARCHAR(255) NULL,
    `second` VARCHAR(255) NULL,
    `third` VARCHAR(255) NULL,
    `fourth` VARCHAR(255) NULL,
    `fifth` VARCHAR(255) NULL,

    PRIMARY KEY (`term_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `gender` VARCHAR(20) NOT NULL,
    `birth` DATE NOT NULL,
    `address` VARCHAR(255) NULL DEFAULT '',
    `detail_address` VARCHAR(255) NULL DEFAULT '',
    `phone_number` VARCHAR(50) NOT NULL,
    `number_auth` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `nickname` VARCHAR(100) NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expired_at` DATETIME(0) NULL,
    `is_deleted` BOOLEAN NULL DEFAULT false,
    `point` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `uk_user_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_favor_category` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `food_category_id` INTEGER UNSIGNED NOT NULL,

    INDEX `idx_ufc_food`(`food_category_id`),
    INDEX `idx_ufc_user`(`user_id`),
    UNIQUE INDEX `uk_ufc_user_food`(`user_id`, `food_category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_terms_of_service` (
    `user_term_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `term_id` BIGINT UNSIGNED NOT NULL,
    `first` BOOLEAN NULL DEFAULT false,
    `second` BOOLEAN NULL DEFAULT false,
    `third` BOOLEAN NULL DEFAULT false,
    `fourth` BOOLEAN NULL DEFAULT false,
    `fifth` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_utos_term`(`term_id`),
    INDEX `idx_utos_user`(`user_id`),
    PRIMARY KEY (`user_term_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alarm` ADD CONSTRAINT `fk_alarm_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inquiry` ADD CONSTRAINT `fk_inquiry_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `mission` ADD CONSTRAINT `fk_mission_rest` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`restaurant_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `my_mission` ADD CONSTRAINT `fk_mm_mission` FOREIGN KEY (`mission_id`) REFERENCES `mission`(`mission_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `my_mission` ADD CONSTRAINT `fk_mm_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `point` ADD CONSTRAINT `fk_point_my_mission` FOREIGN KEY (`my_mission_id`) REFERENCES `my_mission`(`my_mission_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `point` ADD CONSTRAINT `fk_point_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `fk_review_rest` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`restaurant_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_favor_category` ADD CONSTRAINT `fk_ufc_food` FOREIGN KEY (`food_category_id`) REFERENCES `food_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_favor_category` ADD CONSTRAINT `fk_ufc_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_terms_of_service` ADD CONSTRAINT `fk_utos_term` FOREIGN KEY (`term_id`) REFERENCES `terms_of_service`(`term_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_terms_of_service` ADD CONSTRAINT `fk_utos_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
