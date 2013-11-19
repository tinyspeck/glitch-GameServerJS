//#include include/takeable.js

var label = "Bummer";
var version = "1337965214";
var name_single = "Bummer";
var name_plural = "Bummers";
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
var parent_classes = ["mental_bummer", "mental_item_base", "takeable"];
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
		'position': {"x":-19,"y":-42,"w":38,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH80lEQVR42sWYeVYa6RrG3YFLcAlZ\nAktwCazgHntKp20TMUaNMTEOwURj1KgYERlEQBCEErCAYirmGUGck3RXR\/3\/ve\/3lWWwTecaJX3r\nnOdUUSHWz+cdy6amBh2e0ajMOxqa2RoJM\/ViR8MGPMvDE+Hmpv\/HQR4sgkSAfREBHyoymYHImyxE\np7LAT2fBp4wCglb8LyKKfx0OH8wTqPibMhQXP0Bt5QR2zSewbzuBw41TONo8hffeU9g270N4MgH+\nMV7xr8JxYwnIvj2CbfUJVLUnFHCvDvCYALKn8DFwCn+Gz6Bk2oGAMsJ815B7R6N3MKSCH0MXmyhD\nWfUJ8vPHEJ8uQGQiAem5MuxaBRHQfQofCCCHgJEz+Ct+BjldCQJj0QqHP6fhcCThMUzgGeaAe8lD\nYrIK+dn3CJZExamirxOQW6zC\/vpfooNbnx0UYmfwKXUGeUMZIXmhoZBYBIoD90dIqYug\/s0Ia70u\niE5kIDaZhwhCEbDYmxSkZgvoYgGKy7twxIg5+MF\/Cn+EEDIquvgpeQZlS62xkMHJBEPCis7JdR2W\nFlO3vSI5xk8mES4JSazaonoPqsaPcGDHInHVhTlAIM8opMCLbu7YDxoH6R+LKOp\/kGfYP0TguLEI\nJn4YIRMImILkTBpSqPTbDBSXqlA1HWI1f4IPvnPIIArDTYXAlbV98CsbHG5Hv6PZ2GWrmLrXQVLw\nZfQCjCgzK4pez+fh0CVQJ0m4CSgVXhPwHdt7hIwK167u5U5Xa1pTEbjxpOFLcJZuO7\/W4wBr78aF\n2FGOAmVns5Cdy0LuXOQ6g\/dyC0UabpKTVFg8e46PcOwR06Bk2MemHmGuB3ifUQQn45CYSg39\/d9s\nvRtt1j6nYB9wychnez\/ThsLcDItg8znIq3JQUInnPH7OzeUoeFFTpYVDGjhRUVuDkm4PDp2ncOA4\nhcRcEbaUYXlDWw8z6FWgMJRpClNQ5aG4QFSgZ\/JZhBSdLGBeHiJMdfWYtqL4TBbSqjJt7vmlPRyX\nYUNjp0p\/uDm1UOBL6I4IV4DyO9RiEVWAEl5LkMRFmpPYhrb1R5B8m4P0fAnC43EKV9Ic40wPMw0F\n3DHvyWtrBxSAOLat2m4pL5ZnKuoajkARktyngHMiICkmTB+Io0gnIICR1ykoqClgpWFwqemU\/E8e\nZ7B1VwzvQp4n9yuaomzfeggVdYk6SQFVVwFJ75QAg69ikFMdAqtsoIMF7TZzkjmDmm2XFkdhPtdG\n7iOU4tC5j1MmBonpxBUHSa8k7sUmLwNGJsh6Fhm61sN1D1x3Vh96ZKt9Htk\/fScxnW4tr1ShYtzB\n\/MoIZU2Z9jGEbYtORGFjYBPnNos5WKKVnDnPweS0CEgmUIQCxrCP8mSJgGs1bAJXsu1BSlsE90gY\n7AM+2de+n5nLyDKqTAu55pScfGuYFdzPveB86gb38y0cf9uXwzsthpdMHzIuQwhIlo\/AdfugrsPZ\nUrO\/xyUzSX8770joWosmTgJ5QMkBO+KDzeceHgEV649d2FJ2aRMncJJ7F+GdEMNLAL9p3KUXd4Q4\nbifkN+eUvPyagM2+FwHD1vDWEGk\/tLE\/dsKuY\/8CTiqOevdIeLmvbdtpda11x3kE3NTn0RYczzCY\nY6SH8TctIuczZ4u11zlT0JToIhGvh6srDoT7+jMsPWxLXr8HzkHuIgdcA0FZ6FVcEZ4o33o9l3qe\nBCeFluYewl1rSdgc5vn1J\/6Gv9RYepwt4dcxWrEELFIHF7wuHDmsj1mFrZ9t\/eJDHtnbnPigmwAa\nH67LEwtZCkZyjoQ1JBaF4Zteniy9W4yj\/+p\/MHTa2oxd6zfKQ1O37Q4zxAqllZoEJnAvY0MBZbT1\nG8PAtlh6vXC13VhatPctvOOeo\/kmcLh1C7mlilgIr2IMLrWyG+XJardnyNzjBXW7hZn6QcPM\/qyV\nv7url727t2JYajcZ9A\/WZN8WVlurY8AjZN9VxQY8Fr3dfDV2u8HU44HoTBniSwVg38Rg6XczLPxq\ngEV8g9P8bgLiJn0vHuTueEaDMlYZ\/WJOGjttrfrONWzUQQiOJ8gqf\/u\/KKw8dMPqIw9CesHaz4J\/\nPI0tJwRzP+tAdRch7xlBfc\/Y6kK41HIJ4rjfrT\/x8BL0pW28wzKz3GECax9D\/15D5L3tC5Gha3OI\nuEggSaixYMD6eAtmflyGWYSc\/0WPoCuC4znLF3BsMYMcrHTZAUEETYeZWe4ww1L7agXFqNuNAnHd\n3OPCERkG73ADNmQNVu9K16bwd8i5Xwww\/cMyvP1JS92MzRfBhaFzPgvgy\/sqDb8k3QMreF+GYOOZ\nD+xPvBhiDjeZELiHg43Z7\/S4WpFQ03w8h9R3bsDkf9Qw1bYEmg4rxOe2wTHgx+84qatUd8UzR6YE\n7nwk9y5pkBtqWNc3dLkVEqTkpEHhhMV2C8SmauAZiWHu+fA9mAE7OmXpc6O7OtDet0NitkKdxTy9\nJEyHxk4nfdcmUw9JQu18isvn0zCs9ZHcZAEnDoY6hKH0kV2Rukq08VRS4EKksBoKqMGmjJDCysPN\nC0jTRV56KWQ9qK3fR10lsksaELX+hK00fY+DbNR6BSNgdUO9m6RXXgUVYT8Df9b\/2sRvDam7gJRA\nPZdAzb0irOUcVhLeE3B8tjZ974Os\/lqFi0E34TKo6KgESxq8+Vz4GeE83x+u\/tB2MnKtgjHoCCwW\nEcJWJFBRHnKumB55FV\/aiG56\/BeDOwpVfMdJpwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_bummer-1312585926.swf",
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

log.info("mental_bummer.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
