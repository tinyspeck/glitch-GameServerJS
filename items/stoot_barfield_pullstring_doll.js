//#include include/takeable.js

var label = "Stoot Barfield Pullstring Doll";
var version = "1354655145";
var name_single = "Stoot Barfield Pullstring Doll";
var name_plural = "Stoot Barfield Pullstring Dolls";
var article = "a";
var description = "Stoot Barfield Pullstring Doll. Loaded with a goodly amount of \"inspirational\" phrases.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1333100;
var input_for = [];
var parent_classes = ["stoot_barfield_pullstring_doll", "rare_doll", "rare_item", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"quantity"	: "0",	// defined by rare_item
	"conversation_offset_y"	: "0"	// defined by rare_doll
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.owner_id = "";	// defined by rare_item
	this.instanceProps.sequence_id = "0";	// defined by rare_item
}

var instancePropsDef = {
	owner_id : ["TSID of the owner player. If empty, it has never been sold."],
	sequence_id : ["Which sequence in the rare item catalog was this one?"],
};

var instancePropsChoices = {
	owner_id : [""],
	sequence_id : [""],
};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.pull_string = { // defined by stoot_barfield_pullstring_doll
	"name"				: "pull string",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "You suspect the doll might say something",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var quote = utils.shuffle(this.getQuotes()).pop();

		if (this.isOnGround()){
			pc.location.announce_itemstack_bubble_to_all(this, quote, 10 * 1000, true, {offset_y: -110});

			var sound = this.getSound(quote);
			if (sound) { 
				pc.location.announce_sound_to_all(sound);
			}
		}
		else{
			pc.announce_itemstack_bubble(this, quote, 10 * 1000, true);
			var sound = this.getSound(quote);
			if (sound) {
				log.info("STOOT playing sound "+sound);
				pc.announce_sound(sound);
			}
		}

		pc.sendActivity("The doll starts to speak: "+'"'+quote+'"');

		return true;
	}
};

function parent_verb_rare_doll_pull_string(pc, msg, suppress_activity){
	var quote = utils.shuffle(this.getQuotes()).pop();

	if (this.isOnGround()){
		pc.location.announce_itemstack_bubble_to_all(this, quote, 10 * 1000, true, {delta_y: -110});
	}
	else{
		pc.announce_itemstack_bubble(this, quote, 10 * 1000, true);
	}
	pc.sendActivity("The doll starts to speak: "+'"'+quote+'"');

	return true;
};

function parent_verb_rare_doll_pull_string_effects(pc){
	// no effects code in this parent
};

function getQuotes(){ // defined by stoot_barfield_pullstring_doll
	return [
		"That is not part of our corporate culture.",
		"Who the hell is Paul from Japan?",
		"I’m trying my hardest!",
		"This will only take a week. Two, tops.",
		"Siiiiiiiiiiigh.",
		"I HATE PIGEONS IN THE OFFICE AND THINK THAT SHOULDN'T BE ALLOWED!!!",
		"Work harder!",
		"I would like to go on a forever vacation!!!!!!!!!",
		"I love rhubarb pie!",
		"I have never seen The Sound of Music.",
		"God bless Myles!",
		"Lotsa fluids!",
		"I love you. In an entirely non-creepy way.",
		"afk til 5",
		"You’re my favorite Estonian.",
		"I don't feel like we hug enough. We should hug more.",
		"Everything is such a bother!",
		"They would not call it a funpickle!",
		"Top Priority!",
		"Success is inevitable!",
		"不好",
		"好",
		"Ooooouch!! Soy guapo!",
		"I wanted to change my name to Machine Gun Bill!",
		"My sandwich is bigger than your head!",
		"How do you love it?",
		"TA-DA!",
		"I’m going to fly around in helicopters and stuff like that.",
		"SERGUEIIIIII!!!!", 
		"It would be ... a couple hundred pixels wide.",
		"How awesome would that be?",
		"Ssssssswarmatron!",
		"Whatever.",
		"Good luck!",
		"It'll happen someday!",
		"Right now, people can't ... they basically can't play the game, because it's so fucking slow.",
		"I wanted to make it bigger.",
		"That's good?",
		"... And that wasn't going to be enough, so we were like, 'Oh shit,' but then we realized, 'Oh, it doesn't matter!'",
		"...add more... fun to the game.",
		"Fun fun fun fun, fun, a #$% of a lot more fun, fun fun, fun, um... more fun",
		"I don't know uh... a lot about astronomy, but... more fun.",
		"It's fucking awesome!",
	];
}

function getSound(quote){ // defined by stoot_barfield_pullstring_doll
	log.info("STOOT getting sound for "+quote);

	if (quote == "It would be ... a couple hundred pixels wide.") {
		return "STEWARTDOLL1";
	}
	else if (quote == "How awesome would that be?") {
		return "STEWARTDOLL2";
	}
	else if (quote == "Ssssssswarmatron!") {
		return "STEWARTDOLL3";
	}
	else if (quote == "Whatever.") {
		return "STEWARTDOLL4";
	}
	else if (quote == "Good luck!") {
		return "STEWARTDOLL5";
	}
	else if (quote == "It'll happen someday!") {
		return "STEWARTDOLL6";
	}
	else if (quote == "Right now, people can't ... they basically can't play the game, because it's so fucking slow.") {
		return "STEWARTDOLL7";
	}
	else if (quote == "I wanted to make it bigger.") {
		return "STEWARTDOLL8";
	}
	else if (quote == "That's good?") {
		return "STEWARTDOLL9";
	}
	else if (quote == "... And that wasn't going to be enough, so we were like, 'Oh shit,' but then we realized, 'Oh, it doesn't matter!'") {
		return "STEWARTDOLL10";
	}
	else if (quote == "...add more... fun to the game.") {
		return "STEWARTDOLL11";
	}
	else if (quote ==  "Fun fun fun fun, fun, a #$% of a lot more fun, fun fun, fun, um... more fun") {
		return "STEWARTDOLL12";
	}
	else if (quote ==  "I don't know uh... a lot about astronomy, but... more fun.") {
		return "STEWARTDOLL13";
	}
	else if (quote == "It's fucking awesome!") {
		return "STEWARTDOLL14";
	}

	return null;
}

function canPickup(pc, drop_stack){ // defined by rare_item
	if (this.is_racing) return {ok: 0};

	var owner = this.getInstanceProp('owner_id');
	if (!owner) return {ok: 0};

	if (owner != pc.tsid) return {ok: 0, error: "This does not belong to you!"};
	return {ok: 1};
}

function getLabel(){ // defined by rare_item
	var sequence_id = intval(this.getInstanceProp('sequence_id'));
	if (sequence_id){
		return this.label + ' (#'+sequence_id+')';
	}

	return this.label;
}

function onContainerChanged(oldContainer, newContainer){ // defined by rare_item
	if (newContainer){
		var root = this.getRootContainer();
		if (root && root.is_player){
			this.setInstanceProp('owner_id', root.tsid);

			if (root.is_god) this.no_sequence = true;
			if (!this.no_sequence){
				var sequence_id = intval(this.getInstanceProp('sequence_id'));
				if (!sequence_id) this.setInstanceProp('sequence_id', getSequence(this.class_tsid));
			}
		}
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_donate",
	"no_vendor",
	"rare",
	"collectible",
	"doll"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-58,"w":59,"h":59},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKUElEQVR42s2Y6U+bVxbG+Q+i+T6T\npemSpYQwbWdaCnWghIQlGDBgDMYLXvBuY8xiG\/xiMGDAYByzmcU2YYcQQwIhlAQDLZCQpEnJJLTT\njtCoH0aaSuM\/4Zn7vhlFqipFHVWQXunoyq8s+6fnPOfcc9+oqN+wbrXHxsx3xEbm22PDN9v\/7J7v\nOC+cdZw+FvV7WDRMyBWLGWcMxh3nMGA9g6Has3Bq3oG34lRgxhnNfuNwdPSZT8NleA+e8lPot5yB\nTfoWuipPo0F5MjLTct596HBTTeeEk00vFauTn6TVQrP6HdSXnmTgTPxjsIhPQJ7zR7Tp3sX1lpjQ\nivODI4cC11NxikWnMEidJYBnIeMcB48TDUVxDFSCczBIzkMjOg8t\/xT0ovfRUpuCwbqPIl2m9w4n\n3T7z6bDfdpZRjVZMyIuFp4OP0EwFvgw3M7G6TGFzrRXh5Tp889iH7bWmiCb\/KHXgcJOOaPaNtvOw\nEzA6pQLOe2hp4mJ5sRZf73Tj8X03vn0WwHfPR\/F0pxO7j7vw\/d4oftgL4NGWV3\/ggMRz+yP10bAT\n30k5J+BszMPybRu+ftCFh1sdePGNlwD68Wi7HXvPxvD358N48KWLAI\/j+ZOroQOFc2pOxNAF4be9\nz6hXIozDxKgaG6tNePqwm6jVg51NFxamTHBVZcKqSCZgQYx2KchnNm6OWZ4cLKD8rSO052pJlaq4\nJ6BVJyN03YjtjSYCZYWnloNaWRIUWbEQpUajIPkMvlprQ69LCHneR5CzYyFJiz24Bm6TnBQ2a96J\nlJMWIsw6AYPuIkaDRJ3qLGg4H0KZ+yH04gQUEDgBgZkeNeLh9lVsrbehsSYHtuoM8FPOxhwYoDr\/\nqFDLPQoD7yhK899GedlF9HiKYZIkwt8jRXBQBrP+ElLOH4c6N474sBO3Zytxd96MpOg\/YcClxIGm\nWJ73hyN1srci1pIT0PGOQ0w8ONBXgo17djzZ6WFSbdamIvnccUgzP8HGSiM8VBoWrklQJY7HqE8T\nPlDArVU7K7xYFVmeN2FigA+1IBo2awZmp1768NF9DwM6NWzC0lwtbs3UoMGYiNCAADeDUjz\/pvdg\nAe\/dqQktzFfj7h07acYtWAqZYDPGw9tRgLnrJjx+4MX9L52kMfeRfngVN6erQOk+w8qMEvN+ETaX\nLAfbqG9M6th9XcKIuSoVjfU5mCP+6nQVwV7LxviIFiu3awhYO17sBnF\/oxl35ilYlHHoa8xEaEiI\nakXcwZ8kfVf5MdcCpU\/GrinR5swjp0g+muo5cLcW4gvSsOk0072QLpDNtRY4iAXqqy9joFOEKvkh\nDQv0ctivsCuNKVQR968RpSQJnvYi3JqrxiZpKffuOHB3qYG0FxdWblFYuUFFdsJOfdSbWHZeKsup\nz404KA4G+6S4t+jAF6NmjDSJ4TPz0KnNxiglwIxdfPiD63\/+sXKkV5wTWa1RY8AhwNyMBcFuJW5M\nmbEQasDkgBaLE9bIo3WP8NDhVpZ6qTtBx\/60QYRxdRF23TWYaJXCryrACzcVinqTa+Nef2hrzKXf\n66Qi23YDukXZ+MqmxYPmKtxvNGG9zoA3Bvft7qx7c7Yz8MxljayalViplqOVl47b1aUYUfIwquJh\nuLQAs+rCN3Ore\/BV0P1DtyP8bSeFB0S9XhEHXcJsBEu5mNbycbNcjD5xLma0gt90UVJN2tnKaTtL\nPu389a3pnz8sCPfGO4Qv3Dbcr9NjvUYFdxEbwwou5sqEuGtW4B6JLmEOZnUi3KmQ6YnKLDruWdW\/\nSlEaStRftS\/oNaGitxZ9U937t2+Os35VxT7cHqG+u2rf36J0BKYUSxVSuHhXMGsQMDFfJmYAJ9R8\n9BBl\/VIuJtXFWCyXYLlSTr4vw0K5JDLXrgyTozG8sdoQ3lpvDG9uOJgWRKslCVgiPLcOymYD5meH\nMTzkxVB\/Z+S1cPs9TaydOW94rV4f2qSLgaR20SRBR2EmUyB0WmkvrllVTKxaFAiR6nYLsmHipKOu\ngA2fOA\/XtUIGeLiaD1+3CEsLVnL6WPD0kY8cjU62csouzGtV4kqtEL1+N675u9Df044hn\/v1RUdU\nw7M2Cx44SIXadJjVC4nfitGUl4YA8d4tUwkDRcdylQxDsjzIeLnIKy5+FWJJCXTCQlj4eaAUV8gZ\nzoV\/QArvgAJ9Y0b4huRUgVsbuFIrQoI0g4BPMer1dbvI9zwvAQGwfvrpR9b0eCtr9+tp1o\/7t1kh\nS6l+0SRl\/nzNqmT2CRUf3cRn9ZxLTNUuEEAakt69gizIigogUWtQolIhMz8fnKIiFMtkTPClUgjk\nchSb1Sj2lEHaWwnPtBfN\/c1oG2yN8BuU+IibRBr9KLydzWQIvsrsUf\/+107gu73NJ6ur4wwgHVvr\nXv38gCky6lWiQ5WNcVURbhD1whYl2kl67TkppEkXMim+ri9mQsYj6ukM0FWZYbDUoIxECYFlc7lg\n53MZ4AwOB4KucnDbNQhO9WFyxMekk1aMIgUYJ7yMLxanECDKXXU3ocfbiqiN8GDk+e6d8Pd769T2\nRnOAeGJ\/Z7OdGZvofeyaCm22PAxK8zGlKWaKoyL9ApPOMaLiFGkx7aS9FEqkUJVXvApNRRWU5Sao\nKyoh0WiRzeXh86x0ZFIlYFcLyGU\/iN6uNnR7nHQxoK27CZ+KUrG8MMmkllbP1WJH1Oyo69j0hCWw\nvkIxoxINRcf2eiPZ3QgMlkKnSYY999KTSQ0\/XJl+QahNiUczN420lSz4SjjQFORAqFCi1GD8GaS+\n2gKFwYCs3CtgXUzBhexU0F6T1mvIue3\/n9fa4OtxodltZxSkn7ldDcwzWl3Gg8NDsvDCXBVWl+1k\nVGplLuLrKxb87WmQeXNQWPiXnw2c6pRPhfpLCYySlRmJ4GRlIquAB75MDqXR9HMly0rR6rXAVW+E\n2CpgAMW1Coxf62PSONjXAX+\/By0ddiSXZqPVXc9UL+3BV0WiVV8OdLTxyEVIjIFeMW5MG8kPGEl6\njcw7FqdT84uZTnsxgaVJiQ8ZU1n7nyUnE68VgCsSQ6RUES\/qIdeXMYrqjCLUOarhc6sg96pfAV6f\nHGLUottJL\/HaSLAbLHkmA0o\/o6EHCPzLl0I+3xGdrpBSlaZGjPqLqDGno9xQGFIoMqkaszBstZa9\ndmyKT0qiEj7\/HBdSUnAxPQPZvEIGNl8oAl\/MhrmkECa3GLkWA1KMXBRVSzA9PkjUczMq0il1tlD4\nhJ+CBqeVgaN9Oezv+uX\/9vf3s\/x+P4uG\/n\/O0ITERFZCUpI7PjExTHYGNpWdhZz8y1DmpENQy0WG\nXoZkXS7ENgUD19xYi852B5PSBmcNotM+RmZxFjo9jfsE7mAH3fgLF\/QEOkKn\/1IyAWbHRUQm1f7u\n4zDahlowOdbP+IwuBNprns6mJ28nxLLejY+NObQJ6IPk5CMk9YHLmVlUUlrasaTywmM6MmzECS5j\nNNjDeI3ueTSor9sVjvo9rPfTPqboVHa0NzBw\/peAkWG\/Vx\/1e1l0Km22cuFIoJuiwaZf4\/f\/AjL7\nQLF\/lfd5AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/stoot_barfield_pullstring_doll-1343948918.swf",
	admin_props	: true,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_donate",
	"no_vendor",
	"rare",
	"collectible",
	"doll"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "pull_string"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "pull_string"
};

log.info("stoot_barfield_pullstring_doll.js LOADED");

// generated ok 2012-12-04 13:05:45 by stewart
