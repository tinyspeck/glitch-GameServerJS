//#include include/takeable.js

var label = "Nylon Phool Party Pack";
var version = "1353015758";
var name_single = "Nylon Phool Party Pack";
var name_plural = "Nylon Phool Party Pack";
var article = "a";
var description = "One temporary underwater pool-party spot. When activated, this ephemeral party place includes a complimentary DIY juice bar, smoothie-zone and Spicy Grog spot, replenishing nibbles and unlimited floatiness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["party_pack_nylon_phool", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "nylon"	// defined by party_pack (overridden by party_pack_nylon_phool)
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

verbs.activate = { // defined by party_pack
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Start party. GOOD NEWS: permit requirements temporarily lifted for parties",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.party_has_space()) return {state:'disabled', reason: "Your party already has a Party Space going."};

		if (!this.instructions_read) return {state:'enabled'};

		if (!pc.party_is_in()) return {state:'disabled', reason: "You must be in a party to activate. Didn't you read the instructions?"};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!this.instructions_read){
			var can_activate = !pc.party_has_space() && pc.party_is_in();
			pc.prompts_add({
				title			: 'PARTY SPACE ASSEMBLY INSTRUCTIONS',
				txt			: "1. Assemble the desired group of party attendees by clicking on Glitches in person or in chat, and selecting \"Invite to Party\" to invite.\n\n2. Continue until your party has reached Maximum Fun Capacity Level. While waiting for party pack activation, the party chat channel can be used for smalltalk and metaphorical icebreaking. \n\n3. Once Party Participants are assembled, activate party pack. Do this by clicking 'Activate' on party pack. \n\n4. Every guest in party chat will be sent an offer to create a teleportation portal that will take them directly your private party space, regardless of their current location. Party Participants have a limited time to join, so ensure everyone is ready to party. \n\n5. PARTY HARD. \n\n<font size=\"10\">SMALL PRINT: \n* A single-activation party pack gives a party of limited duration. To extend party length, insert currants into the machine inside your private party space. CORRECT CURRANTS ONLY. NO CHANGE GIVEN. Parties limited to "+config.max_party_size+" participants.\n* Please note, due to physical funness capacity, individuals can only participate in one party at a time.\n* The giants and their representatives are not responsible for the level of fun experienced at parties. No refunds for bad parties.</font>",
				max_w: 550,
				is_modal		: true,
				icon_buttons	: false,
				choices		: [
					{ value : 'ok', label : (can_activate ? 'Activate' : 'Understood') },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_modal_callback',
				itemstack_tsid		: this.tsid
			});
		}
		else{
			log.info("Activating party pack for "+pc);
			var ret = this.activate(pc);
			if (!ret.ok){
				failed = 1;
				self_msgs.push(ret.error);
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);


		return failed ? false : true;
	}
};

function activate(pc){ // defined by party_pack
	var template = this.getClassProp('party_id');
	if (!template) template = choose_one(array_keys(config.party_spaces));

	if (!config.party_spaces[template]){
		return {ok:0, error:'Bad template'};
	}

	var duration = 60*60;
	if (this.class_tsid.substring(0,18) == 'party_pack_taster_') duration = 10*60;

	var ret = pc.party_start_space(template, duration);
	if (ret.ok){
		this.apiDelete();
	}

	return ret;
}

function modal_callback(pc, value, details){ // defined by party_pack
	log.info("Party pack modal call back for "+pc);

	this.instructions_read = true;

	if (value == 'ok' && pc.party_is_in() && !pc.party_has_space()){
		var ret = this.activate(pc);
	}
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "GOOD NEWS: Temporarily, parties do not require Party Permits."]);
	out.push([2, "The space created by this Party Pack lasts for 60 minutes."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"party",
	"pack",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-36,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALv0lEQVR42u2Y51Nc1xnG+QMySTxj\nO\/Y4VrNs2ZZkJIFEEbDU7cDusp1d2E5byi5LL8uy9N6REAhJqIMQQkKybKyrjmW5l7E98dgzTlxl\nW+6xk8w8ee9RixN\/yMdkRmfmmXN32L33d563nHMJCbk77o674+743xuJRuPyFKtBIHEaBKlOsyA1\nzyrY\/8ysoGPPiKC0K1hc0h30q725fq0v39+6e9R\/+pULfl1VUa+jqYo7dPEkt2txjvNPDHGGOh+n\nr72lUk5T4+3VVHuKNVUegaqmdDl7mMqW1Tt47BBX2NnEhUmSuXC5iItIFXORChkXrZJDU+BAx44B\n5NT6YCotgLetHo2j3agf6oC7qQbNY30oCFahfrgLjWP9OPjcCTTvHEb3\/gkMz+7D6MwU9p2ew875\naZR0NGHXwiwahntR3tmMuv4uDO3bDV9bM\/LraqDOcTG5A7Vw+HzIqaxAyL0Pr+DuW74CqdYsdEyO\noXX7CFrHRtG2Yxvax7fDP9ALi7cEuVUVyKuuRM\/OcfROTsBJN3CV+VBSXw+v3w9vQwASrQ5SvQFy\nvRFGZw5MuXnILy9H81Av7EXFcJZ44PKUIs9X9qvqHhlBU08Puy4LNLCZAJdz9y1bAR5SajIgSiTG\nVrEUMRIZ4mRyCORpiE9NR5JCiWSlCinKDIjUGog1Wkh1egaTZsyEwmSG0ZWL6qZm1La2orWvD\/72\ndmTm5MKcl49X3n4Tr73zFl5\/922cu7KEYHcPfsbfcez007fh\/vXzLYXYcwxcWWUudGYVA4xMESFS\nKEK0SMIceO7SBZxZusg0PLmTgfKQikwzvvj2K5w+dwYynQGpBiP0Dic+uvYJE0ff\/+av36HM38Dc\nfOnN1\/H9337ENfrNwnOLzM19s7MMiod767138fWP38JbW\/dLwHv\/+DAXGR+NBHECA9ySlHIbMs1k\nwqfXr+HA3FHUt7Xh\/Y8+hL+jnUFWBBvx+TdfMkhVVvZtNy+\/9AIuv3wVSnM2nn\/1JWyf2gOdzQGD\nw4Xvfv4BL7\/1BiwFhbAVFjFI3s2Pv\/z8V91jgPctX84liOOhNyshzzIgPDEJm5OSEZEsZKA84I59\ne1nIJ\/bvY07yYZ88dAAvvP4Kzl65jKpgkIWcz8GLL17BJVI6hfzQ\/DHsPnwQGqsNersD3\/70PV58\n41UWmay8AgbqLq\/Al99\/ja9++OY\/3GOAKfIk7rHQtVizcR2iJEJsik9EWMINSN7NT69\/jsWL51lu\nHpibZSHnc\/PKay\/jxHPPYPf0QcwsHIdQrYZUq8WFq8\/jz599hEvk5Ff04O6RYaitFmhsNhbyq7Qo\no8t1EzIf3rp6\/PiPnzB7coEVUG7pvwGuDQ\/lSnx2bIjahGipEBsF8dgkSGCQvJs84B1dQ\/+OMeYm\nf\/3Z118wvf\/xhwSYQQ5qcP6FJbzzwZ+Ynr14FkZqGxmWLAK04Dq5xOeZ0eUkQKrynBw8e+EsSxUe\n5lal53h9dwAfenQlZ7JpkF+cja0yITbExRNkAoPk3eTB+Af1bh9l1RolEtFKPQxwaHKcCmeCAVY2\nNUKiUzPA81eXMHFgCh9++hcos81QWczkYjZzlIfUOx0E7oSbWhcf9oPHjiK7oABW953cvOVmSKpa\nzJmsakQlRiJGLsRTMXEIjRXcBI1ngN3bRpibESlCBthP\/XGJCkCQJkeiMu12qEUaFc69cJkB+gJ1\nzJlAVxuUFhMyrGZ8+d11Bqlz2mDIceDU2UV88tXncHpKYMrLRVZ+PuWlm+XmLTdDHn78EW7lutV4\nJHQNYlJFWL81FutjYhkoD\/nZ19fQPTrMALckJyNKLMLipXOYX3yaASYo5OgcHcSb770DkVaFqSOH\nmFJNOlx4cQnj5KTKkkkyYdf0flrIAWgdFhhyHdC77Aw0M9fFZM7Lw\/D+nTi4OIe9J2eYmyFKrfS6\n1+eATC1EbJoI66JjfgH5DOVIecCP8KREbEnhAYXMwZwyDwTpMihcWXB31ENfnAOxTgmxXgWZUQ25\nSYtUsw7p2XoKs5FczITB7YCnowHVw52oHKAmXuCiHakIHeODLOS+YD22z+xB9+QojpxbQN+u7R+E\nrCbnjNlKKPVSxKWL8GRUNNZGbYWMeqI8ywihLgNhiQnYnJyICBEBSlIoV0WITRUjzWGCta4UYmMG\nCtrrCdSP3KYqaPNt9Hs1AWqRlqUjOAOUVtr+8u3oPrgDlYPtDNIdrEZgsAOnXz2LgmofvIEalAbr\nCHAEgf5OnH3rMheyOS4cWTY1FDoJ4sjBJyKjYSsvxtiJveicGoaPVhyWGI9wBph0A5BylQcUKKRI\nVMmgK3Iiv62WIOuYm85AOeRmDQFqyEEdFBY9FFY98mu9OH71WUxfOIGRuT0oIkATHUZqu5so3FZ4\nAtWobAtg9uIpHObmceT8Ahey7IlVeGzD4wiL20g5KMQTEVHomBpCopoad7YBjuoSZNMpRuU0M8Bo\naQrL1bg0AlQSYIYMmkI76sa6MHP5BI4sLWDoyE5ynxwkpVu0JHKRAE1FDsxcPEEA8zh05giMBTYs\nvLQIk9tJhWNBsb8SJf4q5JObJeSmtcTNhaxcuxqhkaFYu3kdomUpWLMlEu17hlDd34LqwRYUBitR\nN9wKY6EDEWIClCWzhcQpxIhXSpCQISUH7dh\/fg57Tk0xyMIGDwGq4KxyY\/z4FBQ2Lcp8NrSM9+Dw\n+Xk0jrTDWeGGmlKEV\/\/+bXQsm0TL9h4GqXNaGeSe0zOvhGyI3ICyChcsDg2FLxlrIiJpT9ahIFAB\ndZ4VRZRTYckCbBYmIFKSeAMwjQcUQWLOgM1tRrZZiuauSgwcHkPDaBtkWfy2mQFDoQXtu\/oxQo62\ntXgwQ4s4dO4YAiNtdP7zQO00EWgh2if64W2qxsT8XhTVl8PqyUd1VxAah4ULeWDVMjwZtg4ZehmF\nMBGPE+CT0VFYH7sVoYJYFDZVQkk3Km6lfClxId1ugLuxDLbqIjiCFXCTM83VNliypBBnpkFmVkBG\nRZdqUcFQlI3gWAe8rVXUiDORYdfAXGLHwKExBql2GOEoL0DP3hFUUIGNUV66fIXILSPo8T5q7mYK\n8ROr8cDKZXhw1XJqIwmIkonhpUTv3DeMpokeFDZXorilChW9AXjaa2Dy0A7gL0VNfxDZ9aWwB8vJ\nfTVzJNNjJTgF5S4BWpUooFBbylxQ2NVQObS0UC3lsg728jx46b5SfTpkBnLbqIJEnU5h3gkHuSfT\nKOEqpfSYm+JCHl27BhGxm5EkiadWkgAj9bMggcmpLThrS1DUXAUr5QsPaK8qRCSdfJ6KDoe7wYfq\ngSaYfXkIT9iKTbGR6No7CJ3bRJUtRIpOSi4qkVligavOjVySf7gZ\/pEWpgpqS7yqqEtUdVJv7Apg\n6vQ0C\/e2I5Os2k+8uMiF3PPgg5ArhEgUxtFuEYcklQSl5FQNPdxRWUhFUk4rNyJCkoBoOR0gkmOo\nCWdgz5lpBrph6xaEkjbGRiBFK0VhoBR1A80YmhnHNBXM4UvHMc2Lrmduiq90XrNLJ5mOPn+Kae7K\n0zh25TTmrz7DND5\/kAv5\/R8ewEOrVkChliA0OoLsz2eQayM2QpapojCVsvlJ+rx+62asiwzD+qiw\nm3M4UtQymIsd1DenGMzhy6RL8zfA2PUN7aW2MjA9iUHS0AyvXRg+shv1g93wD\/WggdQ40kcvZH0I\njvajtDkIfS61md\/ef7+fh4yM2ULnPwGmrywwTXEz6Nw7xFQzEGSg+X4vm3lV9zdiYGbHDaClm2Ck\n8VMH0Hd4AhXdrfC0BqiHliIt2067TTYkJGmmhXYZKzVyG\/VJO\/3NQX3SSY3cxet6hj2XUzt45XEa\nV0Eve\/X8zb33Cgjyg1Xr18NYUoyilgY0jg+gb3ri10UAvaTy7hb23cziYmjo8JmQYbyepM7kkjU3\npTUdJfmFepNfrM\/yi3RZxRKDWSAxWAUSs1UgN9lC\/\/u38Xvu+d2yx9dOxmfouTvSHY1X6f23FJOm\n8icoDQJesWzWhd79N8bdcXfcHf\/n458Vsw0dULw33QAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/party_pack_nylon_phool-1334258451.swf",
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
	"party",
	"pack",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("party_pack_nylon_phool.js LOADED");

// generated ok 2012-11-15 13:42:38 by martlume
