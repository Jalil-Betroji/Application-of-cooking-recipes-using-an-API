// =================== Calling neccesary element from html ==================
let urlCatLamb = "https://www.themealdb.com/api/json/v1/1/filter.php?c=lamb"; //API Of Lamp category meals
let urlcountMorocco =
  "https://www.themealdb.com/api/json/v1/1/filter.php?a=Moroccan"; //API Of Moroccan country meals
let urlCountry = "https://www.themealdb.com/api/json/v1/1/list.php?a=list"; //API Of all countries name
let urlShowDefaultDataById =
  "https://www.themealdb.com/api/json/v1/1/lookup.php?i="; //API Of getting meals by id
let search = document.getElementById("filterSearch");
let dataArr = []; //we use this one to get the modal
let AllCategoriesList = []; //an array that contain all categories name
let countryListArr = []; //an array that contain all countries name
let dataArr2 = []; //we use this one to get the modal
let defaultDataArr = []; //an array that contain the default showed data
let AllCountriesMealsData = []; //an array that contain all meals data (285)
let receptName; //we use this variable to save the name of the meal that we want to know more about it
let idsOfLamb = [];
let idsOfMorocco = [];
let modals = document.getElementById("modals"); //the div where we will put our modal
const FilterCountry = document.querySelector("#select1"); //call the countries select
const FilterCategory = document.querySelector("#select2"); //call the categories select
let cardsContainer = document.querySelector("#card12");
let searchedMeal = "";
// ======================== this function is for showing data ==========================

function showData(e) {
  card = "";
  for (let i = 0; i < e.length; i++) {
    document.getElementById("card12").innerHTML = "";
    card += `
        <div class="col-sm border-1 shadow rounded card " style="width: 18rem;">
     <img
         src="${e[i].strMealThumb}"
         class="card-img-top pt-2"
     />
     <div class="card-body p-2" style="margin:0; width:18rem;">
     <h1 class="p-1" style="font-size:20px;">${e[i].strMeal}</h1>
     <button onclick="modalsdata(dataArr);" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">More Details</button>
     </div>
     </div>
     `;
  }
  document.getElementById("card12").innerHTML = card;
}
// ==================== we use this function to call all meals data and show it on the page ==========================
async function AllData() {
  //   console.log(countryListArr);
  for (let i = 0; i < countryListArr[0].meals.length; i++) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${countryListArr[0].meals[i].strArea}`
    );
    AllCountries = await response.json();
    AllCountriesMealsData.push(...AllCountries.meals);
  }
  console.log(AllCountriesMealsData.length);
  DisplayList(AllCountriesMealsData, cardsContainer, mealsPerPage, currentPage);
  SetupPagination(AllCountriesMealsData, paginationElement, mealsPerPage);
  AllCountriesMealsData = [];
}
// ================= this part for adding data to an modal after clicking on more details ==============
const modalsdata = () => {
  let modal = "";
  for (let i = 0; i < defaultDataArr.length; i++) {
    modal = `<div>
        <img class="size" src="${defaultDataArr[i].meals[0].strMealThumb}"> 
        </div>
        <div>
        <h5>${defaultDataArr[i].meals[0].strMeal}</h5>
        <p>${defaultDataArr[i].meals[0].strCategory}</p>
        <p>Country : ${defaultDataArr[i].meals[0].strArea}</p>
        <p>Ingredient : ${defaultDataArr[i].meals[0].strIngredient1} </p>
        <a href="${defaultDataArr[i].meals[0].strYoutube}" target="_Blank"> <i class="container fa-brands fa-youtube fa-2x"></i> </a>
        </div>`;
  }
  modals.innerHTML = modal;
};
/* ================= calling data using async await fetch api and loop
   ========== on it and show moroccan and lamb meals data in hompage as default  ============*/
const AllRecept = () => {
  let categoryId = [];
  let countryId = [];
  async function getcategories() {
    //we use this function to get all categories name and add it as option in our HTML
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
    );
    let categoryData = await response.json();
    AllCategoriesList.push(categoryData);
    let All = "";

    for (let i = 0; i < categoryData.meals.length; i++) {
      //loop for adding options to our HTML
      All += `
           <option value="${categoryData.meals[i].strCategory}">${categoryData.meals[i].strCategory}</option>
           `;
    }
    document.querySelector("#select2").innerHTML += All;
  }
  getcategories();

  async function getcountries() {
    //we use this loop to get all countries name and add it as options to our HTML
    const response = await fetch(urlCountry);
    let countryData = await response.json();
    countryListArr.push(countryData);
    console.log(countryListArr);
    let All = "";
    for (let i = 0; i < countryData.meals.length; i++) {
      //loop to add countries as option to our HTML
      All += `
           <option value="${countryData.meals[i].strArea}">${countryData.meals[i].strArea}</option>
           `;
    }
    document.querySelector("#select1").innerHTML += All;
  }
  getcountries();

  // ============== this part to get the ids of Lamb categories meals and save it in idsofLamb array =========

  async function callcategoryid() {
    const response = await fetch(urlCatLamb);
    catData = await response.json();
    categoryId.push(catData);
    let id = "";
    for (let i = 0; i < catData.meals.length; i++) {
      id = `${catData.meals[i].idMeal}`;
      idsOfLamb.push(id);
    }
  }
  // ======= this part to get the ids of morocco meals and save it in idsOfMorocco array =======

  async function callcountryid() {
    const response = await fetch(urlcountMorocco);
    const countData = await response.json();
    countryId.push(countData);
    let id1 = "";
    for (let i = 0; i < countData.meals.length; i++) {
      id1 = `${countData.meals[i].idMeal}`;
      idsOfMorocco.push(id1);
    }
    console.log(idsOfLamb);
    console.log(idsOfMorocco);
    const array3 = idsOfLamb.filter((data) => idsOfMorocco.includes(data));

    //here we take the same id from both arrays

    //========= we use this function to show the default meals (morocco / lamb) ========

    async function showdata() {
      for (let i = 0; i < array3.length; i++) {
        const response = await fetch(`${urlShowDefaultDataById + array3[i]}`);
        defaultData = await response.json();
        defaultDataArr.push(defaultData);
      }
      let defaultDataShow = "";
      for (let j = 0; j < defaultDataArr.length; j++) {
        defaultDataShow += `
        <div class="col-12 col-md-4 border-1 rounded shadow card" style="width: 18rem;">
        <div>
              <img
                  src="${defaultDataArr[j].meals[0].strMealThumb}"
                  class="card-img-top pt-2"
              />
              <div class="card-body p-2" style="margin:0; width:18rem;">
              <h1 class="p-1" style="font-size:20px;">${defaultDataArr[j].meals[0].strMeal}</h1>
              <button onclick="modalsdata(dataArr);" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">More Details</button>
              </div>
              </div>
              </div>
                 `;
      }
      document.getElementById("card12").innerHTML = defaultDataShow;
    }
    showdata();
  }

  // ======= this addEventListener for get name of the meal after clicking on more details button =======

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      receptName = e.target.previousElementSibling.innerHTML;
    });
  });

  callcategoryid();
  callcountryid();
};
AllRecept(); // call the function to show the default data

search.addEventListener("click", async (e) => {
  //the search button and it event after choosing the filter values
  e.preventDefault();
  let dataArr1 = [];
  let allCountriesList = [];
  let allCountriesDataId = [];
  let chosenMeal = [];
  let chosenCtaegoryDataList = [];
  let chosenCtaegoryId = [];
  let allCategoriesMealsList = [];
  let allCategoriesDataId = [];
  let chosenCountryDataId = [];
  let chosenCountryDataList = [];
  let showSpecificDataCountry = [];
  let countryValue = FilterCountry.value;
  let categoryValue = FilterCategory.value;
  countryValue.trim();
  // country selected && category not selected
  if (
    countryValue !== "*" &&
    countryValue !== "All Countries" &&
    categoryValue == "*"
  ) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${countryValue}`
    );
    let chosenCountryData = await response.json();
    dataArr2.push(chosenCountryData);
    DisplayList(
      chosenCountryData.meals,
      cardsContainer,
      mealsPerPage,
      currentPage
    );
    SetupPagination(chosenCountryData.meals, paginationElement, mealsPerPage);
  }
  // category choosed && country not choosed
  else if (
    countryValue == "*" &&
    categoryValue !== "*" &&
    categoryValue !== "All Categories"
  ) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryValue}`
    );
    let chosenCategoryData = await response.json();
    dataArr1.push(chosenCategoryData);

    DisplayList(
      chosenCategoryData.meals,
      cardsContainer,
      mealsPerPage,
      currentPage
    );
    SetupPagination(chosenCategoryData.meals, paginationElement, mealsPerPage);
  } else if (countryValue == "All Countries" && categoryValue == "*") {
    AllData();
  } else if (countryValue == "*" && categoryValue == "All Categories") {
    AllData();
  } else if (
    countryValue == "All Countries" &&
    categoryValue == "All Categories"
  ) {
    AllData();
  } else if (
    countryValue !== "*" &&
    countryValue !== "All Countries" &&
    categoryValue !== "*" &&
    categoryValue !== "All Categories"
  ) {
    let AllCategoriesId = [];
    let chosenCountryId = [];
    const CategoriesResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryValue}`
    );
    const AllCategoriesInfo = await CategoriesResponse.json();
    for (let k = 0; k < AllCategoriesInfo.meals.length; k++) {
      AllCategoriesId.push(AllCategoriesInfo.meals[k].idMeal);
    }
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${countryValue}`
    );
    const chosenCountry = await response.json();
    for (let j = 0; j < chosenCountry.meals.length; j++) {
      chosenCountryId.push(chosenCountry.meals[j].idMeal);
    }
    console.log(chosenCountryId);
    console.log(AllCategoriesId);
    const sameIdArr = AllCategoriesId.filter((data) =>
      chosenCountryId.includes(data)
    );
    console.log(sameIdArr);
    for (let k = 0; k < sameIdArr.length; k++) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${sameIdArr[k]}`
      );
      const chosenFilter = await response.json();
      chosenMeal.push(...chosenFilter.meals);
      //   console.log(chosenMeal);
    }
    if (chosenMeal.length > 0) {
      console.log(chosenMeal);
      DisplayList(chosenMeal, cardsContainer, mealsPerPage, currentPage);
      SetupPagination(chosenMeal, paginationElement, mealsPerPage);
    }
    // work on this
    else if (chosenMeal.length == 0) {
      let notfound = document.createElement("p");
      notfound.classList.add("notfound");
      notfound.setAttribute("color", "red");
      document.getElementById("card12").appendChild = notfound;
    }
  } else if (
    countryValue == "All Countries" &&
    categoryValue !== "*" &&
    categoryValue !== "All Categories"
  ) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryValue}`
    );
    const data = await response.json();
    DisplayList(data.meals, cardsContainer, mealsPerPage, currentPage);
    SetupPagination(data.meals, paginationElement, mealsPerPage);
  } else if (
    countryValue !== "All Countries" &&
    countryValue !== "*" &&
    categoryValue == "All Categories"
  ) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${countryValue}`
    );
    const data = await response.json();
    DisplayList(data.meals, cardsContainer, mealsPerPage, currentPage);
    SetupPagination(data.meals, paginationElement, mealsPerPage);
  } else if (countryValue == "*" && FilterCategory.value == "*") {
    const array3 = idsOfLamb.filter((data) => idsOfMorocco.includes(data));
    console.log(array3);
    let defaultMeals = [];
    for (const idmeal of array3) {
      const data = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idmeal}`
      );
      const response = await data.json();
      defaultMeals.push(...response.meals);
    }
    console.log(defaultMeals);
    DisplayList(defaultMeals, cardsContainer, mealsPerPage, currentPage);
    SetupPagination(defaultMeals, paginationElement, mealsPerPage);
    // AllRecept();
  }
});

// where the pagination buttons will be added
const paginationElement = document.getElementById("Pagination");
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
  let paginatedItems = items.slice(start, end); // 0=>6, 6=>12
  // we'll loop through the sliced array and we'll create an item who takes the value of the sliced array element each time the loop iterates
  for (let i = 0; i < paginatedItems.length; i++) {
    // item will be an element from the sliced array
    searchedMeal += `
    <div class="col-12 col-md-4 border-1 rounded shadow card" style="width: 18rem;">
  
          <div data-id = "${paginatedItems[i].idMeal}">
        <img
  class="card-img-top" src="${paginatedItems[i].strMealThumb}"
  />
  <div class="card-body text-center">
    <h5 class="card-title">${paginatedItems[i].strMeal}</h5>
    <a href="" class="btn btn-primary btn-meal-info">Go somewhere</a>
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
  if (page_count > 1) {
    for (let i = 1; i <= page_count; i++) {
      let btn = paginationButton(i, items);
      wrapper.appendChild(btn);
    }
  }
}

function paginationButton(page, items) {
  let button = document.createElement("button");
  button.innerText = page;
  // if the current button value is equal to the page add an active class
  if (currentPage == page) button.classList.add("active");
  //
  button.addEventListener("click", function () {
    // when we click the button the value of the current page will be changed to the value of the clicked button
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
