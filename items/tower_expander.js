//#include include/jobs.js

var label = "Workbench";
var version = "1340834184";
var name_single = "Workbench";
var name_plural = "";
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
var parent_classes = ["tower_expander"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.construct = { // defined by tower_expander
	"name"				: "construct",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Construct a new floor",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		return this.offerJobs(pc);
	}
};

function configureJob(class_id){ // defined by tower_expander
	if (this.has_job) return;

	var id = 'proto-'+this.tsid;
	var job_class_ids = {};

	job_class_ids[class_id] = {in_order: 1, class_id: class_id, delay_seconds: 60};

	this.container.jobs_set_street_info({id: id, type: 1});
	this.container.jobs_set_class_ids({ id: id, job_class_ids: job_class_ids});
	this.updatePlayers(id, class_id);

	this.no_post_project_delete = true; // stops jobs code from deleting this stack
	this.has_job = true;
	this.broadcastConfig();
}

function myJobIds(){ // defined by tower_expander
	// list of job Ids which this item handles
	return ['proto-'+this.tsid];
}

function onJobComplete(job){ // defined by tower_expander
	this.container.tower_end_expand();
	delete this.has_job;
	this.broadcastConfig();
}

function onPlayerEnter(pc){ // defined by tower_expander
	var jobs = this.getAvailableJobs(pc);
			
	for (var i in jobs.given){
		var qi = jobs.given[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.open){
		var qi = jobs.open[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.delayed){
		var qi = jobs.delayed[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-52,"y":-50,"w":107,"h":50},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGtklEQVR42u2X2VNTVxzHsXZqrQsV\n1IAEQkJI2MkeEhKWhBiWsIctLAkEEkJYExaRNRAIiwUVxQUqKqMtztTOtA996Qxtp9NOrUvffOw4\ndfpa9R\/49XeuFyZgp7aj05fmN\/Ode3PvPed8ft\/fOefeBAUFIhCBCEQgAvH\/jr7G5My5HukrmnHJ\nUtfX11M3NjbG7t69a\/6vufb4uqWWyXbJr75uOUx1ymDOlUZptl8PcyMNcGV5ERAO1lbPw\/KcEyac\nYvB2SHbrD+xjc0sep3hzrBXleHkcx+OwXbzp7ZBS94btws2a3Ji\/TXbPRIdE6G2XPZpvFcFEuxTG\nOnPA02uEicFm8HlHYWFhAZaWlsA74oTxLg142sQw0y2jNN0phVFsN2J\/KXKPgJLjVpIzPXIYw2eI\nyLNDNiF1PN0sgMpcDpRoWRPI8S6tvdtgqHdGHULPmEMEC0VcGFSEwYD6BHjU4TBeqYXTXW3Q0WaB\nXlsO9FpSqMGmOqSAzlDnkyQZHIj89ndxC5j0S0AnnAhMu01cJ4BdtUkUXIWeA4asyCpk+QC1H\/U+\nBTfmkHDme9N\/+agvHebcSvA2pMCong1XjAlwqTIRvOoI6Ms4Af2NKdvZb2nELqQGIRpHAA8tLB8F\nQs6nu+Qw61KgezhFUKQyBJrAk2QNmVFQnR8D+erI28hzBBWMOoQ6QAD3WotiuM3lfPCXpYQHJl00\nVKmZYMqOhKZSHnTWJlLqoDVgFcBpm2iHRhFspkfxiqa7yRxWwJYJPrw26pBQrpXp2KBXMkGfHvks\nhnmYi0yhNOhhAvgesVOniJjKUZzwFWRFfV+aE41ZRQJegzwVk8qQlKAMr1eis1V4Xmfg7pClJBYa\nMQmSXIvxpRxV8dBuSoC26vhtkfu2ijjKANJPnjoSirNZVN\/lOjIH2WeQh0FDfhhE1\/kgbWuotYw3\nT9wqx6wKs1hgM8ZTZSC\/SWc6BRPkqVEP0iWcVXEyYzKRe8S5pXQhY5XWyg6JGFf9pRIxrhATCBQZ\noyafC7UFXISPg7rCWFAKQqXIchwVEkRPxkO0pcfclqSvuuqS8OF4dIsD7TUJ67MuGXTXJyNgFGTK\nOZCRxnsoSWWfZxwLJhM6i1amnzL8pPaTCpWOUljRyXqEMRfzoDqP+3igKRXIuE1lfITkbvi5GLT\/\n2mL99PVFy62b5yxP5txp4DIng6M6kWpckJ2w3GxM\/NlUwL8vF7AeHAs5aKQHzqTBsncpa5d2g6tO\nKiIaRnFVEyDiGJb2nscp+pqs9BZjHFgRUpPOm+ezGGwK8IK3+sv1841waaoC5t1yapXZKuKxMf95\ndGSIHp8RomQkc9qFNwIs1bKcZJyBZhHOWz4p83qhhvfUZRbgYoz7Tatg\/6BVJXRmK+IyKUAuN4Tp\n7St6Nu3WUIBkhZFMSrXR1\/F+8tsELNKlTLXVij4l45y2iSnAgkzWMt6LR5EVHI2K2FFiMgfLcgVt\nQ3bpE9Jw1q2iJmy6MHz6bQG21mcM9Tl0DzubsmHQrqSMGLJLKMBMaXjnawHJIsHN9slkuxh8LhWU\n63lQVyZ\/ujheMbQ6X3f5xqLlG0ulsu3fAraYVF1rC+ZHH59pgCVvNbhacqDbLMVXnwT3USGYcAUr\nU8MaXwvIZh5PcTfJYGWuDq4vmuHWUhPcPGuBL9Yc8MlFK6zM18PaQgOMuwu\/9Q2WflddIrb6gfwl\n3NW52rU7l1rgBvbj7S8GW60aKgvF0GN++epzWwTU9pWl5K\/\/IwcNmhRRn133zHeqBGaHyuAqwhK4\nz1bscOdyC1z2maDfcRKlh4tTNTA9ULLR2qBujwgLNtLOUtvJWI\/h2vxw+e8Lo0ZYmqwCt00H9toM\nhJNASa4AbJVJ+HEhhe4GAeRnsF\/IhJyZ0NDDZO+LQbFowB374EF61w41aJKHB525VCm6mjTbaqlR\ngalYCs149LgKgZTs9gUrrJ9rBKcl60VqQoQN20tQUo\/bcH+oIw9IogSuuVpFOZebnXBfnMpy4zNi\nlIDMb3FKtDmGFUbc56CidrkXvAV4gH7vkc36qCyFpVFKOOUaJW8sR81f1Kr457TquOsFmqSfuq2a\n52dGymGytwhOtemhoTwN8jVJ99hRITpsm4hKGmzXf04A0WGoLZWDQZv8OFsZuxwSsl9BP0PKyadL\nyt4FdtTvPUy+aoL2+bl4mHaSWHuMbhCOYtKdsBiMA8lmo9zdYcn6EbeMs4J4Zj6d\/ZZiMqSxGRUG\nsclSoTCpZBwDDcKlS8ih51kU3W84Xc6jfl8yB2mmfYH\/NIEIRCACEYg3iz8BXY18IA9Fj7IAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/tower_expander-1340834365.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
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
	"no_auction"
];
itemDef.keys_in_location = {
	"c"	: "construct"
};
itemDef.keys_in_pack = {};

log.info("tower_expander.js LOADED");

// generated ok 2012-06-27 14:56:24 by cal
