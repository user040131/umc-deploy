/*
  Warnings:

  - The primary key for the `alarm` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `alarm_id` on the `alarm` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `user_id` on the `alarm` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `inquiry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `inquiry_id` on the `inquiry` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `user_id` on the `inquiry` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `mission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `mission_id` on the `mission` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `restaurant_id` on the `mission` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `my_mission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `my_mission_id` on the `my_mission` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `user_id` on the `my_mission` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `mission_id` on the `my_mission` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `point` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `point_id` on the `point` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `user_id` on the `point` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `my_mission_id` on the `point` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `restaurant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `restaurant_id` on the `restaurant` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `review_id` on the `review` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `restaurant_id` on the `review` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `user_id` on the `review` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `terms_of_service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `term_id` on the `terms_of_service` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `user_id` on the `user_favor_category` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `user_terms_of_service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_term_id` on the `user_terms_of_service` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `user_id` on the `user_terms_of_service` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `term_id` on the `user_terms_of_service` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `alarm` DROP FOREIGN KEY `fk_alarm_user`;

-- DropForeignKey
ALTER TABLE `inquiry` DROP FOREIGN KEY `fk_inquiry_user`;

-- DropForeignKey
ALTER TABLE `mission` DROP FOREIGN KEY `fk_mission_rest`;

-- DropForeignKey
ALTER TABLE `my_mission` DROP FOREIGN KEY `fk_mm_mission`;

-- DropForeignKey
ALTER TABLE `my_mission` DROP FOREIGN KEY `fk_mm_user`;

-- DropForeignKey
ALTER TABLE `point` DROP FOREIGN KEY `fk_point_my_mission`;

-- DropForeignKey
ALTER TABLE `point` DROP FOREIGN KEY `fk_point_user`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `fk_review_rest`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `fk_review_user`;

-- DropForeignKey
ALTER TABLE `user_favor_category` DROP FOREIGN KEY `fk_ufc_user`;

-- DropForeignKey
ALTER TABLE `user_terms_of_service` DROP FOREIGN KEY `fk_utos_term`;

-- DropForeignKey
ALTER TABLE `user_terms_of_service` DROP FOREIGN KEY `fk_utos_user`;

-- AlterTable
ALTER TABLE `alarm` DROP PRIMARY KEY,
    MODIFY `alarm_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`alarm_id`);

-- AlterTable
ALTER TABLE `inquiry` DROP PRIMARY KEY,
    MODIFY `inquiry_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`inquiry_id`);

-- AlterTable
ALTER TABLE `mission` DROP PRIMARY KEY,
    MODIFY `mission_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `restaurant_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`mission_id`);

-- AlterTable
ALTER TABLE `my_mission` DROP PRIMARY KEY,
    MODIFY `my_mission_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `mission_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`my_mission_id`);

-- AlterTable
ALTER TABLE `point` DROP PRIMARY KEY,
    MODIFY `point_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `my_mission_id` INTEGER NULL,
    ADD PRIMARY KEY (`point_id`);

-- AlterTable
ALTER TABLE `restaurant` DROP PRIMARY KEY,
    MODIFY `restaurant_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`restaurant_id`);

-- AlterTable
ALTER TABLE `review` DROP PRIMARY KEY,
    MODIFY `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `restaurant_id` INTEGER NOT NULL,
    MODIFY `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`review_id`);

-- AlterTable
ALTER TABLE `terms_of_service` DROP PRIMARY KEY,
    MODIFY `term_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`term_id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `password` VARCHAR(255) NULL DEFAULT '1234',
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user_favor_category` MODIFY `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user_terms_of_service` DROP PRIMARY KEY,
    MODIFY `user_term_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `term_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_term_id`);

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
ALTER TABLE `user_favor_category` ADD CONSTRAINT `fk_ufc_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_terms_of_service` ADD CONSTRAINT `fk_utos_term` FOREIGN KEY (`term_id`) REFERENCES `terms_of_service`(`term_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_terms_of_service` ADD CONSTRAINT `fk_utos_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
