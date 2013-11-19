//#include include/takeable.js

var label = "Heavy Gas";
var version = "1347908879";
var name_single = "Heavy Gas";
var name_plural = "Heavy Gas";
var article = "a";
var description = "A hefty flask of heavy gas. Remember to lift with your legs.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 40;
var input_for = [75,190,249,306,309];
var parent_classes = ["heavy_gas", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gasses"	// defined by takeable (overridden by heavy_gas)
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

verbs.lift = { // defined by heavy_gas
	"name"				: "lift",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "A difficult-to-resist challenge",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('mad_gasser')) return {state:null};
		if (pc.metabolics_get_energy() <= 3) {
			return {state: 'disabled', reason: "You don't have enough energy to do this."};
		} else if (pc.metabolics_get_mood() <= 3) {
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

		self_msgs.push("Ooch! You forgot to lift with your legs. You're going to hurt in the morning. Actually, you hurt already.");
		var val = 3;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		var val = 3;
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

		self_msgs.push("Ooch! You forgot to lift with your legs. You're going to hurt in the morning. Actually, you hurt already.");
		var val = pc.metabolics_lose_energy(3);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_mood(3);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		var context = {'class_id':this.class_tsid, 'verb':'lift'};
		var val = pc.stats_add_xp(4, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'lift', 'lifted', failed, self_msgs, self_effects, they_effects);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI9UlEQVR42s3ZSXBa9xkAcJ9yzS3X\nXHrrdHrrtbdeeuipubSdTDtuWid5tmwreDdehQAJBAixCPQk9l1ie4BAAmFJWBJiE9t7bGLfEQhJ\ndmQ5\/76njDN1EtmOnUR+M9\/MuzD8+L73\/74POHPmHS+\/868fRp1nmZj3S3dmZcBdCdx0NyJ33TtJ\n6uxhaeLTM6d9ZVe++LjoHwSV4A3Qjj8E7dhDUI\/cBSX\/NYB6Pp898z5c5cCVXC81DL6pisBehglq\nYTKIL34Ggra\/k08d50y2\/oJGpd8B8RIfA\/HsgdVVcXAR3fn9qQJdySZA84laL80Eh0Ue6CQoeLlv\ngYiPDtyREHAlG+5TBT5Kty\/Eq7s7hc4BiFV3jyNY7AIC7sGauVPPIHE5tirCRX+Ugbg8Tb54pqAx\nzNUl9keXF9Am+b04JARwKYRRrWZjhUZ5gMpmxKkpi\/fiewV0+kJMp81SZ9AoGCzib8sMxvH3Cmiz\n250W01yZQadgavl0RT1nnnpvgLZQATaZTF6z0VCi4yUWjHPSaotzxJlsMk8dZw9u\/9nkT7P8gZBP\no5LnR6lDqFg4kVUjHqrJn5l1ZjofnhpOE41+YAsXFWrDrD4c3Oww6FSUQRtGx5mMlHnOEBVbV6\/O\nx2qKUwPib35dYbLzV7yeusOBVJijNJR5jKSiSilcnHUuU5RLW8LFVPOPv35po8Xf2MNFqdVsSsS3\nwl0JLMqxmaPoGIOOElCRgJuzWCyLAoPnoiVUnD+F7JVhuVqr39xYbz\/2rTbYTCbKYhBAPEbpx\/da\nlbxsstr1AvMS2R6tkn69thKr\/M0eyQ+75h254OZme06nzbPHcOAY49vAM8lhMTCdWlaxzGorsMl1\nXbOaVCxkOx\/\/8rh07aP5aEXhDGJfxWPRSmwrvKtVSEozYsG2RMTPczlsjMDKp6dKvAlOWiGZKZjn\n3TBdYj1vDZekv8L2UqdZ15I3V1dWYtFIqIdnsTwxzkK5bCLG0HHWGDrJ46YlImGeyOS0WJyx2mxO\nod59ZcqxziLWs19u90vUfueMV6U2z4qQyNxWKNhVK+VZsZCXnhLxM3zeODaOY8X4PSwS5IhyT\/J5\nKZNeXdYaEfmI1HxBs5KAf7He6ErUVc7INhQKhYPRrdBuOODvGrWqmnwGzvN4XHSCO45yx9mogM\/F\n2HhG2Xg22SwWKpPAOZNeU5crVZZhiZnkiNWGfnbcQqIBLcSrw+FwQJcOrhxlYoGnyeD6gXVOW+ZN\ncNH\/D5FQmNKqpAWNfKZgUMtLvkV717do65r0yoZ4asoIO9aFP+ueuJLuf7SYrCu80TypVcT295pF\n0K\/nQa+aA91yBnSKKdAuoKC5nQCNbAzU0hFQxUKgnAyAUtwPCtF1PNaA2aCpGxSS+kMOfM+4kRP+\nbMDFZIvlTVZJ2XgovNcsgLcB5rceg\/Wl+Z05taImEsMmutxKtm6VPnn30mLtP+GruzC0FRPu4qiD\ndvmtgeX4+rMp8WRWp5LlyZzpQZknoninAxMF4INFtGX0YWVSGy\/tzCQP3Lt1Hdy5cQXcvvoVuEG6\nBJjD98H4yDBg0x8e3+ukYpDcXP5RYCm2BpwWQx3vkUUYnjZdYc1AcxvZB+\/yjY3ky7XJ2xnM\/XW3\nAZA5LRijU14CXrt8AZAGIDB4\/nNw8Yv\/gAvn\/g0GoXOAevcGoNy+BmRCDtDAvGNgLrwKtiO+J+JJ\nYW5OJW3cH+PT2AYP662WCWIseTMdXTyTYz3t1gEBfLJTOy5xORMDdhx7EhD67F\/g87Ofgv\/+8x\/g\nwU0SWF+wfAfsZENALZ8paqRwVSISJC+NiCHJQuinL7ZutCXdzDfJ\/Wa5ddhvvQR88Qwuu5AfAEeH\n7oJJ9giw6+UgE1p9qcQEsBh9DCKrCz0pLCriWWxSOYKRaxwZyR4tv\/kyQYwjX26H1Wy1kKO9DjgJ\nuLX+6CXg1UvnX3lICGA2uAy625HnM\/goxIEtvlzHGKAJIbbORXujZYI4VZ50x55v7Q4\/67fBq4As\n+tAPMug0aV8LrCXWwarL0jZp5XmpyUm\/OS65fP4hF9I9xmiv73lY+1aw+oTc291Fnh90TwTi0+FH\nn0HSwJevBVbia2AnG36m12m900bXEFdpJRPAmwI1eXYj+4eTcfj4Wc7sILHWIYQ19m\/hSPerMshn\njwK9DAYmtQwI8OeOaDNDt6+\/EpgLrYCDUhwcNVJg1buwLjEvDk3Nzg\/d4kgGz93nQCL72sSJvdGT\naksTrSMo2TocyHee0Lc7T0eaO7uqfq+d+jHgT23UlcTGMe6gnHgexg\/KImLMEEAiiwK15R4BPHub\nAVkjJxyY5WwPIYD53rM7OJCawyPb3KNh9T16ttrilqtVBMe1Dhp5sF\/PgX41C\/qVNOiVUqBbQkGv\nmAT9UhLsFuOgV4iBbj4KMsGVJ\/F193464N3H\/Et9POMlLoeVVCiVHq3VJZCYFyjTxgXKlMFBeSBQ\nXieAk1Yf+YQSN8Xp9tFgee859eDwaKPcO+TlWvtUrLZHXUvVLnliZYhYtzyRLGkLS7NiySTf7\/Nu\nInpVQS+HCzo8DAq4aNbIKpJJfp49SkuzxsaWqAyWdIwzbmSMsYw0roihRdxMjWOZorB5KTKzm3KM\nnHVSeCrLw8HRqSvmQGH0xBO8WdiFc91D3osMPnl2FPn62Tf56s6+1IdVSQTQEchCSCANmdYSkHF1\na8Dx6DFLoVZb5Qq1Va3VIlqdwajUm4QzJtcNlsoJjSgsEG3GAlHgWYghM18eEusHbnJkEDHq7ggU\nl6WmhWECKLc\/mrCF88rXzmd\/oXsuVu5rUs0DXrn3lNfof61r9Z8inb2n7mp3T+eNFkkvgLPLMUjr\nDUEKTwCSOTcg2OGDxJZliG\/yQFz9AvR94B2hFrrDV0EvgLc40ktKm5fpDKYNy7H8b9+8WeOfYjm9\n86kv21F7sNbUUrLBcseq5O9n8G2ATKWDLEYeCxXeGGILbTOX0q13\/zeAGOjEr1VEOJMN2JmoC52x\nqtAeKc8ioSJiCeURSzCPmAPbiMmfReb8GWRuI4MgkTKGhEuY9duQEq91JRsX3nRB+B9SWhuq5ZUC\n4gAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/heavy_gas-1334269282.swf",
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
	"t"	: "lift"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"t"	: "lift"
};

log.info("heavy_gas.js LOADED");

// generated ok 2012-09-17 12:07:59 by martlume
