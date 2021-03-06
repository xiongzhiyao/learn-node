import {PostController} from "./controller/PostController";
import {postSigninHandler} from "./controller/post.signin"
import {postRegisterHandler} from "./controller/post.register"
import {postSignInValidator} from "./types/account.signin.validator"
import {regesiterValidator} from "./types/account.register.validator"
import {postPostValidator} from "./types/post.validator"
import {checkJwt} from "./middlewares/checkJwt"

export const Routes = [{
    method: "get",
    route: "/posts",
    controller: PostController,
    middlewares: checkJwt,
    action: "all"
}, {
    method: "get",
    route: "/posts/:id",
    controller: PostController,
    middlewares: checkJwt,
    action: "one"
}, {
    method: "post",
    route: "/posts",
    controller: PostController,
    middlewares: checkJwt,
    validator: postPostValidator,
    action: "save"
}, {
    method: "delete",
    route: "/posts/:id",
    controller: PostController,
    middlewares: checkJwt,
    action: "remove"
}];

export const SignInRoutes = [
  {
    route: '/signin',
    method: 'post',
    handler: postSigninHandler,
    validator: postSignInValidator,
  },
  {
    route: '/register',
    method: 'post',
    handler: postRegisterHandler,
    validator: regesiterValidator,
  }
]