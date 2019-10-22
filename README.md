# AngularReactTest
This project exists to figure out how to integrate a certain React component in an existing Angular application.

To get as far as this, the following hacks have been implemented:
* in `node_modules/trafimage-maps/es/components/Menu/MenuItem.js`, replace `transitiondelay` with some number, eg 300
* in `node_modules/trafimage-maps/es/config/appConfig.js`, replace `var env = process && process.env && process.env.REACT_APP_ENV;` with some string
* in `node_modules/trafimage-maps/es/config/instances.js` replace `var env = process && process.env && process.env.REACT_APP_ENV;` with some string (same as above)

You will then most likely get the following error:
```Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.```. This is where I am currently stuck.
