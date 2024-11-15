
# Digital Wallet Web Application

This is a **Digital Wallet Web Application** that supports:
- User authentication (Sign Up & Login)
- Item management (Cards, Licenses, Tickets, Passwords)
- Balance management with low-balance warnings
- Theme toggling (Light/Dark mode)
- PDF export of stored items
- Shop functionality for purchasing items

## Project Structure

```plaintext
.
├── index.html       # Main HTML file
├── style.css        # CSS file for styling and themes
└── script.js        # JavaScript file for application logic
```

## How to Run

1. Download all project files:  
   - `index.html`  
   - `style.css`  
   - `script.js`

2. Keep all files in the same folder.

3. Open `index.html` in your browser.

---

## Features

- 🔐 **User Authentication:** Sign up and login with email and password.
- 🎛️ **Dashboard:** Add, edit, delete, and view stored items.
- 💰 **Wallet Balance:** Track wallet balance with alerts for low funds.
- 🛒 **Shop:** Purchase items using wallet balance.
- 🎨 **Theme Toggle:** Switch between light and dark modes.
- 📝 **PDF Export:** Download a PDF report of all stored items.
- 📸 **Image Upload:** Basic image processing with simulated OCR.

---

## Dependencies

- [Bootstrap 5.3](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- [jsPDF](https://github.com/parallax/jsPDF)

These libraries are linked via CDN. No local installation is required.

---

## Notes

- All user data is stored in the browser's `localStorage`.
- For the image paths in the shop, update them to valid local paths or web URLs.
- This project is fully front-end based and does not require a backend server.

---

## Author

Haris Gul  
**Project: Web Application Assignment**
