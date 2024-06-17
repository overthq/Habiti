# Habiti API

This package contains the code for the API that powers Habiti. It consists of GraphQL types and resolvers, database and cache bindings, as well storage and file upload functions.

## Installation and Setup

From the root directory, run the following commands:

```sh
cd api
yarn
yarn start-redis # Only necessary if Redis isn't running in the background.
yarn dev
```
