# Graphura Intern Management System (IMS)

![Graphura Logo](GraphuraLogo.jpg)
---

## Project Overview

The **Graphura Intern Management System (IMS)** is a web-based platform designed to automate and streamline the management of interns in an organization. This system provides HR personnel, Admins, and Managers with tools to efficiently manage intern data, track performance, generate reports, and communicate important updates.

The project is a **group project** developed as part of our academic curriculum to showcase real-world software development practices, teamwork, and full-stack development skills.

---

## Project Objectives

* To create a centralized platform for managing interns.
* To automate intern onboarding and performance tracking.
* To reduce manual paperwork and administrative workload.
* To provide HR and Admins with an easy-to-use dashboard for monitoring intern progress.
* To integrate communication tools for sending notifications and updates.

---

## Features

### Admin Panel

* Add, update, and delete intern records.
* Assign interns to departments or teams.
* Track intern progress and performance.
* Generate reports in PDF format (e.g., Offer Letters, Evaluation Reports).

### HR Dashboard

* View all interns with search and filter options.
* Monitor intern performance metrics.
* Approve or reject leave requests.
* Send notifications to interns via email or WhatsApp (Twilio integration).

### Intern Panel

* View personal information and assigned tasks.
* Track performance and feedback.
* Submit reports and request leave.

### Authentication & Authorization

* Role-based access control: Admin, HR, and Intern roles.
* JWT-based authentication for secure login.
* Forgot password and email verification.

### Communication

* Real-time notifications.
* Integration with WhatsApp API (Twilio/Meta API).
* Email notifications for important updates.

---

## Technologies Used

### Frontend

* **React.js** – For building dynamic user interfaces.
* **HTML5, CSS3, and JavaScript** – Core web technologies.
* **Tailwind CSS** – For responsive and modern UI.
* **React Router** – For client-side routing.
* **Axios** – For API requests.

### Backend

* **Node.js & Express.js** – Server-side logic and RESTful APIs.
* **MongoDB & Mongoose** – Database for storing intern, HR, and admin data.
* **JWT (JSON Web Token)** – Authentication and authorization.
* **Twilio API** – WhatsApp notifications.

### Tools & Libraries

* **VS Code** – IDE for development.
* **Postman** – API testing.
* **Git & GitHub** – Version control and collaboration.

---

## System Architecture

The system follows a **client-server architecture**:

1. **Frontend (React)**: Interacts with users and sends API requests.
2. **Backend (Node.js & Express)**: Handles requests, processes business logic, and communicates with the database.
3. **Database (MongoDB)**: Stores all intern, HR, and admin data securely.
4. **External APIs**: Twilio/Meta API for messaging and notifications.

**Diagram:**

```
[User] ---> [React Frontend] ---> [Express Backend] ---> [MongoDB Database]
                        |
                        ---> [Twilio/Meta API for WhatsApp]
```

---

## Setup and Installation

### Prerequisites

* Node.js (v18+)
* MongoDB Atlas or local instance
* NPM or Yarn
* Git

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/your-repo/graphura-ims.git
cd graphura-ims
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Setup environment variables**
   Create a `.env` file in the backend folder:

```
PORT=8000
MONGODB_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
TWILIO_ACCOUNT_SID=<your_twilio_sid>
TWILIO_AUTH_TOKEN=<your_twilio_token>
TWILIO_PHONE_NUMBER=<your_twilio_number>
```

4. **Run the backend server**

```bash
npm run dev
```

5. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

6. **Run the frontend**

```bash
npm start
```

7. Open your browser at `http://localhost:3000` to see the application.

---

## How to Use

1. Admin/HR logs in using assigned credentials.
2. Admin can add new interns, assign tasks, and generate reports.
3. HR can track intern performance and communicate important updates.
4. Interns can view tasks, submit reports, and receive notifications.

---

## Team Members

* **Sameer Singh** – Frontend & Backend Integration
* **[Member 2]** – Backend & Database Design
* **[Member 3]** – Frontend Development & UI/UX
* **[Member 4]** – API Integration & Notifications
* **[Member 5]** – Testing & Documentation

---

## Contribution Guidelines

1. Fork the repository and create a new branch.
2. Write clean, readable, and well-documented code.
3. Commit changes with proper messages.
4. Create a pull request for review before merging.
5. Report bugs or issues in the GitHub issues tab.

---

## Future Enhancements

* Mobile app version of IMS.
* Advanced analytics dashboard with charts.
* Multi-language support.
* AI-powered intern performance prediction.
* Integration with Google Calendar for task scheduling.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
