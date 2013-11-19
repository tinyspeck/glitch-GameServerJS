//#include include/takeable.js

var label = "Highest Quality #1 \"Imported\" Glitchmas Yeti";
var version = "1353720999";
var name_single = "Highest Quality #1 \"Imported\" Glitchmas Yeti";
var name_plural = "Highest Quality #1 \"Imported\" Glitchmas Yetis";
var article = "a";
var description = "A genuine, imitation Glitchmas Yeti. It is qualities without peer and it is always ensuring you are satisfy.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 3001000;
var input_for = [];
var parent_classes = ["limited_edition_imitation_grichmas_yeti", "rare_doll", "rare_item", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"quantity"	: "99",	// defined by rare_item (overridden by limited_edition_imitation_grichmas_yeti)
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

verbs.pull_string = { // defined by rare_doll
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
			pc.location.announce_itemstack_bubble_to_all(this, quote, 10 * 1000, true, {delta_y: -110});
		}
		else{
			pc.announce_itemstack_bubble(this, quote, 10 * 1000, true);
		}
		pc.sendActivity("The doll starts to speak: "+'"'+quote+'"');

		return true;
	}
};

function getQuotes(){ // defined by limited_edition_imitation_grichmas_yeti
	return [
		"Humbaba to give bless each person.",
		"Is this Glitchmas to be best!",
		"Naughty is who. Nice is who. The naughty does offered to splank.",
		"GNE towards more good",
		"Hope to get better this game for beta. Anyways after launching.",
		"*fwaaap* Stop. Include string instead not finger.",
		"Yeti to hug excels more instead Glitchmas pudding.",
		"The fur is tight-fitting pants. New Year's promise less to eat the following snocones.",
		"Do you have a movement it hot in here? Is it just me or would? You must have strategic probably wax.",
		"Confuse me with a stuffed rabbit very sick people. THE TOOTH PLEASE REFER.",
		"Acquire yourself a very indeed Glitchmas",
		"Towards Ilmenskie ... access further!",
		"A friend of mine all crazy I got to the glitch I have this poor ragdoll!",
		"On a day to be a real Yeti! Maybe overnight. You are asleep. Ha ha.",
		"Of canned beer and cheerful Glitchmas, happiness",
		"Little Yeti will to you offer love.",
		"To Glitch your Glitchy a Glitchmas to Glitch. ™ Glitch®",
		"To function requires a battery",
		"Oh and it gets me out of the box would be great. Happy Holidays!",
		"I am everyone's favorite has cursed of holiday season!",
		"Abhorrent? Exception! Much instead cute.",
		"Why does not exist? No. However, the Yeti will once a year comes."
	];
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
	out.push([2, "There will only ever be 300 of these in the game."]);
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
		'position': {"x":-34,"y":-60,"w":68,"h":61},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIYUlEQVR42u2Y609b5x3H8x\/wZlvb\nqS1Z2qZNQhRpWzd16oT2Ilu2diPtuqaXdTRtkyxtuoSkWzdVraUtasmVjpCkkCooBWwuwQ4YYowx\nBzC2Y2zMxQbb2MY2BoMN9jG33Hb57vk9iT07IZdVJuuLHukrH5\/j85zP8\/1dnkdeseLr4x4eJfvW\nZJ8oWJd\/cm+OhHS8IEe4USf25ihKCtbn3XO443tyJH\/\/Q454bHcOTuxdj0M71+KT7WuWVMke+g0D\nZRO6J3AHd65RFO5IhzjIAG+8Rjr89lo+ARJz1LfskB9vX1N0K6eW0pF31uLornVJlRTkiJQWywJX\nuO3x3TcC7H\/rCfz1jcfTdDvgT99dd93RHEXp+6uyMufctidyU6E+eO0xvLflEey7rnd\/\/R28vXkl\n3nr2Ybzz3EoU\/GYV\/vTyo\/gofzX\/fSLcLMw8JwmUQp4xwA\/zV\/tSoQpeXIVtv8zG6z9\/CC\/+5Nt4\n9qn78NyPH+BwdP\/Pr1yDu52jBJoxQHKI9Pu8lXjzmYc5VN7T9+OlZ76HTU89hI3f\/yaHfO2nD2LH\nr7K5gx\/+bvUtw04FdWzPusw5+Isf3pe3+en7JaRNP\/iWZOOT38idnZ3dHZqaQZ1ciTde+hl38IXc\nB3iYyUECXErvs3t\/fPkR\/OXVR\/uWrZqvXLmyYW5uDrGYCI9vAoomAafLK7D99S1484UfYevm74JN\nBr\/d+CB2stxMiBx+ddNj+GDX82iQ12BhYWHDcgH65ufnwVzkmp6JoX\/QCf0FK+wOD\/zjYQzYndCo\nmyGvr4NUWoXKigrIFQ2w2tz8\/vjkNOLxuA9AVkbhaMDLly\/7rl69isXFxSSkZ8SBMetZROznEHGo\nMO3VI+wSMO2zIOAwwDekR9BlxJTXxCVOeRAXZxTL4mA0FhcYJAeciYoYdgfhNVZi1q\/DnKcFi6PX\nNOduRtipgehWY8ap4ucLPqYxAxb8AmajIVy6dCnzq0s4EhUoB8k5ykOzyYiIrZ5DyYp2ovzjrUnI\npdTTeBiD2s8xK0aRcThvLJbF8kdMhJY7aO3EjLudv\/y9V57ErufXI2iRLglH1+l+R\/1RzEeDkowD\nuoOTuZTgCUCS0zUC0aXCQqCLu9NZ87ckEA8nuz4bMGI+1M9ToE+oQnx8IPMFwgEDkxICFMV4EpDO\n\/f4A7JZOBIY6EHKbEPZZMd53HsazZehXyjDUcg6mugr+e3qeOa9YlvCO+EM+t38SkelomouUixRu\n+qS2Q+eyHVugk+xCzyf7YNy\/B5p9W+FubaD2IrI2lZtxwFAslt3dMyy6faEk2FQ4kgaaEE3A3NwI\nnawCPfXVGFKdw5hjGOHITB+Nc1ctLWbJmhqU51k1p\/JGrZV3fkZj8WYJ3YMie0kSRNtlTgt3atjD\nDHJkdAI2px\/WQS+6jHYEJ8IKdl9CulMO\/nPKoIg6GmETTsPV\/cWdK95kPJOvu9DrGw+FkxA1ijbQ\nmkyhTXVvMhxloRYRCTpZhXcgNtKGyd4qRIcUiPkuID5hQ2x6EoHJ8C03sFcnuoR5z3lYNWXQNxwT\nbh3a0ebszray3RpNaZbB4hQSIIGJCCpqW0A5mVrZ1CMTjTw+2oWwXYn4cH2aorY6TA81YGxYB5vD\nJ2nX2TZQjlPjpo0Iy9Py+TG9KDqVcOq+gNtQKdIylr+4OFdus+kkXpdKEvA05ce8mixBfbIoscxF\nY6KYKAqdaRCnq5o4IImACY6WQQKk9XrCpkLc1XwTYELjvTIYDD1o6+rHeOi\/\/XUqEsWi\/1pvJQdb\nqw8JK7yuZqG2tjCZF2b9mbxeU5VCqSzeQHBsVorUAaRn1ZDWt8HuGktC0j22S+Gic6+zn63PDbjo\na8VFvwYBswxxh4JJfg3QXIl+Yytk8jZ4x6Z49VPKUGrQMxRiS0sphPoiyQqloqi819yE7i65QDLq\nKsTzjcW51+GE1CIgmOOnalHbIMBgdiYB05o4W8oWIk7WD+XwmmqYG2r4e6oxNaxi7mgRNEsxLJTB\naWrA2cZOuFhB0RgOzziifjN3L9Rfj075p2ipLrx5awYWXsqFVDCaYTAU4QMdK6vhDgp6G3cx8YLJ\n8AwvlItiEP+e7uE7HIOyBGGbgnIJoyYZApYaGBqLOaDHKOPjGHtdGHT4Ye53Q\/R2gCrYbahi4T2Y\nvvte9LXkLXpVfTQDSlIx7E8Ckv0E0svaxtHjVSgureGArD\/ya6lOXpmbZEubCo6uM2irPcwhhbNH\nYVGXQneumJ0fgV37GfRqKc9lGiehWY+aT4gm01JVmF7BY5Za2NpP85kn1tSIf4A7Q3lCIW3XauHQ\nnRHbmusVrR29fTRoh8HOHSCNBsMQp4OIjzSxl0hhVn3G4VqkBzjsQHc99MrjUMsOovLzo\/kf7S\/J\nU2nNkvbuQYHJ5+nTIGitg72jnJ5JXxa7Wc8R3a08ZxKAZLdv+AL6h3xo7zTBpCoD6\/LwmWR8R9Ju\nGMxlkJIEqNU+Cq\/HzZ9NOEGifKLw0nVzt0ZUSw8s2Qe7jZZ8s6pUoq07Irkp\/2Kj2ux\/hS+ANUqu\n0ICcV+Bc0IKBgUHoW6oUzPY8teyARJNS9XRo9cPZ5AKB9lkHkpNLAPZpTvFPr1kOT2Dyy\/3LMGqq\n3kDWkihvxvsV+Eeom\/clnbIMl9gEbvc8Nd1UQGoVPla9CchhlpNaFSsYtnX70hsDcqZVejC3S16c\n6zVJi2hgqihN9aHyu3le6LbnG1kjvxTQ3hRmah1atTJzu+kELElbefiudiK0saBQT4+0pwFS4tN3\nrbYj89v9\/\/WgfLT16nmIybUEoOhqQlurWvhK\/BMrdJiLeppPiARHOU3txqw6iVZ5We6Kr8pBFU\/N\nlnqgqqpQpOr\/+k\/0\/8fxH80BfCnnytOzAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/limited_edition_imitation_grichmas_yeti-1343947628.swf",
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

log.info("limited_edition_imitation_grichmas_yeti.js LOADED");

// generated ok 2012-11-23 17:36:39 by pobrien
