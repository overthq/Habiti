# Market

Market is an open-source mobile-first e-commerce platform that aims to improve the online shopping and store management experience for small to medium-scale retailers in Nigeria.

## Motivation

### For shoppers

The average online shopper usually has to create multiple accounts for each store, and keep going back to get information on new arrivals, product discounts and availability. Market solves this by providing an app where shoppers can purchase products, discover and follow stores, get updates and more, all from a single account.

### For store owners

For most small to medium-scale retailers, setting up an online store is difficult and expensive, and attracting potential customers is even more so. Market solves this by providing an affordable and simple dashboard to manage orders, inventory, analytics and other store-related information. It also helps merchants advertise both their store and products, making it easier for newer stores to gain traction.

## Getting Started

This section will help you get Market up and running in your development environment.

### Prerequisites

Before starting the installation process, the following are required:

- [Node.js](https://nodejs.org) (LTS recommended).
- [Yarn v1](https://yarnpkg.com)
- [PostgresQL](https://postgresql.com)

### Installation and Setup

To clone this repo and install the base dependencies:

```sh
# Clone the repository
git clone https://github.com/overthq/Market.git && cd Market

# Install general dependencies
yarn
```

Next, proceed to the following links for more information on how to set each project set up correctly.

- [App](app/README.md#installation-and-setup)
- [Dashboard](dashboard/README.md#installation-and-setup)
- [API](api/README.md#installation-and-setup)

## Contributing

Contributions are welcome. Be sure to check out the [contribution guidelines](.github/CONTRIBUTING.md) before contributing.

## Tech Stack

Market is a TypeScript-based application. It is built with popular JS libraries/frameworks like React, React Native and Express. Here's what the stack looks like:

- Front-End
  - Framework: [React Native](https://reactnative.dev) and [Expo](https://expo.io)
  - State Management: [Zustand](https://github.com/pmndrs/zustand)
  - GraphQL Client: [urql](https://github.com/urql-graphql/urql)
- Back-End
  - Database: [PostgresQL](https://postgresql.com)
  - Server: [Express](https://expressjs.com), [GraphQL](https://graphql.org) and [Prisma](https://prisma.io)
  - Caching: [Redis](https://redis.io)
  - Storage: [Cloudinary](https://cloudinary.com)

# License

[GNU GPLv3 License](LICENSE)

# Author

Oluwakorede Fashokun for [Overt](https://overt.dev)
