var label = "Scion of Purple";
var version = "1330396727";
var name_single = "Scion of Purple";
var name_plural = "Scion of Purple";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["purple_apparition"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function die(){ // defined by purple_apparition
	this.apiDelete();
}

function doIdle(){ // defined by purple_apparition
	switch(randInt(0, 1)) {
		case 0:
			this.setAndBroadcastState('idle1');
			break;
		case 1:
			this.setAndBroadcastState('idle2');
			break;
	}
}

function getInventoryItem(){ // defined by purple_apparition
	if (!this.pc) { 
		return;
	}

	var contents = this.pc.getAllContents();
	if(num_keys(contents)) {
		var item = choose_property(contents);
		return item;
	}
}

function getMysteriousWords(){ // defined by purple_apparition
	var tab = "     "

	this.getInventoryItem();

	var quote_widths = [
		null,
		300,
		null,
		null,
		275,
		280,
		null,
		300,
		null,
		null,
		null,
		null,
		null,
		260,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null
	];

	var quotes = [
		"Tes yeux, où rien ne se révèle\nDe doux ni d’amer,\nSont deux bijoux froids où se mêle\nL’or avec le fer.",

		"A lost battalion of platonic conversationalists jumping\n"+tab+"down the stoops off fire escapes off windowsills\n"
		+tab+"off Empire State out of the moon.",

		"Everything is dead, and the dead are everywhere.\nMen are alone, and all around them is silence—that is the earth!",

		"For forty years I have been listening to your words there through a crack under the floor. I have invented them myself. After all, there was nothing else I could invent.",

		"Le Prince d’Aquitaine à la tour abolie.\nThese fragments I have shored against my ruins.",

		"I'm with you in Rockland\n"+tab+
		"where fifty more shocks will never return your\n"+tab+
		"soul to its body again from its pilgrimage to a\n"+tab+
		"cross in the void",

		"This could be the start of a beautiful friendship.",

		"\"I am withdrawing to write a book.\"\n\"I am withdrawing to construct a labyrinth.\"\nEveryone imagined two works;\nto no one did it occur that the book and the labyrinth\nwere the same thing.",

		
	"Between the desire\nand the spasm\nBetween the potency\nand the existence\nBetween the essence\nand the descent\nFalls the Shadow",

		"This is the record of a box man. I am at this time beginning to write this record in my box. I am in a cardboard box that fits over my head and covers me completely to the hips.",

		"\“Do you see the eye?\” she asked me.\n\“Well?\”\n\“It’s an egg,\” she concluded in all simplicity.",

		"And the worms, they will climb\nthe crooked ladder of your spine—\nwe’re all mad here.",

		"\“Yes, Lord,\” she replied, grabbing a butcher’s knife from the kitchen.",

		"(i do not know what it is about you that closes\nand opens;only something in me understands\nthe voice of your eyes is deeper than all roses)\nnobody,not even the rain,has such small hands",

		"People with pure hearts can go to a whole new world.",

		"In the half light of dawn, in a cellar, I have cut the jugular vein of sacred bulls before the black stone. During a lunar year I have been declared invisible.",

		"The Zone wants to be respected. Otherwise, it will punish you.",

		"She has turned her face, more than once, to the Outer Radiance and simply seen nothing there. And so each time she has taken a little more of the Zero into herself.",

		"Once upon a time and a very good time it was there was a moocow coming down along the road and this moocow that was coming down along the road met a nicens little boy named baby tuckoo",

		"Silence glimmers in the empty hallways, on the radios no one listens to anymore. Silence is love just as your raspy voice is a bird.",

		"Every love story is a ghost story.",

		"The black wind howls. One among you will shortly perish."
	];

	var msgType = randInt(0, 4);

	switch(msgType) {
		case 0:
			return {text: "HURRY UP PLEASE ITS TIME.", width: null};
			break;
		case 1:
		case 2:
			var n = randInt(0, quotes.length - 1);
			return {text: quotes[n], width: quote_widths[n]};
			break;
		case 3:
		case 4:
			return {text: this.randomFact(), width: null};
			break;
	}
}

function getPOLItem(){ // defined by purple_apparition
	if (!this.pc) { 
		return;
	}

	if (!this.pc.houses_has_house()) {
		log.info("No house. :(");
		return;
	}

	var house = this.pc.houses_get();
	var contents = house.getItems();
	if(num_keys(contents)) {
		var item = choose_property(contents);
		log.info("Found item "+item);
		return item;
	}

	log.info("Couldn't find item.");
}

function getRandomAchievement(){ // defined by purple_apparition
	if (!this.pc) {
		return;
	}

	var achievements = this.pc.achievements_get_list();

	var achievement = choose_one(achievements);
	if (achievement) {
		return achievement.name;
	}
}

function getRandomItem(){ // defined by purple_apparition
	var catalog = apiFindItemPrototype('catalog');
	var safety = 0;
	var result = null;

	// Find a random candidate
	do {
		var class_tsid = choose_one(catalog.class_tsids);
		var candidate = apiFindItemPrototype(class_tsid);
		if (candidate.base_cost && !candidate.hasTag('no_rube')) {
			result = candidate.getItemNames();
		}
		safety++;
	} while (!result && safety < 5);

	return result;
}

function getRandomStreet(){ // defined by purple_apparition
	if (!this.pc) {
		return;
	}

	var streets = this.pc.stats_get_street_history();
	var street_tsid = choose_key(streets);

	var street = apiFindObject(street_tsid);

	return street;
}

function onContainerChanged(oldContainer, newContainer){ // defined by purple_apparition
	if (!oldContainer) {
		this.setAndBroadcastState('fadeIn');
	}
}

function onCreate(){ // defined by purple_apparition
	this.apiSetTimer('speak', 1000);
	this.apiSetTimer('vanish', 10500);
}

function randomFact(){ // defined by purple_apparition
	if (!this.pc) {
		return "";
	}

	var type = randInt(0, 13);

	switch (type) {
		case 0:
			var item = this.getInventoryItem();
			var item_names = item.getItemNames();
			var count = item.getCount();
			var name = (count > 1) ? item_names.plural : item_names.single;
			var love = (count > 1) ? 'love' : 'loves';
			return "Your "+name+" "+love+" you very much, but can't find the words.";
		case 1:
			var item1 = this.getRandomItem();
			if (item1) {
				item1 = item1.plural;
			} else {
				item1 = "Magic Beans";
			}

			var item2 = this.getRandomItem();
			if (item2) {
				item2 = item2.plural;
			} else {
				item2 = "Flamingo Eyedrops";
			}
			
			return "The "+item1+" are waging an endless and bloody war against the "+item2+".";
		case 2:
			var item = this.getRandomItem();
			if (item) {
				item = item.plural;
			} else {
				item = "Replica Canoes";
			}
			
			return "Beware the "+item+".";
		case 3:
			var item = this.getPOLItem();
			if (item) {
				var count = item.getCount();
				var item_names = item.getItemNames();
				var is = (count > 1) ? 'are' : 'is';
				var name = (count > 1) ? item_names.plural : item_names.single;
				return "The "+name+" in your home "+is+" conspiring against you.";
			} else {
				return "HURRY UP PLEASE ITS TIME";
			}
		case 4:
			var item = this.getPOLItem();
			if (item) {
				var item_names = item.getItemNames();
				var count = item.getCount();
				var feels = (count > 1) ? 'feel' : 'feels';
				var it = (count > 1) ? 'them' : 'it';
				var name = (count > 1) ? item_names.plural : item_names.single;
				return "The "+name+" in your home "+feels+" neglected. Please hug "+it+".";
			} else {
				return "HURRY UP PLEASE ITS TIME";
			}
		case 5:
			var item1 = this.getRandomItem();
			if (item1) {
				item1 = item1.plural;
			} else {
				item1 = "Consumptive Raccoons";
			}

			var item2 = this.getRandomItem();
			if (item2) {
				item2 = item2.plural;
			} else {
				item2 = "Terrifying Knees";
			}
			
			return "The "+item1+" are best of friends with the "+item2+".";
		case 6:
			var item = this.getInventoryItem();
			var item_names = item.getItemNames();
			var count = item.getCount();
			var name = (count > 1) ? item_names.plural : item_names.single;
			var is = (count > 1) ? 'are' : 'is';
			var it = (count > 1) ? 'They' : 'It';
			return "Your "+name+" "+is+" cursed. "+it+" "+is+" the source of all your problems.";
		case 7:
			var item = this.getInventoryItem();
			var count = item.getCount();
			var item_names = item.getItemNames();
			var name = (count > 1) ? item_names.plural : item_names.single;
			return "You must become one with your "+name+".";
		case 8:
			return "Did you feel accomplished when you received the "+this.getRandomAchievement()+" badge?";
		case 9:
			return "The "+this.getRandomAchievement()+" badge is not what it seems.";
		case 10:
			return "The "+this.getRandomAchievement()+" badge is grape-flavoured.";
		case 11:
			var street = this.getRandomStreet();

			return "Do you ever miss "+street.label+"? You can go back there, but you can never really go back there.";
		case 12:
			var street = this.getRandomStreet();

			return "Return to "+street.label+" to meet your destiny.";
		case 13:
			var street = this.getRandomStreet();

			return "I have hidden a secret in "+street.label+".";
	}
}

function setPC(pc){ // defined by purple_apparition
	this.pc = pc;
}

function speak(){ // defined by purple_apparition
	if (this.pc) {
		this.setAndBroadcastState('talk');

		var msg = this.getMysteriousWords();

		this.pc.announce_itemstack_bubble(this, msg.text, 9*1000, false, msg.width, true);
		this.pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: msg.text});
		this.apiSetTimer('stopTalking', 3000);
	} else {
		log.error("No PC for purple flower");
	}
}

function stopTalking(){ // defined by purple_apparition
	this.setAndBroadcastState('idle0');
	this.apiSetTimer('doIdle', 4500);
}

function vanish(){ // defined by purple_apparition
	this.setAndBroadcastState('fadeOut');
	this.apiSetTimer('die', 1500);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-143,"y":-305,"w":285,"h":305},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK0ElEQVR42s2Y529b1xnG\/Q+0QtMC\nReo6chzb8dC0pjVIiUviEuflJi8p7r3EIa4riRRFUZJlybJk2VYkO4iTJgWU1Ehh1Cj0oUjRIiiE\nAC2QJikEtB87+Kmfnx6xbVo3SNPERJ0DPLjEBcj7u+95x3N44sQXrGlhlJ0VxZtPNHi5XJUmkzbf\n\/tQ\/ND0epTPjUWTGI0yKl2pqBJjFMBt2WJdqTts19tMD8qPs6bEI0mNhRLkBWMfs+76RBWZFs8As\nqUsyV1flc6Fd1DFMSWYyzDAO6wpj1BYOnbZlOGxLoE1FNAgwyE4JQjhWUuhBaDQFH7sMD6sE9\/Ac\n\/CMzR9PC\/GcepJZOyayGYs1mKsOgzcNBV2GzLIDWz+EY0qRnGgMY5\/ibk\/wgEkTzbgdmzC5kVRkw\n0jmkRAymxTlE+GkYe+P0P7+jESdpgyIDnWKaABXrMqpy0IqmIB921wGt5nkoFFF2QxI6yvHXohwf\nGJ0Vy0ENrkW0WPabsB7zIiQNwNIXgWXAC32Pja0YdrLNkhDM\/DhMAi+EXWaIewyQ9v5dVsVUPZp2\nulprWMUFRjwHwRGyvQo7rsd0dcA6ZEiDBZ8KQYUZ5qsWGPo1u25BcD8oCkExqAKrZRysSxJwWpXg\nt1N1QJobQ9Iyg9jk\/H7jWsKgnXYN2eEYtmHtH4ArYS0WJylUbBRKBjUKKhWSUlUtLlUjI1dhksPD\nRDcbhkEhBi6MY6RFBjVLD79kFlHFApLGIt04wC6qie611MJiN+bcdqx6dKjaNShrjSiqAgiMq1CQ\nRRAQmGFhKZEU+2AZFSIiMiAulUPVz4FpSAIty4qYsoKIslyjqEpTQxurW+gMa7o9mFXaMaM0ws4R\nwy3WwD3hhW4iBK08DtVEHHJRABKuDbwBOYQ9YmgHRXDx5EjKFGA0kTqgT14MNxSu4tpuKvk3miNj\npkMbWwwzawIDLSyoxi3wm9NQS3xQSMJ1yYU+SPkOUEIr\/Do\/TFIrKRYdvDwDQhI1cprgUZSabkz1\nhlRlOiAvHjCudSRUMUyTKAxcGgLnCh\/qET3kfAsy\/io8xjRUYjsUQgdMCjfEHCM8Gj8KbtJaxq2Y\n9WRhElLQXpWjoNSiNJnCrKOEgqu0mrWXvtwYzdo3mnP2tXApcPsopJpH3rGOKeMiTBwnRtuugnV5\nGCYZjRVmCTqhGSFbCmnvPDK+ChLWDKbteRT9Jcz5Z+DSeFGNlXAtW0XSFoOOT2GSL0bZXUAlsIRF\nogVvtbYSW2Oqwf\/StGOaym5ct3gwH7hTi+uqqER2kLFeR3ZyDbPemzBx\/Zgiya5naaDiUvjwg9\/g\ng5\/9Cg9uvYI3Nx6hklonkfPApY0haErCqwujEi5jc3oV66UqfvLwMV6\/\/QBanhb8KyzExCqUnDlc\nT17H9akb2GbuYCt\/u67N7PbhVn774G7p7r8imyIVVQ7dOZzSL9XBAposvPIEyZ0QNKMmiLolKKpJ\no+0SQsWR4+7KJh7dfwc\/vv8GqqlNbBR28HDtNTze\/BF+uvUQ76y8ga3EKhhnBlVmDuoxPezkBQQ9\nIrSeaScFNgE9RwanzIGcPY2EMYqyb5G80C3cK7+K7cwd5jNRTE2ut0fU5VrBsQGfOgdhtwb8Dg1G\nWxW4emEMfoEYQTUNi9wAxp3ArblVzEbzuJ69gd25dby1eB\/7yw\/wcPVNvFHexUZ8GVvpVXhMdmiF\nGihG1WTUUWh7qQOyviEIusagZWthOc5jOoTt3B28MruH16qv737+SFNXZEXfLRScG3DLU5D0G+qA\n3DYhFnUGUih+SMiD5FwFnBoXgsY4ZvxF3MndwP2527hLYDcTK1gOlHArs4Y5Vw5OuQ0GsQ4Kvhyc\nLg66L\/RBMyAENSSqA\/rVXtyc3sJe6T52ZnZ3v7BIluP36KxtrZaxriJB3IdimESySwrVsBBajgjF\nTBbpcAxbC2uIOaPYnq+iFMzjwfIOKYgiyiEGK4l5FDxpEt0FzISnsVFcwkDnVVDjFMYGOJAMcWER\nqZGyhrGV28ZtEr23rv\/w8H+fHCQnc5Nrh6XAFmhenAx8PSY4ZvSd6kHA7MTezZv49Xvv4a29Pfz5\nk4\/x8MED\/PGj3+Lj99\/Hh7\/8Bf708Uf4wSs7+Osffo+fP3qEv\/zuE+ysrcGi0KHzZDuS7jxupEnu\npm7Wc+7tzbdXv1IfzDmvhU2jkZp+1AezyIeBi2MYamNjqTCLcjoLg0SF8lQWPp0NC\/E85iLTyAcS\nKCcK9XuVRA4evRUzsSTcRitGe7mYVHqxU9rDXvk+NjO39t\/dePfpjhNUl6uJIhaK4tvYo0PU4ZXv\ntILdOoQQ7cbyDAElECaBCu3fa8WLTWc+lXJIjGI0jbVSGX6jE5xOFs5\/40WI2Lqje5V7ssfbjxs7\niylepYkSpA75g0Z0nxtC66nLoKUGzEcLWC9WoLnKx0hzG1gvtNSvBU8M11JlhAwedJHWcvH5yxi5\nyIN5lEZSEaJPNHqZhKUDo7AIDS+LwctcdH7rEs59+xzOf\/sMxAPjoEiFSs51YZy0keOroH0YZ587\njReea8aFb54hI5KDSYEPDs4kqo48NoNldsPgUpNz7bQkgWNA83gKdjkNhUCLoVYOuk5eQfvpbvBP\nt0P+cg+Bu1K\/9r\/Ui47n2yEeMcNpLiLouIYpzyasbCsixI4x+sRhwwDtvMS+fTxDeloAJfsMVqJT\nYFx+OBQmjBH\/N9wnhYJA\/btkbAM08gj8k0tIB+8iG9lD3LuJmL6ApDKMxEQQcaX\/6c\/bx2PQJ2Fq\ndv4UyGfs5Eq4k89jPZnGvD8MFUuLkVYJlBd6nhD3ooC4HTc85HAUda0h4d9GOnQXad8mlj1zKJrS\nSMpDzFMDRpSLjFfCwC8lkXOX8frCPF4tzWGLNOwpTQw0x4+2k6OgLvU\/IR5pScpBEsVxD2hqGl5L\nmYCuI+reIAW0XAdcthdqd+PLXz2Kik5Te1ixUHOR7c2qiYWanEbRkcaCYwZxBfF67BA5GOnRcYoL\nfcvgExo5M4zuZh7YF0TEwSggZllIRD0wkhFKq\/NwikNYcTDYjVd3vxJcXLnc7BZmDz2iPNyiHDnR\nLZBzBnE3g06YRmOguAGI+n2kJ+rRcqoPpnbWExo924e27w\/ANEKcNXHcATGJJIuGh+8kWxtGTh2r\na1aXIAeuePhL5x3Z2lUSvUPHWAouYZb0rxABDJMHhqAecMIocB\/xOo01dous1nN+COZOHqydo59q\n\/CILZ59vPTCyLLSD7zh0jzlBs2mExF5c88ziBjEUs\/oE8qpYLa+K789SCXZD+yLnorKZ164+4LQp\nwe0UQ98pgrFtuC5tywD4LSJ0nR3B0GVJ+4lnsYhX3BV0aJhjO0YNToLqNe33nDwL6eWBmugypybt\ntuDlk53EqlFhfifF\/r+BcToNzYIOPc3v0NYdyPHfGiMtokPryBRz+rvnDpMaZl8\/HDyQdpvR2tyH\nE8966djOg\/7zAtrBSTNdLw\/vz5iWGHokfiC6Yqh1nB44eqZwWWWpWd5vAdlq2snN7Ap61UzFuhY2\nsiJHQxfFkFwxMc8UcNayJCM5eCDo0O26eNlVDcfDJBRltkMwddh3nnd0vO3PfIuPC4DXRTWZWNGw\nQ5g5cvCmV13j8d3el7i0nZNtdvLz7GcKyOlUfjqq\/LLSIdnq8H\/e\/1qslGu7KTwxv+viZukTX8dV\nctyTVVxvNjX6d\/8GWBRo3t6x7\/8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/purple_apparition-1321987078.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("purple_apparition.js LOADED");

// generated ok 2012-02-27 18:38:47 by cwhitman
