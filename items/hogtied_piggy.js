//#include include/takeable.js

var label = "Hog-tied Piggy";
var version = "1337965213";
var name_single = "Hog-tied Piggy";
var name_plural = "Hog-tied Piggies";
var article = "a";
var description = "One wiggly wild piggy, bound and gagged. Better pen him up fast. Drop this piggy in your home before he gets away.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["hogtied_piggy", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

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

verbs.give = { // defined by hogtied_piggy
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var targetPC = pc.location.activePlayers[msg.object_pc_tsid];

		if (!targetPC){
			return false;
		}

		if (targetPC.isBagFull(this)){
			pc.sendActivity('Their bag is full!');
			return false;
		}

		// Hog-tied piggies can only be given to other players if the other player has Herdkeeping.
		if (!targetPC.skills_has('herdkeeping_1')){
			pc.sendActivity("They don't know how to handle that piggy.");
			return false;
		}

		targetPC.addItemStack(this);

		pc.achievements_increment('items_given', this.class_tsid, msg.count);
		targetPC.achievements_increment('items_received', this.class_tsid, msg.count);

		return true;
	}
};

verbs.release = { // defined by hogtied_piggy
	"name"				: "release",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Release the Piggy here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){ return {state:'disabled', reason: "You're dead!"}; }
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (pc.is_dead){ return false; }
		return this.released(pc);
	}
};

verbs.drop = { // defined by hogtied_piggy
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.escape();
	}
};

function parent_verb_takeable_give(pc, msg, suppress_activity){
	return this.takeable_give(pc, msg);
};

function parent_verb_takeable_give_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canDrop(pc, drop_stack){ // defined by hogtied_piggy
	if (pc.location.is_race) return {ok: 0, error: "You can't do that here."};

	return {ok: 1};
}

function escape(pc){ // defined by hogtied_piggy
	this.released(pc);

	if(pc) {
		pc.sendActivity("Your pig has escaped! Oh, cruel fortune!");
	}
}

function onAuctionList(pc){ // defined by hogtied_piggy
	this.apiCancelTimer('escape');
	pc.buffs_remove('hog_tie');
}

function onCreate(){ // defined by hogtied_piggy
	this.setEscapeTimer(0.1666667);
}

function onFrogDelivery(pc){ // defined by hogtied_piggy
	var escape_chance;

	if (pc.skills_has('herdkeeping_1')){
		escape_chance = 0.16666667;
	} else {
		escape_chance = 0.33333333;
	}

	this.setEscapeTimer(escape_chance);

	pc.buffs_apply('hog_tie');
}

function released(pc){ // defined by hogtied_piggy
	// When a hog-tied piggy is dropped on the ground, it becomes a normal piggy again, with mood set to 0.

	if (!pc) pc = this.container.findPack();
	if (pc && pc.is_player) pc.buffs_remove('hog_tie');

	var n = apiNewItem('npc_piggy');
	// Transfer piggy details.
	if(this.user_name) {
		n.user_name = this.user_name;
		n.pc_namer = this.pc_namer;
		n.named_on = this.named_on;
	}
	if(this.nibblers) {
		n.nibblers = this.nibblers;
	}
	if(this.petters) {
		n.petters = this.petters;
	}
	if(this.package_intervals) {
		n.package_intervals = this.package_intervals;
	}

	var root = this.apiGetLocatableContainerOrSelf();
	log.info(this+' released from '+root);
	if (root.location){
		root.location.apiPutItemIntoPosition(n, root.x, root.y);
		root.buffs_remove('hog_tie');
	}
	else{
		root.container.apiPutItemIntoPosition(n, root.x, root.y);
	}
	n.setInstanceProp('mood', 0);
	this.apiDelete();

	if (root.class_tsid == 'bag_furniture_sdb') root.checkEmpty();

	if (pc){
		n.onReleased(pc);
	}

	return true;
}

function setEscapeTimer(chance){ // defined by hogtied_piggy
	if (!chance){
		chance = 0.1666667;
	}

	var U = Math.random();

	/* Zero would be bad, so limit to some epsilon. The effect of this is that attempts will never, ever exceed like 200 or something. */
	if(U < 0.0000001) {
		U = 0.0000001;
	}

	var attempts = Math.floor(Math.log(U)/Math.log(1.0 - chance)) + 1;
	this.apiSetTimer('escape', attempts * 5 * 60 * 1000);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"animal",
	"herdkeepingsupplies",
	"no_rube",
	"animals",
	"no_vendor",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-40,"w":45,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGOElEQVR42u2Ya1MTVxjH+QTyEfgI\njKMv1JGL5aJWLLYO2nG0KNZRKkorbbEjlCSIBBJyIQGSQNiEawJJFkgMNyEkJFwDURCoikY71Zn2\nhXnRD\/DvntWNCSTTpAJlpt2Z\/5zNzsnu7\/yf5zzn7CYk\/H\/s4PHbeFHyqvlcEjl\/O5qX+MR4ijZV\nZufvCrgx8RdJb4Yv+t2qo35z+eFkjyIr4JBmgK7MonaNg1OSrDSf9jgckozAUO2RgFV4JJlcF+S8\na3fF4VMdo8y8NAjzUhy8E6mU4GS6lBH4OenFJRkHHEUp++jrqfv+nbDfv5NBueuP+2vOpIGX80EV\nJ1JZ\/ZB5EEWp+99rX\/GOwpmv701a05+AvbYAjFO4c+wwbmcfYtv2kmuwVt5Gn6AUveW3UJ6biZvp\n+3077uBaz8XAuuUqvFQhtDeyIDp\/GJKvUuBSl2HVUo+nViWeWSVYbb+MmZZciM\/tTdoRMK86M\/E5\nfcW31nsHi+2lmGy8gDndJczqCuDVX4BLnsUA5cGrO4tZzRnMqQswUn0WnaWHcncE8M+p79LmNSex\n1nMJC405+N3Fx+vRcvw6VIYnxmt4bf8G6\/QttvWbL+KpMRf9FZ\/Awk\/ZGcAF9QXpmuEq\/vAIsNRz\nA07pp5hqOIo5zXG4FdlsS36PiTJhv5uOcXEmXMos2O+d3Zk8XBkw0vOUDA9q8+GW5WBBmwe\/tRBv\nxm7il44cvOr7HMudXzIhP49xyVHYqk7Dxi+EU8zDhIjnm6wTbE+dXL1vTnrcb3AwgCBapruYnGti\n3KnCUPX3sPGKWI2If8K4gg9n4z3MU0q2z0NDKyu3ohoTYl5gSyGfj\/YkrliNFQxcgIMLFQEg7ZK5\nHQvtasy2yBGpH9eHdZKBZNykPhr0cb8xPxoYJ+LSxt8EJFr\/qYZaFpLTdFOdlJgQt2uh4YwHMNTV\naIBkAItdLZiUVXG5ScUFudJv9MUCx+VhpFCScEf6z3STOGxwM1QDBik1bJ1635DJ6LCaTXS\/yZQf\nFZjkWyxwRMQFkvzR8o3Akz7cYMg1Lvzzpg4YmlVQNzaiubkZbW1tMBgMoGkadrsddF+\/X6XVJkcK\nbSBWQBKuWPuGym3Qo1YoRF1dHRQKBTQaDXQ6Hbq7u2GxWGCz2TA6OopuQ49\/06SI9SHEudBwxStJ\njRAikQhyuRwqlQoURaGzsxMmkwlWqxXDw8MspF5LVYQV4XjcixbeWOQx6lFTUwOZTIZGJsyGJgUG\nVPW439yA4VYVnL1dcFuMcHbrmRWrNY0DjOnmJLf+aXhDZaU0UMnqMNlcj0c9ejx9YMNz5wheTI7h\n5dREUOuOwQBZKKICPurRYcnUFgwtKQ8k6T8WkL0f3R08DwVzt9bjCQNMzkekfDxzDEoTIoVsViPB\nlKIKMyoRWzrIckVGuxVwG\/VsfDAIaCy9Apr3bfD8pWfClzCnrd80gxc71Fhoa2JqVgMb1q1yLmJd\ntXTihetB0EEWjDkfU1azbcKMWkpHcpE4R+rXsqWDDfdGbRkgM\/i5VkUQMkyeCX+Cr6sln4Qwkkvz\nzIhIqCNpurEmZlASjWm1GG3lJVD9WITRBvGmAk8itT4+tBFSys5kt7zasbG+PTRoo8JxIgP4+9r5\n7j7eYRtWHy\/j68sFOJWdwUYmCMhMxuLCqzj9WQ7Tnwq8mnZWvJpyFr\/1ehPZlWTZ3F5BZimB5JyM\nBZA4E4t7pO\/SjAcHDxzAnj17WMiN7mvKSiDi\/4xRlST8NWF1oCct1GYCGlxLmVF6dcqIcOR6pHwi\nuUtq5saBDrU0wt5rhFpah6k+Y5iDXJ2dlAn8EXfNpAMBJZqUVxWTzSXJyw+7YypsgoSF5\/02irjv\nkgiCe77Qgfq6mj8MTlm9yT3yDPY\/UgEdcYO6MmAI+wDkFQoTnWJ+satO4A\/daMajGY2ULfAEkgMN\nXwj0rAHcoFwS\/rvJp6yM77PJYosyyS2\/l+9RCCmXtNLBOBsgqRBN5KGktpIQE+dI0V9oUwU3qqHi\nXgPcMoHUo7jrIGIgaa9amLitb4Gr\/YZiMjO5sDpFZZhtllcwLqVx2rY3vZh258wGmJu9jDuMs8JA\n3O8g2w1IJsKcVh7w6hroZath93w\/5CoDqQi7yrX\/7PEXbOAo7Rz8rm4AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2009-12\/1261544673-9418.swf",
	admin_props	: false,
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
	"animal",
	"herdkeepingsupplies",
	"no_rube",
	"animals",
	"no_vendor",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "release"
};

log.info("hogtied_piggy.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
