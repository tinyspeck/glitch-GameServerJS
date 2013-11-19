//#include include/takeable.js

var label = "Gas Trophy";
var version = "1340228514";
var name_single = "Gas Trophy";
var name_plural = "Gas Trophy";
var article = "a";
var description = "This trophy is awarded to those who demonstrate noble dedication to gas collecting.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_gas", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_gasses"	// defined by trophy_base (overridden by trophy_gas)
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

verbs.drop = { // defined by trophy_base
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

		var result = this.takeable_drop(pc, msg, true);

		if (result) { 
			var trophies_outside = pc.home.exterior.find_items(function (it) { return it.hasTag('trophy'); });
			var trophies_inside = pc.home.interior.find_items(function (it) { return it.hasTag('trophy'); });

			if (trophies_outside.length + trophies_inside.length >= 11) { 
				pc.achievements_set("trophy", "placed_eleven", 1);
			}
		}
	}
};

verbs.examine = { // defined by trophy_base
	"name"				: "examine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Have a look at the trophies",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var rsp = {
			'type'		: 'get_trophy_info',
			'itemstack_tsid'	: this.tsid
		};

		pc.apiSendMsg(rsp);

		var pre_msg = this.buildVerbMessage(msg.count, 'examine', 'examined', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canDrop(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	var loc = this.getLocation();
	if (loc.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function canGive(pc, drop_stack){ // defined by trophy_base
	return {ok: false};
}

function canPickup(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	if (this.getContainerType() != 'street') return {ok: false};
	if (this.container.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function getAdminStatus(){ // defined by trophy_base
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc.is_player){
		var location = this.getLocation();
		pc = location.pols_get_owner();
		if (!pc || !pc.is_player) return;
	}

	var ago = this.ts;
	if (this.ago) ago = this.ago;
	return pc.label+' got this trophy '+utils.ago(ago/1000);
}

function onPickup(pc, msg){ // defined by trophy_base
	pc.furniture_migrate_trophies();
}

// global block from trophy_base
this.is_trophy = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"trophy",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-21,"y":-50,"w":41,"h":50},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFkklEQVR42u2Yf0xVdRjGKaezhSGS\nqV0FyYuYZqzIsEhxBi40YQ51VpK62mzVYjWTNkWcEiYgGjMMhN3gxgThAvJLEOWIyO8fFwRBfl5B\noCiMbNXacnt6n1PX9UdtzXHh\/NHZ3t1zuRfOh+d53+f7PcfObhwPg8EQfu7cufCKiorw1tbW8OHh\nYRc7LR1msxnXrl3D1atXYTKZkJiY6KMpwPb2dktzc7MKmJGRgfj4eO0A1tXVze3q6W1tMrd8W6Yo\no0bj16OpRmOuphRsampSOjs7IbDIyspCbGzsOk0BirWKDAcURcGlS5dw5coV7Vjc0NDgUFJSYuno\n6FB7UOBQXFwcpBnAxsZGAweECtbU1Kh18eLF\/piYmEcnHU5U20G4\/v5+1NbWqlVfXw\/JQ5SWllbI\nVx6cNDgZCg8ZDlgsFojN99SjzexFAUReXl78pMD19vY6iKVjPT096OvrQ1VVlQrHKWYPclDKyspo\nNTIzM3dPOOD169cVrhy0VkIa0oegmlSyurpatZh1+fJlXLhw4U5CQoLXhMGJpccJJSqq6nE42tra\n0NLSogJSRfZiZWWlCkm7xer+yMjI2TaH6+7uDmScDAwMqOrJezCgCUlFqSLtJiAtp90ELCoqQnZ2\ndrVNh0bU8hC4MSpHQL6K1arFhOaGgXAsqmhVj314\/vx5qoi0tLQEmw2FQJipFuFu3bqlwvH9jRs3\nVAWt6hGK6hGQw0JACXIqiNzcXBiNxndtsVvJoUqMFPbdzZs3VSjC8edWe63KWTORFlM9WlxYWKiW\nQI7v0AhICHttcHDwXnV1dakKcjh4TlhazJDmFFsBCStTzKVPBSVgfn4+1RwMCAh4fFwAJSoMhPg7\nIOG4ghCCylmHgnCEZFFNhjbzkFYTlEqypBcRGhr64njumMPFRgt7jhbTaqtqfLVCEZSZaI0bAlsn\nmSpyUKQMEt6BNptkwgpIjlxQEVUUWdLGaBsvziHgOa2Uzy2iHD835OTk8J5lh5w7TPiqEh0dHSiT\nqUiPmQkrAS2CKSnJyckemtq0yrq8Q3rVYqfVQ\/oynPHDzNQk4NDQkJkhzh7VHJysLD4jIyPq9Mrg\naM9mTjfhGCUpKSn5mgGTW0xfiY9Imdw4CfQ7jBrJvkrJwMMy1VskZib2EYipsMmlodUS0tk3bOnu\nG0DG2bNIT09XVwoua9wDMpjLy8v\/3DTU1kOOcKmQs0V1tr0VTc+vMaQX1MBUXI+2LlnyvrmN727\/\nhLyCEhyPO4WjMZ8j4sgxRB6NxZdJqcjMKUJjs2xsB0ag1LSDv3smv3osPb\/WNvm4b\/UixLy9Faf2\n7UVSWCiyTieh1JSN2jIF\/UOj+OHHn\/H73bv45dffZLczgPLCAhRmmXByfyiOfvwhQoO3ItjLHRsX\n2vvYDPDgmkU48rIex\/zccPIVd5zesAS1ewORsH4x4tbpEb32CUT4LESYtzP2rpyPkBXz8M4zc7Br\n+Wy8vtQJQYsdJx6wOWwLvtr0lHYBOyK2I32b5\/+A9w3YenDb5AKGejo6HFrlbDigAur\/cUj+K+AW\n91kIcpuprHedPm4B\/sCe53W7P5WL8uIn\/PT4wn8JkgOWwbhpOc5s9kDBzhdges0TqTIoiRuXIs7f\nHVG+ehzyccV+bxfs8ZqP9z3n4a2nH0OwCukIX2d7bihmSU27X7ApUjOlnKWW7fKYc\/iD53Sph9cs\nbDvh5\/Z9WpAHcoO9kPvGCqQGLkXSq0sQ779Y\/Qei\/lLxgKj4yUodPhIV3xMV31zmNLrB9ZEqb93D\nBvtpdpvl7z4rpZeaI\/XQ\/YLySYC9FB9bLCCs1EtSflIBuhlTd250c4rw1zt95uvqGLXWZWbM6gUO\n0avmO0R562ZEeuvsDzlNn7JdvusvtUbqSSlXqblS3DdO\/bcL\/wHYj3COmKQgQgAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1278112380-7940.swf",
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
	"trophy",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "examine"
};
itemDef.keys_in_pack = {
	"r"	: "drop"
};

log.info("trophy_gas.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
