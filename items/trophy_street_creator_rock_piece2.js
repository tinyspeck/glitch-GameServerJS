//#include include/takeable.js

var label = "A Piece of Street Creator Rock Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Rock Trophy";
var name_plural = "Pieces of Street Creator Rock Trophy";
var article = "an";
var description = "One fifth of a trophy celebrating top street-creators. Four more pieces similar to it, and one mighty Rock Trophy would be born.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_rock_piece2", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "200",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece2)
	"smash_blue"	: "500",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece2)
	"smash_shiny"	: "400"	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece2)
};

var instancePropsDef = {};

var verbs = {};

verbs.smash = { // defined by trophy_piece
	"name"				: "smash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return "Smash this trophy to receive "+this.getClassProp('smash_green')+" Green Elements, "+this.getClassProp('smash_blue')+" Blue Elements and "+this.getClassProp('smash_shiny')+" Shiny Elements.";
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!pc.checkItemsInBag('bag_elemental_pouch', 1)) {
			return {state: 'disabled', reason: "You'll need an elemental pouch to collect the pieces."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var n_green = this.getClassProp('smash_green');
		var n_blue =  this.getClassProp('smash_blue');
		var n_shiny =  this.getClassProp('smash_shiny');

		var remainder = pc.createItemFromSource('element_green', n_green, this, true);
		n_green -= remainder;
		var g_destroyed = remainder;

		remainder = pc.createItemFromSource('element_blue', n_blue, this, true);
		n_blue -= remainder;
		var b_destroyed = remainder;

		remainder = pc.createItemFromSource('element_shiny', n_shiny, this, true);
		n_shiny -= remainder;
		var s_destroyed = remainder;

		var result_string = "You smashed "+this.label+". ";

		if (g_destroyed) {
			result_string += g_destroyed+" Green Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (b_destroyed) {
			result_string += b_destroyed+" Blue Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (s_destroyed) {
			result_string += s_destroyed+" Shiny Elements were created, but destroyed, because you couldn't carry them. ";
		}

		var produced = [];
		if (n_green) {
			produced.push(n_green+" Green Elements");
		} 
		if (n_blue) {
			produced.push(n_blue+" Blue Elements");
		}
		if (n_shiny) {
			produced.push(n_shiny+" Shiny Elements");
		}

		if (produced.length == 1) {
			result_string += "You received "+produced[0]+".";
		} else if (produced.length == 2) {
			result_string += "You received "+produced[0]+" and "+produced[1]+".";
		} else if (produced.length == 3) {
			result_string += "You received "+produced[0]+", "+produced[1]+" and "+produced[2]+".";
		}

		pc.sendActivity(result_string);

		this.apiDelete();

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

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-rock-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-rock-trophy\/\">Street Creator Rock Trophy<\/a>"]);
	return out;
}

var tags = [
	"trophypiece",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-29,"w":31,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI\/ElEQVR42uWXeVAUZxqHOTaKARwF\nBQR0GO5TECXixciNnHJfIquwRheQSwQEGfGAQQeGS+R0GJBruI\/hGmBURAUP8KyYmGLL3fyx2d2i\n9o8ktana+u3X4yxrYaIkoqZqu+opurqqu5\/5ve\/39oeMzP\/bwRZU0PLaa7iF3XxxqbBJXD4kEFeN\ntIurRjt5TeMDuz++YFtlfEZzETJai1EwVI8HL77EjecPMPDkFjhjjWCP1Vt+UKGoiyfiE66wxfVj\nLUFUepzOy3OFvfUoG2xB771rwL8xzz+\/\/w78O\/3TbJGA9sEE\/TMPfp9Un4e0Jg5YTaWPiSAKevjg\nCPm4MFyP1pkx9Dy9ia\/+\/g3+9eOP6Ho8juzusrIPlyA3BVmdZTjWxBGz26qQ0VhIzvNxsqsMuUO1\nKLwmQOVUL+oejqB2ZhiXbnWB1VmCs8Jq+nuXc47x35pFeq1qopPHbq3yOcY\/j8M1p5DUcB4ZHaU4\n21+DfNJ3pRMdqJjsRfntHhSPtyK95QKy+yuZrz4rT1jdueSCoediOkqJQNlkd+RxXi7rD5UnQXG0\nLhepAi5YPeXIGeSBM9oA7tVmFBDYw7VIqjszt\/BZp\/uqZqOqM5YuVfcYP3pUSRryRfWovi+kX+Cz\nxVGX0iWCRy5nI7GB9GVrEbK6L+GMsBrnBi5LONaQi9iaTNbC5xWPt1H3MZdM0Cs9gul74oAkIbaA\nTTvbWoh9nCOILErAwbI0\/JF3GglX8pDSUoD0tmIiW4j42tOIrT45+7pcu2XRdQGSmvOXdgR5JoXN\nFYmuoHy0iVfUXYGkqlMIyzssEaWIKIhBJDcOB4riEVlwFOF5cdxTPeU8IjsbV5cznxZH3BhZQnpz\nyXvQPSGEF1eVjcs32udS63MRfjYWnkkRc3sSgvneaeEdezMixF4poWKXWD+WX0bUfH8lX+HQScK8\n6IpMMdV3OUO103X3+pd+kTgdCqR5J4e\/ON7IQXp7saTn0juKF91HlBwZT9Ml11pQdl3AXPoZSF5A\nJRaQEQ1qWJcMN\/\/tl9yf3MiJTG0tnOPf7Yt8L3PwCO8091hzvmSl5g7WYuTRpHAxPyq6KpN1pCZb\nHFN7Zja7p4z53gZ1XF3u7AlSWmp8VN7ownc\/\/MB62z2HKlJpZBQxl3Tm\/dQRXZXlQ30xqE9anqgO\nfY8nyI4ATJnfynGoKoubTG0QyNcif6QRE88fQiAQLPsoMtVXRum8llEWv1XMqm+\/xrrE72Z9XsWa\nTW68AFZ3ObhEsPZmP9rFkyyR6GvaB5UrqmiL5JQ2gtc8Ar5gDPVtV1Fa24FwToLkS0FtCqgeLL3a\nBt6YCH2jj2YHx599mE2pQCCiFVW0ziam5eDw0QwUlDXjYk0X0i9w4Zt5ALH8czhOPmWSVTxANgXD\nDegZnUH\/1Sdzoutf+LxXuYmJp\/TGtuHO4so2hOw\/QgQzkc0uR1bORUSlHYdnSjj8Th7EweJUkHkm\nSTKFlLyyW4iBq08xPP4MI7efx78XuRd\/+Sv3+s0ZNLaJcI5Tg\/RTXMQksRB+IBZunoHY6ewEGx97\nMA96YU9iGDyTI+BzLBLR2UlgFRWic+CuRHD01te4OvUn3pLKnTx0AH\/+5ltcm5hGUX45SioFuMTr\nRHW9EBV8suGsEIBdUIlzecU4dSYfp3MKcb6gAryGbnT2XYNw5B66hu6jRzSD3tGHEI49Qs\/Ig2mB\n6O7SLB47leUIdXGGUHQHfYTe4Sn0DE2he3AKXYOTJJ1JdPTfRrvwNtoIrX23IOhdBD03p99ZLlBX\nhvZ7xip4aSgiPjgQ2YlJOJXwElZ8ErLiEyWcPPqSTEJGXMKiCXd15b6T4L4NK1kR9JXYT6chbqcR\nHNfIwUFVDvaE3SpysFsth12rZLGTsIMmi20rZWGrLIvPlGRhoyiLLZ\/KwpqwacVPY7VCZu6dBIPX\nK8+FrVdG2IaVyHDfAl8dJbiqy8FFTQ5Oa+XmhSlZJmHX6pey26WyW6WyWxTfIPqJzK+fkYFaSgii\n0FbCcSdLxGzTg8c6ebivk4ObhpxE1lkq60Bkd6tKRaWJbl+Q6GYq0YUpKsiwfrWgg8ry6T1qCvDX\nVESinQlSnCzgrSUPT015ieien5C0f4PkFqnkq4JblZfNsp2cfvmK9lirEGmhvAz6y2SwWUke0dYM\nSZl9tOXhpfU\/QbcFJZ8XfKXcC1NcWOZsx52zxb4uiy+12xoFsftaBYQZqmE\/EfM20kS0rRESd5uR\n8i4jYv9lOSk1QV2BJKkAF\/UVEpzVPoWzOkFNkfxVhJOaEkFZgqPaSgINTuo0uGisguu61UjdaYOS\nve5zlYFeb9+eGerpRVoY6mO3Jrl5jQI8yIs+t9GTpLffcgM8NqwmqMCTTqEqwYu+Bl46FGvhTcFQ\ng4+uOvYSfPU04Ke\/Dv76mggw0ESgoRaCjLQRTHDXVpUIummqYI+WKjy011A9+ebt\/l53d54jk4nN\nmzbhM3MT2OlqwVVrFfZbrJMsDklZpb1HldaZKu0r\/bdw\/Cxc0T+3WF4dPW9d2X7u7nR\/b+94FweH\n2W22tqBg2myGs7UxXMzp8DNfD1\/CXrP18DElbGQgYIcV\/LdbwW+bJXxtLeGxyfhbZzOdJy6mOo+d\nTRmPnEwYDx1NGA8cjRkzDiaMaXsjxn17Y9179ka6d3cb6d4hTJHzSRtt9dvGKsoVREOJIPv2UePn\nx\/P29ISbiwuYdnaw27ULbq6usN26FdYk5U1WVhKsLC1huXEjNlpYwMLcHBZmZjA3NYWZiQlMjY1h\nQjA2MoKRoSGMDAxgqK8PAz096OvqQo\/BeA0NDY0g8npNArXCf35nHuDr6xMcGIiQoCCEhYQgPCwM\n+8LDEULOHeztsdnael50oaT5QkkiKJGkBAkGb5Ckb9jQSl6vTdAgqEpFf\/d6goGBNAKTCLJCg4I6\nQ0NCZsNCQyGBSDo6OGDH9u2U5D9MTUy+Ikl9SSSeEb4gaT0lMk+JzBMi88jAwOAeuS4m18RG+vpi\nck2sr6cn1mcwxHo6Oq+hpqamLk3vE6mc\/OK+MEQ6VCodEhDACg4IoHbL66W\/WEtamo\/zD9PHPv4D\n1euv7zNfmyIAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294354025-2381.swf",
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
	"trophypiece",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "smash"
};

log.info("trophy_street_creator_rock_piece2.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
