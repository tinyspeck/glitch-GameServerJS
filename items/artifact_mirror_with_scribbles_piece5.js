//#include include/takeable.js

var label = "Piece of A Mirror with Scribbles On It";
var version = "1350087161";
var name_single = "Piece of A Mirror with Scribbles On It";
var name_plural = "Pieces of A Mirror with Scribbles On It";
var article = "a";
var description = "One fifth of a shattered mirror. Combining all of them will undoubtedly bring good luck at the expense of whomever broke it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_mirror_with_scribbles_piece5", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1309\/\" glitch=\"item|artifact_mirror_with_scribbles\">A Mirror with Scribbles On It<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-15,"w":36,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE3UlEQVR42u2WW1NTVxTH\/Qa0D1gv\nQCAi90uIAuESgpBAggm5kBBI1JAr92uByPVwLRgVAqIiChHbqi1qptXOdNrpnPrQZz5CPoIf4d+1\nD0XROp3pjIWHnv\/Mmuw5e5+c31p7rbX3sWOiRIkSJUqUqCPVL8+8vb+\/DEQn+pW835nLe+xp+R+u\nef3S3\/v9Azv\/ZN2G9WsXY+FpDR+eUvN3F3T8zSkNH1kx85vLBv7RHevyzztu4ycF3Nlsju1sNUOj\nTIKlNhl+W6rq4PwfP3klP35zGQSIHx458fVtCxZGqzAQKMLsUAUiK0ZEVs0ITajR7Zah\/VIOOi5l\nxeaCSn71K4PqnZMB7sltK3f\/ej1372Y9t0m2tWTqfbpuz\/9HwNkR9ZvtWw14sGTE4ng1og+bIuzP\nmH27buVDk2p0ueXobJGhw5WHAb8cY90KzA2XIzRWgZHuEkwNVWJpVoul6RqMdBXjamcxPS\/FeF8Z\n+jxybn64nAvP6mJd7kKM0vPZ4Qpy5hyCnQo8jzTjxbbzzetXAddHAVcmFHwwkIexznMY7ynCSGch\nvI2ZaNRJYVJLoCo6gVL5cRjVSfDb09HvzcPaXDWmB0oQbD+PxVEVNsNG7Gw20YccuBuqw8xgGdYW\ntDS+KPySs3i60YjwTA1FOBeXzenocuVjPqhEn78QK3Na3Lmmj34UcGO+LDLVU4CeK1kCADOvLQ1m\njUQA1JSdeg+QOTPTRxG9lCmsY2sMFxJRfv4L9PvklAqN+PW5B+FZDcFko7slVwBk9h3NjfWWYGGk\ngtbKaDcoih1F+LK1CD2+wt2PAt5fKOfYR1ub0t8CeqzvAA9GMEBzzBlm++vZmn1HXA1paHdkIDxV\nKQC0ObMQcGbD78hBH8EzuK0VE6ig8HjdihuTGsxQHrOUCE1UsXze\/S3q+XuhBVuz8x16KWfXpfCN\ndSm77INWrRS6SkmsVB4fUcjiXQZNgqrfncuz6I205QkgDsOZt4DMEQbc15KNfk+eMDZUJZIlEWgm\npU8xBlvlQiSDnefx6vFlbK9ZcMWSDreV3vOydKnGRkhPhdiA7VXL7r1Fddy\/rvoHc6WSyQ6ZkaLM\nmdRJnJnALVUnJaUFn0l89vQYSxUGz7a\/VnkaJtqJAU8Oro+V48mGjfJNIwC+eNiMZ1t2bN8yCdDb\n1AluzdVisE0Bn0OG2\/NarM1r+U\/asgI2adygL4drd2bwVm0yf0FxMmbTJWPInytE3e94l4\/MFsdU\ncBpT0GxIRpNeQpWdjxucBhs39Fjm1NQlqmL\/+UHQ0nC2d9CXKxQhy9OpIZUA52vOQl21BE0ExwDd\nlPdD7UXoapETqJzm82DTp0UP5bTqcWXtuiypqFKcROPFFDiMZ1BfkwxLXSqclgyYaqWoUSaiUnHq\nPSspOB47FECvJUWir0yM7hdSq4NalD0DZgK0G1KpIFOgrUigCJ+mvE1ALY3rqfB89iwc6rlvr5NG\nWQFNdhcgdLUYTfVnYSE4S41EOGaZsfamVSVAR2ak8aECsiIa8uXsTnTJ9ormr0Nhr1UlCXDMdBWn\nUVm8138P\/fYUDEjjqFfy+4fCwWZ\/sOkzuCMB3JdZnWg0VUuiH8IxY8XE4Erk8ctHfh+1qT+PM1cn\nuWiLlwmO1yoT+JKCeJ4AOfG2LkqUKFGi\/gf6EwPq2TYShwSaAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mirror_with_scribbles_piece5-1348251345.swf",
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
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_mirror_with_scribbles_piece5.js LOADED");

// generated ok 2012-10-12 17:12:41 by martlume
