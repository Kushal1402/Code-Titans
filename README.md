# Code-Titans
A minimalist space for code-titans team to sync, plan, and ship.
# StackIt – A Minimal Q&A Forum Platform

## 🧩 Overview

*StackIt* is a minimalistic question-and-answer platform that promotes collaborative learning and structured knowledge sharing. Built with simplicity and usability in mind, StackIt provides a streamlined experience focused on community-driven Q&A.

---

## 📦 Tech Stack
- Frontend : Next js | Typescript
- UI library : Tailwind CSS | Zustand
- Backend : Python
- Database : PostgreSQL

---

## 👥 Website Roles

| Role   | Permissions                                             |
|--------|---------------------------------------------------------|
| Guest  | View all questions and answers                          |
| User   | Register, log in, post questions/answers, vote          |
| Admin  | Moderate content                                        |

---

## 🔑 Core Features

### 1. *Ask a Question*
Users can submit new questions with the following fields:
- *Title* – A short, descriptive headline
- *Description* – A rich text field with formatting support
- *Tags* – Multi-select input (e.g., React, JWT, Node.js)

---

### 2. *Rich Text Editor*
The question and answer descriptions support the following formatting options:
- *Text Styles*: Bold, Italic, Strikethrough  
- *Lists*: Numbered & Bullet points  
- *Media & Links*: Emoji, Hyperlink, Image upload  
- *Alignment*: Left, Center, Right

---

### 3. *Answering Questions*
- Any logged-in user can answer questions
- Answers use the same rich text editor for formatting

---

### 4. *Voting & Accepting Answers*
- Users can *upvote* or *downvote* answers
- Question owners can *accept* one answer as the solution

---

### 5. *Tagging System*
- Every question must be tagged with relevant keywords
- Helps in organizing and filtering content

---

### 6. *Notification System*
- 🔔 A bell icon appears in the top navigation bar  
- Users receive notifications when:
  - Someone answers their question
  - Someone comments on their answer
  - They are mentioned via @username
- The icon displays a badge with unread notification count
- Clicking it shows a dropdown with recent alerts

---

## Folder Structure
The project folder structure is organized as follows:

- frontend/: Contains the frontend form application built with Next.js

## 🚀 Frontend Setup

1. Navigate to the frontend directory:
bash
cd frontend


2. Install dependencies:
bash
npm install


3. Copy the environment variables:
bash
cp .env.example .env.local


4. Update the .env.local file with your configuration values.

5. Start the development server:
bash
npm run dev


The frontend application will be available at http://localhost:3000

---

bash
git clone https://github.com/Kushal1402/Code-Titans.git


bash
cd Code-Titans


---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Kushal1402/Code-Titans/issues).


---

## Contribution Guidlines
1. Fork/clone the repository.
2. Create a new branch: git checkout -b feature/my-feature.
3. Commit your changes: git commit -m "Add my feature".
4. Push to the branch: git push origin feature/my-feature.
5. Submit a pull request.

---

## Author
👤 Kunj Gadhesariya - kunjgadhesariya@gmail.com
👤 Princi Shah - pri18shah@gmail.com
👤 Dhrumi Sanghavi - dhrumisanghavi2004@gmail.com
👤 Kushal Doshi - kushalhemant2003@gmail.com

---

## Show your support
Give a ⭐ if you like this p# Code-Titans
A minimalist space for code-titans team to sync, plan, and ship.