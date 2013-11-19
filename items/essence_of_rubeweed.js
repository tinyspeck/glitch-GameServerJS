//#include include/takeable.js

var label = "Essence of Rubeweed";
var version = "1348002530";
var name_single = "Essence of Rubeweed";
var name_plural = "Essences of Rubeweed";
var article = "an";
var description = "The purest scent of gullible luck, boiled down to the point where Rubes can smell it from many many planks away.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 383;
var input_for = [242,244,246,247,250,310];
var parent_classes = ["essence_of_rubeweed", "tincture_base", "takeable"];
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

verbs.imbibe = { // defined by essence_of_rubeweed
	"name"				: "imbibe",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drink to become infused with the potent (and quite unpleasant) smell of Rube",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "You are too dead for that now."};
		}
		if (pc.buffs_has('rube_lure')) return {state: 'disabled', reason: 'You are already under the effects of '+this.name_single+'.'};
		if (pc.stats_rube_lure_disabled()) return {state: 'disabled', reason: 'You still reek strongly of Rube smell. Using this again will have no effect.'};
		if (!pc.location.can_spawn_rube()) return {state: 'disabled', reason: 'The Rube won\'t be able to find you here.'};
		if (pc.stats_get_rube_trades() >= 3) return {state: 'disabled', reason: 'You\'ve recently traded with the Rube. Don\'t wear out your welcome!'};

		var last_trade = pc.stats_get_last_rube_trade();
		if (last_trade){
			var minutes_since_last_trade = intval((time() - pc.stats_get_last_rube_trade()) / 60);
			log.info('minutes_since_last_trade: '+minutes_since_last_trade);
			if (minutes_since_last_trade < 30) return {state: 'disabled', reason: 'You\'ve recently traded with the Rube. Don\'t wear out your welcome!'};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity("Something smells weird—like moss and seawater and… olives? Wait, it's you! Ugh, this had better be worth it.");

		pc.buffs_apply('rube_lure');

		this.apiDelete();

		pc.stats_set_rube_lure_disabled(true);
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Imbibing this will give you the Rube Lure buff (lures the Rube to trade with you)."]);

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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHp0lEQVR42sXX+VOT+R0HcP8Df6rt\nLyvuD512dtv1qKzVrUXQxV1PiAjqIoeIcojKoSwIBAg3CQGFcJuEEAMIBIghdx4IJCQIBEFwASWc\ngqCA13rtzrtPnnYcbceZTjtP+M68J3l+e83ne32+a9b8j6OazXC6ke3tnxd7kFvM9CDE2UcJyQep\nZHkSklxvZtQp141rVmPU5x\/DTc4xSHK8qYgyvVDJYrz\/rkhloDzFEzlRexHoudnF4UAx28sqyTsK\nGc8X4mwvVKUfgSCNgdLEQ+CneoL74z5cPu0C771foi7r6FqHA6vZXkTS+W\/Bz2JAQKYk+SDYMXuR\nG70XyWGuiPHfjmi\/7fbqYVWmuJrjxa3K8QIJRXSwGxIj3Clkbsx3yLu8D1kXv6WAoT7Oy6sCLGYd\nYoo5Xsi89D2uZzBQkc6AKPcIeEkHkB3ljvgQV4R6b8WBXX8gHI7T9PSsbZGWSq9neFAoO9QeYTYD\nhQn7KeDlgB0UMOC4m61S37HRobgHM7PWkXu9YIbsItecO65d2Y\/SlENIj3Sn1mB6xG5qegMObwIr\nPw0Nd4eWS\/R6xyDV3d0uj1dW8PTZCurFPFw+ux+XAr+hEnnyrwj3ccbJg18h2Hc34hPPQ3mnD63j\nNhTrCKYDKziz\/PbXX\/Hml1\/w\/O1bdJgN0BoJtBq0aG5To16vRNfsHDqnZ9G\/sADZvRHw9HrHnYVK\ni2Xjw6Ul4vW7d1h5\/Rqzz1\/AtvIUI0tLGFx8jJ75RxSwfWoGbRMTNqHReHhVdvL4w4fEyqtXePTi\nJSb+BRxYWMTtuXkYJqdhsk2iVKNZu2a1xsyjBes7cqpfvHmD6WfPMbq0jDsk0PxwDsTUNPrmF1Ci\n0a9O9TpGRjbOP3kCO\/D5J4D237qBQalDqyg39jkN2ib4Sz\/\/jKcvX+KtfaN8Aqh6YIN2Ygqacfs6\nNB92yOYYnZ5ZfvH2BSZXBjD6RIuBpzKMvjTh9jM52pZqoHwkQrNNiIa+Ygj6wpDT4wO1rR2q8QlU\ntnfQe9RoLBZm\/Z0c9C+24N6yBpZJCYxzldAsZaF1OQl1TyJQ+dAXgonTyCM8wes8gRSzGyqsEeB0\nBqKorZ6gHZjVxkDu7T0Qj4WjaToe2gUOmuZjIZ47A\/59PwjHAnFt1AN5d\/cjo9cdyUZXJOhdEFK\/\nAWwtl34gS8FAqnkLmAZn5PS7onjEAyUPjqDsgQ+qNGHoHilC6eAJZFu\/R0LnNkSr\/4TQxs9xQbkB\npe1q+oH5ymAoh8qQbdiHS03bEKP7PRLvfEZmPZWE\/vW4Yv0MsV3rEVrzBcIbvkBIzZc4VfEVcuXl\n9PaGKrNFKmyPxeD9ZmispchoPo5w4Vacq\/qazDacE21DOJkw8jtE6Iwz\/L+AVeeJInkQBeSqBXQD\nzQRX5oOVGR3mxmTo7ymH3pAFlT4NCk0ybqmSIFcnQ6vLwpBFiDFrDabvNcPSV0ICN6JAW0U\/sLY9\nGveHayng+EAdfuoRYcBUCauhBD1EEXrbi2HtKPsIODXWgqDKLUhtSqUfKDMl4uatWNztE\/zXwEWb\nBszaA0hq+JFeYPfQEHHLzKSmuLL2LDraubB2lVHALn0+OjUcKFqZKK8L\/A+gaeQamI1xoLVx7R8Z\nJeSWZAr44G4t8oUncL3uLMolQYjgbsZVkQ\/8ORtwnPM76PSZuCL8Br5F61BPRCGsegeSpVfo7Qvt\nwOFR0T+BQ7XQaDPAu+FP4ragTBKAq9U+MOq4UKlSUNLgi\/Jmf4wOSqgKslq8HAO8NyZ6v4vta5DQ\nZ0MmTwBb4IEz+X+EXp1JrUF+82mI5CEQKIIwNdoETqsfkptoBhr6u5f\/HZhUugdqdRq1BtP47ggs\ncMIPBb+Fb+E6xAg3I6n2b9B3Z4Kj8EeaPIVeYJPxJmy2+o+AxTV+4IgYYFd5ULtYoWDiFM8Jvrx1\nYNcfeD\/FdmC6ggWelvCnr93qacHrx6aPgPZdbNCzkVixCzpVOqqkZxHEW4\/TZetxsuw3aDfnUEBp\nVzIJTKX3dafsacbynO4j4IfnYGtrIpKELlT1BLIgVMj93h8zjSYS2OoA4I3OeMxPqT8J1Gsy0KKM\ng6mDS52DY3frIDOxcFHiilx1Fr3AYbJ1L9aeR74qGI3mDLT18tBpLkRbRx5UOhZ5H6dAoWVBqUtD\nnTYWBfIAXKrbg3DxDsQ1HEJTbzO9m6Rn+Cfp8GwX2oYlKCMikacKQmbTMeQ0++BSvRuVGDLRN11x\nsdYFEZKdFC6E7HRyWoNRa9GiUKdzou8utlj870x2ghgWk9W4ikJtKKoVF\/DqzSKu3NyLKBIVWft3\nXLixE7Hi3UhvZJAt2HacEWxFriIMVSaLjda7WNfX52QcNkBPAqW3ubhIXl9xAjcUtPhS\/8+T1TpP\n\/ubIfkCNNgqPViyo6YhBUMUmsMl2rFTXxqX9ZTdkm7DyDQkoVJ9DWtNRhPG3IkxojzOVUDJspR9K\nGk9B15uNPLKptfeCxe0SVOiMTrQD7e9i04iZuKa+CJGRvBk0F8CSeiGyeifO8jfjzPVNVGLEbgiv\n+BqnyeqxZLGOeRd\/OPrGx51kVglTOSDhF2ovLxeoI5HdGooUskEIrtxEBFX8WRsv9WVmNMb9X7v2\nH6zzu9CC4Z8FAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/essence_of_rubeweed-1334274077.swf",
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

log.info("essence_of_rubeweed.js LOADED");

// generated ok 2012-09-18 14:08:50 by tim
