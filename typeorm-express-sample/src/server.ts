import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import {Request, Response, NextFunction} from "express";
import {Routes, SignInRoutes} from "./routes";
import { createConnection } from 'typeorm';
import { userInfo } from "os";
import { Account } from "./entity/Account";
import { Post } from "./entity/Post";

console.log("start")
console.log("database url", process.env.DATABASE_URL)

createConnection().then(async connection => {
    // execute migration
    await connection.runMigrations();
    
    console.log("finish migration")

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.set('view engine', 'jade');
    app.get('/', (req, res) => {
      res.render('index');
    });
    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](
            route.route, 
            route.middlewares || [],
            route.validator || [],
            (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    SignInRoutes.forEach(route => {
      (app as any)[route.method](
        route.route, 
        route.validator || [],
        (req: Request, res: Response, next: NextFunction) => {
          route.handler(req, res, next)
            .then(() => next)
            .catch(err => next(err));
        },
      );
    });
    

    // setup express app here
    // ...

    // start express server
    app.listen(process.env.PORT || 3000);

    console.log("Heroku Express server has started on port 3000. Open http://localhost:3000/posts to see results");

}).catch(error => console.log(error));
