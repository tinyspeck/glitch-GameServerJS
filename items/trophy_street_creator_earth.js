//#include include/takeable.js

var label = "Street Creator Earth Trophy";
var version = "1340228514";
var name_single = "Street Creator Earth Trophy";
var name_plural = "Street Creator Earth Trophies";
var article = "a";
var description = "This stunning bauble marks a remarkable amount of street-building by the holder. Enough to collect all five parts of this fine Earth Trophy, at least.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_street_creator_earth", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by trophy_base
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
		'position': {"x":-35,"y":-66,"w":70,"h":67},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKRUlEQVR42t2ZeVDU5xnHYTpJa2x0\npiadGKMkcqqcgqDcCIgggsGbU45wrsBys7Dsciz3fR\/Cisghyi2XyC6CiIiwKmqTkIQaj8nRce3k\nr3aafvv8fgh10jaxFdJOfzPf2Zd33+Pze973fd7nWRQU\/l+fp0+fbrp5cyZ0cPBSh2R4RDp0WTL\/\n5TffyL569kz65OlTqezevfOPvv5a578CNjk5VdvfP\/h9V2cPenv7MTgwxKqvbwDdXT24OjGBa5NT\nGJKOoKysQpqbm6v0s8BNTk+bE8Af2ts7WZjhYQnGRq\/i2rUJTFy7TuVxSCQjIHhc7OnF5SEJujq7\nUVsrlqelZTqvKNzY2JhpU1PL920X2lmAiWuTmJv7HI8fPcFnn32Bjz+Zw737H+P2nbuYmppmgQcG\nLqG9rRMNZxpRWVGNvLxCzxWBy89vXSUUpcvOnm1CP1nu9\/MP8Oc\/\/eUn1UMvUlhWDqFIhPhEPuJ5\nCX\/NzFwBS6ZkZBXwhMk47umB+2Sll4Fj1HdpGCVV1cjIzQNPIERYZBTy8gvlsbGZa5cNLje3VEmQ\nlo6PgoPhFxCAPz777qUBywiuvKYWWfkF4CenIjwqBie5kUjgJxUsG2BF7WlxXkkp\/ENCcMzdHV09\nF9nJJ6duondwECPj47g6OYmx69cxPXsXd373CWZuz+LW3ftopyWuqW\/4O2B0DEFGw9vvI+jr669d\nJsAz8+LmVtS3nMdxDw9wuFykZmYgNSuTlq+S6pvReOE8Ovr6MD5zC1du3MTQ+HX0S0bRdeky2vsG\nUVp9CgmCZBYuJCwcASEcpt7r1Ze3tFSp9FQdas82o7axGYI0EU1Wg+b2DqSkZyA9JxtFFeU429qK\nMQIbJatKJiYxQO7m4vAI2sk3nu\/uQ0vXRcTxkxBKyxsaEYnI2DhUnz4jfvXTW15tUVBegwrxGVSe\nboC4qYXgOtFOzjk8KgoxCTwIRGlIy8pCcVUVWrt70Ebf9UmuoGtoGBfIeucIbo+DA1w9vBAcGgYu\nLXMLveDVmzPSZQHMKSlHcXUtympPo5JA65rOoamtHYEcDgI4IWSRCNpb0TRxNE5SmTmtJVU1rMVd\nvU4gIi4eO03NoGdgQEt7EpwwLgKCQ9B7efjVAbOLy1nAvNIKFrKokqxZV4\/iymq4eXqyh8bD2xue\nvr6s3Kl81NUVzgcPws5hH8ytrGBgZIRtWtrYrKICNwL2JzhPbx\/4BQW9OqCrr69STnE5cgmQgcwv\nr0IB6cMjR2G9xw72jo7Yf+AAnFxc4OxykC3v3eeI3ba2MDE3h4GhITS1daCiqgZVdQ32cIRGRCGY\nrHjg0KHlcTVpOfnynOIyMJZkFMXjQ0\/fAEa7drEQ5la7YWltzcrc0gomZuYwpO909fWx09iErOZN\nPpRDy8\/s2URkFZaAxkRckpC\/LIAZBcXi7KJSLEIKM7LhGxgEMwtL6OjpsXtr+44dJEMWSktXF1s1\ntaBP1ktKy0AhbQdmazDWp7GQSYDsZ36J1rIAcuP5FlmFpWAhCZAnTFlwuCRv\/wBaqsOsFY1MTMiq\nxmQ9Y9jstSegSpTTwSqpqWPhmL6LcDTe\/WW9i+OFqVJmaVKycpbgfko5JWUoqjqFvLJKFi6bVoCB\nS88rRHZJicmyAjKHhQaXM5AJdGVxY+J+EjAlK3dp3y5ZL7+IAItyViTkcvP29UrOzEFmQQlEufmI\njOP9KGBMYtKS5RiJyHKp2XlihZV8fHx8dOwdneZdDh9ho5Ko+H+EXLQuA5RF+5axmii3gPmsWDGw\ngSGJ8+3Ze5DdmkXLhTZEE5g9+bt9Ts5wJYftQY43gHOSVXQCnwUTkrWT6cSnEVw5BQsNzecwNS3D\nzK078t7h4eXLUZqbOzc2tbTKH3z5CJekUogysyBMFck5EZEdFlbWUktrG9jY7cUeewfsodNrY2fH\n3iJMnaWNbQE3Nk4afDKMjYQu9vXj4cPHaOvulhcX9\/1yWQB5fMGRKF48G1I1tLYgIiYGTh+6IEEo\nFLd3dTkfc\/Oc9wuiWNHDE0fdPNi9GcdPnj\/i6ibLzMvTCQnjyo3Jedva2zN90NrZgbqGBooP0y2W\nBdDFxUXphJ+fnBsTwwYFLkeOwGG\/E8KiYqWDV0ak9vs\/tIiMT5yP4wsoUEim4ICH5MxcKVnM4piH\nhziIEzbPWNmIbpXj9BJR8fGIT0qSLeseDAkJUXL38p7n8YVg5OsfiKSUVHlhSSl74bv7BOgkizLl\nOUVlCOFGyfz9\/dloOSCII6XYTxoTl4DFvl4+vh3LFk3\/q8d+\/36RlY0tc\/8uRcWnG1vkVeIGckNF\nS1GKrZ19mPlua+x1cvJS+DmfBw8e24ooSD147Nj8Yp0gPZPgiikQyFsCNDQ2kSdSfDgzM6Ok8HM\/\n4zduIJrHw45du9jNzjjmxBTKf+laZP42MjZ2ZvbeyOjY\/IrDPHzyTdjc5w8Fstk5wfjkrKCtZ0hw\nvqsLsfxE8oGB0pr6HkFYdCwYRcQlzhdUnBfY2DvKGFeTV1wyX1XfK6hpHBSIm4cEDW1XBOd6JgQd\n\/dOCHsnsq\/24BGDts2ffiR89+Raffv4QM3c+xfjkHRSV1SAiNhZeFEVzoxJQXd+NguIaJKflIiFJ\nBH8Ojxy4N+sLffz96coTo+bsAOqah0CAaOm+RinpNLou35ZfGp37z9xN69DNtV8+\/lb2xYOvcO+T\nB5i+M4erN+5BMiZD5alGSpp4dCID4HLYFZ4+Iag704HuvlFWlae7KUdJwgnfQGoTCPcTARSmFaC+\nVYLG9lEW8ELvFDoGZeiV3MVF6e1\/\/xAdt3OUBbr7ghGPE84q4WQ4EkPDwQ\/lIonCdmF4BJK5EUil\nVDItMhKiqEikR0chnTK+NCqnUl0Kd6EN1y8AHE8\/BHv4IchjYdwXZaWu\/tK\/2Shqvq5wVG+VIha1\nnaRP2vGGIgxJO1crYhfJ+NeKMCGZkszeVIT5CzJ7LtPnbZi2TD+j1QvjGLyxMO7iHLqrFF7Keb8W\nZGakbb5u9d0X4Qx+AGbyHMiCZLlGEbtJ1msVYfuCbNYu1FmtWWhn\/hz2h6D6L0AeUn73R624Suk1\nBT0fbdVn9hvWYd\/Gt3BU\/T0cVtsA\/x1q8NNXge92ZXjrbcYJ3ffhpaMED+1N8NDaCHfN9+C2bQMr\n160blspuVO+uuZFtc0jtHThuWof9Sm\/B6f23cWDzb+Gi\/A4Oqqxn53B4bx0Obn4Xlm+\/+U\/3469I\nv9FXfv+cqboyFmVGMtdQgcUWFVhuVcVukvU2NdhoqsFWSx17SHba6tirrcHKXkcDDjoLn4wW6hfa\nMe1tqR\/TfzfJisZixmTGZuZYnNNo8yasX7\/elHheX4T7BenNNWvWqCh\/8AEWpaqsDHVVVWxRV8e2\nLVugtW0bdLS0oKujg+2UzRlQNmdImdtOSsyNmRSUkiYzU1OYmZmxMqWyibExdu3cCSNqs4Pa0x0M\nPcr6dLW1oa2pCc2tW7FVQwMaampQo8ReZfNmdu4PlJSuE9M60ur\/+f8m\/A3I65d8omQehQAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294431614-7109.swf",
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

log.info("trophy_street_creator_earth.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
