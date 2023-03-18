/* Script para gerar Alerts com a mensagem passada como parametro do Bootstrap*/ 

function GenerateDangerAlert(msg){
 var DivWarning = document.getElementById("warning");
 DivWarning.style.display = "block";
 DivWarning.innerText = msg;
 window.setTimeout("closeAlert();", 5000);
} 

function GenerateSucessAlert(msg){
    var DivWarning = document.getElementById("warningSucess");
    DivWarning.style.display = "block";
    DivWarning.innerText = msg;
    window.setTimeout("closeAlertSucess();", 5000);
} 

function closeAlert(){
    document.getElementById("warning").style.display=" none";
}

function closeAlertSucess(){
    document.getElementById("warningSucess").style.display=" none";
}