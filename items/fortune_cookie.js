//#include include/takeable.js

var label = "Fortune Cookie";
var version = "1353460473";
var name_single = "Fortune Cookie";
var name_plural = "Fortune Cookies";
var article = "a";
var description = "Comes with or without a note inside. Add your own and give it to a friend!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["fortune_cookie", "takeable"];
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

verbs.break_it = { // defined by fortune_cookie
	"name"				: "break",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "There's a fortune inside!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.hasNote()) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var text = this.fortune_text;
		var author = this.fortune_author;
		var fortune = this.replaceWith('fortune');
		fortune.setText(text, author);

		self_msgs.push("The fortune appears in your pack.");

		var pre_msg = this.buildVerbMessage(msg.count, 'break', 'broke', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.add_note = { // defined by fortune_cookie
	"name"				: "add a note",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Or, drag note to cookie",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Place {$stack_name} in the {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'note' && stack.contents ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.hasNote()) return {state:null};

		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'note' && it.contents){
				return {state:'enabled'};
			}
		}
		return {state:'disabled', reason: "You don't have any written notes!"};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: true,
	"valid_items"		: function(pc){

		var possibles = [];
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'note' && it.contents){
				possibles.push(it.tsid);
			}
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			pc.sendActivity("You don't have any written notes!");
			return {
				'ok' : 0,
				'txt' : "You don't have any written notes!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (msg.target_item_class || msg.target_itemstack_tsid){
			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
			}
			else{
				var stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count);
			}

			this.fortune_text = stack.contents;
			this.fortune_author = stack.last_editor ? stack.last_editor : pc.tsid;
			stack.apiDelete();

			this.broadcastState();
		}
		else{
			failed = 1;
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'add a note to', 'added a note to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function buildState(){ // defined by fortune_cookie
	if (this.isOnGround()){
		if (this.hasNote()){
			return 'withnote';
		}
		else{
			return '1';
		}
	}
	else{
		if (this.hasNote()){
			return 'withnote_iconic';
		}
		else{
			return 'iconic';
		}
	}
}

function getLabel(){ // defined by fortune_cookie
	if (this.hasNote()) return 'Cookie with Fortune';

	return 'Empty Fortune Cookie';
}

function hasNote(){ // defined by fortune_cookie
	return this.fortune_text ? true : false;
}

function onGive(pc, msg){ // defined by fortune_cookie
	if ((!this.feats_tracker || !this.feats_tracker[pc.tsid]) && (!this.feats_tracker || !this.feats_tracker[msg.object_pc_tsid])){
		if (pc.feats_increment('tottlys_toys', 1)){
			if (!this.feats_tracker) this.feats_tracker = {};
			this.feats_tracker[pc.tsid] = time();
			this.feats_tracker[msg.object_pc_tsid] = time();
		}
	}
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"cookie",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-18,"w":20,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJA0lEQVR42u2Y6VcUZxbG\/Q\/8E\/yY\nzGQSRSJuQI8mnhgVEAWRRRCERhZhECMgGkJUJM4wChoio4hsShoEVEjYm6WhaRYbBBFQ0soiikqP\nk5nPd+7zVldZIO0yGfPJPuceoKGrfu99nrsUixa9f71\/LfyaHdMuftYfE8uR8rRvn36heNK3L+9p\nf0zQ7FDUkt8PjG8mAPpj6GF3FPVXBVL\/jUAa\/CmIRhu01H8tgAZv7KI7\/PO9hhAaa9pDE+3hNN6m\ntUy0a98dsC1jnK0Y60RnBA3Xh5Cp1Je6y3zpZrk\/DdXsoUnjX2ioOpCGfw6iscZQut8STr8wpKUx\nhB7o+feGCJoy7KWpjnB61BVpQYanTRFBvxnOemufhi9medgdSZ0MZbi8gzp\/3Em9Ff40XBdGg5zF\n21US2GjtbhqrD2aYSHrcHUcTzaE02RpKDw1aenYznh4ZI+hRu1bENL\/3yMjAbaGW6dYwzf+UNc7U\nqVssV4duJzUXeitwyNyzgcP0n3vHyNISQSM1LGldMD3tS6Dx5jCabGGotjAB8pgz9sRoP5527qUZ\nZNWgPTXbo138RnBNhZ5LWwp3WJryvQihL\/CituIdZLTBmSv9aaQulMb04UrW7rPfHnZEimwBbMYG\ngJs\/tmVNhOFFPGgKpuFqX\/E3MxKs\/rWQTQXemqZL260Aq8vdKgBbi7ypo8SHmvPdqO4fG6jp4pfU\ncXkr9VX4CJ8Jj7GUkE0GQ+ZkKZFNxFTry9FT6km1Oevpl7pAcZCZdq3ZLqQ+f3uQnLWy0+up+txm\namFp26\/4MNRmqjqroRtnXF+K2nPrRTYUuQBmgwL4BEsOP44376FxvS34e7yHwOdxndaCTTTJ79+t\nDUhZUFYZrua8OxWkraLGvG1CWviu56qfaCMoCHP5DjIUb6PLJzV07sgKKji+in7+YT0urGRsUoZi\nmAcsPyyAilbH\/aYQ8X6NDVCO61kuc4smM+FTj\/qLntb5gC2QlrPXxdVr5qq926gl6+0jojisg8k0\nzZ4brQmga2fWUW6qE106upJ6dJ5802ABJkPBBvAp4h6iTvqKn9sKNqvAXK3XMl085sDlJDguLjix\nToGToyr7SwbdQp1cwb227E11xgk4Of49+q2QFX4buOZDVd9LoFdOrqWOYjd+z1eA3K3bLYoJMVIj\nRV+5D\/v5cwWu4rRzRX2O48vey0x0SinL3EjzAeG9ugtuSvYwIcYaw7i\/7ad\/cvae3z7McUh4DrLC\n8Pcbg6mrZCsVp6+hzITlivQtlzZRe7E7tRe5k4GjMXejgCrNWEsXUp0sZ5Mc7TfszCQn6\/XsLS8B\nonKNKu9hSiADkAzSohBQrfgKz6EQUM34\/WhNIOnzNhPfmE595SB8CvnlQJazEpdb\/ha\/7NWTpCDN\nRXM60YnmA6LvdZX507+GU8nSGk0DnL2R2mD6dSRVkXf2ZpyQdtpWEOM2OPjqrpAyiG5d8yNdxjrK\nOOCgBEO9HkwFeOrMoZU0X+JmW2sR8nJTHqzaRQ\/aoub4z9oXTzOmKJpu3yuqFQWBYoDfAHfnJ2kE\nDlzfRa2F2+j7Q04pGfsdlr7VOCs84aI\/m7yKLh7TzAE0lvrRaFOkmBqyvNNd++cWR1e0+Pqkd7+S\nPRQEbIBtRobD5+Fhtor55lWftwf84chqgsx1uR4K4PNhScq7TRF063qAyMZYA0ZZFD02RdNTU6To\n+or35mUPB4ItVHDisJ06X6up5C0gC0+4ppxPXSsAy05voIZcyYuzt78WgHdqQxnQtt9hS2mVKnZO\ncdjkHbNlD1sNsofPwR695X7CKmhXGJewDi8db+bBwnTX2Pw0FwGYxV6sydnI08NTTA8TXxC7HjKB\nm052SB6c7T8oAdpaC0aWXByyvPCsOnsmna+AwzaEa7eK8M7r0Xm\/ejEoOrZmCWeRZJkL0zXUcGGT\nuJAArHgB+OuoJPvzocNzATHKmnnf60+iKWMsDbEdBm3y4oCStDtF5gCHAkSXQBszFHubXys5fHjp\nuJRFhC7jz1R\/\/gtqyXenzhIvBRCjDYDPzPH0rCdGFAgqGIBTHdE0O5DM+2DiKwGROcDpMQiKpP2S\nM2s1lfkGvUJm56XqLELq62c\/E5CGIk8FcKyB5yv7Dd5DBUuwBxSJRQXX7BYFJUsMBXrK\/IQakFjI\ny2CAw\/eAxiICj\/I4zRurtyM5igVezEpaqUBWZ3\/Ocm\/kTG6RAOulBQBFgioWrYZbjFQkcz0oFckL\nD4oiYZAOqUBEAM5YslP4E4fAYfoq\/c1D1X5L7DRtV\/PFo86K1Oe+Xs1r0AaRydtVAWIDwShD5YoF\nYX4VN0gTBIeR20xf5YssypWM8YkAMOBgAVQ6Kh6HGrwRaB2uDvRYsGAY0iq3HTVkW6E7deu2U2+Z\nl8iiWNFVY+6RKVZIjl45opIZN+SsCC\/KvRCgcgBcwPEhYIkunZe4F5LC4bHgbIYfF4K0fYiXVW\/l\nmUOu5IfGKJrpjVfmsJxFFIsEKckNGKxuIsolWXvLfcl4ZZt4jMD1ca\/KrPWUf9zFunDrSXMNAiTk\nzrRBpsc5Uvbh1eICWJUesOfUMk+qNpl7qoYtIDmT8sgDaF+lBGX6kau4aKvwOa6LpKRGOVBi6MdK\ncuz3Rxtk3jFnwjKR8dUKign4g7hAdbaUzY5iD34i86cphkMW1QsD\/KpAstz9gLrqIyRsubRFgUJc\n\/k5DB0M+pvAdH1DEzg\/oZPynAo7XwFdPGxlSlhzZjN\/9EcUFfiR+lm+gjlaueAN7qK3QjVd5N34I\nkkINJEdl1mfiwACT45uoZW8Gp\/YkCgeQaEPwY2r0MnFSnNoeqL0o\/fs68RkcUg2GOBjyJzqdsMKc\nleD0lhsPN3K0IDmbMug3kcv4Rn8UkRbrKG4MueYH3v\/rgRWKjAvFkfClVjx6\/Kb\/0WCxkLOplh77\nJGQ5HrtcSJQc\/omAjvb70C6QHPB1svaTPDy4\/V\/+yyV65QmXvPmgmOU5KWuUSaQOgCNQnXIhQE6A\nnU12eDf\/O9SlOy62ZdSsBp0faFW5365Vg1vYZ6feGZg9WBRTfrqLB2a6FC56OfDck3fUOSU7abVm\n0fvX7\/z6Lzo083OT+631AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/fortune_cookie-1314818574.swf",
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
	"cookie",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "add_note",
	"e"	: "break_it",
	"g"	: "give"
};

log.info("fortune_cookie.js LOADED");

// generated ok 2012-11-20 17:14:33 by mygrant
