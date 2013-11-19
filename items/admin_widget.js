//#include include/takeable.js

var label = "Admin Widget";
var version = "1344618840";
var name_single = "Admin Widget";
var name_plural = "Admin Widgets";
var article = "an";
var description = "For admins only!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["admin_widget", "takeable"];
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

verbs.upgrade = { // defined by admin_widget
	"name"				: "upgrade",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Upgrade\/downgrade street",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var choices = pc.location.upgrades_get_details();
		if (!num_keys(choices)) return {state:null};

		if (!pc.is_god) return {state:'disabled', reason: "This verb does not exist."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.familiar_upgrade();
	}
};

verbs.teleport = { // defined by admin_widget
	"name"				: "teleport",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Only a few spots",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.is_god) return {state:'disabled', reason: "This verb does not exist."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var choices;
		if (config.is_prod) {
		    choices = {
		        1: {value: 'tele_tsid_LHVDIELDQQ7228K', txt: 'Plexus'},
		        2: {value: 'tele_tsid_LM4107R9OLUTA',   txt: 'Hell One'},
		        3: {value: 'tele_tsid_LLI32G3NUTD100I', txt: 'Gregarious Grange'},
		        4: {value: 'tele_tsid_LA918AIN63127HB', txt: 'Dobak Fathom'},
		        5: {value: 'tele_tsid_LHV1U3M48M22D54', txt: 'Eastern Approach Subway'},
		    };
		} else {
		    choices = {
		        1: {value: 'tele_tsid_L001',            txt: 'Main st'},
		        2: {value: 'tele_tsid_LM411V6VFUKC4',   txt: 'Obaix Main Street'},
		        3: {value: 'tele_tsid_LM41266VJ6QR5',   txt: 'Joseon Main Street'},
		        4: {value: 'tele_tsid_LM411L6REPK42',   txt: 'rock islands in the clouds'},
		        5: {value: 'tele_tsid_LHH1CH6156C19OI', txt: 'Cave of Improbable Reward'},
		        6: {value: 'tele_tsid_LHH1167V99G17N9', txt: 'GlubGlubbia'},
		        7: {value: 'tele_tsid_LHH106Q45C91J7I', txt: 'Limbo 2 - The Limboing'},
		    };
		}

		var extra = pc.teleportation_get_history();
		for (var i=0; i<extra.length; i++){
		    var tsid = extra[i];
		    var loc = apiFindObject(tsid);
		    choices[tsid] = {value: 'tele_tsid_'+tsid, txt: '@' + loc.label};
		}

		pc.apiSendMsgAsIs({
		    type: 'conversation',
		    itemstack_tsid: this.id,
		    txt: "Where would you like to go? (@locs are from your history)",
		    choices: choices,
		});

		return true;
	}
};

function endConversation(pc, msg){ // defined by admin_widget
	pc.apiSendMsgAsIs({
		type: 'conversation_choice',
		msg_id: msg.msg_id,
		success: true,
		itemstack_tsid: this.tsid
	});
}

function onConversation(pc, msg){ // defined by admin_widget
	if (msg.choice.substr(0,10) == 'tele_tsid_'){
		var tsid = msg.choice.substr(10);
		pc.sendActivity('Teleporting you to '+tsid+' ...');
		pc.teleportToLocation(tsid, 0, -100);
	}

	this.endConversation(pc, msg);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-50,"y":-96,"w":100,"h":96},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAL1klEQVR42uWYeVAUZxrGG0VArhkQ\nOeQUFAVFARXNmjUqUYNR40XWY9WoMR6bRGMSo1FDjGvUeJa3XFFBQFBUBEFUEA8UUTwABbkE5HC4\nZpijp7un+9mX1P6zVZvsrliJVTtVb30zU193\/\/p5n\/f9vm6G+X\/6qMrmTGhj54+hr0ZvHpzKxVbV\nsvayUhd2f99FW5c3Cg6kGGuYtlDHrlSp9cu1t24NWY1QpuubA9js4qzVhV7kuC8kXftCqax4yI3j\nPzLebwRcWBjTRdU4cbZON6\/NwG+AqJoPRbWvLu+c6zIkvgEqqoom2KqVISm8diEM3DpAMwmahv64\nf73n9ZgMc6c\/HPB5Qd8ZrHqaWtDNhWRYB0GYCk4diPIiV33aCZtlf6z3qhiz1pYRDw36+eA1ayGI\nX4MXPoKBfRetdf1x5bxfTWIkY\/vHwIExgu6vK3n1UPDqxWC5QxCkL2AQVkHiPoS21R9Fj50RdYLZ\n2uHT3x1QX+vSR2h5r0RsmUHeWwqN4UcYxPUQxW8IciY47UiUV5ojM8u6OnInE\/D7qnf0aDd1w4gw\niQ1iRfUcAvoKHP4Oid9NgF+TklMhcGPQ1NgLRY+cuLMnHHbl7g7t\/rsBtpWFBAjshPt67ViJE+eR\n97ZD5PZDYg8Q4BoCnE\/FEgyDOgCNzwZLd6\/5PD2fNnTka1wZwrogmzHGPca8+jFjU1nv465om+rf\nqg+bpNFHruM1s66xmhkGnl8GFushGAhOd5gAdxEgFYthJQxSMHkxCGLTBNRUDBDzyx1zy+vf2lhd\nFzDl+fOQgPpb092rUxmbuhTGHGF0LeZXfFq2L8S0rW2q\/LkyqHdJ\/ZShpbVjQ17WfjCvvXL6Gryc\ncqC9YXiasmVokUo5plmtniFo1QuhZ1dAz\/0ATtgHvbgJvOF7iIYtNBKgtAYwfEaqjiUVx5KyvmBV\nA9Gi9kUrtZ+m5uFCc8M7zU01o4oV5b7pyoYhB1ufBa+pzwuZX5s\/dGJN0Z+GNZa+7amsnmMTNjrM\nmKlSvPeFjp95SsNPvabllhay\/IJaDbdEyapX84J6tcRpSCXNR+Qpah\/8YvLbCkjCRiqILRRR0AvR\n4PkIAtxOv7\/\/xYOSuJzm\/Y364RrqjSEQ9WMIPpjibQIfTjfmDz0\/CDq9D9RCoKTWjuK1muFKVjvs\nBauaWNjeNDGntG580pUnAxczD2oHLGnQDm0TeH8JqrchKuegA8rALaOUfQ1RF0Yq7KZ07f8lwO+l\nYthOED+iXRWJz1cMQ0zUInDsVkrrSvp\/NcUnuJa+AJ\/M7ovqihl03HQ6Ryh4dgqNBMyNg8i\/S2Mw\n9PqJlJFAcO1+0DYGQFHhheoSG1zN9dbG5vRcxCiKRlvWPgte2dYQ2Gxo6y9J6rcg6Sk1hvcpZtPJ\nVwLcFoo9FHsBYQ8pSTDCdsTHzsPOzZ9i+3ezUVG2mtK7nOA+hU63ADs2vY+E8D34aUtfSNIsQAym\n1I+l48cApCiomYvacTDoRoJVuqG9ZgAaiwNQmu8o5aZ6qdLPu27IzmbMfvHhnX2M9ZO8oG+qKj2b\nNe1uMGgGUEqH0KowGqJAChjowjyljjYDkvAdeG4NxVas\/XIYHt5Ow8GfPkHhwyUEsgKc\/iMoFPOx\na8s01JQ9wML5LpTWGaT8OIIbTeNIutERlJ0gcMrBpJozXpbLUXrPCjevGiHlnIUyKdprc+Ji339d\ngUpu2llduuLw+eNCd1VroxlY1p4KwBucNJh63ChqHZPpQnPJZ4sIbin5bgs+XzYYR\/dswPrV41Bc\nuBiQVlGq50DRtBDrvgpCdGQYpn3gDp04kcCGUwyh7PhD0PpB0+INRY0r6u47oDirJ65dMMapk3Jd\ndPjgDZG\/tjzSkmRy9bH7wmtFfVWVDd0hKPpDavOApB1AnpxE7WMyGf5jsOI4cOICLF\/SB4MH2uP9\nECeUPptFHpxFc\/+CpqbpmDPXDh6+5pgeak1z\/0xw\/rTT8YPU6g11TT80PPFFyV0PFFx1RPo5M8TG\nOOrOJvms2kdd5Td7YGIRY3L2jtuq23lOLS9KTCV9jSWd1Jd8N4RUHELeGw0tBScswadLA2FhJEfw\nO\/aorJoKCSEw6EejpXkSZk7xhBG1uA9nOFNLGgZB4wN9Uz+oqt1RX+SMwlv2uJ5ujtQkIykh2kl1\n8qj7xp\/D\/um5\/\/S5fI+R3Ur1Wf84v1dr7TNjaJrldBFLSrE39bYA+h4MjtK86dsgWDP2mDzBFnV1\nY6hIRtKNkK\/UE\/DxbH90N3LAZ4u8yM+BYFs9oH7Rh5RzI+VscD2zK86dZhB33KL95AGPbcnrrHr8\nT6tJdhgjz0nxXpuX66qtrTWCtt2CtlE+VDCkBlWhgZ+M\/LwxCPLrgi1hbmC1o6ighlHlk8f4dxAT\nPgiBfYyRcSYIujYfKF84oaXCA1UFrriTbY4LZ7vh+HFLLjHKZWvcTsbulZa8souMaVa68+onj731\nytreMLT3IwhqG\/qR1McIRBiO+oZQ6ofTyJtB9D8B0n8GcQi02hFoeD4B+rbhUNd5o6XSGXXFjijK\ntUNGigniYh34Q3stN+fmunRuE9H4yMHiRbFXeHtNbyqYvpQuV+phAdTL\/KhoaCUw9KUVoeM3VSjr\nTxXuD53gDVZvA73CC3yzLTTV\/dBU4obnD2yQf80CKWcsEHW0e+K2bYzsNWxMQ0xVCt+tujY72p24\nUxH4UQwixfypJwZSryRl9QOA9oEQ1dSWNH3Aqj1oh+0Ag6IfdHU9oKr0QuMTD1QUyJGfRYCnrRBz\n0PbIjq8Yi84DNi2y0msCjrNsD6pcB1KQdtACwQjUMriBgM4XIGWlZk9wTS5gXzpB1+gCbb0bNC88\noKxyR1O5K6qpOMruk4JX5EhPtkLCPpfUQ2tlNq9BwWk9BD4wh9c7Elw\/ajM+FH1pHaVg+0Bs7wBz\nBdvgjLbqXmiucqToGJ3RXOkKRbkbGkqdUVnYC2X37AhQhoyzlojZ7\/J47xZ7h04DarU+ThzrUyFy\nHuQ98hlPXuTcwWtdoW1xQWu9PV5WUJsplaPikR3KHtqhnMbKQntSzRE1T53wnIqj7JEDnuXZoyBL\njqupcsQccmw5sFPu3vnn3qb+3mq1t1oitUC7DknnQar1hk7hgpdVPVFZZIMn9+V4eEeGBzftcD9H\nTs\/EMhTckKEwT44n92xQUtADpQU9UXLHiQBluJpmi\/ifZcKxs92COg3ICm7BrGaACCoAUeMJvrUP\ndOStl09JkXxbqkoZrmfIcPmCNTKTLXHptBmyUsyRc9EMNzNNcDvLBPeudyd4czzK6Yl7V62RfdEW\nyYnm2B3JzOk0oMEwYrlAqRWVfcG2yaGs9qQF3g5F2Ra4nWaOy8kWSI41R2yUKU6GG0nxkYx0JsYI\nFxIZZJ5nSC0G2ekMbmQwuJNujbuXCT6DeuFFC2zaI\/+h04DqhvFHOpaqdqUnFPXdUF5kjqeZlrhN\nlZgWS9V4zFyMiOimPRJt\/CQuwXdTXJLxmqhom0fHo7ppko51EdPjZMhO6IEbZyyRfU6GrEsypGUx\nOHPFGnvDTVM6Dahp9svl1G5opKosu2uLvEwnXEnuiuQYYzHqqJk6MsLyVsQB528Tdtl5dzygdzzQ\nZ8czHsePWK2OP2aVfSzCVJUU011MPWWEDFI0I4XBpTQTXE51R9xhz\/KO+Z15e2CqbHRtbquWoyTf\nGnmpdkiJM5Uioky1B\/fLsw9sc14eEdHD595Rptu\/ObbrxbOM1+F9DouOHnbJiA63aj8VbyylJBnh\nUqIZrp92xqVwL32BOrRnJwAHeimb7cVnBcbISTdDSrSbGLGnW3F4VNDiPXvMnUL\/i5eUHXNO7HCw\nT4ocNCv8QL\/78cdlQkoCg8txFsg51l9Kvhb61isDllf5hZRXuIiZF020x8LlxfHb3b7BcuaVu\/+j\n8YxF5I4+K34+7P7gVExPzZmTMjE2de6iVwbMrHxvys3r429E7bBZH7OX6fc6XgJ1vC7ev1nWe\/s+\n+y8Px9tlJWTO\/PiVT7a\/wLxX4n4\/vyJfxuR1vz7xTWRMNh5hBh++xNj\/1rx\/ABRCrBUO33zeAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-09\/admin_widget-1316892846.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"t"	: "teleport",
	"u"	: "upgrade"
};

log.info("admin_widget.js LOADED");

// generated ok 2012-08-10 10:14:00 by mygrant
