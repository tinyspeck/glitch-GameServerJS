//#include include/takeable.js

var label = "Card-Carrying Qualification";
var version = "1337965214";
var name_single = "Card-Carrying Qualification";
var name_plural = "Card-Carrying Qualifications";
var article = "a";
var description = "This is the most basic, entry-level, bureaucratic item of all. Being qualified to carry cards is a prerequisite to becoming the sort of person who can have Papers at all, let alone Papers which are in order.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["card_carrying_qualification", "takeable"];
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

verbs.activate = { // defined by card_carrying_qualification
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Qualify yourself to carry cards",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('card_carrying_qualification')){
			return {state:'disabled', reason: "You already have this."};
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

		// effect does nothing in dry run: player/achievement_give
		// effect does nothing in dry run: item/destroy
		// effect does nothing in dry run: player/custom

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

		pc.achievements_grant("card_carrying_qualification");
		this.apiDelete();
		pc.quests_set_flag('ccq_completed');

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.achievements_has("card_carrying_qualification"))) out.push([1, "Don't forget to \"activate\" this qualification if you want to prove that you can carry cards."]);
	return out;
}

var tags = [
	"bureaucracy",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-27,"y":-17,"w":58,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKmElEQVR42u2YWVCb1xmGc9m7TC56\n45t2Ou1NO5100rRNJmkzzdSZpknrLJM4tZ3g2klsxyvGGLPYLAbMKlYhITYJ0ALaQUI7EpJArBL7\nvi9hcwxeEjdpk7fnO0YUQtrpNk0ufGa+0c+PkJ7znvdbfh555OF6uB6uf38tTtoi5set7qUZe9X6\ngjtxfsJ4APeDz31jAEd79TNGYxZ87jKEOpRISH8DLocQM6NmDATrN+q1SV8f\/EBQ+\/hQUMvhFKpr\nEAhPcEC1JpXfy8j\/E4pLzyL8npTsw7vgTebMbfjP7nREEDzQ\/ej\/DHA4pIsMdshRLr0EqyUPHX7Z\nNqyk8iIHJWi6JjiKsNp0\/Y\/gh\/s0IOVXZp16gl+ea\/rP4EurzjWk5R9GZU0U5icsGAipoDOkQqO7\nzr4gGWZTDkb79OhslXF4ssCX4aU1VzgcqU33CHInPP3dTvjJYSP7\/ORt+H+q\/PyUaUPbkAy7U4CP\nljzw+0RIERxESu5BJOe8iQLJCSxMWDn87JgZ0yMmBANKWBtF8DdLMdKrQ2+nEk6LaA982B70Srah\n3xEs3aOfCZ6g6UQmhxqxB\/D+RuC7n3\/cg5lJPUIhGRZmTLA6s5AhPIwbxSyKDoHgl2ftuLnoxvpC\nM7pbFTDpi2E3l\/IPJfi58SaoarL4\/aGgBuMDRoz1Gzg8AVEQiKUpj8PRBsJBm6L7LouknyG9uVu9\nmYZXxkbqYHFmYGPVjbb2Eqgb4pFXfhSCsgjkSt6B05OLqXEd7m+048MZB\/T1BRjo0bKjamIK1rDj\nN2I4ZGDKmjm8QpaJpSkbB6cYDNWhTMZgpJFQa1NQr0lGf3cdhydFybukZFz08SaG9IddgKFQVWKW\n6G0otFdwZ92HT293wunORU7pOzyKqt7F+Gg9h\/\/ikyCqytPZjusZqIsdt5Up1Yip4SZ+vTBpQw87\n+kpJKm6v+rCx7MWtD1vQH5Ljet5bDyzDIonZxuUs5Jap01zj8N0d1di379uFDGnfLsDNZa9hetyI\n6rpo3LvZho8\/ehAD\/XIE2kuxudqCP292cPDbq372oVZMsGNdmWvmUJNDTQzQwu7bmQ2a2SZb0Wyr\nwOKUHZ\/dYX+z5uWfkyk8gowty+SKj2KwT8U2aUNFbSRqVDFQKpNWGU7KngRhGeQhfyk0cXzHmyte\nvnuKO2t+3GVfSEHwS9N2nhgdPgVa3XIE29VYW3Dz3w2xIw60KFiStcBlLcdNlmzkbVK9wZrCLUOR\nK4mAUh+LpTkz1hYdMFpSuSC2xpIBhhOxB9DbUoKy6gswNKbyBKCgZKBspqAjIvAwvNkgZH7TMf8Y\nGbADXX4VfK4aDtjXpWWvepbR9Uxh17byvb2ybcuQp+sMcRx+YkwNW3MmcD+E2qq0Voazfw+gWpeE\n9IIjcDcX4UOm0DJLAgpWn7DKvoRibb55Gz4nMxoeRyUmBk3seE0YDOrR3VbHk6WfAXaxJNHW5fPs\nJmXDtpmbaoDHV4jVRfs2+PqSE0pdLHxtxbh4\/oie4XxvF9zd9bbnCKa7Q8YB2cCwXe\/olX6mbKQI\nw4\/2GaBjAJSto0xFt02Kvk4N2r0KdPrkaNAWsesaLE+y7PVUoqXmOrTpJ2HOvwhZ1EEe0z11HHx2\nsgH1hquo1VxGxJHfqxjSY7sA76x4D9BxWu3Z6AvWcqVIsbF+47aSBEaAO+F72pTMM2K0OCpYgjRi\nrEsFU3E0Ms4eRP7Fw9AJImEWxqDXKcFIW822bcba5RhvV8BTncItY7LcwNSonvv9pRd\/Kd1zvMtz\ntkS9KQXFFSewOu\/Y9tpIr54nxCIDG2J+o9IRaq5AyCFB0F4KjyKdR2NRNNTZ5yEVXEa5OBkBRxl8\n2lz0eaowyjoLRZtewDc64JXCXHwZQ\/5q1F1\/j4thsWVjdFDNfO4Bwzm5B3Bj1aOvVEaCgjxCXrm5\n6OFBmau\/cYofjSk\/EvbSOHRbRTDLM3nyELhBXYCQlw0WdZkYDMghOPw87BXXoEg6jobCS1x5v1aA\nSerjTSWojD6EKdZd5InH+cko6uNRXH4KPV2yrwZkmRSibJLIT+Ov97rxl7td+Hjdxuvd5ooPFede\nxzRr7A61AH4G0e4o5\/5pt4gx3FqDtRk7HJI4Dl8eGwFVTiSs4lhkvf409HmRCLbIMMSO1CSO40lH\nKpKiOYd+zS1jsebyAcVoSsdXZjBl0t2bPvgDQnx+S4Evlq8Di6dwdzoOn2560SyO4eCd6kyY8i6g\noz4DDmE0bKIrqDxzAE2l8RhoLke3UQBXVSIH6rWW8NCln4Ii8RgKjv8OVZFvoPr6SUhvnEW\/qwzT\nIQ0\/Yipv5Hk6kT2AlMFS5SVe2Zcm5bg3eR6bw29jsfMAxj3PYzp4DcqYP2J5iJURTRbWRhqw0KPi\nsTlnxwYr7rNdCvhkSTDnnOHvrTr7CrRJx6AURMFnyEdvm4LbhjJ2kPVaggo3Aaqp9P1UZweDGuoi\nz+4CZOSJSnUCZIrLWBu+itn21zDs2o9O41MImp5kGRcFZ1k8Rn1SjLFJxF15FQ1ZpzmAgsGYc87C\nX52EuS4lbrMEo2JL8cmtAIMKcCiyDLW7uXErD6p\/M2NND4r\/ige16susaCfA3lQ4v6cGMm+5aa6z\nO\/Ix1HIcbbpn4FE9gS7DExiy\/RR93mietU0lMdx\/\/ewoqbaFO0q4DRIIQdGkE+7X66ykhFsdrwp9\nDyYdmoQInmxz7yM\/L9IK3RWIJRfHdwFOddc\/GmTmpRlNq0uD1\/QBnDWPo03zE\/San0DA8CwGe2r4\ncEpzHtW+cNEO18dwhwm3xRkG4HNV8QGWOkmru5r1ahXr3WIOSfCkJqlKgJtrHtZZ8ne2ub+vDn9t\nhMdRilr5NVb1ZWgwZMPfdJbVujMIWE4gX3icj\/F5JSdRUn4OTnsRgp1ydLRJ+TRNI3sYnop3MKDi\n3aOP9eBZdoQE382KeaClmo1mdby7dPrlmB+3bA8fA321cHsLuPJZ6Re0uwAlwmuxDdqClla3FBRC\n8XkoFcnoYF9iMxfhYsLLcFqFHD5f+AHScyNQIb2MSlkMn4bzSk6gWh4HnT4NCnkqAqx80HtH+rUc\nnsDD8KQ8FX5SvcuvYCfzIFla\/WKIpEyQQBlioo6mfdWz0g9ZFPzg+9+peeE3TxvjY97tEmRGTZWL\nrq6YjHkIw+cVMcDsoxy+y1+LmKRXIZXFwmUXoaT0PHIK3oWoPBKlFZF8fJfVXoGqPok\/aNHYPzFo\n5O3Q66zkCoctw572QA9qKk0C9kzRW+tHW7Xn5FZkb4UgDP7Gay9YCFxclDCvVmTfIuDSsmi47RIO\nL5XG40LcS3DZxBw+Q3CMbegkrOYCKFVJyCl8D4Wi0ygSn+FPfRpNGroDNQj4KlGriufwbW4ZlZgn\n\/9Un0G9tZVMY\/s0t+Ngw+C9+9mNVGLxQED1fKoq9FVa7WHQedao0fh3wyHAh\/iWUV8Zw+CrpFWTm\nH+eWIXiPU8x6vByiwrjuPVPMf7H2bW3g2R3qX\/oyeFjxnWrTdVTCATZLStgUVIbsgve534+89WLJ\n\/+s\/KI9twe\/f8tRpFkm\/3f+M7tjRV10ELqtIXTHpi+6GFbcYhZt7HjO\/prVvB\/whFudefvFX8qd+\n\/njtng7ycD1c34D1NzeoIhmzeN4HAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/card_carrying_qualification-1334193131.swf",
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
	"bureaucracy",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("card_carrying_qualification.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
