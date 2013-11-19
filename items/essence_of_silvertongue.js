//#include include/takeable.js

var label = "Essence of Silvertongue";
var version = "1352322770";
var name_single = "Essence of Silvertongue";
var name_plural = "Essences of Silvertongue";
var article = "an";
var description = "The concentrated charm of Silvertongue, giving large returns on upcoming ventures.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 283;
var input_for = [238,241,246,248,250,308,310,320];
var parent_classes = ["essence_of_silvertongue", "tincture_base", "takeable"];
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

verbs.imbibe = { // defined by essence_of_silvertongue
	"name"				: "imbibe",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drink to greatly increase the benefits of your next quest or achievement",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "You are too dead for that now."};
		}
		if (pc.buffs_has('gift_of_gab')) return {state: 'disabled', reason: 'You are already under the effects of '+this.name_single+'.'};

		return {state:'enabled'}
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity("You are suddenly possessed of the grandest grandiloquence, able to charm even the most cantankerous of curmudgeons, leaving friends flummoxed and the victims of your versiform vituperations verily vanquished. Also, you could probably wrangle some extra rewards from your next accomplishment.")
		pc.buffs_apply('gift_of_gab');
		this.apiDelete();
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Imbibing this will give you the Gift of Gab buff (20% bonus rewards on your next quest or achievement)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	if (pc && !pc.skills_has("tincturing_1")) out.push([2, "You need to learn <a href=\"\/skills\/132\/\" glitch=\"skill|tincturing_1\">Tincturing<\/a> to use a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	return out;
}

var tags = [
	"tincture",
	"tinctures_potions",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-39,"w":17,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHkklEQVR42sXXW1NaWRYH8HyDfARf\npmoeMjWZmZqump5+SNJdnXQ6nU7HGDOZScfc1cRb4iU3I0ZFUVBRo+IFUREvKCqiBhrheAMhKhgU\nEVQOIt6IikbTMUmn\/nM4NWXHqeqXmTq4q1ZtTvHyq7X32nvtAwf+x1HHCw6qzw4Ny7t\/Or+U9QMh\nyT5PNHwSwvSzRAM3lHXv2rHDB\/ZjyAouks25\/0BDTigd4qwQCNODd78r04JR8fQscu6dwNWzfz4S\ncGAdL4RoyDsPRcklSLJDUMs+h+qMYJQ9+R6itLPIf\/Atkm4cQeiJQ5Byzh8MOFCSe06UEvM1RJxg\nVFMhSD0NXsIJcONPIPX2MSSEfY74y5\/7s4d9WWIJ71xsbU4IqEwi\/uaXeBJ9nEZyE75BXtK34MR9\nTQMjL3zm2xdgzsOTRyS5IchKPImqzGBUsoMh5p5DScp3yL53HI8ijiEy9K\/47ujviYDj1CMjBxUd\nIlFV5g80yg\/1R012MJ4ln6KBSVf+TgOvXPySFGoHDgcUN+tZMNtto2BFHKX23HEUPT6Fsqffg333\nOL0H2dFf0ct75cyfkM7PgGzC6hNotYFB\/vTixZHVjQ1svt5Ai6QESeGnkHj1Czru\/vg33LnwGX48\n\/UfcvPQVHj2JgfKlCd1OEqUaghXADHp87z9+xLtffsHW+\/cYMPSjR0egu78H8t6f0KJVYmhhCYPz\nCxjzeqGw2VGi1QbuLFQajYcX19eJnQ8fsLGzg4WtbZAbm7Cvr2P81SpGlldoYJ\/bg16Xi6zR6c7s\nSyU7FxeJjbdvsbL9Bq7\/AC3eVxheWkb\/3Dz05BzK1OqDB\/ZreFa85g\/UUm+\/e4f511twrPvwkgIa\nFpdAuOdhWvZCoNbuT\/YG7PbDy2tr8AO3fgPon6WW8baAZrFLZwoaJ12i9Z9\/xuabN3jvL5TfAKpm\nSfS43FA7\/fvQcCYgxeGY9\/i2dj7AvrwFtX0burk3sHrfQr+wDZVzE3LHGsQmD9K6JhHXMoOU7hk8\nt3uo\/1wQ9g0we9SojUZW3eAshl2voSPfQDG2hM6JNcinttA8uY3qsdcoGFpHOvEK4aIRhNdYkNDm\nQIGGRFqHDUXUWcQ4ME1mRUqHE+W6ZdSbVqGY3IDEvIHyYR+yNAtIVS0iU7tIzW48VDgRL5tCbIMV\n\/yoaQa5SzzyQVzMNdqcHCeJZPOlwI5vCcPtWwCGWcaFwCFfrV\/Cgw4XkLhcFc+BWlRXXC8eRLHah\nQmtgHlhY7kbPoA+CFi9SC+eQKl5ArnYducQ6PfO0a+BqVsFWLCM2y4EHfBfiObO4mWgFr1nHbG+o\nMhjbxE0ujFtm0EO4wClyISZ1BjEZTsRkOhHFIRGVReIO9ft2+gwiWVS2C0worRymgXz5C6aBBqKw\nxIoNjwZL0wqMGdqhVXdApWzF8+5mdHY2oqtLih5VA6zGGkybGzFvk8Oo76eBBYoR5oHNzS93gU6L\nFFMjYlj0Qpj7BRghijHaVwrzQPkeoNuuwa0UB9JFAchgZ9deYEurDnUNOnTLW2mgQtaMJokcUkkH\nzINSGviKVOMSZxwsIcMZfGG1El1Kyx5gg9SAfIENucUTaJO2IjNnGGkZeqSk9ML0CfBGow+s6lEw\n2riO2R1El3piD1BPtCOv1AppWwsU3UJk8\/qRmjaA2kr57hL7gREFbqriTcz2hX6gbWJ0D1BHARul\nKjjJaDr6+jmor5bt2YN+YJrEiVSJOQBA66\/AqjoznT1ekQW19W2QK8pRWiYDN+s5BpSSPUAedS+n\n1jMM7DdZfZ8CzUMdKKkYRQ5\/DJWVasQ8vkLtvT48vK\/G4wTFfwFnkd5sZRbYrrWCnB6mgSaDAHxB\nKPrU3N1jJplzFK31EogrmiAub8KgNn8PkC2zoaSHCGPumBmcwc6qfjeDnMLTuJb0O7DzT8Kg4SOd\ndwLEcw4y8r5B5ONDVPxhF9hKWMFusTH7ulMNTsO3OLSnSB5kfkEjIx4dQizrL\/Ts\/\/aHTJb0K1A7\ngYzmSYaB\/dNo6JjDsmtoz03S2BiLJ9nH6CX2h6AyDIQqm96D0+OdUBCjiCsmwZUxnMFJqnUXSJZQ\nULeCNu08eg0vMahXo7dPDpVahueqZijVLVD2tEKq7ENB6wTihW5EFlK9ocCNdt0ss0UyMjnVNunY\nRq9xE+UyL\/KbvEgWkYipmEFStReJta+QUOPFPdEK4iqXEF22iNuF84jgUtmrmUfToAXPNJog5pbY\naAyz2DbRq\/NB3rMGjngFF\/lDmF79iKjiOdwtW0IcFTGCRVzLteJK\/hTCOTMIT5sGr8qFWr2RZPQu\n1phMQXqzGwTVsLZ3U5lKn8Ullh6Xc8cRxaV6wjw3ovPmcJ0\/gxD+KISmD7hc6sStRzbk1U+jTNOb\nz\/jLzkq6zDVNiygVzSOTTyL6kQPRVGMa\/XQWURT4DhWR\/AWcYWtxSejEPzPHqF5wEgLlS1RqdEGM\nA\/3vYoPFQxRXu1AvW4ag2kOdg9TjKNWB2w+mEHnfRseNZCvCkoZxPXEcbKE1MO\/iT4fJ6QxS9C2w\nlANeUbGY9BVVz4FbQSL92Qwi7k8S4YlTPSkFdlZmlen\/qtp\/Ax6PFsLWIL7kAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/essence_of_silvertongue-1334274116.swf",
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
	"tincture",
	"tinctures_potions",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "imbibe"
};

log.info("essence_of_silvertongue.js LOADED");

// generated ok 2012-11-07 13:12:50 by martlume
