const mysql2 = require("mysql2");
const dbconfig = require("./dbconfig.json");
const bcrypt = require('bcrypt');

/*--- Funções de Autenticação ---*/
function RegisterUser(request,response){
    if (request.body.username && request.body.password) {
        //Conexão à base de Dados
        var connection = mysql2.createConnection(dbconfig);
        connection.connect();
        //Verificamos se o utilizador existe
        var query= mysql2.format(`Select * from User where Name_User = ?`,[request.body.username]);
        connection.query(query,function(err,rows){
            //Caso Já exista uma conta é Exibida a mensagem de Erro
            if(err || rows.length){
                response.json({
                    message:"Conta ja existe!"
                });
            }
            //Caso não Exista podemos avançar para a inserção na base de dados
            else{
                //Recolhemos os valores do Formulário
                var Name_User = request.body.username;
                var Pass_User = request.body.password;
                var BirthDate_User = request.body.birthdate;

                //Encriptamos a Password por razões de Segurança
                bcrypt.hash(Pass_User, 10, function (err, hash) {
                    if (err) { next(err); }
                    else {
                        var query= mysql2.format(`insert into User(Name_User,BirthDate_User,Pass_User) values(?,?,?)`,[Name_User,BirthDate_User,hash]);
                        connection.query(query,function(err,rows){
                        if(err || rows.length){
                            console.log("Tenta de novo ");
                            console.log(err);
                            response.json({
                                message:"Conta já existe!"
                            })
                        }else{
                        response.json({
                            message:"Conta criada com sucesso!"
                        }) 
                        }
                    });
                    }
                });     
            }
        });
    }
    //Caso Falte algum Campo no Formulário
    else { response.status(400).json({ message: 'The Username or password is missing' }); }
}
function Login(request , response){
        //Conexão à base de Dados
        var connection = mysql2.createConnection(dbconfig);
        connection.connect();
        //Verificamos se o utilizador existe
        var query= mysql2.format(`Select * from User where Name_User = ?`,[request.body.username]);
        connection.query(query,function(err,rows){
            //Caso Já exista uma conta é Exibida a mensagem de Erro
            if(err || !rows.length){
                response.json({message:"Conta não existe!" ,error: err});
            }
            else{
                bcrypt.compare(request.body.password, rows[0].Pass_User, function (err, result) {
                    //Se o 'result' foi true (as passwords são iguais)
                    //Se sim:
                     if (result) {
                        //Removemos a informação da password do resultado porque não pretendemos que essa informação seja disponibilizada a terceiros.
                        delete rows[0].password;
                        //Retornamos que o erro foi null e que o utilizador foi encontrado é a primeira linha (e única) do resultado da query.
                        response.json({
                            message:"Login Efetuado com sucesso!",
                            user: rows[0]
                        })
                    }
                    //Caso result não seja true, é porque é false e como tal a password é falsa.
                    //Nesse caso retornamos erro null, mas com false como o valor da autenticação e um objeto com uma mensagem a informar o que se passou. 
                    else {  response.json({
                        message:"Password Errada!"
                    })}
                });    
            }
        });

}

/* ----  EXPORTAR OS MÓDULOS  ---- */
module.exports.RegisterUser=RegisterUser;
module.exports.Login = Login;