# Todo App with RxDB, Appwrite, and React

This is a simple Todo application built with React, utilizing RxDB for local data storage and synchronization with Appwrite. The app allows users to add, delete, and manage tasks, with real-time updates, user authentication, and offline capabilities.

## Features

- **Add Tasks**: Users can add new tasks to their todo list.
- **Delete Tasks**: Users can remove tasks from their list.
- **User Authentication**: Users can register and log in to manage their tasks.
- **Real-time Sync**: The app synchronizes data with a remote database using Appwrite and RxDB.
- **Offline Support**: Users can continue to add and manage tasks even when offline. Changes will sync automatically when the connection is restored.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **RxDB**: A NoSQL database for JavaScript applications that supports real-time data synchronization.
- **Appwrite**: A backend server for web and mobile developers that provides a set of APIs for user authentication, database management, and more.
- **React Query**: A library for fetching, caching, and updating data in React applications.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- An Appwrite server instance (you can set up your own or use a hosted solution)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/FatahChan/appwrite-offline-sync-with-rxdb.git
   cd appwrite-offline-sync-with-rxdb
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Set up Appwrite:

   - Login to appwrite

   ```bash
   pnpm appwrite:login
   ```

   - Init appwrite project

   ```bash
   pnpm appwrite:project:init
   ```

   - Push project setting

   ```bash
   pnpm appwrite:project:push
   ```

   - Open Appwrite console.
   - Add a platform and allow `localhost`
   - Create `.env` file, copy the template, and fill in the missing env variable from `appwrite.json`

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:5137`.

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
