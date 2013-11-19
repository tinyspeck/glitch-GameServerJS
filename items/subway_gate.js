//#include include/npc_conversation.js

var label = "A Red Button";
var version = "1346109020";
var name_single = "A Red Button";
var name_plural = "Red Buttons";
var article = "an";
var description = "A button on an old ruin — but still operative! — subway gate.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["subway_gate"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.transit_id = "";	// defined by subway_gate
}

var instancePropsDef = {
	transit_id : ["To which system does this gate belong?"],
};

var instancePropsChoices = {
	transit_id : [""],
};

var verbs = {};

verbs.push = { // defined by subway_gate
	"name"				: "push",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Buy a ticket",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var transit_id = this.getInstanceProp('transit_id');

		pc.announce_sound('SUBWAY_BUTTON');
		if (!transit_id){
			return pc.sendActivity("Oh no! This isn't setup correctly!!!!");
		}

		var cfg = config.transit_instances[transit_id];
		if (!pc.achievements_has('you_have_papers')){
			var choices = [{txt: "OK", value: 'no-pay'}];

			var txt = "I'm sorry: without Your Papers, you may not use public transportation.\n";
			var choices = {
				1: {
					txt: "OK",
					value: "ok"
				}
			};

			this.conversation_start(pc, txt, choices);
		}
		else if (pc.buffs_has('dont_get_caught')){
			var choices = [{txt: "OK", value: 'no-pay'}];

			var txt = "I'm sorry: public transportation is not available to those engaging in journeys of dubious purpose.\n";

			this.conversation_start(pc, txt, choices);
		}
		else {
			
			var next_station = this.container.transit_get_next_stop(transit_id, this.container.station_stop);
			var previous_station = this.container.transit_get_previous_stop(transit_id, this.container.station_stop);

			var txt = "<b>Train tickets 50C.</b> Which line would you like to ride?<br />\n";
			txt += "<b>"+cfg.forwards_name+"</b> Next Stop: "+next_station.name+"\n";
			txt += "<b>"+cfg.backwards_name+"</b> Next Stop: "+previous_station.name+"";

			var choices = {
				1: {
					txt: cfg.forwards_name+" ("+cfg.fare+"C)",
					value: 'pay-forwards',
				},
				2: {
					txt: cfg.backwards_name+" ("+cfg.fare+"C)",
					value: 'pay-backwards',
				},
				3: {
					txt: "No thanks",
					value: 'no-pay',
				}
			};

			this.conversation_start(pc, txt, choices);
		}

		return true;
	}
};

function onConversation(pc, msg){ // defined by subway_gate
	//log.info("******************onConversation", msg.choice);

	if (msg.choice == 'pay-forwards' || msg.choice == 'pay-backwards'){

		if (msg.choice == 'pay-forwards') var direction = 'forwards';
		if (msg.choice == 'pay-backwards') var direction = 'backwards';

		var transit_id = this.getInstanceProp('transit_id');
		if (this.container.transit_has_paid_fare(pc, transit_id) || this.container.transit_pay_fare(pc, transit_id)){

			if (this.container.transit_enter_instance(pc, transit_id, direction)){
				this.container.transit_process_fare(pc, transit_id);

				return this.conversation_end(pc, msg);
			}
			else{
				this.container.transit_refund_fare(pc, transit_id);
				return this.conversation_reply(pc, msg, "Huh, train's broken!");
			}
		}
		else{
			return this.conversation_reply(pc, msg, "Whoops! Looks like you can't afford that.");
		}
	}
	else if (msg.choice == 'no-pay'){
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'ok'){
		if (pc.achievements_has('card_carrying_qualification')){
			if (pc.items_has('your_papers', 1)){
				return this.conversation_reply(pc, msg, 'You have acquired and activated your <a href="event:item|card_carrying_qualification">Card-Carrying Qualification</a>, and you have <a href="event:item|your_papers">Your Papers</a> but you need to complete them. Try clicking on Your Papers in your pack.');
			}
			else if (pc.mail_has_item_pending('your_papers')){
				return this.conversation_reply(pc, msg, 'You have acquired and activated your <a href="event:item|card_carrying_qualification">Card-Carrying Qualification</a>, and you have purchased <a href="event:item|your_papers">Your Papers</a> at auction. Find a mailbox to pick up Your Papers and activate them.');
			}
			else{
				return this.conversation_reply(pc, msg, 'You can get <a href="event:item|your_papers">Your Papers</a> at the Bureaucratic Hall on <a href="event:location|58#LLI32G3NUTD100I">Gregarious Grange</a>, or you can avoid the red tape by getting them from another player. Hint: Try <a href="event:external|/auctions/">Auctions</a>');
			}
		}
		else if (pc.items_has('card_carrying_qualification', 1)){
			return this.conversation_reply(pc, msg, 'You have acquired your <a href="event:item|card_carrying_qualification">Card-Carrying Qualification</a>, but you need to activate it. Try clicking on the Card-Carrying Qualification in your pack. After that, return to the Bureaucratic Hall on <a href="event:location|58#LLI32G3NUTD100I">Gregarious Grange</a> and purchase and complete <a href="event:item|your_papers">Your Papers</a>.');
		}
		else if (pc.mail_has_item_pending('card_carrying_qualification')){
			return this.conversation_reply(pc, msg, 'You have purchased your <a href="event:item|card_carrying_qualification">Card-Carrying Qualification</a> at auction, but you need to pick it up from a mailbox and activate it. After that, return to the Bureaucratic Hall on <a href="event:location|58#LLI32G3NUTD100I">Gregarious Grange</a> and purchase and complete <a href="event:item|your_papers">Your Papers</a>.');
		}
		else{
			if (!pc.quests_offer('card_carrying_qualification', true)){
				pc.apiSendMsg({type:"offer_quest_now", quest_id:"card_carrying_qualification"});
			}
			return this.conversation_end(pc, msg);
		}
	}

	this.conversation_reply(pc, msg, "Not sure what you mean there...");
}

function onCreate(){ // defined by subway_gate
	this.initInstanceProps();
	this.dir = 'left';
}

function onLoad(){ // defined by subway_gate
	this.dir = 'left';
}

function onPrototypeChanged(){ // defined by subway_gate
	this.dir = 'left';
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-47,"w":28,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEO0lEQVR42s2Y309aZxjH+Q9cf9h1\npqtaXWvrOg4cWyktIEjBKYI\/OKAckGmholYRKVCVXwprKdD2ouk1N0t2ye3SxHDXZFlasi1r06aV\n\/gf8Cc943+awg56Ba\/aib\/K9ITnhk+f5Pj\/eVyQicIJBnzMUWC3E4xsx0VE6gYBPhcAi4SA8TG1B\nNpOEIwHm9\/vbg8HVfHgzAPd\/jEEkHIC7\/mVIbG\/C4\/R91aGCVSKWQ2CJ7TCGmptlwc5asDzzs5DJ\nJJ80HSwUCrVUIhbbWPfjiIWCXnDOTFXB+Mqkk8WmwuECCPrKW\/ENnEK3a0YQjFM8dg+y2WR7E6K2\nJg4GVovRSAiSiQisLM\/XBeOE0p7NJpzEfYbSGYuGDgxW48N0IkcM8AcnW\/bMzzVMZT2lHsTLxACl\nEqoo6+\/7bDikjfU1ePRoW0wGUErlaCkF01OTDUHYiVGYG1JD2jYO4Rlr9felRRdk0wkvKcAYAjQZ\nhwWhrJYJGBnWgVVOw63uNnhuUsPuPAulFRcUl13wzO0Al92K0lwgAiiRSFQIUK8bFARUKeUwcbET\n2LYv4GdtP7yfHoLSggM+rnmqKty5hXtlKpVqIQHYjgAVN67tgxs1DIG2Xwq+zhPg6WiF1xYdvB9T\nwAf7KJS87hrIpwt4qphIFUrpSp9UMHp2aQ94zh6Hzctd8MYgw4BYZg3suq04mkiv3DZ4GAmSGXuV\nCOZRFM2TxhrvXZdfhbvfnoXbXx+DaPcp+OPmd\/8A7tHbMSX85POUiBaKYURfBZycMGLA7YunMeAz\nqhN+U3T\/K+Sbkauws+gkM\/a4QtGolfsAH\/R8iQGf9rZhQKSXqgvw1xC9D\/IXmwGi4ZCXVJpBfq1f\nEHCp\/TiEzrVWATm9GuiBovoS\/Kmj4HftZfiVHYW11cU8GUAJVeA3bD6gv1LFC5VC2Qu4V28dRriz\n5C43pWFzgPd6z8DW+VO4D+7IOhsCom\/9\/iUiPhQjQO3gAP4TxjyGAa30JUEfCmnHZfs0ElmLk1Q\/\nLPMXBwSokvXhSo5+0wpzZ47VBcw4zJ++tVnyTemH6oEbGHJWch5Hcb3rJOQUYnht1cNLTW8NXF7W\nVdPkGYb5\/8ceTVFeBDj8\/U38J2hJQICcFxHkSscJyKlo2PXY4Z1zHF4YFRC78BUs6JW1mw+JNHM+\nVCmv10wTLtVucTfc7jiJC6aqc6eBHdbuXzRIpRn5kD+X9TpNFVJIqJiE90em3BQfTk+ZK5uOTBAO\nwdddcEmkmfOh0FzmCxUQgq8PyDwh5kP+XOb64qBGiYWKpzGchdxVFPmQP5f\/m5iyY5oh+17D+fAg\nF6maqNmYot1uFYtIH24uj48ZDg5YaStEmvPnXKQE4Jr7kEnTdAu\/Ydfzm81mNokO46CLVN0Xh2am\n9CAL7JGIWuNCYQqHGjX+oSjKVFMoNsYrOkqHe3FQKuRlkr3tb4pvvG0J2YMTAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/subway_gate-1346109087.swf",
	admin_props	: true,
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
	"no_trade"
];
itemDef.keys_in_location = {
	"u"	: "push"
};
itemDef.keys_in_pack = {};

log.info("subway_gate.js LOADED");

// generated ok 2012-08-27 16:10:20 by mygrant
