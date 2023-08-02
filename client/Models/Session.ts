import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Session {
    @PrimaryColumn({type: "varchar", length: 255})
    public Email: string;
    @Column({type: "varchar", length: 2048})
    public AccessToken: string;
    @Column({type: "varchar", length: 255})
    public Name: string;
    @Column({type: "varchar", length: 255})
    public ID: string;

    constructor(email: string, accessToken: string, clientToken: string | null, name: string, id: string) {
        this.Email = email;
        this.AccessToken = accessToken;
        this.Name = name;
        this.ID = id;
    }

    public ToJSON(){
        return {
            accessToken: this.AccessToken,
            selectedProfile: {name: this.Name, id: this.ID}
        }
    };
}