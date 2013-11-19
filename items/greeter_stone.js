var label = "Greeter Stone";
var version = "1343175820";
var name_single = "Greeter Stone";
var name_plural = "Greeter Stone";
var article = "a";
var description = "Summon a real life human greeter if you feel like it.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["greeter_stone"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.stone = "stoneLeft";	// defined by greeter_stone
}

var instancePropsDef = {
	stone : ["which way does the stone face?"],
};

var instancePropsChoices = {
	stone : ["stoneLeft","stoneRight"],
};

var verbs = {};

verbs.summon_greeter = { // defined by greeter_stone
	"name"				: "summon greeter",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Summon a real life human greeter if you feel like it",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.countGreeters()) return {state:'disabled', reason: "There is already a Greeter here."};
		var to_summon = this.container.getUnsummonedGreeters();
		if (to_summon && to_summon.length) return {state:'disabled', reason: "Unfortunately, no Greeters are currently available."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var choices = {
			1: {txt: 'Yes, that would be lovely', value: 'summon-ok'},
			2: {txt: 'No thank you', value: 'summon-no'}
		};

		this.conversation_start(pc, "A Greeter is a real life human who can come and introduce you to the game. Would you like to summon one?", choices);
	}
};

function make_config(){ // defined by greeter_stone
	return { stone: this.getInstanceProp('stone') || 'stoneLeft' };
}

function onConversation(pc, msg){ // defined by greeter_stone
	if (msg.choice == 'summon-ok'){
		this.container.summonGreeters(pc);
		return this.conversation_reply(pc, msg, "Fantastic! I have summoned a Greeter for you, who should be along shortly.");
	}
	else if (msg.choice == 'summon-no'){
		return this.conversation_reply(pc, msg, "Very well. If you change your mind, please come back.");
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
		'position': {"x":-63,"y":-176,"w":161,"h":177},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGiklEQVR42sVYWW8bZRRtVaCCB6qy\nqCABEQgJilAiIbE9lEgIHqgKFSVVSytIndKmKW3SRnWdpY7jfd\/t8Tp2vCWxHTtpEEKIB7\/1NT+h\nP8F54P1yz+cZk1YqKg1fsHSU8cx05vTce+7iffv+5efXVnVgs1Vbv9uqdpYr2W6llKKVWu5+Phft\n1CoZi6rGhvb9X5\/2Wml0fa3cbdYLVF9VaXUlTyvLOQEcg6yai1I+G9kql5XhPSW31ihMtRpLfUI7\nUcjHqbSkULtVplw2QuGQk+IxDylKYHRvlGuUhx9FDiizckvFpDjeaFcoFHT0EQg4BqQTbDVLW3h5\nY7UX2njMS9bFGXI5zaQkA9SsF6nOIa5W0rTWLFI2Eyafd1EQ9PnM8kNdVBO0pimoJP0UDbtYNYUy\nqRCTvCPOs0FIzcd6uVhOCXJej4WsZqN8gmou1g9nMuGjSNgpjtm55HLcoUw69EDIFb4HBO22Wbp5\nc0IuQUXxDaeVoAgfXl5U4+LlULLAijlsc5x\/iT65Bjsc30V4OcxG43W5BNvN0knhUs0ECKFl4TaZ\njJNk4zyMcLj1EAM41kPs91nlE\/xlvWZhk1DQb6cwvzSdClIy7qOAzybMAsJwMVRermUFwdJSUuQf\nSErPQXQM1LZQwE4JJuRm58K1IAZTIAcRZpwHObgc9zsd84Kgyzorn2A+ExFkEDqPa+Fvw8R9IsTF\nQkIoCnWbjaL4C3cH\/DZyuczyCaLGed0WoRJc3HcrG8VhnxOhddrnqcAG2miXye0yC3J7Ugc3WpUu\nwhaLuCkR9\/bdrAPh1QGFUYKgHrAnIUaLQ71zcq5FI64HyOU49MVCnAt2UPTighqj339rCveCoMe9\nIJfgH43GoeVqVoTWzbnn57qG5IdSIIiBACpBvWo5LYyzuVET98DFICq1UG+2l4eX2AClQpLLTK+s\nYCiAKRBKhD3LXQQEUYLyuQhhFNP7MAgaDN\/LI3i3XR3VBwG0M4QZysEUrWavN6Mv691k4c4t7iSq\nIAaCUPKi4by8kWu9VbGsLufFYAD14lFPb7zifNPzEMbBNXQRdJs1Jg4F4WKbdYbGxs5ZpBFcWclZ\nQAZ5iLyDWdA1cjxOgRxUFcQ5F8U1vrdWzTCx2d4syCSlEqyWU2EUY4xbemjjUa\/IQb3nouykeCbE\nuWw6LEguWkz9gVUqwWjE3UGPRTkBEkxWSfgJ4xfM0u+9fIxzMA0Izs9N9+fBK5cvyCOITQ0Kwckg\ngKUIpACc16cXHGPiwT0oNwtmowgviE5Ojp+URpDzqYMCrJcUjPfos2hpO2dAMW5x7oEgejHaH9rd\n9M0JuXWQ18xOrZwRNTCfjVIs7OZ656QIb20oJT7PohgWxPCq9hSG40EQuHzpR5qeHpe3J6+uqF04\nNau5FtMyHI08QyjRozFhY\/7DfVAPoYVyU5PjdOmnH0hqH0ZugQxeCuj7LpIfqsHFettDm4NZbkyN\n04xpirc+ExlvXetKI4dfBpBTaGUoxlAItQ4KoqzAzWklQCmGh0cx\/MXItWC+RWbuKAjxzMxURxrB\nel21wK1WrmkwBvYQkEwyMeRgSSszq1p9hIkAEEMdhIKspjyCvIdY0IdF3eNpGs5FLUTvRcuDQQJs\nFH0Mg9o4v5OgxWyUR7BRL3aQVxgEkG8Ib1GQDIsFCfuJMAgrKVZNUSujgtjszA3kH01cMUhUsLHU\nEcs5L0DIQyiHcoPRH2bpjVdRsSAVtUKOVEBxvn7tEl0ZH6Xz50bu8aNeYjz3nxPk0tHFYIAdBAs6\n3AyF8HMHCrZOUCzxWvvDNdPtSYExwzk6derEFj\/qI8Z7jDcYLzCe2f1PHWpsCC\/UgdyLhFz97xgY\nUJDFLw2sHkKOHEUq\/Hz1Il2dGCPDhbPbJ7\/56k9+3BnG54wPGG8zjjCe3RXBRCIwwIu6hV15H+SU\nRECYIpMKUzBgv+\/3LHbhWL\/XqikXhrO7XF62z575dntk5Ot7J45\/mTt27OMRftynjLOMYU3J1xjP\nPym3Axr244vDMT8QDNqG2KmdUMBBkaCzY7OZhjwe0yG7dXYU1x3WuS27dW4K50+fPv7K4ODRTzQS\nOqCagfEd433Gi4yndkPwyMNJDSJ22+w6SDzGM6DO64x3tbB+poX4HcbB3aYfHvC0RvDAY\/6b\/TuO\nDzPe1JT6QiP3IeMt7dpBWVVnJ9mHyb+qKXZYIzaoOfaodu\/LGqSR26\/h0I4cPfAP\/4GDj1D3iT5\/\nAXVxTfU+aZTwAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/greeter_stone-1343174238.swf",
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
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"u"	: "summon_greeter"
};
itemDef.keys_in_pack = {};

log.info("greeter_stone.js LOADED");

// generated ok 2012-07-24 17:23:40 by kukubee
