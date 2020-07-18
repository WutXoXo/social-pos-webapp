export class Profile {

    constructor() { }

    public displayName:string;
    public displayNameActivity:ProfileActivity;

    public email:string;
    public emailActivity:ProfileActivity;

    public photoURL:string; 
    public photoURLActivity:ProfileActivity;

    public phoneNumber:string;
    public phoneNumberActivity:ProfileActivity; 

    public password:string;
    public passwordActivity:ProfileActivity; 

    public uid:string; 
    
}

export class ProfileActivity {
    
    public button:string = "btn-default";
    public iocn:string = "fa-edit";
    public disable:boolean = true;

    constructor() {
        this.button = "btn-default";
        this.iocn = "fa-edit";
        this.disable = true;
     }

    setButton(disable)
    {
        if(disable)
        {
            this.button = "btn-success";
            this.iocn = "fa-check";
            this.disable = false;
        }
        else
        {
            this.button = "btn-default";
            this.iocn = "fa-edit";
            this.disable = true;
        }
    }
}