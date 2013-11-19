//#include include/jobs.js, include/cultivation.js

var label = "Jellisac Mound";
var version = "1347907556";
var name_single = "Jellisac Mound";
var name_plural = "Jellisac Mounds";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 300;
var input_for = [];
var parent_classes = ["proto_jellisac_mound", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "jellisac_mound",	// defined by proto (overridden by proto_jellisac_mound)
	"job_class_id"	: "job_cult_jellisac_mound_2",	// defined by proto (overridden by proto_jellisac_mound)
	"width"	: "264",	// defined by proto (overridden by proto_jellisac_mound)
	"placement_set"	: "all"	// defined by proto (overridden by proto_jellisac_mound)
};

var instancePropsDef = {};

var verbs = {};

verbs.remove = { // defined by proto
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Remove from the location",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'wine_of_the_dead' && this.hasInProgressJob(pc);
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.container.pols_is_owner(pc)) return {state: null};

		if ((!drop_stack || drop_stack.class_tsid != 'wine_of_the_dead') && this.hasInProgressJob(pc)) return {state: 'disabled', reason: "Pour some Wine of the Dead to cancel the project first."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.hasInProgressJob(pc)){
			var it = pc.getAllContents()[msg.target_itemstack_tsid];
			if (!it) return false;

			msg.target = this;
			return it.verbs['pour'].handler.call(it, pc, msg);
		}
		else{
			pc.prompts_add({
				title			: 'Please Confirm!',
				txt			: "Are you really sure you want to remove this "+this.name_single+"?",
				is_modal		: true,
				icon_buttons	: true,
				choices		: [
					{ value : 'ok', label : 'Yes' },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_location_callback',
				itemstack_tsid		: this.tsid
			});
		}
	}
};

verbs.build_tower = { // defined by proto
	"name"				: "build tower",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Start a project to build a tower here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid != 'proto_furniture_tower_chassis') return {state:null};
		if (this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.restore.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.restore = { // defined by proto
	"name"				: "restore",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Start a project to restore this item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'proto_furniture_tower_chassis') return {state:null};
		if (this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerJobs(pc, msg);
		return true;
	}
};

function onRemoved(pc){ // defined by proto_jellisac_mound
	if (pc){
		pc.runDropTable('cult_remove_jellisac_mound', this);
	}
}

function getEndItems(){ // defined by proto
	//this.container.geo_placement_get(this.pl_tsid);
	return this.getClassProp('item_class').split(',');
}

function modal_callback(pc, value, details){ // defined by proto
	if (value == 'ok'){
		if (this.hasInProgressJob(pc) && details.target_itemstack_tsid){
			var wine = pc.removeItemStackTsid(details.target_itemstack_tsid, 1);
			if (wine){
				wine.apiConsume(1);
				this.resetJob(pc);
				pc.sendActivity("You poured Wine of the Dead on a "+this.name_single+" and canceled the project.");
			}
			else{
				pc.sendActivity("Where'd your wine go? I can't find it.");
			}
		}
		else{
			this.removeResource(pc);
		}
	}
}

function onCreate(){ // defined by proto
	this.setAndBroadcastState('depleted');
	this.setJobData();
}

function onPlayerEnter(pc){ // defined by proto
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

function setJobData(){ // defined by proto
	if (!this.container) return this.apiSetTimer('setJobData', 500);

	log.info(this+' running setJobData');
	if (this.getClassProp('job_class_id') != '' && this.getClassProp('job_class_id') != undefined){
		var id = 'proto-'+this.tsid;

		log.info(this+' setting street data');
		this.container.jobs_set_street_info({id: id, type: 1});

		log.info(this+' setting class ids');
		var job_class_ids = {};

		var class_ids = this.getClassProp('job_class_id').split(',');
		var phase = 1;
		for (var i in class_ids){
			var class_id = class_ids[i];
			job_class_ids[class_id] = {in_order : phase, class_id: class_id, delay_seconds: 60};
			phase++;
		}
		this.container.jobs_set_class_ids({ id: id, job_class_ids: job_class_ids});

		if (class_ids[0]) this.updatePlayers(id, class_ids[0]);
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"proto",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-104,"y":-151,"w":228,"h":145},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIJElEQVR42u2XyW9b1xXGjSDxIMnW\nyEGc+TiKFMn3SImjOJMSNXCUREqUZQ22Rc9SPUVWLdOWxxhNnMJoAxRF7SKLBu0if0AX2npRIIsC\nWXTjVVF05UWz\/3rulR3YsReJk9Rd6AIH7z2+R73f+b5zzqX27Nldu2t37a7\/7zWd8bWXs1Kcxezo\nYPzFOfv8ncNVc76FmdGBp\/UxP47kg2DHqayXRzktPqtkxOb\/HHRl2tee8tubSb\/tWUgUEPQYEXAb\nER+wYizaz0HnJwKYzEiovIi0+GUpLa4yZX9WuPpYoFhMis8I6htB0\/WNUd0JnbIdPR0tkHe1wqaX\nIR2049hkFIcJciY38Croc9ifRdW5QnAhN+SEaFMRSA8YHIvu9gPYv\/d9tOz7AAdb9sKi60Fi0Irl\nyhAWiyGuJrP8ZchyRvzqp621YW9zyGvmL2dh1naTch2QdbaglaByxRg8ETtk8k60tXxAz3SBPc9g\nlssRVEd8r6rIQ2z+JHBHCuFH6WAft89KyolWJfqMMmjJ2k6ydXXrKCYvpbHQzGN2rQClsgtaxSHY\nDTJECbI+HuAqMsiXleRNlJL0bw2WCNhWJxKep2HRBLNORla2QNndBqcgg9uigEHVgYGsA+f\/OIu1\nLypo\/LaIiWNp+Efc0BO8WduFPoJM+W1cRVaPDJIdX7a6nJQ8Pxgu4xPaI6Il67aq4bKoqAEO4mDr\nPrS37eegzGKB6i+\/HMfm4+OoXsuifm8E4+f88KUcHJCpzFTvNyk5zPzzpvmu3UzJt4J0WeSCaNdA\nq+pGIOVENOOHYNOg9cBe6tpWGNTdyNRDmLk6isnNFA5\/HMPM3RT8430ckKnsMilgoWRYPbLOZkqy\nMfSa3W\/TNCHJEHdZlBhfTKDUyGL5bgXZ+SGM1KK8W1k9mq1ylE+PIFH3o3Yrg9LxDDVKO9VgBzWK\nDE4CZEoyq30OHTJUy0cKIRyjDp8b9\/+4pskGhNX0sISlj\/K48GgaC5+MYPZmGiMLUci62kBzkF7c\nA0dIjfFTARj7ZOg4uJ+ry2rWZlDAblTwcyM9a9ZSkxnkBKwAG1dsBNXI8ulh706M+J79IMC03\/Rl\njjqwupnG\/MfDmGlmUb0TpXpLQWvogomawGtX8WZhs5AN6l5qIpdZzj8Xbb3QkJptVBIKWSfBH4Be\n1QkPucLqktm8VApzq9kwZ5BsL\/\/+XewzIpx2oPJhGPnLIUzfjCK\/6UViVoSip413KQNhwcaKggDt\nZLvfqYbfoaZulyMzGsbSjQpWbleRm4nDSja7zAo+6MOi8dtB\/gJ2qRz6foCZgKk4HDQjnXGjcGEI\nubkYxmeSOPWgDOegFl2kmJ3s7acac5MifKQYd8ZP0KUlSA18YQeWNyZx\/FoNC7cnkDkaxHAtBn1v\nB4e36bsxSlYzMLYtspockoyvdPPnm0Nv7u6UT3iU8AmIBS3I5kNITHqRWw7Cl9NDpWgntdq4hQOk\nlEQKWnTdHNAh7NjLVMpORXHiYRUrvxujGZlHcd2HxFERdruaK8gSZHZPPt9tol4Bffqe7a\/\/sBT\/\n\/GJo+9GlMB5TvBEw5jE8jbj1iHoMXB2V5hBsbhWfgbLOVr7dMTi3tZcDsrnYT7XHdg8G2G+SI5T3\noPGghJl7KVSbFFsxVM5nqPOVcBjlcFMSHlKc7Uzs6KTP+inBY0kdfrMaw2fnhnB\/UXwdcNhv9CS9\nRhAkIv06+qKChvLO9sWGM8vcQUXO4Ji9LjNZTF3K7GUv8vWpCF4Db8KJ0kYAoycimF7PotZMIz03\nCB01CqtTpt4OnJKD9RFgxKHE1SknruRNOJ8z4ExWjz2\/Py3pv2gmtv\/UTHz1+Er02clxO1j9Zfwm\n+Ps0cJvYH+pFqF8Lsh5e+jXjEBQ8XBTsvknVBQeNEKYca5CIR4dw0obMcgCFehaNS3VUr8fhlDQ8\nyTDVKYei77BhXgjq8WHRimbZhlWCOp3WoZHQ4tSYFXv++ueV9vXpflw\/LGEtZ8LlKRfOTtixUfNg\nMiogIWo5RNCpRci5c87CY94Bd9OR7RbsRQzQRwkEKZmoJECvkUFKCMgcGYQ7rOF7Ob9Pf8dnV6Ic\nJrCSHWsjBg51NqPHCoGx49mM7u+zWdtH3NaHC87tGxUzzg4bcTyu4fJeHDXgasmCW9NW3J+147Oj\nHlycsODqpAMnc2acoSQWM2bkKfvcgAaFkIHU68XgcwVjkgEhUkpHpTEZN+HWMR\/uNgaxMS\/hRt2D\nu7NOrOfNOEeKNZJaDnh5zIgTSe0\/cu7uO6LmkIXQ3ueAm7X+7etzEhpZAStxLS6NGrFZNOGXeQG3\npiw8rhZMPLYqFtwom\/l9ds2eYXG75sCDBQn3D4v4dNGLTyhu1iUeW7Nu3KvZcGXChKNZSi5nwVJU\nzeFOpXQMiqn2r6yzZ4twbBStrzTGhZJ9+1zehrmYDjMBJRYiav7FC6Tk+riAayUTh2JAzZKZA7Fs\nr0ywe2ZcovNfDDPVjdige+z6Oj3PYn3CiIt0fZHU2qyLWEwJz9+hwsKQGrWA8m8FSX6SMHQU+944\nVm5VjPqTSU28Hu595QfkyaTKVvXJSwlr5+mCR35ibVh3Z2NCuEMgv2okNH85ndY+WYyon8yHep9Q\nSfyHJbMDtZMAS4ol06TjbSqVJpXRcsqAqp9+gvkU\/4zZOufoNZpvrfwR67uZvfeGa1nc2lEuSrKp\noiRvVHzyrblg76\/rAeXDM+PWrz9dS+FOg37+R3T\/dmkOHn\/Nxnew3ntZmesVc3N9TGjOB5Un6PLd\n\/1O\/u3bX7tpdO+u\/sFVOCSAJmAcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_jellisac_mound-1333485710.swf",
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
	"proto",
	"no_trade"
];
itemDef.keys_in_location = {
	"u"	: "build_tower",
	"e"	: "remove",
	"t"	: "restore"
};
itemDef.keys_in_pack = {};

log.info("proto_jellisac_mound.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
