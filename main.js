// ========= call all needed html element =============

let search = document.querySelector("#search");
let searchBtn = document.getElementById("search-btn");
let mealByName = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
let result = document.getElementById("result");
let searchresult = "";
let dataArr = [];
let data;
let receptName; 
let modals = document.getElementById("modals");
let cardsContainer = document.querySelector("#card12");
const paginationElement = document.getElementById("Pagination");
let searchedMeal = "";

// ============ modal function (an modal will apear after clicking on more details button ) ========

const modalsdata = (data) => {
    let modal = "";
    for (let i = 0; i < data.length; i++) { // here we loop to get all ingredient list from the meals 
        let ingredients = "";
        Object.keys(data[i].meals[0]).forEach((property) => {
            if (property.startsWith("strIngredient") && data[i].meals[0][property]) {
                ingredients += `<li>${
                    data[i].meals[0][property]
                }</li>`;
            }
        });
        console.log(data);
        console.log(ingredients);
        if (data[i].meals[0].strMeal === receptName) {
         modal = `<div>
                       <img class="size" src="${data[i].meals[0].strMealThumb}"> 
                  </div>
                  <div>
                    <h5>${data[i].meals[0].strMeal}</h5>
                    <p>${data[i].meals[0].strCategory}</p>
                    <p>Country : ${data[i].meals[0].strArea}</p>
                    <p>Ingredient :${ingredients} </p>
                    <a href="${data[i].meals[0].strYoutube}" target="_Blank"> <i class="container fa-brands fa-youtube fa-2x"></i> </a>
                  </div>`;
        }
        modals.innerHTML = modal;
    }
};

// ========== this part to show 6 random meals on the home page by default =========

const randomApi = () => {
    let card = "";
    for (let i = 0; i < 6; i++) {
        async function get() {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
            data = await response.json();
            dataArr.push(data);
            card += `
        <div class="col-12 col-md-4 border-1 rounded shadow card" style="width: 18rem;">
        <div>
              <img src="${data.meals[0].strMealThumb}"class="card-img-top pt-2"
              />
              <div class="card-body p-2" style="width:18rem;">
              <h3 class="p-1" style="font-size:20px;">${data.meals[0].strMeal}</h3>
              <button onclick="modalsdata(dataArr);" class="btn btn-primary btn-meal" data-bs-toggle="modal" data-bs-target="#exampleModal">More Details</button>
              </div>
              </div>
              </div>
              `;
            document.getElementById("card12").innerHTML = card;
            document.querySelectorAll(".btn-meal").forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    receptName = e.target.previousElementSibling.innerHTML;
                    console.log(receptName);
                });
            });
        }
        get();
    }
};
randomApi();

// =========== this part for search result data ===========

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchresult = search.value;
    searchresult.trim();
    async function searchRecept() {
        const response = await fetch(mealByName + searchresult);
        const data1 = await response.json();
        console.log(data1);
        if (searchresult.length == 0) {
            result.innerHTML = `<p class="text-danger">Input Field Cannot Be Empty</p>`;
        } else {
            DisplayList(data1.meals, cardsContainer, mealsPerPage, currentPage);
            SetupPagination(data1.meals, paginationElement, mealsPerPage);
        }
    }
    searchRecept();
});

// we start by initilazing current page to 1
let currentPage = 1;
// how many meals will be displayed on the page
let mealsPerPage = 6;
// create a sliced array from the original array based on the clicked page button then it display the array elements in html page
function DisplayList(items, wrapper, mealsPerPage, page) {
    wrapper.innerHTML = "";
    page--;
    /* start and end will determine how are displayed items 
      on the page from the whole array */
    let start = mealsPerPage * page;
    let end = start + mealsPerPage;
    // will slice the array based on the start and the end
    let paginatedItems = items.slice(start, end);
    // 0=>6, 6=>12
    // we'll loop through the sliced array and we'll create an item who takes the value of the sliced array element each time the loop iterates
    for (let i = 0; i < paginatedItems.length; i++) { // item will be an element from the sliced array
        searchedMeal += `
    <div class="col-12 col-md-4 border-1 rounded shadow card" style="width: 18rem;">
         <div data-id = "${paginatedItems[i].idMeal}">
            <img class="card-img-top pt-2" src="${paginatedItems[i].strMealThumb}"/>
            <div class="card-body p-2" style="width:18rem;">
            <h3 class="p-1" style="font-size:20px;">${paginatedItems[i].strMeal}</h3>
            <button onclick="modalsdata(dataArr);" class="btn btn-primary btn-meal" data-bs-toggle="modal" data-bs-target="#exampleModal">More Details</button>
            </div>
            </div>
            </div>
  `;
    }
    document.getElementById("card12").innerHTML.innerHTML = "";
    document.getElementById("card12").innerHTML = searchedMeal;
    searchedMeal = "";
}
// calculate how many pages button will be displayed and adding the buttons with the paginationButton function
function SetupPagination(items, wrapper, mealsPerPage) {
    wrapper.innerHTML = "";
    // count pages
    let page_count = Math.ceil(items.length / mealsPerPage);
    // create buttons ( pages numbers ) based on the pages numbers
    for (let i = 1; i <= page_count; i++) {
        let btn = paginationButton(i, items);
        wrapper.appendChild(btn);
    }
}

function paginationButton(page, items) {
    let button = document.createElement("button");
    button.innerText = page;
    // if the current button value is equal to the page add an active class
    if (currentPage == page) 
        button.classList.add("active");
    

    //
    button.addEventListener("click", function () { // when we click the button the value of the current page will be changed to the value of the clicked button
        currentPage = page;
        DisplayList(items, cardsContainer, mealsPerPage, currentPage);
        // delete the active class from the selected button
        let current_btn = document.querySelector("#Pagination button.active");
        current_btn.classList.remove("active");
        // adding the active class to the selected button
        button.classList.add("active");
    });
    return button;
}
