# 🎭 Playwright — OrangeHRM E2E Automation Testing

An end-to-end test automation project built with **Playwright** and the **Page Object Model (POM)** design pattern, targeting the [OrangeHRM Live Demo](https://opensource-demo.orangehrmlive.com/) application.

![Playwright Tests](https://github.com/your-username/playwright-demo/actions/workflows/playwright.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=node.js)
![Playwright](https://img.shields.io/badge/Playwright-v1.62-blueviolet?logo=playwright)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Test Coverage](#test-coverage)
- [Project Structure](#project-structure)
- [Page Object Model](#page-object-model)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Viewing Reports](#viewing-reports)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Utilities](#utilities)

---

## 🧪 About the Project

This project demonstrates automated browser testing using **Playwright** with a clean **Page Object Model (POM)** architecture. All test logic lives in the spec files, while locators and page interactions are encapsulated in dedicated page classes — making tests maintainable, readable, and easy to scale.

**Target Application:** [OrangeHRM Live Demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login)

---

## ✅ Test Coverage

### `tests/login.spec.js` — Login & Logout

| # | Step | Description |
|---|------|-------------|
| 1 | Navigate | Go to the OrangeHRM login page |
| 2 | Login | Authenticate as `Admin` |
| 3 | Verify Dashboard | Assert the dashboard heading is visible |
| 4 | Logout | Click the user dropdown → Logout |
| 5 | Verify Logout | Assert redirect back to login page |

---

### `tests/employee.spec.js` — Add Employee, Verify Login & Logout ⭐

A **10-step end-to-end flow** that:

| Step | Action |
|------|--------|
| ✅ Step 1 | Admin logs in |
| ✅ Step 2 | Navigate to **PIM → Employee List** |
| ✅ Step 3 | Open the **Add Employee** form |
| ✅ Step 4 | Fill employee **First Name**, **Middle Name**, **Last Name**, **Employee ID** (all randomly generated) |
| ✅ Step 5 | Enable **Create Login Details** toggle and fill username & strong password |
| ✅ Step 6 | **Save** the new employee |
| ✅ Step 7 | Admin **logs out** |
| ✅ Step 8 | **Login** as the newly created employee |
| ✅ Step 9 | **Verify** the displayed name in the top-right dropdown matches the created employee |
| ✅ Step 10 | Employee **logs out** |

> All test data (name, ID, username, password) is **randomly generated** on each run — no hardcoded values.

---

## 📁 Project Structure

```
playwright-demo/
│
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI pipeline
│
├── pages/                        # Page Object Model classes
│   ├── LoginPage.js              # Login page locators & actions
│   ├── DashboardPage.js          # Dashboard navigation & logout
│   ├── PimPage.js                # PIM module (Employee List)
│   └── AddEmployeePage.js        # Add Employee form interactions
│
├── tests/                        # Test specifications
│   ├── login.spec.js             # Login & logout test
│   └── employee.spec.js          # Full employee lifecycle E2E test
│
├── utils/
│   └── randomData.js             # Random data generators for test data
│
├── playwright.config.js          # Playwright configuration
├── package.json
└── README.md
```

---

## 🏗️ Page Object Model

Each page class strictly separates **locators** from **test logic**:

| Class | Responsibility |
|-------|---------------|
| `LoginPage` | Navigate to login URL, fill credentials, click Login |
| `DashboardPage` | Verify dashboard, navigate via sidebar, logout |
| `PimPage` | Click "Add Employee" on the Employee List page |
| `AddEmployeePage` | Fill all fields on the Add Employee form, toggle login details, save |

```
Test Spec  ──► Page Object  ──► Locators / Actions
(what)          (how)              (where)
```

---


### Run on a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run specific files

```bash
npx playwright test tests/employee.spec.js --headed --project=chromium
npx playwright test tests/login.spec.js --headed --project=chromium

```

### Run in headed mode (watch the browser)

```bash
npx playwright test --headed
```

### Run in debug mode (step through interactively)

```bash
npx playwright test --debug
```

---

## 📊 Viewing Reports

After running tests, an **HTML report** is automatically generated:

```bash
npx playwright show-report
```

## Initialize project command for dependencies



```bash
npm install                  # recreates node_modules
npx playwright install       # installs browsers
npx playwright test          # generates fresh reports

```


## 🛠️ Utilities — `utils/randomData.js`

All test data is generated fresh on every run using the following helpers:

| Function | Output Example | Description |
|----------|---------------|-------------|
| `randomAlpha(n)` | `"wkplmn"` | Random lowercase string of length `n` |
| `randomDigits(n)` | `"7342"` | Random digit string of length `n` |
| `capitalize(str)` | `"Wkplmn"` | Capitalizes first character |
| `randomUsername()` | `"qwert823"` | 5 letters + 3 digits |
| `generateStrongPassword()` | `"aB3!xYm7"` | Meets OrangeHRM password policy |

> **OrangeHRM password policy** requires: uppercase + lowercase + symbol + digit + minimum 8 characters. `generateStrongPassword()` satisfies all constraints.

---

## 🌐 Browser Support

Tests run across three browser engines out of the box:

| Browser | Engine |
|---------|--------|
| Chrome | Chromium |
| Firefox | Firefox |
| Safari | WebKit |

---

## 📌 Notes

- The **employee E2E test** has a `3-minute timeout` to accommodate the 10 sequential steps and deliberate 1-second delays between actions.
  

---


