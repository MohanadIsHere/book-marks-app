# Bookmarks App

## Description

A NestJS application for managing users, authentication, bookmarks, and access control.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

You can find the Postman collection with all endpoints here:
[Postman Documentation](https://documenter.getpostman.com/view/37358976/2sB3BKGUAb)

## Features

* User registration and authentication with JWT
* Token revocation and logout functionality
* Role-based access control
* CRUD operations for bookmarks
* Input validation with Zod
* Request rate limiting
* Security headers with Helmet
* HTTP request logging with Morgan

## Deployment

Before deployment, ensure:

* Environment variables are set correctly (e.g., JWT secret, database URL).
* Production build is created.

```bash
$ npm run build
```

Run the production build:

```bash
$ npm run start:prod
```

## License

This project is licensed under the MIT License.
