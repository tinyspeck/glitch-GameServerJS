//#include include/takeable.js

var label = "Butterfly Egg";
var version = "1341274488";
var name_single = "Butterfly Egg";
var name_plural = "Butterfly Eggs";
var article = "a";
var description = "An egg seasoned with the specific mix of lepidopteral herbs and spices to hatch a <a href=\"\/items\/368\/\" glitch=\"item|caterpillar\">Caterpillar<\/a>.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 400;
var input_for = [];
var parent_classes = ["butterfly_egg", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.insta_count = "0";	// defined by butterfly_egg
}

var instancePropsDef = {
	insta_count : ["How many animals we can insta-hatch from this stack"],
};

var instancePropsChoices = {
	insta_count : [""],
};

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

verbs.insta_hatch = { // defined by butterfly_egg
	"name"				: "insta-hatch",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var count = intval(this.getInstanceProp('insta_count'));

		return "Instantly hatch "+pluralize(count, "Butterfly", "Butterflies");
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var count = intval(this.getInstanceProp('insta_count'));

		if (count > 0) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var count = intval(this.getInstanceProp('insta_count'));

		if (count > orig_count) count = orig_count;

		var location = this.getLocation();
		var is_on_ground = this.isOnGround();
		for (var i=0; i<count; i++){
			if (is_on_ground){
				location.createItemStackWithPoof('npc_butterfly', 1, this.x, this.y);
			}
			else{
				var container = this.apiGetLocatableContainerOrSelf();
				location.createItemStackWithPoof('npc_butterfly', 1, container.x, container.y);
			}
		}

		this.setInstanceProp('insta_count', intval(this.getInstanceProp('insta_count'))-count);
		this.apiConsume(count);

		var pre_msg = this.buildVerbMessage(count, 'insta-hatch', 'insta-hatched', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onStackedWith(stack, delta){ // defined by butterfly_egg
	var insta_count = intval(stack.getInstanceProp('insta_count'));
	if (delta < insta_count) insta_count = delta;

	this.setInstanceProp('insta_count', intval(this.getInstanceProp('insta_count'))+insta_count);
	stack.setInstanceProp('insta_count', intval(stack.getInstanceProp('insta_count'))-insta_count);
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Seasoned eggs can be incubated under a <a href=\"\/items\/278\/\" glitch=\"item|npc_chicken\">Chicken<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with an <a href=\"\/items\/262\/\" glitch=\"item|egg_seasoner\">Egg Seasoner<\/a>."]);
	if (pc && !pc.skills_has("animalhusbandry_1")) out.push([2, "You need to learn <a href=\"\/skills\/30\/\" glitch=\"skill|animalhusbandry_1\">Animal Husbandry<\/a> to use an <a href=\"\/items\/262\/\" glitch=\"item|egg_seasoner\">Egg Seasoner<\/a>."]);
	return out;
}

var tags = [
	"egg",
	"herdkeepingsupplies",
	"animals"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-27,"w":21,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJbUlEQVR42sWYeVNTWRrG\/Qb9EaZq\nvoBV89f8MVWMdjttOyqtgrQLILIjCk23aLfaYZFVIIoo+76FTSQsAqLRliUgi4MiCEpYlMUQQu5N\nkG7beeY95+aGgDoC6syteqpS9yb3\/PIuz3vu3bTpIw\/VjMWxeEbMLZoxawqnzJr8F2ZN3nOzJmdS\nDMqaevWnTf+vo9IgBlXMCcZyvYgykuqlGSWzZhRNm1EwZQZBImfSjMwxszJ9Hl\/8z8DKabGwW8bq\npO4FXJsXUWUQQbAonyNQgixdBZlNkOljoi5t1Lz5s8PdBL6oeCn0+RYaEdO2gJoFEdeNog20wgop\nRzKfIHMJMmvCjLQxszHx4eznhawzCZp6QYRf8QL8ihaQ+siEWpPIQauNy5ByugsZ5AtrqsfNSHrw\nwni+d\/Tz1GWdIChvmEU0WgSEawT4l5gI1MRBWUR9CubhnWeAd64eXtkv4Zk5i6MZ0\/BIm4Jv7hRC\nqmZwpkmPU+qevk8OlzYgOKYPCmhaFHDzlYD75kU8mf0DdQ+X4FdiB5nPAOfglaOHZxYBZs7AI30K\nR1JfwP3KJNwuT2B\/zAO4Jt5RftK6+6HGpIttE9BCcBOvf4N8zL95zYFZVOtFkaf7ujXVrLvlhpHT\nnNS\/gNDaWexRNMMjpfEvnwTwbJNJEaAScazcjPuGJdgfuj+W0LIkoJkiy9JfJ0j1yJqm3FqLcrPI\ndZimsyCqbQQ+mbf6P0n0zjYLYIA\/Vltg+e3fKwC1r0XcXpLSvhpQbpbimeVulgGT+mcRWtOB4Iq7\nez8KsFYUFcoeCTC9dWX05sxvcLVfRMoDAcm9ApTdJiR1mXBBu4C4drKh1nlE\/TqPyLsGRN0zQPlg\nAQk9RlwcEHDlmYUDBqluazcePTJk9YJgrJyVAAs6VwLWD\/yOgDIzAkpFqaNZo1AnS40id\/IMjqZP\n8yY5cvU53FIm4Jo8Ds\/0cfjldOL7yjYcSVb9dUOA5GsKNRU9K\/4LWgE\/VIkYps5lx6TxjQRH4P6l\nArcbe6vhXUyAUhdLgO52gIcv6vDtL+3YfbqOurpGtSHAKoOgu071VEt11UCQReOUyj5JlymtiV0C\nzt0UQE2EM40LCK58h81kvG0zrsljHHBvmBbffK\/G9uAabPVRra+jM0ZEh9IZgU8HVvR1VkjWCE1k\nKbKYvbBzbLqo7SzGvkEK7MZd+pgFMV1GnKqfxWFlPwHWcMBtgVUR6wIMqdLnRt4x8sVkyHYyZwbC\nUt5gFftcZwfHurfSbh6vHnWsg1mDJI9YENs7C1dlC3b8oMY3Idd16wI8d3Pe6FegR8GEwCEHX0nm\n3EaQzIxlqe3msAwnG\/Tq6GVQ9FJHLUh5asElAowhwOBrHThW1oZdp2vxN4\/sP68JrmD6lUPqkInX\nUHClHsXTAoYJcGzpdw7BYFi0qo3LYLadjB1cIdturYreVQK8TIAXhy2I7qH7V3XgeGUHjcs2eObf\nC1oTYP4Li4L985BrUqH75b\/EyRoDV6h6lfj5OURoDLzm7OHk1Mq1Zx895RMLwjsmEUSAgRUd5Agd\n8FW1V68JMGtSrOa74XERJ8qkXQkDZbbBvC2wRI+f6ucQrzUi9bEJV0kZwyYOxsbaJZq3YbfnoGiZ\noy7XU5fr8XOjHqcbXiKcDDuCTDxxyIJzd0d59ALLO+BPgP7lXcY1AYbfmdNFt8\/z2mFRYNFkxc4A\nmFjxy8qbpElCe8JQtR7e2VN8ayWb8rKtjMP1ElmLchSHkp7hYMJTHLgwggMJbeSdrTx6fqoOeJd0\n4FT3Gh4NjpdOc1M9VjwNxa05ioaB9n+SWCpDa\/QIKJQmhAfXajBSymo4nQSX+BQHGVz8MHaE3CCL\nqYZLfDN8SzvgRYAeJV0OHwT0zpIcn0WAgbJF+eJWeaRJsj\/HweSo0W9Xw3mkjsE3bwI+OeMU6XH6\n3gj+cbya\/O8ath2rwp6wBngWadcGeKJsCm50c7aIDdQe1k48WuxaigTmkTqJwGK2e55GdKcRykER\nl4alpmB1F\/94EbEDizjXPg3v\/HvYdaYW2wIq8ZV\/BXb\/Ug+fa4PuHwRkXRZBOxEGyhbjKrGqVNJx\nq8406xFBhR9HT3iXh0VuI8yImZUwM2Z2kkRwCYPLcNEPF\/Fj4xD8WOdSap1imvCVXzm+9C2DW\/ZD\nxQcB2b9lN2agbCFmDWxRtvj7xK6z78lg9lGzwT2S4CJ6RQRUdHI41hgstc6JLTSPy7DFu\/zDKWY3\nZDe2gVphk63A7xKHskaM\/S7JCnaBwOIoajEEF0Vwkf9aROjt8RVwHiT3Ai12KRpwoGANNRg3YOlj\nN5ZBk6ywMvBqydeS7CImg8kpjeqX4BQ9LHrdNrijVji3fC0O51Ek07s\/bDNh3YZqlg62AEsNW+zC\noMUGvFoJg8tQ8XZgctTOE1jEg0WE9S0iuHHkvXCHcjvWZtTUXUEnm6YQ2Wvmi8iwsuIfr5R8Xobi\nEWNgFLUIggu3wp3UPIdXsXZFWpfhtHDJ6lzbqAupfbJ5e3AtnKMG4JmhI43RuPvvOpgwjO9ih+AS\nwzQIl+hB7I96jP3nB+BMCigfg1dpF4\/akcK34Q7kEGB+X9Cat1s7Tzfovg5SY6+iW1qQa+g9GlyG\nin68Asw58hFt61u5KbtltdrgXAnuEMEdJLjvsjvhknMfB6um1v5KxDlWE+Qc2wznuGa4XumGb9EY\nPRezcTb6fl19Rmb+jEPJYNtP1ONLq8ftpfvZosbgciS4\/Vmk7J7qdW1Y2dD2KevRsXrxpLphczJQ\nPYCTd6Zxus2Acz2LK3SWqfsVQsngj9eP0Q5ZbQPbykQe5xjRyMFsKbXCOWffh0eD0WHdD03+DTqH\noyVS3cjyfIfsr3tYa8yRZqsMttVbhS1eKjhd1Nii5pIlwTll0ueioY2\/p\/Gv07kfKeridcPEFn+X\n5Oty8W8LrKSpIIFt8SxlT21wyWhbjhqB7cugz\/mPPv5Nlw9BuhV08cJ2e4fYedc8qbaYdvxcR2Cl\nHGyLZwmXY\/wtCYy0j+D2ZrDIDfb53PxEr4b9m\/UOhwt6dU6X7uBtaXj6doXfwLYTVTaovx8tpiiW\nYifVnrM1nQxsX+Z97C8eUWz6HMfuyLvu\/zzTpJMhVqqYQ3EwrxJ8faoGey632iLmlN2Lfbn9ueuy\nk40eLsm9m3eGNwc5xmmqHWNbNJTCPsdEDRwTNPhW+SucsrqNe9K1mn1Z3RqnvH6li2rEcaPp\/A9O\nC0mCRp2jUgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/butterfly_egg-1337275605.swf",
	admin_props	: true,
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
	"egg",
	"herdkeepingsupplies",
	"animals"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"n"	: "insta_hatch"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "insta_hatch"
};

log.info("butterfly_egg.js LOADED");

// generated ok 2012-07-02 17:14:48 by martlume
