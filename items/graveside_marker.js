var label = "Graveside Marker";
var version = "1351476871";
var name_single = "Graveside Marker";
var name_plural = "";
var article = "a";
var description = "Someone died here.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["graveside_marker"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.giant = "giantGeneric";	// defined by graveside_marker
}

var instancePropsDef = {
	giant : ["Giant icon used on this gravestone."],
};

var instancePropsChoices = {
	giant : ["giantAlph","giantCosma","giantFriendly","giantGeneric","giantGrendaline","giantHumbaba","giantLem","giantMab","giantPot","giantSpriggan","giantTii","giantZille"],
};

var verbs = {};

verbs.celebrate = { // defined by graveside_marker
	"name"				: "celebrate",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Celebrate the full and meaningful life of this Glitch",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.recognized) {
			if (this.recognizer == pc) {
				return {state: 'disabled', reason: "You have already recognized the passing of this Glitch."};
			} else {
				return {state: 'disabled', reason: "Someone else has already recognized the passing of this Glitch."};
			}
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.recognized) {
			pc.sendActivity("Someone else has already recognized the passing of this Glitch.");
		} else {
			if (this.owner) {
				var text = "You celebrate the life of "+this.owner.label+". They were a good Glitch, a kind Glitch, and they left this world a better place than they found it.";
				if (this.giant != 'generic') {
					var giant = this.giant;
					if (giant == 'tii') giant = 'ti';
					var favor = pc.stats_add_favor_points(giant, 5);
					text += " You receive "+favor+" favor with "+capitalize(this.giant)+", who is pleased by the respect you have shown.";
				}

				pc.sendActivity(text);
				this.recognized = true;
				this.recognizer = pc;
				this.owner.recognizeDeath('celebrate', pc);
				this.setAndBroadcastState('celebrate');
			} else {
				pc.sendActivity("Whoops, this gravestone ain't hooked up right.");
			}
		}

		return true;
	}
};

verbs.mourn = { // defined by graveside_marker
	"name"				: "mourn",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Mourn the untimely demise of this Glitch",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.recognized) {
			if (this.recognizer == pc) {
				return {state: 'disabled', reason: "You have already recognized the passing of this Glitch."};
			} else {
				return {state: 'disabled', reason: "Someone else has already recognized the passing of this Glitch."};
			}
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.recognized) {
			pc.sendActivity("Someone else has already recognized the passing of this Glitch.");
		} else {
			if (this.owner) {
				var text = "You mourn the passing of "+this.owner.label+". They have departed from this vale of tears only too soon, and we will not see their like again.";
				if (this.giant != 'generic') {
					var giant = this.giant;
					if (giant == 'tii') giant = 'ti';
					var favor = pc.stats_add_favor_points(giant, 5);
					text += " You receive "+favor+" favor with "+capitalize(this.giant)+", who is pleased by the respect you have shown.";
				}

				pc.sendActivity(text);
				this.recognized = true;
				this.recognizer = pc;
				this.owner.recognizeDeath('mourn', pc);
				this.setAndBroadcastState('mourn');
			} else {
				pc.sendActivity("Whoops, this gravestone ain't hooked up right.");
			}
		}

		return true;
	}
};

verbs.inspect = { // defined by graveside_marker
	"name"				: "inspect",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Read the tiny little sign for more info",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.owner) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var gt = timestamp_to_gametime(this.croaked_time / 1000);
		var owner = this.owner.getInfo();
		var rsp = owner.label+" croaked at this spot, on "+format_gametime(gt)+". R.I.P.";

		if (this.state == 'mourn') {
			rsp += " They were mourned by "+this.recognizer.label+".";
		} else if (this.state == 'celebrate') {
			rsp += " Their life was celebrated by "+this.recognizer.label+".";
		}

		this.sendBubble(rsp, 5000, pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'inspect', 'inspected', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getLabel(){ // defined by graveside_marker
	if (!this.owner) return this.label;

	var owner = this.owner.getInfo();
	return "Here Lies "+owner.label;
}

function make_config(){ // defined by graveside_marker
	return {giant: this.getInstanceProp('giant')};
}

function onContainerChanged(oldContainer, newContainer){ // defined by graveside_marker
	if (!oldContainer) {
		this.setAndBroadcastState('none');
	}
}

function onCreate(){ // defined by graveside_marker
	this.initInstanceProps();
	this.apiSetTimer('onFade', 45 * 60 * 1000); // 45 minutes
}

function onDisappear(){ // defined by graveside_marker
	if (this.owner) {
		this.owner.removeGraveMarker();
	}
	this.apiDelete();
}

function onFade(){ // defined by graveside_marker
	//this.setAndBroadcastState('dead');
	this.apiSetTimer('onDisappear', 15 * 60 * 1000); // 15 minutes
}

function onLoad(){ // defined by graveside_marker
	if (this.state != 'none' && this.state != 'mourn' && this.state != 'celebrate' && this.giant) {
		this.setInstanceProp('giant', 'giant'+capitalize(this.giant));
		this.setAndBroadcastState('none');
	}
}

function onPropsChanged(){ // defined by graveside_marker
	this.broadcastConfig();
	this.giant = this.getInstanceProp('giant').substr(5).toLowerCase();
}

function onPrototypeChanged(){ // defined by graveside_marker
	if (this.state != 'none' && this.state != 'mourn' && this.state != 'celebrate' && this.giant) {
		this.setInstanceProp('giant', 'giant'+capitalize(this.giant));
		this.setAndBroadcastState('none');
	}
}

function setOwner(pc){ // defined by graveside_marker
	this.owner = pc;
	this.giant = pc.stats_get_most_favor();
	if (!this.giant) this.giant = 'generic';
	if (this.giant == 'ti') this.giant = 'tii';
	this.croaked_time = time() * 1000;

	this.setAndBroadcastState('none');
	this.setInstanceProp('giant', 'giant'+capitalize(this.giant));
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
		'position': {"x":-46,"y":-85,"w":91,"h":86},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIHElEQVR42t2YiVNUVxbGn70AjUkc\ns0wlqUk52SYxLiggyCbqiDGiokQJiBHigqCkTQPasnY30NJszdYgyiYqCoIC4oJg2JwxoplQ4wKT\nlRgdq5JYUPkLztzvph\/1pGQmU77BqumqU7ff0nV+7yzfPa8F4f\/1MzIyMu2HBw+ChoaHDV\/e+aH7\nYk9fc25RkSHPZpvxxOHu\/PggYvC7YbrY00t1jU3U2t5Ofdeu07GTjbQ3KZnS0tMHLAcPTnsicPd+\nHHW5fuPmqNVmo9zCIqo9Uc\/teNMpOv9pF4fdn5tHWXn5o3q9ftqkww0M\/WO0qOzAGNTh4yf4CjtS\n38AhEVXAJxvTayYV8Jv795vPXOzgERKhUkwmOnS4dgy2+dx5OtV2lszZOexa+vCkAt78+hseOZY+\nHqG84mLKzMmh7IJCKiwto4raIxyw8\/JfSBsXR7Gf6ChOr3eZVMDyqmoeqYbmFkpMS6PdCQl8NZjN\ndPzUaao\/3UwXuropYutW2rErlj7W6fwnDfDzW7cHLPlW0qekUJLBSDV1x6nAVkoHGDQiGrdXT3X2\nZtkWHc1te0yM\/6Q0x\/c\/\/TTwt9uDlF9SwqNXW19P6VkWitXpOEhpRQWdZumtPlZH5y59SvXsHqN5\nP+9mpo9B\/zO4\/r\/firj17Xd07cZN6u2\/RidbWgkSg6ZovdDO0w1rOtNGRxtOcm0EoGiozRxWo6xO\nu2WXnbs\/\/+x\/g9Vdz9V+LsQdvX3cKZrByhxXHjnKDbBIc\/P5Czy9bR2ddMJej02soxP2JZIhI5NS\njEaD7LJy+frn1MsA27t7uHMAogmwtjHJgSG1ABGvn+28xGFxDsfmnFzKthaQxVowKivgV3fvDgPw\nEpMN0fl\/YwDFWl5dw5sIJusWyIYA6rryGQdsYfUWr9\/HZCOOW9XRY9w5Vmjfgaoq3jyoQ\/GaaEi3\nCJhTXCxPV98fGZkB3QNcZ99l7nRDWBjvYiuTFtQXYHAOjQHoIw0NPJ05hYUPAWKI2JeSymrQRKZM\nS5BsDTI0\/D0HRP0hSuERERwE0ZJGB+mXAuIhpIDQy+jYWNqp3Q1Z2i0b4Nf3\/kndn13lgHCEZoDz\nTZGRHARRBTSuARDRhFmsVt7JkJ8MSzZp4+N5J6ea0uXTRAB+MTjE0wuABrvwilGL0WrH0g75ASjS\njvSy\/Zfv2fWnW3jtYrqxsP0bnSxbDQLwyhcDD3UvINCRGLdM+7M4hAiIVUwxAFGX4m8xVKBBcE23\nJ1EeQIzzXX+9wqUCIxYcAQT6hkjhOyIIgQYM9ufW9oscvqyy8ledZGluYffnF5fwbRH7tmyAt78d\nNqD2GlvP8EihE0WBfpTh2nghx3586uw5\/iCIIMY02ba7gaEhg+gIzfHvBBmRgknPIZqiUOMhsR8D\nUjaR7uvvLxD3XgwCojMY0gYTjzFBA+hR8IgqatNaYpMXkEE146mlzlCLeO8QX5TwXaxPcR1veEjU\nJKYaSI5sgO1dPd1oiBOsIaTOkW5ITsv5dq6P41MrRk38DpnCpA3ApDSDfICiY6QOKRwfIRw\/Ck46\nJOA6fg9pQooxcskCt3y9kwH7LIpbdCodt\/6TifXJ313YgHugsoryiorlA1wS5NgNrcOOgU7Gfoxa\nQmqlaUT6xk\/QHJDtHiiFQzWHea1iwM1lgEzcBx4bbmmw04wNH820p7eNgwESDQFH0hRD4xpZh0sj\nzYcD9l6CDIjNZDtUwWUmNSOj+7EBfVepXcK2uXNHSZbAsQggmuPrEIAAwVpWY6HS6qyx2gM0Ugy4\nkvKDfB\/X7dE9PuCGKE3zsnXTKcG4meKNgRwAcFIwRFM8x4eCljpKMAVQanYYHW2qGLsPv83KzaNE\nUwzXwOBQvzLm4hlmTzFzZubITM1M8ZvgQnc6G9ZGasjnXQfKKdlH72+dziJQRqWVNio\/bB0TaJgY\nTUCUVJpJm7qAdiW\/Q8b8UH6+uCKT8m25fHvbkx5IaRkGmuWuymduXmb2IrMXmD3H7HfMnpYAKyfi\nU36wU9P7XqgTLViiog+jPSgoQkM7dCtobfibpEsOoeq6WsovT6C8cu2vL0NF8RS8dSYFfvgirYlw\npA9iNLQm\/DlKSNtEWz72opAtcyk5cwdF6WfQ5p0e5LVcdW+OjxDOfL3GDP8j\/kECO90e3UeCKlds\nVPWs3uREXu+qaI7PFO4Mx0xyeERDIl3pkzQ\/2hjrTB9pXclo0ZHeFEHavZtpV6InbdrtzO\/3fc+B\nVoe4UPh2b9ImRFGMLpS2JU7l1zwDlOS5XHHvldeFtcznm8xeZfYKs5eY\/Z7ZsxNBKt\/yFNbP8hLO\nuCyaMuoXqKL12zXE5Ia8AxwocKMTBbzvSGsjnWjNZidavNqRtmh9KdG8nlASIdEaDg4I\/0BHcvVV\nk+dSNQWse56CN7pTVNJT\/Hdui9Tk5q\/8xW2xYnCmq2KvBPDlcYBT7YBTHooiTs7xVES5+anaPJeo\nL7v6Ke+4LlaQB3MGqJVhLEIrHLijhcscyJc9CB5gFQMDKABxHyI+30dNHkvULBPOrAw05LfSgRat\nU5BPkND5toewivn6oz3FL00AN2HjKOyw6jfchNff8Rbm4Xi+l8p\/7kKV2XfZa1v+5CoY5\/gKjbO9\nhaZ5PsoOFq2ORUGKX7xXCTyNHn9W0tyF6kE3P\/VVd3919ewFqqbZC5RVc\/2Fk\/OXCjTLW7jwzAvC\nG\/YmmS4Bc\/jNHT3BZ4odXiWpD6xTfdYIAfMWC6PuK4UAv2DB\/OpM3gTo0Gl2e9ouLwDR2GFUjwv0\nxD\/\/AqwM\/c5nv6CTAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-02\/graveside_marker-1329942893.swf",
	admin_props	: true,
	obey_physics	: false,
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
	"c"	: "celebrate",
	"n"	: "inspect",
	"o"	: "mourn"
};
itemDef.keys_in_pack = {};

log.info("graveside_marker.js LOADED");

// generated ok 2012-10-28 19:14:31 by mygrant
