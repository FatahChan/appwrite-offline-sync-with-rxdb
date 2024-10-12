# Todo App with RxDB, Appwrite, and React

This is a simple Todo application built with React, utilizing RxDB for local data storage and synchronization with Appwrite. The app allows users to add, delete, and manage tasks, with real-time updates, user authentication, and offline capabilities.

## Features

- **Add Tasks**: Users can add new tasks to their todo list.
- **Delete Tasks**: Users can remove tasks from their list.
- **User Authentication**: Users can register and log in to manage their tasks.
- **Real-time Sync**: The app synchronizes data with a remote database using Appwrite and RxDB.
- **Offline Support**: Users can continue to add and manage tasks even when offline. Changes will sync automatically when the connection is restored.
- **Responsive Design**: The app is designed to be responsive and user-friendly.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **RxDB**: A NoSQL database for JavaScript applications that supports real-time data synchronization.
- **Appwrite**: A backend server for web and mobile developers that provides a set of APIs for user authentication, database management, and more.
- **React Query**: A library for fetching, caching, and updating data in React applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- An Appwrite server instance (you can set up your own or use a hosted solution)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Appwrite:

   - Create a new project in your Appwrite console.
   - Set up a database and create a collection for your todos.
   - Configure authentication methods (e.g., email/password).
   - Update the Appwrite endpoint and project ID in your application configuration.

4. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Adding a Task**: Enter a task in the input field and click "Add". The task will be stored locally and synced with Appwrite when online.
- **Deleting a Task**: Click the "Delete" button next to the task you want to remove.
- **User Authentication**: Use the login form to authenticate. You can register a new user by checking the "Register" checkbox.
- **Offline Sync**: The app allows users to add and manage tasks while offline. When the device reconnects to the internet, any changes made while offline will automatically sync with the Appwrite server.

## Folder Structure

```
/src
  ├── /components        # React components
  ├── /context           # Context providers for state management
  ├── /lib               # Utility functions and schemas
  ├── /hooks             # Custom hooks
  ├── /styles            # CSS styles (if any)
  ├── App.tsx           # Main application component
  └── index.tsx         # Entry point of the application
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [RxDB](https://rxdb.info/) for providing a powerful database solution.
- [Appwrite](https://appwrite.io/) for backend services and user authentication.
- [React](https://reactjs.org/) for building user interfaces.
- [React Query](https://tanstack.com/query/) for data fetching and caching.
