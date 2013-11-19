
// This file contains all the text said by the butler

var strTable = {
	// Greeting text for players who enter the level.
	// Custom greetings are displayed after this text, inside single quotes.
	strangerGreetingOwnerBad: "Hello.",	// error case - unknown owner, should never happen
	strangerGreeting:"Hello, $pc. This is $owner's house.", 
	strangerHighNumberVisits: " You must really like me, huh?", // currently > 10
	strangerMediumNumberVisits: " You've visited a lot today.", // > 3
	strangerLowNumberVisits: " Good to see you again.", // > 1
	visitorCustom: "$owner told me to say ", //Custom greeting added in quotes after this. 
	ownerGreeting: "Welcome home.",
	ownerAwayTime: " You haven't been home for $time_away days.", // > 2
	ownerAwayTimeLong: " I must admit I feel slightly neglected.", // > 10
	ownerNumVisitors: " $visitors people have stopped by today.",
	ownerMessagesAndPackages: " $pc left you $num_messages $messages and $num_packages $packages.",
	ownerSingleMessager: " $pc left you $num_messages $messages.",
	ownerMultipleMessagers:" You have $num_messages_today recent $messages_recent, and $num_older_messages older $messages_older.",
	ownerPackagesAfterMessages: " And I have $num_packages $packages for you.",
	ownerMessages: " I have $num_messages $messages for you.",
	ownerPackages: " I have $num_packages $packages for you.",
	ownerMessagesPackagesNew: " I have $num_messages $messages for you, and $num_packages $packages.",
	ownerMail: "You have mail.",
	ownerMailAlso: " Also, you have mail.",
	ownerPopular:  " You seem to be very popular today.", // > 3 messages
	ownerGenerous: " Your friends have been very generous today.", // > 3 packages
	//friendGreetingWithCustom: "Welcome, $pc. $owner says ",
	friendGreeting: "Welcome, $pc.",
	friendTimeAway: " You haven't been here in $param days.",
	friendHighNumberVisitsOwnerAway: " You must be really desperate to see $owner. Is there any way I can help you?", // > 10
	friendHighNumberVisitsOwnerHome: " You seem to be visiting quite often. Perhaps you should think about expanding your social circle.", // > 10
	friendMediumNumberVisitsOwnerAway: " I'm sorry, but $owner still isn't here.", // > 3
	friendMediumNumberVisitsOwnerHome: " You've been here a lot today, but I'm sure $owner will be glad to see you.",
	friendLowNumberVisitsOwnerAway: " I'm sure $owner will be sorry to have missed you.",
	friendLowNumberVisitsOwnerHome: " I'm sure $owner will be glad to see you.",
	
	greetingNextPlayer: " I'm going to say hello to $pc now. Please click on me if you need me later.",
	greetingPleaseWait: "I'll be with you in a moment, $pc.",
	
	greetingNoResponse: "Oh, well. I'll be around if you need me.",
	
	ownerSuggestPackages: "Would you like your packages now?",
	ownerSuggestMessages: "Would you like to see your messages?",
	ownerSuggestVisitors: "Would you like me to tell you about today's visitors?",
	ownerNoSuggestions: " Please click on me if you need anything.",
	
	visitorOwnerNotHome: "Would you like to leave a message?", // no longer in use
	visitorOwnerHome: " Please click on me if you need anything.", // being used in all cases when a visitor arrives
	
	// Used when a player exits the house.
	greetingNoGreeting: "Hi again, $pc.",
	
	// When a player leaves:
	goodbyeList: ["Goodbye $pc.", "See you later $pc.", "Bye $pc."],  
	visitorLeftTellOwner: "$pc just left.",
	
	
	// Responses to clicking on butler:
	normalClickResponseList: ["Hello, how can I help you?", "Bonjour! What shall I do for you?", "At your service!", "Greetings! How can I be of service?"],
	somewhatAnnoyedClickResponseList: ["Hey, that tickles!", "What?", "Stop it!", "Go poke somebody else.", "Hey!", "Stop touching me!"],
	reallyAnnoyedClickResponseList: ["Quit poking me!", "HEY! Stop that!", "Go squeeze a chicken or something.", "That hurts!", "Ow."],
	reallyReallyAnnoyedClickResponseList: ["STOP IT!", "WHY ARE YOU DOING THIS?", "QUIT IT!", ":-(   :-(   :-(   :-(   :-("],
	clickHelpAddition: " You can type 'help' for hints about what I can do!", // added to click response the first time.
	
	// Tell the player we are opening an IM window
	openIM: "I've sent you an IM. Check your chat windows!",
	
	// Initial help text:
	helpIntro: "What would you like help with? ",
	
	helpOptionsOther: "Commands: 'come here' (c), 'go away' (g), 'step back' (s), 'dance' (d), 'jump' (j), or 'zombie' (z).",
	//helpOptionsOwnerHome: "Options: 'change' (c), 'come here' (h), 'go away' (a), 'step away' (s), 'dance' (d), 'jump' (j), 'zombie' (z) or 'q' to quit help.",
	helpOptionsOwnerAway: "Commands: 'tell' (t), 'announce' (a), 'who' (w), 'quit' (q), 'resume' (r), 'dance' (d), 'jump' (j), or 'zombie' (z).", 
	
	// Help text for simplified butler:
	helpSummon:" Say 'come here' or 'c' any time you need me.",
	helpGo:" Say 'go away' or 'g' again if you want me to go further.",
	helpStep:"I am stepping back. I will do this any time you say 'step back' or 's'.",
	helpStepFail: " If I can, I will step backwards when you say 'step back' or 's'. Wait a second and then try again.",
	helpDance: "I am dancing. Just say 'dance' or 'd' and I will show you my moves.",
	helpDanceNoPrefix: "Just say 'dance' or 'd' and I will show you my moves.",
	helpDanceFail: " If I'm not doing something else, I will show you my moves when you say 'dance' or 'd'. Try again in a little while.",
	helpJump: "Boing! When you say 'jump' (or 'j'), I jump.",
	helpJumpFail: "If I can, I will jump when you say 'jump' (or 'j'). But I can't right now.",
	helpZombie: "For some reason, when you say 'zombie' or 'z', I get a strange craving for brains.",
	
	helpTellOwner:"When you are away from home, you can IM 'tell him', 'tell her', or 'tell them' followed by a message and I will say the message to the most recent visitor.",
	helpAnnounce: "When you are away from home, you can IM 'announce' followed by a message and I will say the message to everybody on the street.",
	helpWho: "When you are away from home, you can IM 'who' and I will tell you who is on your street.",
	helpTellOther:"I'm sorry, I don't know what you're asking me.",
	helpUnknown:"I'm very sorry, but I can't help you.",
	helpStop: "If you say quit after I tell you about a visitor, I will stop telling you when visitors arrive.",
	helpResume: "If you say resume when I have stopped sending you IMs about visitors, I will start sending IMs again.",
	
	// "far commands" are things the owner can tell the butler to do when in a different location from 
	// the butler (such as "tell him hi"
	farCommandNotOwner:"I'm sorry, you're too far away. I can't hear you properly! Why don't you come to $location?",
	farCommandFailOwner: "I'm sorry, you're too far away. I can't hear you properly! Why don't you come to your home street?",
	farCommandTellSuccess: "I'm on my way.",
	farCommandTellFail: "I'm sorry, there is nobody here any more.",
	farCommandTellNoMessage: "I'm sorry, did you give me a message? I couldn't quite hear it. (Say 'help' if you're confused.)",
	farCommandName: "What should my name be?",
	farCommandDanceSuccess: "I am dancing.",
	farCommandFasterSuccess: ["Zoom zoom!", "I think I'm flying!", "Wheeee", "Hyper speed!"],
	farCommandDanceFail: "Sorry, I'm too busy to dance right now.",
	farCommandJumpSuccess: "Boing! ",
	farCommandBad: "I can't do that for you unless you come to $location.",
	
	farCommandGenericFail: "Sorry, I'm busy right now.",
	
	notificationsOff: "Ok, I'll stop IMing you when visitors arrive. Say 'resume' (r) if you want me to start again.",
	notificationsOn: "Ok, I'll IM you when a visitor arrives and you're away. Say 'quit' (q) if you want me to stop doing that.",
	
	fasterFall: ["I'm so dizzy.", "Fall down, go boom.", "Ouch.", "Ooof."],
	
	// Text for "teach" commands
	teachInfoWhat: "What info would you like to teach me?",
	teachGreetingWhat: "What's the greeting?",
	teachWhat: "What would you like to teach me? (Options: greeting for owner, greeting for friends, greeting for strangers, idle comment, info)",
	teachOwnerSuccess: "Ok, I will say $owner_greeting to you.",
	teachFriendSuccess: "Ok, I will say $friend_greeting to your friends.",
	teachStrangerSuccess: "Ok, I will say $stranger_greeting to strangers.",
	teachIdleSuccess: "Ok, I will say $idle_comment when I'm bored.",
	teachInfoSuccess: "Ok, I will tell visitors $info",
	
	infoDialogLabel: "What would you like to tell visitors?",
	
	changeWhat: "What would you like to change? (head, face, collar, body, close arm, far arm, close leg, far leg)",
	
	// When the butler makes a suggestion, it waits for a y/n response.
	// This first message would happen if the butler's data about what suggestion it is waiting for is bad
	suggestionUnknownResponse: "I'm sorry, I've lost track of what I'm doing", 
	suggestionResponseNo: "Ok. Click on me if you need anything.",
	suggestionResponseBad: "I'm sorry, I didn't catch that. Do you need help?",
	
	// Multi-stage command and/or suggestion responses:
	helpQuit:  "Oh, you don't want help? Ok.",
	otherQuit: "Oh, you don't want to do that? Ok.",
	packageNo: "Oh, you're not leaving a package? Ok.",
	messageNo: "Oh, you're not leaving a message? Ok.",
	messageYes: "What message would you like to leave?",
	messageFail: "Sorry, I can't remember any more messages.",
	messageBad: "You're not making sense.",
	yesNoBad: "I don't understand. Yes or no?",
	visitorGiftTooltip: "Leave a gift for your visitors. Current gift: $param.",
	visitorGiftPrevious: "Right now I have $param for visitors, which you will have to take back if you give me something new. ", 
	visitorGiftSame: "I already have $param. ",
	visitorGiftNoPrevious: "If you give me something, I will hand it out to your visitors. ",
	visitorGiftConfirmPlural: "Do you want me to take these $param?",
	visitorGiftConfirm: "Do you want me to take this $param?",
	visitorGiftFail: "But you don't have space to carry it!",
	visitorGiftNo: "Oh, you don't want me to take that? Ok.",
	visitorGiftYes: "Ok, I'll just take that from you.",
	visitorGiftAccept: "Thanks! I'll give this to the next visitor I see.",
	visitorGiftAcceptPlural: "Thanks! I'll give these to visitors.",
	packageGivePlural: "Do you want to give these $item to $owner?",
	packageGiveSingle: "Do you want to give this $item to $owner?",
	packageFail: "Sorry, I can't carry any more packages.",
	packageTypeFail: "Sorry, I'm not equipped to carry that.",
	packageSuccess: "Ok. What would you like me to tell $owner?",
	packageConfirm: "I will make sure $owner gets this!",
	
	// Used when two people try to leave messages or packages at the same time.
	interactFail: "The Butler is talking to somebody else right now.",
	
	// Other command responses:
	helpWithThatResponse: "No.",
	quitResponse: "Oh, you don't want me to do that? Ok.", // applies to 'visit', 'come here'
	messageResponse: "What is your message?",
	messageSuccess: "Thanks! I will let $owner know.",
	packageResponse: "Please drag the item to me.",
	nameResponse: "My name is $butler.",
	nameWhat: "Yes, what would you like to name me?",
	nameSuccess:  ["Delightful. From now on, I shall be known as $butler.", "A wise choice, if I may say so. I am now called $butler.", "$butler it shall be. That is, until you decide otherwise...", "I've always liked the name $butler. And now, it is mine!"],
	nameShortened: ["Terribly sorry, but I can only remember $butler.", "Unfortunately, I can only recall $butler.", "$butler is all I have the room left for, I’m afraid.", "My apologies. $butler is all the letters I have room for!"],
	visitOwner: "You can't visit yourself!",
	debugOn: "I will say debug info", // admin only command
	debugOff: "I will stop saying debug info", // admin only
	stepFail: "Sorry, I can't step back right now.",
	fasterFailList: ["Sorry, I can't do this any faster.", "I could if I was dancing...", "I don't understand what you want from me.", "Zoom zoom.", "I'm too dizzy"],
	thanksResponse: "You're welcome",
	infoNoneOwner: "I don't know any info. What info would you like to teach me?",
	infoNoneOther: "I'm sorry, but $owner hasn't taught me any info.",
	jumpFail: "I don't feel like jumping right now.",
	hiResponse: "Hi.",
	zorkResponseList: ["You are in a maze of twisty little passages, all alike.", "It is pitch black. You are likely to be eaten by a grue.", "This space intentionally left blank.", "You are standing in an open field west of a white house, with a boarded front door. There is a mailbox here."],
	unknownResponse: ["I'm sorry, I can't help you with that.", "I'm sorry, I don't know what you're asking me", 
	"I'm very sorry, but I don't understand what you are saying.", "Excuse me? I'm not sure I understand that.", 
	"Oh, I think I must be confused. Try again?", "Well, my stuffing must be loose. What did you need again?", 
	"Sorry? I think I may have misunderstood what you just said.", "Hrm. I don't think that's something I can help you with.", "I'm not sure I understood you. Perhaps I need a nap?"],
	
	dickResponse: "I prefer to be called Richard",
	swearResponseList: ["I'm sorry, this cotton in my ears. I can't seem to understand you.", "Thinking about that makes me laugh, but don't tell anyone", "What what whaaaaat?!", "When I first saw that phrase, I liked it on Facebook, but now I don't care."],
	
	whyResponse: "Why not?",
	didYouDoItResponse: "It was the cook, in the library. I swear!",
	batCave: "I believe you can find one in Kajuu.",
	
	
	afkResponse: "Talk to me later, when you're less busy.",
	
	summonSucceed: "I'm on my way. ",
	summonFail: "Oh, sorry. I can't right now.",
	alreadyDancing: "I'm dancing!",
	danceFail: "Not right now.",
	goAwayFail: "I can't right now.",
	goAwaySucceed: "Ok, I'm walking away.",
	
	alreadyDoingIt: "I already am!",
	waitASec: "Give me a second.",
	
	clickSummon: "I'm coming.",
	talkToComing: "I'm on my way.",
	
	
	happyBirthday0: "Boss! Boss! Happy Birthday!",
	happyBirthday1: "You were imagined in the world of Ur exactly $param years ago.",
	happyBirthday2: "I must apologize to your glitchiness. I neglected to get you a birthday present. I hope madamsir will forgive me.",
	
	// Escorting player to owner or house:
	visitHouse: "I will take you to the house.",
	visitOwner: "I will take you to $owner.",
	visitSucceed: "Here you are. Have a good day.",
	visitOwnerWentInside: "Looks like $owner just went inside. I'll take you to the house instead.",
	visitOwnerWentOutside: "Looks like $owner just left the house. I'll take you to them.",
	visitOwnerGone: "Uh, $owner just left. Sorry about that!",
	visitWaitForPlayer: "This way, please.",
	visitFail: "Sorry, I seem to have lost track of where I'm going.",
	visitOwnerNotHome: "I'm sorry. $owner isn't home right now. Would you like me to take a message?",
	visitNoCanDo: "I can't take you right now, sorry.",
	
	// Info for owner about visitors:
	visitorNumTimes: "$pc visited $param times",
	visitorOnce: "$pc visited once",
	visitorSeveralVisits: "$pc must really like you. ", // > 3
	visitorManyVisits:"I think $pc really likes talking to me. ", // > 7
	visitorVeryManyVisits: "I'm a little worried about $pc. Maybe you should introduce $pc to some other people? ", // > 11
	visitorExcessiveVisits: "$pc seems kind of obsessive. Should we stage an intervention? ", // > 17 
	visitorNone: "Nobody has visited lately.",
	
	visitorsMany: "There were a lot of visitors, I'll IM you the list.",
	visitorsIntro: "Since the last time you asked me, the following people have visited your street:",
	
	visitorsTooMany: " I think there were more, but that's all I can remember.",
	
	visitorNotifyOwnerHere: "$pc is on your Home Street.",
	visitorNotifyOwnerLeft: "$pc just left.",
	
	visitorSpeechReport: "$pc said '$param'",
	visitorSpeechNotification: "Just to make you aware, I report everything said on this street to $owner.",
	
	speechNotificationsOn: "I will tell you everything your visitors say when you're not here.",
	speechNotificationsOff: "I will not tell you what your visitors say.",
	
	// Giving gifts to visitors:
	 giftItem: "Here is your $param from $owner. I hope you enjoy it!",
	 giftItemFail: "You don't have space to carry this. Come talk to me after you make some room.",
	 giftItemAnnounce: "I have a gift for you from $owner. Come talk to me if you want it.",
	 giftTooltip: "The Butler has a gift for you from $owner. It's $param.",
	 
	 // Giving packages to the owner:
	 packagesNone: "I have no packages for you.",
	 packagesIntro: "Here are your packages: ",
	 packagesStart: "$pc left you ",
	 messageFromGiver: " and told me to tell you: $message_text ($message_time).",
	 packageNoMessage: " but didn't leave a message ($param).",
	 packagesEnd: "That's all I have for you.",
	 packageNoSpace: "Oh, I'm sorry. You don't have room to carry this. Come talk to me again when you have some space.",
	 packageNoSpaceBag: "Oh, I'm sorry. You'll need a slot in your pack (not in a bag) to carry this. Come talk to me again when you have a free slot.",
	 
	 packagesBroken: "Oh, I have $param, but I don't remember who gave it to me. It must be for you!",
	 packagesBrokenNoSpace:  "I have something that I don't remember anything about. It must be for you! But, you don't have space to carry it. I'll give it to you some other time.",
	 packagesBrokenNoSpaceBag: "I have something that I don't remember anything about. It must be for you! But, you need an empty slot in your pack (not in a bag) to carry it. I'll give it to you some other time when you have space.",
	 
	 messagesStart: ["Yes, yes, let me get those for you!", "Alright, let's take a look!", "Certainly, let me retrieve them!"], 
	 
	 // Giving messages to the owner:
	 messagesNone: "I have no messages for you.",
	 messagesGive: "$pc asked me to tell you: $message_text ($message_time). ",
	
	
	 // Telling players messages from owner:
	 tellMessage: "$pc, $owner just told me to say '$speech' to you.",
	 announceMessage: "$speech",
	 whoMessage: "People on your home street right now: $param",
	 whoMessageNone: "There is nobody on your home street right now.",
	 confirmTell: "Ok, I said \"$param\" in local chat.",
	 confirmAnnounce: "Ok, I announced \"$param\".",
	 
	 // Butler moving away or stepping back from player:
	 moveAwayStuck: "I'm sorry, $pc. I don't have space to move away.",
	 stepAwayList: ["Sorry!", "Excuse me.", "Pardon.", "I'll get out of your way."],
	 stepAwayStuck: "Excuse me, $pc. I seem to be boxed in here.",
	
	 chatFail: "Sorry, I'm talking to somebody else right now.",
	 chatFailTooltip: "The Butler is talking to somebody else right now.",
	
	 defaultIdleComment: ["Lovely weather today.", "I like it here.", "I can't decide which Giant is my favorite.", "Do dee da da, shaba do dee da da dee da doo", "Oops, my stuffing is all bunched up.", "Yaawn.", "I'm a butler and this is crazy...", ":-) :-) :-)", "I say, the players in this game are lovely.", "You are awesome!", "Today is the best day ever!"],
	 
	 zilloweenIdleComment: "Happy Zilloween!",
	 
	 setPostConfirm: "Are you sure you want to set my assigned post to where you are standing?",

	 addFriendComment: "Glitch is more fun with friends: <a href=\"event:external|"+config.web_root+"/invites/\">Invite some now!</a>",
	 buildTowerComment: "You know what would look great cultivated here? A tower!",
	
	hints: 'Here are some helpful resources for you: <a href="event:external|http://www.glitch.com/encyclopedia/">Encyclopedia</a>, <a href="event:external|http://www.glitch.com/forum/">Forums</a>, <a href="event:external|http://www.glitchremote.com/">Glitch Remote</a>, <a href="event:external|http://www.glitch-strategy.com/">Glitch Strategy</a>, <a href="event:external|http://resources.grelca.com/">Glitch Housing Routes & Directory</a>. If that\'s not enough, there are usually friendly people in Global Chat who might be willing to help you.',
	
	infoMode: "If you press 'i' for info mode you can search for '$param' - or any item. Info mode will tell you about the item, and for some things, will show you to the nearest one. Terribly impressive, don't you think?",
	
	here: "Right here!",
	
	joinClubReturn: "You joined the club! Come tell me all about it!",
	
	// Old strings no longer being used: 
	oldCollisionCommentList: [	"Excuse me, $pc.", 
	    	"Excuse me, $pc.",
 	    	"Excuse me, $pc.",
	    	"Excuse me, $pc.",
	    	"Excuse me, $pc.",
	    	"Excuse me, $pc.",
	    	"Enjoying the lovely weather?",
	    	"I do love Blue Sno Cones.",
	    	"How has your day been?",
	    	"It's nice to have company.",
	   ],
};

// Placeholder conversation text for "alphy" personality. Right now, this is all very stupid jokes.
// This text is displayed in the conversation speech bubbles with response buttons to click rather than 
// in the chat or IM window.
var alphy = [
	[ { txt: "So the other day, a piggy walked into a bar.", choices: [{txt:"The only bar I know of is the Hell Bar. So it was a dead piggy?", value:"ok"}] },
	  { txt: "I guess. But it doesn't matter!", choices: [{txt: "Ok, ok. Go on.", value:"ok"}] },
	  { txt: "So the piggy says to the bartender 'I think you set your bar too high!'", choices: [{txt:"How come dead piggies don't come back to life the way Glitchen do?", value:"ok"}] },
	  { txt: "TOO HIGH. The piggy walked into the bar because piggies are SHORT and the bar was TOO HIGH.", choices: [{txt:"Ok, ok, I get it already.", value:"ok"}] },
	  { txt: "Then why aren't you laughing? You have no sense of humour!", choices:[{txt: "I guess not."}] },
	],
	[ { txt: "Why did the chicken cross the road?", choices: [{txt: "I don't know. What's a road?", value: "ok"}] },
	  { txt: "To get to the chicken stick! HA HA HA!", choices: [{txt: "Ha ha?", value: "ok"}] },
	],
	[ { txt: "What did the Glitchmas Yeti say when he found a house with three Patches?", choices: [{txt: "What?", value: "ok"}] }, 
	  { txt: "Hoe, hoe, hoe! LOL!", choices: [{txt: "Very funny.", value:"ok"}] },
	],
	[ { txt: "Why did the bureaucrat cross the road?", choices: [{txt: "Why?", value: "ok"}] },
	  { txt: "Because he had the correct permit, filled out in triplicate. HEE HEE HEE!", choices: [{txt: "Um...", value:"ok"}] },
	],
	[ { txt: "Why did the Glitch not buy a meditation device?", choices: [{txt: "Why not?", value: "ok"}] },
	  { txt: "Because he orb-ready had one. HA HA", choices: [{txt: "Ha. I guess.", value:"ok"}] },
    ],
	[ { txt: "What did the Sparkly in Ajaya Bliss say?", choices: [{txt: "What?", value: "ok"}] },
	  { txt: "Hey! Why's everyone picking on me?!?", choices: [{txt: "Ha ha!", value: "ok"}] },
	],
	[ { txt: "Why should you swap a Bean for a Cubimal if you get the chance?", choices: [{txt: "Why?", value:"ok"}] },
	  { txt: "Because it would be Rube not to.", choices: [{txt: "...Thanks.", value:"ok"}] },
	],
	[ { txt: "What do giant devotees prefer to drink with breakfast?", choices: [{txt: "What?", value:"ok"}] },
	  { txt: "A nice cup of Tii. ROFL!", choices: [{txt: "...lol.", value:"ok"}] },
	],
	[ { txt: "Why do philosophy students study Dirt Piles?", choices: [{txt: "Why?", value:"ok"}] },
	  { txt: "Because Loam is where Descartes is. LOL LOL LOL", choices: [{txt: "I think that's actually the worst joke I've ever heard", value:"ok"}] },
	],
	[ { txt: "Why is the novice chef's food so bad?", choices: [{txt: "Why?", value:"ok"}] },
	  { txt: "He keeps making a Hash of it.", choices: [{txt: "Very funny.", value:"ok"}] },
	], 
	[ { txt: "Why was the Glitch happy to see a ghost?", choices: [{txt: "Why?", value:"ok"}] },
	  { txt: "It raised her spirits. HEE HEE HEE!", choices: [{txt: "Um...", value:"ok"}] },
	],
	[ { txt: "Why did the Glitch refuse to visit Newcot Close?", choices: [{txt:"Why?", value:"ok"}] },
	  {	txt: "He had a fear of Heights. HA HA HA", choices: [{txt:"Ha. I guess.", value:"ok"}] },
	]
	
];

