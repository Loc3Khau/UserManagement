# React + FastAPI Web Application

A full-stack web application built with **React** for the frontend and **FastAPI** for the backend.

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* Node.js
* npm

### Backend

* Python
* FastAPI
* Uvicorn

### Development Tools

* Visual Studio Code
* Git
* GitHub

---

## Project Structure

```text
project-root/
│
├── frontend/                 # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # FastAPI application
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
└── README.md
```

---

# Prerequisites

Before running this project, install the following software.

## 1. Install Visual Studio Code

Download and install Visual Studio Code:

https://code.visualstudio.com/

After installation, open VS Code and install the recommended extensions listed below.

---

## 2. Install Node.js

Node.js is required to run the React frontend.

Download the **LTS version** of Node.js:

https://nodejs.org/

After installation, open a terminal and verify the installation:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Example output:

```text
v22.x.x
10.x.x
```

---

## 3. Install Python

Python is required to run the FastAPI backend.

Download Python:

https://www.python.org/downloads/

Recommended version:

```text
Python 3.11 or newer
```

During installation on Windows, make sure to enable:

```text
Add Python to PATH
```

After installation, verify Python:

```bash
python --version
```

If the command does not work, try:

```bash
py --version
```

---

## 4. Install Git

Git is used for version control and cloning the project.

Download Git:

https://git-scm.com/downloads

Verify the installation:

```bash
git --version
```

---

# Recommended VS Code Extensions

Open VS Code and go to:

```text
Extensions → Search
```

Install the following extensions.

## Required Extensions

### Python

Extension name:

```text
Python
```

Publisher:

```text
Microsoft
```

Features:

* Python syntax highlighting
* Code completion
* Debugging
* Python environment selection
* Linting support

---

### Pylance

Extension name:

```text
Pylance
```

Publisher:

```text
Microsoft
```

Features:

* Better Python IntelliSense
* Type checking
* Faster code completion

---

### ESLint

Extension name:

```text
ESLint
```

Publisher:

```text
Microsoft
```

Features:

* Detects JavaScript and React code problems
* Helps maintain consistent code quality

---

### Prettier - Code Formatter

Extension name:

```text
Prettier - Code formatter
```

Publisher:

```text
Prettier
```

Features:

* Automatically formats JavaScript, React, HTML, CSS, and JSON files

---

### ES7+ React/Redux/React-Native Snippets

Extension name:

```text
ES7+ React/Redux/React-Native snippets
```

Features:

* Provides useful React code snippets
* Speeds up component development

Example:

```javascript
rafce
```

This can generate a basic React functional component.

---

### GitLens

Extension name:

```text
GitLens
```

Features:

* Displays Git history
* Shows code authors
* Helps inspect file changes

---

### REST Client (Optional)

Extension name:

```text
REST Client
```

Features:

* Tests FastAPI endpoints directly inside VS Code

---

# Clone the Project

Open a terminal and run:

```bash
git clone <YOUR_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd <PROJECT_NAME>
```

Open the project in VS Code:

```bash
code .
```

---

# Backend Setup

## 1. Open the Backend Folder

In the VS Code terminal:

```bash
cd backend
```

---

## 2. Create a Python Virtual Environment

### Windows

```bash
python -m venv venv
```

If `python` does not work:

```bash
py -m venv venv
```

### macOS/Linux

```bash
python3 -m venv venv
```

---

## 3. Activate the Virtual Environment

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

### Windows Command Prompt

```cmd
venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

After activation, the terminal should display something similar to:

```text
(venv)
```

---

## 4. Install Python Dependencies

Run:

```bash
pip install -r requirements.txt
```

If `pip` does not work:

```bash
python -m pip install -r requirements.txt
```

---

## 5. Run the FastAPI Server

Run:

```bash
uvicorn main:app --reload
```

If `main.py` is located inside an `app` folder:

```bash
uvicorn app.main:app --reload
```

The backend server should run at:

```text
http://127.0.0.1:8000
```

---

## FastAPI Documentation

FastAPI automatically generates API documentation.

### Swagger UI

Open:

```text
http://127.0.0.1:8000/docs
```

### ReDoc

Open:

```text
http://127.0.0.1:8000/redoc
```

---

# Frontend Setup

Open a new terminal in VS Code.

Move to the frontend folder:

```bash
cd frontend
```

Install the required npm packages:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

The exact port may be different if port `5173` is already in use.

---

# Running the Full Application

You need to run the frontend and backend in separate terminals.

## Terminal 1: Backend

```bash
cd backend
```

Activate the Python virtual environment.

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

Then run:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Terminal 2: Frontend

```bash
cd frontend
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file when environment variables are required.

Example backend `.env`:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
DEBUG=True
```

Do not upload sensitive information to GitHub.

Add the following to `.gitignore`:

```gitignore
# Python
venv/
__pycache__/
*.pyc

# Environment variables
.env

# Node.js
node_modules/
dist/

# VS Code
.vscode/
```

---

# Recommended VS Code Settings

Create the following file:

```text
.vscode/settings.json
```

Add:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "python.analysis.typeCheckingMode": "basic"
}
```

This configuration automatically formats supported files when they are saved.

---

# Common Commands

## Frontend

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Backend

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the development server:

```bash
uvicorn main:app --reload
```

---

# Troubleshooting

## Python Is Not Recognized

If you see:

```text
'python' is not recognized as an internal or external command
```

Try:

```bash
py --version
```

If this works, use:

```bash
py -m venv venv
```

You may also need to reinstall Python and enable:

```text
Add Python to PATH
```

---

## PowerShell Does Not Allow Virtual Environment Activation

If PowerShell displays an execution policy error, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate the environment again:

```powershell
.\venv\Scripts\Activate.ps1
```

---

## npm Is Not Recognized

Reinstall Node.js from:

https://nodejs.org/

After installation, close and reopen VS Code.

Verify:

```bash
node --version
npm --version
```

---

## Port Is Already in Use

If port `8000` is occupied, run FastAPI on another port:

```bash
uvicorn main:app --reload --port 8001
```

If the React port is occupied, Vite will usually select another available port automatically.

---

## CORS Error

If the React frontend cannot access the FastAPI backend, configure CORS in `main.py`.

Example:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

# Development Workflow

1. Start the FastAPI backend.
2. Start the React frontend.
3. Open the React application in the browser.
4. Make changes to the frontend or backend.
5. Vite automatically reloads the React application.
6. Uvicorn automatically reloads the FastAPI server when Python files are changed.

---

# Notes

* Do not upload the `venv/` folder.
* Do not upload the `node_modules/` folder.
* Do not upload `.env` files containing passwords, API keys, or secret values.
* Run `npm install` after cloning the project.
* Run `pip install -r requirements.txt` after cloning the project.
* Always activate the Python virtual environment before running the backend.

---

# License

This project is intended for educational and development purposes.

## Author

Developed using:

* React
* FastAPI
* Python
* JavaScript
* Visual Studio Code
