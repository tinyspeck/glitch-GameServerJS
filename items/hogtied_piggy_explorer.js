var label = "Hogtied Ilmenskie Jones";
var version = "1330480448";
var name_single = "Hogtied Ilmenskie Jones";
var name_plural = "Hogtied Ilmenskies Jones";
var article = "a";
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
var parent_classes = ["hogtied_piggy_explorer"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.release = { // defined by hogtied_piggy_explorer
	"name"				: "release",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Release Ilmenskie Jones",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "No, leaving Ilmenskie Jones trapped in hell is cruel, even for you."};
		}
		if (pc.get_location().isInstance('axis_denyde')) {
			return {state: 'disabled', reason: "You have to get out of here first! You're still in mortal peril somehow, supposedly."};
		}
		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var n = apiNewItem('npc_piggy_explorer');
		pc.location.apiPutItemIntoPosition(n, pc.x + 50, pc.y);
		n.finishQuest(pc);
		this.apiDelete();

		pc.sendActivity("You released Ilmenskie Jones.");

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
	"no_auction",
	"no_vendor",
	"no_donate",
	"no_discovery_dialog"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-26,"y":-43,"w":51,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHT0lEQVR42u2XCVOTSRrH\/QZ8gi22\ntnZGR0dZR4TIkctAwiUocgwQQB3uM0AQUCbc1wAhhIDhCiEcIQTCIQwCEsAFRZGMC2i56wwfIR\/h\nv91tZRYQx2sGrNp5qv7FW\/023b883c\/xHjv2p\/1pe+3lQo7LnFbkRJ+tHUHK3kp\/3WcDN1J\/xdlm\n\/tY23iBSNGd7KiebxOgtv7hjqnkN\/FnYVL3QeVrtZ59u8UN7ETeLjslD+Fk3w0ROiaJzRw\/amevh\nvNh5aafqhhB5wXzIg\/kWeYgABNKWKOLsXBOcBxHvSOC0N885PRtLtCszA5FziccAZUFcVEqD0ZgQ\ngdsR\/sgI4CGe77pzZB5cN2dbHw2VoyEtAPJQD2QGukOTG48FbTXmW8sxp5bBWBaMgVLB4XvxlVWe\ntaTLsy\/rUzDXIcViVyhsk7lY1MVhvj0C9zuCYKkLxLQqFL0lYuWhwv08F+a0PSm1b02lYOtuBl78\nWIjNkXS8nC7Ev+cq8Wq+BL\/cv4XFzkDM3vFHf7nYeqiAa4ZilydDCXhlLcD97u\/wZFSG7R8z8WT4\nBrbGw7E2KMWaORUzaj8sdARioi4aq81Vh3fMWxNDyp+MXbBqCKDmGqaV4Vi4E4+plgT0N8aiu1QC\nU60\/RiukWFDdwlp7I1bVlXjYUh73h4I9nxpx3p4YshBht56ZerDarcb1IA6uXjyF7GhvrJu69syx\nDXTgaW8bNs2GrD8GbtyYtTVutO+Ho5ptrcG3krOI9D2N29\/5YcPUjYPmUUj6l6xjfT5h+n2OfHPS\n6EIXPGhDqqfDeqSEeSM+6Czk8RexYdYzTx04d984vSq\/B5z9bXBU6sIEJF89j9xYHlb6Wl9vPDaA\njT7tG3PXe1r2er6vGyM9nbaBHp2lv79fMTw8HPxhwTBu3PktOKuuGYmhrkgNd8OkpnSvdwjkv8y9\nTI4xx7O1vxutykYolUq0tbVBp9NhcHAQo6OjmJqasr0n3FDcb8FRFV73QxqBay6IwrvmOvRgsAdl\nZWWora2FSqWCVquFXq+H0WjE2NgYZmZmsLy8HPxeqWT\/4gN1RSwQ5PEBKE4KReIVV+THeeOfBtV7\nA1J1NStRX18PtVqNjo4OGAwGmEwmTExMYHZ2FktLSzvr6+tO7zreNwIjLcKDeI1LvOaO68HfQOrv\nAk1R9AfBUf1kGUBrM\/GepgWjXXewMqTHsxEDNidN2Lw7zLQ1Zbb9PGd6O+Qzs35PcAzV32beKrzG\nJamEtFZxXiw4+mvzPxiQ6tFwH56YXt\/JF\/en8PLhIraXZ\/F0xsKe1yZJfr039vYSSZPv7gVrsq4y\nsAICmE\/gZNEeyIjkQF0Q+1GAu\/V8ZoxBUbjOwkQGN9ujxtqEEW8FfNyl2hPBleki3LrBw814b+TF\neqE4gQ9FkpBE8g+fDLhNjvYF8R6FHKzOh0VVhpVRA\/Pof1aXefs6FRPpVIYUjzubbNSLm6N9rJTN\nayvQkCNBaYqQgAnYXayX+bN3+739MdoY7MSLB\/MMcrd+WVlxfgOO\/gMFo0We5jPHIjOkEa3O8EFJ\nshDlqSIMVySzJoA1Aq217wSlyXtZVY7iGzGIEHrhgU6z570yPwvDnW3\/A1xdtB2QWoy67XFjMK0g\ntDRRSMcC2u\/TIQ1wYcesV0jJZqW\/AlIdVD12i\/6IVYsRFzgcereQnZay533ABVcc\/+tf6Frvbiho\nMafefNRaY6EL0ypQnRGC3BhP1KRd2gPG1FLNvL4favcYnTej16KzswM5Mhk2Fmb3dkVkj3uaOnxw\nTaZ93EKDwi4nwUE10pDLCr9Dji5lnRyxqaEEP+QlYKi6CNamcgblaBJYD9lSA3PVLab1vvbX1cXQ\nhnvt9bjbVIqZhmLLRzUOV4RfOZPoZZCmqmR29PslixEi3Pckroq+YooUn0FTRvSvd5T+EGu3isFQ\nGarzyL2LJ1UpBJlRfKRGcFGW5GPPi+UoqOTSC7ycGDeX94bMjfJwlku9eXUyH95DdaWCimxuWVFX\nWDU5sTsxAaexW5HiUwjkfkma2DNIuixASUIIihN9yR32BNmYKT+OgzypOxm7QE6HA0WiN8m3nqhI\n5aE2U4jSZC5Ja+52CvtJrVlm1Pmsy8ITCBEcZwoiYBLPvzOFXjyB7KjzqE4Vo68qjYGLPY9D4v01\n\/LincdnnHK5IOAgRc+DDc6fgLhSoWe7D6y4O4tVlCHifDEgtPdJVkR3lBodk0W4kJUnI52cOFptL\nsdRWh7aSQnxz5iQ83M6C7+XG5OfjjSAJnylQzLcc2sdVmOhvTklhPBYIdzU10CqyEcD7BwTuJyDy\nOAkJ9wxTsOAU8uK4pBCIDg\/OYSH8L22XyZHH+H\/N7hjV9wle7O5lRrqS2u5BUpc7Wm6KYWmMyDoC\nwC+UsSRgHHAUqDpdgKo0PiqJNAUS1GQIMVgTijVDksuxo7D8WE6cSu5ra5b7ojFHxNRW5IfRhkjy\nRRhvN9eHW5a6E7KOfQ72uDeF59CReez\/1v4LVzzLxgwx5gkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-12\/hogtied_piggy_explorer-1324075860.swf",
	admin_props	: false,
	obey_physics	: false,
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
	"no_trade",
	"no_auction",
	"no_vendor",
	"no_donate",
	"no_discovery_dialog"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {
	"e"	: "release"
};

log.info("hogtied_piggy_explorer.js LOADED");

// generated ok 2012-02-28 17:54:08 by martlume
