/** 
* @constructs User
* @param {int} id - id do Utilizador
* @param {string} name - Nome do Utilizador
* @param {date} BirthDate_User  - Data de Nascimento do Utilizador

*/
class User{
    /** contrutor **/
    constructor(id,name,BirthDate_User) {
        this.id = id;
        this.name = name;
        this.BirthDate_User = BirthDate_User
    }
  
    setUsername(nome) {
        this.nome=nome;
    }
    getUsername(){
        return this.name;
    }

}
