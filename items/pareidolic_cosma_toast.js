//#include include/takeable.js

var label = "Pareidolic Giant Image on Toast";
var version = "1345165103";
var name_single = "Pareidolic Giant Image on Toast";
var name_plural = "Pareidolic Giant Images on Toast";
var article = "a";
var description = "A piece of toast with what some people claim is an image of Cosma. Initially bought on GleBay.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["pareidolic_cosma_toast", "rare_item", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"quantity"	: "250"	// defined by rare_item (overridden by pareidolic_cosma_toast)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.owner_id = "";	// defined by rare_item
	this.instanceProps.sequence_id = "0";	// defined by rare_item
}

var instancePropsDef = {
	owner_id : ["TSID of the owner player. If empty, it has never been sold."],
	sequence_id : ["Which sequence in the rare item catalog was this one?"],
};

var instancePropsChoices = {
	owner_id : [""],
	sequence_id : [""],
};

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

function canPickup(pc, drop_stack){ // defined by rare_item
	if (this.is_racing) return {ok: 0};

	var owner = this.getInstanceProp('owner_id');
	if (!owner) return {ok: 0};

	if (owner != pc.tsid) return {ok: 0, error: "This does not belong to you!"};
	return {ok: 1};
}

function getLabel(){ // defined by rare_item
	var sequence_id = intval(this.getInstanceProp('sequence_id'));
	if (sequence_id){
		return this.label + ' (#'+sequence_id+')';
	}

	return this.label;
}

function onContainerChanged(oldContainer, newContainer){ // defined by rare_item
	if (newContainer){
		var root = this.getRootContainer();
		if (root && root.is_player){
			this.setInstanceProp('owner_id', root.tsid);

			if (root.is_god) this.no_sequence = true;
			if (!this.no_sequence){
				var sequence_id = intval(this.getInstanceProp('sequence_id'));
				if (!sequence_id) this.setInstanceProp('sequence_id', getSequence(this.class_tsid));
			}
		}
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "There will only ever be 250 of these in the game."]);
	return out;
}

var tags = [
	"no_rube",
	"no_auction",
	"no_trade",
	"no_donate",
	"rare",
	"collectible"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-18,"w":39,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMfUlEQVR42q1Y91eUZxb2P9izP202\nOTGxnGRjdmOLJbHrWhKNJWBDXQRFVFCCCENxpPeqMMBQnKGPMIJIdQAHAojUEaQNIEVUUDEYY8ru\n\/vDsey\/55hhDIrqZc+6Z9n3f+9zn3vvc+77Tpk3xFS+bPzdRNm9bous8T8kS3OblKV3n63\/PpGuV\nbh9ZJjjPX0WmPDLzT9P+iFeS0wfv8MNd5w8kui0AmfbcdhQoLUyWEbQReYpdyArbLP7b8Yv\/6Frp\nvhdN5blEHy9bPPe1gBFb5H2S+0JepO9mKv77Uzt+fGaAocoflYWBeDisw6AxF0UaN1QWe6IizwVV\nRf4Yu1eO757c4OsfDBWgqz4MT8Yq+d77\/eL7jVjoNQ4MUilbAIVscZ7zgdmrpgwuQTbPgYARA6MD\nRfzgRyM6NJS7o7XyLNSRFjDeSoe+0A\/OB+fiomIfejovCOCe6OvI5P9aauNRezUU\/R0ZwpEivp\/s\nbk8Who0Z+Pf3rXg2Xs9rJHt8jDDH+XCzmmX5UnCUJ+QZeUgPePq4BrfblOgxxKK5zBlFaYfgaDEH\nnsc\/RazPVtQWuOGs7RJEe22Du80i6ASLTXoveBxZCC\/7ZbiSYoeB9gu4d1uLbx5cMxk5TQzTGhSh\nFM+l8Dv+0e+DpAIg5kpUh\/B4pAw\/fNvIXtPD2+uCGGCu2gb1NSG4EHUAXnbLcW+okK2uPBIlF+VQ\nRVohS3mcnSCAsb7mGO7Lwf07BSZw44+qxHulCehwdw6HW+21DHKbOXCymPHO5OyJQtAEb8QP37WY\nHkbsUVgMFW4MsOyyHH3dqRi9W8hhvN2Vgzu9eabrJcAENkq+DYqAHagrckDz1\/4Tzg7lo6kunJ3s\n6UxjsMSkVEwK2VK4HnxfPzmD4oLGUh98\/6TBlC\/dTVG4eT0IDbXBqCmTo70pXjz0Kvras9Ber2Aw\nyUHmqL92TuRcMBoroxgogc5LdUKIywZcu3Qat1tj8Xi0HHcHczlfjR3JuG1MZyYJIBUOrZ\/htwoe\n1n+D495JQi0B\/PFZM4ydapHsybzY49EKjI0W4\/6QFt2tSRyyqiIfxHhv5iIhpiikklHeJQSas5M1\nZSEwVIexs1Qsfa0K8awCjI1cwYh43iPxm5SLtH6a96cIsJ8Hx32zfs1igtuCcQox3fDdN9WCqWsY\n7MvmUJJV6wKQFGyBMNdNqCr1Q4chAfqCAA4zvdM1btYLOQ8J6IgIZ6dIkTv9WvEcranQjA3B6G+L\nY+mhdPrPD20mgFn+Kxmg0\/7ZmEReFqioSKiCCSRJwaAxx8TM+bNbkRp9CEGnNzAoMmJ4oOcibjbG\nYHhgIhc7W1IQ4LgGyWEHkBi0BwNdWpOTUq4+FuyO3SsRbJb9olA0AWtxYs9stknFmVicqKjlrIHf\njtUh0Gk94gL2IC1yHy9KDEnVTTbcm4Wh2xrBUiYe3CsygaDQ032+J5azg\/Sdfqd7e5qiOP+ePaln\nBq+qD7Meqr3Xwn7XLJzYPWtg8koWPVLqIEQ7sXhdF8gy8ryOcSF0pXGVU26NP9JjZDifq7WrOZp\/\no3s0cbbwP7mMARKDVIAPhOQMdaezxo6P6E1irQlcJ0L7AWy\/nIEj26d7\/o5YL4gkgBTmp+N1GBXt\nytih\/gW4ztZE02dJ424b00TOJQg2c37ljKR\/lHPttQEc4pH+Qo4U5V2o4xJYbJgOszVvYefaNw2y\nI3\/+7WGCGLwkmj6xRw+ur4yA9oIdfE6sYHm503tJMJDKlUnSQVVOjI0Miz7brMSN8lDkJttBf8UH\nnc1qjNwpNoWW+jJp6jeiEUh5F2i\/hIGZC\/ty9RueL293AiDRTuGg3kodgULUej2Kq5UWo2okUFwk\nopXR98K0UzjvsZ4tPcqCAVaXBKKxNpyLq6X6PBoq5Hztk4d6HkAIYLTrMuzf9PbUwElyo0u1EiHL\nZNUvzHaayKGvz7H4UmH0GhQT4DpUuFHlC13mEaSF70K89xYGSAJP15JDuhxnvr8oS0hMyzkOMaUP\naa4E8Jj5LBzcMn1qAOmm8ozDQkZSTKrv\/K+\/I\/P8Xg4RFQex11btg4ZSZ3TU+CI\/2QrBp1bgktIS\nmvO7+BoprAVpthyF1BhLnogoxASw5rIbC3Oo48ewE5V7cu8UphkeUAXA1qpgkVO5eHg\/H0NdyaK6\n5nDXKEyxxQ0KU10Yyi4eRVWenchRL5RkOjJz2lgLZnN0MJ+ZLsv5iu+TWc\/FrXpqhz4Y7LjAACmN\nCGDgifkM8NiOd18+E9I4TgC76qNFiwpHeZ4cCQFmCHNZzeDI+\/abcWwR8s3IU1ujyxCH0osTAENP\nr0Lw6ZXMXsf1QMT5bhOj1yJRNIcnwp58AL1Chp4HGPLVgqkD5D2HADg+UoGO+iheLN5nM4eTNI8A\n3r9ziftyhMfnzGxSoBnifLYwOPoeeGo5M0jF0FodCI3iAHxPfgJVyHYo\/TYz0MkATmmq5g2OAPhg\nSMdTSFLAF5xTNDLlxO5FuOsaDIpBov2GAgoxLFDyex9fgkjXdQwuxn87X0MAySlikQpKpzkKVag5\nGvUR7DgBlIYDCaBs\/3tzpwSQPBvszkJ9RSSi5Z\/B1\/4TxPvvRF1ZOOL9PufqLMt2REaUOU\/OVEAE\n0vPoIiSFWXCxdLVcgLf9UjZyjPIyU1xPoGuLPbiFvghwihIzL48AlmicGUBKyA7IBQiaUtKibTjh\nMxVWKEo9JirzE84vYpHYk4aKGO\/t3B7Pn12PfJUtgpzWQXF2E6eAvwh107Ug9N7KNk0vrwSQRJr0\nqfdmEq4XOuNC0DZmh5o+DQnEiC73DEo1MiSE7oG\/42qxT7FmsCQlZMU5juwEOUPME2hiNTlwO+cx\n5WKXIYsB5gSvpQn6lQAOEMA7fQUoTbdFbsIB9ppGLFWEJbNSnndGdJV4ZpYWp2LIT7ODJsFWhHkx\njK1qBkbhz1Ac4b0LDQx67SncqovBkPGykK5sE0AXy\/fE9DJzfGobdTEkUI\/kPfDTJm5jVLlR7uuY\nySj3f6JNtDwSYl2uEyLcNzCrUniJJRLn9HMH+XuIy3p+J5F\/OFyKa\/lneMSS+jABdLcSDO6cpX85\ne2LUkgDSjDYmtKyrWSF6ZpLQsZM8KJD4UhehKq2+4sQFRMCJTfpcmXuCAdYWy3hHR7\/rMo9hoDOT\nJxjaq9CY9TxA2oNMCSCJtDRmdTUlij4cyr24rz2dhVdf4AtlkIWphVXlnUSJ1onzi0T6+RZnNCTy\nmE8bqZoiOUeC7qEhlUau\/wvgw+Ey0TP9MNibJraYKrTVTOw3eK\/7816YQNBUfKPcn1kikNp4S9Ok\n3W9MQVNtJLM+0JkhBo0INkN1JEfn9QDK5jlkBm9CUboTh+quUY2e5ggW2xivL0Q+bWKQBK4q9zSS\nhYhTeMmyVUeFRn6Bugp\/BqjTyqEO28PMJvpvM03gxamH0N2cZgKYGfAKAEmkL8fuxsV4G1xO2M\/V\nScJKOUi5Q5oW4LSaF47zFWOV52esbQSUWAz8agXrnaEmBvHB5gh3WcMAVcFforbEl1WhtsABWuVR\n0yyY6rf61QCSSFOV6XLcUJ7vgYuxh1BfE4TKq3IkigrVaV140b5uNaoKXNFc7sEM0xRDYKlQLqcc\nQ07C4Ym8TLCCQjiSHmEuctbeBFCaBV8LIOVIWa4Hj+2l2e64O5iDxsowISsu0MRbiercitryAMH0\nYdM439OiRKHaSgwWnyFDeQjnPDbiSoYD6r8OYaBqMczScUep1hlNldGvD5A27j9938LbRxJj6dyF\ngBBg+kyVOWi8hOTgXSzeVNl0kkCf6RiE7qNxPznYDFdE3yYna65OzJdjo1dZJaTzwVR\/KQdnql4K\nMOL4HD7doq3gxGHlTdHUqyfdoZG1NSjR360RzhSjoliO\/h6NySF6J5AElo5JbjUqucIpfejZtJuj\nI7fzsqXcSex3vuswpU4S5Th3nE6a6DCHKu15I8C0AO32yJ4+rkdvWzru9ml4Prw3kC0mniC+hrem\nYkc3sQvM+xl4JT9DCm9e+AacOfwhb9Std8+Y2lGw7Za35kafXqiPdVnIoxBtqF88WybvpTPo0hRr\nVOU4sNVclvHiz1vVJRfkKixQk++KhhJvZAVt4GcQe8mea3lIOGo2c+CVz6g\/X\/vXd8xW\/sVh36bp\nKucD\/9A77nl\/wNPmI3jafIhzpxYh\/OR8dkAlX\/ybh+QvGjlL96T7ruK9sPXWGdi38W2YrXzDctof\n9SLgO1a8sYoeSvvY7avfiiQHTlt8aLDf\/QFeZtLpgRlv0t80EAkvW\/N\/JjaREFWSH4QAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/pareidolic_cosma_toast-1343937461.swf",
	admin_props	: true,
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
	"no_auction",
	"no_trade",
	"no_donate",
	"rare",
	"collectible"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("pareidolic_cosma_toast.js LOADED");

// generated ok 2012-08-16 17:58:23 by mygrant
