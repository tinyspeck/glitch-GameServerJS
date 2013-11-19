//#include include/npc_conversation.js

var label = "Precious Equipment Protection Unit (P.E.P.U.)";
var version = "1347901242";
var name_single = "Precious Equipment Protection Unit (P.E.P.U.)";
var name_plural = "Precious Equipment Protection Units (P.E.P.U.s)";
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
var parent_classes = ["whistle_stand_button"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.push = { // defined by whistle_stand_button
	"name"				: "push",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Push the button",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		//if (this.container.whistle_enabled){
		if (this.not_selectable){
			return {state:'disabled', reason: "You already pushed it."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var choices = {
			1: {txt: 'OK', value: 'whistle-ok'}
		};
		this.conversation_start(pc, 'I am protecting the Fireflex 3000 whistle, the pinnacle of firefly enchantment technology.  (Warning: choking hazard.)', choices, {offset_x: -40, offset_y: 150});

		var pre_msg = this.buildVerbMessage(msg.count, 'push', 'pushed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onConversation(pc, msg){ // defined by whistle_stand_button
	if (msg.choice == 'whistle-ok'){
		var choices = {
			1: {txt: 'Push It', value: 'whistle-push'}
		};
		return this.conversation_reply(pc, msg, "Pushing this button will disable the force field and allow anyone to take the whistle. Are you sure to power off?", choices, {offset_x: -40, offset_y: 150});
	}
	else if (msg.choice == 'whistle-push'){
		this.not_selectable = true;
		this.setAndBroadcastState('button_off');

		var whistle = this.findCloseItem('firefly_whistle');
		if (whistle){
			whistle.not_selectable = false;
		}
	}

	return this.conversation_end(pc, msg);
}

function onCreate(){ // defined by whistle_stand_button
	this.setAndBroadcastState('button_on');
	this.apiSetHitBox(500, 200);
}

function onPlayerCollision(pc){ // defined by whistle_stand_button
	if (!this.container.forcefield_button_activated){
		pc.apiSendAnnouncement({
			uid: "forcefield_button1",
			type: "vp_overlay",
			duration: 0,
			locking: true,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: true,
			click_to_advance_show_text: true, // shows the text prompt next to the advance button
			text: [
				'<p align="center"><span class="nuxp_vog">There\'s the whistle!</span></p>'
			],
			done_anncs: [
				{
					uid: "forcefield_button2",
					type: "vp_overlay",
					duration: 3000,
					delay_ms: 0,
					locking: true,
					width: 500,
					x: '50%',
					top_y: '15%',
					click_to_advance: false,
					text: [
						'<p align="center"><span class="nuxp_vog">It seems to be protected by some sort of force field.</span></p>',
						'<p align="center"><span class="nuxp_vog">I wonder how you turn it off?</span></p>'
					]
				}
			]
		});

		this.container.forcefield_button_activated = true;
	}
}

// global block from whistle_stand_button
var no_auto_flip = true;

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
		'position': {"x":-84,"y":-246,"w":166,"h":247},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAISUlEQVR42s2XeVRU1x3HrahJ1Fib\nmHSxaZPa2CRuQwygDsiwBWGQNYg1isaKArKIEcUYwbgBrrEFjAYjVQkwiMjisKnDvg6yOGzDKsPA\nADKIE5cYc7793TfTJD35r2XGvnO+5+7vft7v97v33Tthwv\/wAPgFyUgqlU6mlCSbIpNpBUgn6+qN\nWL8Jhn6glE69O9BlOjKsCFeP9InujfYVjar7igZV3TV3elpkfQp5UX9\/Z5pC0bpL0SU3I+jphgEj\na6iVyj8MqrrODQ\/1YHR0AA8fjuHBg1Hcvz+IUbUSw0N30DfQhdZBJeSDfejqaHzc3norSS6r5jGL\n6g1OIpFMGhhoNelXtNUODnRyIGQ9jI2poCE4lrLy0GAPBpTtaOuVo7a7DS3yBnS01aGtSVrddrtK\nqBdIeulEZU+TcW9PU5tS0QZVfwcHMnJXwVmNST2iALOqiuCVfXL09rSgp0uGO6Su9ga0yKrR3FiV\n19xQuYReOb5xKZOVv9TVXn+NTaa404J+AmAgQ4PdHBSDpfjjwJUKORQMrvM2OuX1kLfUoqmxCrKG\nCsjqyyktP9LSUvXyuMZdc0PZfJpA3VBXhmZZDTrJIlrQdnJnB5cysL7eVvR2N\/8AR7HHWa5OWozK\n0gKUFIpRVpxTWFORzx9XC4aEhLwQFrZtb\/ThiPqzZ051pKVeUlWUFqjraks0jfUVmoa6ck39rTJN\nnbREU1tdpKmukGjKS\/I0RTeyNbniNHXihS9Vx44c6AkO2Ny8cYNXmKen5yt6WSj04imenk5LPTyc\nfN3dnfavX+cVFxoaGLctyDcuKMDndIC\/Vj6bvE8LHWzjjI3nx\/EWvnOQx5vnz1\/ynoODwOz3AoFg\nkj63GaN24DlKp5N+RZpJepE0g\/RLXXmmLj9D18bVqYBpMmAKW3D6WcXA1GHgt98AC54AZt8BK6je\nmrSEZKqTiU4sb0bik2yor80Dqr8P\/EUDvNoNPD+ufxhmtQHgFXr5PDYZAS6jCZaTluqAFpOMSTyd\njHV1pjpICxpn8ZDGMUgF8BL7PerFivT1v2GTPNFabiHprZ\/o7Z\/o32Vj6vvuPWAO+8hxt97P\/ijA\nJAY6qo2rV+8Csyn\/+hjwJoG\/RVZ+m\/JzCegN1sb63KF4ZTGoPVToCY65WQeziOLQliCc1MAaAvGh\n+Aog9338GNjFRPkdBBpMwJup3xpKXamfHY3lUf5lgpw03u6dzBYITeD9CNhL8RRNOvQtcPh7IJLy\nUZRGUb9opu9\/VNR3P7YfIfBQ+ii+LgbHD1KqBfwdTbCHJjvBRBOeoklOkiJJB0j7SOE6RZA+Ix0m\nnSB9Tv1P0geFkwUtRmgLkujBitOfAtue6ET5j6kuhFJ\/0hbNA83W3r7eHRqNhpU3MVG7L7R9t9OY\nAAL0phB4U1+b9DS1Wh3Y09f7aXFx8dH8\/NzT2dmZscmixDOiyynnUlKTL509G5vxdXLiJVFacnzC\nhXPxFy9eiE9KSjybX5B\/rFneulOpUq0ZffTo9XGHE4lERunposU5BXm5+UWS2uMnjvZGRR\/W7D8Q\n8c3eT8O+DQ\/fjb3hn2Bn6DZ8smcnp9Ad2xC2OxR79oQ9jYqOHBRduVJ7NTvrSnZOhufIyMiMcQXM\ny8ubViC5djDmTCwSUpJw\/NQJHDt5HNtDAhEQ4ItgSrcG+mPdWi9s3OiNgCB\/bPH9G7X5Yd+BfYiM\njsTfT8ch\/mLCk6vX0s88xr0547rdiMXi5yorb25MEV1SpWVeRmZOBlIy03Eo6iAORu7HmeRExGdl\nYG\/kQRw4Gonz4mx8nvAVPiO4+IvnkS7ORGp6Cq5kXa4vLpVsun9fOUsPR\/70mdJqSXBxUW51ZaUE\nkpLryBanQ5xzFSW1lahoaURuYR5yb4hRSfnCmjJkXE3h2iWFeWMSSU5+efnNNezwq7e\/yO3blb\/u\n7Gj4orO2ELcSY9BcLaFjfRNqa4pRdPMap8Ib2ZDcyML1\/KvIE6ehWCIeLC+9HpOVJTIViWL1e7sb\nGhqarhlTBfc2lqnzonahoiCDO\/YzqNTkBGSmJyEnO5VTdkYy\/nn+C8TFHpfGxBx3NNC1U2T06FH\/\nH9sayr0Lkr68UlaUC2lVIQpy0nEjPxMVpfmoKr\/OWe8fp47Az\/cjrPZyK3V2FloZ9OI+PDz84tBQ\nd\/AAXZLa6FLUcrtae\/eoKULCV7EI3LoJdKqGq4sD7OwEpUKhjWEBaYt44enTMe+HD+\/iLt3qFD3N\n6KALUk3lTUQeCoeVwByeHzjD3c0JttYWpTY2fIMDTszJyRJkZYpAl6X\/BDwcDoHlMri5OnJigPY2\nloYFZE+wv49JUOAWBGz1wVa\/TaCLE+dW55UrdIBCsqAQ1s\/CguzZsMHLZN3aVXBxXkEu5WvjzdYS\n5nwz2FhbYJWnCwE6PhsXawE\/NFnvvZpzIwNjMefoYAPL5Uu5Mq1euLk4wtrK\/NkBeq\/zIpfaw\/59\nK7KYK5yEdpx7bW2Wc2UPdyeCFTybGGQuXvuhpw5QgA88VnKgFHMQCu3htcqVq2PbzDN1MYtBciMH\nI3S0hSPBfeTng81Bfv8fgMyC79tZ\/mDBlS5C+O4IwZbtQeTilbC1XW54QCenxVM93IQb\/7ra\/Wcu\ndqbtxSfQD+tpy2Gr2MqS32S+1NTTwIBOs9zcHI4yOOZiBsi2FeZi5m57e2s40wp2dLClLcd8xHzZ\ne1\/PfeM1Cxo6xWCQ7u7CP61e7ZLKVqo17YOWtHr5fFOYmhjDzOxdbruxtxOM8JeZ5s6d++fds2fP\nXkTDJho6FCcKBIJZVlbLhDzeAh8eb94e3sJ3Ini8+RGLFi3YPGfOa\/Opz\/P\/Ldi\/ALE5FoynRmUV\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/whistle_stand_button-1335201607.swf",
	admin_props	: false,
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
	"u"	: "push"
};
itemDef.keys_in_pack = {};

log.info("whistle_stand_button.js LOADED");

// generated ok 2012-09-17 10:00:42 by mygrant
