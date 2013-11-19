//#include include/takeable.js

var label = "Gem Trophy";
var version = "1340228514";
var name_single = "Gem Trophy";
var name_plural = "Gem Trophy";
var article = "a";
var description = "This trophy is awarded for a nigh-unnatural love of shiny things that doesn't involve putting them in one's mouth.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_gem", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_gems"	// defined by trophy_base (overridden by trophy_gem)
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
		'position': {"x":-19,"y":-50,"w":38,"h":50},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKjUlEQVR42u2XeVRTVx7H38yZUwfr\nOq6gFpUdRYSAIi6gUqu26lQ7ttWZ0elMbdWpdkGdmXak9XSx1AVo3RCFsCdhU3YTCfsSIAHZNwMk\nJCRsCRAI4cXv3Dxax05negaL0\/mj95zvuW\/Jfe+T7+\/3u\/c+inqMBql0BvX\/1kDZe9F2z+0atd58\nlr4WzTZExR0aeefUsu8bI1bBub7HeFzWbwwVKYx997ppoWLQeHHECD8A0ycMbpRyDKUpRzCasxZ6\n389QzPLBPdazqFrp01NjvfbTfx0jlBlRrDSiptsIQUMfBNIRFCmMaOwzomf4AeGDZEIg2ymbUDll\ngw4iBWUL1RRnxC92weVpSxBMzUESZYFblIX60TFZMniZAHPaR8Ar70R0iRzJ99QQttMQq4xo63+A\nQQMD2Ufk\/NhwyZSFXwFliUJqMYqJSogETuvxOTUL56nZCKXmIZUAskn\/NjXZ\/KF7cvpAauMQeOIu\nRJV0IEYkB4+IX9+DPPmYq526B6CND6AfNXYTyKmPBXiGmikNIi6ZFG6+DFmsTRC6bkLg1GcQSADj\nKXMkEt02d8JNar7XN+M4kh6\/SFEneJIuxEtU4BC4JHEHyqS9aFQNIrVahqbKCKjrb2BYI0B7P71r\n3HAfUDNfeJ+agWPUNLxLTccpchxjxUIbZQ2x5SrEz3XENWourjxlDsXBowDlYLmQgplp7B3pqFek\nSIloUQcDmFHVhbryZHQLP0a\/6Ag0+S+BFnhCF+uC4WIfyLsa48YN+BY1LfQoATtKAN8mvS9RjJUr\naqklaCSqm7cKiau3IfYvApyw44Nl0d1n93Ml7CiF1H2OmnP2kobJvSSJEjUdXRi59xK00a4wJLFA\np7iDzv41aOUnGK3ahurWUrT0jrNgDlJTug9QUxjnThPdXLsV7JnWEFKLSN4tAPdX3vjydBPOnDFg\nrfsgHCy0sJ\/ZA7tJKgKpZPQyqwSpuTIoKgKgy1gPQ\/Nr0HJYGOa6MJD66k9gaNqJ7KIslMiHD4wL\nMPj1I\/tPeng\/4B19D41FxdB0d6HgXCDCqfkIcjqEvx5ph+8+EY5t5WO\/TxWeXd8Nh8UDcFuigvsU\nIdwoNpZTHBx0i8RIzibQbS9imL8Vxt5bGLyzHv08Nya8PbxVEKZFJI47xI2NjdVtbW1QyGVQd8gw\n0NOFbmkTskILsd9Lgd951+LtrRl4yycdfyY68VIuXvEswDqzCLhTNxitpEJQELQfhvItoBt3wFD\/\nAkb4XqDVn0Ff7wt12Ep0fGGL3rNLxxdemUxm1tzcrL9\/\/z76tVp0mQC7OtHbWAVtSw3Sw4h7e9px\n2KcSR32EDOBB7xxY\/4wLj6djGDgWFYE\/sQIxIvSGocgHo6ItGK3cBjpvM4zyCxi4ugxDlxwg97eV\njts9g8GwprW1FXV1dTAajdAS9wZ7u6BproauqYJRXU4Dju9Q4A0fJY5sb4PzzHzYTMqE\/aQMrPh5\nKQlvLQqDDkGfvg4GwYYx0PyNoHM3gxbvA31tDFDhb3N83ICVlZWHRSIRBAIBxGWlaKgUo7k4G6ry\nHAw3V4CuKcRQkwR1uffguyMT25blwmZmBiynRsLKLA4rJ8fhkOtnGE72hD5pDfS3PDFyaw1G09aD\nLiXVm+QBOsABA186QOlv7TVuQC6XOz0sLKyPzWaDx+WirDAfdaICtImEGJTWwdBSBX1DGbTSWiSH\n52Dp3HgsmMmGxbQQmE+5BguzEOSdfxlDvNWkYkm1xhBxVoGOI2A1z4O+Qtb0y47oC7R\/PEBTi4qK\n8jMBhoeHIyMtBRXlItRLStBWlg0NCbFeJYOmtYHkpxS7nwvBDOrvD7XW7j3oiGO6WHcMRbIwxCbz\nXwSZ\/2JXYYQUzNBXDgyk+oIdFOeWWD4WIJ\/Pn07gGBejo6NRQEIurpSgplpMQl6MXmU7qW4plEoZ\nahqkcFjo\/xAw9NReDCauhi6GBR3bBbobK0HfdAVNXBwu2wLDVUcmB00V\/IN2MhKJ5HJJSQlu376N\nW3w+8qqqUFhfh5JGovoayEnxSNWduK9W45x\/FgPntPAU+lI8MUDybCDWDUPBKzB8wxn0dQKZ4Am6\ncBMDZ4hZC8V5+x8G2NDQ4GMqlNTUVHCTk5FWJkZmQzPS77cipU2GYnU3qns1qO3tQ02rCoumfYzQ\n0\/vQSqCkV5aji7g3EO4CfRhxL5gAZm4gFU0KhZxrwlZD\/oWN8AfvB5OSkspMYWbHxiJakIW46npw\nWtoRJu\/CJVU\/KnR6lPYNQD44hL07r6Gd5w0VAesIdkJroCOaz9lBdckJ+q+cQN\/xwkCUKwYvj4V3\nQgDz8vJsSQ7q2FHRCE1IAre8EqF1LfiqXY1PlAPgaQ0o0g7hXh+BzQ9Bf9o6aMjy1RvuCjVxUvnl\nMsgJqPY8ybu73tCEOjMhVp5jAC9OyJafhPikycUwDg8RAiGiqxtwtUmGs+3dON2hRb5Wh9IeDaQd\nYgxLnsNwzkboktdikBSFjlSvJtgZ2svEQeFGdF+0YwBNU0zHF1a7qIlqTKijY3AzIRHcUgnCa5tw\nhUBevK9EQHMHKrp70dLTB1mwNxM+Rv7kM8HfFl1kUu6\/6oSRgs3M1GLKwb4bbuNfg7+vqdVqaw6H\n0x3G4SIykw+upArsqnoE1zTiKnE0pLIGCm0\/WuLf+Sfg1yLLGXoiXKHlb4AmyB4G3gYoLjhIJvzT\nk6zNf4ggcyI7Lh4JeYWILS5DRFklwsVVpK9AVm092qqzvgsYYE82rNuhvLQMw5Ee0ISwJi7\/vvVt\nDDxVVFSUzI6MQlxaBhJy8hBXUAxukQjcwhIGuqqpGbrinVBdX\/EQcLDsDPrvbmOOVRftxyr4nO0B\n6km0lpYWWzKByzLJ\/HibL8CtLCGSsnPHRI7v5OVDq4hlNqi0\/BBoxTvQ1x7+lqOmLdZjL3H\/pZOL\nOlVqaUeHAhkkH69ev4nAy8H4\/EIQPvr0c7z+5jH8Zu\/zeP\/kLrCDXsTND7aBfWo7Yk7vxo0LHyGG\nmyIsqFVYPim4419\/cEM3pEerrBOiijpkZosQk3QXwZHJCLweh\/PXeAgIScAldjKux9xBeAJJh4xy\npOU2IEeiQG6FEnmVSr+ylt6Jq2ROaolfbEoxHhUvjeRepois1aVIuVuGNGE5MrLJkpgjZnrTuem6\n6b7pd3HpJeB8+xnCJwbISS1mXphIXnybAKRmlSE9uxx3csUQ5EuYPoOcm66b7id+A5j6IwGmPAqY\nNwaY\/r8EfLS9v95K+KG3Fc5utkHAFltc2W4H\/pubkPHGRgRtsYb\/pqU4s8ESf\/NchHdXWeCI63y8\ntmIO9jnOwm7bGaCedPsJ8CfAHxPwo3XPHP\/Qa2nfh97W3wHkvOL2bwGPuS\/AIZf5+O3yOdhDAHdb\nz\/B7EmyTieb7rXtGbgIIeNaagNkjeq8rovesQNyrLHBfdkHE7hUI3uGIwK125A9YwW\/DYpz0WIS3\nWOb4I3FxP3Fxl\/X0TvIsW6J5RGYTBWh60ELraWYeu21nHdlpM\/vEEdaCUF+PRUm+ayzTjq9aKDjs\nuiD7NWfzvN8vn5f\/quOcvL32s7P32M7ie1pMve4y9+mzrLmTT6+ca3Zi1qRf+JBn2RPNJvrlf3rh\nPwB4ah9rap47FAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1278112411-4114.swf",
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

log.info("trophy_gem.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
