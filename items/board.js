//#include include/takeable.js

var label = "Board";
var version = "1353018165";
var name_single = "Board";
var name_plural = "Boards";
var article = "a";
var description = "A solid wooden board, reminiscent of some kind of ginormous Plank – unsurprisingly, since that's what it's made of.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 30;
var input_for = [252,254,255,256,257,258,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,297,321];
var parent_classes = ["board", "takeable"];
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

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/1183\/\" glitch=\"item|woodworker\">Woodworker<\/a>."]);
	if (pc && !pc.skills_has("woodworking_1")) out.push([2, "You need to learn <a href=\"\/skills\/118\/\" glitch=\"skill|woodworking_1\">Woodworking<\/a> to use a <a href=\"\/items\/1183\/\" glitch=\"item|woodworker\">Woodworker<\/a>."]);
	return out;
}

var tags = [
	"woodproduct",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-47,"y":-45,"w":94,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGc0lEQVR42r2YeVNTZxTG\/QZ+BGf6\nX6cjAQVsFROyEAIEsGBAWRVbrXZxQ1klbANBlhDDKktYxIRAJAERFSWiVq1aYhenOp3Wj5CPcPo+\nJ75U\/+tM5+XO3MkNl5n7y1me85y7bdsWHuGRHGdftZaC3abwUL0uPNaoDy+6LOH7w9bwitviCTlN\n9hczefaVfovd266195xNLt8yuNc3CnMnm1Mp6Eyn8UYdLbstNFSnpYfjuXRLXK\/0Z1Cwx0yPPLnk\n79DTWEMKVZZqwlsC9\/dy0Y6VvozofJeZrrfpCZ+jDVq61Z9Fq0NZDOdtN9CD0RwKdBlpukVLdccS\nqLJME90SwCeTX0ZmOwx080o6zV02itNAvo40Bgo608jTlErh0Wy+723TUfv3SXShTMOncriI1+ac\nF0D3hq3ka9dztPCJ1C72mmmyRU\/hkWy6M5DJcH1VX2zCVZbF2ZXX3UqfhR+O1OET9QVYXHsa99OS\nK53Wx3IEdCrXXfWR+Bic6vp7u1SiEVGKLnSbGAbRQgpxIrUTTTpOtUg\/IcKou5aTiXSRI6eJVtk+\n2a4M7q9V2\/afvbYIHrwm0ofooRkQPaTW12ESgFoGxQ9AajvPJFP9V7ti6S3dqVMavd8Chzw3XWaG\nQuSQUjQJ6m\/ZnUnuqn38N9kUgzV7yX48kdOrvO7ehorLUfQAA+CyO52Wrli4xhCxvur9DIZ7gENq\nL4nINX2TtDV19+xaXjTQaWQYQD6eOCBkREdrV60sMUgv0g5gANqP76LWb5Op5mjCO\/V1N2sTemdk\nGEQJ9RboNtOiK4NhUW8AR20CrufcHo5cw9e76VzJZxq1khI4vLDszmDZQIQgL0+n8mioPpXuC2BA\nATgkhBlwkBQ0RcupZKo6En9aKdybUMnpH4VcLDgz6Ol0HkM8n8nnaRFyZXJzIHKYuR\/WHeBqKuIX\nlML9uViq25gtIH9nOm34ChgCEXsionf1kp5rEJGTTYGz9VQiNZ9MQgTV1h1MwOuFomiwN4N+nT\/M\nEwFa98tcIV1rM9HdoWyGQ\/RkU6DuLomaazyRGFVed0JSImsjYuD3ZvJEiDUBoA6IGWti6wRA2RST\nzTGXgq69eDRerdd7s1js+WnmIA3UarkpMM7uDWfRy+sHBRxE2fpRU3hFBGuOxnNq647t8igX4z+C\nxTTeZODJwJonQF75C7ghJpqNDCcdCk7HD8ksJyK1EaV1BzF+u1jCYOhSgGCsvRCRQw1ipAFYijHO\nvuq9VFuRoL7uIMZvQsXvnk7ns8mU3Qkw1BsmRXg0+6O6m27Rcd0hterrLlQShqRgp0CUcAIQcJCX\nu4OZsYi+NwF+AYlRBrjainjFdbdUYn\/lL6SZNgPXFkDuCTgIs5wcAJV6B7npPLMHaYVTiShvCsAt\n9qZvzliAwLXErHsaCZOwqXeQm+H6FNY7ARc9X\/TpDmVwIZel\/Pcbh9m\/wXhK4UVjyJXx4XgOXwMM\ngGgUOcoqy3bmKoOrqkjQ3B6wRjGupBORyw6uAb0sIgqR5tVRpHbWoRcOZbecs05lcDd60nQzbaYo\nhBdiu\/Y+nQBBemMRM7JjwT38D35E19nPY2JckaCu7tbHc8rnu0yEjkUKJRBAZA3K5UdGFPf6hd6h\nKYQJULf0bPhtujsDGdwAD0b\/BZJQ3L0itbdFJKW88M7hgKRwU6hbejAlhOjyqoi6+xBOgsjJATh8\nR8rXRnKp7bvk2F6haukB3IbPFkWnYjLIh8uuRRplDUKQuZPRIFP55K7WMtyFckVLz+0rZg18HdwI\nil26Ymk2ZdfKlzsyooCbbDUxnLDtaurO50jRrA5msZQERGOIhZtt09qIlUHRIDGty6WgUzTD1Zi1\nQlPMdWdu7rPK6m6qJTX67JpNDPkcmutMY00L9pjYOkk\/J1M71Wrc9H7hcRt8HZ\/ny+LUmQC86fR1\nWCjgzOaHPvcW0UvfIY6eXLABONuZKSy8laP5eKqAGo6znIhlO86pdM6K3cGJbQzm09NsoME6Hc04\nLLQ+UUhBVzatew5SZL5M3DdyFB9N5NPlM\/vYfF4ojVPrUOQx35V+2udIC89eNvOyA1DsGR7hjPHd\nVZVC7hotrY7YqL82lSN3sVwT2bbVh99h2j7bYS4XgAsCOjpi1wvXbKaxRry2tdCYiDLePgFOqW3\/\nr8eSkB8AT7QYw\/5OcxSRbT6VpNY+\/Z8j0GXYMVpn2FK4fwCww+0RHGIVqwAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/board-1321576389.swf",
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
	"woodproduct",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("board.js LOADED");

// generated ok 2012-11-15 14:22:45 by martlume
