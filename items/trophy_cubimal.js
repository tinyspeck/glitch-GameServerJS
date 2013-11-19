//#include include/takeable.js

var label = "Cubimal Series 1 Trophy";
var version = "1340228514";
var name_single = "Cubimal Series 1 Trophy";
var name_plural = "Cubimal Series 1 Trophy";
var article = "a";
var description = "This trophy is awarded for the cubular collection of all 23 cubimals of Cubimal Series 1.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_cubimal", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_cubimals"	// defined by trophy_base (overridden by trophy_cubimal)
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
		'position': {"x":-19,"y":-39,"w":38,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALsklEQVR42r3Yd1CTCRrHce9urv5x\nXpu5u7nbdWZ3z7K7KnYRMSDNUIK0hEAgIBBqCKEEQgslYOhFcSkCooCAQFZRUSyAZe0UFbEhFmR1\nFRARG+rvngRk1xUU7tZ9Z75DCK\/J533eN2\/e1ylTJrkUXLnHyL90V6m81tPZ2N2PlvuD6Bp8jp5n\nL3Hv2Qt89+RF353HL+pvU12DL+pvDD6vv\/5oKK1zcEjW+WSIce0R5k75qZfia73Tii73iCoJdaH3\nMR4Q5NHQSzyk+p+\/RB\/1Gnj36QvcefIC3VTX4xe4+XgINwaHQEB0PBrClYEhXBp4jov9zzrb+p\/V\n13U9qA\/ddUIW29jOV5zumDopWEVH79Tiq338uq7+vq7BZ+h9OoSnL17hMfV\/Ax8+xwXqfP9zpDe0\nIPZACyzleWkTn1pnH3\/L1Z7O1p7HePnqFYao5y9f\/aRAVTdpnbQDTTALX6fuvbDSzgFGSUdvfcm1\nPmxs60bRiYs41PHtaLcfPcPlu31ov30P3f2PMDj0fuC39FgVHZejz92j9W49fIKvGpvVMNOwTCrj\n3cCKWwOMrZ0PUEo4FbC4oxdbrvZi85UeFF25j02X76Pw0j3kX\/wOG6nM09dQcfkuztzpR\/fAE\/Wx\n2Uv1UN0DT9F66zs0Xe9GbesV5BxqRfz+JigOtuBEdx+O376PkjMX4Z5VBtPQDJhI02ESkgamNJUx\nLjC96VbfupbbyG27S6AedSUdfai48RBl1\/uhwld3PcK2mw9RTBuwhTYg98Jd5Fy4g6zWW9h68Q5K\nWjqpa5DtOYWEI+1IOXkVGS23kHXuNpS3BxG3+zgcEgqR23gGUdvqCJZGsFQYB6dQyWAGJY4NlB\/t\nNI\/7pgM\/TH70KuRHriD28GXEHLqE6MaLiG5ox9qjV5B6shO557pRQLiqmwOoJPTOu0+xvfsxym\/0\nq1NtVNn1B6jqGkDuqauwSyigaaWPoNIINAxjSlSwJKwKTBwfmNdaJcttqUT8N20oPS9HRF3rG6io\n+guQHWxD5IHziNx\/DhH7ziKc1gnf24KwPc0I3XMG0trTiD7QioTD7djQdB25NNWaroMI2rJ5eBcS\nzPj1tFQoSZIKRLAErApQwMh\/LQzE8WMDlVdCZcrLYYhvPISoXdX0pk3vR9USavdpSHedQsjOk4ip\n24+sY6XIPJyL3OOJKD8bgtI2HwRvZMI1Xge2MocR1PC0VgUkwGgEZiSOh6Ff3PjAtUdPyeIbGpB6\nbC+yTpQi+uBRROw\/SygC1RFob7Ma\/WNU5J4GbGrKQdUFObadD0X+MU9k7nNE6h47JO5kjwIFCi1C\nasJAFDs6LSN\/QonjCCZXP2\/gSwmjxwZG1rfJko4cRGlrGIpOCZF92AeyvXVjooJrTkCy4zgk248h\n+8QmVLaFqWG5R9ywocF5GFg7DCw+6\/UGkOEqIdTwtAxFr2Ex0BdGQ98nCrrCiLGB4ftaZRVtMvoE\nilF4whvZh1yRRm8SXF3+BiqIUEFff4NA5VGkHSpDdXu4eoNUwJzDbwMLTrm9AdTi8sAUS8CLc4ej\nnAlWIBsGPlLoecug5xUJXc9xgKF7m2UJB8sg2yZFeLE7QopcIM51gWd+4RuogOojCKg6jC3Nmai+\nGIGSZr9JAV3il8A9aSn4MfNhHzEH3LAvYehhhpWe4VjpEUZA6djAygtSZc7xtfAs3AFeUj58SvbC\np3gvImqKIVWWwb\/qEPwrGyHe1oCE\/WWoapei7FzghIAeiStGgWvki8GPXgAH2bxRIEvMhK57KHQE\nUui6jQPMOxaTJkr1ANd8GdgsLfDTN0Oi3I30Oh4Sa2wgKUuCX\/lBiMoOYOPJdahsD3kLmF7Lh7yc\nPWkgWzoLdvS7rsAb2s5BYwNp98msBO4Q2OtBYKcHpncIwpXZkJV7IKzEBS7pUfDesgfCkjpkHvrq\nLaBkPQtWVotgZbkYwvhVkwZaB0+HjqsXAcVjA\/2qGmXm7t5gmy5VZ+otUe9iwcbt8CioUT9WAb02\n1yJMufUtoFvASvWGefD0wXPXoinyJww0FelhBd8DegI+7WKHsYG+5fUy+8R86FraYKUVG9zkTYTa\nQ6haQu2GZ9EueG7aCY\/CGrgX7IAwPw\/yqhBkNw4DOU5L4GTDgDNbBza2i6FQciYEZPkZQNtJTFNk\nwTb0C1gGfiYbe4JFSllkZgp8i3aMi3LP304T\/RpueUq45VbDIW0z7OIS6ZJJDI5gMUz15qmz4M5H\n4g5bOnbfDbQN1YC2oye0HH3hlqD9bmBcqJNMIWEjVu4PZ7oEGgvlSijXnCq4ZFdizVfb4LyhgtYt\nR+AmMWLLrCFM0IdQoY+YUqvhY\/BHQAfZcjAcbbDMbg007TzVafF8sMLJA8JMbdgEz4Kp7ydjAxMk\n1rK1gdZIDuNhtV\/Ye1FO68vAX7cV\/MxSOKYXwEERDBeFHWIrON9\/in8ENHBhYRnPG1oOQvrpg2X2\n3oT1gmUQB07Ri2Aumg5Dwcf8dwIVIbYQBnqBE5c9ivLM2AiJIhZeCamEIlBmCRwziiHIzkdUdSIU\nO2OQVBsJQVYyLGQZ8EzjI6mG8waQK9XDEhvXYZS9l3p6SzhuWGjlDPtwQ7ADNWDi+Wmfvs2fp74T\nGOtviaRQHgSBfvBKXgf\/5GRIRWz4uRjDzd0ODulbwKNjj5dahKwGKdYf5CNNdWFA58q46tWwXxsI\nq+h1NE3zUaBrPAPa9rbqaWlyv4fNN+dBw8QWLrFasPD5ss\/Cf\/r4t6QJEiv+a2CUyAIRwtUI9WZB\nQl9DAQJTNdDV2QJsmqxdciG4SQXq72vV7kzZbQvFdivEVrLgHGeC1ZEZsImOATfcFPkn3bDS2RZL\nOQIsZrtioaUTwewJxsEcIyt8obcaliLNZqbbTMY770eSAyynvQ8odGbCKjAStgkbwVHkIbrKHym7\nuISzRrzSAtEVpuBFmcEiKgMW0ZnqnzLl\/u9hLIIZczBbDTPHTF1TzNJjiSZ8qxnhZVYY5m2GMC8z\nSKkQT7O3gAIXS7Djc2BDk7SMyQIrRA6bcCEc411gH+MMlkRCE0yHeUQaWOGpkG6tUcPmGrMx29CS\nYCzM1DHGHB19rGZqYFI36gKbBVM97XX73DgMuHJ0KAbW0IlXdfJVnYRtbYyg5+AGk+C1MA1JUGcW\nmgRWWDJhUtQgdWEpMKPnTOlv7ml5atjnKhjDGJ9rG2CFwXKwTb4E13iWctL\/zSGnXe3J1WVY6GuY\ns\/Tny8z0Fyipej59x1pZr6RThDdddPpDmy+kbwBfrFjjR4npuQAw3ALoiiSIrkwkVDCMRJFYznUl\nGBOLdZfD0GABuCazVLBmLvM9x9xkl6xIXYxVuL8RwsSqDNWPRT7GcHFnwcLNCSZ8HlYaLYeV8Zxh\nmMmsPg5zhmjKh1iyInVk6yN00qh6qnM88A+L8tFUw2yNZ8LGaDosDD5jTPk5F4V4ab3CfylUJQQs\nRbJE642CXBbBmmCWBv9R97MD43wXyuS+izBe3nYaozhV7uzPm8Pd5yvXR+rwPzguR6E\/NTlIs36i\nQA5zOqJ9FiE3Wh9ip4X0t3nTPhiuQK5vnh+r15cVwcBEgE6rZyFdugIlScZqnJA3H972Gj\/ZFH9J\n\/ZX6jFrgbTdXkS\/XR3HiKmxWGCFbposNkTrIDNUmxHIkBWoikY7HFMkyiB3nIVQwH3kxesiNMVTD\nVJnofKKg15pHfTry2r\/4X2C\/oz6iNCg9ikN5xYs1u19\/SnOi9VAQZ4DiJCaKCFuabIytKcbYlm46\nWhn9LvdbPopbsejfDarbcMqTYo+89hzqX9RvJwP8A\/XxyJYaUlxKmBS0vG8ipxgVXgV\/vUvXWM1+\n\/J9pf9pHr5FJqS5KfUY2Wn9kCB+NDGXSi2qr\/kHNpDR5rJlRIkeNikivxU1r\/Zd1vQ+qwtkYzThN\n\/1Z1gnahrCkjagk1g\/o79ZsP8Vn5NfVH6m+as\/8505c3ly11XxQYI1qaoSpWpJkeJ9ZM5TJnONM6\nf6F+T\/1qsm\/yX0KxJJJJfHwPAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/trophy_cubimal-1339468136.swf",
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

log.info("trophy_cubimal.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
