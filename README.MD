# MeldCX Autocomplete Code Assessment

Estimated completion time: 4 hours

Environment requirements:
- Node.js / NPM
- Chrome (we only work in the Chrome browser!)

Assesses:
- HTML
- ES6 Javascript
- SASS / CSS


## Introduction
Welcome to the MeldCX code test! This was designed to assess your web
development chops to see if you'll be a good fit for the team. So get a quiet
space to yourself, and buckle in. It will include a bit of everything, including
HTML, SASS / CSS, ES6 Javascript and, if you've got them, any design skills.
*Thank you for not using any frameworks, as this is a test for pure ES6
Javascript*


---


## The task
The designer has finished up with the designs for the Autocomplete element, and
we need you to develop it. It's a simple input field that, when you've typed a
couple of characters, drops down a list of options for the user to select.

You'll be responsible for writing the [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements)
and styling it. **All the files you need to edit are in the `assets` directory.**


### Designs
The design for the autocomplete element can be found in the `design` directory.


### Functionality
- User can click the drop down arrow and get a full list of people
- User can type to filter the list by their names
- User can use arrow keys to move the drop down selection up and down
- User can press enter on a selection to select the item


### The data
The web server provided already provides you a random set of people data, which
can be access at `localhost:3000/api/v1/people`.


## Image assets
All images needed for the element are supplied in the `assets/images` (with
exemption of the dynamically loaded profile pictures).


### The code
Your code should be written as if it was going live. Feel free to use cutting
edge functionality as we only run on Chrome. **We'll be testing you on your use
and knowledge of ES6 features etc**.

#### Commenting and documentation
All classes and methods should follow the [JSDoc standard](usejsdoc.org). At
MeldCX we use code comments to generate our docs.

#### Linting
We like our code clean. The `.eslintrc` file has been supplied and should be
followed at all times, that way we're all on the same page.


---


## Running the project

### Setting up
Setting up this project is easy! Simply run `npm install` in a terminal in the
projects root directory. Once that's done it's magic, you can build it.


### Building
This project uses Webpack to build the assets, and do funky things like
importing SASS and HTML files into JS (isn't that cool?).

Run `npm run build` to build all the assets to the `dist` directory


### Running your code in the browser
Run `npm start` to run a local webserver, then visit
[localhost:3000](http://localhost:3000) in Chrome to test your code.


---


## Submissions
Send your code as a zipped folder to hello@meldcx.com. **Please do not include
`node_modules` or `dist` in the .zip**

---


## Conclusion
Most of all, have fun! Whilst this is a test, it was designed to be enjoyable
to do. We look forward to seeing your creative solutions!
