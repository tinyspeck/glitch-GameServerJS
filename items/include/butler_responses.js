function getResponses() { 

return [

{
     user_string: "LOL",
     butler_response: ["What's so funny?", "Don't laugh at me!", "I'm a butler, not a comedian.", "Who are you laughing at?", "I think I lost my sense of humour."]
},

{
     reg_ex: /how (are|r) (you|u)/i,
     butler_response: ["Fine, thanks for asking!", "I'm alright, though I wouldn't mind a raise.", "Feeling a bit peckish right now.", "Good. Yes, good, good.", "I am well. Always well."]
},


{
     user_string: "knock knock", 
     butler_response: "Yeah ... no."
},


{
     user_string: ":)", 
     butler_response: ":D"
},

//  I'm not sure how to get these characters into a text file
{
     user_string: ":D", 
    // butler_response: "(?´?`)?"
	butler_response: ":)"
},



{
     user_string: ":(", 
     butler_response: "Aw, there there."
},

{
     reg_ex: /^\s*what.*meaning\s*of\s*life\s*?/i,
     butler_response: ["42", "Who knows?", "The meaning of my life is to buttle to the best of my abilities.", "Sorry, I'm not a biologist."]
},

{
     reg_ex: /^\s*(go)?\s*(north|south|east|west)$/i,
     butler_response: ["This isn't a text adventure!", "It's dark here. You get eaten by a grue. Game over."]
},

{ 
     reg_ex: /where them (hoes|hos) at/i,
     butler_response: "Try a gardening vendor."
},

{
     reg_ex: /(wut|whut)/i, 
     butler_response: "Chicken butt."
},

{
    user_string: "xyzzy",
    butler_response: "I'm sorry, but nothing happens."
},

{
     reg_ex: /(I <3 you|<3|I love you|I lobe you)/i, 
     butler_response: ["I love you too.", "Awww, thanks.", ":D"]
},

{
     reg_ex: /Too bad/i, 
     butler_response: "So sad."
},

{
     reg_ex: /'sup/i, 
     butler_response: "nuthin, honey"
},

{
     user_string: "greetings", 
     butler_response: "salutations!"
},

{
     user_string: "salutations", 
     butler_response: "greetings!"
},

{
     reg_ex: /(aww|you're.*cute|your.*cute|you are.*cute|cutie|ur.*cute|u r.*cute)/i, 
     butler_response: "yeah, I'm pretty cute."
},

{
     user_string: "Potato", 
     butler_response: "Potahto"
},

{
     user_string: "Tomato", 
     butler_response: "Tomahto. Let's call the whole thing off."
},

{
     user_string: "Inconceivable!", 
     butler_response: "You keep using that word. I do not think it means what you think it means."
},

{
     reg_ex: /(\bquiet\b|\bsilence\b)/i, 
     butler_response: "..."
},

// Can't do this next one: quit is an actual command
/*{ 
     user_string: "quit",
     butler_response: "No, I like it here."
},*/

{ 
     reg_ex: /love me/i,
     butler_response: ["Are you sure that's allowed?", "<3"]
},

{
     reg_ex: /why am I here/i,
     butler_response: ["Once upon a time, there were 11 giants, and they imagined a world...", "When a mommy and a daddy love each other very much...", "I don't know. Why are you here?"]
}, 

{ 
    reg_ex: /who\s+let\s+the\s+dogs\s+out/i,
    butler_response: "Wasn't me!"
},

{
    reg_ex: /who.*your daddy/i,
    butler_response: "Sadly, I don't have a daddy."
},


{
    reg_ex: /what.*your\s+(favorite|favourite)\s+(color|colour)/,
    butler_response: ["Exactly the color of your hair, except more Mabbish.", "The color of my left arm.", "Sparkly!", "Rainbow."]
},

{ 
	user_string: "i missed you",
	butler_response: "I missed you too."
},

{ 
	reg_ex: /the cake is a lie/i,
	butler_response: "No, it's delicious and moist."
},

{
	reg_ex: /why not/i,
	butler_response: ["Because.", "I don't know.", "You tell me.", "You know why not."]
},

{
	reg_ex: /(hug|hugs)\b/i,
	butler_response: ["I'm not equipped to hug :(", "I wish I could hug you."]
},

{
	reg_ex: /(you|u|ur).*(no|not|aren't).*(fun|clever|bright|smart)/i,
	butler_response: ["I'm sorry. I'll try to do better.", "Well, my head is full of fluff.", "I'm a butler of very little brain."]
},

{
	reg_ex: /(you|u|ur).*(stupid|stoopid|dumb|retarded|idiot)/i,
	butler_response: ["I'm sorry. I'll try to do better.", "Well, my head is full of fluff.", "I'm a butler of very little brain."]
},

{
	user_string: "my number",
	butler_response: "I'll call you, maybe.",
},

{
	reg_ex: /good bye|goodbye|good by|goodby|bye|see you|see u|later/i,
	butler_response: ["Bye!", "See you later.", "Visit again soon.", "Goodbye."]
},

{
	reg_ex: /(are|r) (you|u) a (bot|robot)/i,
	butler_response: ["No, I'm a butler.", "I don't know where you would get that idea.", "Can you teach me how to feel real?", "Number 5 is alive!"],
},

{
	user_string: "sing",
	butler_response: ["Never gonna give you up, never gonna let you down...", "Badger badger badger badger badger badger badger badger MUSHROOM MUSHROOM...", "Oh, I'm too self-conscious to sing.", "I couldn't possibly.", "I'm afraid I'm not very good.", "I don't know any good songs.", "Maybe later.", "Not right now.", "Sorry, my throat is sore."]
},

{
	user_string: "cock",
	butler_response: ["I believe all the chickens are hens."]
}

];
}
