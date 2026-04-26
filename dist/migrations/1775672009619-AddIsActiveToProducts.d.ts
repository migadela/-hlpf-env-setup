import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddIsActiveToProducts1775672009619 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
