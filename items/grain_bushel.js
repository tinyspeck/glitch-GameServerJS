//#include include/takeable.js

var label = "Bushel of Grain";
var version = "1354585922";
var name_single = "Bushel of Grain";
var name_plural = "Bushels of Grain";
var article = "a";
var description = "250 stalks of grain all tied up nice and neat.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 250;
var input_for = [];
var parent_classes = ["grain_bushel", "takeable"];
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

verbs.unbundle = { // defined by grain_bushel
	"name"				: "unbundle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Unpack this bundle into 250 sheaves of Grain",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.metabolics_get_energy() < 5) {
			return {state: 'disabled', reason: "You are too tired to unbundle things!"};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if(pc.metabolics_get_energy() <= 5 * msg.count) {
			pc.sendActivity("You're too tired to unbundle grain!");
			return false;
		}

		pc.metabolics_lose_energy(5 * msg.count);
		pc.metabolics_add_mood(10 * msg.count);

		self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "energy",
			"value"	: 5 * msg.count
		});
		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: 10 * msg.count
		});

		var remaining = pc.createItemFromSource('grain', 250 * msg.count, this);
		if(!remaining) {
			self_effects.push({
				"type"	: "item_give",
				"which"	: "Grains",
				"value"	: 250 * msg.count
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'unbundle', 'unbundled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be made from a full stack of <a href=\"\/items\/252\/\" glitch=\"item|grain\">Grain<\/a>."]);
	return out;
}

var tags = [
	"advanced_resource",
	"animalproduct",
	"nobag_advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-41,"y":-48,"w":87,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHoklEQVR42u2Y+1OTVxrH+x\/4J\/An\n4Lqd7s5uZ9gfujPV7spoa1UqlxQFkUvUqVwUG0XLJSA3SUK4mHAREBsDBlBYNHIJFxEiRECu4RoI\ngURAK87+8N3nOWmyVrB2p7NdZ4cz88x5z8ub93zO9\/s85z3DBx9st+223bbb\/0eDs3rHewhV7uO5\nfmUv833vAP\/pKPVjyA271rixVCL9zSff6t7adF6wYyzbPNrzncbSftE62JVqtQ3nuNZnlQRb5AOn\negcHP++cSN3xS977H1im83ndPraNX\/hivlC2PJ6D6f5kGGuluHcrAqYGKax9F7D4VC7CMZYhYtby\nnWvuSbJ5eTzLPNOfZJ3oPa\/pb4mVtRjiZXND2Vm\/ErB6x8bydf\/1WTUDmWctya6F4TQ8aj4poB7U\nRKDpRhBGus8RVDpWxjPhGE2H\/Wka5geTYR9Jx3hPIlpqQvHYeBo9zbGYHpCjz5hA16fR3xKHZ9N5\nxq2UfWezj2cGr06rjGsz+WKyka4E3NdJYNSHofNOjIDiWBhKxTKBLY3I4ZzIgsuag6WxKxgyxeGe\nLhRtddG4pQ3CYEcSRh\/KMNN\/Cc\/n87FMz3A4J7Lxyq7Nemf1\/WArzFqZyCYgpX6qj3LJFI82w3FY\n2hJhqo9GU3UIepujMdwRj9knyVibVWJ1Ok+oZqMFcM+TL5FqZmMcDBVhuF8Tje67keJ3DON5nhdh\nH83EP3QRqC2T4HFLonlLMMeY3G91WiFzTma7FskWzqGJXhl678ehWReG7qYzWBq9IlRia5\/Pq\/HC\nphYTcEz2fouBFrKuKQod9cfpd\/F4UBsFw3UJHjZGYp4WskKqUsEIMFbZ2ncRlvYESpFjqC0Nhk4T\nSHFEtglu8Wmqv2MknVVzrYxnYbA9HjWlx2iCSEyZk8TL2QoGYus89vFEnFczA5cx9jARXXdOQF8S\nhJbbkXjYJKWiSKbiyBRqMRjnI7\/P0hZHC44hNyKEMxy3y92A32uOWKvVB9x56JzM8LGPpPpyz+ON\npSrrS\/t1WDrSsDyhohfnE0geJXuGeLkn6dkiBp4yX4CpLhy1JQFCqfZ6KYY7z1NBZAgoXgg\/z7Zz\ndN6J8gJ10mLYcobkvr3uOLSKL3A9\/6BLV3zEd8tt5JWjCj8sXEN38wXqtXg+pyKQAurVWBdRROMi\nrM6o4Jy8ilEqjLrKCLQaTpHqZ+CauoqXi0VYm1EIdRluznJZgHXdjfbCbRXV1w4jN20PCjL3SknF\nzXm4sVzlv2Evp4RXwWg464YjKO5f2Ip\/BFV5g\/Y\/1N84jfkhtlAh8ssDNd2fRJV+lnLym00grNTr\n1nK01IZ7Lc5J3S1li702e7+XjsosBuGJGm7GkhIlYGAG4euXi6UEWuRVdZ0W0tqQSOP8n4DbhtKE\nfR0NbgguEIZ6E\/R1SP67sSaMqjgIxbn7NZvUe+Wq8l2fK3CxvQ4qksdtKUI9tpkB3ZMX0Fgj7Hs2\npaBeiUZdLKmnFM+IoAUMtMZ6J+1pihSwb4K9ee\/+j1VcVXgIV+V7rLny3X6b8o+2ECMr47JeJetO\nCiiuPL73jHJriQqFVWNwqnZKBTXu1cSKLcdBRcPqs8rjjy79BKbrDRiPsk03Q6mwQlBXEUJ9EKkX\niMoCdx5uAuS2MJwiYwj7SCZuV8QIpfjzxKAMZBtKEd\/VtdkCkaesWFtDvLjP4ZzMEakw0XcZjdWh\nAoIVfN1GT9UyHOfbLW2gAKurCMKNogBUqA8h\/vTHMnXqJ5s\/dy8XlH6slm04SwCyagzEE3MwLI8F\nND3HuTppvuQF5DEvhgF5crZtqwLhaP7+qIBzb8xu5VRX\/o48+WcIC9m19adufTZfygnPJxMGZCi2\njifmfOPxitigc2k7UdJz2XjcKvMq604BJR7dixWTsn1cnQ8o+T2ArByD6UsC6UPwb0BN3ufITtmN\nkxF\/hCRgp\/+WgLahZL3ILbLWTEWyQvscXzPQ6ozaW7k8psWIe4MdF0TBUIEJ23lz7mr6RkDcvfG1\ngGyolIjr6uIAFOXsQwltxmznzeKvBGSZ6kukfPtXHAvapQk78Pu3n2QspjiNjb6zrJLREO\/+RNGG\nzFYzBMMzJCu5PlcIp1WBzsaz3gpmexl+oP2csMujDsOU5x8UcPmZe6lKPxORfvFTHAvehYjQD\/WS\nw7979zmwtS7c\/ISORdN0CtGXR3kLRACRdVytrOiyOIHkkqU5qKs65d0H+Rm22mI6C0X636DN+0Lk\nFic+9wzL6nGVyuL+gpCAneZ3gpnqI33aDOFSTzTrjlpNtA3oy8LBsAzJgKwinYbBCjMEj7mYOhrP\nCWU9+Trac54OoZcppw5AleEvlGJY7rNT9iBW+mdh5S9S7G2tKv+gr64o0kenDdS0GqKsfORiuIHW\nM7CaL4qi4PHskzS01sd6q5jvdTfGQF8qgVLuD4V8LzKTP0Vu6h4knPrY+LP59WtahfpwcGXhIVmZ\n4ktZfWUInVhOoJP2Mw5OBYZmeB7TRx5JCZ8gOuwjxIR95CIbNf81sLe1azmfBxO0vjBrv0arkFCy\n74Yq3R\/qK\/tw6sSfIPlqp8iv3xzs51pexn4fpXyfH8eJo3\/wV6ceeP\/+k7Ddttt2+x+0fwEHmDfb\nVvIG4QAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/grain_bushel-1334340755.swf",
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
	"advanced_resource",
	"animalproduct",
	"nobag_advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "unbundle"
};

log.info("grain_bushel.js LOADED");

// generated ok 2012-12-03 17:52:02 by martlume
