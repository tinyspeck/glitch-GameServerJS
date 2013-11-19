var label = "Esquibeth Note 1";
var version = "1347561047";
var name_single = "Esquibeth Note 1";
var name_plural = "Esquibeth Note 1";
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
var parent_classes = ["esquibeth_note_1"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.event = "";	// defined by esquibeth_note_1
}

var instancePropsDef = {
	event : ["Event to fire on click"],
};

var instancePropsChoices = {
	event : [""],
};

var verbs = {};

verbs.note_broadcast = { // defined by esquibeth_note_1
	"name"				: "note_broadcast",
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

		var val = this.getInstanceProp("event");

		if (val)
		{
		   var events = val.split(',');
		   for (var i=0; i<events.length; i++)
		   {
		       log.info(")))))))))))))))))))))))))))))) RUNNING EVENT", events[i])
		       this.container.events_broadcast(events[i]);
		   }
		}
		return true;
	}
};

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_click_sound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-29,"w":18,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHY0lEQVR42q2ZSXAVVRSGH0iCJIKA\nDIEQBlFcCLLBJWzcQWlpuQN1LZZrhdI1VawJlltRl1QS5iFhHl+YpzzmMWGemnls\/+\/WOalLpzMZ\nXtVPd173Pee755x7+r6mUOjmk6ZpP+kdaaA0WBohVUuTpLnSAqnWtDSSf\/edNFOqkaqkYVKFVCb1\nL\/Tlg4EIbKQ0Xvrq9evX9VKS9uKj+1t0WChNl8ZGoAMIQm\/B+tlADHwgjZPmm5M+fWxidQY6Whpi\nQejfG7gyi9ooabbUlL7lj4EusskTzUGUUk8AHa7q5cuXP0rdpvLp06e5evHiRbegr169atThU2m4\n9G6XkbS0vgecjP\/y\/PnzVIDMtoPhR48epbdu3Urb2tq61PXr19O7d++m2OoEkGuUzlSDzE+3rdRK\n0iq4L588eZI4IEb8kyRJevXq1W7B8sSEiGyU5mAfP8+ePau3lT5UKn9j4dhqpQZGyMCchw8fJgJk\nUOqQ6MaNG\/8LLCsi6nCUAX7w9\/jx4zprYSycATFguRXqVEWoJEBuDrMFkPPW1ta3AoewRRY8APjB\nB2Wj4wJb3ZUh1ZZa6m6s4Jbdv38\/ffDggd8cdOXKlfTy5ctvDRJ7ly5dSq9duxbgiB7+8Cv\/iaI6\n09rbwIIV5QhFbe6dO3fSe\/fuhTojigzA0IULF8IRw28DjslevHgxPX\/+fPgOOPzhF\/9S0drP4IK1\nlBoVcPH27duhPogiNwN19uzZYAiDfYUkAw7HpM+dO5eeOXMm1LZFL\/iHQ+fzCByAIxS5ubSDmzdv\nhovMgho5depUMJAH2dt0x5GL4U6fPh38AIZfsgiHeIhiDYDVgqkHiJnQChCDTp48GQxgCIMxJM56\nAsr1LBx2mDS28VEqlcI14PANB\/WpLM4CcJIGJxjjSy5y8\/Hjx8PAPEicOKiUaMzvsvOJ9JE0WfpY\nKftCk\/4TMO6LI+dwBAEfLS0twR++Hc54FhUUznlxbXHxxIkT6bFjx8IxC+npNtA2tYnPrcGOsifB\ncFuBtIqJSt23HrVsWmO4I0eOhEk4nEW9WNDJoniVokOHDoUBWUiMYhxIKVE6vo56Vvu2yRp\/uTXc\nGqV5MWMcztPqcEePHk0PHz4c\/o7bkLiSgv6p97TxJbM8cOBAB0gGx9GUkd+sFVR2tguxjQcPgMka\nc9LrOg\/u4MGD4TzbhgqaVdHTBiQw+\/btewOSgRhzSIkdzhTbXZd1s3VjAuNkf7GDeQlh2+H279+f\nNjc3t9erL6SCZlVkZvxB9BhYLBbfgMQIkFwDVFFoti3\/+93thi3VVYrMD4B51IDDNj4cbu\/evR1W\neQFnXl\/UCAP37NkTIBnEYGYYR1OOAJxIjfVwfzlaafvewZiwwxEIfAG3e\/fuN1Y5XAU5K3rqgGTg\nrl27AiSDgPRoOqgclaydDOtuq26P0jFy\/HMM5lEDDl\/43LlzZwiS1ypcADYRdl+tGNmxY0e4mRkB\nGUfTQfX8nGGtpbyzNNtqZiMyXuXxt4MxYU+pw+GTY7b9FHRS6\/UFJOdbt25Nt2\/fHiDjaDooDnTf\nv1Edlmcjabsk9pij9AibIbC2LBgBwAdw27ZtC76A80UES0G5\/omoxat18+bNAZJBHs0sKJIxniAT\nbDUPsV+Bg2zlDrPfwVOU1pVeZ1kwAoGvLVu2BJv49xUulQpqjLOyq5WBmzZtCoM8mjEoDnCENLbB\nWs4E64vV9mT5UKvxGzltdSivMwcjANgnIE1NTe290GtVgHWkYrzCX\/La4iKpaGxsDIMY7KAYjGEd\nWEpk4x+NX2r6Q9HaZ9faofLACAS+OMZ9ER5laD6AVbpQGy8C6Bm0cePGdlAMeOpjWAfOk1\/nXodi\nsg6GXXxs2LAhZCNe4QpSot3NZwAO0wN9utcW0eMGBqxfvz4MzgONI9uVHCiG8sljGx+cZ1e4ovgX\n7alghT1GX9TGDZobMb527dp03bp1ubAO3JX8PoeKwbC9Zs2aUJ8OZn0xIWgEzzv9UIVzmtKS+AJw\nUOAwgjGEYYd1YBcQMUgM5FDYc7DVq1eHIMQNG\/+K5BLbJVX4A53WMFJLfF7cpH0ARletWhUMYjgG\n5ppHOCu\/5vc6FLZWrlwZJpNtPToWrQsMad+IRK88xmjAkry2gsMVK1YEwzhwYJeDx\/Jrfj9jEXao\nyWzr0UIKC8N\/cmbfLpTZU6Fag+riRu2wpKuhoSEIJy53nCe\/x8cBiu1s61GqEz1\/Z9t7yIoOz3hL\n9UCDHKew1\/pK9TbhXR8ndXV17aqvr+9U8X1kIW5P3np0XtLjbY7BdboBjt+ohkiqcBfmtRUM87en\nffny5bkCihSzQPJ6odks6Sfm9AhuQE9eYPrvCWryVxVzErcVN+7Qrmz\/ixX3Qm8\/+r6oH0nTrOYq\nevQCM+ct62g9H+cIsiXug3Ev7KwfxtfjFoQd1d4Se3YP7\/Hb1U4gK22GNWqm8+Wg1ftaVnm9LytF\nrc5SWmWlNLBPb\/uj\/4IYYhvU8XrqzFMal3UFG0vRbFJnWGRg1Ra1SgtAl79p\/gOTTfxOjWbf4wAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/esquibeth_note_1-1346982089.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

itemDef.oneclick_verb	= { // defined by esquibeth_note_1
	"id"				: "note_broadcast",
	"label"				: "note_broadcast",
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
	"no_auction",
	"no_click_sound"
];
itemDef.keys_in_location = {
	"n"	: "note_broadcast"
};
itemDef.keys_in_pack = {};

log.info("esquibeth_note_1.js LOADED");

// generated ok 2012-09-13 11:30:47 by ryan
