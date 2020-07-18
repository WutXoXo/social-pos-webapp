import { SettingBaseEntity } from './sharing/setting-base-entity';

export interface UShops extends SettingBaseEntity {
    id?: string;
    shopId:string;
    shopName:string;
    photoURL:string;
    ownerId:string;
    firstName: string;
    lastName: string;
    phoneNumber:string;
    email:string;
    address:string;    
    districtId: number;
    districtName: string;
    borderId: number;
    borderName: string;
    provinceId: number;
    provinceName: string;
    postCode: string;
    isVat: boolean;
    typeVat: number;    
}
