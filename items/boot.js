//#include include/takeable.js

var label = "Boot";
var version = "1351030831";
var name_single = "Boot";
var name_plural = "Boots";
var article = "a";
var description = "This sure looks like a boot, eh?";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 1;
var input_for = [];
var parent_classes = ["boot", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.inspect = { // defined by boot
	"name"				: "inspect",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Inspect the boot",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var imgRandom = Math.floor((Math.random()*10)+6); //random img between 4-15
		var random = Math.floor((Math.random()*10)+1); //random percentage

		///////////// GIVE ITEMS //////////////////
		if(random==1 || random==2 || random==3)   //30% chance of olive oil
		{
		    pc.createItemFromOffset('olive_oil', 1, {x:0, y:0},false,pc);
		    self_msgs.push("You found Olive Oil inside!");
		}
		else if(random==4 || random==5 || random==6)   //30% chance of honey
		{
		   pc.createItemFromOffset('honey', 1, {x:0, y:0},false,pc);
		   self_msgs.push("You found Honey inside!");
		} 
		else //40% chance of img
		{
		    var context = {'class_id':this.class_tsid, 'verb':''};
		    var val = pc.stats_add_xp(imgRandom, false, context);
		    if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		    }
		    self_msgs.push("You found some spare imagination inside!");
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'inspect', 'inspected', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		this.apiDelete(); //delete self

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
	return out;
}

var tags = [
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-31,"w":32,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKR0lEQVR42r2YaVNaaRbH8w2sed\/p\nJMYFV0BAZBdEEVABAVlkiQsucQFxwZWrRo3G3UQT05mYTDqd1barU3kxVTNjVacyL6amxo\/gR+Aj\nnDnn0Uu3ienpGDNU\/QtN8N7fPcv\/nIcLF77S6\/mdkG1xtI6bGbDuzw\/X7A+06Q+izVoIOmS6RLte\nyMVMMNRRAUZJZsZQZ0X4uwUv93wzFH2+ERBe+Jqvl1tB3eygNdXeqIBgvfRjIWCjQxJuqBGBUZ2L\nyuGO3nPBasiHZo8c6GHoOucLtu3O2L7ZwE32VUNnQAWt3rJTAQMOsTBYL9lxW4UMqkKdk+IBtfKr\nUFZymUkuuhxtDyiiXwRF6Rns1OsSXcbVWIsuRVAEx+uaS\/YJQCnYTUXAg\/FSSC6nAR3m4oOpuPng\nTGAPl\/yQjJpYSujCFA26aUej8gRg5IMoBhySQxL9XGssOAGnV2Sn4VwWIYx2VYJJm3u2CK4mHamN\nSSds3nDD9rwHukJqFq3fwpHa\/J+oQ5RJK8B3WVqeWjGDa\/aUQV9LOZi1eWBR5l06E+DyhEO4OuE4\nXE3Ww8qEAwba9eymkQ9STDoNzoswLosIHi81sofEB4ZEZwVUanLhelANtYYCqNYKuC+qv0SbMWMy\nZt7jotWAdsJq6rQongZoRYD1iXq4N+OGNXzI2QErg+u5poUGqwiqNYKdc+teBNxZGK4Fn01yAvCa\nuxSaG+QnwMha6EEoem+\/i8DjWz6gLHQ0qrA+peCrK4HaisK9c7UXt1GSgTdMDV83ngBs8chPrTtq\niB\/WwvDDSgC2ZxtgacyODyOHENahvbIodea6O+3175eJjH\/+2Kcb6arcv4VpHmgznEhvyPkrXH11\nMYO7N+OBZ2shuBE3w41+C75boCusgXpTMVjLBeEzgbzf7b\/0\/sc+2\/vdGPf3p93c20cd+7vbLYc\/\nYZr+shqExytB2MGCf3GnCZ7dvga9TdoTgHWVhQxuqL0C\/vqoE6JNOnBgqoc7jTDeU4UuoAGrPv\/w\nTHAUofe7ffC3p92wdz\/CAJ5gBB4tB+D+vA82plwwM1DDALtDWhjrqgKcqyzFPlsJVJfnMTiqu3cv\novBwwQeTfWYYwZJI9poggfO41asAsyZv9UyRe323OfXqbjOQeLAHC364O+uBjUkXzA\/XwfK4AzzW\nEqyhYqa1pJM1BHUmb8TUtVR3D+Y8+Hk7UPeTyPPqKgrPZit3Zxs4Arl\/08u0jbo97YYVsoahWpwm\nZlhAwIhXiTUkBLdZBI6qYuiPGMBpEaXhKHo\/4QPex2stjtpgPlGbBmQN1VAGJk2u7bMB15P13CJ2\nGUWItIS6NWqHuUQd3MC0buENKaUE1uwug1aPAppccgbbgmnjAan2nmL0yOdIPNwYjrOIT8HsqKY8\nf+9MZszFzKkRhJjorU5rYcQGbx62wztsGrohpSneqsdoqBlkwC5FEF0a8CZGex0njh+9khYKHvA6\nfp48kJoELYbS\/Pld\/G43Lnz3Orb3y+vYflqvYju\/YPPMD9ZFp\/osmOpqGO2uwnFlTEOi9aQBIz4l\nPJz3wiKWw9xgTbr2xvFvKLphZym4zMLzmyD\/eRMX7m42HWxNe4C0wblYLQ5fr2ReSIBDHcY0IE2J\nP2P90tQg0Wf5KPZiBlpxQaA6xAXhy436H0+6hU+WA6mFoTrgAdexa8k6+Ci2+1XwPXY8LaBKyRUG\nQXOXBySRQVMEe8Ja9E0dLhAlbIM5U5rfPmi59HDeY3u86OVm4pbUCEZqZbyeRY40i2kjMF5dQQ2z\nI36\/I4uZxgegh1jnnAyQfmeNgpCUYjd2eo0+\/4\/Zzb9+HtS92W7lXq6H99G3MFo12KV4VkD7WEjY\nsI5q8elNLJ2DbRVH71hLPSxdCni6HgIz3ozgAg4Z21Y8NWLoxpFGgLSipTsZAanBCNCiy\/s04HzC\nnfFiPRR+vhY6pI6biplZCgiIT+WHWhmrR8\/TM2shoya7oclCsASziUZOW8vWFJbA8fUocnz0eMVb\ny1kXU4qbvYbD6YnmX092eCQ8bMMuo+iQ6Imo0+hiNDOp8G9ivREMaXnMgUZbx25IcFQ\/iXYj\/p8D\n1tAnX94Ow+NFP9zmsAQwlXcQmKJGBk0wE8fjjYej36mJCK5GXwjj\/UEY7PZHT5zGFoZruGRvFU4N\nF\/dsM3zQgl0Vx5vz9kHnV7IFSh8eG9nsZMbcoICZuBV+3m6F73EW86KHo5vOYWoJcHPaxR6aYGLN\nOmYtPGC7X8lqz2WWwnDUB50tdsjN\/vbTZxE6PA91GNgBaHnCjqZMU8PCxlcEwaJhHSxgDd7G6Lza\nCGPU7Mx8ezClNGf5JqAupZlLljKHRk1Ro4y043XJyH3YtSRndQkEXOXQHakHZ50WJKJcyMr65vQ6\n3L3jv7Sz5Dvsw5oIO4+OjJ1BFTvUeHHbpZ8psvfmGmCLDky4cNIInMMmonQSIP0bRYxPKYngyGpo\npFEjUDp18hyQCDNBJhFAZbkUjCiFtAAK866cDkipXknaU314vqUCp6jQRmI14KZRXgAauQBUpXmg\nkudDlV4MCziTKX0kMmFKLa3w9PPacQQJjnY+ggtiyk2aPDz7ZoGsJBdKRDmglBeCTiVi0iiEIBML\noLgg8yAz808ZH6d2IyAkyK1Z9x5Zg1FTBApZPqjLisBSiS5vlEOtSQkOqwY8DgP4nEZcHJywhLo1\ngs0zfmTAZCEz\/dY0GM3aetxw9GU5UIbXq9BJoMpQCtV4PZKxXEKAKZW8aFUhE3z66w6JJDMDl4A9\nl1WCYAVgt2igJWCFgW4fcENNMBYPQX+XB+LX8RzcigedJhv4XZUQ9FRCMm7HzebofEHdPcxmsgoc\naB2VqlyQirIwWkWgwodVlmLUlKI9TClXbSzlKvUynUQiyfif5nxvvmUn2d8AfZ0NMBoPwsxY5CMN\n9vgYIK9k3MW2Z2qGyWPTJdtpxK3FpBFAmSQbNMpiLIsilj61vDilVYk+f5RtLsS42fHIqVCk6ZFW\njKT3BFxPxAndLRagIyedK2iFJz8lw6U6U5cVgkFbAvKSPAYnFQkOxeKcs321dme+L\/V7gMnBa+n0\nfhjBQba9lLFhb1DmglwqgFJpHhTmZ0IR6hhun0rozBvKeDx0sDzdBUsoPmJUdyN9wY8i91utcA3M\nMqjOSkuyscYKQVScDTnZ30J21kUoEFxBuNzVL97v\/PWGS3VmJYS96PQdLphEuKlEM0wMhGE41giJ\n6En1tjnBVacCS0UxgmF3luaDorQAigoyGRgp6+rF1NWrF23nsoBi8euGev3Ytbi1YOcGPSawW9Vg\nqpCdKrWiCOSyPLCaFGCtUmBaj+qMRGnNzvrmQFyQc75f5Ta6ceb2+GEWU0yw\/V1eJmqGlmNoElnM\nKKa+H1PstpUz2+DhMJ0prD3uwtd4oWnu8+ZJsKepyiAD9C1mtvwE4AHl0vw9vVr89b4ANxolGSaj\nbLWiXJIigN9TuVpMcPsaefEqdignFp\/jFz5\/5EU3xHTZ6OYnlWvDaOn+nyz\/BeMNC61aDmHfAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/boot-1350693452.swf",
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
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "inspect"
};

log.info("boot.js LOADED");

// generated ok 2012-10-23 15:20:31 by ryan
