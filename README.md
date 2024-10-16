# EasyFormAI: Customizable Form Creation Tool

[Live Demo](https://easy-form-ai.vercel.app/)

EasyFormAI is a versatile SaaS application designed to enable users to create and customize forms with ease. The platform provides a range of themes, backgrounds, and styles to suit various needs. Built with Next.js, TypeScript, and Drizzle ORM, EasyFormAI leverages the Google Gemini API for advanced form functionalities. User authentication is managed by Clerk, ensuring secure access and management.

## Features

EasyFormAI offers the following capabilities:

1. **Customizable Forms**: Create forms with a variety of themes, backgrounds, and styles.
2. **Theme Selection**: Choose from a wide range of themes to match the form's purpose.
3. **Background Options**: Customize the background to enhance the form's appearance.
4. **Styling Options**: Apply different styles to form elements for a personalized look.
5. **Response Management**: View and manage responses in real-time.
6. **Export to Excel**: Export form responses to Excel for further analysis.
7. **Form Sharing**: Share forms with others to gather responses.

## Technology Stack

- **Frontend**: Next.js
- **DataBase**: Drizzle ORM
- **Programming Language**: TypeScript
- **Form Functionality**: Google Gemini API
- **Account Management**: Clerk

## Usage

### Account Management

EasyFormAI uses Clerk for managing user accounts. Users can sign up and log in securely to access their personalized dashboard and manage their form creation tasks.

### Form Creation

To create and customize forms, users can:

1. **Log in to their account.**
2. **Navigate to the form creation section.**
3. **Choose a theme from the available options.**
4. **Select a background to enhance the form's appearance.**
5. **Save the form and generate a shareable link.**

### Response Management

Users can view and manage form responses directly from their dashboard. The responses can be exported to Excel for further analysis and reporting.

## Installation and Setup

To set up the ImageFusion application locally for development purposes, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Namandas/EasyFormAI
2. **Navigate to the project directory:**
   ```bash
   cd EasyFormAI
3. **Install the dependencies:**
   ```bash
   npm i
4. **Set up environment variables:**
   ```bash
    NEXT_PUBLIC_GEMINI_API_KEY=
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_DRIZZLE_DATABASE_URL=
    NEXT_PUBLIC_BASE_URL=http://localhost:3000/
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=

5. **Run the application:**
   ```bash
   npm run dev
6. **Open your browser and navigate to:**
   ```bash
   http://localhost:3000

