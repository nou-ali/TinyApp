# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Homepage"](https://github.com/nou-ali/TinyApp/blob/master/docs/homepage.png)

!["Login page"](https://github.com/nou-ali/TinyApp/blob/master/docs/login-page.png)

!["When user is logged in"](https://github.com/nou-ali/TinyApp/blob/master/docs/logged-in.png)

!["Registration page"](https://github.com/nou-ali/TinyApp/blob/master/docs/register-page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## How To Use

- Visit localhost:8080/ in your browser to access TinyApp.
- Login in to use TinyApp. If you do not have an account, go to localhost:8080/register.
- Once logged in feel free to shorten a URL at localhost:8080/urls/new.
- See your list of shortened URLs at localhost:8080/urls. Edit or delete at your leisure. 