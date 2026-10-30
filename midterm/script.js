// Task 3: Live Search, Price Sorting, and Premium Labels

const searchInput = document.getElementById("product-search");
const sortButton = document.getElementById("sort-price");
const noProductsMessage = document.getElementById("no-products-message");

// Select the existing product cards.
const productCards = Array.from(
  document.querySelectorAll(
    ".cake-products > a, .sundae-products > a, .cookies-products > a"
  )
);

// Existing product grids.
const productGrids = document.querySelectorAll(
  ".cake-products, .sundae-products, .cookies-products"
);

// Personal threshold: N × 100 = 67 × 100 = Rs. 6,700.
const PREMIUM_THRESHOLD = 6700;

// First sort: ascending. Next sort: descending.
let ascending = true;


// Extract the numerical price from an existing product card.
function getPrice(card) {
  const priceElement = card.querySelector(".product-h3");

  if (!priceElement) {
    return 0;
  }

  return parseFloat(
    priceElement.textContent.replace(/[^\d.]/g, "")
  ) || 0;
}


// Task 3: Add Premium labels when the page loads.
function addPremiumLabels() {
  productCards.forEach(function (card) {
    const price = getPrice(card);
    const priceElement = card.querySelector(".product-h3");

    if (price > PREMIUM_THRESHOLD && priceElement) {
      const badge = document.createElement("span");

      badge.className = "premium-label";
      badge.textContent = "Premium";

      priceElement.insertAdjacentElement("afterend", badge);
    }
  });
}


// Get the category selected in Task 1.
function getSelectedCategory() {
  const selectedRadio = document.querySelector(
    'input[name="category"]:checked'
  );

  if (!selectedRadio || selectedRadio.id === "filter-all") {
    return null;
  }

  const categoryMap = {
    "filter-chocolate": "chocolate-cake",
    "filter-milk": "milk-cake",
    "filter-sundaes": "sundae",
    "filter-cookies": "cookie"
  };

  return categoryMap[selectedRadio.id] || null;
}


// Task 3: Live search combined with the Task 1 category filter.
function filterProducts() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCategory = getSelectedCategory();

  let matchingProducts = 0;

  productCards.forEach(function (card) {
    const nameElement = card.querySelector(".product-h2");

    const productName = nameElement
      ? nameElement.textContent.trim().toLowerCase()
      : "";

    const matchesSearch = productName.includes(searchText);

    const matchesCategory =
      selectedCategory === null ||
      card.classList.contains(selectedCategory);

    const isMatch = matchesSearch && matchesCategory;

    // Let the existing CSS category filter work too.
    card.style.display = isMatch ? "" : "none";

    if (isMatch) {
      matchingProducts++;
    }
  });

  // Hide product sections that have no matching cards.
  document.querySelectorAll("section.container").forEach(function (section) {
    const grid = section.querySelector(
      ".cake-products, .sundae-products, .cookies-products"
    );

    if (!grid) {
      return;
    }

    const visibleCards = Array.from(grid.children).filter(function (card) {
      return card.matches("a") &&
        card.style.display !== "none" &&
        (
          selectedCategory === null ||
          card.classList.contains(selectedCategory)
        ) &&
        card.querySelector(".product-h2")?.textContent
          .trim()
          .toLowerCase()
          .includes(searchText);
    });

    section.hidden = visibleCards.length === 0;
  });

  // Show or hide the no-results message.
  noProductsMessage.style.display =
    matchingProducts === 0 ? "block" : "none";
}


// Task 3: Sort existing cards by price.

function sortProducts() {
  productGrids.forEach(function (grid) {
    const cards = Array.from(grid.querySelectorAll(":scope > a"));

    cards.sort(function (a, b) {
      return ascending
        ? getPrice(a) - getPrice(b)
        : getPrice(b) - getPrice(a);
    });

    cards.forEach(function (card) {
      grid.appendChild(card);
    });
  });

  // Update the button to describe the NEXT sorting action.
  sortButton.textContent = ascending
    ? "Sort by price (Low to High)"
    : "Sort by price (High to Low)";

  ascending = !ascending;
}


// Search as the user types.
searchInput.addEventListener("input", filterProducts);


// Reapply filtering when the category changes.
document.querySelectorAll('input[name="category"]').forEach(
  function (radio) {
    radio.addEventListener("change", filterProducts);
  }
);


// Sort whenever the button is clicked.
sortButton.addEventListener("click", sortProducts);


// Run when the page loads.
addPremiumLabels();
filterProducts();