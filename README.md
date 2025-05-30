

# 📱About LongDrome
 Version 1.0 - Final Project For Algorithms - SE2231 - Developed by A. Legayada
### Face Upon an Enemy that Cannot Be Killed! You can only Defend yourself and Negotiate!



This project runs on NextJS and is a browser based game that relies on ShadCN and TailwindCSS. You're facing against an immortal entity that cannot be killed, it has secrets and you need to understand them. Go through color blocks and defend yourself against a foe who can hit YOU, but you CANNOT hit it. A turn based combat that focuses on 'talking' and pattern identification. Can you prove how good you are at the patterns?

###    ⚙️ Releases: 
**May 2025 -**
[untested_release_v.1.0](https://github.com/itsantonle/LongDrome_Game/releases/tag/untested-release-1.0)

###    🖥 Live Deployments: 
[Vercel - https://long-drome-game.vercel.app/](https://long-drome-game.vercel.app/)

<hr/>

#    📔Table of Contents
## 🕹️ Features
- [🎲 Palindrome Color Selection](#palindrome-color-selection)
- [🖼️ Different Locations](#different-locations)
- [❤️‍🩹 Amiability Bar](#amiability-bar)
- [🖱️ Interactive Action Buttons](#interactive-action-buttons)
- [📱 Responsive Design](#responsive-design)
- [🌗 Light/Dark Mode](#lightdark-mode)

## 📖 Game Mechanics
- [💡 Utilizing Manacher's Algorithm](#utilizing-manachers-algorithm)
  - [1️⃣ Handling Edge Cases](#handling-edge-cases)
  - [2️⃣ Transforming the Input Array](#transforming-the-input-array)
  - [3️⃣ Initializing Helper Arrays and Variables](#initializing-helper-arrays-and-variables)
  - [4️⃣ Manacher’s Algorithm Execution](#manachers-algorithm-execution)
  - [5️⃣ Finding the Longest Palindrome](#finding-the-longest-palindrome)
  - [6️⃣ Converting Back to Original Indices](#converting-back-to-original-indices)

## 🎮 Playing the Game
- [How to Play](#how-to-play)
- [Deployment](#deployment)

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

## Responsive Design
Playing on Mobile or on Laptop screens? No problem. 

![longdrome responseive](https://github.com/user-attachments/assets/8f16ab77-b8b8-4fda-a5f6-73e13d0f673b)

## Light / Dark Mode with Next/Themes
Play in Dark or Light Mode

## Utilization of Manacher's Algorithm
The Game Mechanics use the famous Manacher Algorithm that finds the longest palindromic strings in linear O(n) time!
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

**right**: The right boundary of the palindrome that extends the farthest.

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

5. Finding the Longest Palindrome
Loop through P[i] to find the maximum palindrome length and its center.

6. Converting Back to Original Indices
The actual start index in the original array is computed as: Math.floor((centerIndex - maxLen) / 2)

This accounts for the extra null elements.

# Playing the Game

### Deployed on <SET DEPLOYMENT HERE >

# Contribution

Contributions to the LongDrome Game is welcome! It's small scale for now but can be more complex! Fork this repository and submit a PR to contribute

# License

This Project is licensed under the <a href="LICENSE"> MIT LICENSE </a>
