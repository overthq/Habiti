# Market

Market helps sellers set up an online store with ease, handling store management and deliveries. It also makes it easy for potential buyers to discover stores that they may be interested in.

## Motivation

Setting up an online store is difficult and expensive, and getting potential customers to discover your store is very difficult. Likewise, buyers usually have to create multiple accounts for every store they purchase from, and keep going back to get information on things like new arrivals and back in stock items.

Market aims to solve this by creating an app where buyers can discover and follow stores to get push notifications for store updates, while also having a single account to manage all their online purhases. Stores also get a simple, easy-to use, extendable dashboard to manage orders, products, analytics and all other information regarding their store.

On release, Market will be available in Nigeria only, but will be launched in other countries based on demand.

## Project Phase

This project is currently in the _pre-launch_ phase, being developed by the [members of the Overt community](https://discord.gg/t6wVzUh). [Overt](https://overt.dev) is a concept that creates open-source software to solve many of the problems we face in the world. You can read more [here](https://overt.dev), or follow Overt on Twitter [here](https://twitter.com/overt_hq).

## Getting Started

This section will help you get Market up and running in your development environment.

### Prerequisites

Before starting the installation process, the following are required:

- [Node.js](https://nodejs.org) (version 8 or higher).
- [Yarn](https://yarnpkg.com) (version 1.22)
- [PostgresQL](https://postgresql.com)
- [Docker](https://docker.com)

### Installation and Setup

To get Market's source code on your machine, run these commands:

```sh
# Clone the repository
git clone https://github.com/overthq/Market.git && cd Market

# Install general dependencies
yarn
```

Next, proceed to the following links for more information on how to set each project set up correctly.

- [App](app/README.md#installation-and-setup)
- [Hasura](hasura/README.md#installation-and-setup)
- [Auth](auth/README.md#isntallation-and-setup)
- [Storage](storage/README.md#isntallation-and-setup)

## Contributing

All forms of (positive) contribution are welcome to Market. Be sure to check out the [contribution guidelines](.github/CONTRIBUTING.md) before contributing.

## Tech Stack

Market is a TypeScript-based application. It is built with popular JS libraries/frameworks like React, React Native and Express. Here's what the stack looks like.

- Front-End
	- Framework: [React Native](https://facebook.github.io/react-native)
- Back-End
  - Database: [PostgresQL](https://postgresql.com)
  - Server: [Hasura](https://hasura.io)
  - Caching: [Redis](https://redis.io)
  - Storage: [Cloudinary](https://cloudinary.com)

# License

[GNU GPLv3 License](LICENSE)

# Author

Oluwakorede Fashokun for [Overt](https://overt.dev)
