//#include include/takeable.js

var label = "White Gas";
var version = "1352322910";
var name_single = "White Gas";
var name_plural = "White Gas";
var article = "a";
var description = "A vial of pristine white gas.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 50;
var input_for = [73,192,195,243,311];
var parent_classes = ["white_gas", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gasses"	// defined by takeable (overridden by white_gas)
};

var instancePropsDef = {};

var verbs = {};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
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

verbs.smash = { // defined by white_gas
	"name"				: "smash",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Smashing seems unnecessary",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('mad_gasser')) return {state:null};
		if (pc.metabolics_get_energy() <= 2) {
			return {state: 'disabled', reason: "You don't have enough energy to do this."};
		} else if (pc.metabolics_get_mood() <= 2) {
			return {state: 'disabled', reason: "You are too depressed to do this."};
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

		self_msgs.push("Oh, dear. You probably shouldn't have smashed that. White gas can be extremely useful. Live and learn, right?");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		// effect does nothing in dry run: player/xp_give
		// effect does nothing in dry run: item/destroy

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

		self_msgs.push("Oh, dear. You probably shouldn't have smashed that. White gas can be extremely useful. Live and learn, right?");
		var val = pc.metabolics_lose_energy(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_mood(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		var context = {'class_id':this.class_tsid, 'verb':'smash'};
		var val = pc.stats_add_xp(5, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'smash', 'smashed', failed, self_msgs, self_effects, they_effects);
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
	"sort_on"			: 53,
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJUklEQVR42s2Z6XMT9xnH+Qcy+Qsy\n+RPal53OdPoXdPqq75rJm7YzPabNdNJpDqcMJKQQCCYQbGIMtjEYjJ3YMdgG3wb5wLYsJEs\/7b2r\n1Up734cODOrzyHUmL8qEhhCj0aNdrcbjj7\/f51r50KHnfGzN\/ubV\/OzvOpl7f1nkV95arG53LBq5\nI4sudWKsqXS9eeigH8LKn18vb73dqmbeb9nkWMsuHGvpuSMtZevdFr30p7FDL8Ojsv1P0WePt56o\nva2I72xp2cMtsvCHVmb6t4cPHG6Wsn5N5we\/AQSL24CgXms1dWFxgXZ\/cqCAc5TZoiQq9LnOVrPc\n3XKK\/wa7P2jl1k62FnMPW3OUsXiggCnOfZNWPa5qeUlBDVoYmbLXms4I8TJjLS6w5i8P3Oa5nDSZ\nJZRc1QyH4UW9XFWdmxNTxXnaPPxSFAkCZvKkhICE5lReKpkvHeCDTFaoACDFiZpmWt7Xd+bplwpw\nh6LLbQUZXtMBcGYpxb80gPPbbLqi6Y5qWC4rSLpmWP7U\/BI7S5mdBw63lOF+v7iVL3l+EIHFLuaf\nahj+2PQMPb6S42d559WDazGp1CsLDzmG5sRKnNTqpXLVwrAcN0w9SMvXxqfou\/nK6MGpl5fOF1hR\nSWq1uuv7oVLVHLlSxXABMhq9fYcenr4vH0gvXM8yP0vluKrrBUEE8hmW7amG6aLNVc10Pd9Pbs0s\ncFeGx4q3N5n8jw54P19KM2JJrjca9TCKa6bteDoUh2aYvmE7IeRkUipXvJHxKWZgZIK9m1M6frzc\nK8j\/2Nhh+DhJkkaj2fCDMDJtN9gPCwBV3Qgc10u2swX1yvBXxeG5dWZecF5\/4XDLO5XXVoolpsgK\nPMI1ms06VrDj+SFEZLtehPkHika6ZYcAGY\/cmmK6+6+SiQ1m+oUD3qOq19KEoWzXdR7t7jbrjWY9\nDKPIC8IYlIxdsBYSMEEw07JjPF9cWZMvD41Sl0enJFzPXhjcBlf5+QYlVwRZkZuPHjUbzUd1LBC0\nGvIQoxZEUQ0cr4GqNbQYz4ssbw59eYs5f2mQDN1dS7+w3rjGqJkdmiPAEmNx1OtQIHEcIxj2QXjW\nk6TWwLYDYrYDrjXhbXNlI61eunqT\/uziIHUnq5z64a2ljfd2OJkXQEDIuwYAIkgtQvmAAJ54bS8p\nwff99\/B5A20G++s7Bco680V\/sWfktvyDbtpg7WubvMrQgkTAQh+sBbxmHcRLYqQDFoQB2x9B7OIT\nLmA0\/SCoIyAUTxLFcSO1kdZOnOsmN5cfTv6AgPoEIymUqFS4WqNRw8LA4556dbS6jbe7+3j38eMn\nj3fhBGmBvYk2Qy7WADD2PB8mTlDv7rvKnLrQx05ssm88f0NmzF\/tSLoM1pKqbipYGICCuRZ\/A9j4\nL+BjBHz8BF9QTcy\/fUBoPTEeoWgaD7Yz+kenz5G+iXnmuQrGNM1X1jkzJ1U0omgGD33OAPuaoB5W\nbISAaHFtz2CUEJ67aPEuXHgEnzUx97CaoXnHYRg2AgjdNOOzF\/voI590kpv3st3fvykzVodQNdlS\nVS\/ChFCAoQbCNLCz7AHGoGJc23cZIREM8w\/txZyDUV2zHTeBWY29cf9YW15dV4+ePENOXxqSvtcy\ngWMpV7bVimERzbRFUMtr7BVnEkNHgQ0hBLsQNMFeiFbjh6gmnOMfUUf1sEBgqsRV3YgUVQvKlWpY\nUpTAMK2ku3+Q6zh2kvSMzsz\/\/z2Pt6YrlktVDZvWLQeXAsy3MEpqIYBg\/kVgV4SQUNntJo2gYZy0\n+x\/A1RAOcw9gooqqhZKsBLJS8XlJbkeR4dzDx0+TD453UpMPpWdfJnAcibonabZLTC8QddstgXt1\n+P0BTjS0GEabDxABtJEIR5wftgP7XYKbDNppt+HsSNWMEJQL+JLswwLksbwIcKwnK0rUf31EfOfo\ncXKieyD3TMsEVtW27Ii2HxLD9WjLCyTdciVQDYvCBzAHRYP9wHO8wIe2EUCEoFbk4tIA7QTmdIwL\nAypXRbiqGoB6oFrJK3KCC4BegWJciuW9+eWUdvj4p8W\/dxwlV+6sXftOwFXB+UT3IhYBIUTT9SXT\n8WW01Q8j1\/YC2Px84Ahcx\/M82KQD6HF7Aas+rvu4D8KNUwh5FyhV1S+VFb8E1rKC6BaKtEOxnJOH\nY2anYC\/cX9VPfd7DIuC7H59mry9lf\/FUOBw\/hapv+FGNuGHEtAEdX4S8cqBWQakQ7jc8DBuAHIAB\n4QKE8qA6fQy45WwvraCcX27DVTyxVHZRTUKzTg7GHcDZWVK0tx5m7cHhr6SzPX38+x+doP76zr\/I\nmcGxjaf2xnXJnY7qTeJFSRESTXCCUDBsT4TCcCF8UE+HdmNCVVoQCNlWEPLMNWwbwXDt9xRV9+SK\n6oFqriDJeCvqYCUDoJ3JFcxsoWhtZrLW4MiY2HX5Cn8OAE+e7eIQ8I9vv0dupZ9SMEUtNBAwSOqs\nHyaC7QeC4XgC5JYKxembtqdjwIsJYYF8HioIlnrwJqiourN\/4ySVFQfgHMg3m2I4G+BBQcZOrW2p\na5tpbWxqRu65MsR3I2BvP9\/Z3ct3fHySRsBTfSNf\/u9VXrBvAiAVJnUBxoIHCsoIqJkOQsKpb4KN\nGsDpqmkZpuM6WMF43wQrvlOuqDZYasO+aHNiyWZ40YJWgpaaMwv35XMXB8hnPf1k4MYod3lomO9F\nwL6r\/PneAf4MAH4CKr7V8SE9ulLoeWoF01q4bAWxvK8gjLWgAWMVXKwomi4J5YpYrmoKzGUd8kwH\nBQOo7AiauQuVagol2QQ4k+ZFk9CcCXBGan2r8sXA9SICft57pfhp10WCsxhH3Yenzha7Lu0Bft53\nrTS+Ru5853zOlNy3RCPIq7YvW54vo8WoIMDYAKLuUCyVzhXIWvohubeeJkurD4qpjW1meWWDWVxZ\n5+CmXVpe3RDn7q2Ik7NLQt\/10WLX5asEAU93XSK4bu0DQhQBXhxbXN+ZyTA\/ffZmDX8Ffjm5KVp3\ns6JB5YSqlOdKLG7UmQJNvg0IUGRmeYVMzS2Tibvz5KvJGXJjfJIMjo6T\/utfkt6rw+TbgGd6B9kL\nNybkgdtLxtep3NAyZz3\/fwNwoOO3VRizlNG3TJTJhbw8uZDl+fltxphN08bdzaIx9YAYk+t5Y2I1\nZ4zfzxiTaT66vcVFtzbZCO\/q8GfnKONvz7og\/AdWlWTb5Wup0QAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/white_gas-1334274425.swf",
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
	"h"	: "smash"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "smash"
};

log.info("white_gas.js LOADED");

// generated ok 2012-11-07 13:15:10 by martlume
