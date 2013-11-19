var label = "Dust Trap";
var version = "1345758614";
var name_single = "Dust Trap";
var name_plural = "Dust Traps";
var article = "a";
var description = "Found in Baqala, intrepid explorers lucky enough to get caught in the snap of a dust trap are rewarded for their exploration with gifts and ancient remnants, which will allow more time for intrepid exploration.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["dust_trap"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.trap_class = "A";	// defined by dust_trap
}

var instancePropsDef = {
	trap_class : ["Class of the dust trap"],
};

var instancePropsChoices = {
	trap_class : ["A","B","C","D"],
};

var verbs = {};

function doDrop(){ // defined by dust_trap
	log.info("Running drop table");
	var table = "";

	switch(this.getInstanceProp('trap_class')) {
		case 'A':
		default:
			table = 'dust_trap';
			break;
	}

	// First, check chances of getting an organelle:
	var check = Math.random();

	if(check <= 0.13) {
		// vacuole
		this.pc.sendActivity("You found a vacuole, a remnant from your Glitchian ancestors. Your time has increased by 10 seconds!");
		this.pc.give_baqala_time(10);
		this.pc.quests_inc_counter('organelles_found',1);
		this.organelleOverlay('vacuoles', 10);
	} else if(check <= 0.23) {
		// endoplasmic reticulum
		this.pc.sendActivity("You found an endoplasmic reticulum, a remnant from your Glitchian ancestors. Your time has increased by 20 seconds!");
		this.pc.give_baqala_time(20);
		this.pc.quests_inc_counter('organelles_found',1);
		this.organelleOverlay('endoplasmic_reticulum', 20);
	} else if(check <= 0.30) {
		// golgi apparatus
		this.pc.sendActivity("You found a piece of the golgi apparatus, a remnant from your Glitchian ancestors. Your time has increased by 40 seconds!");
		this.pc.give_baqala_time(40);
		this.pc.quests_inc_counter('organelles_found',1);
		this.organelleOverlay('golgi_apparatus', 40);
	} else if(check <= 0.35) {
		// Mitochondrial DNA
		this.pc.sendActivity("You found super old mitochondrial DNA, a remnant from your Glitchian ancestors. Your time has increased by 60 seconds!");
		this.pc.give_baqala_time(60);
		this.pc.quests_inc_counter('organelles_found',1);
		this.organelleOverlay('super_old_mitochondrial_dna', 60);
	} else {
		var items = this.pc.runDropTable(table, this, null, {x: 10, y:-105});

		// Log dust trap drops in the action log
		for(var i in items) {
			if(items[i].class_id) {
				apiLogAction('DUST_TRAP_DROP', 'pc='+this.pc.tsid,'loc='+this.container.tsid,'item_class='+items[i].class_id,'count='+items[i].count);
			}
		}
	}

	// Players got an item. Now check to see if they get a bandit!


	// Check for jujus
	var chance = 0.0;
	if (this.pc.baqala_times && this.pc.baqala_times.offer_quest) {
		chance = 0.5;
	} else {
		var buff_time = this.pc.get_baqala_buff_time();
		if(buff_time < 3 * 60) {
			return;
		} else if (buff_time < 4 * 60) {
			chance = 0.1;
		} else if (buff_time < 5 * 60) {
			chance = 0.15;
		} else if (buff_time < 6 * 60) {
			chance = 0.2;
		} else if (buff_time < 7 * 60) {
			chance = 0.25;
		} else if (buff_time < 8 * 60) {
			chance = 0.3;
		} else if (buff_time < 9 * 60) {
			chance = 0.35;
		} else {
			chance = 1.0;		
		}
	}

	if(is_chance(chance)) {
		this.pc.apiSetTimer('juju_bandit_curse',1000);
	}
}

function doPlayerResponse(pc){ // defined by dust_trap
	var wait_time = 0;
	var min_time = config.is_dev ? 5 : 180;
	var max_time = config.is_dev ? 30 : 3600;
	var full_reset_time = config.is_dev ? 60 : (60*60*24);

	switch(this.getInstanceProp('trap_class')) {
		case 'A':
		default:
			wait_time = 5;
			break;
	}

	if(this.ready) {
		if(this.ready_time) {
			var reset_time = 2 * (time() - this.ready_time);

			// Minimum time three minutes. Maximum time one hour.
			if(reset_time < min_time || reset_time/2 > full_reset_time) {
				reset_time = min_time;
			} else if (reset_time > max_time) {
				reset_time = max_time;
			}
		} else {
			// Just go with minimum time
			var reset_time = min_time;
		}

		this.ready = false;
		this.pc = pc;

		// Track average reset time
		this.logResetTime(reset_time);

		this.apiSetTimer('reset', (reset_time * 1000) + 250);
		if(pc) {
			pc.announce_sound('DUST_TRAP_SMACK_DOWN');
			this.apiSetTimer('doDrop', 750);
			pc.achievements_increment('dust_trap', 'trigger');
			this.apiSetTimer('smackDown', 250);
			this.apiSetTimer('stayDown', 2000);
		} else {
			this.stayDown();
		}
	}
}

function logResetTime(reset_time){ // defined by dust_trap
	if (!this.reset_times) {
		this.reset_times = [];
	}
	if (this.reset_times.length >= 50) {
		array_remove(this.reset_times, 0);
	}
	this.reset_times.push(reset_time);

	var reset_avg = 0;
	for (var i in this.reset_times) {
		reset_avg += this.reset_times[i];
	}

	reset_avg /= this.reset_times.length;

	log.info("Dust trap "+this+" reset. Time: "+reset_time+", average: "+reset_avg);
}

function makeReady(){ // defined by dust_trap
	this.setAndBroadcastState('idle');
	this.ready = true;
	this.ready_time = time();
}

function onContainerChanged(oldContainer, newContainer){ // defined by dust_trap
	if(!oldContainer) {
		this.setAndBroadcastState('idle');
	}
}

function onCreate(){ // defined by dust_trap
	this.initInstanceProps();
	this.apiSetHitBox(25,200);
	this.ready = true;
}

function onPlayerCollision(pc){ // defined by dust_trap
	this.doPlayerResponse(pc);
}

function onPlayerEnter(pc){ // defined by dust_trap
	// If no one else is here...
	if(num_keys(this.container.getActivePlayers()) == 1 && is_chance(0.2)) {
		this.doPlayerResponse(null);
	}
}

function organelleOverlay(type, time){ // defined by dust_trap
	if(this.pc) {
			this.pc.apiSendAnnouncement({
				type: 'itemstack_overlay',
				swf_url: overlay_key_to_url(type),
				duration: 3000,
				itemstack_tsid: this.tsid,
				width: '100%',
				height: '100%',
				delta_y:-153,
				text: ['<span class="nuxp_vog_smaller">+'+time+'s</span>'],
				tf_delta_x: 0,
				tf_delta_y: 22,
				delta_x: 0,
				place_at_bottom: true,
				animate_to_buffs: true,
				and_burst:true,
				and_burst_value:time,
				and_burst_text:(time==1)?'second':'seconds'
			});
		}
}

function reset(){ // defined by dust_trap
	this.apiSetTimer('makeReady', 1000);
	this.setAndBroadcastState('up');

	this.container.announce_sound_to_all('DUST_TRAP_UP');
}

function smackDown(){ // defined by dust_trap
	this.setAndBroadcastState('smackDown');
}

function stayDown(){ // defined by dust_trap
	this.setAndBroadcastState('down');
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade",
	"regular-item"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-113,"w":45,"h":87},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFZUlEQVR42u2Ye0xTVxzHm2wKcw9M\nFoZbFplmixIE3Fyic5vdspgtS6bxD6ebOFFRhkVAHi1vLK+WPpFXW3ppixQq5VFoi8ijFJRCFSjY\nyhSIa9yETZ2ymWyJfyzf9d4CQ6f\/LGtxCSf5JPeec5Lf5\/7O+eWcXBrtP2rOa007hweUStvFKvNC\nyD5yjLZY7c5P3XT7kNpps56GuUsJXTMBnY5ArVYFo1GNy4NqDA9UwXpe7py0a+lelXNnTYXmpnJk\n8muQUXwJ+cSEi3E38nEUyO2orOvFhKMJAz0VON9Z6p1sztzsDrti08zI5AKkiC4gVzaGHIoryJGS\nOMCmsIMtsaO8xgqHTYd+c8WMw3YmzOOCY7Y6s0FXghRBB06WjyKbYgT5FXZUNExA1jAOvtKBrNIh\nZM4iVFhwdbQBHUax2aNy39lq6UN9KjDzKpBZMoiMkkvU8ip04\/jh1gPcmvmTgnyWNziQVtQ\/iwUa\n3TmMWNWoVaR6bj86BjVKjVqE+HwjFTRV3EfhnP4D0788wBTJHTdj1+8hmd8FlrAHTIEZ6UUmjA1r\nYTIUKT0maB\/UOLPy+WAJ3EHddGPyx\/votEwiu8SE+vZruPHz7xQ8eQ8SCztmaUfr2Sb0tkudHhO0\nmivBzJXNB0zktiOBe84lZkYCp42iSjeK72\/+RpFbbkJ8gZHKeHy+AVWaRvSbCHhMcKCbQHKOdDag\nO2gcSZ4euWUmXJm8jYkb91zchcE0imPZWhzP0bloolDUaGHpkntOcPC8EmzOqfmAMezGWRpclWrG\n1eu3MXp1GryKdkRnnnEJ1rnJOoNoF3X1tbB0elDQ1q92CgWF8wGjszRuMjXIEOnhmJhGS9dlfJtR\ng6gMNaLSqymOpp+mMBrU6DaWeW4PDl+oVqqkeX8HTSOpwhEKFQ4zCRxJVSKSJEVBcTilEodZlYhO\nJ2DrU+NcvdhzVdzRJKKbDKVIyC51BSUoDrHkOMSUI459GpbhcbT1XkZUGoGDyTJEJEldSCjK5QQu\n9ahQr2B79sizdBA6ZVkuIpllOJBYPksZYrIq0dhmdRXHICJZEnxzogT7TxRTxKSKYe1WwtRSZvb4\nUTc0pPXrPSsbOSXkICJBhPD4IoTHiSkOJhVjX5wI+2KF+HqWY0w+mrVS9HUQM9XFmZ4\/i+ckLZ2V\nympCgKOJHHwVw8PemELsZZBwsYeCg+QsHsxnCfQYJSOtjYJAr98JL5pU4t5WGdSVQuRzuBR5HA4K\neDzotaWwmpToaZXqtDKW36JdXG0mInDApBSbDBKnoU6E5lq+S0o20tcmF7eqFyFrT2pCTkq2uV2O\nagkXiuJMOu1pa0uCS4JLgv9nQa129zO8PBb7qRI8umnTsqiIbW\/lpYdv3Roa8Ep6YpRkTjCHdejL\nj8NWB+tVjOCW2rSARRF83vfZT15+8blda\/xf2LYl6NV3khkHaucE4w7uig1eE\/DFvh1b3g8L9H\/7\n2J5tQV6V2\/jGypWr\/FcwAvxWHNn+3kaGsCAFJ1MZ43OCp7ipSGLs13\/27rodW9av+mhzyOufez2D\nxQW7\/TcGvbY9NnLn8RYt71rhydjROcEagj2VnRRet\/ODoP3JEfQPi7i7Vy\/6npya0q\/APcsGkvtT\n+vW\/3mhYe3dS\/RJtqT26tG\/SfJ5KMW6wz6f8UN9sEl6ITxQ3eNk\/ru+FoT7ryHmFIctZ5Bx+yHLv\n\/WHN30ALWChJQopQfS4RSmjBGPlOCns\/k2tpfrxQn7iFMvNSrn5SmPwYr4sJgnwDeSG+9EflyCw+\n9B7qe+Bxy+\/RjD0uU6QsOUYWDfn8uDnkR3lP0rXPyMw8KSi19BuW73k4s8s2\/9uq\/wtvrjPYjO2z\n6AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/dust_trap-1345758614.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_trade",
	"regular-item"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("dust_trap.js LOADED");

// generated ok 2012-08-23 14:50:14
