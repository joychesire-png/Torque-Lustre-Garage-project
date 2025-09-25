document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/cars")
    .then((res) => res.json())
    .then((cars) => {
      displayCarList(cars);
      carDetails(cars[0]);
      setupBuyButton(cars[0]);
    });
});

function carDetails(car) {
  const make = document.getElementById("make");
  const model = document.getElementById("model");
  const year = document.getElementById("year");
  const color = document.getElementById("color");
  const price = document.getElementById("price");
  const mileage = document.getElementById("mileage");
  const fuelType = document.getElementById("fuelType");
  const transmission = document.getElementById("transmission");
  const bodyType = document.getElementById("bodyType");
  const condition = document.getElementById("condition");
  const location = document.getElementById("location");
  const image = document.getElementById("image");
  const description = document.getElementById("description");

  make.textContent = car.make;
  model.textContent = car.model;
  year.textContent = car.year;
  color.textContent = car.color;
  price.textContent = car.price;
  mileage.textContent = car.mileage;
  fuelType.textContent = car.fuelType;
  transmission.textContent = car.transmission;
  bodyType.textContent = car.bodyType;
  condition.textContent = car.condition;
  location.textContent = car.location;
  image.src = car.imageUrl;
  description.textContent = car.description;
}

const image = document.getElementById("image");
image.addEventListener("click", () => {
  alert("You clicked the car image!");
});

function setupBuyButton(car) {
  const button = document.getElementById("buyButton");
  button.onclick = () => {
    fetch(`http://localhost:3000/cars/${car.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: false }),
    })
      .then((res) => res.json())
      .then((updatedCar) => {
        if (!updatedCar.available) {
          button.textContent = "Sold";
          button.disabled = true;
        }
      });

    return fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        car_id: updatedCar.id,
        price: updatedCar.price,
      }),
    });
  };
}

function displayCarList(cars) {
  const list = document.getElementById("car-list");
  list.innerHTML = "";

  cars.forEach((car) => {
    const li = document.createElement("li");
    li.textContent = `${car.make} ${car.model}`;
    li.addEventListener("click", (event) => {
      event.preventDefault();
      carDetails(car);
      setupBuyButton(car);
    });
    list.appendChild(li);
  });
}
