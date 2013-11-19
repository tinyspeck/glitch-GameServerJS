//#include include/takeable.js

var label = "Reshuffle Card";
var version = "1345658131";
var name_single = "Reshuffle Card";
var name_plural = "Reshuffle Cards";
var article = "a";
var description = "If you don't like the hand fate has dealt you, fight for a new one. And so it is here, though for \"fight\" read \"swap this card for\", for \"hand\" read \"Upgrade Cards\". And apparently for \"that first sentence\" read \"something entirely different with lots of different words in\". Basically, you can swap this card for a free reshuffle of Upgrade Cards. Probably should have said that in the first place.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 100;
var input_for = [];
var parent_classes = ["upgrade_card_reshuffle", "takeable"];
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

verbs.reshuffle = { // defined by upgrade_card_reshuffle
	"name"				: "reshuffle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Reshuffle the cards in your hand",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/custom
		// effect does nothing in dry run: item/destroy

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

		pc.imagination_reshuffle_hand();
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'reshuffle', 'reshuffled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"upgrade_card"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-10,"w":38,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFaUlEQVR42u2Xe0+TVxzHfQd7Cb4E\nXwIvYcmW\/bPF\/zbdnWWLOJ2sgiIiYNWBjkKvcyiF3mihlNY+pa30jlAuxVJaUC5yi1HJoonJd+d3\n4nnSomWQ5\/GfxZN80z5tevo539\/lnHPkyIfxYRxuLC4uflQqlWqE2LOmTEYmSWh+fl7S6\/UaxX9a\nLBaP5vP52oWFBc0badmzJMSenzKhUChUiEFUiM1TIbYA9PT0SIoB2Z87COBc\/e8wGk2g93t1GDgC\nE1IFkFxKJJP45NPPuEZ8vqpwB3HtvQCSe59\/cbwCUEAlkymug7pGWlpa4rJarU9VAXQ6XRUOCjin\ny4WNjQ08mIrD53cjNOaH2+3B3T4rTGbLvnAkm80GVQDJMQqzzzdaEdJQaAypiQBuGc5UKBjuRyQS\nrQpGWl5eVhfwXYUwOuqXAb0BC16+\/AfFpVm4hnWIRKP7wqkGyGCkaoVQDri6tsjf0ysBxuLxqmDv\nDXBvIfj9fkzNRDkgwZGLW9ur\/DmdTleFe\/ToEZdqgNUqlACpQETuWZ03eIjLAfe6JuDeGyCBDQ66\nOdyg2w27664MGI27OSQvFMm3L9zjx4\/VBRSuSZKEfCHLQxqND6FdewW3rS0yIBUKQfru9SHO8nAv\nmIBbW1uDyWQqqQJY3nRnZ2fhHrLKrtU3foMBh0V+JlgC1N9ugM3R9xaY0Obmpjo7CZ08BFyhMI2p\n2TsYHrHIrnV0n0ZzywVeuQJQfEegZov5LTgSNXi1AEsEN5MLIDbRgviDS\/D46hEMDcmunWs8AbfH\nwSGFqFkb\/7qOIa8TzkGTDLayssKlGiA12gXmXDTZCIP5LHQ9rdDpm2E0d8uukYt1Z0+gqbkBmobT\n+K72OG50NsPab8G1jlqkpy9jOtcnw5FUCzEBpidvI5JohPb6eb7XekeG4R0dgGvQzouBIG90ncLV\njp9x7dYvsrOUh26vCUZLJ7qNGuTyoxxudXUVOzs76gFGE20IM0C96SLiiQTXqJ815pER6A1GWAd6\nOWh5eK32Hty1mnDzz2tob7+KO\/2NiE9cYWEuckCat7u7W6v0NH2Mmq00fh7heANc3l\/R1cN6XHAY\nu7u7rKW85CqVlthBwodA4B76+wdwVavlrx6PB3a7ncvquIT76YuYe+jjgLQzKT7ys6SuIcDMZB9C\nsfPcxWjyAoJRDXSGHzBg02FyaoJDPn\/+HOyewXeQctlsdrS2teFy6\/d8jpmcm\/dAmlc1QGq2M3MB\nJDJdPBejqQsYZ25EWOHYButY0ZzB\/ZifH7\/+7u1F581WtLTWoenyCeiMtXAMncIYg6PfEiBVcDab\npRysVQTIwDTv2qqKxTnM56PIztmQnrrJcquJt5+R4G9cIZYS9Fks08QXcp8tiBZDaZIvjGN7e5ud\nwpMwGAw1qgC+a6sqV7GUxey8hxdBLHMR46Q3YOQ2OUdwsfQfWF9fx7NnzxCLxZQDsvA69oMr72uk\nxWJahqJcJdcEHOUfuUeAL1684AXEQnxUqYNSNdf2wvHKZIAExKHegI3FGnjIp+fcHI706tUrOJ1O\n5ScZBlj6LzgCK9dEtpcXBK\/6+CVMTg\/IzpGePHmC169fw2w2K7\/RHcS1clH7EBJAQnQKIglAxbsI\nAzh2ULhysGpw4to6NOzF1tYWAToU98DDurYXjtwiOVi+CcCTX3\/L51GjSWuUuCbgSHq9AT\/W\/oQv\nvzrJLvdj6jTpcDhck8lk+GS5XO7QrgnRrkGXeAK80trG84+2QMU9kAYLwzGaiEQhIbGLjpbllERi\nu8HT8qsltY9qCgYlDkxDlR542CEWwo5QHzscDk0qldJEIhFjIBDgi6FokGgHUeUc+GH8H8a\/c6Va\nuFawFpEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/upgrade_card_reshuffle-1334013016.swf",
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
	"upgrade_card"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "reshuffle"
};

log.info("upgrade_card_reshuffle.js LOADED");

// generated ok 2012-08-22 10:55:31 by martlume
