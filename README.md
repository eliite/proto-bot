# **Prototype** (Discord bot) by Jacek Strotz
A bot that moderates and manages servers in Discord (using March 2020 API). [defunct]

## About
My first attempt at a Discord moderation bot. Written entirely in JavaScript with the Discord.js library. After working on the first version of this bot 
for a sufficient amount of time, I decided to completely redesign the entire backend. After doing this, I had a great flow of ideas to input into this bot; 
however, became uninterested after Discord changed the method to set up API connections. Therefore, this project is not yet officially abandoned, but essentially 
out of commission. I may return at a later date, setting up a connection to a SQL database which will store user information and give me a direct method of 
communication to the bot itself. This bot uses Discord.js as a library, but the features are all written from scratch. The most unique feature this bot has 
is a canvas for users to draw on, taking inputs and displaying them onto a base canvas where each user in the server can add to. The only issue with this 
feature is that I never implemented a method to save a canvas across a server. Therefore, canvases were the same across all servers. If this bot were ever 
implemented in a large-scale platform, it would be quite dysfunctional. The most important feature taking place in the backend of this bot is the input 
sanitizing. For a better understanding of this, check out the rock-paper-scissors function where inputs are so highly sanitized that the bot will recognize 
nearly anything that resembles one of the three options. The dimensional input of the draw functions should be noted as well. I am proud of this project and 
had a great experience switching from C to JS for a short period of time.

## Extra

This project was a learning experience for my own knowledge of JavaScript. My first languages I reached proficiency in was C++. I began branching out to other
languages, and JavaScript is one of my favorite so far. 
