//#include include/takeable.js

var label = "Large Petrified Rock";
var version = "1350098715";
var name_single = "Large Petrified Rock";
var name_plural = "Large Petrified Rocks";
var article = "a";
var description = "A once-stable living rock, shocked and shaken to its very core by witnessing a truly awesome feat, and drawn to the 13 who contributed the most awe to the act. The pulverising and rejigging of its internal components mean that, when cracked open, a large selection of rare delights may be recovered.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["petrified_rock_large", "petrified_rock_base", "takeable"];
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

verbs.crack = { // defined by petrified_rock_base
	"name"				: "crack",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Crack it open",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Crack {$item_name} with a {$stack_name}",
	"drop_ok_code"			: function(stack, pc){

		if (in_array_real(stack.class_tsid, this.valid_tools) && stack.isWorking()) return true;
		return false;
	},
	"conditions"			: function(pc, drop_stack){

		for (var i=0; i<this.valid_tools.length; i++){
			if (this.valid_tools[i] && pc.items_find_working_tool(this.valid_tools[i])) return {state:'enabled'};
		}

		return {state:'disabled', reason: "You don't have anything to crack it with."};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (in_array_real(it.class_tsid, this.valid_tools) && it.isWorking()){
				uniques[it.class_tsid] = it.tsid;
			}
		}

		var possibles = [];
		for (var i in uniques){
			possibles.push(i);
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			this.startMoving();
			pc.sendActivity("You don't have anything to crack this with.");
			return {
				'ok' : 0,
				'txt' : "You don't have anything to crack this with.",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (msg.target_item_class || msg.target_itemstack_tsid){
			var tool;
			if (msg.target_itemstack_tsid){
				tool = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
			}
			else{
				tool = pc.removeItemStackClassExact(msg.target_item_class, msg.target_item_class_count);
			}

			if (tool){
				if (tool.use) tool.use(this, 1);
				this.apiSetTimerX('onCrack', 2000, pc, tool);
				
				pc.announce_sound('PETRIFIED_ROCK');
				var annc = {
					type: 'pc_overlay',
					uid: pc.tsid+'-'+this.class_tsid,
					duration: 2000,
					pc_tsid: pc.tsid,
					locking: true,
					delta_x: 0,
					delta_y: -115,
					swf_url: overlay_key_to_url('petrified_rock_open_overlay')
				};
				pc.apiSendAnnouncement(annc);

				var anncx = {
					type: 'pc_overlay',
					uid: pc.tsid+'-'+this.class_tsid+'-all',
					duration: 2000,
					pc_tsid: pc.tsid,
					delta_x: 0,
					delta_y: -110,
					bubble: true,
					width: 40,
					height: 40,
					swf_url: overlay_key_to_url('petrified_rock_open_overlay')
				};

				pc.location.apiSendAnnouncementX(anncx, pc);

				//this.onCrack(pc, tool);
			}
			else{
				failed = 1;
			}
		}
		else{
			failed = 1;
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'crack', 'cracked', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onCrack(pc, tool){ // defined by petrified_rock_large
	/*
	'crack' verb on Large Petrified Rock gives the following:
	* 3 artifact pieces - run drop table "artifact_pieces" 3 times http://dev.glitch.com/god/drop_table_edit.php?id=91
	* 20% chance of 4th artifact piece - 20% chance of running the same^ drop table for the 4th time
	* 1 gem - run drop table "gem_equal_chance" http://dev.glitch.com/god/drop_table_edit.php?id=95 
	* 50-2000 currants - run drop table "petrified_rock_large_currants" http://dev.glitch.com/god/drop_table_edit.php?id=94
	* 5% chance of Small Petrified Rock - "petrified_rock_small" - http://dev.glitch.com/god/item.php?id=1355
	* 2% chance of Medium and Small Petrified rock - "petrified_rock_small" AND "petrified_rock_medium" - http://dev.glitch.com/god/item.php?id=1355 AND http://dev.glitch.com/god/item.php?id=1356
	*/

	this.apiConsume(1);

	var results = [];
	results = pc.runDropTable("artifact_pieces", null, null, null, null, results);
	results = pc.runDropTable("artifact_pieces", null, null, null, null, results);
	results = pc.runDropTable("artifact_pieces", null, null, null, null, results);
	if (is_chance(0.20)) results = pc.runDropTable("artifact_pieces", null, null, null, null, results);
	results = pc.runDropTable("gem_equal_chance", null, null, null, null, results);
	results = pc.runDropTable("petrified_rock_large_currants", null, null, null, null, results);
	if (is_chance(0.05)) results = pc.runDropTable("petrified_rock_small", null, null, null, null, results);
	if (is_chance(0.02)){
		pc.createItemFromFamiliar("petrified_rock_small", 1)
		pc.createItemFromFamiliar("petrified_rock_medium", 1)

		results.push("1 Small Petrified Rock");
		results.push("1 Medium Petrified Rock");
	}

	if (results.length){
		var msg;
		if (results.length > 1){
			var last = results.pop();
			msg = "You got "+results.join(', ')+", and "+last+"!";
		}
		else{
			msg = "You got "+results.join(', ')+"!";
		}
		pc.sendActivity(msg);
	}
}

// global block from petrified_rock_base
var valid_tools = [
	'ace_of_spades',
	'class_axe',
	'fancy_pick',
	'grand_ol_grinder',
	'hatchet',
	'high_class_hoe',
	'hoe',
	'ore_grinder',
	'pick',
	'shovel'
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Petrified Rocks are awarded for contributing to <a href=\"http:\/\/www.glitch.com\/feats\/\" glitch=\"external|http:\/\/www.glitch.com\/feats\/\">Feats<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"collectible",
	"petrified"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-42,"w":37,"h":43},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIW0lEQVR42u2YWVOb5xXH8w180elV\nUywwttkFSGhBaJdAG2hfAIEkQGwCiU2A2SQWmd3YYKgXXAxecBzX4ODGxI1D62x20wn1TNJe+iPw\nEf59nseBqWd6Ebz2ws\/MmffVeyH95n\/O\/5zz6qOPPpwP53Dnh7\/cM8eb\/Runass3euqdR\/5vwHZ3\ntiLri1PPxyJBJFpqWEy31+\/OhGqPvlewf\/346OjtC7M7s90hxBurMU+ulwbacSXWhbXTA1hN9O9N\nhmt97wXu2dcPYovxbiz2tmJ5qBOXBztYrI32YnWkhz1b6GlBl8+B9wC3HXmwfgXnos1MLarcHLlf\niUfZ5+tEvavD3Vge7kRzhQXKgmz5O4P799Onv\/npyc7ek+27WJ8ZxPXJXlyOdzC1Fk+FmXproz24\nMdmHe388C49JC5WIH3tngD8\/2Vl59s0X+PGv9\/GPR\/ewvbZEau0U1ueG8eUny\/j2\/jq++\/MtfHXv\nJrpCtVDyc6BTyp6\/G1P8\/Sv59w9uY\/vaPB7eXMKDtQVsXTqDhzf+gJ+f7uDx5g2snj2Nka4Q6txm\nqAgcBZQXCiFV6t9+mp99+3Dn7tIYPj03RCDPY+vyHLs+un0ZW6tLiHjKECjVHoRVWQiVIBcatQoZ\n2bkrb129x5truH12ELfnYkw5CkeV3Lw4iYlwLYYbvBio9aDRbkCduRilUgFcVjMkRVJkZOXsaXgp\nb695\/\/Px9sad+TjuzI+wVD7Z\/hO+\/uwGbs3FMdbsY3D7QSFNBE7M46K83ANufgFy83lQK2RvpycS\nU\/i2lqdwdylBVFsgtTcPCnthKPwS2H4ketpQolFBo1GjSK5EVi4fAqEISkHe3huHuzYbX9m8OI4N\nUnufX51jYO0+O8YiASz2t7wM11SN8aFeJE6PwuV2o0ihRl5BIQNUq9XMMAp+9twbgxtv9c8lWvyY\naq\/D1vL0i\/oj0VJpxmxPI66MD2C+v+MAbnp8BP0Dp+CtqgJfLIVIqmKh0urhspmhIYZhkLyc1091\n0KqV15QVw2dUY6EvdABHg6r5xc1LWD2TwNlTbQxwJhFDe3sb5AoFUtMykS+QMDiJQoNgfRCVbgcs\nCjGKcjMo4Osbxigp2LWRNhFr8jKo+1dmmIqfXZ7GrYVxXEoMsBgP1+HcxAhWV1dQUxtARk4ejqdl\nQFOsR6W3Ci0tIbS1heG0WUC\/j5ee+kuqc159ulgVIl\/QqkNXwImpaJAZ47vPP8EG6XvL44MHcFS9\n6cEorl1bxfnFeYwmRlGkKoFQJILL5UQ43MLgfL4qKJQK0nZIw87NBD\/9+OupaJTwn18Z7cDyWCdu\nzvbh+wef4tqZMQY110Oc2+zHKIlEtBUzZ2Zx8dIFzMxOoW9wAGaHG0oCU1lZAb+\/GvUOEyp0CtjN\nJlaDJDPIOnYUwqyT1DA7h4YTZJ7g1llKsDrRw5rwN1s3cW\/lPC6M9jEo2oSH6iowSlI7NDSA\/qFh\nnJufOwCs9PmhUinh8bhR5XHBqSlCeYmcNOwySLjpKMxJB\/kNZKYkvZqrnRreEQpxZ2kcP3y5ib9t\nXj+Aqzao0Ot3obvagb6uCNqjUYydnmBwNL0agxl6YyksFjPcbhfZZIphVxWy2nPbLVAUiRlYftox\n5J1M2Qc8vIp+k\/qn9fkE63lXJ\/vJpHgB5zdpmGNpmrzeCjS1hjEQizPA8cnT0JVaYXc44HQ60Noa\ngtugZep59UpUuuwMkjqZwnGPJzNAGqq89MO9GvhLNRvzg23MvZNtQaaaRS46AAxXOdHTG0VNsAGh\nSAcDnJqegNnmgF6vI+l1MXPUOEqZgg02PZrq\/GzsOY0lUBdwWR1SNbNTOcg5zokcCrDKoFoZjdSw\naUGBWl2lLwGycTYSg9XhRKFcg0hbBC1EMQqn05Ww9DY0BNHgsTLXFmScQGt9DaqrqxmkmzhcLS2E\nmNRj7okUZKT8fuNXw+mleb+1qyR7tQ49FgZbEK2yo4nUpJWkxqWRMoOEPWbm4HCklY2yApEENruN\n1R51bmNjAwIBPwL2Uoiy0xigt6wEjXUBaEt0UGmK2WwWCQUQEDencT7+9buiWyuL0F3Oa1KjxWtB\nNbnWk55I1aOA9L7JYWSjbWIshsbmZsi1BujLbGjraGfO7uvrZSkONTdCKeZDlpcJp7qImcVeooTL\nYkIRWcH4AhHKjMbDjT2vXhGhNUPbw7nhKLrrq0DbTl\/AzeAoJIWlSu4vB7S9lDnLYbC6MDQcYzUZ\nJ9eGhnrWD60laujE+TAU8lmzpkG3neyc\/FdbHOqt+l0KWOs0opOAVOgVB7W3D+kpliHkNLFnI6EA\nRrojCFR5YXNVMMDOrk4y7nSw2YizSfoNWhWKiJLUtbK8LBQKC\/BxEufVxl29U3NExcvekHAz0OA2\nIUpGXmellalIo7xYziBp7EPuL6qdVQ4EKlwMSlwkJ5uMjhmDfpaIRfQNj9TkcQj5vFcHPJjJUqE5\n3lq95yiWshraB6QbDoUjZmLm8WhlrCSI+5mpBttDrBZ1JjNbuxwOO4xGAyQSCYq1GjKLU8Hn8cDh\ncMyvvXbV2nW+CtJoabPt8toYwH8rSIM28bZyC6tLqmJHvR8+vw\/pWbnIyskly6oKcrkcIrJECLmZ\nEORxKeCbexUlKj13a1\/UnZ4UOh36tC8GfzHPfrRX2hDwErMY9OCkpCKZhEAgYGA0CrhZ4GeehFAo\n3CPPuW8MUC8ukCt5OSw1dEzRTcShlrAJQSNoeWEcY7EGMpkMycnHdlI4nFj2yWNmXkrKu\/kbLjft\nmC8zOWmPjica9KWcjjEaZlKHGqWM1FjhrlgqfXf\/w\/yvk5n8O24mJ8mXkZIUy0hO2qWwOamcvfy0\n1NhHH86Hc7jzH3bgo+TOlDrsAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/petrified_rock_large-1349210493.swf",
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
	"no_rube",
	"no_trade",
	"no_auction",
	"collectible",
	"petrified"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "crack",
	"g"	: "give"
};

log.info("petrified_rock_large.js LOADED");

// generated ok 2012-10-12 20:25:15 by stewart
