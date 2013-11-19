//#include include/takeable.js

var label = "Greeter Twig";
var version = "1346866574";
var name_single = "Greeter Twig";
var name_plural = "Greeter Twigs";
var article = "a";
var description = "This twig vibrates in the frequency of Greeters, the helpful humans inhabiting the world of Glitch.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["greeter_twig", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.remove = { // defined by greeter_twig
	"name"				: "remove",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "I have no more need of this thing!",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		pc.prompts_add({
			title			: 'Please Confirm!',
			txt			: "Are you sure you want to remove the Greeter Twig? You won't be able to get it back...",
			is_modal		: true,
			icon_buttons	: true,
			choices		: [
				{ value : 'remove', label : 'Yes, I\'m sure' },
				{ value : 'no-remove', label : 'No, I\'d like to keep it' }
			],
			callback	: 'prompts_itemstack_modal_callback',
			itemstack_tsid		: this.tsid
		});

		return true;
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
	"sort_on"			: 51,
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
	"sort_on"			: 52,
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
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.check_availability = { // defined by greeter_twig
	"name"				: "check availability",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Is a Greeter available?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.countGreeters()) return {state:'disabled', reason: "There is already a Greeter here."};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.setAndBroadcastState('searching');
		pc.sendActivity("Ok, we're looking to see if anyone is available...", pc, false, true);

		var to_summon = pc.location.getUnsummonedGreeters();
		if (!to_summon || to_summon.length < 3){
			pc.prompts_add({
				title			: 'Check Availability',
				txt			: "Oops! Really sorry about this but it looks like all the Greeters are occupied right now. Please feel free to try again later.",
				is_modal		: true,
				icon_buttons	: false,
				choices		: [
					{ value : 'ok', label : 'OK' },
				]
			});

			this.setAndBroadcastState('iconic');
		}
		else{
			pc.prompts_add({
				title			: 'Check Availability',
				txt			: "A Greeter is a real life human who can come and introduce you to the game. Would you like to summon one?",
				is_modal		: true,
				icon_buttons	: true,
				choices		: [
					{ value : 'ok', label : 'Yes' },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_modal_callback',
				itemstack_tsid		: this.tsid
			});

			this.setAndBroadcastState('available');
		}

		return true;
	}
};

function modal_callback(pc, value, details){ // defined by greeter_twig
	this.setAndBroadcastState('iconic');
	if (value == 'remove'){
		this.apiDelete();
	}
	else if (value == 'no-remove' || value == 'ignore'){
		// do nothing
	}
	else if (value == 'ok'){
		pc.location.summonGreeters(pc);
		
		pc.prompts_add({
			title			: 'Check Availability',
			txt			: "Fantastic! I have summoned a Greeter for you, who should be along shortly.",
			is_modal		: true,
			icon_buttons	: false,
			choices		: [
				{ value : 'ok', label : 'Thanks!' },
			]
		});

		this.apiDelete();
	}
	else if (value == 'cancel'){
		pc.prompts_add({
			title			: 'Check Availability',
			txt			: "Very well. If you change your mind, please use me again.",
			is_modal		: true,
			icon_buttons	: false,
			choices		: [
				{ value : 'ignore', label : 'Will do!' },
			]
		});
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by greeter_twig
	if (newContainer && !this.isSoulbound()){
		var root = this.getRootContainer();
		if (root && root.is_player) this.setSoulbound(root);
	}
}

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
		'position': {"x":-25,"y":-31,"w":47,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFb0lEQVR42s2Y61JTZxSGvQOoOkqC\nErENoHKQMzntvRNCIyTkxEkgkBMhJIIBQgxaMIJWrdbJ6LSd6bQdLqA\/6P\/+yCXkEnIJuYTV9X4B\nh3bGgm2Azcw3ezPDTJ6s733ftRYXLhz52Y5Z5CcRcy7m65R3klbPBTX9JMd7POk5A+0sKbQ81UuP\nwqbgbkLJqwYwONqxvzzVR6mZAcqGTbQ6219+uijT86SSUwXgqNxEAWe7ODPDbfRwup82w2baTSrl\n14v2GlVAusxNHX7brbx\/8BbNjlQgH4VM9CRqTqlKj16lZW\/6XiutBQy0NN5DE0O3i6qBmxhqkeec\n7XsxXxc9jphFBWP+LoKzVQM5br\/tcctNxYjnLuXiMmWCJsqGTKXsRHeNaiDt3TdrnJK+iArCLNsx\niTh29lWlxRFjo46ryXEjcfSYRTWfJ5TCiwc2nWog4expR2s5EzQKPUKXOwmlrKpO45SagpNDt2md\nXQ1nJyZ6RDVV02lw1S6pEuTIxvhYNy2ys7+JWhDk6oggl0VfQIADDtmIZ9h9lzbmjZQOGFKqcTUg\no95OQpADkk1E36Ud9MsLX+GPH+byf\/68WHOukHzVOZekL3uUZppy3KHthJW2klb6Keeh316O0e\/v\nZ0q\/PvcFz93ZgIQuc8uD9Diu0Abr8cecmzL8TIfNBVXEzyTHzzxfd5ZDfIsrmWADLbB52ECl9YC5\n49whhy1fySEGirAW1znIw9wa4XIYB+2Rs3N\/J24537x021pojsHG2CwwDXISeYkBA8+Dca30NC7l\nM3OGsx84hqXmFAc5QY8ARPUQQ\/OudvF7crL3Y1UPevrZdiERP3JzwWdtETAIb14fCJGEA3BEEaIJ\n6wSuHoMH9\/T9M5vUET2IHOw0WLqi\/k7dUTM5Lfo9fIGIp1Nc+8r9PtHTuVWWeOdJnQkggnt1dkDs\nMJ9yfWXG7BRXjmpDn\/hCAjShBHcSVhmn+r3a8qUHHSbDOsOH\/ZscDiGh08OdR4xxHPaAxfPbZTu9\n3\/RWb5sc5bgBIE\/d4gOOGzx4gyzDRNAmpnbs49DlMwbdWrBQJizTu6yvUFVAXqyEQUQljrkmoUs2\nEHQJE83ymlupKGs4MUi7D530NuPdq6IG9akQTzaIEQCeRPjC\/RZ9HoAARUUR9OmQQq\/W3ZSNWI\/v\nRK3SxVy7cinYPfFFzXEmwRB7BDD3OdWHyw\/jaCPMGlx1nex6W6XLud6RqzTg1pDRpy0avJqUwVcn\n2xf\/DjztaMvj2z860CAc+V+SID45ALgy6+9kfbypr7aja+gKWSbq+WjJPK4l68w1ss5eI3uwoTgU\nvia0xhFTgAbRLZ79j1XgTcYnv93wfV6XuWW4mO9z1ZEyDajrAhDvQ6EGGl7UCcdmQ+Z9GARdYrOy\n\/Z3tGtDnvFpE1Wxz1wUUjivRSI6ojgLxpg6GKqF6h60MG+CZrKa2GY2OwYq2QKVygwyId1ug8j4S\nv0GhYHvxcDhAd9jiPMOQ8CRqOd0l3zql9ZjHtGVUDkeaqheQX0cayLl0g+7FuIrJRnLHbmIgyB32\nWhgFkQPY9Iyx+lU0+jU605h2r3+0jkx+LfE7SZP1JN+vF7pzJhhuQSeefIqu5caOyu6sLyJwAbkd\nH6Sor5ter41Wd\/RvGagNtsmXqdtxhWNFI8CUA9fiah3RijEAyJUsj0Q1HyuE0MXe\/GCa9Zdy0eaC\njV6vu8tVr+Ady6W9PmediBUACs0daA8uRhX5WbD\/I7wRuGNiBXULwJdro+gIp\/OfB+Rfq3Sp1HMP\nIV1HRq9GHM7BEkN\/MoRXZs2FVwy2uzICyPL3af\/pOhmgLYZaGQfvx\/39B+4A3OTLbza8pXfrvqps\ndX8BMJ0P4hxEmHAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/greeter_twig-1344538483.swf",
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
	"c"	: "check_availability",
	"g"	: "give",
	"e"	: "remove"
};

log.info("greeter_twig.js LOADED");

// generated ok 2012-09-05 10:36:14 by mygrant
