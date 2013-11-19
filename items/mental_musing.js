//#include include/takeable.js

var label = "Musing";
var version = "1337965215";
var name_single = "Musing";
var name_plural = "Musings";
var article = "a";
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
var parent_classes = ["mental_musing", "mental_item_base", "takeable"];
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
		'position': {"x":-22,"y":-42,"w":43,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIJklEQVR42s1YZ1Yi2xZ2Bj0Eh+AQ\nHIJDYAgMgX\/33g7XiAFFkAYkSQ4iqRDFQFSRJCLm0P1e07n7\/dpvf0fptgMN9POtdWutvarq1Dm1\nvx3PPruvr4vLXV9RBI\/jUux8Q1DweFVyHwbl1nr4Uae1+qp9wFrzDAqqWx\/1PfRlqXpG\/I0oxS+2\naPvFDtOueA40YmSteBsA0G6tsegYch0GSTrfpMjZOlmrnvyDgoPEtoq3CTCrl9uU+VeBaZ8S\/Lx8\nLNFS1UfGor0tU2PJ7oRwqZe7tH6VIWdtmR4U4GLJMWiuuMlbDwsNrF2lmNLi2XsUIUvFQ8aSgzCv\n3XoIETyJC42byq6HBWgo2fsNRUdz6cBPPgYERiA823kM4ASxKX8lJOYYivYG\/2\/kwX0QPsY\/l9jf\nGFRAkLXq\/QqOzdjpH7o9W0O3116I+5e56h3wNEKDjlqgt6CCluBvX4FBK0ys5U5rtVmzpMp0ZmYo\nO2RwBbiRdLHJPhts9K7Rgn1Av7cksVZoYcfalU\/NbRtGulOCs7lyskrpl3u0fp0hTz30+z47nzVr\n5zOLXf1gelOn6AogW8XJaWnlJCGyBAeh9NsAYTLVlr4rgFMJzWBX1tlfaoisUHaKoPohxyLi2K8k\nVrW2mx9Ormm1yoSmo\/OPRVUdNajJLQ5qcmbS7Vrl7VVcdiqMJWfXzj\/OmhmNzv5yd3gWVfY\/DSo7\nCqHaMkjqzKKsYxQBnG7XRpq8RdaNFv8OTdOz4GRbqR\/7xmRPAuODv7aETj6zpesqDfVxZDag6rmU\nsSszPwlM0GPfOI1KqpH5vEnxDWWNiuHIdH44NNUW4HhsfkC5qpZ1H50584A6bWgiAJRJQ1szz6WN\nQ7MZvfNPzyiBpja0pNmzkLZwR\/ys2TPT\/I6J1LlFmssYJJ4vV+e+\/nM4NCMfjaicPUfozLZ+YHJt\noamMq\/PKqLr\/WwH0A3MZfXMuayBT0UW2ip+WOS3EbrZp9UWKKS0ozs8Sj0WvN2n5MkG68hLN75oA\nlJ4uK0ce+yekZ8vKJnz0N9OI6tFoVDUyHJrOw8fgR+wncjCAhiI3G7T76ZAKn46o+LlB5c\/HVPl8\nQtX\/nFIFxM8lHtvn73uf6pR5XyHXaZjmC2YajanoL+8YPfFPyB9kPwa4MWlOAXDGAxetvc5T5kOF\nch+rtPOxJgDs3wFtEd4LPA4h8h8PKMtzUx\/KFH+VIQ0LOJXU0n1z\/88XfEhbtJLUzNDG+33afl+k\nNDMEYwAAUIC5TxjL8TcIA3BbvCb5vkD+6wTN5YwEn+zI2HsUG4idrTejZ0lRRnH9N3TfzMOhWdae\nSgbt6Yo2Wn23Q+vvdhlkQTBMfSgJANk7jbYIwDEOIbZ5ziYLBXBrvDb6OiP8EUHWEWDkdF1CxYtS\nPny6JorQ5\/tL+fmsSTGd1ClGeBeYWFVLAAjynHN1\/TYvGIEhGAMoQKQEle\/uJaFlfIcw6+\/2KMHC\nxXlt7G2WNPtmmk3rO1crALVxk6ON66zYpH92bpjjfCYAcuRaGn7BAIzAUABl5gBxS\/t3VBACABjm\nQCjpbY6ibzIUfpMWAPHPjgBd9ZAWJQ4qZT7gNH9WHc+lDSP4maZoIWPdIxiAkXQHdPUe2BbhHdQC\nBqEivC70JkXB5tYXgH96xxRI5Ng2dbx7hU4T4mjhq4fzPQWImp1aW7aSqeETTEAtoGAOAhDpTY7i\nr\/n+OkvRVwzo5RYtv0iKwPBcSeS8jJL1ZJkj+RbgH57xwS8Ady0yPtaKejBwHGv0BJC3LgHw+YGD\nzGxm20mQnJzXPBcS+a8SFLxcp8j1FsU4SYOinKRDVxsUuGBgpzGyH6+Qpe4jA6ephbKN5veQtPXN\n73k5asEhPgkq7Fz6dw2QnVlrLLnIcRKihYqNdJUlWqy5yVr3k+M4JAD4z1cFSIACrVwmBTjvGWvt\nJEy2o2UyHXpJX3XQ86qd9EW72P4eJgfeBYnvnI+PlxzpR34yVF2CIRgDpPs0Sr6zuAAKwlzPWYxc\nJxFaagSF9kw1D2syKP6xsGtFFGsfBiAXBmIXYS0Gr5OCVphCvM9GbraEOWPYe8UezCa+TlHkavOL\nJlf4Hr7ZJM+JRM937KTNWm93koxB9mA7CZIqQDoaoXsgNwTIMIOMoDAA0JuUoKigbSEAwGEu773U\nqn4e+8cfdqtrmXoyqW3MbOrIcuAja42D5TBAJk7ui2U2ecUtnm\/JzWNuMvK4gat0+BxAtQCiWHjm\n76GSsR\/5+92HITkiyFsPK+w1v+L7lsZ4bHbwaUApTW1oBoXZGbA6a8xDs1z3Sdod8zeEMXWOKbvo\nFH7Ma7AWVQxXSDQcnumuigYYXyPaRM8lfnHbiULTBy0PPqxrdQWbAsl6cl2bV4VVj77rGgzNJBd6\ndvYxaVY+EVd33ouhJdfhitiHk3xYRpLEHe8Yb3URFnYsjXbdAVWX594fzsvJBUm13SFQFkvOETcD\ngdY2eU\/OvyqJO94xzt9vQfKJr033SrKVPXk+DfZcfM6nTQqcf1h4Z9tTJEzoqAUoeBwXjUn08XDH\nO8ZbGvy+kQNw6HBhLnop7nqIegVp2F+S2at+VkSIXLVgkyupkR+AtnqAMCfaDSgccMc7xkWT6Cdt\nM4CBAInLFFdCOdFDhLC9ALQfBPKwFCopCOrhf6Dd9wNIVDCmkktCUIAp7mg2YvLPTHt\/HfrXiHoW\nRt5LuwxtDbgQgOX\/XRLNIgTmrxqiomGJjy36vzS97wGEImAxZA4EJRpHdxbr7\/snXGh+okWMRjsa\no8K8ZYes7590dbLYfwEzNu\/lp0h1pAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_musing-1312586824.swf",
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

log.info("mental_musing.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
