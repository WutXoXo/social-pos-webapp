import { SettingBaseEntity } from './sharing/setting-base-entity';

export interface UShopsJoin extends SettingBaseEntity {
    id?: string;
    joinId:string;
    shopId:string;
    uid:string;
    allow:boolean;    
}
