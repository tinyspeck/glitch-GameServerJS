//#include include/takeable.js

var label = "Essence of Yellow Crumb";
var version = "1348002530";
var name_single = "Essence of Yellow Crumb";
var name_plural = "Essences of Yellow Crumb";
var article = "an";
var description = "Purest concentration, concentrated, for those who need a more expansive brain-span.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 541;
var input_for = [247,250,307,309];
var parent_classes = ["essence_of_yellow_crumb", "tincture_base", "takeable"];
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

verbs.imbibe = { // defined by essence_of_yellow_crumb
	"name"				: "imbibe",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drink to gain remarkable mental clarity, increasing your learning speed",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "You are too dead for that now."};
		}
		if (pc.buffs_has('crumbly_thoughts')) return {state: 'disabled', reason: 'You are already under the effects of '+this.name_single+'.'};
		if (!pc.skills_is_learning()) return {state: 'disabled', reason: 'You must be learning a skill to imbibe '+this.name_single+'.'};
		if (pc.skills_at_max_acceleration()) return {state: 'disabled', reason: 'You are already learning at the maximum speed.'};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity("Your thoughts have focused down into a single point. Direct application of your dangerously sharp mental acuity can pierce any problem, increasing the speed at which you can learn your current skill.");
		pc.buffs_apply('crumbly_thoughts');
		this.apiDelete();
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Imbibing this will give you the Crumbly Thoughts buff (double learning speed for ten minutes)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	if (pc && !pc.skills_has("tincturing_1")) out.push([2, "You need to learn <a href=\"\/skills\/132\/\" glitch=\"skill|tincturing_1\">Tincturing<\/a> to use a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	return out;
}

var tags = [
	"tincture",
	"tinctures_potions",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-39,"w":17,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHlUlEQVR42sXX+VPT+RkHcP8Df2q7\n222HcWZn2q5tqSuu17KIW0HFY8GAWg\/URcXdVSsqXVGIyiUoylhFrhCOREg4ArkMub4kkJAASTjk\n8iDchCsBAgioffeb73YyMp39pZ1v+Mw8k\/nO5IfXPM\/n+Xyez6pV\/+Pi3AvxepoSFn7\/H3sfPGF+\nQ3BTQoniD4IVH0wU3w1jRp3y9161Eqss\/RBK0w6hODWMiqJkBljxIe7v3NshyLkVjNSoQJwMXufn\ncSD3HsNSfD8Uooyj4KYwUJh4APkJIciK3Qf27WA8+HE3oiP8EBa4Fvw7oas9DuTcYxBxF3aAfScE\n+WRk3tyLe1cCcfdyIG5+548r4Ztx+fhmV\/awIiXmpDEeFKYyQEJx+fR2xJ4PoJB3r+zE\/ejduPP3\nHRTw3MENjhUBPonfx+SmMZB8dRfykkKQmxiCorsHkBG3BylRAYiJ9Me5MB\/s2fY7wuM4RVPTaqEg\nS5CX9A2FckFdUZASgkc3gihg9IktFPDE4e1WlrrW26O414NDlu5OE5iR28g9F4B\/Xg9C1q19SLwU\nQO3BxPNfU+U9sf8viE9PQPnzdkemWu0ZpLyhwW9iagrTM1Mo42Yg+mwQrp7cSsWlY5vw\/cENOLb3\nzzh99GvExF6ArMUMaY8VT1QE04MZHHQsvX+PxXfv4FxaQq1BC6WOgFSrRFWNHGVqGeqHRlA3MITm\nsTGIOruRoVZ77iyUGY3ew3Y7sfD2LaYWFjDknIV1ahrddjvaxifQZBulgJr+QdT09loLdLr9K9LJ\nPcPDxNSbNxidnUPvf4CtY+NoHLFB2zcAvbUPWQrF6lUrtfpHxyxvyVLPLi5iYMaJF3YHWkigYXgE\nRP8AzLYxZCrUK5O92u5ub9vkJFxA588AXb\/81jaBR7Mo0Zm92qy9bPv8PKbn5rDkapSfAVa\/tkLZ\n2w9Fj2sfGvZ7pDleDAw6Ft\/OwTnbgvnZMryZl8A5b8L4jAqDDiGsk+VoG+BC33wdvT2hsE2cQfuo\nDtU9vWBpauk9ahRGI3N07BHeLcnxZkEL2xAbjkkW5ucy4HTeJ89GJhxTFzFmv4IGw3Z0tAXAbg\/F\nzHQMJu0XwW+oIGgHDvSdwcL0QSzOxWBxPgUL81mYdyaTiB8xMhSB0ZFjcDgiyDhO4g7DYT8A+0Qw\nxofWQ2rOpR9IED9geiwctr5AOCcZmJ+JwOzMWUw5IkHI12OkbxdGbQdJ2BFMjO7C+LAfXnVuRHc7\nA2yNnH6gUhaJ7s4imBsuoVoSjOfmEBL8LabHI9wxM\/4tbP1HIar6ChJxEAQVO8BifY5sSS69s2G1\nwSjQa2PQ\/1qI5805kIqPgl+8GeX8rago84Wg3BcVZJSXfgkebyt4JX4QVjAgqTpGAfMUBXQDDYRS\n\/DdMDaow8lKELlMuLHWpaNQkwai+Db3yJurVt2Ag4tFUewcvLSUY6KxCd3M2WHnrwVYV0Q9s1F51\nA3ta+ehszEGrngWLNhNNxGOYNE9gUMSg3VjgBg6T\/y3ibERuVQL9wFYj0w181ZwFS832ZcA6aSRE\n3M+WAcetClRWbEBe5XV6gQ3t7cTzxltuYFtdKOqfrYGpJpYC1svjUFW0BmWsj0ls8jKgbWAP8kU3\nQOvg2tz9gugwxbuBhuo\/QCP0Qo3Ql0SmQ1q8jsKVZP0KstKQZUCRxB+Fkjh650IXcOQ1xw3Uiryg\nLP8tCfsE1Xyym\/N+wnEe\/xLl7E3LgBrNERRJPQC09XDdQI3QG89KfgNh0a9Rwf4YvOyPKFzBw1+g\nlLVxGbBeHwGOjEkvUN\/S4PgQ+NJSQO67s6gsWAN+zkfgZvyE42Z8ilrplWVAQ\/1plKgS6AXW1Jdh\noq982THT1VREdXFsir\/7mLHUZv9XF7uAfCIJGUoinDagwSzCwoSeAkoksbiW7IvHOUcgFcYh9eF+\n6ORpyMuPoLDnrq9dBmxvSQBPnUTv685gEsFpU7kzmJ4ZhlPRn1KYhLSduMj8nPp2BY8XtQzYZokn\nS5xIL7DeJITFGIfJAbm7xJyn31NAFyoyZi3i0wIhF8e7S9zbzke7ORkS6U6UEnfpBXaQo3udJgp6\nzXfoaEnFy+dZ6DRnoNWQDnNdEpq0CTDVJcKkS4a5\/gaM+jNQqYIglvpDKjsAjUVEb5M0dXQJhocM\nePWChwZ9NAx6cgZUMFCjDEBd7W7o64Kg0wVBq90FNbETcvkOMnP+EAh8oVSdQ5VRhUcqlRd9d7HR\nGN7fpyPnwWK0NT+CrvY8qsVf4F\/vOqCU+0OlDCQjAIrqv5J37ybIpFvI8WsrSnhb8Ex+HoV6o5XW\nu1hlNnu1dNaiq6MYFtNDlPP8wMn\/I+SSLyAUfAmxyB9iIRmyMNQofPB+4SGa6r9CQYEPypS3kaWq\neUD7y67d2mup08aRpb0AcdVhFBdtAu\/pZvBLtqCUzBSfHFRlypMQ8H6PrtZtEFeuJ4fV9XiqLUGu\nSudFO9D1Lm7pNhAKxWUYdAkglFEQVR5CCZccBvI3oIDtQwWHsw252X9Cbu46cMXXPPMu\/nCZe3q8\njJZiZnNbCVumvOaQkWDRsx9QLjyFfLYPkc9ap+QJjjMLhdf+r679NzGH902E\/xZKAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/essence_of_yellow_crumb-1334274148.swf",
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
	"tincture",
	"tinctures_potions",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "imbibe"
};

log.info("essence_of_yellow_crumb.js LOADED");

// generated ok 2012-09-18 14:08:50 by tim
