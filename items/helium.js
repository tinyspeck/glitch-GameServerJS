//#include include/takeable.js

var label = "Helium";
var version = "1352322775";
var name_single = "Helium";
var name_plural = "Helium";
var article = "a";
var description = "One vial of premium colorless, odorless, tasteless helium. You know, the stuff that makes you sound funny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 30;
var input_for = [77,241,310,312,320];
var parent_classes = ["helium", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gasses"	// defined by takeable (overridden by helium)
};

var instancePropsDef = {};

var verbs = {};

verbs.inhale = { // defined by helium
	"name"				: "inhale",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Always tempting",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('mad_gasser')) return {state:null};
		if (pc.metabolics_get_energy() <= 3) {
			return {state: 'disabled', reason: "You don't have enough energy to do this."};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("True to form, inhaling helium makes you sound funny. And then you fall down.");
		var val = 3;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		var val = 15;
		self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		// effect does nothing in dry run: player/xp_give
		// effect does nothing in dry run: item/destroy
		for (var i in pc.location.activePlayers){
			var pcx = pc.location.activePlayers[i];
			if (pcx.tsid == pc.tsid) continue;
			var my_effects = [];
			var my_msgs = [];
			my_msgs.push("It was pretty funny. And then they fell down. That was funnier.");
			var val = 4;
			my_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
		}
		they_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: "4"
		});

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("True to form, inhaling helium makes you sound funny. And then you fall down.");
		var val = pc.metabolics_lose_energy(3);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_add_mood(15);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		var context = {'class_id':this.class_tsid, 'verb':'inhale'};
		var val = pc.stats_add_xp(5, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		this.apiDelete();
		for (var i in pc.location.activePlayers){
			var pcx = pc.location.activePlayers[i];
			if (pcx.tsid == pc.tsid) continue;
			var my_effects = [];
			var my_msgs = [];
			my_msgs.push("It was pretty funny. And then they fell down. That was funnier.");
			var val = pcx.metabolics_add_mood(4);
			if (val){
				my_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			}
			var pre_msg = this.buildVerbEveryoneMessage(pc, msg.count, 'inhale', 'inhaled', failed, my_msgs, my_effects);
			pcx.sendActivity(pre_msg, pc);
		}
		they_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: "4"
		});

		var pre_msg = this.buildVerbMessage(msg.count, 'inhale', 'inhaled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/290\/\" glitch=\"item|gassifier\">Gassifier<\/a>."]);
	return out;
}

var tags = [
	"gas",
	"gassesbubbles"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-33,"w":29,"h":33},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJSklEQVR42s3YyW8b5xUAcJ96zS23\nIn9AD0UvPTQoesqpQNMCbYEULoICWdrE4zi2K2dRQluNNsuyQyuULFqLRUnUQlK0uAw5XIbbDDkk\nZ8jhcB3uFPedNCXZltV8nWGhoEltOIkXeYAHkiAJ\/PDe9973zZw48YQXafzTSyHjW9fi9lOWFH7G\nUvINWmrMJUs7Nq48KEy\/eeK4rzT+\/it58jwo+T8FzcgwaIaHQZW5BArkx4C1vqc88SJcRd+FTDcx\nBr4uz4Hd1DVQCQhABH0H+HUnBceOM8Yar7Oh5W+AXIn7QC57wIndsKBs++fHCjTF6iCWjfW6yWvg\nID8DWtFRrtyfAcY1ASwMDUyxmuVYgViy\/SZb6UUqnf1suHwH8OHPd4A+VEzYEw0lmqj\/5tjLjARL\nYjySGs\/mCzqC8otYllVK9Pi5FwJ3BHSEEmO5fAHhgdFoVLGgsX\/4QgHxUGosn8\/bPRQljkQiMj1O\njr1QwHAitcKX2EPR4lQygVi99PUXBqgPlrZD8aQ0ndvR4h5K5AuEbukwclQfLv\/52HHcGPlARSaF\n2WJFG02kFA6CFPmZ4KoKI4c28eikYDP0k+Mb0qnWS\/pQSe8OsVfrzSbtICiRzekR4SR5M8qy2nmt\n8yONb+f88QEj1WmTNzJcKFccGa6DrU5SZMUJEcoFEwqpNDbv8DLqF67Zgj997ji+ARCmIE9mMtvN\nVjPiY8JSC+6ZQR1OkYkLN0Wt+gLhtdkt64cqMiV8\/tmLVgxEIDpZrVZ9xWoN57NncnhEBptThHCh\nt+PTDBOEcS+9OKu2CTbtkd8+N5yZrQv0TG6MGyv6eqNJhuIpOYrzOILDOUQ6Kx+4OBgIGqLhoH1J\ng36ybo\/M8Wv22ePSrVcM4YrSHEifbzbbTKvVjIdCQa2bJDecBCFHrA6xFnWIvD6f2mjHF7hSb6GE\nd3ZCoj296Yx+9BxKW5Ua6cxHhXLN0Gq3oqlsXsdnD+HWHfdGpEFtIrPDtYgTbvltnUmEYi6Jh\/LL\nxArLhQXEI1TTO798po1hjJSXffH8eLfbSTSbrTAVjK44CM+ize1eQlCHWGWycSjnktXplCq1BhGM\nYvMBmrYg3Pq8sqz+YMnkm3x25Y3WDEYmC1UbbWO32443m80IGwmjXpKUc00xo+Fwtw1WkcZkFSu4\n7Ck4oAI2T3OjZ50J+OwGGzY\/JlEPaOg89EwawxwpjzGZ8li302E5XCibz1sxDznHd62Wa4zbBg6I\noCIlh5NxOJkGEW1oDCLEYr\/FDfDNIO3DNIhp9qYaF27hyZefamOgsarUw7Bj1Vz8sFkt1KvFfMJH\nUxq7h7zJAzV9oJXDoX0cD9vQ6ERmi0VJuTHCZHevUBRl8lNu++SC7IKciD+92WiK1hT2WHkgGw\/G\nO5UdsNeugf12FXRKadAuJEBzhwWNbBTU0mFQTQVBOREAJdYPClEK5MNekAu6gY\/y2MwO55rf57Wp\ndEbxxKpWIHOzv34qN0XWeF0cDjHyXqME7vda4O6dJujVCz8ImA55K6jdtcojvW63eejG6lmJyfdk\ns5H\/M8rWDV42J6hmYnuMQQ7w9Wmw36mDO5VsH+jeugkIufixwHzIDfwUpeWRuItQcWtx7oJwCZLh\nsfeeqDFcmaYgHfHHdxtFAE8NAlIlAXutSh9YTQbBlT\/+Aiyc\/v1jgdmAExQSwRTqILg927UeIAnX\nl7dkg9e3rMIfdWvKN4Yt2YCD0ZiYL2faawHbE+f6iF3uMw+k9Wt9oOnm8PcCVuL++5jLI0MxQkp5\n3WaHzao+e2UemkM8Iz\/mIKqgcnVBPRvbe7DX4RAjQPfV5yAfJACLaUHMoQGyS+\/2gXEXAnyaZbA8\n8Bcu3gCSf74Bwtbt\/wPmGBdIskGXFXNLPR5CxVAeYmpJNvTx1MoAzJTe+UGN4cq0hZkYEzjgmqJT\nygDF8Kl+zJ36XR91FNf\/+irI0hi4fvJVMA+93gcKuff8b78LTPsx0CvEew7CK8UIzzpDud2LW9rL\nZy6Loety02UJHnj5ezWGJdGyRZIp4T631g73u4BSS4Bs6O+A5F6xVSGwLI4D1cTZPnD78hmwefHt\n\/jo8KjEyc6n\/3cOArVQAREKM2UV4FDRJ4Msq88TgV5Jzp4dFEDcbLz++tGxjhC52xlqldONw\/04f\nuDVyigsI3OXm316jAHq1HWBZGOsj+C7+34wehfDkrx4KzNI4qO\/E037Ka3K6XFu3tk0jojWtgAcO\nzm4IlN70ow8TfDdhqTacLJaEX9\/jcHfvgITLANYG\/wasS5OAz+gRcPXjk31IJUH3X2+8\/RpgjHIQ\nMGwCGtl46BrkgSnKDg4bGRAO0ajTTWxL1OjIgtIw8tmU5Pw\/\/jUFzend04+cjdZEcznaOIRijYMz\n3d4ezANLYRIYZoZANcGA\/WbpG2B\/vHzwh\/6gPsqacvQ0MNwYAjNvvQawtamHAgshog+s5diEn\/I4\neCCfxdkNzRAPfOvzq5CWKQ48\/EFQugvzwFz3wcVc6+54s7evuNvrVA92W+Bep\/YtIF\/ilMfcB\/KD\nmm+SIyjfxXwpvwssht3goMLtOjtsgmForcrsmJaozaO3ts2jC1vI6Beza5\/wwJtal+ARg7kxmWwe\nni\/u\/nt8\/+DQW+wezGQae+OlRlfarFc8vXqpcQQ82kmOtrqsz94vccqLfmsOlrioxum9IkvHwwGv\nbkWFfHHb7JzYRLBRqc4+uqK2jPaRSuPozLpm+PzkwgW1b2fykR1M7nSWuAx+yWcww8XdB4fM\/Qdf\n58rtvWVXvDxAJ7h7kWxWns2m4VQqCSfjLJxgI0gqEcOSsTDGRoNYLBSw4h7v4rre8alw3QhdkWqg\ny0saaHRRCV1dUZ8bmVecGZxagfit7uKs9BzXyWM8cFXvmNYFcmuP3Z+92e77kdKd5VR9\/8ti995M\nrXdf3ujdg1u79yzlzq7cHsoPwL4kpHJHISUWhmR2GpJafdCK0QstIi5oXoNBN1RWSKQwQ98FXhTL\noIs31qEj4GdTy2fXdPZrRn9yCwvnfvaDDgr8w0lXurVhjTcWbLGa0BIuC\/gTNeJLQ08CvLaGCOZh\nQiy1h2Ednb3GbalvPpX7kf6pmgtjrLbI3TyJjeGyWM8UlTCdhzV0Dtb4c7Dal4VVZBq+Tabg294U\nDDPFOBwoxLX\/jWX+v\/zznO\/75Os\/x7825LipRNQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/helium-1334269322.swf",
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
	"gas",
	"gassesbubbles"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"n"	: "inhale"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "inhale"
};

log.info("helium.js LOADED");

// generated ok 2012-11-07 13:12:55 by martlume
