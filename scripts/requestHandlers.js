const mysql2 = require("mysql2");
const dbconfig = require("./dbconfig.json");
const bcrypt = require('bcrypt');
const session = require('express-session');
const translatte = require('translatte');

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
                response.json({
                    error_message:"Conta não Existe!"
                });
            }
            else{
                bcrypt.compare(request.body.password, rows[0].Pass_User, function (err, result) {
                    //Se o 'result' foi true (as passwords são iguais)
                    //Se sim:
                     if (result) {
                        //Removemos a informação da password do resultado porque não pretendemos que essa informação seja disponibilizada a terceiros.
                        delete rows[0].password;
                        
                        //Inserimos na Sessão o Utilizador
                        request.session.user=rows[0];
             
                        response.json({
                            sucess:"sucess"
                        });
                    }
                    //Caso result não seja true, é porque é false e como tal a password é falsa.
                    //Nesse caso retornamos erro null, mas com false como o valor da autenticação e um objeto com uma mensagem a informar o que se passou. 
                    else response.json({
                        error_message:"Password Errada!"
                    });
                });    
            }
        });
    
}


function getDrinkHistory(request , response){
        id_user=request.session.user.ID_User;
       var connection = mysql2.createConnection(dbconfig);
       connection.connect();
       
       var query= mysql2.format(`Select * from Cocktail_User where id_user = ?`,[id_user]);
       connection.query(query,function(err,rows){

           if(err || !rows.length){
               response.json({
                   error_message:"Sem bebidas!"
               });
           }
           else{
            response.json({message: "success", drinks: rows });
           }
       });
}

/**
 * Função para procura e retornar Bebidas
 * @param {*} request 
 * @param {*} resposta 
 * TODO : Verificar tambem utilizando os filtros (Alchoolic e Non Alcohlic) 
 *      
 */
    function letsGetADrink(request , resposta){

        ingridient = request.body.ingridient;
        isAlcoolic = request.body.isAlcoolic;
        id_user=request.session.user.ID_User;
      
        console.log(isAlcoolic);
        
        let AlchoolCheck;
        if(isAlcoolic=='true'){
            AlchoolCheck=true
        }else AlchoolCheck=false;

        //Não Têm engredientes
        if(!ingridient){
            let url =  AlchoolCheck ? "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic":"https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic"
            var request = require('request');
            console.log("Url sem ingrediente:" + " " +url)
            request(url, function (error, response, body) {
                let drinks = JSON.parse(body);
                const randomIndex = Math.floor(Math.random() * drinks.drinks.length);

                id = drinks.drinks[randomIndex].idDrink;
                newUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="+id;
                console.log(newUrl)
                request(newUrl, function (error, response, body) {
                    let fullDrink = JSON.parse(body);
                    console.log(fullDrink);
                    
                    Cocktail_EN_strInstructions = fullDrink.drinks[0].strInstructions;
                    Cocktail_Name=  fullDrink.drinks[0].strDrink;
                    Cocktail_thumb=fullDrink.drinks[0].strDrinkThumb

                    let Coktail_EN_ingredints=[
                        fullDrink.drinks[0].strIngredient1,
                        fullDrink.drinks[0].strIngredient2,
                        fullDrink.drinks[0].strIngredient3,
                        fullDrink.drinks[0].strIngredient4,
                        fullDrink.drinks[0].strIngredient5,
                        fullDrink.drinks[0].strIngredient6,
                        fullDrink.drinks[0].strIngredient7,
                        fullDrink.drinks[0].strIngredient8,
                        fullDrink.drinks[0].strIngredient9,
                        fullDrink.drinks[0].strIngredient10,
                        fullDrink.drinks[0].strIngredient11,
                        fullDrink.drinks[0].strIngredient12,
                        fullDrink.drinks[0].strIngredient13,
                        fullDrink.drinks[0].strIngredient14,
                        fullDrink.drinks[0].strIngredient15,
                    ]
                    Coktail_EN_ingredints = Coktail_EN_ingredints.filter(elements => {
                        return elements !== null;
                    });

                    let FULLSTRING_Coktail_EN_ingredints ="";
                    FULLSTRING_Coktail_EN_ingredints=Coktail_EN_ingredints.join(",");
                    console.log(FULLSTRING_Coktail_EN_ingredints);
                    
                    let toTranslate = FULLSTRING_Coktail_EN_ingredints+"|"+Cocktail_EN_strInstructions
                    console.log(toTranslate);
                    translatte(toTranslate, {to: 'pt'}).then(res => {
                        let result=res.text.split("|");
                        
                        let Coktail_PT_ingredints = result[0].split(",");
                        let Cocktail_PT_strInstructions=result[1];
                        

                        console.log(result);

                        
                        //Adiciona Bebida ao Historico do User
                        var connection = mysql2.createConnection(dbconfig);

                        connection.connect();
                
                        var query= mysql2.format(`insert into Cocktail_User(id_user,id_Cocktail,Name_Cocktail) values(?,?,?)`,[id_user,id,Cocktail_Name]);
                        connection.query(query,function(err){
                            if(err){
                                resposta.json({
                                    error_message:"Não foi encontrada nenhuma bebida tente novamente"
                                });
                            }else{
                                resposta.json({
                                    Drink_Name:Cocktail_Name,
                                    Drink_Ingredients: Coktail_PT_ingredints,
                                    Drink_Instructions:Cocktail_PT_strInstructions,
                                    Drink_Photo:Cocktail_thumb,
                                });
                            }
                        });

                    }).catch(err => {
                        console.error(err);
                    });

                    
                });
            });
        
        }

        //Contem os Ingredientes
        else{
            translatte(ingridient, {to: 'en'}).then(res => {

                console.log(res.text) 
                result = res.text.replaceAll(' ','');
                console.log()
                const EN_Ingridients = result.split(",");
                const map1 = EN_Ingridients.map(ingridient => "&i="+ingridient);
                let url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?"
                
                url = url.concat(map1.join(''))
                
    
                let id;
                console.log("Url com ingrediente:" + " " +url)
                var request = require('request');
                request(url, function (error, response, body) {

                   
                    if(!body){ 
                        resposta.json({
                             error_message:"Não foi encontrada nenhuma bebida tente novamente"
                         });
                    }
                    else{
                    let drinks = JSON.parse(body);
                    const randomIndex = Math.floor(Math.random() * drinks.drinks.length);
                    id = drinks.drinks[randomIndex].idDrink;
                    newUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="+id;
                    console.log(newUrl)
                    request(newUrl, function (error, response, body) {
                        let fullDrink = JSON.parse(body);
                        console.log(fullDrink);
                        
                        Cocktail_EN_strInstructions = fullDrink.drinks[0].strInstructions;
                        Cocktail_Name=  fullDrink.drinks[0].strDrink;
                        Cocktail_thumb=fullDrink.drinks[0].strDrinkThumb
    
                        let Coktail_EN_ingredints=[
                            fullDrink.drinks[0].strIngredient1,
                            fullDrink.drinks[0].strIngredient2,
                            fullDrink.drinks[0].strIngredient3,
                            fullDrink.drinks[0].strIngredient4,
                            fullDrink.drinks[0].strIngredient5,
                            fullDrink.drinks[0].strIngredient6,
                            fullDrink.drinks[0].strIngredient7,
                            fullDrink.drinks[0].strIngredient8,
                            fullDrink.drinks[0].strIngredient9,
                            fullDrink.drinks[0].strIngredient10,
                            fullDrink.drinks[0].strIngredient11,
                            fullDrink.drinks[0].strIngredient12,
                            fullDrink.drinks[0].strIngredient13,
                            fullDrink.drinks[0].strIngredient14,
                            fullDrink.drinks[0].strIngredient15,
                        ]
                        Coktail_EN_ingredints = Coktail_EN_ingredints.filter(elements => {
                            return elements !== null;
                        });
    
                        let FULLSTRING_Coktail_EN_ingredints ="";
                        FULLSTRING_Coktail_EN_ingredints=Coktail_EN_ingredints.join(",");
                        console.log(FULLSTRING_Coktail_EN_ingredints);
                        
                        let toTranslate = FULLSTRING_Coktail_EN_ingredints+"|"+Cocktail_EN_strInstructions
                        console.log(toTranslate);
                        translatte(toTranslate, {to: 'pt'}).then(res => {
                            let result=res.text.split("|");
                            
                            let Coktail_PT_ingredints = result[0].split(",");
                            let Cocktail_PT_strInstructions=result[1];
                            
    
                            console.log(result);
    
                                //Adiciona Bebida ao Historico do User
                        var connection = mysql2.createConnection(dbconfig);

                        connection.connect();
                
                        var query= mysql2.format(`insert into Cocktail_User(id_user,id_Cocktail,Name_Cocktail) values(?,?,?)`,[id_user,id,Cocktail_Name]);
                        connection.query(query,function(err){
                            if(err){
                                resposta.json({
                                    error_message:"Não foi encontrada nenhuma bebida tente novamente"
                                });
                            }else{
                                resposta.json({
                                    Drink_Name:Cocktail_Name,
                                    Drink_Ingredients: Coktail_PT_ingredints,
                                    Drink_Instructions:Cocktail_PT_strInstructions,
                                    Drink_Photo:Cocktail_thumb,
                                });
                            }
                        });
    
                        }).catch(err => {
                            console.error(err);
                        });
    
                        
                    });
                    }
                });
             }).catch(err => {
                 console.error(err);
             });
        
            }
            
     
    }





    function getDrinkByID(request , resposta){
            var id = request.body.id
            newUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="+id;
            console.log(newUrl)
            var request = require('request');
            request(newUrl, function (error, response, body) {
                let fullDrink = JSON.parse(body);
                console.log(fullDrink);
                
                Cocktail_EN_strInstructions = fullDrink.drinks[0].strInstructions;
                Cocktail_Name=  fullDrink.drinks[0].strDrink;
                Cocktail_thumb=fullDrink.drinks[0].strDrinkThumb

                let Coktail_EN_ingredints=[
                    fullDrink.drinks[0].strIngredient1,
                    fullDrink.drinks[0].strIngredient2,
                    fullDrink.drinks[0].strIngredient3,
                    fullDrink.drinks[0].strIngredient4,
                    fullDrink.drinks[0].strIngredient5,
                    fullDrink.drinks[0].strIngredient6,
                    fullDrink.drinks[0].strIngredient7,
                    fullDrink.drinks[0].strIngredient8,
                    fullDrink.drinks[0].strIngredient9,
                    fullDrink.drinks[0].strIngredient10,
                    fullDrink.drinks[0].strIngredient11,
                    fullDrink.drinks[0].strIngredient12,
                    fullDrink.drinks[0].strIngredient13,
                    fullDrink.drinks[0].strIngredient14,
                    fullDrink.drinks[0].strIngredient15,
                ]
                Coktail_EN_ingredints = Coktail_EN_ingredints.filter(elements => {
                    return elements !== null;
                });

                let FULLSTRING_Coktail_EN_ingredints ="";
                FULLSTRING_Coktail_EN_ingredints=Coktail_EN_ingredints.join(",");
                console.log(FULLSTRING_Coktail_EN_ingredints);
                
                let toTranslate = FULLSTRING_Coktail_EN_ingredints+"|"+Cocktail_EN_strInstructions
                console.log(toTranslate);
                translatte(toTranslate, {to: 'pt'}).then(res => {
                    let result=res.text.split("|");
                    
                    let Coktail_PT_ingredints = result[0].split(",");
                    let Cocktail_PT_strInstructions=result[1];
                    

                    console.log(result);

                    resposta.json({
                        Drink_Name:Cocktail_Name,
                        Drink_Ingredients: Coktail_PT_ingredints,
                        Drink_Instructions:Cocktail_PT_strInstructions,
                        Drink_Photo:Cocktail_thumb,
                    });
              

                }).catch(err => {
                    console.error(err);
                });

                
            });
     
    }


/* ----  EXPORTAR OS MÓDULOS  ---- */
module.exports.RegisterUser=RegisterUser;
module.exports.Login = Login;
module.exports.letsGetADrink =letsGetADrink;
module.exports.getDrinkByID = getDrinkByID;
module.exports.getDrinkHistory = getDrinkHistory;