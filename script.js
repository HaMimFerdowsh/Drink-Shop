const loadDrinks = (searchText, limit) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`)
    .then((res) => res.json())
    .then((data) => {
      let drinks = data.drinks;
      if (drinks && limit) {
        drinks = drinks.slice(0, limit);
      }
      displayDrinks(drinks);
    });
};

const getPrice = (id) => {
  return ((parseInt(id) % 15) + 5) * 50;
};

const displayDrinks = (drinks) => {
  const drinkContainer = document.getElementById("drink-container");
  drinkContainer.innerHTML = "";

  if (!drinks) {
    drinkContainer.innerHTML = `<p style="width: 100%; text-align: center; font-size: 24px; color: red;">Not found</p>`;
    return;
  }

  drinks.forEach((drink) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="" />
      <h3>${drink.strDrink}</h3>
      <p><b>Category:</b> ${drink.strCategory}</p>
      <p><b>Instructions:</b> ${drink.strInstructions.slice(0, 15)}</p>
      <h3>Price: ৳${getPrice(drink.idDrink)}</h3>
      <div style="display: flex; gap: 10px; margin-top: auto; padding-top: 10px;">
        <button style="background: green; color: white; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer;" onclick="handleAddToGroup('${drink.strDrink.replace(/'/g, "\\'")}', ${getPrice(drink.idDrink)})">Add to group</button>
        <button style="padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer;" onclick="singleDrink('${drink.idDrink}')">Details</button>
      </div>
    `;
    drinkContainer.appendChild(div);
  });
};

const handleSearch = () => {
  const text = document.getElementById("search-input").value;
  if (text === "") {
    loadDrinks("a", 10);
  } else {
    loadDrinks(text);
  }
};

const handleAddToGroup = (name, price) => {
  const groupCount = document.getElementById("count").innerText;
  let convertedCount = parseInt(groupCount);

  if (convertedCount >= 7) {
    alert("You cannot add more than 7 drinks to a group!");
    return;
  }

  convertedCount = convertedCount + 1;
  document.getElementById("count").innerText = convertedCount;

  const container = document.getElementById("group-list");
  const li = document.createElement("li");
  li.innerHTML = `${name} - ৳<span class="price">${price}</span>`;
  container.appendChild(li);
  updateTotal();
};

const updateTotal = () => {
  const allPrice = document.getElementsByClassName("price");
  let total = 0;
  for (const element of allPrice) {
    total = total + parseFloat(element.innerText);
  }
  document.getElementById("total").innerText = total.toFixed(2);
};

const singleDrink = (id) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      const drink = data.drinks[0];

      let ingredients = "";
      for (let i = 1; i <= 15; i++) {
        if (drink["strIngredient" + i]) {
          ingredients += `<li>${drink["strMeasure" + i] || ""} ${drink["strIngredient" + i]}</li>`;
        }
      }

      const modalBox = document.getElementById("modal-box");
      modalBox.innerHTML = `
        <button style="background: #7b2d3b; color: white; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer;" onclick="closeModal()">Close</button>
        <img style="width: 100%; height: 200px;" src="${drink.strDrinkThumb}" alt="" />
        <h2>${drink.strDrink}</h2>
        <p><b>Category:</b> ${drink.strCategory}</p>
        <p><b>Type:</b> ${drink.strAlcoholic}</p>
        <p><b>Glass:</b> ${drink.strGlass}</p>
        <p><b>Price:</b> ৳${getPrice(drink.idDrink)}</p>
        <p><b>Instructions:</b> ${drink.strInstructions}</p>
        <p><b>Ingredients:</b></p>
        <ul>${ingredients}</ul>
      `;
      const modal = document.getElementById("modal");
      modal.style.display = "flex";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.background = "rgba(0, 0, 0, 0.6)";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";

      modalBox.style.background = "white";
      modalBox.style.padding = "20px";
      modalBox.style.width = "400px";
      modalBox.style.maxHeight = "90%";
      modalBox.style.overflow = "auto";
    });
};

const closeModal = () => {
  document.getElementById("modal").style.display = "none";
};

loadDrinks("a", 10);