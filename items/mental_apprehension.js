//#include include/takeable.js

var label = "Apprehension";
var version = "1337965214";
var name_single = "Apprehension";
var name_plural = "Apprehensions";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mental_apprehension", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-44,"w":46,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALvUlEQVR42tWZyVNb2RWHWaQqS1f+\nAu+y7VU22bi3WaRS2aWShauDwSAhxGBmkEAIxCAQM4hJYhAIARLzaPEAMSNAzDNCBgQIsEBgY7CT\nX867wm7cGbpDOu7kVX2FBFW87\/3OOfdegY\/P\/\/OVZrU+0p9diuvP3khrT6+4WtcVV+PycNpjj6r6\n5PKJ+jUe\/aSChqNzTn96hTpCd3KFmpNLVLsuUUVoji9ReXSJiiOPquL46qsvLiebnfwqZXYGZZsO\nNBy40UiCda4rJqc99gpWkGD54SVKDz0oObhwlzgvxCX7X0g22Tr5VD5hRYFtGSXLm8hf3UXFtgst\nx29hPL1G9fEVkyvjBZ0eqIniAw+K9j0o2Luw5+9dSvP+m7KS0UmpYXkH43suzB6eYtV9iZnTC5gc\nZyjdPEPD\/luYXO\/Q4HrL5Ep4OaKQCXqQR+S+uoBq93wu23EhVjqvH\/+ogokTU1z3lhMWxwkm9k8x\nf3qO1fM32Li4xvblDUYoSYPjChX2azQd3qLp5B2KeTkinxckuRxe0HGB7N0LKHfP3Rn2c41y50cS\nTbfOco3LezDvnGLYcYrJ49eYO7vEgnMDO+4DLJ\/fELeYPn2PescHlGx9QO3eLZop1ZL9u\/R4OSKL\nBDPtF8i4I33nnMuwXz75jwRVMwtc65oTXVTOvu0TWJxnGHddYILKPe3cw5TLA+vZDabP3mPq7AMs\nrg\/Q795AtUpDZL+C8fgdyg6umJzyO4KfRO2epw8WVE7auAZK0Lh6iLZ1J14enGDA+RqDRxcYpum1\nHL\/B8PE1ho5vMHh8C\/PRLfqd79C69wYFa25kLLmg2XGjwXkFzcEbJNociByYhqitH0HGTqINwiYj\n9\/AST8xyVfPb0C06oF9yoO3VETr3TtC9\/xq9++fopYHopYR6Dt6im+igoWkjuWbHJQy75yjfOEH2\n8gHSFnbRTg+TZ12DyNSLIFMXybUTrRA2N+PhJZ6a4dTWVZTPrkNj24BhZx9N9kMYd100yacwvXLD\n6DiH8ZUHTQ4PSXmgp7Lptt2o2jolwWOUrB4gc3GHCcq4aZLr\/ja9ZhPR9HBB+egYp5qYRd7UPAqn\n51G1YUf15h5qtw6g2zoiERfUa8coXnOhaO0EpRunUK+foGhlD+WLM8hf2YVqaRfp81toP7pCEjdB\ngl65IGMLS0\/YbHi4YJzZzKVaRpE2MoHM0QkUr2xCvbpDUrsoW98j+HReIX1xnzi4Yx+poxy0M3XI\ntQ4ijeQU8+voorUysnvgXmmNRCPR8HDB6Jc9XIy5HxJuAImDA1DZ5lA6P4SKhREULdqQu2T3JrTA\n42Dw\/SYbn4B8uBspM\/NQ2NaRalvB8MVf7yVnZKXl5QRN9Q8XjLf0uWPMnYgxd0E6YET5ZA3q5g00\n1S0wLDUje3aS0tlgKd1HMb\/Jvq+wrTG51LlFJij8B3KCJh2qjgI4rTOAq9gP5NT2QFPBmuB3adv+\n339KShjpRrS5hZExqGWC9QuNMK23onHZiMoZPRR0c17kc1bvxJaQMreAlFmbV5D1XONncoLGamy8\n43D8fh3OmxVMnZvQsq9CwZKYU84KH39Pgm2IemkgwUZkD6hRMqZlvaWzNaBmTs+EMyf7WEK8jJdF\nBhObs5HcLOSz1jtBA617+s\/kZOZqrN12YeuWw9q1GbOednCuGhpEOTJmhPY0679IMt5iJMFaQofU\nviLkDpaheFSL0olqqMerUGCpoGSrSWKOpeRl7g6vmHxmiphggl6xOqKWyQkatZC8LMPUtQbWax0m\nLnUwHcmh25XQIEYgczYIyaMizT+f4mEDIl9qSFCL2F410voKkWUuQRalmdFfiNSePMi6VCQw\/R14\nqUkmlmwdJ0Zo\/TzyijXVkFgVAhs1RAVi+\/LR+ToV7WfJdIyTodwhQNGGEKrFIKRbgyAbEbk\/k2q+\nCvvK4AnTGC5CucoDKSr2JCjclCN+uBAJQ3okdhZA2qGEpD0d8W2piDGlQDneDNVUBxPxCo3dMYJM\nay+yprvYAv8xtcDGSiYXaChDRHcWKvcEdB8BynYFKN4SIm9FiCxbEBSTIiQNi76dcr07StzpycDe\nzQLOPzhx+mEHB7eLmLo0oO00C0WbJSTahOjeQkR1pCKyVYLkHgU0sxpUWmuQPmaCzGqBbHqYGELa\nVA8bprL5DhJ03hMrJ0qJEkT1pTOp4k0hCte9ctnzQUibZuWlJS7YK1h3GvfUcCbF7rUNhzfrbKoO\n\/7IAx\/tJat4BjL7W0ROGIGsxlyRJ1JKLBHMyFJwMORYVcoeLkEItIZvmkDQ9gKQpMzLHmlE1U0+i\nHWi0H9wTUyPAUIyAhkLEDUiRsyRkqBaCoJzzysnHRJAOBVMLBM\/5GF6nPao9kbj1TjlWLoax83Ya\nuzdTsN+OYvG6HW1nidDuBbMnLVoPQ\/ZSGqSjMiIeEnM0ZP1SJHalI2GkhcT6GImTvZAP1bHBko8b\n7wRL7sSKiAIiH9F9EmRQr\/HwYqkTIpacdDAYcf3BiOgUa3xqjpLELa4CmJ31mHP3Y9FjxvLVSyy9\n6YHtqg3dJ9nQOEJYCfinVG8nIdUaATn9QtlEJBIsCsQNqRE\/0kBiXQzpRAcSuHoktqsgHdaT4D5L\n7KNYQEMuAvQ5eNGVwIR4ZBYREim1hAGWHCK7xAhtDX7qo3WmzJWsx0OzJqMzXjPGz0yYdBvR7cpD\nxSsBSu00WdQjuctCVoIsWyQKNhKgXPwTUqxCSEYSETuYR5I1JNZGtDIk4y2IG6yjZA2oXF38TOy5\nPpvIQmhbPOLNwYy4l16xqG4xXnSIEdIinmP9pz1IozUnHHVrKrQ7ylG0GsrS4qV4Cta8cvxkpU2J\nkDIeiuINBfI3fgvFjD8kVOrYQRViBjUka6CSGqj8DZCMNSJhzEA0oHRphsRUn8Se65V4Xp+BYGM8\nS4qHyonwdkqtRYzg5hB3kD7M+4mwci+TbvwCpbZU5MxFMBG+lDm0FvHrUTa95hdNXu5jf2RYpchc\n+ANSpgOoxPGI4bJIsByKgTK2T8tGapEwWs+IH9VBvTjtldJnMrHn9emEAgJDHMTGEAZJQdQUAkFD\niOn5Rzn+Kt9V2uVjEUgaEjOBVFp\/+IblF0oeb2oiftFkY8+XQTGZBMmwLyQWMZVWimguG6lDZcgb\nKme7TNFULaQjVdSX1UQVCU7eSaUxMf\/6FPjXyYlEVWBd6BMeP8K3Nvzv999SR65YPhbHpoYXSBz2\nNiwvxJNk8Y483ycxvWyyqJHjWFnC2qIR3pmC2P4sFNLWp7MZ0LDYhAoSVHJqxFkqiQoSHCep1Hti\nyUQSvU+Ufu+pRb2tflSwopzjGzO6R8wS4hv2fvPyYrwQ3yMhJipJcySVJQaixkQIdErEmjI+HShK\nKcH84Qqk9RYg1lKK2GE11Atjd1Iyr1idFH51EjzTxUt\/0NnP3xD1KKwt3BTa6pXgZfmkePjX4W1s\nqrw9ohc1h7RGFQTWJyFQp8Dz6lyI6\/KQ3JmLdNqvM\/qLaJ\/OR1xvHmJoAY8Zon2bBoWXYmI6CRFP\nxJFgrPTfOqQKG0KfBjWFcPwU8U37sXGDGnmxEI1fTfCv\/fTCXwr0gl8Jm1\/83r82fdpPWwh\/TSX+\nrIyFnyqa4auMhG8OX34loodykTJa90nKTxd7RzQJRkofdJrmE73fvPz7jz\/7Wvr1z\/zV\/o\/+qAv8\nxW\/yRD8XGPLFQn2hO0Cbi2fqj+TAV50F\/8pMhPUoSbCGhGKYlF9tFBGJZ7URJPhC6vMlrnCz8nHU\nQCYX3quEf1UB\/LT5RA6RRZ+F0yAf0ZLQnVTtCyKcCINvTaj4i\/5NMZJTSEM60klSSXIZeKZVkGAy\nCVZ+knpWE0qEEGJ8Uy164vOlr4iBpCdhPTJ7QH0ynlUl0WdhCV70Jn+SelYTTMmJiCD41gof+\/wU\nV1R\/1KPwlwkmcXs8gltjIe6M8grxVAsJAREIn5\/6Cu2P+l1YX7Rd3BHOhHyrA+54Tvib\/if+U8Cn\nGdweKvat8uN4Kfoq\/qba7wf33t8Ana27R98kgOgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_apprehension-1312585880.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_apprehension.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
