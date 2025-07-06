import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({unique: true})
    email!:string;

    @Column()
    passwordHash!:string;

    @Column({type: 'varchar', nullable: true})
    firstName!: string | null;

    @Column({type: 'varchar', nullable: true})
    lastName!: string | null;

    @Column({ default: true })  // Boolean column with default value
    isActive!: boolean;

    @CreateDateColumn()  // Automatically sets timestamp when created
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}