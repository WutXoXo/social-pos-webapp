import { ConstBaseEntity } from './const-base-entity';

export interface SettingBaseEntity extends ConstBaseEntity  {
    updatedAt:Date;
    updatedBy:string;
}
