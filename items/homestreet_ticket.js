//#include include/takeable.js

var label = "Home Street Ticket";
var version = "1343768642";
var name_single = "Home Street Ticket";
var name_plural = "Home Street Tickets";
var article = "a";
var description = "This handy ticket lets you choose your home street style.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["homestreet_ticket", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.use = { // defined by homestreet_ticket
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Insert into a Home Street Ticket Dispenser",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'disabled', reason:'Use this from a Ticket Machine'};

		/*var stack = pc.findCloseStack('homestreet_ticket_dispenser', 100);
		if (!stack) return {state:'disabled', reason:'You can only use this with a Home Street Ticket Dispenser'};

		return {state:'enabled'};*/
	},
	"handler"			: function(pc, msg, suppress_activity){

		var stack = pc.findCloseStack('homestreet_ticket_dispenser', 100);

		if (stack){
			return stack.verbs['choose_'+stack.getInstanceProp('homestreet_style')].handler.call(stack, pc, msg);
		}
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
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-19,"w":47,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFH0lEQVR42sWYC1JTVxjH2YFLYAks\ngSWwBJfgTGvHPhQqo+NUOwSrM5i2iAIFiuVVSniG8BYa4RokKVpoKgwOwQ5Zwml+x\/4zJ7eXJEQC\nZ+ab3Ffu+d3v8b\/fuTU15zQyma3QnzurQ+\/fp+pli2ujdTUXPY6Pdy9lDrdiR5mk8dvLzah34XA5\nEO\/t23Vz536zafzmKxN+et88G3mSh1x\/ORO7ELhM5lVdznNpLzFrrn3bbG4OD5nrPd3mi84Oc609\nbAYjPRZwf3\/DeIlo07nDHR1uZYH7tOW2uTU29j+7+uihWVkbt5A7u6tmNT7RcC5w\/xwmG4CLzg+Z\nz767FwgnA57wA5naXspupKK11a7Uy0z222Sf9VAxOIyw3wjdyufj5tZc9fLx6DB1hUl+Gnxs4e5O\njJtxb9ns7iUKKpd9jguSvKRwdD7uTYaqAJfs4OYPHofshEz8+3b8g5TsrFsgGfsc5zwP0bUcsx7H\nOL63t5Gdmf\/l8tnJSA6OPHrU+30eDhAma1+IBoa2f3Xenh+OL5rF5Jrdbg3fNRTVh6JZ88ai3bVn\npnHkEfnE5K3Tk3YSN4xBFt18bvYPXlnjemmligZ9PD5O1X40XHM4lIfD8Ap5pn2F1FZq2rP7Cq\/\/\nzYIHgdR+ZKY3duYaBwDewZOE0l8kAvXDyygYHnz7zbIZmXjaUDHc522tgaFTUeBJFYrfCGvb7HQg\nYOfPYfu7kZgx09P9l06ncTm4UhrHpCQ+20D4AeRRfvHkSYCJrVj5gBLgyOyAfZe6QMiEuw+cclAF\nIxP4SZ51AdN\/x8sLMX0cf\/ixpy0vI\/5w+oG5nvxDZpRzOoZXCX+Q90gdXpHv3iXM8xeR7OhEV11Z\nAozGNT7rz0PgGaqQSfAGv+zrPB5UninUkhMgMe3LAAMQuNjSgFc0vLbJzCSHqKZQx4MCGcEAwvAQ\nE8kjQUCEleuo7JPCSl4DR1jnlgZjJeGkcbfbC4uBiTDJBxB6fXHMDXOQvAQZzStzATce7esoIcCp\nWuB4Gj+cCsCGI+cNAIAFjpBznjATcmCDcsw1oCgIfpN\/LJjxWG+obI278eSHAjAAgJFn8JpC6\/ca\n4VV+FoNT2w\/cyGR38eaAFRZwdLh+OLwmAwDvuZULPF5zc5FrOe4vBFWqpOSFN5UtKSWuxvllBOOc\nKhQ4FxAgIADnGj2EKykuJA6gWtkuS0as9zLJJgmkv9tgErwjILaBUq5J4wDjWsIs7VMvKEDAqFbJ\nSNntlA3vf0+HByUVmKoUGDUB\/vySWKv\/4wEAdWWFfCO0rOBKatxJgHgQvQOGm6stAlISQl6571Jg\nJbxcjwEnYN1XGoeMnArOXUt8ea8xLxVMzmSCwqt+8ZVJmKWRCj2VSpes1qmkxp00cjdIK0c+edhS\n8CaQvrlwkhLtE1J\/MWy\/XinQuJIyUmzw54ODRFbNor9bkVyoWlU8glERKfSEU6s0KyMfA+dCooPc\n9GbL1\/nGQAUhjVP1Sh\/ZdvOSKEiAy5aRcgfrUeXO1TvXbcFoYUMI8ZIEGGhJil5\/WjoiI9GFgfSZ\nwmm8frOcVpj44KPVmSu6QQJMvuG9imTktOOvdDwrj7ifySQnfgEm3yQjkWjfUFXhGAsrg\/WCchfT\nGGH1ywjn+TpVsYxUMnJhCgmKj45aTLsyIo2zMjLRdeXcP0DGvSnPhSHPZIJjaXgmMlLpAMDfLgEs\nGfl1qrP+Qr8x03EA6Rr5Nrc8nK2KjFQyXC8BPDrZ1VT1SnXGv2N4IhsqzuIrAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/homestreet_ticket-1341866265.swf",
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
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "use"
};

log.info("homestreet_ticket.js LOADED");

// generated ok 2012-07-31 14:04:02 by robeen
