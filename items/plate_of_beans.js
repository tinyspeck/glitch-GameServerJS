//#include include/takeable.js

var label = "Plate of Beans";
var version = "1337965215";
var name_single = "Plate of Beans";
var name_plural = "Plates of Beans";
var article = "a";
var description = "Just a plate of beans, as you can see.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["plate_of_beans", "takeable"];
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

verbs.overthink = { // defined by plate_of_beans
	"name"				: "overthink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Overthink this plate of beans?",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		pc.prompts_add({
			is_modal: true,
			txt		: 'Are you sure you want to overthink this plate of beans?',
			icon_buttons	: false,
			choices		: [
				{ value : 'ok', label : 'Yes!' },
				{ value : 'cancel', label : 'Cancel' }
			],
			callback	: 'prompts_itemstack_modal_callback',
			itemstack_tsid: this.tsid,
			dialog_item_class: 'plate_of_beans'
		});

		return true;
	}
};

function modal_callback(pc, value, details){ // defined by plate_of_beans
	if(value == 'ok') {
		if (!pc['!think_count']) pc['!think_count'] = 0;
		var seconds = Math.pow(2, pc['!think_count']);
		pc['!think_count']++;

		var reallys = [];
		for (var i=0;i<pc['!think_count'];i++) {
			reallys.push('really');
		}
		
		var text = 'You\'re '+reallys.join(', ')+' sure you want to overthink this?'

		pc.prompts_add_delayed({
			is_modal: true,
			txt		: text,
			icon_buttons	: false,
			choices		: [
				{ value : 'ok', label : 'Yes!' },
				{ value : 'cancel', label : 'No' }
			],
			callback	: 'prompts_itemstack_modal_callback',
			itemstack_tsid: this.tsid,
			dialog_item_class: 'plate_of_beans'
		}, seconds || 1);	

	} else {
		pc['!think_count'] = null;
		delete pc['!think_count'];
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-17,"w":42,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGRklEQVR42u2YCVNTVxTH+QZ8BD5B\nmzpdtLQjOLW1dTp27LjU2hEF2qqtprYooxhCWEMIBCKQAAlhiYKIIkIICcsTRGQPQpDdiCgqis99\nd\/69586QIosFFKcz5c6ceTPv3nfO757lLs\/DY7EttsW22P77ra2tTXLz5k0fkmvXrr0iw8PDXJRK\npec7gXn8+LGXKIp+Y2NjAgNyMMHo6Chu3LiB69evg0FhZGQEV69eBQPD5cuXMTQ0hEuXLsHlcomD\ng4MCE\/nFixclbw3qwYMHkvv378vv3LkjMsGtW7fcMARCEARz5coVLvSOIKmfxk0cS6ADAwPo7+9H\nb2+vq6enR8qAPeftLQYnMDgORUbYzLkBEqaYvMKNToQchyOvknfJy8zjuH37Npj3uVAfjWeQYJDo\n7u6WX7hwwWvWcI8ePZIyOO4xgmEfc0WkkGb\/JoB3797FvXv3wPSDJk\/j+\/r64HQ6xX+FBODJ4ISH\nDx9yg11dXVwWCpDsMHsclPR2dnaKTKbPz6dPn0rYYJEUMZejo6ODZvVOAJ88ecKfpOf8+fMis+0z\n2XNeLOdEUsAGcHnXgMxBeP78Odfd3t7+arhZp4M+Zh1wOByzBiyrLkJSYQiyqpXod\/W8FUB6km22\nvgocjr2U00sCYS\/nBLgp8hNs1X2IVGEvwot\/wpEz8Ygp8ce+wtXQWoLnBfjixQseDeLgRfHs2TOR\n1qrW1tYZAauai9HccdYN2NXbgZxKNTZGLsHm+CWIsmyBqvxnKE5twq4jyxFU8DVkuVvmDUhjOCCD\n86MOMjwdIIU8ungbEqt2IqRoDVo669HW1QClhd7twJ78L+CnXoYf4z9AoPFjt\/hrvdHcWccB7Y1F\nbDIJyKtNxMjo8KwAX758yVnc4aWqnQ5QOGdF0OFvoK4IRFjpOuw9\/iXi7AHIb1YhteZPBOWvwhbV\nUkQYdkNXGIW0kzEw25LR2dfKc7C+7TTWx7yHHTneiGMe1tr\/QNtgLY43JSPkxFrEWgNQ310+BZAV\n7OwAKcRB+nX469hKDhdSvAaxtq1c5CXfQ2pegZAMP3cVm8\/E4mDBevyq+xxRpt0osORgQ+z73NMZ\ntQcRU7aV5+cO86eQF29A8LFvcbg6aQogpYUbkDqpCGYCpKc0aS0CD3nj9yxfLnsOr4Shbj+H1th+\nQ73TDl3VPp4KBE9A2zSfoq65CtvjV8M\/\/SMOJc3z5bI9dykXP80yDI0MTAGknYV4PMZEkQPS0vC6\nIqEJlAnHkZIfidSjUdhvXsfDrrKzij2xCtHWzQi3bITVaeKA5Fn\/JG80OGohNNjwi2o1flBLeMWP\nS6BmBTr6mqfkIG2vxFFbWwsPu71SSp2UsAQ222UmtyQFu7J9uQdJKD8JkOdp4Vc8xKGZ\/u4qpvBb\nhWKcqixAafUxVNSX8GKZXCT0pHQjDoPB6PIwm81elD80iJaCuSzUWUVaBGj\/CTvJTsNylgqfIUDt\nyyt+rlsd2SD7NpsNwQcOSPlCbbGUC9RJg+lYNZetztHVhDx7KjJL4pBZqoaJieFkHJy97XPaSSis\npJ8c1NjYiDCFwuHe5nJzcyXC6Ro+mD4iZWScnSoWfC+mJ31DdghOEAQGFy4Gy2SvnmhM2bnyM3Vn\n+bGHPiIl5E0CWQjA8cMv6aVIUcQqKiqgCI9ASEjod9Met4ymLNOpklIMMWOkhNxOSmkbJGVU+m8C\nSHqon\/QQGHmNotTS0gKjMROyULkok8l8XntgNWRmSw1GE87Wn+OzJUBSTt4kQ2ScYAhsHI4uRfRu\n8t2EZHzs+OQoCgRHUaFwpqVnIDIqGqHyMIdsclhnhDQYvNIzjA5TVg4aGpu4NwhwptsbgRDYhNsb\n9zh5eMIFafzugZqaWmRn5\/BwhoUpHKFhYfLg4HlcS9MyjBp9ukE0ZmahzFqOpqZmDjKL66UbkOCc\nTvLWaZwoOokETRIiIqMJzqVQKHze+MqZlpbmqUvL0Oj0eleqTo+UVB0yTVnIyz+KispK2Fli2+x2\nlJfbYC0vR1mZFRZLGUpKLaCJ6fTpiFGqEB0Ti6hoJSKiYkyK6GifBbm06\/V6SUqKXpqcnCJoDyWL\nTJCkPYTEJC33TIImEep4DeLUCVDFxUMZqxaUsaoipVIlVSqVksV\/MIttsf0f298wKZpeNEDqkwAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/plate_of_beans-1334259470.swf",
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
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"o"	: "overthink"
};

log.info("plate_of_beans.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
