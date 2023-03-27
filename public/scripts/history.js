var tableBody= document.getElementById("table-body");
tableBody.innerHTML='';
getAllDrinks();


function GetDrink(id){
 
    $(loading).show();
    
    //Elementos

    let drink_name = document.getElementById("drink_Name");
    let drink_how_To_do = document.getElementById("drink_how_To_do");
    let drink_ingridients = document.getElementById("drink_ingridients");
    let drink_image = document.getElementById("drink_image");

    drink_name.innerHTML='';
    drink_how_To_do.innerHTML=''
    drink_ingridients.innerHTML=''

    params=`id=${id}`;
    cocktailConteiner.style.display="none";

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/getDrinkByID');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            if(response.hasOwnProperty("error_message")){
                GenerateDangerAlert(response.error_message);
                $(loading).hide(); 
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

function GoToDashboard()
{
    window.location.replace("/dashboard");
}
function createRow(DrinkName,DrinkID){

    var tr = document.createElement("tr");
    var td = document.createElement("td");
    
    tr.setAttribute("onclick", `GetDrink(${DrinkID})`);
    td.innerHTML=DrinkName;


    tr.appendChild(td);
    tableBody.appendChild(tr);

}

function getAllDrinks(){

  



    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/getDrinkHistory');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if ((this.readyState === 4) && (this.status === 200)) {
            var response = JSON.parse(xhr.responseText);
            if(response.hasOwnProperty("error_message")){
                GenerateDangerAlert(response.error_message);
                $(loading).hide(); 
            }
            else{
                console.log(response)
                response.drinks.forEach(drink => {
                    createRow(drink.Name_Cocktail ,drink.id_Cocktail);
                });

            }
        }
     }
     xhr.send();
}