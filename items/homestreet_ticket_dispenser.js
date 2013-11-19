var label = "Home Street Selection Machine";
var version = "1343431299";
var name_single = "Home Street Selection Machine";
var name_plural = "Home Street Selection Machines";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["homestreet_ticket_dispenser"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.trigger_event = "";	// defined by homestreet_ticket_dispenser
	this.instanceProps.target_distance = "-170";	// defined by homestreet_ticket_dispenser
	this.instanceProps.homestreet_style = "meadow";	// defined by homestreet_ticket_dispenser
}

var instancePropsDef = {
	trigger_event : ["The events called when the machine is used. Comma seperated list."],
	target_distance : [""],
	homestreet_style : ["The homestreet style"],
};

var instancePropsChoices = {
	trigger_event : [""],
	target_distance : [""],
	homestreet_style : ["meadow","firebog","uralia"],
};

var verbs = {};

verbs.choose_uralia = { // defined by homestreet_ticket_dispenser
	"name"				: "Pick Uralia Style",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Choose the Uralia style of Home Street",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		if (stack.class_tsid == 'homestreet_ticket') return true;

		return false;
	},
	"proximity_override"			: 50,
	"conditions"			: function(pc, drop_stack){

		if (this.getInstanceProp('homestreet_style') != 'uralia') return {state:null};
		if (!pc.items_has('homestreet_ticket', 1)) return {state:'disabled', reason:'You need to get a ticket to use this machine'};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doChoose(pc, msg);
	}
};

verbs.choose_firebog = { // defined by homestreet_ticket_dispenser
	"name"				: "Pick Firebog Style",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Choose the Firebog style of Home Street",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		if (stack.class_tsid == 'homestreet_ticket') return true;

		return false;
	},
	"proximity_override"			: 50,
	"conditions"			: function(pc, drop_stack){

		if (this.getInstanceProp('homestreet_style') != 'firebog') return {state:null};
		if (!pc.items_has('homestreet_ticket', 1)) return {state:'disabled', reason:'You need to get a ticket to use this machine'};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doChoose(pc, msg);
	}
};

verbs.choose_meadow = { // defined by homestreet_ticket_dispenser
	"name"				: "Pick Meadow Style",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Choose the Meadow style of Home Street",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		if (stack.class_tsid == 'homestreet_ticket') return true;

		return false;
	},
	"proximity_override"			: 50,
	"conditions"			: function(pc, drop_stack){

		if (this.getInstanceProp('homestreet_style') != 'meadow') return {state:null};
		if (!pc.items_has('homestreet_ticket', 1)) return {state:'disabled', reason:'You need to get a ticket to use this machine'};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doChoose(pc, msg);
	}
};

function doChoose(pc, msg){ // defined by homestreet_ticket_dispenser
	pc.moveAvatar(this.x+intval(this.getInstanceProp('target_distance')), pc.y, 'right');
	if (msg && msg.target_itemstack_tsid){
		var ticket = apiFindObject(msg.target_itemstack_tsid);
		ticket.apiDelete();
	}else{
		pc.items_destroy('homestreet_ticket', 1);
	}

	var location = this.getLocation();
	if (location){
		var events = this.getInstanceProp('trigger_event').split(',');
		for (var i in events){
			location.events_broadcast(events[i]);
		}
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
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
		'position': {"x":-25,"y":-77,"w":50,"h":77},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIpklEQVR42sWY2XIT+RXGeQMeAQbw\nqrW17\/veklqrJdsysi1jyxsCm80RIAweMIwzLJmBySRVTlKVIpOqgaq5T+kRfEVVKjd+BD\/Cl3P+\nQrIZuEkkJ131VcvWRf90lv\/5Tp85819cqz83z82\/3Xg++ft6e+rH+mHlj8tH0z\/U28WXtXZhb7ad\neTLVKr9ZaE39uNQovprznvlfXgxX\/fP6ofJ0CrVXa6i9XIWyO4nkwwnI26QHE4g380jtlJB+XEaq\nq6\/LiDYz7dTOZDvazCqnArf499tnZ\/\/SOJj57SLuvn6It2\/28MsPe\/jH3n3s3F3H1d2bWNpt4PL2\nIuR7BSQfTQjFWnk46xHYrwQ7WgjCWgu+Hzjgwk83nnM0mm+28dfvn+FfKwX8sxoR+iVuxMqdBm48\n2sJMfQ6uahCx+zkhZz0MWy0gJE06hKzzAVjmffsDjR7VE5RHk9j57il272\/gQ8GGD1kTPuQs+JNr\nBDMzRTTu3UB4Ig7PakTAuVYiBOOHdc4PqWSHYcoJ3YSNZIVl1nc4MMDa3zYbie0CVr69jq3d+7j9\n+C5uZQJ4oD+HluEiqm4j5htLqF2rwzUZQOh2CoEbSYYgecWdIbtS0w8zV72QKi7dQAAnXs0fRO9m\nsPBwBatb17GxfQdrzeuYW7+C6mpNpLd+cx2l+Wm4qMbCd9JwLIVgvuyBiWT+lfQURcOUg75zKwNJ\nr\/K0gvBWWjw4dCuF4LqM6GoasVoa2foEistTmF6qIl5Kwb0aRvBmEqaKG0bWtOszGSad0OTMDNnq\nG3Dp3W1FQN1KigcLbabg34jT0ZGF7zrV3NUo3CshOK744W1ESTEYpp2i5qSy44vS5EzQlwcAWHg5\n3wpsJsDyb3QVF\/KuReBYCAhI37VYT06C5W7Vl+3QFa1fFEeQUj0IwNnWyYf7rhEYRcy1HOpEiz57\nrkbgWT+WteaDnrqWu1WTNwuYz5S3QJu3VPsGzDyrNE4+3E1RsxOAYzFAcDG46JxzrYY6WunIdNkl\nokQAUGeMQirlU\/F3mqy5\/1GY\/XbGe\/LhrpUgnMtBWKgB+C5UD8JRD1DndiRRajsAJoynpI6S+p5U\nikFEUZWVBnPMuNbCvYc7lvwCyEzdaF\/0d3TFJ2RjLfg6qaUmUBPIaEJ7rHhH3agO7KCmB+93H84y\nV1ww01FhvuyGie6WqpsmhkfIMuchwOPUDkfVx4p0xNFVpaT2wADTu6WG\/LAIFo8wPnICmzJ8dJxw\n2i3zbpoMrp6kshWqtAHjaUmAXQqN99SNoCqsfT4QuNBu8Wz6celI2KevSyRyKTvsVDrA8sMCEtt5\nJB7kBbjvekw0zBjVWlcX\/CM9ce2NyTqM27Stvpuj+GJ2P\/+iepR\/XkXmm2kkCCZ2P4vYvQx49EWb\nCiLNNCK\/oSmzlaJJw0rS9zmqOd1HaQmS7gTFzTFG\/xv3UBQNfQJm9ipthso8mwIb1PSTSRRezIJd\nTeabCrJ7M8KUpp+URRSDN2UEbyQQJ\/9nrDgxEtN8UaM+DTRGLbQmfX+AiQeFQxJ0VNA82I0Vh6gv\nTh9PDjGXybWIMUjjL\/V4kg7s2KdNcaIxhiMqjHrUUJs0BKeD3qrvzygEb6WOuKYssx6oqKg5RRd8\no\/jKM4zzrks457xIACo643TU2d6P52EIQ2HVCVFTBNQYd2mgMncix5JsRkh2qb9D2r0e9lKHvqeR\n1uaHW2vs69zkRBziAB5L6EU9cVfq6dzj6PKP4U4dCoxB7dXB6DLB6rTC5LR0oEhas34wgL++jEXj\nWWnG7nXlfAc2hWxTxgqJpC9ZaKyZyYQaoE+ZoXNLAuqkzC5rD1BvNZwOYPdKlbPtdDkHOU+dm4zC\nFwnA6XXC7nF05LZ\/BtiFYxnsJugsEs6c1pUuZQ8YMFXKCiUnMohl6eCOBnvyE7Q74IHT5xLwvegR\nGEeQdXqABNcFZLhkUUE8IyOuyJBzKUTScRHZYDzcAz4Zwa5OFfAYLgO5oCBGgCE5QmAxEU3+O5pJ\nIJKKiRJgIKPdLMT1SJE8OjVAkVqGI8kUPbmQRiJPZ2EigjjDZRmOpCRENH2x4why7Ql5pEPjovHs\nwKCWfr6tq7+70679tIFCcwaplTziVWoShVKZoFRSOr1hnwA6CXcSkOuOz0CjbKEjy03rwADsfvda\nfrflLb++QqOuionf1cTIK31fQ+n1Aoov5pDbqSB5q4BQLY5AIQR\/imovHkKYU0yAOjr7TAkrbLzR\nTTs6O0nBPDi7VX9\/p8UzmPYTZGkO84xOkrPhZZ7tV4hMQqRJad8pQab\/xVs5MZ8jtP2Fr8q0GoQ7\nPvHjGsCOhizX4Oqw9nazzeYgS2D8Nottl3slDCtNDn6DwLsJz2Te\/HixEqsBzWyeQPZFMrg0gXpg\nNIV4dLJfHEtI5wYCWPqudijcC79qE1Eq0top08oZxEhEI8SrJsPxYsWAvB6w+9bmTbSsOzpgtCyN\ns5GlHWVM1mMkrm0MxLByzSlPp4VR5bTyYj5Oc3g4qOpJlZR6S5SD9hQ2EDy7NVnq4LLtEzD2iQSH\noYj6oG\/AqT8sKXGqM2V3Cmy\/uOYCG0loM6ZPAFlsHthU9IzFtB2j5AF1RYtw0WxeR+Kang1jx9M3\nIEG1uAHY0sfuZck9K8IHaihdDBVt5uC7GhefjeR0vOsx4WzYP0qTNoxEyWZRmtmsMthQpGPDLgXH\ncN4\/2r9hiDSzB+EthSx+FnzvNoOaUmYo2eGnz7Z5nwD0rJ2Es34EJJOaMXwCdjEwSt5yeDAvMKlL\nW1T4+9Y5b9u+4D8SCzrVWGAzSetARTSDaYa84GXqaGocI6WVtzq2YAw4HGJTq++BfeUbPjrvGWqc\n2qhzrAbO0fKuOBYDLVPF2aYGaBsIRD9hER3L9aYvdQDZyA4FyFXLWorYCM57h99fMF44e+b\/cXUN\nLR3ADTrj9nV5c1uTM4omGUmoD867L\/7HO8i\/ATWhJO5JeTWCAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/homestreet_ticket_dispenser-1340417589.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"c"	: "choose_firebog",
	"h"	: "choose_meadow",
	"o"	: "choose_uralia"
};
itemDef.keys_in_pack = {};

log.info("homestreet_ticket_dispenser.js LOADED");

// generated ok 2012-07-27 16:21:39 by stewart
