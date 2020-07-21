# [Udacity ](https://udacity.com/)  Front End Developer Nanodegree Program.

# Travel App
This project is a travel app that obtains a desired trip location & date from the user, and displays weather and an image of the location using information obtained from external APIs.

 ### Tools:
  HTML, CSS, Vanilla JS, Webpack, Service workers and Jest for testing.


### API's :
- Geonames to get the latitude ,longitude and the country.
- Weatherbit to get the weather description and the low and high temp .
- Pixabay to get a picture for your destination 
### Getting started
you need to clone the project and install all the loaders and plugins.
#### list of all the loaders and plugins you need :
``` 
 $ npm install express 
 $ npm install node 
 $ npm install body-parser 
 $ npm install cors  
 $ npm i webpack webpack-cli 
 $ npm i -D webpack-dev-server 
 $ npm i -D @babel/core @babel/preset-env babel-loader 
 $ npm i -D style-loader node-sass css-loader sass-loader 
 $ npm i -D clean-webpack-plugin 
 $ npm i -D html-webpack-plugin 
 $ npm i -D mini-css-extract-plugin 
 $ npm i -D optimize-css-assets-webpack-plugin terser-webpack-plugin 
 $ npm install workbox-webpack-plugin --save-dev 
 $ npm install dotenv 
 $ npm install --save-dev jest
```
#### To start the project
##### Open 1st terminal 
` $ npm run build-dev `
##### Open 2nd terminal 
``` 
 npm run build-prod 
 npm start 
 ```
##### To run test 
`npm run test`
