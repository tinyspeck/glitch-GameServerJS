//#include include/takeable.js

var label = "Juju Trowel";
var version = "1339199331";
var name_single = "Juju Trowel";
var name_plural = "Juju Trowels";
var article = "a";
var description = "A rustic trowel fashioned by Juju Bandits for delicate digging in the dense savanna dirt.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["juju_trowel", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.dig = { // defined by juju_trowel
	"name"				: "dig",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Something's buried here. Get digging!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var q = pc.getQuestInstance('help_juju_bandits');

		if(q) {
			var can_dig = q.canDig();
			if (can_dig) {
				return {state: 'enabled'};
			} else {
				return {state: 'disabled', reason: "There's nothing to dig up here."};
			}
		} else {
			return {state: 'disabled', reason: "You have no reason to go around digging in the dirt."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity("You dug around in the dirt.");

		var q = pc.getQuestInstance('help_juju_bandits');

		if(q) {
			q.doDig();
		} else {
			log.error(pc+" is trying to dig for the Juju Bandit Quest, but has a broken quest.");
			pc.sendActivity("Whoops, that dirt was broken somehow.");
		}
		return true;
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

function canDrop(){ // defined by juju_trowel
	return false;
}

function canGive(){ // defined by juju_trowel
	return false;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_vendor",
	"no_donate",
	"no_discovery_dialog",
	"quest-item"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-33,"y":-20,"w":65,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGt0lEQVR42s2Ye1MTZxTG\/QZ8BL5B\n+a+CrWKdWiujgyIooJh7AgQIl4RAAoRwDRhIIIQ7WSBcN4RwLQhI1I4z1lYYxxGm7TgZpzPtTP9w\nP8LTPa+zNlJRO5OAO3Mmy+Zd9rfPec45uzlx4jPYJu2Z6dNNN8LrHnmYd2SH\/Q1ZHO\/ISvgc2E7s\nBCsS\/fZMYaIhC1L46jKw5Lq1e6xgz+5aZc+3arEfrscfT1qxs2DCqO0anKUX4SpPw6DlCpz6tMRj\ngXu950zc266NvLhXi+CACstcPnbWLFjzFcCQk4LstC+gv34SZTmnU48c7uWmOWF33YoHc2V4FDLi\n1eMWjLRnw+\/Owy+r1ajSnoVBnoKSvGQUZKUcPeDmgDZh26dLXxxR25Z8mlS\/+1bkp2UzOqyXsTCs\ngSX\/HIL9Kngbr0GvOnW0Kd7oVaRuDapx1yNHX3U6Wk1pwpRHJvQ1Z2K6R4ahthuo1p3FeHteiFJe\nIk9xHR2cV27Y9Cqw7MpjxWC89TUcRRdEyIsgwEC\/8k1qbyfLhOcdSS+2bWgyXggfSUo3euTh9W4Z\nZluywYktpEp2BhONWZhqug6T4jQ89qtw1aWjRJEsk87bv1+PAUdWfAH5lpzUFVeeMN+ei0kRaMh6\nBXdKvmef4\/WZ6CxLgyH3FMy6MyhWvFsQBDjpuR2JG9xEQ6ZLarwE4628jG7jJbZPPY5AS3O+gv5G\ncjhaOWn79YF9l9IeF7jBmozQTGsuxuzXWUy15ICzZaJfLIwOsRE3FZxncEU3ToYO+x8iYJiqOi6A\nHuOlcG9NNlqrVKjVnGepnGzOQbuomkVxFvqsZBTfTBHEotj9MKA6Ph7kWnWuH7eW0ePpgtGQj2rF\nOXhMl8VPES7zpFB09cskgzyZo6o9UkCq2CcPl1L3954L\/vFRNNht0KgU0GScYoBW5Te7BEdr60q+\ntX0I8OWjpt2YAr5+6UjYmioWtlZ88HY7UWO1QK9TQZN5mvmt23SZ66n4d\/jTJCHAYWfue6fFXzvt\n4mRRCzGB+\/1RU\/qrx82RxREtAn1KLIwUiHB54YyMjENH1ZMlUypNj7Gu3PTDAWNUJA8CZeAHirE2\nXgjZzStCTdF3to\/N0b171sTtGQMOS2NMAIPBYOI8z6e6HWb09faAHywCmf9Tz\/95pSpCEKvDqsT3\nAg6pI\/8TaCZpjucNc\/xsyO8fj4wMD6GluUms1m7Y6mpRXloIoz4Li4vzsk99aL3Pl4ogGu7g86JY\nxf85fqhKAZ7nxkZHI57uLnS5Xai31cFSXYWK8jK2T3DFRXoo5DKoVUqMj3HQarWf9E7xdNXCrfsL\nGQx1ATr29zOn4WGwXJD+\/rBiAV4Y6O9Dm6OVRVNjA2prrDAZK0DHZ2em0eG8w44pFXJoNWo0Ntjh\n6XJ\/cot4tl5jeLFdh98e2oU\/n7aF9h\/U2x6J7yofPVFMZXiU86G7y\/0WkMJ5p51BTU9NYnhokO2X\nl5UiX6dlN0BpJ3CFQhG\/J2JSb2pyAt4eDzo7nLjT3sbAKEgt\/\/gY856jtQVlpQYU5OsYnKuzg60d\nG\/XRuvg9LpHv+nq9DJB8RxcmJQliwj\/O0kvgpByllVQjeFpP6+gct6sDKpUqMQ7qBRMl9UgluiDt\nU5HQcYKTioV8R9CkGq2ldRRU4XQjKoVCFhf16ALSxSgIip+dYZ5zuzqZYpRWgiTlpJuQgvwZ4Geg\nVMq5mKtHBo++WK+3h12wv6+XFQRVKbUV8iIpdxCObkasfiyEgqKC8nDc1Rsb5Vj6qIJbW5phrCiH\n1VLNfBmdVgrON8LgVleWxO+dsQWMVk+6MKlBCpFSBEhPKdSkD3qOYnCgn7UXAgxvb7FGLqbYFlP1\nyGOkDBWBlN72NgeDI9+R52hf+v6gFQjw7voPGBrsh1atjsRUvZnpKaYM+UzyFrWS6CYtNeqDcHRj\n5NPNjXXmPUNJcWwrmNQjBUilg0DRQRUcrRh5LsDPMjAKUo7GoEal4mLuvYNw0uSgoDRTemkNWYAm\nSWh+Dutrq5gPBpji5E+aKjH1XfTUkAAJiJSixixNEuk4VTh5LDjHM7Xs9TYGVmkyCvqCAlfMJwfP\n8wmid4TqKvM7ykm9jcCpzSwvLeLe1oY4SfzsRgiKwmqxcGajMT1+DwWBgE0a+lQcpBZBvelns7gf\nvsc+u9ydb6Es1WahxmKxWa3W+P88Rs97pBb1O1JqITTPfLW4MP82hVXmSmrOEWN5qUunU6efOMrN\nNzxsIOW8Pd2gd1lSylxpYmY3FBeHCwt1BqVSmXSsP2hTv6LKo1DJ5ccPFLX9A8mk+mG8BjRsAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/juju_trowel-1334278093.swf",
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
	"no_vendor",
	"no_donate",
	"no_discovery_dialog",
	"quest-item"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "dig",
	"v"	: "give"
};

log.info("juju_trowel.js LOADED");

// generated ok 2012-06-08 16:48:51 by martlume
