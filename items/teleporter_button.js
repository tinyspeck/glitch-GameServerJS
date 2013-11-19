//#include include/npc_conversation.js

var label = "Teleporter Control Unit";
var version = "1347901274";
var name_single = "Teleporter Control Unit";
var name_plural = "Teleporter Control Units";
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
var parent_classes = ["teleporter_button"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.push = { // defined by teleporter_button
	"name"				: "push",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Turn the teleporter on so you can get home",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.container.whistle_taken){
			return {state:'disabled', reason: "This machine is not yet active."};
		}
		else if (this.not_selectable){
			return {state:'disabled', reason: "You already pushed it."};
		}
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.codePrompt(pc);
		return true;
	}
};

function codePrompt(pc){ // defined by teleporter_button
	var args = {
		input_label: 'What is the activation code?',
		cancelable: true,
		input_focus: true
	};

	this.askPlayer(pc, 'activation_code', 'TELEPORTER SECURITY V2000', args);
}

function onConversation(pc, msg){ // defined by teleporter_button
	if (msg.choice == 'code-hint-yes'){
		this.hint_attempts++;
		
		if (this.hint_attempts == 1){
			var txt = "OK, you seem like an authorizedish person. The code is three letters long.";
		}
		else if (this.hint_attempts == 2){
			var txt = "Huh ... awkward. Um. The first letter is 'F' and it's an acronym.";
		}
		else if (this.hint_attempts == 3){
			var txt = "Not even sure why I'm even making you enter it at this point, but … think 'Fire Fly Whistle.";
		}
		else if (this.hint_attempts == 4){
			var txt = "The code is FFW.";
		}
		else if (this.hint_attempts == 5){
			var txt = "Type FFW in the box. C'mon.";
		}
		else{
			var txt = "Oy. This is boring. Type FFW so I can activate this thing!";
		}
		
		var choices = {
			0: {txt: 'OK', value: 'code-hint-ok'}
		};
		return this.conversation_reply(pc, msg, txt, choices);
	}
	else{
		this.conversation_end(pc, msg);
		return this.codePrompt(pc);
	}
}

function onCreate(){ // defined by teleporter_button
	this.apiSetHitBox(200, 200);
}

function onInputBoxResponse(pc, uid, value){ // defined by teleporter_button
	value = utils.trim(value).toUpperCase();

	if (uid == 'activation_code' && value){
		if (!this.hint_attempts) this.hint_attempts = 0;
		
		if (value == 'FFW'){
			this.not_selectable = true;
			this.container.teleporter_activated = true;
			pc.announce_location_overlay({
				uid: 'teleporter_beam',
				width: 275,
				height: 530,
				x: 990,
				y:-130,
				overlay_key: 'teleporter_beam',
				dont_keep_in_bounds: true
			});
			this.conversation_start(pc, 'Code accepted. You may proceed.');
		}
		else{
			if (this.hint_attempts == 0){
				var choices = {
					0: {txt: 'Yes', value: 'code-hint-yes'},
					1: {txt: 'No', value: 'code-hint-no'}
				};
				this.conversation_start(pc, "Er, sorry ... that's not it. Would you like a hint?", choices);
			}
			else if (this.hint_attempts >= 1){
				var choices = {
					0: {txt: 'Yes', value: 'code-hint-yes'},
					1: {txt: 'No', value: 'code-hint-no'}
				};
				this.conversation_start(pc, "Yeah … no … that's also wrong. Would you like another hint?", choices);
			}
		}

		return true;
	}
}

function onPlayerCollision(pc){ // defined by teleporter_button
	// "A teleporter. Aha!" > "It is off. You need to turn it on." (click to advance for first half; 3 second auto dismiss on 2nd)
	if (this.container.whistle_taken && this.container.teleporter_button_activated){
		pc.apiSendAnnouncement({
			uid: "teleporter_button1",
			type: "vp_overlay",
			duration: 0,
			locking: true,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: true,
			click_to_advance_show_text: true, // shows the text prompt next to the advance button
			text: [
				'<p align="center"><span class="nuxp_vog">A teleporter. Aha!</span></p>'
			],
			done_anncs: [
				{
					uid: "teleporter_button2",
					type: "vp_overlay",
					duration: 3000,
					delay_ms: 0,
					locking: true,
					width: 500,
					x: '50%',
					top_y: '15%',
					click_to_advance: false,
					text: [
						'<p align="center"><span class="nuxp_vog">It is off. You need to turn it on.</span></p>'
					]
				}
			]
		});

		this.container.teleporter_button_activated = true;
	}
}

// global block from teleporter_button
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
		'position': {"x":-90,"y":-124,"w":180,"h":124},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGN0lEQVR42u3Xa0xTZxgHcLdk88M+\nL+HD1G7iYooOCAoUeqWFQlvuLZdSWi5iKqIDEW8DCqggigOniFqBGd1Mljl1W9yc026iMS5MFEFu\n2spNRZ0mOmMyP\/z3Pi+UVD8ZU9iH8SZPzunpac7vPM\/7Pud01qyZMTNmxszg4\/HYiP+zp49tL178\n0\/rs2SPHw4dDjrF7TsfocH\/r8PAN2X8GGx0diH9wf7BjaLAPg7f7cb2zHU+fjOHxoxE8GLuNu6MD\nGL59A66Bax1O55V504obGeyxEIAgbedP4+4dJy60ncHZX3\/EXw+Hcf+eE3dG+jHk6oZz4BoGeq+g\nr6vdMi04l6tTNsQyQwBWShz\/7ihuDnRiX1MDhgd7Gc41nr3BHty+dR03+zrQf6MdPdcvo7vzYvyU\nA2\/1X3UNOrswMtTLkAO40d2On04d49h7d25xuBvHzkV\/z5\/o7foD3dcu4frVi64pBxausjp21W\/D\niWNfoaO9jUNHh\/r4lmCDrKyum52TuEsXzuDUD9\/g4P5daLXvbp1yYN4yc4fFnAaDPh5FhVasW1vA\nI9OUgsQELSJV8pdCHaVAiiEeCnk4YrVR0wIERVnpWjTt34pvTzag6UAl9tm34GBzLWxlJfx7AlOk\npiTAlGHgwOhopeO1LwTgrTcJN7CifB3sLVvQeKAce1kcaKnCnn1l2Li+EO5z3FBzZiqiIuVQKmWu\nKQVarVkC94Urbes5qHF\/Ob48Us0z2XxoCwfSFPAEpqclcaBCIcaUAtcVFySssObwC5duKkZx0QrU\nVG\/EzjobGhu3orllBwcSyhNoTNcjWh3BgX5+fv5TAqyv3yyv21H5eHttBaoqN2BdyWrUrM5FcZ6J\nzbEUPs8oMowG0E2szM9F\/opcZFmMLIPJ0MSoIGfzMDwsuNXrwN311Qmf79yMuh1VIGDtNhvarHFw\nFibh57UW9pnQG\/H9iaO4fOks2n4\/jW01NpR+VsxXuzF9HCiThUEqCYNKJa\/3KpDNvYqClbmsraxg\nFy7H7i9qsdcYA3uqCtUF2djAynrksB3d7GnhutXFkOfYKi9Bbo6Jt5rxFqSBRBKKCIUEKqXc5VVg\nbnaGg9oF9TODPo6VLR02toqp1ZSztrKmKB+rVy3nZaVjGzcUYVVB3mQvpEWSxHqkTCpiGRTxY14F\nMpCDcPrkOCQnxfJtQnwMy4aYN2J1VAQvoU4bBa0mkm8p3EAqM92YlGVQJg3jxxQKhb\/XgAZ9rEOf\nHMtwOiQl6jjSfvIExOIQDqQmLJeFcxxBY6KVPDyBVAE5m4MS8XgGVSpFvNeAGUb9BE7L5xJh89Z8\nymEEoh6nUkpfwnkCdVo1\/41UHMp+I54Aym1eA3riqLQZplTYL1xgLWMpy6Cc9zgqN6Fon8ITGKtT\ng26SZ5qVmMoslYZ5B1hSkh9AuIR4DeLjYhAXGw0TAyayeUgl02qieOYkLDuUScJR2WnrmcG01EQO\nTNVKUJbijyxdqMMrQH2CTu7GaWIi+cULSwpRfc7BUCHQRI+XVRkhmVw0bqgbSN9bzOn8HF3EUpSl\nBWJX7hLvAC2Z6YVuHJWG5tr68k3QxWnYxaV8BbtLTFmkxRKpkr0EpKCnDH9hYMgqYyBKUwNdXgHm\nZBkrqKzUIqh1xMWqYc3PQ7o1byJbiomVLOZ9jgB0E3TME5idZeTzlc4xR\/qh2RqEY6sDbK9Gy3I\/\nS2WiQPbaQJPRcFyllPEnALURwu4\/+jUvL0EoY\/xNhc0vOuZGvgqkNxy6OXrcyUWBaLB8MrrdKBza\naRK6GjKFvU1Zwsv2ZcLzzXnC35rz\/ByvDdTpoipEoUGTPY5WcfayLERqxpvyeNuQ8QUjDg\/hmaZy\nE9oTSI87DmQ3sHCh72nBvDl758\/\/0Mz2ZT4+Pu+zos5m8fYbtRmRKGixUimtYxlzsQXzfM\/hQwwT\nzCe\/Qi6ZaNRhHEdb+vwqkDX3v9XqiHuLFy38RSD4oMbX90OT11\/3hULhuyn62MaclVYOYRl5HiYK\nHg4NCRpl2XtCz1k31l1icXioKyDA75TvR4J6hjIsWCAI8PX1nT0df5HfYfEe7QgEAp9Fi+bPCfb3\n\/1gUvMRMIZWKzCzzBqFwQcjcuXP93OfOjJkxM\/4v418GcdYVTik7SAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-02\/1296756391-7419.swf",
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

log.info("teleporter_button.js LOADED");

// generated ok 2012-09-17 10:01:14 by mygrant
