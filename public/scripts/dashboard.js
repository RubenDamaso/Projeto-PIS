



function getDrink(){
    
    //Elementos
    let cocktailConteiner=document.getElementById("Cocktail");
    let drink_name = document.getElementById("drink_Name");
    let drink_how_To_do = document.getElementById("drink_how_To_do");
    let drink_ingridients = document.getElementById("drink_ingridients");
    let searchCocktail = document.getElementById("searchCocktail");
    drink_name.innerHTML='';
    drink_how_To_do.innerHTML=''
    drink_ingridients.innerHTML=''

    params=`ingridient=${searchCocktail.value}`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/haveADrink');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            console.log(response)
            drink_name.innerHTML=response.Drink_Name;
            drink_how_To_do.innerHTML=response.Drink_Instructions




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
     xhr.send(params);

  
}

function logout(){
    window.location.replace("/logout");
}


