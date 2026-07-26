# 💰 Expense Tracker

A modern and responsive **Expense Tracker** web application that helps users manage their personal finances efficiently. Users can securely sign up, log in, record income and expenses, organize transactions by category, and monitor their financial summary through a clean and intuitive dashboard.

🌐 **Live Demo:** https://expense-tracker-red-seven-12.vercel.app

---

## 📖 Overview

Expense Tracker is a full-stack web application built using **HTML, CSS, JavaScript, Google Apps Script, and Google Sheets**.

Instead of using a traditional database, the application uses **Google Sheets** as the backend database with **Google Apps Script** serving as the REST API. This approach provides a lightweight, serverless solution while supporting real-time data storage and retrieval.

---

## ✨ Features

- 🔐 User Authentication (Sign Up & Login)
- 💰 Add Income & Expenses
- ✏️ Edit Transactions
- 🗑️ Delete Transactions
- 📊 Real-Time Financial Dashboard
- 💵 Automatic Balance & Savings Calculation
- 📂 Category-Based Expense Management
- ➕ Custom Expense Categories
- ☁️ Google Sheets Database Integration
- ⚡ Google Apps Script REST API
- 📱 Fully Responsive Design
- 🎨 Modern User Interface



## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)

### Backend

- Google Apps Script

### Database

- Google Sheets

### Deployment

- Vercel


## ⚙️ How It Works

1. Users create an account using their name, email, and password.
2. User information is stored securely in the **Users** sheet.
3. Users can log in using their registered credentials.
4. Income and expense transactions can be added, edited, or deleted.
5. Transaction data is stored in the **Transactions** sheet.
6. The dashboard automatically calculates:
   - Total Balance
   - Total Income
   - Total Expenses
   - Total Savings
7. Data persists across sessions using Google Sheets.

---

## 🗂️ Database Structure

### Users Sheet

| Column |
|--------|
| id |
| name |
| email |
| password |
| createdAt |

### Transactions Sheet

| Column |
|--------|
| id |
| email |
| type |
| date |
| category |
| amount |
| note |
| createdAt |

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/expense-tracker.git
```

### Navigate to the Project

```bash
cd expense-tracker
```

### Run the Project

Open `index.html` directly in your browser or use the **Live Server** extension in Visual Studio Code.

---

## ☁️ Backend Setup

1. Create a Google Sheet.
2. Create two sheets named:
   - Users
   - Transactions
3. Open **Extensions → Apps Script**.
4. Paste the contents of `Code.gs`.
5. Deploy the Apps Script as a **Web App**.
6. Copy the Web App URL.
7. Update `config.js` with your Apps Script URL.

```javascript
const API_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
```

---

## 📌 Future Enhancements

- 📈 Expense Analytics Charts
- 🌙 Dark Mode
- 📅 Monthly Reports
- 📤 Export to PDF
- 📥 Export to Excel
- 🔔 Budget Alerts
- 🔍 Search & Filter Transactions
- 📊 Spending Insights

---

## 🎓 Learning Outcomes

This project helped strengthen my understanding of:

- Responsive Web Design
- JavaScript DOM Manipulation
- Fetch API
- CRUD Operations
- REST API Integration
- Google Apps Script
- Google Sheets as a Database
- Authentication Flow
- Frontend & Backend Integration
- Web Application Deployment

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is intended for educational and portfolio purposes.

---



**Gayu S**

If you found this project useful, consider giving it a ⭐ on GitHub.
