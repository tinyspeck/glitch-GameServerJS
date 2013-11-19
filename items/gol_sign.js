var label = "Upgrade Sign";
var version = "1347906554";
var name_single = "Upgrade Sign";
var name_plural = "Upgrade Signs";
var article = "an";
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
var parent_classes = ["gol_sign", "sign_stake"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.talk_to = { // defined by gol_sign
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		pc.apiSendMsg({
			type:'gol_inspect_start',
			sign_tsid: this.tsid
		});

		return true;
	}
};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"sign"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-33,"y":-105,"w":67,"h":106},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFHklEQVR42s2Y6U4bVxTHUdVvURqp\nSiSafqiqRiKBEEPA2CxewXgdb9jYBoyN8YJZbGM2kxgNW9gCuAkkTWjTFEWt1EotjzAf+gBVn4BH\nqPoEp+dcM8ZAP1SdKJqR\/vL42p753XPO\/9w7rql5T0fM2cbHPWohZG0+7etuiNTI7cgP6WEy0AUJ\nbzs4NPfgg9z0172Y4t36oPDtkl\/47kzi+Rs+yPR2OSj8sBISVtMW2JiywZNJG8xHDPDjkyG+Wscr\nocjRkl8naiVh0iU87TpJgO9WA4rv+QAgFBwuuOHZjBOezZJc8HzuXF\/jOOn5nJvpcN5T0cuCF149\n9gFOBo5XB\/HcD2s4mcURI6T9nZDytCkkQRKQCHAO8i+AeQ5K0xybgDi+m7VDKV8eu3yNffxuzNUm\nHfA1zrg6IqRsvxK2pyww5WuBQrizAnQw74bdnA2\/40YAB+Twe4+imisTIr3GqCaxXiWl+Zet5I3j\n1QE4KlKKPezCTzM2GLXfh7VUDyS4RuDjBpgOtkFhuIuBF0e0sIjnNE6RW4x0wZhLAblA24XofbPY\nB3G3CsKc8v8D\/raf0FEExQtTunazNlg+u\/k03pRgKJrlz+yVCNGYmGaK5uaEuVIKYgQpxZLSe1KK\n85S26tqj9Ik1RTcmgHLdlQ1CBhIns5dzsPODszql34s1WppxQdjeIg3w5+0o\/+qRF14seBgYaTlh\nYNHZmrSwaJLo\/fqYCSE4Br2SNMJOxspgSfvMPFijbBLlSRJgyNIsDfCnrfAJwYkRpEgUYzrYQaD5\noQ7I+luxJq2wMW6ChKMRx60Iboa0pwnVDOtpE6vXvZwdW1U\/q+Ut7JVraTMU4z0QNDcJkgCpCVc7\nj9KTQSiKGplhzK1goOTk5YSxYoDHUW1lUjtoqur2ImZiJWWmGvxDEuAbPnByWFWDosQ6ovo8qGrM\nYgrFNIoSa7OUP7\/G3rRTuknWxix8cbQHClEDLOHrdsbOUkSrCplDdC2lsGwcrvK+4tozUalUlwvV\n4LBUk2AE\/6o2CEWIlq4XBQ\/kgypIOh\/AAqZ3wtuMfU+P9dbAWs\/sgBpitgbsgRqWYko7uZpqmM63\nMg7IhjQQcbSeSAKkZnp5iRNbzMZ4LzMEiYxCE1hCA1EDp3SSy88btutsDXeysqAJLsXRWLg9kwR4\nVPRdWXMpEpdr8tzl7ivLIknMgth26Fp8shdGOKU0wNIMJzzN2k83J62ArxeB8uWeVy2qvfLKwV3Z\nGIgOpijSJBdHuqW3mf9yJP0tN0bdqqzfpIC+7kbwoUKWptNCVM+Xcg5+c8LydjllEi4oYRISHpUQ\nMDdlP8jGlnYkg9aHEMSVwdpZB93KO0KNnI6pkEaX6muHIVsLYFTkBzgXNugm8Hkk1dcBg7aH8gOc\nHTbyBDjm62AbgG6VDAEJjtJMEbR13eVlBZgZ0PJTQQ0+cqoZoFNbLy\/ApFfNz4T17BlDtoAZXFtl\nDRj3qBkgbaFkCRjllDBKT2mOVnDIzST0xxEB4u4Eok4lcJq7OlkBYovhqUnHXCrw9TyQH2B+SM8A\nIxhFh\/YeGJR35AVIjXq8v5MBug335QeIETwhBxNgoLdJfoCTgS6BljlaSWjLJTvAtK9TwAcgoF4o\nywjG3Woh0Ktge0GvsVF2gNciXOvvXtzq07af\/p\/uUHzZi+MfyYIuEjB+FeaUJaeu\/m+XvgEsHXV\/\nfn7zEzt+9BnqulyieL229tP627dv1t26da0W33+B+vh9XPgf2S5IV+VUsSUAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/gol_sign-1319744539.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by gol_sign
	"id"				: "talk_to",
	"label"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
};

;
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
	"no_trade",
	"sign"
];
itemDef.keys_in_location = {
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("gol_sign.js LOADED");

// generated ok 2012-09-17 11:29:14 by martlume
