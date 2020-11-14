# Type trainer

## Description

This touch typing software aims has three main modes of operation:
- Guided mode: provides you with an interactive course that progressively introduces new fingers and keys. The level increases once you get 97% or more characters correct, it goes down if you get less than 75. You can also move up and down to the level you desire and can adjust the automatically generated strings to suit your needs
- Practice mode: allows you to perfect your skills by practicing on the text of your choice
- Code mode: this one is for programmers. Paste in any block of code via the settings dialog, and type away!

Features:
- stores your settings and stats in local storage
- light and dark modes
- adjustable text size
- optional non-printing characters
- optional interactive virtual keyboard

## User stories (task list)

- [x] I can train immediately from the home page
- [x] I can see my average and best words per minute
- [x] I can see my average and best success rates
- [x] I can resize the window and the page is responsive
- [x] I can see all components on small screens (min 1024x768) (doesn't really make sens on mobile)
- [x] I can see a keyboard
- [x] The keyboard highlights the keys I am currently pressing (tested on linux)
- [x] I see a toolbar above the text area which gives me access to UI and training settings
- [x] I can see a section with the text I have to type and the character to type is highlighted
- [x] I see a prompt in the text area asking me to click to begin the session
- [x] When I click outside of the page (i.e. lost focus) the training session pauses and I can see that is is paused
- [x] When I finish typing a sentence, a new one appears immediately
- [x] When I type a correct character, the following character is highlighted
- [x] When I type an incorrect character, that character is marked in red and remains highlighted until I type it
- [x] I see a summary of relevant stats (WPM, errors, etc) that updates as I complete sessions
- [x] My training sessions pauses automatically when I am inactive
- [x] I can switch between light and dark global color themes from the toolbar
- [x] I can switch between predefined font sizes from the toolbar
- [x] I can choose what type of character set I want to practice (alphabet, lowercase, uppercase, punctuation, letters)+numbers, etc)
- [x] I can provide my own text to use as a training set
- [x] I can easily read the text (visually & phonetically)
- [ ] When I have inputed an incorrect character, but continue on to type a string of correct characters following it, the highlighted letter jumps ahead without me having to correct my error (the error is still recorded)
- [ ] The website is compatible with assistive technologies
- [ ] I can choose from a selection of fonts for the training interface (i.e. monospace, comic sans for dyslexia, etc.)
- [ ] I can choose a keyboard layout and language
- [ ] I can see a heat map of the keyboard highlighting error-prone keys
- [ ] I can see a graph of my progress over time
- [ ] I can see how much time I've spent training


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
