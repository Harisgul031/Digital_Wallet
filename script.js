
        // Global Variables
        let currentUser = null;
        let currentItemId = null;
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Shop Items
        const shopItems = [
            { id: 1, name: 'Premium T-Shirt black', price: 599, image: 'G:/t_shirt.jpeg' },
            { id: 2, name: 'Best sell T-Shirt', price: 1299, image: 'G:/combo.jpeg' },
            { id: 3, name: 'Premium T-Shirt blue', price: 2499, image: 'G:/t_shirt2.jpeg' },
            { id: 4, name: 'Premium T-Shirt white', price: 3999, image: 'G:/white.jpeg' }
        ];

        // Auth Functions

function showAddFundsModal() {
    // Check if a card has been added
    const cardItem = currentUser.items.find(item => item.type === 'card');
    
    if (!cardItem) {
        showNotification('You must add a card before adding funds', 'danger');
        return;
    }

    // Show the Add Funds modal
    const addFundsModal = new bootstrap.Modal(document.getElementById('addFundsModal'));
    addFundsModal.show();
}

function addFunds() {
    const fundsAmount = parseFloat(document.getElementById('fundsAmount').value);
    
    if (isNaN(fundsAmount) || fundsAmount <= 0) {
        showNotification('Please enter a valid amount', 'danger');
        return;
    }

    // Add funds to the user's balance
    currentUser.balance += fundsAmount;

    // Update user data in storage
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    users[userIndex] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));

    // Close the modal
    const addFundsModal = bootstrap.Modal.getInstance(document.getElementById('addFundsModal'));
    if (addFundsModal) {
        addFundsModal.hide();
    }

    // Update UI
    updateUI();
    showNotification(`Successfully added ₹${fundsAmount} to your wallet!`, 'success');
}

        function handleSignup(event) {
            event.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            password = document.getElementById('signupPassword').value;
            const balance = parseFloat(document.getElementById('initialBalance').value);
		let encryptedPassword = '';
	     for (let i = 0; i < password.length; i++) {
        	let charCode = password.charCodeAt(i);
        	encryptedPassword += String.fromCharCode(charCode + 1); // Shift each character forward by 1
    		}
		password=encryptedPassword;
            if (balance < 5000) {
                showNotification('Initial balance must be at least ₹5,000', 'danger');
                return false;
            }

            if (users.some(u => u.email === email)) {
                showNotification('Email already registered', 'danger');
                return false;
            }
		

            const user = {
                name,
                email,
                password,
                balance,
                items: []
            };

            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            showNotification('Account created successfully!', 'success');
            toggleForms();
            return false;
        }

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    password = document.getElementById('loginPassword').value;

	let decryptedPassword = '';
	 for (let i = 0; i < password.length; i++) {
        let charCode = password.charCodeAt(i);
        decryptedPassword += String.fromCharCode(charCode + 1); // Shift each character forward by 1
    }
	password=decryptedPassword;
    // Check for matching user credentials
    currentUser = users.find(u => u.email === email && u.password === password);

    if (currentUser) {
        // Hide auth forms and show dashboard/shop after login
        document.getElementById('authForms').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block'; // Show dashboard
        document.getElementById('shop').style.display = 'block'; // Show shop
        document.getElementById('balanceDisplay').style.display = 'block'; // Show balance in navbar

        // Update UI and balance display
        updateUI();
        checkBalance();
    } else {
        showNotification('Invalid credentials', 'danger');
    }

    return false;
}


function logout() {
    currentUser = null;
    // Show auth forms and hide dashboard/shop after logout
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('shop').style.display = 'none';
    document.getElementById('balanceDisplay').style.display = 'none'; // Hide balance

    // Clear any open modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modalEl => {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
            modal.hide();
        }
    });

  // Clear email and password fields
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';

    // Reset signup form as well, if needed
    document.getElementById('signupForm').reset();
}


function exportToPDF() {
    const { jsPDF } = window.jspdf; // Get the jsPDF instance
    const doc = new jsPDF();

    // Add title to the PDF
    doc.setFontSize(18);
    doc.text("User's Stored Items Report", 10, 10);

    // Add some space
    doc.setFontSize(12);
    doc.text(`Report generated for: ${currentUser.name}`, 10, 20);
    doc.text(`Email: ${currentUser.email}`, 10, 30);
    doc.text(`Balance: ₹${currentUser.balance.toFixed(2)}`, 10, 40);

    // Loop through the user's items and add them to the PDF
    let yOffset = 60;
    currentUser.items.forEach((item, index) => {
        const itemType = capitalizeFirstLetter(item.type);
        doc.text(`${index + 1}. ${itemType}`, 10, yOffset);

        // Display the item details (name-value pairs)
        Object.entries(item.fields).forEach(([key, value], fieldIndex) => {
            doc.text(`${capitalizeFirstLetter(key)}: ${value}`, 15, yOffset + (fieldIndex + 1) * 10);
        });

        yOffset += (Object.keys(item.fields).length + 2) * 10; // Adjust Y offset for the next item
    });

    // Save the PDF
    doc.save("StoredItemsReport.pdf");
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



// Function to toggle between dark and light modes
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');

    // Toggle the dark-mode class
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');

    // Update the icon based on the current theme
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark'); // Save preference
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light'); // Save preference
    }

    // Toggle navbar and card styles
    document.querySelector('.navbar').classList.toggle('navbar-dark-mode');
    document.querySelector('.navbar').classList.toggle('navbar-light-mode');
    
    document.querySelectorAll('.card').forEach(card => {
        card.classList.toggle('card-dark-mode');
        card.classList.toggle('card-light-mode');
    });
}

// Load theme preference from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeIcon.classList.add('fa-sun');
        themeIcon.classList.remove('fa-moon');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        themeIcon.classList.add('fa-moon');
        themeIcon.classList.remove('fa-sun');
    }

    // Apply navbar and card theme styles based on saved theme
    document.querySelector('.navbar').classList.add(savedTheme === 'dark' ? 'navbar-dark-mode' : 'navbar-light-mode');
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add(savedTheme === 'dark' ? 'card-dark-mode' : 'card-light-mode');
    });
});

        function toggleForms() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
            signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
        }

        // UI Functions
        function updateUI() {
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('userBalance').textContent = currentUser.balance.toFixed(2);
            document.getElementById('balanceDisplay').innerHTML = `
                <span class="nav-link text-light">
                    <i class="fas fa-coins me-1"></i>₹${currentUser.balance.toFixed(2)}
                </span>
            `;
            loadItems();
        }

       function showDashboard() {
    if (!currentUser) {
        showNotification('Please log in first', 'danger');
        return;
    }
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('shop').style.display = 'none';
    updateUI();
}

        function showShop() {
    if (!currentUser) {
        showNotification('Please log in first', 'danger');
        return;
    }
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('shop').style.display = 'block';
    loadShopItems();
}

        function checkBalance() {
            const alertElement = document.getElementById('lowBalanceAlert');
            if (currentUser.balance < 5000) {
                alertElement.style.display = 'block';
                showNotification('Low balance warning! Please add funds.', 'warning');
            } else {
                alertElement.style.display = 'none';
            }
        }

        function showNotification(message, type = 'info') {
            const container = document.getElementById('notificationContainer');
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} alert-dismissible fade show`;
            notification.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            container.appendChild(notification);
            setTimeout(() => notification.remove(), 5000);
        }

        // Item Management
        function updateItemFields() {
            const type = document.getElementById('itemType').value;
            const container = document.getElementById('dynamicFields');
            container.innerHTML = '';

            const fields = {
                card: [
                    { name: 'cardNumber', label: 'Card Number', type: 'text', pattern: '[0-9]{16}', placeholder: '1234567890123456' },
                    { name: 'cardHolder', label: 'Card Holder Name', type: 'text' },
                    { name: 'expiryDate', label: 'Expiry Date', type: 'month' },
                    { name: 'cvv', label: 'CVV', type: 'password', pattern: '[0-9]{3,4}', maxlength: '4' }
                ],
                license: [
                    { name: 'licenseNumber', label: 'License Number', type: 'text' },
                    { name: 'name', label: 'Full Name', type: 'text' },
                    { name: 'issueDate', label: 'Issue Date', type: 'date' },
                    { name: 'expiryDate', label: 'Expiry Date', type: 'date' }
                ],
                ticket: [
                    { name: 'ticketType', label: 'Ticket Type', type: 'text' },
                    { name: 'eventName', label: 'Event/Journey Name', type: 'text' },
                    { name: 'date', label: 'Date', type: 'date' },
                    { name: 'time', label: 'Time', type: 'time' },
                    { name: 'seat', label: 'Seat/Location', type: 'text' }
                ],
                password: [
                    { name: 'website', label: 'Website/App Name', type: 'text' },
                    { name: 'username', label: 'Username/Email', type: 'text' },
                    { name: 'password', label: 'Password', type: 'password' },
                    { name: 'notes', label: 'Notes (Optional)', type: 'textarea' }
                ]
            };

            fields[type].forEach(field => {
                const div = document.createElement('div');
                div.className = 'mb-3';
                
                if (field.type === 'textarea') {
                    div.innerHTML = `
                        <label class="form-label">${field.label}</label>
                        <textarea class="form-control" name="${field.name}" rows="3"></textarea>
                    `;
                } else {
                    div.innerHTML = `
                        <label class="form-label">${field.label}</label>
                        <input type="${field.type}" 
                               class="form-control" 
                               name="${field.name}"
                               ${field.pattern ? `pattern="${field.pattern}"` : ''}
                               ${field.maxlength ? `maxlength="${field.maxlength}"` : ''}
                               ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                               required>
                    `;
                }
                container.appendChild(div);
            });
        }

        function handleImageUpload() {
            const file = document.getElementById('itemImage').files[0];
            if (file) {
                // Simulated OCR processing
                showNotification('Processing image...', 'info');
                setTimeout(() => {
                    const type = document.getElementById('itemType').value;
                    // Simulate extracted data based on type
                    const sampleData = {
                        card: {
                            cardNumber: '1243125416172459',
                            cardHolder: 'JOHNATHAN DOE',
                            expiryDate: '2020-12'
                        },
                        license: {
                            licenseNumber: 'DL123456789',
                            name: 'JOHN DOE',
                            issueDate: '2020-01-01',
                            expiryDate: '2025-01-01'
                        }
                    };

                    if (sampleData[type]) {
                        const data = sampleData[type];
                        Object.keys(data).forEach(key => {
                            const input = document.querySelector(`input[name="${key}"]`);
                            if (input) input.value = data[key];
                        });
                        showNotification('Data extracted from image successfully!', 'success');
                    }
                }, 1500);
            }
        }

        function saveItem() {
    const form = document.getElementById('addItemForm');
    const type = document.getElementById('itemType').value;
    const fields = {};
    
    // Validate form
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    inputs.forEach(input => {
        if (input.type !== 'file' && input.required && !input.value) {
            isValid = false;
            input.classList.add('is-invalid');
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields', 'danger');
        return;
    }
    
    // Collect form data
    inputs.forEach(input => {
        if (input.type !== 'file') {
            fields[input.name] = input.value;
        }
    });

    const item = {
        id: currentItemId || Date.now(),
        type,
        fields,
        dateAdded: new Date().toISOString()
    };

    if (!currentUser.items) {
        currentUser.items = [];
    }

    if (currentItemId) {
        const index = currentUser.items.findIndex(i => i.id === currentItemId);
        if (index !== -1) {
            currentUser.items[index] = item;
        }
    } else {
        currentUser.items.push(item);
    }

    // Update user data in storage
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    users[userIndex] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
    if (modal) {
        modal.hide();
    }
    
    showNotification(
        currentItemId ? 'Item updated successfully!' : 'Item added successfully!', 
        'success'
    );
    
    currentItemId = null;
    loadItems();
}


        function loadItems() {
            const container = document.getElementById('itemsContainer');
            const activeCategory = document.querySelector('.list-group-item.active').getAttribute('data-category');
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            
            container.innerHTML = '';

            const filteredItems = currentUser.items.filter(item => {
                const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
                const matchesSearch = Object.values(item.fields).some(value => 
                    value.toString().toLowerCase().includes(searchTerm)
                );
                return matchesCategory && matchesSearch;
            });

            if (filteredItems.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="fas fa-search fa-3x mb-3 text-muted"></i>
                        <h5 class="text-muted">No items found</h5>
                    </div>
                `;
                return;
            }

            filteredItems.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-4';
                col.innerHTML = `
                    <div class="card item-card" onclick="showItemDetails(${item.id})">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="card-title mb-0">${getItemIcon(item.type)} ${capitalizeFirstLetter(item.type)}</h5>
                                <small class="text-muted">
                                    ${new Date(item.dateAdded).toLocaleDateString()}
                                </small>
                            </div>
                            <p class="card-text">
                                ${getItemPreview(item)}
                            </p>
                        </div>
                    </div>
                `;
                container.appendChild(col);
            });
        }

        function getItemIcon(type) {
            const icons = {
                card: 'fa-credit-card',
                license: 'fa-id-card',
                ticket: 'fa-ticket-alt',
                password: 'fa-key'
            };
            return `<i class="fas ${icons[type]}"></i>`;
        }

        function getItemPreview(item) {
            const previewFields = {
                card: ['cardHolder'],
                license: ['licenseNumber'],
                ticket: ['eventName'],
                password: ['website']
            };

            const field = previewFields[item.type][0];
            return item.fields[field] || 'No preview available';
        }

        function showItemDetails(itemId) {
            currentItemId = itemId;
            const item = currentUser.items.find(i => i.id === itemId);
            
            const modal = new bootstrap.Modal(document.getElementById('itemDetailModal'));
            const content = document.getElementById('itemDetailContent');
            
            content.innerHTML = `
                <div class="d-flex align-items-center mb-4">
                    <div class="me-3">
                        ${getItemIcon(item.type)}
                    </div>
                    <div>
                        <h4 class="mb-1">${capitalizeFirstLetter(item.type)}</h4>
                        <small class="text-muted">Added on ${new Date(item.dateAdded).toLocaleString()}</small>
                    </div>
                </div>
                <dl class="row">
                    ${Object.entries(item.fields).map(([key, value]) => `
                        <dt class="col-sm-4">${capitalizeFirstLetter(key)}</dt>
                        <dd class="col-sm-8">
                            ${key.toLowerCase().includes('password') ? '••••••••' : value}
                        </dd>
                    `).join('')}
                </dl>
            `;
            
            modal.show();
        }

	function showAddItemModal() {
                                  // Reset the form
                 document.getElementById('addItemForm').reset();
                   // Reset currentItemId as this is a new item
                currentItemId = null;
    // Update fields for default selected type
               updateItemFields();
    // Show the modal
               const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
               addItemModal.show();
}
        function deleteItem() {
            if (confirm('Are you sure you want to delete this item?')) {
                currentUser.items = currentUser.items.filter(item => item.id !== currentItemId);
                const userIndex = users.findIndex(u => u.email === currentUser.email);
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('itemDetailModal'));
                modal.hide();
                
                showNotification('Item deleted successfully!', 'success');
                loadItems();
            }
        }

        function editItem() {
            const item = currentUser.items.find(i => i.id === currentItemId);
            document.getElementById('itemType').value = item.type;
            updateItemFields();
            
            Object.entries(item.fields).forEach(([key, value]) => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) input.value = value;
            });

            const detailModal = bootstrap.Modal.getInstance(document.getElementById('itemDetailModal'));
            detailModal.hide();
            
            const addModal = new bootstrap.Modal(document.getElementById('addItemModal'));
            addModal.show();
        }

        // Shop Functions
        function loadShopItems() {
            const container = document.getElementById('shopItems');
            container.innerHTML = '';

            shopItems.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col-md-3 mb-4';
                col.innerHTML = `
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">₹${item.price}</p>
                            <button class="btn btn-primary w-100" onclick="purchaseItem(${item.id})">
                                <i class="fas fa-shopping-cart me-2"></i>Purchase
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(col);
            });
        }

        function purchaseItem(itemId) {
            const item = shopItems.find(i => i.id === itemId);
            if (!item) return;

            if (currentUser.balance >= item.price) {
                if (confirm(`Do you want to purchase ${item.name} for ₹${item.price}?`)) {
                    currentUser.balance -= item.price;
                    const userIndex = users.findIndex(u => u.email === currentUser.email);
                    users[userIndex] = currentUser;
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    updateUI();
                    showNotification(`Successfully purchased ${item.name}!`, 'success');
                    checkBalance();
                }
            } else {
                showNotification('Insufficient balance! Please add funds to your wallet.', 'danger');
            }
        }

        // Utility Functions
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
        }

        function filterItems() {
            loadItems();
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize Bootstrap components
            const bootstrapScript = document.createElement('script');
            bootstrapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js';
            document.body.appendChild(bootstrapScript);


		
            // Category selection
            document.querySelectorAll('.list-group-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector('.list-group-item.active').classList.remove('active');
                    this.classList.add('active');
                    loadItems();
                });
            });

		// Initialize Bootstrap modals
    const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'), {
        backdrop: 'static',
        keyboard: false
    });

    const itemDetailModal = new bootstrap.Modal(document.getElementById('itemDetailModal'), {
        backdrop: 'static',
        keyboard: false
    });

    // Ensure proper modal cleanup
    document.querySelectorAll('.modal').forEach(modalEl => {
        modalEl.addEventListener('hidden.bs.modal', function() {
            const form = this.querySelector('form');
            if (form) {
                form.reset();
            }
        });
    });


            // Initialize first item type fields
            updateItemFields();
        });
    