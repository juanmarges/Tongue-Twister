/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const functions = require('firebase-functions');
const {dialogflow, HtmlResponse} = require('actions-on-google');

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = dialogflow({debug: true});

const INSTRUCTIONS = `You will be given a tongue twister for you to say. ` +
  `Simply repeat the given tongue twister as accurately as you can.` +
  `If you can't, say "try again" to repeat the attempt or "next" ` +
  `to try another tongue twister.`;

const PLAY_AGAIN_INSTRUCTIONS = `You can play another or quit?`;

const WELCOME_RESPONSES = [`Welcome back to Tongue Twisters! ` +
  `Let's see how well you can say these tongue twisters! `, 
  `Welcome back to Tongue Twisters! ` +
  `Simply repeat the given tongue twister, and see how well you've done!`, 
  `I'm glad you're back to play! ` +
  `Let's test how twisted your tongue can get!`, `Hey there, ` +
  `you made it! Let's play Tongue Twisters. ` +
  `Simply repeat the given tongue twister and see how well you can say it!`];

const RIGHT_RESPONSES = ['Right on! Good guess.', 'Splendid!',
  'Wonderful! Keep going!', 'Easy peasy lemon squeezy!', 'Easy as pie!'];

const WRONG_RESPONSES = [`Whoops, that letter isn’t in the phrase. Try again!`,
  'Try again!', 'You can do this!', 'Incorrect. Keep on trying!'];

const REVEAL_WORD_RESPONSES = [`Better luck next time!`,
  `Don't give up, keep on trying!`];

const WIN_RESPONSES = ['Congratulations and BRAVO!',
  'You did it! So proud of you!',
  'Well done!', 'I’m happy for you!',
  'This is awesome! You’re awesome! Way to go!'];
/**
 * Pick a random item from an array. This is to make
 * responses more conversational.
 *
 * @param  {array} array representing a list of elements.
 * @return  {string} item from an array.
 */
const randomArrayItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

app.intent('Welcome', (conv) => {
  if (conv.user.last.seen) {
    conv.ask(randomArrayItem(WELCOME_RESPONSES));
  } else {
    conv.ask(`Welcome to Tongue Twister! Let's see how well you can ` +
      `say some of the most popular tongue twisters. ${INSTRUCTIONS}`);
  }
  conv.ask(new HtmlResponse({
    url: `https://${firebaseConfig.projectId}.firebaseapp.com`,
  }));
});

app.intent('Fallback', (conv) => {
  conv.ask(`I don’t understand. Try guessing a letter!`);
  conv.ask(new HtmlResponse());
});

/**
 * Guess a letter or phrase from Snowman.
 *
 * @param  {conv} standard Actions on Google conversation object.
 * @param  {string} letterOrPhrase from A-Z.
 */
app.intent('Guess Letter or Phrase', (conv, {letterOrPhrase}) => {
  conv.ask(`Let's see if ${letterOrPhrase} is there...`);
  conv.ask(new HtmlResponse({
    data: {
      command: 'GUESS',
      letterOrPhrase,
    },
  }));
});

/**
 * Hide or show upper-left corner captions used for testing and debugging.
 * It can be triggered by saying `toggle captions`.
 *
 * @param  {conv} standard Actions on Google conversation object.
 */
app.intent('Toggle Captions', (conv) => {
  conv.ask(`Ok`);
  conv.ask(new HtmlResponse({
    data: {
      command: 'TOGGLE_CAPTIONS',
    },
  }));
});

/**
 * Trigger to re-play the game again at anytime.
 *
 * @param  {conv} standard Actions on Google conversation object.
 */
app.intent('Play Again', (conv) => {
  conv.ask(`Okay, here’s another game!`);
  conv.ask(new HtmlResponse({
    data: {
      command: 'PLAY_AGAIN',
    },
  }));
});

/**
 * Send a random right response back to Google Assistant.
 *
 * @param  {conv} standard Actions on Google conversation object.
 */
app.intent('Right Guess', (conv, {letterOrPhrase}) => {
  conv.ask(`${letterOrPhrase} is right. ${randomArrayItem(RIGHT_RESPONSES)}`);
  conv.ask(new HtmlResponse());
});

/**
 * Send a random wrong response back to Google Assistant.
 *
 * @param  {conv} standard Actions on Google conversation object.
 */
app.intent('Wrong Guess', (conv, {letterOrPhrase}) => {
  conv.ask(`${letterOrPhrase} is wrong. ${randomArrayItem(WRONG_RESPONSES)}`);
  conv.ask(new HtmlResponse());
});

/**
 * Provide standard instructions about the game.
 *
 * @param  {conv} standard Actions on Google conversation object.
 */
app.intent('Instructions', (conv) => {
  conv.ask(`Try guessing a letter that's in the phrase or guessing ` +
  `the phrase itself. Figure out the phrase before the snowman is built to win ` +
  `the game! ${INSTRUCTIONS}`);
  conv.ask(new HtmlResponse());
});

/**
 * Provide a subset of instructions for the game after game is over.
 *
 * @param  {conv} standard Actions on Google conversation object.
 */
app.intent('Play Again Instructions', (conv) => {
  conv.ask(PLAY_AGAIN_INSTRUCTIONS);
  conv.ask(new HtmlResponse());
});

/**
 * Reveal the phrase when player loses the game.
 *
 * @param {conv} standard Actions on Google conversation object.
 * @param {phrase} set by the client.
 */
app.intent('Game Over Reveal Phrase', (conv, {phrase}) => {
  conv.ask(`Sorry, you lost. The phrase is ${phrase}`);
  conv.ask(new HtmlResponse());
});

/**
 * Reveal the phrase when player wins the game.
 *
 * @param {conv} standard Actions on Google conversation object.
 */
app.intent('Game Won', (conv, {phrase}) => {
  conv.ask(`${phrase} phrase is right! ${randomArrayItem(WIN_RESPONSES)}`);
  conv.ask(new HtmlResponse());
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
