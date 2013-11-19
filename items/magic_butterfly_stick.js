//#include include/npc_conversation.js, include/takeable.js

var label = "Butterfly Stick";
var version = "1348106794";
var name_single = "Butterfly Stick";
var name_plural = "Butterfly Sticks";
var article = "a";
var description = "One stick imbued with purest butterfly attractant. Placed in a house or on your land, any Butterflies close enough that their wings tingle with the frequency of buttervibes the stick resonates at (a very precise range) will be irresistibly attracted to it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 400;
var input_for = [];
var parent_classes = ["magic_butterfly_stick", "magic_animal_stick", "takeable"];
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

verbs.place = { // defined by magic_butterfly_stick
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
				log.info("PS found other bfly sticks");
				for (var i in items) { 
					if (items[i].is_placed) {
						return {state:'disabled', reason:'You already have a Butterfly Stick here.'};
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

		var g = this.container.geo;
		//log.info("PS butterfly stick ground is "+g.ground_y);
		if (g.ground_y != undefined && g.ground_y != null) {
			var max_h = g.ground_y - 200;

			//log.info("PS butterfly stick max_h is "+max_h+" and y is "+this.y);

			if (this.y < max_h) {
				pc.sendActivity("The Butterfly Stick can go here, but it might work better someplace else.");
			}
		}

		this.updateButterflies();
	}
};

verbs.change_radius = { // defined by magic_butterfly_stick
	"name"				: "change radius",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Set how close Butterflies stick to the Butterfly Stick!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.imagination_has_upgrade("herdkeeping_butterfly_stick")) { 
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

verbs.pickup = { // defined by magic_butterfly_stick
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
			return {state:'disabled', reason:"This Butterfly Stick belongs to somebody else. Get your own!"};
		}

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.parent_verb_magic_animal_stick_pickup(pc, msg, suppress_activity)) { return false; }

		if (this.is_placed) {
			log.info("PS Clearing movement limits on all bflys");
			// Get all bflys on the level and clear their movement limits.
			var items = pc.location.items;
			for (var i in items){
				var it = items[i];
				if (it.class_id == "npc_butterfly"){
					log.info("Clearing movement limits on butterfly"+it);
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

function onModify(){ // defined by magic_butterfly_stick
	if (this.is_placed) {
		this.updateButterflies();
	}
}

function onPropsChanged(){ // defined by magic_butterfly_stick
	if (this.is_placed) {
		this.updateButterflies();
	}
}

function updateButterflies(){ // defined by magic_butterfly_stick
	// Get all butterflies on the level and set their movement limits.
	var items = this.container.items;
	for (var i in items){
		var it = items[i];
		if (it.class_id == "npc_butterfly"){
			var dist = parseInt(this.getInstanceProp('distance'));

			log.info("PS Setting movement limits "+dist+" on butterfly"+it);
			it.setMovementLimits(this.x, this.y, dist);
			it.flyAround();
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHZElEQVR42s2X21dT+RXH+QOmdbla\nJVyGIAjepsOMODMVL1xMELlfAgkYQyBgCBAuyQQcKpNxtQ4IOAiOzAwCQUZBMyhCERHRDCAqI0y0\ntjLtGpd96ksf0j70+dvf3mmy+tC+QGxz1torZ+Uk53x+3733d\/9OQMBrOM6a3o85XRlrq1dFOY7J\nJN4oSQlxaGQSq0YWmKVO3BwT8P84DJlhnfqMMGjkElTnRaLnE7k3Thn2oDz9Tb5GUa+McjWX7vrf\ngBYlBUk18kAnAXQ3JeDucAmcd014MmXEowkD5kZL8a1dyzHak4PuXyUwZMnhYNQVbLW+VjhKl0ib\nq0n3Nuav671A39+pxbN7Zo7vbhk5fkfnk5WYE6D2C3kwH93uVlux1XE8P2LDa4M7Y4rDynQtlm\/X\nMODKdI1QsF4oWM2ABLtwoxwT\/YWY6MtndW8NFmHmisYLWaWIdvoUktMq4Frr9\/IDKe6PaDBlU2Kw\nIxOD7Rl4\/NsqAW3E\/KiOVX06a+KFzHxdJK4ZBHABHoxVcG1SurXpEU6fwOXLNm6gmmsqfZvB6MGP\nxvWYuJgLmwCrUkZz1Gt+gcWbFQy1NFmFxyJI4e9n6ljtp0JlqsvLn2WziobsLchNCF1\/TZJd0Kpp\n9fSwlek6UWPVDPH5J4dgyN8K07GdHJfOZuLZrBkrd+pwe1DF6abmodTT4paEkvRZrYhkyArFduQk\nhsSsTz2R2oGWNK6x2RGtSFelO8VXNahT72IwvbAZAq1X72R171\/VMtzjiQqxmCpvWZCSBNxu2c+A\nlYptyNwfvHYVj8klNvK45\/c\/xPhAEZ7cdisyNViI2WEtp5bAKDzntrY0XDufg4fjBoZzN5GJVafu\nphL5tfE9Bqwr3A6lLNyxjvQGuvpbUvFirgH37WUMSulbEvZBnVmaFQ5j4TYGqxUdSmoaVdtwo1ct\nrquFFZUzHNXlI6EmLZLSfaL0LXcd5kYiJ+FNx1rVi6ebTPQfxeqcBU+EGssizQ67DmO9BRjvU6Fa\n5YbzQJblRDCoJi3Mq2rPKbno6jLMXlGLe6n4Hh7AyrwopO8PWh\/gpE2NPz04wan5w7cWtpHJASVq\nju5gGILSZkiRf0jC51SPFKSup3lMml0MOSPKgrrZA6jLjIT8A8n6AEe6cvDHhUZOFQGSVXz1G7nX\nXvSKKBQeDmHVSEkKT9PQOf2GwAfa0jF9uViAlqO+aBt7oSYtErL31gjo9j8J2s37sDrfwICrohYp\nVb2nj\/DDa4p24GJLFs6dTHbXn\/iOVPUAErT6SCh\/P3JegbnrxzHclY2SFJ7LyE4IQ8aBoM61N4kw\naOriH+YbubhJwZmvVWKU6TH0WZ5QQ4\/bl4rQUPoOK0WQTeW7+ZzATpTFCjPPxfK0SVhUCfvooOhy\nWniDsKSMA1JEhvykeO02IwvspJuN96q4gynI2+a\/0QrLqeFxNyQmA6lFNUeK3bmsY6ClyRosiHpd\nHCtn\/6P\/kkVV5mxhwOM5UaJupVCnb4lZj81k0c1o90JppinB404U+sObeixc1+F0fRyU8mCR2l0Y\n7i5AX2sK7D25eCA2DPQbz8IoupsOuP2vgBYUjbxEqWP9o06k2dMsS8JoaUIQ7PRQEau5LFSZGzUw\nAE0a8smR89neLRh9T583hTXpUkMYsEa1Q6Q3WIy50Ph1A3q6meYxWc68KPSpS2qeEL93WLxjzBM0\nPR6M6bnmSHGCuzdSDKMiguGMeRHITZIiITZwzGfbLU8tEuRAaxqPrRExzibFtKBa\/PeRRn5J8XCi\nkjet1PXNZW7fK0sNRW3hDqTuC3pFLuHTDav5wwoHe5d4EG08x75UsqfRSPvuXzsWCoIjMKfo2NHP\nM9Gg2end8lcXbEf6Aakr8V0fv0iVFcRZW0efwmg2QpMS7n0ZIgvqPBHP45DiZq8SdlF\/baa9qC+M\n9v6OXq50mVFI2rPZlbgnMMuncLcuyKyj\/SaotVocs3Tgl7IsR35CiE0o4vIA\/Lcg1WqEBSnlUggw\nZ9y7QVKfgb0ApDOOEdvgmQzcvWaG7eKnSD4UZ\/Ncj9gYsKFIFmo9vGfTq+TYnyFz7yZk79uEggQJ\nio+E0ZYeR1MicHB30KuE3RLfvs19NDwf\/43zz7bVv6yK3YsRQxeM+Kolz2Fvlf3Hwg7\/+Rvx4Zvf\nsFJEh\/7UenB3sPXgO5Li2NiNvn97o0P36aVincWCL85V4eHiONpbzbYAfzmm7o119s04Xas\/PoFO\nEYPU+K1jAf50nOswOJr7rqG1zYjhM\/HOxtfxkr3Wo80it\/V8LEf3yRR0WPb5F9yjv\/6t88awFRcE\n4FCLzL\/gOhqSi7u6zfiiz4qej5Ocy3aZ\/8CdbUyOabfIXV0nU3Hv5Y949vd\/WP0OrrPpCDo\/SkRX\nb1Ot\/eVL\/1CvtVG2QTSF8+zJbPTcWkBFe7\/\/eJ0HrqMxGZNXT+H6hG0sSWeW+pWdTE4PYf7FChZ\/\nWPQf5Txw7Q3JuPL0OS4uP8eXj502v7ITgjtvTXc16vfHBPjbwXbSnOpqrvY\/uH8C7P6iGLglAaQA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/magic_butterfly_stick-1330729637.swf",
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

log.info("magic_butterfly_stick.js LOADED");

// generated ok 2012-09-19 19:06:34 by lizg
