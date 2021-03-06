# url-shortener - NodeJS / Express / PostgreSQL / Sequelize

Simple URL Shortener.

It features:

* simple URL shortening
* custom aliases
* listing latest and most viewed URLs
* async Sequalize database
* Heroku ready

Try it out on [Heroku](https://heroku-url-shortener.herokuapp.com/)

## Configuring database

For app to run please adjust config variables for database in `src/config/db.js`

Place following content and modify values with your PostgreSQL connection details
You can also your Postgre URL by defining environment variable DATABASE_URL

```
export const HOST = '';
export const DATABASE = '';
export const USER = '';
export const PASSWORD = '';
export const PORT = ;
```

Database will be initiated when running the server.

## Running the project

_For development_

Project will run on http://localhost:3000 but you can change port at `src/index.js`

```
$ npm run dev
```

_To build_

Project will be built into `/dist` folder and you can run it with `nodemon` or `pm2`

```
$ npm run build
```

_Start app_

```
$ npm run start
```
