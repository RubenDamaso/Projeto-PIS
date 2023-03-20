let isAlcoolicState = true;
let isClicked=false;
let isClickedIngridients=false;

function AlcohlicButton(){
    isClicked=!isClicked;

    let alchoolConteiner=document.getElementById("alchoolConteiner");

    isClicked ? alchoolConteiner.style.backgroundColor = "#FFFFFF" :  alchoolConteiner.style.backgroundColor = "#c2c2c2";
    changeAlchoolState();
    console.log(isAlcoolicState);

}

function changeAlchoolState(){
    isAlcoolicState ? isAlcoolicState=false : isAlcoolicState=true;
}


function searchCocktailbyIngridient(){
    isClickedIngridients=!isClickedIngridients;
    let Search=document.getElementById("Search");
    let ingridientBox= document.getElementById("ingredientContainer")

    if(Search.style.display=="none")Search.style.display="flex";
    else Search.style.display="none"

    isClickedIngridients ? ingridientBox.style.backgroundColor = "#FFFFFF" :  ingridientBox.style.backgroundColor = "#c2c2c2";

}
let loading= document.getElementById("Loading");
loading.style.display="none";
let cocktailConteiner=document.getElementById("Cocktail");
Cocktail.style.display="none";

function getDrink(){
    console.log(isAlcoolicState);
    $(loading).show();
    
    //Elementos

    let drink_name = document.getElementById("drink_Name");
    let drink_how_To_do = document.getElementById("drink_how_To_do");
    let drink_ingridients = document.getElementById("drink_ingridients");
    let searchCocktail = document.getElementById("searchCocktail");
    let drink_image = document.getElementById("drink_image");

    drink_name.innerHTML='';
    drink_how_To_do.innerHTML=''
    drink_ingridients.innerHTML=''

    params=`ingridient=${searchCocktail.value}&isAlcoolic=${isAlcoolicState}`;
    cocktailConteiner.style.display="none";
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/haveADrink');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            if(response.hasOwnProperty("error_message")){
                GenerateDangerAlert(response.error_message);
            }
            else{
                console.log(response)
                
    
                setTimeout(function() { 
                    $(loading).hide(); 
                    $(cocktailConteiner).show(); 
                    
                }, 3000);

                drink_name.innerHTML=response.Drink_Name;
                drink_how_To_do.innerHTML=response.Drink_Instructions
                drink_image.src = response.Drink_Photo;
                var ul = document.createElement('ul');
                ul.setAttribute('id','ingredinetList');
    
        
                drink_ingridients.appendChild(ul);
                
                function renderProductList(element, index, arr) {
                    var li = document.createElement('li');
                    li.setAttribute('class','item');
        
                    ul.appendChild(li);
        
                    li.innerHTML=li.innerHTML + element;
                }
                
                response.Drink_Ingredients.forEach(renderProductList);
            }

        }

     }
     xhr.send(params);

  
}

function logout(){
    window.location.replace("/logout");
}


