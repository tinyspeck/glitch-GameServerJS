//#include include/npc_conversation.js, include/takeable.js

var label = "Pig Stick";
var version = "1348106742";
var name_single = "Pig Stick";
var name_plural = "Pig Sticks";
var article = "a";
var description = "The saying \"Speak softly and carry a Pig Stick\" is wise but misleading, as the Pig Stick is not effective when carried, only once placed somewhere in your home or on your land. There, Piggies within trotting distance will feel irresistibly drawn to the precious Pig Stick, and want to stay near it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 400;
var input_for = [];
var parent_classes = ["magic_pig_stick", "magic_animal_stick", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.distance = "250";	// defined by magic_animal_stick
}

var instancePropsDef = {
	distance : ["How far away from the stick animals can go"],
};

var instancePropsChoices = {
	distance : [""],
};

var verbs = {};

verbs.place = { // defined by magic_pig_stick
	"name"				: "place",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Stick it in the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.is_placed) { 
			return {state:null};
		}

		if (pc.location.pols_is_pol() && pc.location.pols_is_owner(pc)) {
			//log.info("PS placing in pol");

			var polType = pc.location.template;	

			if (	polType == 'LIFE3C0NLA32547' 
			|| 	polType == 'LIFE42L6PA32MUJ'
			||	polType == 'LIFCH1JF8K42GUU'
			||	polType == 'LIF1737DK0526F5'
			   )
			{
				return {state:'disabled', reason: "You can't place a stick in a location with an animal pen."};
			} 

			if (!pc.skills_has('herdkeeping_1')) {
				return {state:'disabled', reason: "You need to know "+pc.skills_get_name('herdkeeping_1')+" to use this."};
			}

			var items = pc.location.find_items(this.class_tsid);

			if (items) { 
				log.info("PS found other pig sticks");
				for (var i in items) { 
					if (items[i].is_placed) {
						return {state:'disabled', reason:'You already have a Pig Stick here.'};
					}
				}
			}
			
			return {state:'enabled'};
		}
		else {
			return {state:'disabled', reason:'You can only place this in a location you own.'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.parent_verb_magic_animal_stick_place(pc, msg, suppress_activity)) return false;

		this.updatePiggies();
	}
};

verbs.change_radius = { // defined by magic_pig_stick
	"name"				: "change radius",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Set how close Piggies stick to the Pig Stick!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.imagination_has_upgrade("herdkeeping_pig_stick")) { 
			return {state:null};
		}

		if (this.is_placed && !pc.location.pols_is_owner(pc)) {
			return {state:null};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var conversation = [ { txt: "How wide should I let the animals roam?", choices: [{txt:"Very wide", value:"300"}, {txt:"Kinda wide", value:"200"}, {txt:"Medium", value:"150"}, {txt:"Tight", value:100}, {txt:"Very Tight", value:"50"}] }];

		this.convo_step = 0;

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, null, true);

		this.updateState();
	}
};

verbs.pickup = { // defined by magic_pig_stick
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.pols_is_pol() && pc.location.pols_is_owner(pc)) { 
			return {state:'enabled'};
		}
		else if (this.is_placed) { 
			return {state:'disabled', reason:"This Magic Pig Stick belongs to somebody else. Get your own!"};
		}

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.parent_verb_magic_animal_stick_pickup(pc, msg, suppress_activity)) { return false; }

		if (this.is_placed) {
			log.info("Clearing movement limits on all piggies");
			// Get all piggies on the level and clear their movement limits.
			var items = pc.location.items;
			for (var i in items){
				var it = items[i];
				if (it.class_id == "npc_piggy"){
					log.info("Clearing movement limits on piggy "+it);
					it.clearMovementLimits();
				}
			}
		}
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
	"sort_on"			: 52,
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
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

function parent_verb_magic_animal_stick_place(pc, msg, suppress_activity){
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (pc.is_dead) { 
		failed = 1;
	}
	else { 
		var dest = pc.location.apiGetPointOnTheClosestPlatformLineBelow(pc.x, pc.y);


		if (dest) {
			pc.location.apiPutItemIntoPosition(this, dest.x, dest.y);

			pc.announce_sound('ANIMAL_STICK');

			log.info("PS placed stick at "+dest);

			this.is_placed = true;

			this.updateState();
		}
		else {

			// There's a problem - attempt to fix it.
			pc.location.apiGeometryUpdated();

			dest = pc.location.apiGetPointOnTheClosestPlatformLineBelow(pc.x, pc.y);
			
			if (!dest) {
				pc.sendActivity("An invisible gremlin is standing here, preventing you from placing the stick.");
				log.error("apiGetPointOnTheClosestPlatformLineBelow() failed for level "+pc.location);
				failed = 1;
			}
			else {
				pc.location.apiPutItemIntoPosition(this, dest.x, dest.y);

				pc.announce_sound('ANIMAL_STICK');

				log.info("PS placed stick at "+dest);

				this.is_placed = true;

				this.updateState();
			}
		}

	}

	var pre_msg = this.buildVerbMessage(msg.count, 'place', 'placed', failed, self_msgs, self_effects, they_effects);
	if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

	return failed ? false : true;
};

function parent_verb_magic_animal_stick_place_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function parent_verb_magic_animal_stick_pickup(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_pickup(pc, msg, suppress_activity);
};

function parent_verb_magic_animal_stick_pickup_effects(pc){
	return this.parent_verb_takeable_pickup_effects(pc);
};

function onModify(){ // defined by magic_pig_stick
	if (this.is_placed) {
		this.updatePiggies();
	}
}

function onPropsChanged(){ // defined by magic_pig_stick
	if (this.is_placed) {
		this.updatePiggies();
	}
}

function updatePiggies(){ // defined by magic_pig_stick
	// Get all piggies on the level and set their movement limits.
	var items = this.container.items;
	for (var i in items){
		var it = items[i];
		if (it.class_id == "npc_piggy"){
			var dist = parseInt(this.getInstanceProp('distance'));

			//log.info("PS Setting movement limits "+dist+" on piggy "+it);
			it.setMovementLimits(this.x, this.y, dist);
		}
	}
}

function onConversation(pc, msg){ // defined by magic_animal_stick
	if (msg && msg.choice) {

	this.setInstanceProp("distance", parseInt(msg.choice));

	this.conversation_end(pc, msg);

	this.updateState();

	}
}

function onDrop(pc, msg){ // defined by magic_animal_stick
	this.updateState();
}

function onGive(pc, msg){ // defined by magic_animal_stick
	this.updateState();
}

function onPickup(pc, msg){ // defined by magic_animal_stick
	this.is_placed = false;

	this.updateState();
}

function updateState(){ // defined by magic_animal_stick
	if (this.isOnGround()){
		if (!this.is_placed){
			this.setAndBroadcastState('1');
		}
		else{
			this.setAndBroadcastState('placed');
		}
	}
	else{
		this.setAndBroadcastState('iconic');
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("herdkeeping_1"))) out.push([1, "You need the skill <a href=\"\/skills\/21\/\" glitch=\"skill|herdkeeping_1\">Herdkeeping<\/a> to use this."]);
	out.push([2, "This tool only works in your yard or on your home street."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from an <a href=\"\/items\/1000002\/\" glitch=\"item|npc_streetspirit_animal_goods\">Animal Goods Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_shelf",
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-60,"y":-49,"w":119,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIWUlEQVR42s1YaVOTWRr1HzBd1d2g\nIig2uIyKNgID0qwJa5AlIGsSlkBAlrAHEQitsghIZBFoQYKsshkBgyBIBAVHUaOtVf2hq4b5B\/kJ\nZ557I9Qs\/WEG0cmtupXkTfK+J+c853nOmz17vsC6UeTm3Kh005YmHzWkBu83SAQ22zstZL+mLPmo\nuqXUw6dB5WK152uvXPFBZZ7YAVKhDSrSTkFT7oPOGiHfDYUeKE46yt9jOyvCfvN6vqvmqwCNFXxj\nJRHaaNmFK+Un8XgoBcbFIrx8mIMXM9lYmUzD0\/EUvucHEnHzkjcyRAeQGrQPlWmnNi+nn7H\/YuCS\n\/b53lgpsNvNiHKDvS8CbhQICdpHv90+K+WbH1qez8YqOrd2X48lIEpZGUzjL7Eflig+bFFFOzl+E\nOQZOJTuGlQk5Nh7l45U+F6\/p8e2C0gzuUS6BU2DubhLudUTiYV8c\/9yL6Sw812Vy6RnI\/AtOpmTR\nod0FKRVaG8tTTmBNp8DGXB6WRpKxMBDP5WXSrukyOGvs9Zt5Jd4tmY\/P3onFM2KSAWff26rNwsTj\nRoHLN7tTk6zm2InfzOdjdTIdz3RZ6Kj2xo1yb1wr8EBTmRceaiUwjMvx7nEBPiyXcFYNxDT7DmOa\nAV6ZSMXTyUwO8GLkQSQFHzLsBnNKdsKH2kQ8nUjD6lQG6orOEbBzWBiS0+uLBDgXf9+4it9WL2Nx\nJA3vFgvxeFiKv85kcTYZq9xIs1n8sU7pbgYZ44RIb1vljsEl+u+1lwqsTayFMHfqtQkYvxWD6uyz\n+H29GsbHhbQLiKEcrD2g2utP4s9XJklSknf9QSbJnLUNkNUpk\/1+V8wnwzgg0sd25yyyhstaxNOJ\ndDzojcfKlAK58UfQWy\/ibYXJ198YhmLZCVRmnUXLpQAsj2Vy1zLm3tL76wScPWdmYZu5\/H537LbM\nMtEPpp2zRydh7C2PSnH\/lxiMtEZDIT6Ml\/oCjLZHkszuyI79AUqqz4YSb2KpnORW4uOqmtfb3F0J\nJroumFkmA7H6M0xm4MGdhG2AqecdsSOzbNXezJ0kPB6M5023vTqA2DpFjMo5M6wW5VEOJHsCfl0q\noTpNwtvFSsz0Z2JhUILbdaEokhznsi4NJ2P5HoHuT8DdZtE2wISggwj\/ycbnfwcosFGzk8z2JWH6\nlwjeIu61xyAt4iDUOS7obQjB8+l8\/G2jHvND6bh1xR8b8+V08SgOaoZYukVjjz1\/Mibnk2V5LJ3X\np+aSFwdYlnwMYV57EeLxGQD11D7m+y\/wIn82JSfnpqNS4cJlrb7oivFuGbErwUyfDLP9MuQlHOOg\n9CRvX0MovT6C\/qYwbqKZvkRiUYqfc89ygMo4JwS4WsPP9dsdAAywkbGTDDSJsEH1wwp9lZzM6vEV\n1eCdhvNc3jjhPgy2ROPDylXoB7M4cBWNtY25fAzcCEcOgWiv8uY\/kHWBqa4oVClOm0NEtCPJu29n\nNchH26dA8OtigTkIUOEvDiXydvHRUEauLEFFxo\/cOPdvSwjoeZSknKRaNIeF5nIvbqJHg6lkHgUW\nhyXkYHOLYeEhMdgRHie+M35Gm7HW0XAnQ2TwCzInMhZZA36\/VGw+pi\/EoCYWuh4JpqkVfTSU0w8o\nwditKIx1RCEl3B5zAzIyTSLm78ahtcLbPI8JeHzgIYj9HbQ7nyKfZO6o8oX+jtg8CT61DNYHl0Yk\nvLbeL5VR8ecRUDHaqn3Rez0E2kYRKjJ\/pH0WK+OpnH02v7Mi7DjA4uQ\/c4CBbt87f16CYe0g6hCe\nEXPrLJXQ4GctY34wiVJKJhYHE\/CwNxqT3cmQhtlxUzBZmeyKGEfO8AsKCixMXC903W4vcUJ7SEIO\nf\/4sJpk1W6n5FbE22RnF63CqM4IMI9nOgR+fqigsZKO2wJObR5V+mqJYCe08Du5uY9B2ws4WH+Hu\n3VF7+eMcaG1iJ67Nc8VEexiGWkIx3RPDRxkbXcxALBe+o7pkM\/rDcim5WInXbMTN5WL6djTSQ\/dz\ncEXEcJSvLYRu+7W7lgVZkpaH2X26v7BD6yVP3m5GWsMx2haBJ6MybhiWrBkgFhi2ZO2tFfASYd9V\nhNsRu0cgdN9r3NWwOl0oVo5dSUKO2OmfboTs6OKBBE5KDdwcVlkwZcDnB5Ix0HweNVlntj\/PwElC\nHRDksdcU7X9od+5LVvqCZcM1AsO9vEj0ZIrQrAyHhEImu9jWhdlmiYfVaJn0OIoSHf\/lPZ6e452o\n5znA38Va53\/mT7sD7nl\/mKb\/WqBx9GowOjNDUCcRIjPstIy911zsaR\/ru1eTEmRrkofa\/gegbTnD\nKTWHHEag+z6T\/9nvNLsm6YthkbqtwtM41Zxqmr4ShpE6IQoi3dR\/9FmPk9\/6iH0PaMM89oHtiJ9s\nKaE4IMTzAPxcbDa9XWxku1pvLwdFzuPNfpvaawHorgnCKLWH2hRvrSrW4ev\/O\/Dv6\/W4wGqkSWjU\ndcWZ7jUHoItujApS3LR7LGXN3hLoJrvlhjV9DabaQlFf9Bc0F3\/BfwL+mzV+tVC50BmjeaAJ17VW\nCIyay6E0ytJhmCrTTd0MMDBW\/68AV\/tCI3rKUqCtjEZLuRDDjYGoLfLVGrTntZTbNBYhbeelOE1H\nRTQGrwejvvCcQRUXotSUeKotwhg3VIHOTaVCk7YuBF1qH2NOtKe9KlZgZRHMbYEbvpqNXnWQMdYS\nGGNrsaHBqkElsGosFRq7fw7GWKPI2FGcY28x7WRUrdLO31RuDtGt43RbkHG8wUIk3VpD9ULD5I0A\nTLb4YbEnKMKiwJGs2qbSYPRdVkCtcDXqO\/wtR9rmskBZU1kg2tUiU022u6an9OKmRbHHHNtaFWqq\nyvVy3mNh6x+NpvOTtf6+PAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/magic_pig_stick-1330729658.swf",
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
	"no_shelf",
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"c"	: "change_radius",
	"e"	: "place"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "change_radius",
	"g"	: "give",
	"e"	: "place"
};

log.info("magic_pig_stick.js LOADED");

// generated ok 2012-09-19 19:05:42 by lizg
