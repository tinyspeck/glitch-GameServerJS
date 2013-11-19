//#include include/takeable.js

var label = "A Mirror with Scribbles On It";
var version = "1348261484";
var name_single = "A Mirror with Scribbles On It";
var name_plural = "Mirrors with Scribbles On Them";
var article = "an";
var description = "A loyal Cosmapolitan, Algie once gave this to his best friend in Groddle Forest, Jack, in retaliation for bestowing the nickname ‘Pond-scum’ upon him. A normal mirror, Algie hung it in such a way that he could reach in through Jack’s window at night and draw on it. Leading Jack to believe that he was sprouting unheard of amounts of ear hair overnight, every night.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_mirror_with_scribbles", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-35,"y":-23,"w":67,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKnUlEQVR42u2Y+VIaWBbG+w36DaYn\nMensMTH7oqTVJC5RQRQQUNwgroCsKsoiqyACgrihKIhL1Jholt5Nz9T8N1U+go\/gI3xz7u22e3o6\n6W2WrqnKrTolRIQf3\/nOcvPBB+\/P+\/P+\/LHn719oPvzLjlrwz\/GHwTxJ1etsuhsHHnPhHnv+t5dt\nH336pBlT\/goMau\/C3idAwleJ+XD14ev15giD\/58C9ndddVg6ruIIkAEsTQgx6a\/EiKUYq9P18PYX\nY9RWiglPGTbnZfx1i7GavaWEcC+bEO1tzEsc\/zXAge5rEa+1EHHPw4NvXmhUGynZQcT1EMP6O5gO\nVCJKjwO2+5jwVu4nvBX7k95yzAarBJP+8oNkoByBwXuIe8uwMSet+c9463l7zZsdTYTi4JtdDb58\n2oYXuUZsLTQgExMh6augdNbQh5ZjbqyKQy7GRchOignsEdJRIdZnJViZrjsMO0r3QkPF8FjoC7of\n\/H4V\/7r7OP\/NjjrNgFh8vtnCU+gfLIal6yaPnpYCtMrO\/yjMnTfgNgs4UHpCBLXiAibcD7GTVfL3\nebWm2nObCzGsuwVt80XdbwZjhn+zq9lmb7a9KEdwqATdqnzUVxyD9NExSChkVSchqz4DSRVF9VlI\nv4umugsQlh1DzUN6Hb3GT0otEiRTdCpYibDrPsac9w9dpjv785Fqx+vVJsdvKqBvdtW6r5+1H67P\nSJAMVEDffglK4XEoRR9DUXsRMtE1yOsEUNQL0K2uRFvTA2g7qtDUUAxx9W10tpbzUKtKIRcXEGwe\nWqTnEBuh17UVIOZ+wG3R0ZSP3vYCGDuvY3lSfMBE+UWffbXdlmZ\/vBgToqvpAppEeWgUX0Crooig\nCiGvL0RfVzUc\/U2IBvow5jViIjTAY9xnRHysH26bGla9GDqCHjDUQaMq5pBq5UVMj1ZQVOLlShN6\nWwugbS\/YnwpWUEHdZ17d\/iWv7fN0Dn6CVgmpJTwNdaMApp4a2C1SRHxqrC6EkEvF8fnzTXz9chvP\n1jJ4kklRzGM5NYWnuUXsvdpGIuyDc7AHFp0EXe0VkAhvoIYgh6jCnca7mKFU69VXsDEv3WfF4qVi\nyU7W4ufgDp9nFAg7StBSfxItsquQidmbiZAYacbWcoSgNvD66Tq2COLL3S0er7fXsbY4h\/WlOXxK\nj18\/XcOb188JcBQ+5xA89gFKvwQtihLKwC3uywABsaLRtV9B2F6CUWo3k74yboG3ppUp93xJAZ9V\ngHbpKfLFPfRqyjDhU2FcW4fNmQgH+3T7CXa21hBemMf21ipX8YudTWwuL3AFd54sU+S4stFRDzKz\nkxh1O2DvNxGkDI3STyCsOAsfdYChvjvobLoEVsk+axGYirmk+KeAR5WaCldB03AGjZKb0OuFcPra\nsJGJYcFlwrRZjZWoD68IbndzFetrOaxSfPbsCeLpFHYJans1g5cEzVR9sbkCv2sYX73Y5mr7HDYE\n3cMYsanQ3V6KwHAJFUUtNORJo+YqelQX4Oy7jShV9o+rlbr\/l09buWGHdDfRILoEq0EE84ga8dk4\nnlAs+m3YzqbwYiNHsYKXBMiCwbJ0ssdMWQb72bMNbgP2u7DPxWHZ7zz2QQ67sx5Bf18tBzR1XEPV\nw+Oor8pLdyjPOpz6246Yq\/THE4VNhJ1lJbwkcVMdlbzmAaLBTgQSMQzGotQOBrCeSmKT\/LWaW6IP\nWOZqba1lsZLLYHUlywtkPRHisEc2eEkKrqbnOGxY34bgiJ3DvtpMIZ3UYYO6hK79KsGdhEZx7tCu\nvxXxmQsFoeHi9Pdwu2vK\/O0lObI0ili5N0nvwm+XIzcfJ8On4InHkIoGkOzvhmssANtEDJnMAlVt\nFuG5GUwupDCenMCs04hcxPsTZY9gF0NO\/sUYLPPsZsaE1Dj1zLozUIpPo678TzzFLsNtRJz3f\/Dg\nF1utDlqDWN6p3AUU9zE1bkd2JoG54AjBmpFJRpCcSSJBsZFdwExqBtmleQSnk\/AmJ+H1u5BwmuCO\nhOAPepGdS3LPMdBNej1rOSvjI9\/DMrXTk+00bT5GT3M+miVnICr\/s6BDcTbt1N\/ai7nu\/zDydnON\n6QRtEh7zPWgJztBcjKhnGAm7EbMBB5xuO0apVdjHx5Cdn4E7FoGTgim7sDAL32ScFIxjLDqGUIC+\nkMOCVYJPT01wsBz1RNZ+GCzzL8vKVtYNu+EuTI+vwKi+jAbhqYN3Nub12fr9mOsBHMZSmLoeYsSq\noUkwglFzN\/WjQcSc\/QiMh+AOh\/iH2emng2AdkTD\/YB+B9o+Pw8W8SorG56aRnYqSRWa4\/zaX0xyW\ntRoWK\/NBPM+qYGi\/DEvHFXQoz1PLyUu\/c6Qt0uoTcZTSNlLEp4XfYYXT0I0BiwE6ow4jZi2mJsbh\nDI0iQ2mfjEdgtRpgHzBhaZqqe26KPnQaU5EgFuk564MxQxvBzVKqp+jfyCqJKFKTMXoewNfPO7AQ\nrYZJU8AVZAUienAs\/62AuWmxLkPFwVI83FcEZX0RbJY++J02GE19qG9rRY\/VggGfh2atC2GKoL4V\nPm0rBlqkiId8HHqKvBcL+THjd2CZlJtJRJBboJ+xMR5+miQ2UxuWp6VQy89DQzHQdQ2ymlMQlue9\nfe4GrKUfBm33Dtk2G3GWYox6kkpSRBuJAr0d7Whva4FIVg+VXgf9gBW1dWJIpGJUlZWgUdUIuVyK\nLlUDLQpuDFMz1vRbYXWPoD8YQD+pPT+bpB44guT4KJLhXr779T2+Bm3LRQz23KDCOMvgDupLj799\nvYrYSx1D2huHpo6Cg7i7jM9Ce18JmuWP0FAnonlZi0fCGmjaW2GwGKEz98E+aEZvoxjCezchLCmE\n9KEAar0WnVYzTQcLYjTW0klKJXmNqavtaMGznBFLiVqEXGzFuoxh7U2+cpHvDt+Z2qNj6779UcD6\nSQ0DZAPaayki\/xXhcXMlpGIhZHVCDmvofowh8mTTYzVU2l7ISFmZpA5l1ZUwdmlofDkIRo0AKWnS\ndsFm1mMqbMBaSsl3PZWYtZOLcBnvQFV\/9tfBHR3Wuafo4kIXGP4GTsMdGtx3EfWK0KashKS2hsN2\na1rQ09NJH94HuUQMhbQOSgppoxwWfQ9alA2kvpRGmBLr8614lpGT387ypUPXms9XernoNE\/rr4Zj\nZyZQ+qHHXHRoVBeAKcnghigNDv0tLFEBzUYUsNAm09oogvQ72CNlmQ16HyvQb1Ai4FBQe1HwWa5r\nvUjr2W2+Sw50X4eBFoG6Ryd5O3mn537ueEyFNSbNlUN2G2P3BV9\/EYdk+5l\/QIBp2nS30jLEfLWI\nkbJM3RiPGvKXiC7nN3jLcNACKq06Do3sDP39DVi7rlPhMb+d2P9Nqv3rsfZczx+kb8oKhVX1mL0Y\nI6Y7mAs94oqyymNzso\/uJHQH5iljK5ladpouTXloqj1Jd5UTaKz9mK4Fp9AsPQ9RxYlv01mWp\/qP\nXL6Zio6+2wfWrqvobjrPq81DSyS7rzJfdjWeg633Jld4wvOAbnEnKG3fBoM5CqYWhePfUuznjrnz\nsqBHeS6fbv86UtBBq0\/E2nl1r0NxZk8tP3No7qTxpLrE1WEgwvLjOlH5CUFtxbGP\/tD\/rZJW5dVQ\n0P02j+BORH6X2d+f9+f\/6PwDtnnkmTFXe8sAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_mirror_with_scribbles-1348261484.swf",
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
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_mirror_with_scribbles.js LOADED");

// generated ok 2012-09-21 14:04:44
