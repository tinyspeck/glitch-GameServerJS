//#include include/takeable.js

var label = "Emblem Trophy";
var version = "1340228514";
var name_single = "Emblem Trophy";
var name_plural = "Emblem Trophy";
var article = "an";
var description = "This trophy is awarded for collecting all 11 Giant Emblems. Giantdamn, you are good at Glitch!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_emblems", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by trophy_base
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
		'position': {"x":-20,"y":-60,"w":39,"h":60},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJWklEQVR42s2XeVCT6R3HARVF0YCc\nKuESg1yBcEOQcAYFIXIKyClHFJAgilEDhBvkMIByn4Ko6wEeaMVjaT3Zum62bu3sdFXcbg9bu8Z2\nO62ddubbX+Jup93pH50xsD4zv3ne5H3e9\/k839\/xvI+GhpoaXp1mPP2obPrKYDRP431sf3rWNn1\/\nPBn\/697fFaPOSps3mPvns4a+D\/B8Zg8e3xDio4vZsu\/+\/\/PzIxMvf16O6yNbZgeqOPMD+I+XJ3gv\n5Pvx9ed1E399MShS\/r52Oon3+e1CzFzOxqPpfHx2u3ho5qpQ8PJxJR5N5aK3jDN\/bv\/wVJrg0VQ2\nPpncjh+fTsaDqR24MJyIjpoQdNfx0VPPRyddn+6Jxb3JHNweTyVVM2TzGm8nWwPlH0\/lYKQ1Atkx\n5hhsCsS1sRjcPBmPy8MCnDoait46XxSlWaO\/kY9bFzNnr5+OZ7z545jgxWfVole\/aLZQK9B\/BrjS\npTNX84Y6qgKwP9ced8eT8MvpHHx5fxe+uCXETyfTcXU0DieP8DHc5I+2Mg566oLx8Eb+7M+m8nD\/\n3DZM9kfhzoWd6WoDvHsuffr5gzLFk3v75DPn03HyaCREqTZ4cCkVXz0Q4+snnVA868MfHtfj6a2d\nuH0uFeP9ApxoC0V\/AxeN+5xwpnsLOqVcTHRuUjTvsVOvgoN13PQH51NxqTsSZ7o2IyPSDFOj0aSa\nCIrnw3ijuIu\/vfoJXs\/24FczuzBzYTsmh+NwpjMcw808dFd7oKGEjcsj8eir5w7NSdx1St0njrcE\nYrAxBJI8R5V6v\/u0Cn\/5\/ST++eYx3ry6CcUXrXh6ZxfuEuCVYwk4RwsaawvB4CEuOqrccKJ9E8Vt\n2NwlzAcd4VLJDjYFfiAeUqz9Rl6O11+O4psX43j9rBcvPinBp1eFuHYiCRN9WyhZwjBKi+qv55KK\nXuiu8SfweMrqHDy5X0qxGK2+OFTMdqaf7QhX5CeuxVgrH3do13h2ewd+Ky8lJUvx\/F4+Pr6ShSuj\n8TjVEY6RliAMHPJDb60PgXmhs8qDei6OHw5FH8XiOMH3VfvMKrfIdwJ7MlMuenSzWDY1GIvRpiAU\nEOBwcyh+NBKHuxOpeHg5g9ydhg9PJlJ8RpBafjgq9YDsoAsO73eino22Ug7aK1wJ1g9jshA07nFS\nSISWAnGuNUOSZfVuCTNQ5SObaA\/Fpa5NGGsOgiTXAUcr\/Skro3BhIAYXB6JxmpKhv4FKSqkr6ops\nIRGaQ5y1hsYyUVW4lrLYAa1UbnpruWgv9cCBHEv17SziXH1GQ5H9RK3Ibrp+t6O8s8IXZXnOBEUF\nuSMCozIqJfX+aJW4oDLfGoXJxkjZtExlBYmGKNvBRMNeO7SXu2OA1G2XeAzNWZIclvgKeiq8UJTK\nwtmeGEqCzRhuCUFXtQ+p5EjKMJEdq49E\/hKkRujSOBNUFlijmdzcUeWJ7gpPDNQEUC0UyC8fz7JQ\nO2B94Xpp2z4XdEm9cWifF870RGO0NYx2Cj+0HOSQO9dhP0HuzVitgq0RsXBY4kru5ykTAi172Rit\n88cgLbKr3FeqdsCmIgf5jeEYNBbZEyRlZ20guTkKIzI+eut5OEITyyRuKqi2MnfKXB9VbI42BqAm\nfx3EmZaQZFtNV+xcJxdvt5xQG1huvD6jsZgtP0K7QZPIDntSmNNVO21nZSVOaD7giaHmEIIMoz4Y\nA1QjlXVysCkY4z2RaD\/gDEmmOaoLXdKV7\/nuncKtxur9PsyOMxHkxhlLc2JNRMrf5TvtZEVbTVGe\nZU6K2qFF7I6uKl\/0USlR9kfI5RU5lM2pZmgXu6G\/NlA+r59cWTF6FjVCGzSK2NgZbagQxRmgOMEY\nojhjFMYZojBGX74j2nC6udgJfZU+tBArzPs5pGTbanl17lrkxxvKaoVGs6UZTIxSLB5IM0PnbsN\/\n17qsLQZDxcmrFfMKlxyuJ8iPNVJkbzGYpmtVyZBkmgjKM8xQlGDyX2qlRurxtkXopWv80O1YOVNQ\nnWeB7KiVMo33sZ1scZfePeM3q\/G+tqs9PhPy837oLjZ2fi8Bx2pYs9d7nSlBjNLfK7C9IQaC6gRz\n6WGhkeJUrTXa862H2gtYP5yKxyV6FklrF6Qns7Qnkm2XoDJRDz17TTFSYYk+iSUeXfLH9JAn8nwZ\ns2lOOrLyuOWCeQETu2kwBg7oTaQ7amOTvhY26mkics0CiOP1cLhwFc62udCBKQQXutxQlmmKDeYL\nEcrQVI2tSdZVlG9bNreuL\/LVlu7hLUZXEQPNWStwMFIfZbGrUJFohZo0e1RncVCd64nKTDaqUliQ\nJtAenGiKvhJjbPVeDPeVmgo3fQ3GnKlXttlAUR5jjjSHhUjkaGMrRwfJ7suR5q2PTK4hsvxNkM0z\nRdYGY2T4GiDFi4Ekt2Xgmi3Eel1NBFjrYoOR1tzUyP18PWlJCgcNRRsgsNQC10hLORl4xloIMNFC\nEFnUOl3VdTBZIFkA3fOjMb6GmvBk6kLgqY+8CEsErtFwVrt6BcG6CpnYD9u8VyLQVAtFMSykhFrg\ng7ZYhDIXIcnVAHmxLIiSHZHmY4RIax2IU+zonBIIIUE5rtCEwNuMlNcFz0RzWq2AIm\/toV3e5FK2\nDqKsFiLYfDEKEuicUeiOtj0+iOUYIodvhl2JLhDHrkXeZitE2y2HMNYBA6UB2BVpCY+Vmgi0XYH8\nGBvwaIFeRhrb1QIXHRYkr+AuQS5nERLXLVCpp3Tvjs3mKNlihgKBJcIsFmGz7VIUJthDmr4eUXZL\nEUzjMjeao0rIwfYQQ9UzTpTRrgTqZ6IJtqkObG1ta94ZMDw8\/NjuEBYK3LQRaf4WThV\/pgRrra2K\nMWW8KYFCmQtUFvhtHAasWoAAs0UUg2+fUarIodLkQjFpb7UGDg4OeTTFwncCDAgI2BrFD8Jej8WI\nsl6AjRZvLcz8e8ZUmhb4ZgRKFrKGEmc1QZLxVikX9NY8jAjOWAfrbW1\/Ta9fTab9LnyaZPr84OCv\ngh2ZcFujozJPMx34Wy4D30YXUetXIM6BgWQnBlKc9ZBGto2th0RHBmLsVyCCtRwhVF78LJapnuWs\n0oENcxVsrK076d3Mb+d4p7bU08OjjWVjg7VWVlhHvZ2tLRwdHODMZsPN1RV0Hz7e3uD6+oLL5cLX\nxwfeXl7wcHeHK4cDtpMTHOztsZ7FUoLBysLim6VLl7r\/P+r9C1VCGu84X+prAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-12\/1292638800-1822.swf",
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

log.info("trophy_emblems.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
