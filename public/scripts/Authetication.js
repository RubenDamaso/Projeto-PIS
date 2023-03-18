
if(JSON.parse(localStorage.getItem("curretUser"))!=null){
    window.location.replace("/dashboard");
}
else{


let ShowRegister = document.getElementById("RegisterCard");
ShowRegister.style.display= "none";

//Variaveis
var MycurrentUser = [];

/* Função que Possibilita o Login de Users */
function Login(){
    //criacao de variveis-- estas recebem os dados introduzidos pelo utilizador
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    //parametros do URL
    params=`username=${username}&password=${password}`;
    //
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/Login');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            if(response.hasOwnProperty("error_message")){
                GenerateDangerAlert(response.error_message);
            }
            else window.location.replace("/dashboard");

            
        }

     }
     xhr.send(params);
}

/* Função para esconder o Formulário de Registo */
function ShowRegisterForm(){
    let ShowRegister = document.getElementById("RegisterCard");
    ShowRegister.style.display= "block";

    let loginCard = document.getElementById("loginCard");
    loginCard.style.display="none";
}
/* Função para mostrar o Formulário de Login */
function ShowLoginForm(){
    let ShowRegister = document.getElementById("RegisterCard");
    ShowRegister.style.display= "none";

    let loginCard = document.getElementById("loginCard");
    loginCard.style.display="block";
}

/* Função que Possibilita o Registo de Users */
function Register(){

    //Obtemos os valores dos Formulário
    username = document.getElementById("usernameRegister").value;
    password = document.getElementById("passwordRegister").value;
    birthdate = document.getElementById("birthdateuser").value;

    //Coloca-mos no corpo do Pedido os valores
    params=`username=${username}&password=${password}&birthdate=${birthdate}`;

    //Realizar o Pedido para o servidor
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/Register');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
           var response = JSON.parse(xhr.responseText);
           console.log(response)
           GenerateSucessAlert(response.message);
           ShowLoginForm();
        }
}
//Enviamos os parametros anteriores no corpo do pedido http
xhr.send(params);
}
}
