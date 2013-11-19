//#include include/takeable.js

var label = "Nylon Phool Party Pack Taster";
var version = "1353015815";
var name_single = "Nylon Phool Party Pack Taster";
var name_plural = "Nylon Phool Party Pack Taster";
var article = "a";
var description = "One temporary underwater pool-party spot. When activated, this ephemeral party place includes a complimentary DIY juice bar, smoothie-zone and Spicy Grog spot, replenishing nibbles and unlimited floatiness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["party_pack_taster_nylon_phool", "party_pack_nylon_phool", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "nylon"	// defined by party_pack
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
	out.push([2, "GOOD NEWS: Temporarily, parties do not require Party Permits."]);
	out.push([2, "The space created by this Party Pack lasts for 10 minutes."]);

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
		'position': {"x":-30,"y":-36,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALd0lEQVR42u2Y+XNT1xmG9Qd02maG\npMmkYQsJIUBNwuIFY3mVLMubZO2WZEmWZFsSXuUV27KQd1veFyyvYGwwXjDGBgyGy2Jw2MlCk0wy\nyTRtSAJhCSQ0aTvz9twDhmyd6Y\/tjM\/MO\/dc33N1nvt+3\/nuueZwFtpCW2gL7X+vBatUS8L0Sq7A\npORGmTTcqBQ9d\/DoGLd6Vxs3q9aVlu52OSSZyQ6Z3eKo2NnumL56xiHPT603luYzQ7OHmL6ZccbR\n3cIoi+yMonBeWYx0W2a9tCAjTZqfwRVvy1pCJxMbtPXNB4aYrTWlzHpBKLMhks94R4UzPrFCxk8c\nCanViOrOJiQV2qHOsiKzshjb290obqmGrXQbyjwNsLryUdxai+2eRuw9Pomynla4B7vROjaA9pF+\nDEyPo2diGOnVpeibGkNJaz1yaspQ1FiLloGdsFeWwVK0DZIkM5XNWQij3Y6kvFxwFr20lHl2yVJE\n6bWo7vWgoqMNFZ52VHbuQFVXBxxN9dBlpiM5PxcpBXmo6+lCfW83TOQHzNl2pBcXI9PhQGaJEwKZ\nHBEKJSIVKqhMSVAnp8CSk4OylnokpqbBlJ4Bc0YWUuzZvyp3WxtK6+poP9tZQo8EcAnz7OKlYCEj\n1Er48sOxOTwC\/gIhAoSR4EZGIzAqBiGxIoSKxAgTxYEvkSJcKkOEXEFholXxiFVroDIno6C0DIUV\nFahoaICjqgrxScnQpFhw9f338PYH1\/HOh+\/j1Pk5uNx1+AH\/xIHpI0\/gfnw+L05ikpLJzkuGXCOm\ngD5hfPjw+PDjC6gDx8+ewYm5WarW3h4KykLGxmvw9f07mD51AkK5ElFKFRRGEz6\/9QUVQ8Z\/8\/cH\nyHaUUDcvv\/cOvv3HQ9wi90wdn6FuDoyNUSgW7vrHH+Lew\/vILCz6KeCiP77E+AT6ISg8iAJuCgl7\nAhmtVuPLu7ewZ3w\/iisr8cnnn8FRXUUhc13bcfOb2xRSrE144ua5yxdw7spFiDQJeOvaZXT074Lc\nYITSaMaDH77DlevvQmfdCsPWVArJunnj9s1fdY8CPrtkCRMUHgiFRoRIrRIbgkOwMSQU3qE8CsoC\ndg7spiHvHhygTrJh7x3agwvvXMXJ8+eQ73LRkLM5OHvpPM4SxZCQD00cwM59eyHVG6BINOL+99\/i\n0rvXaGS0KVYKasvJxe1v7+HOd9\/8wj0KGBYZwrzqtRor31gDXwEPbwYGY33QI0jWzS\/v3sTM7Gma\nm3vGx2jI2dw8\/\/YVTB4\/ip3DezEydRA8iQQRMhnOXHwLf\/3qc5wlTt4hE7vbWiHR6yA1GGjIL5KH\nUpnNjyEtyCwqxsN\/fY+xQ1N0ASVn\/Qxw9QYvJt2eiHW+b8Ivgoc3uIF4kxtEIVk3WcCnuoXGTg91\nk+1\/de9rqk9ufEYA44iDUpy+MIcPPv2I6tjsSahI2YjTaQmgDneJS2yeqcwmAkhWeVISjp05SVOF\nhZlf6UmZ9qeAL76yjFEbpLCkJWCzkId1AYEEMohCsm6yYOxE9R3tdLX68vnkSTMoYEtvF1k43RQw\nr3Q7BHIJBTx9cQ7de\/rx2Zd\/gyhBA7FOQ1xMoI6ykAqTkYCbYCOliw373gP7kWC1Qm97mpvzbnKi\nJOGMWi+Bb7AP\/CN5+JN\/ALy2cB+DBlJA94426qZ3GI8CNpL6OEcWADc6EsGi6Ceh5kvFOHXhHAW0\nO4uoM87aSoh0asTpNbj94C6FlJsMUCYZcfjkDL64cxOmjHSoU5KhtVhIXtpobs67yXnptZeZZWtW\n4GWvlfCP4mPt5i1Y67+FgrKQX927BXd7KwXcFBoK33A+Zs6ewsTMEQoYFBuJmvZmvPfxB+DLxOgf\nHaKKUstx5tIcuoiTYl08kRp9w4PkQfZAZtRBmWyEwpxIQeOTzVSalBS0DvZg78w4dh8aoW5yRLKI\nu5l2I4QSHrZE87HGz\/8nkEdJjuQ4HdgQEoxNYSwgjzqYlJ0BbowQsWYtbNXFUKQlIVwuQrhCDKFK\ngki1DFEaOWISFCTMKuJiPJQ2IzKqS1DQWoO8JlLErWbyRkpFdVczDbndVYyOkV1w97Zj9NQUGvo6\nPuWsIM6pEkQQKSIQEMPH675+WO27GUJSEyO1KvDkcVgfHISNocHw5ocikheDOF4c0kIMSJWkQF+U\nhXBVHKxVxQTUgeTSfMgsBnK\/hADKEK2VEzglRHry+rMkwr23E3nNVRTS5iqAs7ka09dOwlpgR6Zz\nG7JcRQSwDc7GGpy8fo7hbAzYAK1Bgli5AAHEwVU+fjDkpMEzuRs1\/a2wkydeHxyIDQTQFqiD2z8T\nO32LqDx++cgOMUOeaoKlspBAFlE3Tc4cRGqkBFBKHJQjVqdArF4BS2EmDl48huEzk2gb34VUAqgm\nm5FCdykJtx4ZzgLkVToxNnsY+5gJjJ6eYjiLVy3Hq+tew\/qAN0gO8rDK2xfV\/S0IlpDCnaCEsSAd\nCWQXU64reAL2c3UEF6LIU4uRc5MYnZtCy2gPcV8CcbwMMTpWxEUCqE41YmR2kgBMYOjEKFRWA6Yu\nz0BtM5GFo0OaIw\/pjnxYiJvpxE19uo3hLFu9Al4+Xli9cQ38hGFYuckHVbtaUNBYjoLmcmx15aFM\nnvsf4Z4oqAR78hpxzD2M\/qQ6DJV4cKHnGM56DsEoT0C23YDyrjrsOz2B7W1VMOXaIDGqqRoHd5Bt\nWS\/KO+oopNykp5C7pkeuctb5rEN2rhk6o5S8SUJREpqGKdcArnWdwOmGA+gz1tL+rGuUglyon8KD\nG3fo+YmcAdr\/aPIKjli68cP9h3TsqK6JjmP\/\/sXlTzBeuhOV5RkYOT2OoVMH4GyrJPu\/DEhMagK6\nFVXdjcgsLUD3xG6kFudAn2FBQa0LUqOO4Ty\/fDFeX78GcQohWQTBsIQaMGRpBdu6bG40B+fh9oc3\n6PlgWBmFYGFYscAsANuf0D66pzw0FTqpmj4Ae42FtCsspBDHIy5RCk16IpqGPBRSYlTBmGNF3e42\n5JIF5iF5abZvRXI2ge5qIMVdQ0K8agWeX7YYLyxfQspIEHyF4cgWWuhkfbUeHHcN0Ynm3WEnZoFZ\n2B8DsmIbO8Ypy6BHdhx7vUhohdgog8gkg9gkR2JOCjLL8sjmNgZCJcl1lRgCSQwJcw+MxD2hVARz\nlg1d4\/0M55XVK+G9ZSNCBIGklARBRepZubaATtYpdOAvp\/5ModgJ2XDOh5k9Z\/vz4e3lOek9bN4d\n3OrBGZIe7JjJwj4cNO9AcpENjtYyONrKqXJJWWKVT6pEfg2pjbVO9E8P03DvGO2lq33y0gzDeeaF\nFxAZy0MwL4C8LQIQIhYgJ85Kn37eoZwYC1ID9U9AWegRkZteZ48N\/DyIuNFID9GjJ6cegxWd6K1s\nx2BlJ\/adPYhhVmSFjzwWu9JZjc0dotr\/1mGq8fNHcOD8NCYuHqXqmtjLcH7\/h+fx4vKliJUI4OXn\nTey3IEIcDa23GPp4HfJSsyGMFyPaXwiXj+UXq9cTRD6cEvJJ3eynMPvOEZ2deARG+4+0m5SVpuFe\nNBO1jLDqQ+voThQ3u+FoqUMJ0fa2BvJB1gBXeyOyylxQJJMy89vnnnOwkD7+m8j+j4vh81NU\/cwI\nana3UG1rcsFakoW8\/AJkJ2aiKWobdsVVoFnmQHlhKfbNPQYj6jq8Bw37upHrrkBGhZPU0CxEJySS\nt00CBEQR5KGFaj0p5AZEaRPJNSOpkyZSyM2s7sYlJjMSI6sURmq21tNPz98sWsQlkJ8uX7sWqvQ0\npJaXYHtXExqGu3+hCk8TVTZ5PxvJVx07Nj4tDVKy+QyKU90NkcQzodLHkqn3Ezl4CrUjXKF18OXa\nNIFSwxUo9VyBRs+NVBu8\/vuv8Wee+d3i11b3BsYpmKeS7w8UKxzz8o8WO4JESi6rLfQo91r4N8ZC\nW2gL7f+8\/RuwkWvX0E68ngAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_taster_nylon_phool-1334259305.swf",
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

log.info("party_pack_taster_nylon_phool.js LOADED");

// generated ok 2012-11-15 13:43:35 by martlume
