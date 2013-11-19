//#include include/takeable.js

var label = "Laughing Gas";
var version = "1347906629";
var name_single = "Laughing Gas";
var name_plural = "Laughing Gas";
var article = "a";
var description = "One carefully corked container of gigglicious laughing gas.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 20;
var input_for = [69,78,238,239,306,307];
var parent_classes = ["laughing_gas", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gasses"	// defined by takeable (overridden by laughing_gas)
};

var instancePropsDef = {};

var verbs = {};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
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

verbs.uncork = { // defined by laughing_gas
	"name"				: "uncork",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Just a bit can't hurt",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('mad_gasser')) return {state:null};
		if (pc.metabolics_get_energy() <= 2) {
			return { state: 'disabled', reason: "You are too exhausted for laughter."};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("The tiniest whiff of laughing gas escapes the vial, causing you to smirk uncontrollably before you wisely re-cork it.");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});

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

		self_msgs.push("The tiniest whiff of laughing gas escapes the vial, causing you to smirk uncontrollably before you wisely re-cork it.");
		var val = pc.metabolics_add_mood(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_energy(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'uncork', 'uncorked', failed, self_msgs, self_effects, they_effects);
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
	"sort_on"			: 53,
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/290\/\" glitch=\"item|gassifier\">Gassifier<\/a>."]);
	return out;
}

var tags = [
	"gas",
	"gassesbubbles"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-33,"w":29,"h":33},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJbElEQVR42s2YyXMTZxrGOc01t9ym\n8gfMYW5zm5o\/YA5zmjlNVS6pVGXphABjSGIiIOAFMOAwbWPhTZYtL5IsW5Zae2tt7S21Wmtrl7Xv\nFsIGjCfvfK0MmWKAycJivqq3pEtX\/ep5n+f9lhMnXnL5DX99J2L44GbS9qk5Q500VwLD5gZ70dxN\njCsOS1PvnzjulaU+ea\/oPwOV4NfQjl2BdvQK1NmLUPJ\/CZzlY8WJt2GVA2dzvdQYfF+dhfuZm1AL\nCSBGfghBzd8Fxw5nSLT+wkXEPwKiFg8AkXrgdNwxk1z398cKaEw0IZFP9Hvpm3BYnIZOfBS1+zyw\nrmtgZhkwJhrmYwV0pLvvc7V+rLZ3kI9W7wFfweIeaCPllC3VUpCp5p+Ovc26cEVIxTLj+WJJ46aD\nOMdxiiUtdfqtgHsCaI+kxgrFko4HjMfj8nmV7Yu3CpCKZMaKxaLNS9PCWCwm1VL+sbcKMJrKLPMt\n9tKMMJNO6Sw+5ru3BlAbrmxHkmlJtrCrprw0HghFFjUO\/6g2Wv3bscOhMfK50p+ezJdr6ngqI7e7\n\/XiQDa8oHf5LG1R8QrAR+c3xDelM5x1tpKL1RLgbzXabsbtp3Or04pTffzfOceo5tfOcKrB75vgA\nY\/Upoy92pVSt2XMowRanH7dQbpxExUYiSpXVd0VMBidXreHfvnE4PgA6tiRL53Lb7U47FmCjEjPl\nnSbtTtyIykPTK4FQdHVm0\/KF0p+ZfPPqxWt6dyg+Ua\/XA+V6g+LVM9q9uN7qxHWotDZqimXDBOVj\nFmZ2rIINW+zPbwzOxDUFWrYwhsaKttlq+yPJjIykeDg3grPjGgtflDAcCuvj0bBNpCK\/WrPFZnnP\nvn64bOc9fbSmMIWyZ9rtLtvptJORSFjt8fvXnW63TGexC9WkHfcFAjsGGzWPWr1Jun0z15bUn204\n4+feQGvrEgOTO1eqNvSdbieeyRc1vHo65Dv0B1eRVtxkdy1Qbo9sS2PESYdryUsHpUK5+ey8zju5\nw+z+4bUGwxCrigPJ4nivt5dqtztROhxftru9C1aPR6Qj7UKl0YqgnCKL0ylRqPU4QTrmQgxj1iF\/\nXhfvfC4yBiZeX3vjDb2BzWP1VtfQ63WT7XY7xsWipM\/vl6FQTKsQ3JbegquMFqEcqSdHgHLCNIVG\nzxobCtj0Vsfc2NLOkIopYq8lGKZYdYzNVcd6e3scgovki0WLw+uf5VOrRsHY0iNAHYkrEJwUwUlV\nOnxdpcd1ZtsiGuAbYSbgUOmMM3d3qMlNKv3uKw0GmahLvCw3Vi8kj9r1UrNeLqYCDK2yef13eUDV\nANCC4MgBHA+2rtLgJrNZQXscbqPNs0zTtDFIe2wT89KzMnfy1c1GY7whtyWqQ\/lkOLlX24X9bgMO\nunXYq2ShW0pBe5eDVj4OjWwU6pkwVFMhqHBBKMVpKEZ9UAh7IEB7rSa7czUY8FmVGoPw2opaIPVw\nf3wllyJLsimMRlhZv1WBR\/0OJIoFqFXy\/xdQZzM+BZiN+GqkzbXCQ\/o8HtOlOyunloyBl5uN\/Mck\n19T7uIKgnkvsP+p34WG\/DXI6CCNqLeB6AygoG6icdlDaLSDSaeCWQgHfLEsAE84+BViMeCBI02oe\nknK5lciLs2cnRZiUSnz8UsFw5dqCbCyYfHivPVCvXC\/DvMMF3yrVcEGhhPMyBXy1LoWzK2twZmkF\nvlgQwWez8\/D1ougpwHzICaVUOEPa3WjPdq2F\/G7XrUXp8HeblslfdTXlg2FNt4hwPCHsN0tweL87\nAGRzGdAE\/BBNRkHjdcHwhhy+XN2Ay1IZ3NpSwA25bKDe+KrkGcBaMvjI4fJKSYdbQvs8JrvVsnPq\n+hw2q\/OO\/JqDqJwuNAXNfGL\/8f7eD4BIRS3LwoLFAhsOO6xZLT+oJ1mDAOP90YPregLGJCvPABZY\nF6S5sMvi8Ei8XreSpb3u2yLppS9vLw8RbOXDXxQMV647mUuwoUOk2iEPiH75NuOkFaYMRvhmc+tH\n9YaQ506LxHBybhGub6zDRbEYJITyGcBs0AH9UrJvd\/skDrd3jaU9noVN9dWTV4XYdzLj1SUq9O7P\nCoY51bHG0pnJg04Njg56A\/WeAI6icATjYRCRJFJPNlCP994p5L3Pee+JluAjfBoCPvtzATuZEMQi\nrMnl9soZv5sSK03Xhv+5dPqzKziGZuPVn24t1xphyntjnUq2dXRw7ynAB2j+XdxWQSwVhXu154+Z\nSRlq+ezcM3PwCWCeoaC5m8wGaZ\/R6XJtLm4bR\/BVtYAHHJ5ZFyh82RcfJvg0OTJdIl2uTH7\/EME9\nQLXf+09A2sArumyzwrrd9gwgSihIDVqk3p1Be18EmKFtcNTKQTTCkE6Pe3tphxyZV+hHzt9eOvPR\nt7exWa1n6oWz0ZJqi+OtIyzROjzZ6+8T\/wVE7e214KBdgXg6DsNSOUjMJISiDDBhGii\/Cy6vrsLH\n0zNwQSR67k7yBLAUcQ8AGwUuFaS9dh6QV3FmXXWJB\/zgmxuYmi0PPf8hKNsjeMBC7\/GFQufBeLt\/\nIH\/Q36sPAPcaA8D9VgmoED3w3j\/EvPeWBt77dOYuzGxvQj4RfCFgOeqBwxqywy6XYllGrTTZp5Z2\nTKOL26bR+U3d6OWZ1a94wLtql+AFg7k1kW4fnSnf\/9f4weGRr9w7nM619scrrZ6k3ax5+81Kiwfs\nN3ZhN5cAncsBCqsJ5KQBwqzvuXtxBVU9yeyXOSYZDfk0y0rd5S2T89qGzjEq0dhGl3fMowNIhWF0\nek115czE\/NmdwO7ECxPs390TIQVv8QrmUD14fMQ+evx9odrdF7uS1SEmhe4i+bwsn88SmUyaSCc5\nIsXFdJlUwpFORB1cPOxIREIWyutbWNPav55cM2DXJSrsqkiFjS4osBvLO6dH5uQnh28vY\/xWd2FG\ncholeYwHXNHapzShwupP7s++fO+TWOWeONM8uFXuPZxu9B\/JWv2HROf+Q3N1777MFikOEYE0pvTE\nMYUjikltDCaxBLBlgw9b0LmwOZUDu6O0YLjchP0v4AWhFLtwZw17Anj+tvjUqsZ20xBMbzqihd\/9\nooMC\/zjpynbWLcnWvDXRmDRHqwL+RK0LZLGXAby5qhPMEW6hxBYlNEz+JtpS338l95HBqRqVIdFY\nQJcnoSFaFWrZsoJgioSKKRCqYIHYCeQJpT9LbPkzxJYvQxBsOUmESkn1DyXmv+Xfc37uy9e\/AdRZ\nWFNGJqVGAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/laughing_gas-1334269360.swf",
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
	"gas",
	"gassesbubbles"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "uncork"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "uncork"
};

log.info("laughing_gas.js LOADED");

// generated ok 2012-09-17 11:30:29 by martlume
