// Mocking Live SQL Database Data Engine Matrix
let databaseItems = [
    { id: 101, name: "Logitech MX Master 3S", category: "Peripherals", price: 8999, qty: 15 },
    { id: 102, name: "Samsung T7 1TB SSD", category: "Storage", price: 9500, qty: 3 },
    { id: 103, name: "Dell UltraSharp 27\"", category: "Electronics", price: 32000, qty: 8 }
];
let idCounter = 104;
let editTargetId = null;

// ==========================================
// AUTHENTICATION LOGIC MATRIX
// ==========================================
function handleLogin() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let errorMsg = document.getElementById("loginError");

    if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("inventoryLoggedIn", "true");
        errorMsg.innerText = ""; 
        showDashboardWorkspace();
    } else {
        errorMsg.innerText = "❌ Invalid Username or Password";
    }
}

function autoFillDemoCredentials() {
    document.getElementById("email").value = "admin@gmail.com";
    document.getElementById("password").value = "admin123";
}

function handleLogout() {
    localStorage.removeItem("inventoryLoggedIn");
    location.reload();
}

function showDashboardWorkspace() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    renderInventoryGrid();
}

// ==========================================
// INVENTORY CORE ENGINE
// ==========================================
function renderInventoryGrid(itemsToRender = databaseItems) {
    if (localStorage.getItem("inventoryLoggedIn") !== "true") return;

    let tbody = document.getElementById("inventoryTableBody");
    tbody.innerHTML = "";
    
    let lowStockCount = 0;
    let totalValuation = 0;

    databaseItems.forEach(item => {
        if(item.qty <= 5) lowStockCount++;
        totalValuation += (item.price * item.qty);
    });

    itemsToRender.forEach(item => {
        let isLow = item.qty <= 5;
        let statusBadge = isLow ? 
            `<span class="badge badge-danger">Low Stock</span>` : 
            `<span class="badge badge-success">In Stock</span>`;

        let row = `<tr>
            <td><b>#${item.id}</b></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>₹${item.price.toLocaleString('en-IN')}</td>
            <td>${item.qty} units</td>
            <td>${statusBadge}</td>
            <td>
                <div class="row-actions">
                    <button class="edit-row-btn" onclick="startEditProductMode(${item.id})"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="delete-row-btn" onclick="deleteProductItem(${item.id})"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });

    document.getElementById("totalProducts").innerText = databaseItems.length;
    document.getElementById("lowStockCount").innerText = lowStockCount;
    document.getElementById("totalValuation").innerText = "₹" + totalValuation.toLocaleString('en-IN');
}

function filterInventoryData() {
    let searchKeyword = document.getElementById("searchBar").value.toLowerCase().trim();
    let selectedCategory = document.getElementById("filterCategory").value;

    let filteredItems = databaseItems.filter(item => {
        let matchesSearch = item.name.toLowerCase().includes(searchKeyword) || item.id.toString().includes(searchKeyword);
        let matchesCategory = (selectedCategory === "All") || (item.category === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    renderInventoryGrid(filteredItems);
}

function handleProductSubmit() {
    let name = document.getElementById("prodName").value.trim();
    let category = document.getElementById("prodCategory").value;
    let price = parseFloat(document.getElementById("prodPrice").value);
    let qty = parseInt(document.getElementById("prodQty").value);

    if(!name || isNaN(price) || isNaN(qty)) {
        alert("Please fill all data fields correctly.");
        return;
    }

    if (editTargetId === null) {
        databaseItems.push({ id: idCounter++, name: name, category: category, price: price, qty: qty });
    } else {
        let targetItem = databaseItems.find(item => item.id === editTargetId);
        if (targetItem) {
            targetItem.name = name;
            targetItem.category = category;
            targetItem.price = price;
            targetItem.qty = qty;
        }
        resetFormState();
    }
    
    clearInputFields();
    filterInventoryData();
}

function startEditProductMode(id) {
    let targetItem = databaseItems.find(item => item.id === id);
    if (!targetItem) return;

    editTargetId = id;
    
    document.getElementById("prodName").value = targetItem.name;
    document.getElementById("prodCategory").value = targetItem.category;
    document.getElementById("prodPrice").value = targetItem.price;
    document.getElementById("prodQty").value = targetItem.qty;

    document.getElementById("formTitle").innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Edit Product (#${id})`;
    let submitBtn = document.getElementById("submitBtn");
    submitBtn.innerText = "Update Product";
    submitBtn.classList.add("update-mode");

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetFormState() {
    editTargetId = null;
    document.getElementById("formTitle").innerHTML = `<i class="fa-solid fa-plus"></i> Add New Product`;
    let submitBtn = document.getElementById("submitBtn");
    submitBtn.innerText = "Add to Inventory";
    submitBtn.classList.remove("update-mode");
}

function deleteProductItem(id) {
    if(confirm("Are you sure you want to delete this item from SQL registry?")) {
        databaseItems = databaseItems.filter(item => item.id !== id);
        if(editTargetId === id) resetFormState();
        filterInventoryData();
    }
}

function clearInputFields() {
    document.getElementById("prodName").value = "";
    document.getElementById("prodPrice").value = "";
    document.getElementById("prodQty").value = "";
}

// On Load Lifecycle Hook Validation
window.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("inventoryLoggedIn") === "true") {
        showDashboardWorkspace();
    } else {
        document.getElementById("loginPage").style.display = "flex";
        document.getElementById("mainApp").style.display = "none";
    }
});