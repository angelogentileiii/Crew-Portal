# Crew Portal

<p align='center'>
  <img src='https://github.com/angelogentileiii/Crew_Portal/assets/140743863/61ef39f5-65b7-4f8a-81fd-8a33071c0a57) alt='Crew Portal Logo' />
</p>

A mobile application developed in React Native with Express.js, utilizing JWT Tokens for authentication, and PostgreSQL as the database. It serves as a communication platform for film technicians to interact with production companies, facilitating ease in scheduling and providing information about ongoing productions.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Updating Secret Keys](#updating-secret-keys)
  - [PostgreSQL Database](#set-up-the-postgresql-database)
- [Development Server](#run-development-server-expo)
- [Express Server](#run-express-server)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites
Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Installation
1. Clone the repository:
   
   ```bash
   git clone https://github.com/your-username/crew-portal.git
   cd crew-portal

2. Navigate to the client side:
   
   ```bash
   cd client
   ```
   
3. Install dependencies:

   ```bash
   npm install
   ```

4. Navigate to the server side:

    ```bash
    cd server
    ```

5. Install dependencies:

   ```bash
   npm install
   ```

   _Unfortunately, items are separated into two ```package.json``` files, this will be condensed in later iterations_

### Updating Secret Keys

To ensure the security of your Crew Portal application, it's important to update the secret keys with your own information

Follow the steps below to replace the default values with your own secret keys:

1. Create a `.env` file located in the root directory of the project

2. Within this file, add following lines (replacing the placeholders with your information):

    ```env
    PGDATABASE=your_database_name
    PGUSER=your_database_user
    PGPASSWORD=your_database_password
    PGHOST=your_database_host
    
    PORT=your_preferred_port
    
    ACCESS_TOKEN_SECRET=your_access_token_secret_key
    
    REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
    ```

### Set up the PostgreSQL Database:

1. Install Sequelize CLI

    ```bash
    npm install -g sequelize-cli
    ```

    _Make sure you have the Sequelize CLI installed globally_

2. Configure Database Connection
Open the ```db.js``` file located within the ```utils``` directory and update the database configuration based on your PostgreSQL setup (ensure it matches your ```.env``` file)

3. Run Your Migration
Run the migration command to create the tables in your database

    ```bash
    sequelize db:migrate
    ```
    
    _This command will execute the migration files and create the necessary tables in your configured database_


_Please refer to the [sequelize](https://sequelize.org/docs/v6/other-topics/migrations/) documentation for additional information_

   
## Run Development Server (EXPO)

To start the Expo development server and run the app on the Expo simulator:

1. Open your terminal within the ```client``` directory:

    ```bash
    cd client
    npm start
    ```
    
This command will open the Metro Bundler. You can then choose to run the app in an Android/iOS simulator or on your physical device using the Expo Go app and scanning the QR Code displayed.

If you decide to use a simulator, ensure you have the proper dependencies installed on your local machine:
- Information for [iOS](https://docs.expo.dev/workflow/ios-simulator/)
- Information for [Android](https://docs.expo.dev/workflow/android-studio-emulator/)


## Run Express Server
To start the Express server:

1. Navigate to the ```server``` directory:
   
    ```bash
    cd server
    npm run server
    ```
    
This command will launch the server, making it accessible for handling authentication and database operations.

_If you'd like a visualization of your PostgreSQL database, I highly recommend using PSQL. Try [this](https://www.freecodecamp.org/news/manage-postgresql-with-psql/)._


## Technologies Used
- JavaScript
- React Native
- Expo CLI
- Node.js/Express.js
- JSON Web Tokens (for authentication)
- PostgreSQL

  
## Contributions
Contributions welcome! Feel free to open issues or create pull requests.

Utilized/modified open-source work from:
  - AtilaDev (Leandro Favre & Aman Mittal): [useCalendar](https://github.com/AtilaDev-team/useCalendar)

  - Matteo Mazzarolo: [modal datetime picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker)

  - Danish Amin Dar: [native dropdown select list](https://github.com/danish1658/react-native-dropdown-select-list)




## License
This project is licensed under the [MIT License](https://opensource.org/license/mit/).
