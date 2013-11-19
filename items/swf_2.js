//#include include/takeable.js

var label = "SWF";
var version = "1338601959";
var name_single = "SWF";
var name_plural = "SWF";
var article = "a";
var description = "One of the three necessary somethings that go into making an awesome game. Without this one, the thingmabobs won't scale to the server whatsit. And that's just not cool. So you totally want to avoid that, by having this in your game. Right?";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["swf_2", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.wrangle = { // defined by swf_2
	"name"				: "wrangle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Wrangle all the imagination out of this buggy sucker!",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/xp_give
		self_msgs.push("Every last bit o' imagination has been drained out of that sucker! Optimization complete.");
		// effect does nothing in dry run: item/destroy

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var context = {'class_id':this.class_tsid, 'verb':'wrangle'};
		var val = pc.stats_add_xp(25 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		self_msgs.push("Every last bit o' imagination has been drained out of that sucker! Optimization complete.");
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'wrangle', 'wrangled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"collectible",
	"swf",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-34,"w":30,"h":35},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF40lEQVR42sXYC0xTVxjAcZLpkm0S\nwRZl2TIUNx62UByLY\/P9KKLOoJtuOhPZXKbJghqzGWeWWLfF+aZgrSBSSnkIok7EShWolYcwiwoD\nREd5+ETjYphhMZtZ8u07h3vxtr09LRc3b\/IPoSnw6\/l6zm3w8\/Px6pwTOrJdrVyP2UgOdZTWEa\/U\n4NfpJL\/ndXXFK1Tt6igjInod8VHADJ\/T\/wLw+QQ\/JyrxP8N3xCuS6Ep5Qw2i\/t+nPEHw5PcTPJmM\n76s1KzKE\/HB7vLL7WcJ8xDdyL0BTNumNJFFgQ1wwNM4YD60J0XB1Zhh0LJn+vyJb58aAIeZ1SA4e\nZhMF1r0TCMIuxAaCXR0BlxOioGVRHFxbMg26Vi6AzuXqZ4ubHwvVCyfDd6EBsDZ4uHcggdVy1WDV\nWBXp7UA4j9VMGwv2Re9C07LZcH3Nx9C5eil0rVrcD8c\/NhjctRUJkDFFSWF8HoEEdsEFxuMIzMZ1\nDrNilaSJgVCB2aaOg9p5MdC4KhHa1n8GHV9\/CTc2fAHdaz6h8I7E95xg5DHr8vnwTYi\/E44J5GFi\nq8bDBnAcrGLiKCjHzmJnMEtMf2XYmUmvQlVCDFz6PBGa164Ex9aNcEvT375pKjeYV6CvMB7Hw4S4\nMq7TmBk7RVKNglLsJFaC3dXt9YhjAn0dJ4FtC3kJdsyKhbTFs2jZS9VQuCwe0t58hcLMLjAed0Il\nkw70dZwpoS+DeacG\/nnyt2gdJp3bqpUgjOB+jvYOxIyiQLdVExmnWRUIW2LHw5PHjz12v9bqtmoE\nRjoe7dMKakSBPMzqMk7hJjBG+MORTWvhr76+gXrb26CnupzW13OHfuVhPI7AjnG1bV4nDcjanWe4\n3UneYw3HD8PjR38MZJkc4jRO60dTRGFHseKhAH3ZnQTYbDkFfz58SLttLWOOk4dRXJQMjmBXNqyW\nBixnnGnbFaMh58OZsPG1F+HX0yXQ9+AB7VaFmTlOftWOcLgizPLpB9KAruMUnmkpC6bCo3s9bnVU\nVUL24hmwd\/wI0L\/lD6bIACdYsQBGKhwK0NNhS9q7YAr03rnNrMteD1cKjVC5Yq4o7DCXZKBFBMaf\nZ1b8NNNlPgZ37XXw8OYNZg3bNw\/ghLACpQzylXIokwr0dosipeAoG44Vwu9dnbR7LU3gKC0e+J50\ncdu3TjgCK0AYweVhpUvU0oDeblFkA5D3mr04Hx442mntJ4oGxmleGAe1m78Cy7I5bquWx5WLFcyI\nlgYkq1bqsmquu3MPAi8WmeD+9Tba9eMFzHHmC2AmkgIfkwp0HacQxh8dBFhfYISeqy20tqN5zHHm\nCnA5iDMOBejLYbsbgXV5BrjT3ERrLcphjpOH8bhsLE8qsMSHw3Z36AioNR2CW42XaS2Hs5njFMJI\nBixXKtDbLYqMchcBGjPg5iU7rTk\/y+M4hTgDV9YEfM50iUBvtyjyPtuJwOqsA9B9sZ7WZMpkjjNb\nADvElRkXxgSuG\/NCoiiQBeM3AQFWZeqgs66GdsWYzhxnlkIAww5OCIIfx\/l7+cA6TPzfJUc93Duf\n7k4Z7ECgLSMNHDXnaZcMeuY4eVgmwgguA\/thrESg66qJ7U4CPKfXwm82K82euY89Tm7VCCwjMgjS\nse+lAl3HKXambUdgpW4PXKssp\/2Snuo0ziwXGI8jsANckoGu4xQ7034aNwIqUndB21kLrV6fIjJO\nuROMx+m5tkoFsg5bfhMQYHnKDmgtM9PqcDVZ4xTC9mO6oQALxA5bpfvuLN+UDA25Bmg+dRJqU3e6\nbQLhOIUwXUQQ7MM0UoHkylMEqEwKWRKitJiNtTtz3g+H\/NkxzHHuF8BIadgWFnDMMO3qQL+Rg\/pv\nqwHRWYg+FCnXYja3cU7wPE6dAJbKJQZMDh7ezVy5wV4ZYQGqgxGypPQIuUYfIbfpI+W9nmA8Tksb\n7Q6UsmpSrv2RASFp4bJEHaLTEJ0aLu99CuvHCYHJY4Y3Jo\/2U\/k9z2sPolMQjTANIm3a8KBeAvT4\ngcDl+hdB4g0JaFX2WwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-09\/swf_2-1316567436.swf",
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
	"collectible",
	"swf",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "wrangle"
};

log.info("swf_2.js LOADED");

// generated ok 2012-06-01 18:52:39 by martlume
