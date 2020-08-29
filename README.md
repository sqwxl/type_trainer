# Type trainer

## Description

This project intends to emulate the functionality of touch typing training software (i.e. [keybr.com](https://www.keybr.com/)) with added focus on the special characters used in programming.

## Training Method

The training program will initially generate random combinations of words (or word-like combinations of syllables à la keybr.com) and will progressively adapt its output to match the users weaknesses.
The end result will implement some version "[spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition)" :
> Spaced repetition is an evidence-based learning technique that is usually performed with flashcards. Newly introduced and more difficult flashcards are shown more frequently, while older and less difficult flashcards are shown less frequently in order to exploit the psychological spacing effect. The use of spaced repetition has been proven to increase rate of learning.

Essentially, more error prone characters (or character combination) will appear more frequently, while acquired skills will come up less and less as they are mastered.


## User stories (task list)

### General functionalities
- [ ] I can train immediately from the home page
- [ ] I can register an account
- [ ] I can access statistics about my training progress, with or without an account
- [ ] As a visually impaired user, I can navigate and use the app with a screen reader
- [ ] The website is compatible with assistive technologies
- [ ] I can switch between light and dark global color themes
### Trainer functionalities
- [ ] I can see a keyboard that reflects my chosen layout
- [ ] I can see a section with the text I have to type and the character to type is highlighted
- [ ] I can easily read the text (visually & phonetically)
- [ ] When I type a correct character, the following character is highlighted
- [ ] When I type an incorrect character, that character is marked in red and remains highlighted until I type it
- [ ] When I have inputed an incorrect character, but continue on to type a string of correct characters following it, the highlighted letter jumps ahead without me having to correct my error (the error is still recorded)
- [ ] I can choose what type of character set I want to practice (alphabet, lowercase, uppercase, punctuation, numbers, etc)
- [ ] I can provide my own text to use as a training set
- [ ] I can choose a from a selection of fonts for the training interface (i.e. monospace, comic sans for dyslexia, etc.)
- [ ] What I type is reflected on the on-screen keyboard
### Stats
- [ ] I can see a heat map of the keyboard highlighting error-prone keys
- [ ] I can see my average and best WPM
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
