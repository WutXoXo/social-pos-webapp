export class ThaiAddress {

    public district_code: string|null;
    public district_id: number|null;
    public district_name: string|null;
    public border_id: number|null;
    public border_name: string|null;
    public province_id: number|null;
    public province_name: string|null;
    public text: string|null;

    constructor(private districtCode: string,private districtId: number,private districtName: string,private borderId: number,private borderName: string,private provinceId: number,private provinceName: string,private stringtext: string) { 
        this.district_code = districtCode;
        this.district_id = districtId;
        this.district_name = districtName;
        this.border_id = borderId;
        this.border_name = borderName;
        this.province_id = provinceId;
        this.province_name = provinceName;
        this.text = stringtext;
    }
}