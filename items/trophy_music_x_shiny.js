//#include include/takeable.js

var label = "XS Music Trophy";
var version = "1340228514";
var name_single = "XS Music Trophy";
var name_plural = "XS Music Trophy";
var article = "a";
var description = "As shiny as the soul of its bearer, this plaque recognizes the meritorious Music Block collection skills of said bearer.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_music_x_shiny", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_musicblocks_xs"	// defined by trophy_base (overridden by trophy_music_x_shiny)
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

verbs.drop = { // defined by trophy_base
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

		var result = this.takeable_drop(pc, msg, true);

		if (result) { 
			var trophies_outside = pc.home.exterior.find_items(function (it) { return it.hasTag('trophy'); });
			var trophies_inside = pc.home.interior.find_items(function (it) { return it.hasTag('trophy'); });

			if (trophies_outside.length + trophies_inside.length >= 11) { 
				pc.achievements_set("trophy", "placed_eleven", 1);
			}
		}
	}
};

verbs.examine = { // defined by trophy_base
	"name"				: "examine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Have a look at the trophies",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var rsp = {
			'type'		: 'get_trophy_info',
			'itemstack_tsid'	: this.tsid
		};

		pc.apiSendMsg(rsp);

		var pre_msg = this.buildVerbMessage(msg.count, 'examine', 'examined', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canDrop(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	var loc = this.getLocation();
	if (loc.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function canGive(pc, drop_stack){ // defined by trophy_base
	return {ok: false};
}

function canPickup(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	if (this.getContainerType() != 'street') return {ok: false};
	if (this.container.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function getAdminStatus(){ // defined by trophy_base
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc.is_player){
		var location = this.getLocation();
		pc = location.pols_get_owner();
		if (!pc || !pc.is_player) return;
	}

	var ago = this.ts;
	if (this.ago) ago = this.ago;
	return pc.label+' got this trophy '+utils.ago(ago/1000);
}

function onPickup(pc, msg){ // defined by trophy_base
	pc.furniture_migrate_trophies();
}

// global block from trophy_base
this.is_trophy = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"trophy",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-50,"w":50,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKAUlEQVR42rWYd1DVVxbHs5nZf3Yz\n2dnNJiaaGHXj2qkK7z14NEF6k95LQAgag4oNkOojWFCjoMZeQLEgxV4xgghSHlUBRRSExJ7oTLLZ\nmZ3vnnNfiQQzEx7mzXyGx3v87u9zz7nn3vPjjTd+4yWXyy3Nzc1T\/2jMzMzC3tDlxRdLTUwgk0j+\nUKQzZpTrLGgmk\/EAfxhmUunwBaNCQ\/Dwfjce9d0TPOy7K3hAnzHf9d4RfNvTJei\/p6Lv3m0Vd2\/h\nPtPdiV7mTgd6ujqwRpEx7AgWawRZLHHJYiwfRIKKxb+w7JUswrKEX6iuvIzVakGZqekznQQp\/OWc\nAo2gt6fnIBzdZsM7PAY+EbHwjYyF30v48meBoa+8rvz8aa0gr3PdBTUpppT++ibOLm7IOdeEvS2P\ncODmUxzufIai298LjtD7wvan+LqyA+HhkYMFz5HgynRtoQxLcP3qL\/Gof2AEPd3dEZO2DnuaVXJF\nt77H5sstCEpej+ziKyi7+wLHun7AofZnUOwohK+Xl7jOxdERjrNm4dypMpQdLXxNgquyBgl6BUVg\ne8MD7G99LKJV2v0CmYfO43DzfaTmn8KZvh9Revc5CjqeYkvjQ3gEhGHKhAlaig8VoJQEuZJpDQ5P\ncB0J1tdc1cq5Ojsjo6gSOxsfoODGE5HSkz0vhNjFB\/9F7FcHUNr3Ew7eeYGdN55hk\/IhkoqqMN3A\nQCuYk60gwYPDFJRIRJGwYEX5ea1gbOZG5F3vJ8GHWsGSey+Qc0GJgKydWLj3NMr6\/4NCFrz5DLnK\nR1hV3Y8YxWYY6ulh6sSJyFiRiNIj6gjqmmKamVL2K0EfqsqsszeRy4JKSnHbI+y58RQ5FZ1wTFgD\nf8UOIVfU+yPybz\/H9ran2NjwENnX+rHkeDPsnD2gP2UKCSapIqg+qYyNjf82ZEEphZ7hIqm4dF4s\n9EW7qPqu9GBjdR9ya\/uxtuZb5FT3wn7Raqyr6IBH8kZsa+hFQddz7KYC2dL8GOtqv4Oi8j6SLt7F\n\/D0XYTp9OjJTklBy5KBIr9hqpFJLXSKoFbxCgn4+PliYexhZ5d1IudiNFeX3kHW1D0uLryN6SzGS\nS6ohjVyOoFV7ELXpCLaS3Ib6ByJ6ad\/0YOm5O4jLKwJ1IMhMTRaCZsMRZDmW3LB2lUhxgJ8f\/EMi\nEFvYgC9O3MKyc91IvdyDJaVKBK89AN+sXYjPv4RP847Bael65DY+FnIZV3qReOEuFp66jcDIGMww\nMsLKtBUqQZIz01lQdQzh7MlSkWJPV1dIaFG7xmfhs5J2LDh5G8vOqyQ9Urdg7t4LcE\/ZDJsvsjA7\nbSu+rOoTkWO5hNNdmLu5GHY2NiLFLNjWWAtzWuNmqvNY9wiePVGCC6ePw8TYGKYkKLewRnh+HeJK\nOhB\/8haWnL0j0r24qBZLjtXCe+VOpF7sQjKtOY4yR27e0WaExcwTQjxJRXoK2pTXVYKqjkbHCBJn\nyo7hePFhkRoJVR0P6hiVgMjDbYg91o7PyzpFNC3mZsIpcROC806QkFKIzT9+S0wkbu0+ONMpIuf2\njcZQpKWgVVkDc\/qdBWfoHEESPF1WhML9u4UgD86DWllYwDOnDGGFrYg6cgMxJOqmyMfMxRvgk3NU\nSMUWtyP66E1EFjQgKiYO1paWkJuZiawkUQfU0lAjhHUSNDEx0ZepF\/Dp0iJ8mZmmFZSrBS08guG7\ntxFB+c0IPdiC8EOtiDjUJiLLP8MOtiK4oBnRq\/fC3c1tgGBIgD9a6qthRRXNgrR0vhha9KiqNIKn\nSo5qBTUptpLLMdPaGl7RCxC+KBVRSzIwZ9lKxCYqiCzxnj+LSEhD+KdzYEvFwZPSpDjY3w\/N9dfE\nlsOCFJBU3QRptidJMCsjFdMNDUWRsDQPbGNlBTtbWzjY28PZyQluVOUcKYbfu9CZ7ejggFn0NzwZ\nS5qUKBK1YFMdCVJEebxhCV46e0JUnTEd9lzJnCJNmvnGLOBIkk5UBCzqQnBBsJy9nZ2IHqfXgtNL\nY\/I2E+Tng6baKjjYzhQRlOgqyDK3bzSKfYsPepFmdRQtKIp8Y5bkSLKMA\/V6jD3B4ho5jjhHj9PL\nYwT4eqOx9ioiQ4PFaSWRSHQUpAFvtTWKs9Ng6lQY6+uLKPKNeOYsuWuTF7ZluyMv0RHrF9oie74l\n0j6TYk289UA5EuHocSb8vb2gvH4VESFBUN9HB0HVBorONqXoPvQmT4bhtGnaVLOkl4scP\/dEobfc\nG+35jujcb4+qXCmOrpgI5VYrzPGxVm3Eajlex5wJ39meaKipRHhQIKS6CPLTPs9MQiKdrUrRv3Gj\n+bJkWvws1O1zFYKPqgOQ4T4CLTtnYmPYR9g+dwxa98xE9z4P7M72EBPSyHG75e3hToIVCAsMAAeC\n7rV7yM\/EGsGOlgakqwW52dRIbs10wpOKAPzvQSxeNIWidos1FJ4jsD74Q1z6ykAIPjsVgrI8LzEh\njRyP4eXuhvrqCoRSNYtMUXOss2B7Sz0iggMHPFNMI8nN6Y74uS1SK9hR4IR0t3dRsHDCAMFzBSFi\n\/fLEWI6vn2FogLprVxDi7wt+rDAblmBzPXw9PQYIMrmp9vihJlgIcoo3hIxG\/S5vEcGylZO1ghcO\nh2PapEmDrq+79g2C\/dSC9Pyjk6A1VeDNpjr4vEJw0vjxCHA2xJP6IHSd8UD1FlWRVGwwxaHl\/xZF\nsmmBNabrD5Zjaqu+QXR4mKhinQV5Ed9oqn2loIbsRXKkz5EgJXQGkgKNsNRfHwm+U5EUbAST35Bj\nrl+9jPTk5a9BkBrLxfHzSdJdhYcK7wG4qXBX4TUIVxVuKmYTLJiWtFykeMhFQnJaQW4sWxlqj7hF\n4i6ED\/pmOkub6qrEkcWnAm+8yuuVYn\/jLYSrtL76iigGXm+c0tqqy0KsprJcoBUc6n+4OOQs6DzL\nDll0DmdRg6mg407DylQmWUtmSrI4bQS0qWcIEgXpyRqWC1hKg6ZIhvxsrPnPlqeNDAF2MlWlvWac\nLFVj21qaD13Q2cxIGS6fjIU24xFjPhbOEj3YS41eK3Nt9cT4jIPMGEttx\/3+h\/c55mNS460+UfLF\n8yz\/hVCT0S1BJh+tc9f7AK7TPoDLS\/gYjdpKfO1tNHKbwHDkdgG9j5B8XBcnH4e5FuPEOEy0bEwN\nfb5L4TpFKxhnPm7Dp7KxH\/8et7eIUcQ4YhJhQJgSFuPfeyvGXW+kkHKa8j7sJ4+AxSfv3KPvoolY\nIo74nJiv\/jnvk3\/+dZ234Sj4GX+IwOkfIcRkNLz1R1XTdy7ELMKKexPCmJhKjCdGE38n\/vRrubeJ\nEcQEQo8fTViMsCNcvQxGnYildEfLxiJSOgZhph9DOvYfJ+i7TGINsZHYRuwldhB5RI5s7Ds\/WY5\/\nFzYT3oPtxPfExP7y5zc\/o+\/8CA\/C4SXRaWrB99WSb\/4fJThXehbUPRMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1278112450-6315.swf",
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
	"trophy",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "examine"
};
itemDef.keys_in_pack = {
	"r"	: "drop"
};

log.info("trophy_music_x_shiny.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
