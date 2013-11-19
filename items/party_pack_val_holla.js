//#include include/takeable.js

var label = "Val Holla Party Pack";
var version = "1353015771";
var name_single = "Val Holla Party Pack";
var name_plural = "Val Holla Party Packs";
var article = "a";
var description = "Soar to new heights in this quoin-heavy party space. Grab a bunch of your closest friends, and get ready to Party Shardy!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["party_pack_val_holla", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "val_holla"	// defined by party_pack (overridden by party_pack_val_holla)
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

verbs.activate = { // defined by party_pack
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Start party. GOOD NEWS: permit requirements temporarily lifted for parties",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.party_has_space()) return {state:'disabled', reason: "Your party already has a Party Space going."};

		if (!this.instructions_read) return {state:'enabled'};

		if (!pc.party_is_in()) return {state:'disabled', reason: "You must be in a party to activate. Didn't you read the instructions?"};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!this.instructions_read){
			var can_activate = !pc.party_has_space() && pc.party_is_in();
			pc.prompts_add({
				title			: 'PARTY SPACE ASSEMBLY INSTRUCTIONS',
				txt			: "1. Assemble the desired group of party attendees by clicking on Glitches in person or in chat, and selecting \"Invite to Party\" to invite.\n\n2. Continue until your party has reached Maximum Fun Capacity Level. While waiting for party pack activation, the party chat channel can be used for smalltalk and metaphorical icebreaking. \n\n3. Once Party Participants are assembled, activate party pack. Do this by clicking 'Activate' on party pack. \n\n4. Every guest in party chat will be sent an offer to create a teleportation portal that will take them directly your private party space, regardless of their current location. Party Participants have a limited time to join, so ensure everyone is ready to party. \n\n5. PARTY HARD. \n\n<font size=\"10\">SMALL PRINT: \n* A single-activation party pack gives a party of limited duration. To extend party length, insert currants into the machine inside your private party space. CORRECT CURRANTS ONLY. NO CHANGE GIVEN. Parties limited to "+config.max_party_size+" participants.\n* Please note, due to physical funness capacity, individuals can only participate in one party at a time.\n* The giants and their representatives are not responsible for the level of fun experienced at parties. No refunds for bad parties.</font>",
				max_w: 550,
				is_modal		: true,
				icon_buttons	: false,
				choices		: [
					{ value : 'ok', label : (can_activate ? 'Activate' : 'Understood') },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_modal_callback',
				itemstack_tsid		: this.tsid
			});
		}
		else{
			log.info("Activating party pack for "+pc);
			var ret = this.activate(pc);
			if (!ret.ok){
				failed = 1;
				self_msgs.push(ret.error);
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);


		return failed ? false : true;
	}
};

function activate(pc){ // defined by party_pack
	var template = this.getClassProp('party_id');
	if (!template) template = choose_one(array_keys(config.party_spaces));

	if (!config.party_spaces[template]){
		return {ok:0, error:'Bad template'};
	}

	var duration = 60*60;
	if (this.class_tsid.substring(0,18) == 'party_pack_taster_') duration = 10*60;

	var ret = pc.party_start_space(template, duration);
	if (ret.ok){
		this.apiDelete();
	}

	return ret;
}

function modal_callback(pc, value, details){ // defined by party_pack
	log.info("Party pack modal call back for "+pc);

	this.instructions_read = true;

	if (value == 'ok' && pc.party_is_in() && !pc.party_has_space()){
		var ret = this.activate(pc);
	}
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"party",
	"pack",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-35,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKGElEQVR42u2YaVNb1x2H8038Efq+\nbep02rRO0mayNGk9dmxjFmMDFogdg4UxmM0EC5BAbAIJrUhICEmAFq5AC5LQggRiX4wNjlfAeMvS\nmV\/PPUIEkzTty3aGM\/PMFdKZe577+59z7r28885xO27H7bj9b7bkFtOJVKH5ZGo7i+Utmk1eTsPg\nJC9NNEoR26d4Q74IL0VobEwRGJh6rYNpNU8wpX0jTHKzhqBOoLvY3M9LalKfTG7RnjgY7P2s6sZP\nr\/GZ07V9hzvvo0WLcRwLGyvotnpRr59AcZ8dArMXnrlFCEem0GDwoVJL\/p5fhnFqjh57mWkYpuYh\nHA1B5Yqg1+JCRZ8ZuZ0G1GmsuNw2BJF1iuBHqdQEbrcZOd0m3BhwH3BT7wEVfDe1ijmZXI7fpFbh\nTJ0cyXzVIdQ43yDHhTsaJDfpcEVkQobIjEuCQaQJDMhoHwW3x4Z86RgKCFyxBcVyB0oUE7hGKFNP\noNYUhnBiBSLXKto9a+j03kW370fEhDbHPAT2CHr8629BBd9Lr2V+l3YLv714A0l1CuQqQshThVFA\nKOwPo7h\/GsWaaXA6rMhm6bKiVBPADUMUFUMzyCZpcIR6VJtnUTsSQ6F4BHmteuS36ZHNV6JmcArV\n6jEItcNo042gWalHWasSpnE7bqtt6HAtQ6DQwRvxoESo+qmgyW1hQgtO1ElkSKpXgEsEc5Uh5BPB\nfFUIBeoQUhq1qBS2wR0YhSdoQVe\/HFwiWqYNoL6zC4x3FDkiI5WUGbR4+WoOoZgTr98sorpHC77K\ngG+\/W8Z336\/i+x\/WkHGzFaE5Mi3CbiKlxtOdRZgniLDe9VPBP3D4jMQ8hBsdUly8rUKOPASuMi6Z\nR0VDyOywY2BUi3BsDNeb2rD10I+MmnZktZnhDdvwfC+K6+1KVBlncLaEjxcvY\/iquBF62xCsbitN\ns06spJLpN9vQYAqitE2FvVfLCM\/78PLNGsoEMlLu9Tj+OFTwj9kCRjpiQqt2AMkNamTLgsgmKcaT\nDBLJIJVsU\/TC6R\/GuVsSuEiSHSopzleKsfs8QhNVmbS4PjCFr0pbsPdiFhVtvTTNwOw4eMoJNCr0\nePPtEq6LlGh2LKLJPoeGHiV++Oc6rB4G9QMuOh8PQwVvK\/VMSo0YSZXtOFvbDw4R5MiPSKqCEMrE\nWFgZR5u8B4urTjSKu1DS3E3TnJ5jCA5kkcWTUiMhgjNUkk1SqOrHLeM0bssGaMlruuXgMwtU8mtp\nPy05r7UPHZNr6PKuUzFDZJUS39PqZUx4yYPkqk6crdMgqy+Iq\/uSOSyKICl5EIK+btzfmsSE3wyp\nXoEvS4QQKSVYXHPRucmKchp6cPFWDy25oE+C1Q0vUqvFqBmeQZ1Ug1ev51He3IFG+zzKpFZE5j1g\nfGOoUNjRRhaLyL1CRaPLUcTWZuKCHxT1MPoJG1yRcXxVryWCISIYOpDMlgeQ3GyCQNqNcZ8JZ2\/J\ncIWs5rSmQVJyM5lbEpyt6ILOMoCmXjE+49bRsv\/1UhkV5QnEuGWOoqa3nybaoVbitiWGmi45Lfm1\nFilJcwGC8SW0OomkawWBhWn45qNxwU7TKGOZcoBzR4qMpn5IbE6yEbuRlZCUBXCxyYgWaRcVTG0x\nk3kZwN\/LRNjeCaJAqEBRfxDV7Z10EaWV1hDBaXyYeg0G2yBNskQ2jrymPkh0avBaOnGj340iInaz\nS4UqnRf8sQU0kbJLPXNgZmPwxUKYjIXjgpfuaJgPirrxPleIXIEKg45hio7sU6wkm2KK0ILU0iqU\nNvKRQtLMJYJfFDbgSnkNUvh6sl8GcaFWhk+49bhQLUFStRRXmnXIkzDkLmEBb4DcMdRuFErs4Gk8\npORRsmfOoH50FretMXxNFswdIqnzR+CZmYIzGoB7JhQXlNrsO9PLk2hU63G1WQXN2DC0zDDEo3Zk\nyuLz8SpJ8QLfSEVzFIH9eRkgiydAVniA7JVBIhkgG3qQUqINoXQghDJdCDx9GOWDYdwg3CSLpdIY\nQZUpQsoeQS2Zm\/UNRajtIFsPEe1xRjEe9hH8VJIKZgp0kNutqJJoiaAaGiLHSvZZ7cggCyaTXTTt\nRlzNS0ZuaRadkyysKJtk7r5k\/r5kESuqJaKyMZS1CFB8h08leYNxUVaSpcoUBV9rRF1lOsqKkuCJ\n+uEI+cCEvHDsS1LBOvUIBt1jkFlGwGEFiRwraZu0oGFoEhmkzNxrWeBc\/hCZBZeRr\/AjX+knklPI\nIYJskrmJNNUBKslS0qFEWeFp5Gd\/gRK5naQZ\/DFNQ1yUrxlEFS8FRXnnYJtyEtywBzwYC0xiemku\nLvhxuQp\/K5fiTIUYRZ1DsARcZP5ZMMCw83AMzWTB5GZ9hKz0U7h08RSc7kEYnTa0DrvjkoqpA8nc\nfckCAptcce6XuHr5E3qXah71ofSwJEFl1pL0zqEg5wxGvROw+Jyw+l1U1B3ZL3FSgwbnamRIretF\nqXgIM\/dXqKSWGaGSsoFO5GbGBc+fPonmbj60JGWpxYpa8kjEUfwoyd2XzCtOR0bqX1CY8znSkz\/C\nzfLLcE\/Z4AnY4Q8zEI9NQuuahHJIjpL8M8jjnIbObjyQtPidWN+6HxesVZqx+TgIV3QC9eTz7OYq\nlXSRpc6WmhXlZnyAzLQ\/oba+CP0mNQYco1R+2DkMvtFNE5N7omgcCVPJIu7nSEs6hZK8L0jqHyKf\nexYiSQsME1YMjlvJ5myDyWVDr6oddxpLIFWK4J+fRnhlDrPk2XNlc4NsVbtxwY9KpThV0AkOvw+t\nAwyekR\/mHqwfiA77JsiAnyGwGEF0Y5kSWI7BuxDBsHccOocF9ukgptcXMb02D53HS5L7FJnpn4Cx\nGfBs+xk2Hm5h8f46xknZQqvztK9\/cQY2t4UKxe6tInY\/zvzmGh4+e4IXL17EBXNbNfhzfjs+LhSi\nQz+ON2\/eYOXhJma31g4kHQEH7j3+hrKwuY7I3aUDfItRclx86zuVvAWrK4vY2dk54NHTJ4gRmSj5\nnWWGvVhyZAVZHj97Snn49DH29vYoVJArUKPdYIRIP4gOnYMK7r7YQ2yLTXENK4828XD7KV6+fEmv\n6unONu49eoA5crVsmlRqY4lKrjy4h6Wtu2+JHeabJ49o\/+ghWNFtcs7d3V3K8+fPKQeCbHrsfbii\nW4F2UmJWkGV77zkebD\/BDjm+fv0ar169opIJ0V1ykgPBfdirTwyU4Kjk\/UffYGnzLla2NijsFEj0\nOyoZf2kit7h\/XBdBYjYQwbEDwaMkJBOirCRLojSbpPyJE\/+SIMsT0v\/nvj96cfEn6qv88+9lfL2T\nUdsOkcb2bwUTkj+XJgtbkoTgUclfkj3CDunHbG9vM+zx4NXz95dqfvVuSuWOqN\/6i4L\/KU0itk5g\nWNgBCDrymZeAjM8hnDzEr\/7rl\/FfJ1ee6DEwOjI4k4DIiAm8Q5wnnDzEieN\/Yxy343bc\/o\/bvwBJ\nO7k0yINaAAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/party_pack_val_holla-1348171037.swf",
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
	"party",
	"pack",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("party_pack_val_holla.js LOADED");

// generated ok 2012-11-15 13:42:51 by martlume
