

# 📱About LongDrome
 Version 1.0 - Final Project For Algorithms - SE2231 - Developed by A. Legayada
### Face Upon an Enemy that Cannot Be Killed! You can only Defend yourself and Negotiate!



This project runs on NextJS and is a browser based game that relies on ShadCN and TailwindCSS. You're facing against an immortal entity that cannot be killed, it has secrets and you need to understand them. Go through color blocks and defend yourself against a foe who can hit YOU, but you CANNOT hit it. A turn based combat that focuses on 'talking' and pattern identification. Can you prove how good you are at the patterns?

###    ⚙️ Releases: 
**May 2025 -**
[untested_release_v.1.0](https://github.com/itsantonle/LongDrome_Game/releases/tag/untested-release-1.0)

**May 2025 (latest)** [untested_release_v1.0.1](https://github.com/itsantonle/LongDrome_Game/releases/tag/untested_release_1.0.1)

###    🖥 Live Deployments: 
[Vercel - https://long-drome-game.vercel.app/](https://long-drome-game.vercel.app/)

<hr/>

### Running the development build

✅ Clone this repository
``bash
git clone https://github.com/itsantonle/LongDrome_Game.git
``

✅ Install dependencies
``bash
npm install
``

✅ Run the developement 
``bash
npm run dev
``



#    📔Table of Contents
## [🕹️ Features](#%EF%B8%8Ffeatures)
- [🎲 Palindrome Color Selection](#palindrome-color-selection)
- [🖼️ Different Locations](#%EF%B8%8Fdifferent-locations)
- [❤️‍🩹 Amiability Bar](#%EF%B8%8Famiabliity-bar)
- [🖱️ Interactive Action Buttons](#%EF%B8%8Fintearctive-action-buttons)
- [📱 Responsive Design](#responsive-design)
- [🌗 Light/Dark Mode](#%EF%B8%8Flight--dark-mode-with-nextthemes)

## 📖 Algorithm Design
- [💡 Utilizing Manacher's Algorithm](#utilization-of-manachers-algorithm)
  - [1️⃣ Handling Edge Cases](#1handling-edge-cases)
  - [2️⃣ Transforming the Input Array](#2-transforming-the-input-array)
  - [3️⃣ Initializing Helper Arrays and Variables](#3-initializing-helper-arrays-and-variables)
  - [4️⃣ Manacher’s Algorithm Execution](#4-using-manachers-algorithm-to-find-palindromes)
  - [5️⃣ Finding the Longest Palindrome](#5-finding-the-longest-palindrome)
  - [6️⃣ Converting Back to Original Indices](#6-converting-back-to-original-indices)
    
- [💡 Generating a Random Palindromic Sequence](#generate-random-sequence)
  - [1️⃣ Turn Count Mechanic](#1-turn-count-mechanic)
  - [2️⃣ Setting Sequence Length Boundaries](#2-setting-sequence-length-boundaries)
  - [3️⃣ Generating a Random Sequence](#3-generating-a-random-sequence)
  - [4️⃣ Creating Hidden Palindrome](#4-creating-hidden-palindrome)


## 🎮 Playing the Game
- [How to Play](#-playing-the-game-1)

## 🤝 Contribution
- [How to Contribute](#how-to-contribute)

## 📜 License
- [MIT License](#license)


<br/>
<hr/>

# 🕹️Features

## 🎲Palindrome Color Selection
Select colors to defend yourself! Each turn you must choose the longest Palindrome or you will take damage!

![image](https://github.com/user-attachments/assets/86f8a211-8de2-47df-9dc3-8827f3c0fb8e)


## 🖼️Different Locations
Different Locations that feature different backdrop and art. You can choose to fight in the temple or go home and recover!

![image](https://github.com/user-attachments/assets/405e72da-a3be-414d-b90b-989e9955e6d6)

## ❤️‍🩹Amiabliity Bar
Improve your relationship with the Guardian by talking and and choosing the correct responses!

![image](https://github.com/user-attachments/assets/6879a5e7-2eab-4eb7-a122-3924a43d98ff)


## 🖱️Intearctive Action Buttons
Use the buttons to navigate and continue with the game! Talk, fight and use Magic!

![image](https://github.com/user-attachments/assets/e73af4c1-329f-4a66-99ea-b2f1b30a6e75)

## 🧑‍🎨Responsive Design
Playing on Mobile or on Laptop screens? No problem. 

![longdrome responseive](https://github.com/user-attachments/assets/8f16ab77-b8b8-4fda-a5f6-73e13d0f673b)

## ☀️Light / Dark Mode with Next/Themes
Play in Dark or Light Mode

## 💡Utilization of Manacher's Algorithm
The Game Mechanics use the famous Manacher Algorithm that finds the longest palindromic strings in linear O(n) time!
```txt
this sections handles the process behind the functions
1. setOptimal palindrome gets from determineOptimalPalindrome(client_helper_utils) - calls from main page, validates palindrome
2. findOptimalPalindrome(game_utils) - error handling and returns sequence to determineOptimalPalindrome, validates manacher, otherwise brute force
3. findLongestPalindromeManachger(palindrome_utils) - base case (probably will never fail)
4. findLongestPalindromeBruteForce(palindrome_utils) - (CAUTIONARY FALLBACK)
```
### 1.Handling Edge Cases
If the array is empty, return { start: 0, length: 0 }.

If the array contains only one element, return { start: 0, length: 1 }.

### 2. Transforming the Input Array
This step modifies the input by inserting null between each element and at the boundaries.

Example: If the input was

```ts
["red", "blue", "red"]
```
it transforms into: 
_Note that in some implementations of Manachers, the '#' is used in the place of 'null_
```ts
["null", "red", "null", "blue", "null", "red", "null"]
```

This ensures that both odd and even-length palindromes are handled **consistently.** 
This due to the fact that Manacher's employes a 'mirroring' technique that operates from a center point and relies on symmetry (Even N means that the center is an x.5 instead of a definite number)

### 3. Initializing Helper Arrays and Variables
**P[i]**: Stores the palindrome radius centered at index i. (longest) 

_Note that radii are used to evaluated the symmetry. Starting at 0 means that the that there is a palindrome of radius 0 (or itsself only) as p[i] is updated as we continue to expand based on symmetry. radius refers to two or n more elements from the center that are symmetrical mirrors of each other_

**Example:**

first transformation with the nulls put in place
```ts
[null, "a", null, "b", null, "a", null]

// below is their follow p[i] values from the initialization

P = [0, 0, 0, 0, 0, 0, 0]

// As manacher expands
P = [0, 1, 0, 2, 0, 1, 0] 
```
**center**: The center of the current longest palindrome.

**right**: The right boundary of the palindrome that extends the farthest.

**Example**

```ts
// initial palindrome
transformed = [null, "a", null, "b", null, "a", null]

// Processing index 3 ("b")
// Expands outward: "a, null, b, null, a" 

P[3] = 2 (radius = 2)
// New center = 3, right = 5
// Note: Doesn't count the nulls before the "a" on index 1 and after "a" on index 5

```


```ts
P = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // All radii start at 0
center = 0
right = 0
```

### 4. Using Manacher’s Algorithm to Find Palindromes

For each position i, check if it’s within the current palindrome (right > i).

If it is, use the mirror value (P[mirror]) to avoid redundant computations.

Otherwise, expand outward from i as long as the transformed elements match.

Updating center and right:

If we find a palindrome that extends beyond right, update center and right.

**Example Expansion Process**
we compare if the left and the right side are symmetrical
thus we have these properties: 
center: 5 radius is 3
let's say we reach green (5)
Expand outward (left=4, right=6) → "null" == "null" 

Expand again (left=3, right=7) → "blue" == "blue" 

Expand again (left=2, right=8) → "null" == "null"
```ts
(null) red (null) blue (null) |[green]| (null) blue (null) red (null)

```

### 5. Finding the Longest Palindrome
Loop through P[i] to find the maximum palindrome length and its center.
After iterating through all indices, we find that:

Max palindrome radius: P[6] = 3

Center index: 6



### 6. Converting Back to Original Indices
The actual start index in the original array is computed as: Math.floor((centerIndex - maxLen) / 2)

This accounts for the extra null elements.

To convert this back to original indices:
```ts
Math.floor((centerIndex - maxLen) / 2)
```
the function returns the starting index and the length of the longest palindrome In 'palidrome-utils' 
["blue", "green", "blue"]
<br/>
<hr/>

## 💡Generate Random Sequence
```txt
this section covers the explaination for the following:
1.genearateNewSequence() (page.tsx) generates new sequence and updates the color sequence state
2.generateRandomSequence (palindrome_utils.ts) the function that is called by generateNewSequence
```
### 1. Turn Count Mechanic
the difficulty of the generated sequence depends on how far the user is in. _The higher the turn count the harder_
the current set up sets this dynamically. 
```ts
const newSequence = generateRandomSequence(5, 12, turnCount)

// code that implements this
  const difficultyFactor = Math.min(5, Math.floor(turnCount / 3))

// this code adds more noise but does SHOULD NOT DISRUPT THE START OR THE END to preserve integrity
  if (difficultyFactor > 2) {
    // Add some similar colors to confuse the player
    for (let i = 0; i < difficultyFactor; i++) {
      const randomIndex = Math.floor(Math.random() * length)
      if (
        randomIndex !== palindromeStart &&
        randomIndex !== palindromeStart + palindromeLength - 1
      ) {
        colors[randomIndex] = colors[Math.floor(Math.random() * length)]
      }
    }
  }
```

### 2. Setting Sequence Length Boundaries
identifies the min/ max length of palindrome COLOR[] sequence

The sequence length starts at minLength but grows with difficulty.A safeguard ensures a minimum of 5 elements.
maxLength is adjusted to allow larger sequences as difficulty rises.
```ts
const min = Math.max(5, minLength + difficultyFactor);
const max = Math.max(min, maxLength + difficultyFactor);

```

### 3. Generating a Random Sequence
```ts
const length = Math.floor(Math.random() * (max - min + 1)) + min;
const colors: string[] = [];
```
The actual sequence length is randomly chosen within the min to max range. An empty array colors is initialized to hold the sequence.

```ts
for (let i = 0; i < length; i++) {
    colors.push(COLORS[Math.floor(Math.random() * COLORS.length)].name);
}
```
A loop fills colors with random names from a predefined COLORS array.

```ts
/// this can be modified at anytime
// Define available colors
export const COLORS = [
  { name: 'black', value: '#000000' },
  { name: 'red', value: '#FF0000' },
  { name: 'blue', value: '#0000FF' },
  { name: 'green', value: '#00FF00' },
  { name: 'yellow', value: '#FFFF00' },
  { name: 'purple', value: '#800080' },
  { name: 'orange', value: '#FFA500' },
  { name: 'white', value: '#FFFFFF' },
]

```

### 4. Creating Hidden Palindrome 
The function ensures the sequence includes at least one palindrome.
The palindrome’s length is dynamically calculated to be between 5 and 7 characters.
A random starting position for the palindrome is selected. These values can be chosen to be dynamic later on.
```ts
const palindromeLength = Math.min(7, Math.max(5, Math.floor(length / 2)));
const palindromeStart = Math.floor(Math.random() * (length - palindromeLength));
```




# 🎮 Playing the Game
![image](https://github.com/user-attachments/assets/4a7b908f-b76e-4866-b8f1-a6a9c2a89e2c)


# 🤝 Contribution

Contributions to the LongDrome Game is welcome! It's small scale for now but can be more complex! Fork this repository and submit a PR to contribute

# 📜 License

This Project is licensed under the <a href="LICENSE"> MIT LICENSE </a>
