document.addEventListener("DOMContentLoaded", () => {
  let carsData = [];

  fetch("http://localhost:3000/cars")
    .then((res) => res.json())
    .then((cars) => {
      carsData = cars;
      displayCarList(cars);
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
  const carList = document.getElementById("car-list");
  carList.classList.add("hidden");
  const carDetails = document.getElementById("car-details");
  carDetails.classList.remove("hidden");
  const detailsContent = document.getElementById("detailsContent");
  const backButton = document.getElementById("backButton");
  backButton.onclick = () => {
    document.getElementById("car-details").classList.add("hidden");
    document.getElementById("car-list").classList.remove("hidden");
  };

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

function setupBuyButton(car) {
  const button = document.getElementById("buyButton");
  const paymentSelect = document.getElementById("paymentSelect");

  if (!car.available || car.available === "false") {
    button.textContent = "Sold";
    button.disabled = true;
    return;
  }
  button.textContent = "Buy";
  button.disabled = false;

  button.onclick = () => {
    if (!paymentSelect.value) {
      alert("Please select a payment method!");
      return;
    }

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
          alert(`Payment via ${paymentSelect.value} processed successfully!`);
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
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <img src="${car.imageUrl}" alt="${car.make}">
      <div class="card-body">
        <h3>${car.make} ${car.model}</h3>
        <p class="price">${car.price}</p>
         <button class="view-btn">View Details</button>
      </div>
      </div>
    `;
    card.onclick = () => {
      carDetails(car);
      setupBuyButton(car);
    };
    list.appendChild(card);
  });
}

function searchCars() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const fuel = document.getElementById("fuelFilter")?.value || "";
  const transmission =
    document.getElementById("transmissionFilter")?.value || "";
  const body = document.getElementById("bodyFilter")?.value || "";

  fetch("http://localhost:3000/cars")
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.filter(
        (car) =>
          car.make.toLowerCase().includes(query) ||
          (car.model.toLowerCase().includes(query) &&
            (fuel === "" || car.fuelType === fuel) &&
            (transmission === "" || car.transmission === transmission) &&
            (body === "" || car.bodyType === body))
      );
      displayResults(filtered);
    });
}

function displayResults(cars) {
  const container = document.getElementById("results");
  container.innerHTML = "";
  cars.forEach((car) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <h3>${car.make} ${car.model}</h3>
        <p>${car.year} - ${car.price}</p>
        <p>${car.location}</p>
        <img src="${car.imageUrl}" width="200" />
    `;
    container.appendChild(card);
  });

  window.scrollTo({
    top: container.offsetTop - 20,
    behavior: "smooth",
  });
}
