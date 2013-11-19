//#include include/takeable.js

var label = "Essence of Gandlevery";
var version = "1348002530";
var name_single = "Essence of Gandlevery";
var name_plural = "Essences of Gandlevery";
var article = "an";
var description = "A potent distillation of Gandlevery, as rich in protein and good for energy as it is foul on the tongue and bad for mood.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 181;
var input_for = [236,242,245,248,249,308,309,313];
var parent_classes = ["essence_of_gandlevery", "tincture_base", "takeable"];
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

verbs.imbibe = { // defined by essence_of_gandlevery
	"name"				: "imbibe",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drink to receive a sustained boost of energy, at the cost of some mood",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "You are too dead for that now."};
		}
		if (pc.buffs_has('gandlevery_charge')) return {state: 'disabled', reason: 'You are already under the effects of '+this.name_single+'.'};

		return {state:'enabled'}
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity("You feel totally pumped and ready for anything, but you've also got a major case of Gandlevery stomach.");
		pc.buffs_apply('gandlevery_charge');
		this.apiDelete();
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Imbibing this will give you the Gandlevery Charge buff (gain energy and lose a bit of mood)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	if (pc && !pc.skills_has("tincturing_1")) out.push([2, "You need to learn <a href=\"\/skills\/132\/\" glitch=\"skill|tincturing_1\">Tincturing<\/a> to use a <a href=\"\/items\/980\/\" glitch=\"item|tincturing_kit\">Tincturing Kit<\/a>."]);
	return out;
}

var tags = [
	"tincture",
	"tinctures_potions",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-39,"w":17,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHd0lEQVR42sXY6VNT9xoHcP+Dvrqv\nfdd25t5WsVi0HQq1HaSKgiBcXEbk0oIgyqaETQJlUxZRkLATkCUUQQmCaCAJIQvZDwkkhvUQIosI\nAtpOtdr53l+Oo9PO9HpnOnPCmXmGA7z5zLP8znPOtm1\/82opDtzediUkTFAUwm0uOMptLQzmC64E\nS99GY14Qn5d5OGzbVl1thcEQFIagOisA9TmB4OcFoYrcO\/\/2x+BlHEL4ETcvlwNbi49SJNBWFIyG\nnCNozA1Ew49HUMM9zPy8luoHTuTXCNn\/T3RcDv7A9cCiYH7Bxe9QmxeA5qIg8DL9UJS0H1cSfcCN\n2Ye07z2RcHIPwgPcsCUldvZefW4QGkgkR32DS7E+qEj3QyFBFhN43rlvkHRqLynvrvUtATbkBMWR\n4cDV1EO4nu6PiswAtF4ORnnaQSaTGdH7EB3iDj\/vj6RbArzTWhjn7Dsn6u1AOO\/LUg6gIMEHyeFf\nMsDj\/p9T1QN61\/XggF7\/gWVmRjphNYB7xhtXk33JYPijLjuA3H\/HZO9teU\/770ROaS5umcx0lUSy\nwyVAkVbrtbqxgc1nG7ieH4+zoZ8zIGekR3rhQtheJnPO6Y04dQBClRz3ZmlUiqVclwDFRuP2+aWl\n9Ve\/\/46Xr19jdp6GXC3DoFKKe7JBdA+J0Cm5D8HAPSgdCzCvrKJvYhIkg\/4uK\/PYxMSOx+sb1ItX\nr7D+4gUWnj8HvbGJibWnMD9ZhX75MVQLixiefwSl3UH\/RFFb80SZdDwy\/vLbb1j++WfYN58xQNPK\nE2iXliGfd0A2PbM1Z+Dba3Vz87Wz1M9fvoTj2XNMPl1ngCOLS5DYHVDP2bcO2KtQeIJcTuCz\/wF0\n9uBPBqq0Q+\/CY6ZPadw+Rs\/xVwjoKem99wF7bRMQzc45Y71JqWZ\/SO5rNDtI363\/+usv2LSbsKzt\nxLpVgo0FMxanhjFtH4fVLAIlb4X6Vh5MvJMw10WCMivRP0OjQaFgd1gGNBqunRLjmUWENYMQy\/Kb\neKxqxoqmEUuqWjikJaDvcjHdGgN9vi\/MxQcxXnYUs4IUWLsK0CwRSVkHjtXFYq4yFItdHKxIK7Cm\nbcNCfx7sd9Mx183BbFcSptrOYrIxAtbKY7CUBmD8ih9MFz7B7a469oFmQQ7steGYLtoPuvYE7CRb\n9tsczHVehDplL+irB2CrOg5b7SlYinwxzv0CllQ3zNREoVWlckEGK6Kwou+FvSsPdBsHDkEiZngh\nmCVZpQnMUhyAiWuB5PeToFuSMH0zCWO15yG9sBd85Qi7x45IreZb6+PxWN8Ne18FqOITUKV6YbTk\n2LugSBiKQ6HN84c0cTfEce5Q5BzE4Hk3NMtl7AIfqNVSa3UkNh6JsWgTYlLGg6ntIgz8WOjqY6Cp\niyYRA+3NBIz2FmD8fjEcD4Wg5dUMUCBsZh840RjLAJem7mLW3AGbvhlmVT2o4SroydAYZJXkmKmB\nRdOEKaqdAS6YOjAY7+4aIN3NZYBTNxPxsDISVl7E\/wU+oQcweO5T9oHKUZN0TvgGONuTh2l5Faz9\nRTD35DNAAznvDKLSvwQudXDQ3tMCVhfX0YlJqb0n+12JLbwfMH7jPzDlBjBA49UTMGQfgvF2DgO0\n9pfA0pKCBX0bZBxPBsiTSLxYBa6oaxmgnZRyWtvE9OBoSzKM7WnQV0dDl+VHMpnOAHVZ\/pgzCkAV\nnYKuJATtd1vZB65RLQxwkoBsdwtgFZcxPWgoOQnd9fA\/9SBVGQ2q7HsYCZCqCGMfaLDa6LXRlncl\nNpWRx5miBlTHJejygjByxv1PQHXmYUwN3sAjUmKKdxq3O3nsAof72\/FHoPOYsQyWQVdOsjRwDRpe\nFBSRu6BrS3tT4pLTJMuFzJA4gcKmXNxg892EkvXgxarqveegpoWDoQg3KMgLvOzsl6CqYhnglDAb\nwsZcdt\/u3gc0iK5BFu8FyYmPIEvxhSxhH+75\/gPGyjfAyW4nMIddoHGoh6xV+X8JdGZOGvcVdA9K\noe3MZkp8\/98fQhS2E\/RwNRSXviXAH9kF6mS99GhRKB5WnYFD0YhZFR82sqw6gepmDlRNF6EV5kNV\nF4+xgVIosw5BHPkppAkeUOcHQinpYndI9Fbbnfk+HuZ7yzFeTia46ixGrxyFPtuXHNA+MGT5QE9C\nx\/0Wmkv7oEr3hjzFE7Jk0ou8aPTJxbghFm9nc92Km5e1Y3FYADtBPqw+i5E0bzzpuwxNqid0GV9D\nm+ENNYENxX+G4UR3yC54kLVrDzkjI3BTpaFZ\/+xh1UqwKGsD3XMdaoIS\/fAhtMm7oby4h+yGnlCm\nfAUV5wvI4z7BQvVxqDkeEMfvxlBjJmrEQ3zW3+zM0zO0pS4BlppzMBaGQpHoAQXJkhOoICEnoebs\ngTT6Y1hyvMj\/d5FdcBe67rWTRUHO\/hcu56unWSOmbYJs2JozYCg8Bg3XF\/IkD3LMkEyRvU9KYjDm\nX3gQ9TFZs3ain5e03qQYce33GZNpJMymFEptslv0KJ8DQ20itFXnoSo\/g2HyBBnKD1kf4mdI++9U\ncwdmnv7tLwv\/BR0Y3ZZo0BxGAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/essence_of_gandlevery-1334273833.swf",
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
	"tincture",
	"tinctures_potions",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "imbibe"
};

log.info("essence_of_gandlevery.js LOADED");

// generated ok 2012-09-18 14:08:50 by tim
