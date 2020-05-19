# Market

Market helps sellers set up an online store with ease, handling store management and deliveries. It also makes it easy for potential buyers to discover stores that they may be interested in.

## Motivation

Online shopping is hard, both for buyers and sellers. Setting up a new online store is difficult and expensive, and getting potential customers to discover your store is very difficult. Likewise, buyers have to create multiple accounts for every store they want to use online, and have to go back to get information on things like new arrivals and items getting back in stock. Market aims to solve this by creating an app where buyers can discover and follow stores and get push notifications, while also having a single account to manage all their online purhases. Stores also get a simple, easy-to use, extendable dashboard to manage orders, products and all other information regarding their store.

## Project Phase

This project is currently in the _pre-launch_ phase, being developed by the [members of the Overt community](https://discord.gg/t6wVzUh) for [Overt](https://overt.dev), a concept that creates open-source software to solve many of the problems we face in the world. You can read more [here](https://medium.com/@koredefashokun/building-the-future-in-the-open-f3ac035fb412), or follow Overt on Twitter [here](https://twitter.com/overt_hq).

## Getting Started

This section will help you get Market up and running in your development environment.

### Prerequisites

Before starting installing, the following are required:

- [Node.js](https://nodejs.org) (version 8 or higher).
- [Yarn](https://yarnpkg.com) (version 1.22 or lower)
- [MongoDB](https://mongodb.com) (database for local development)

### Commands

Note that reading the project-specific docs are crucial to get Market up and running locally.
You can find the READMEs for each of the projects in their respective folders.

To get Market's source code on your machine, run these commands:

```sh
# Clone the repository
git clone https://github.com/overthq/Market.git && cd Market

# Install dependencies
cd api && yarn
cd app && yarn
cd dashboard && yarn

# SERVER-SIDE (Be sure to read the server docs)

# Start MongoDB

# Start the backend server (after including the necessary vars in the server's .env file)
yarn dev:server

# CLIENT-SIDE

# Start the Expo app
yarn dev:app
```

## Contributing

All forms of (positive) contribution are welcome to Market. Be sure to check out the [contribution guidelines](.github/CONTRIBUTING.md) before contributing.

## Tech Stack

Move is a TypeScript-based application. It is built with popular JS libraries/frameworks like React, React Native and Express. Here's what the stack looks like.

- Front-End
  - Mobile App
    - Framework: [React Native](https://facebook.github.io/react-native)
  - Dashboard
    - Library: [React](https://facebook.github.io/react) based on [Create React App](https://facebook.github.io/create-react-app)
- Back-End
  - Framework(s): [Express](https://expressjs.com) and [GraphQL](https://graphql.org)
  - Database: [MongoDB](https://mongodb.com)
  - Hosting: [Heroku](https://heroku.com)


# License

GNU GPLv3 License

# Author

Oluwakorede Fashokun for [Overt](https://overt.dev)
