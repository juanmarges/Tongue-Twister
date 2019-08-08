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

const phrases = [
  'She sells seashells by the seashore',
  'I saw Susie sitting in a shoe shine shop',
  'I scream, you scream, we all scream for ice cream',
  `Round the rough and rugged rock the ragged rascal rudely ran.`,
  `The sixth sick sheik's sixth sheep's sick.`,
  `I thought a thought, But the thought I thought wasn’t the thought I thought I thought. If the thought I thought thought had been the thought thought, I wouldn’t have thought so much.`,
  `Denise sees the fleece, Denise sees the fleas. At least Denise could sneeze. And feed and freeze the fleas.`,
  `Luke Luck likes lakes. Luke’s duck likes lakes. Luke Luck licks lakes. Luke’s duck licks lakes. Duck takes licks in lakes Luke Luck likes. Luke Luck takes licks in lakes duck likes.`,
  `Black background, brown background, Brown background, black background, Background background, black, black, brown, brown.`
];

const clone = (obj) => JSON.parse(JSON.stringify(obj));
/**
 * Dictionary of phrases to be used by Snowman.
 */
class Dictionary {
  /**
   * Build all entries in the dictionary.
   * This dictionary can then be replaced by a payload from an API
   * on a less trivial implementation.
   */
  constructor() {
    this.entries = this.shuffle(clone(phrases));
  }

  /**
   * Retrieve phrases from the dictionary.
   *
   * When a phrase is used, set isUsed flag to true, to avoid the same phrase
   * to be retrieved.
   *
   * @return {string} an unused phrase to be used by Snowman placeholder.
   */
  getPhrase() {
    if (this.entries.length === 0) {
      this.entries = this.shuffle(clone(phrases));
    }
    return this.entries.pop();
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   * @return {Array} shuffled
   */
  shuffle(a) {
    let j; let x; let i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
}
