//#include include/takeable.js

var label = "DB Music Trophy";
var version = "1340228514";
var name_single = "DB Music Trophy";
var name_plural = "DB Music Trophy";
var article = "a";
var description = "This plaque entitles the winner to bragging rights for collecting all five DB Music Blocks.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_music_d_blue", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_musicblocks_db"	// defined by trophy_base (overridden by trophy_music_d_blue)
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
		'position': {"x":-25,"y":-50,"w":50,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJQklEQVR42rWYd1CUZx7HvczcP7mb\nu8ugFEEFG4LUZRe2UpddqiC9LspJsKBy5i7ERhHUqLFHRewaW7CgohSj2BsgiC2WWKLmLmYyubt\/\nbu6Pm+\/9fs++uyIxM2FXmfkMu+\/7Ps\/zeX6\/p707YMAv\/Ol0ujCtVlvxrtFoNAUDbPnjwqrgYKiV\nyneKSqFos1lQo1ZzBe8MjUplv+AkUz6+f\/YIL58\/Fnz\/\/JHgH8++Efz924eC754+ELx4Yub54\/tm\nHt3DM+abr\/Et8\/AunhLLFi6wO4KHLYI\/vHiK7ZvrsG3zRjObLNQKtta9Yotgg5mNFtZjc+0rejqv\nYKkkqA4J+ckmQQp\/G6fAIpg2frwgPjbWJhLj4611tJ1s6i0I2wWlCL588cRauTZlNsLy1yLctA4R\nBeuJWmIjUUdskqiTrvG9DeLZSHo2I2fyK8GaKutEsUtw5dLFrwmG5a9B9PTjiJ7RDMOMVhhmniJO\nE2cQRVKxJc3is\/ka3ztJz7VQmRPImfiRqON0axOOHtj3lgSXLMIP3z3tJbiWGmsSjRpmfiVEjKVn\nET3lGCIzP4U+ZyV9PyeuhU89BcXEJvjkNGBEypdQhKZirKcnDu\/fjSMkyDPZ7hSvIMG7PdeF3Pik\nJErX572iR3IULRaKotTGUfQUqZ9DPvEi3FNOwHXcUQxOPASXhHq4xO+FTJsiBGvXriLBvXYKKpVi\nkrDg+baT1gnCggYW5NRJ0TP+5QJ8k9ZhZPwXcFTMgVtyK9ySWPAYCR4mwQMkSCnV58JnzBgsmD8H\nR+r3QWmPoFql6lL3EUyMi\/uZoKroKyHjYtwDh9FZGBy1RRJskgQbrIKRiZPgN3YsCc41R1DaqYKC\ngv7Yb0EV9YzhSXL+9ElkpKRgXGKiVTCqpBWj0o+KNDqFroST7G8YGDgLQ5JPkmBLnwjWC0H9uCIE\n+vqiunwuGur3iuiJxVqlCrNL8BwJZqanI5kF82mMFTTANbEegxMOiggN8i+BKwmxoHPwfLiPY\/FG\neuYIPcNj8Es40xg0JBcjKCAA1RXzhKDGXkHu4aplS0SKszMzkZiQAM+MfXCO2y0iwpHhSTDQfyqc\ntEvgFrmBorkKDr4fmuWs428\/ldmDoLgyKGQy1FTMNwtaDgw2CUqrfMvxI5TiVpFif0qPU+x2OMfu\nEg1ywyzpKP+ExJbDRTEbg0LmYVDATGn2SnIUPee4LyCPL0OIXI6ayvm43d0OLY1xjb0RbGlsoJW\/\nWVTkRUuEU8xWktwhGrRIOunr4OA\/DYPkH8NZUQZX4w5p3L2Sc4rdCXlCmZi5C1mw65pZ0HyisT2C\nzccOofFwPRSBgRjh4QFH42aS3NZHci8cdUuIpRhKckNpDLoIsT1WOS4jT\/hYzNyFleW41XUVWlpn\nWVBhk6A0gJuOHsSxQ\/vF2HFzdSXBjZLkVindO4XEQFkpHHwK4RqxRoxRIU9DgTvCco4xW6BLLxed\nZsGb169CZ6tgcHCwP8txWpuOHMTi6so+gswmaniLFM3tZhGOlGCHVYw7wh1yNNYhPKtKCOZnZ+Em\nHbnCtVohGKJQzOxf9GjQWgRPNPyS4EbRqGhciG59Db5mEbM8H55ZKZYuFuzpvIwwSZACUmGTIPf2\neMMBLFpQATmNwUA\/P6iSZyOCIhGZU42o3Bro8xYiOn8RDKZPYSxYIuDPBtNi6Ok6P8PPcpm0go+g\npDGYl5WJGx0kqNGIINgsyAvp6ZZGLKwqFwtscFCQkNZRxeGhoYiKjIQhOhqxRqPYpxPoUMrE05YY\nGxMDI93T0zMRYWEIlWR4mcnNzMCN9kuI0UeJCCrtieDDOzfEusXR4zQrpZedUEoPNywk9XoYDQbE\nkCjDn\/kay0WGhyNMpxNLCs9g7mR2Rhq62y+i0JQnUm67IFX44E632JoCfHysUeSGtJJk6ZQYzJhk\nRInJgCm5USjKikBhug7F9J87wOOMlxPuLEdPTnVkpaWi69pFTMzPhcrcjg2CJKCmaN2\/3SVOH37e\n3mKjl\/eSTE0Mxb9umfC8NRVti9XoqY3A5dUqnFoaiI7VoZhfFG2OnEVOGseZKeNx\/eoFTMjLhdoW\nQX7b54JKqvT+rS5xfuNznD8dlbgBlqwsNeBhazb+93Iy\/t1tQnWyE1bmDsGuMg0OlI\/Bne16vDiQ\ngV0r0qxyMirLdaQlJwnBgpxsiEAoldv6\/U4sBClS925dRxUJ8kmYJfk8x5GsrY7Hj+dfCa6d4I57\nuwy4ukmPNUUyPKjPxU\/NJhxdlyqGRqAk5+vlhdSkcei8ch4mWm5YkNLcZrPg1zc7Ma24SAhaJSnd\n66ti8d\/bhVbB9YXDhWB7nQarTK540jRLCLbuMSGAOsRluCzXEaZRo+PyOeRnZYBfKzR2CfZ0ImN8\nslXQwrpK42sRrJ1kFmxc4I\/1xV7WFLfszhdR61ueBfMy7RSMoBl4t6cD6W8Q9Bw5Emsqo\/FjZ64Q\nbF1rQvPqPJxYnoyWz\/zQsykSOysMkPl6\/qws037pLIomFIhJwi9oNgnyIL5zo\/2Ngoz36NGoKVWj\nvFCBubkylGX646\/pPihN8cIn2f6iE28qx1y7eAZV82a\/BcFuFkz6xYZshQUr5862LcVqtdoqeLv7\nGp3dCDoe8RGJTyH8408P7aW8n\/KW1U3wwsvw8sHwLO28ck6MtY7LZ0VK2y+dEWJXL7QJLIL9\/oWL\nQ86C8YZoLKJ9eBGd3\/gUbIHfKWpod7FQXT5PvKlZ4IWd107BvDmUyjkinQxLWbBMkn7\/\/GH5ZUuE\n\/x1Dw6n\/gvEaWdcEnTdmRY5CsdYDMcoAGFWyt8o0vZ+on4lRB6FMP\/zXv7yXhI1oK40Y+ZgL02dM\nVA7752StxyVTyFDkB7\/OhxqP9iKNe4dA7d5phb5P0Xm84PLTezFVN\/w5dfpKdcJYq+CMsOFdJVoP\n\/1\/j9nvCjRhBeBOBRAgROmrg+8WJvi6IG+uMGG8nRI9xhHaEw1O6V0RMJqYR04kZ0v+SkY6\/W5Eh\nc0O2fAjyFENREDIM6TK3K3QvgTAQ4Xw2IWSEDzGKGEp8QPymr9wfCCfCk\/DjVxMWI6KJxBR\/10aK\nFv6scscE5TARvZBhHzTSvWpiGbGGqCN2EpuJdcRy7XCH\/0SMHgQ9dcjg5YRY6uD7v31vCt3LJJKJ\nmF6ivpKgM\/En4r3\/A6LMuUvUG+ShAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1278112424-1128.swf",
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

log.info("trophy_music_d_blue.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
