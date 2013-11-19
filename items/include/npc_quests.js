
function getAvailableQuests(pc){

	//
	// find out what state various quests are in
	//

	var quests = {};
	quests.offered = {};
	quests.given = {};
	quests.incomplete = {};
	quests.completed = {};
	
	for (var i in this.available_quests){

		var q = this.available_quests[i];
		if (config.is_dev) log.info(this+' has available quest: '+q);

		var q_proto = pc.getQuestInstance(q);
		if (!q_proto) q_proto = apiFindQuestPrototype(q);
		var qi = pc.getQuestInstance(q);

		if (!q_proto){
			log.error(this+" NPC trying to offer undefined quest: "+q);
			continue;
		}

		var status = pc.getQuestStatus(q);

		if (status == 'done' && !qi.is_repeatable){
			if (config.is_dev) log.info(this+" quest already done: "+q);
			continue;
		}
		if (status == 'todo'){
			if (config.is_dev) log.info(this+" quest already in list: "+q);
			quests.given[q] = pc.quests.todo.quests[q];
			continue;
		}

		//
		// the quest hasn't been done, and isn't
		// in the todo list. check prereqs
		//

		var ok = 1;

		for (var j in q_proto.prerequisites){
			ok = 1;
			var prereq = q_proto.prerequisites[j];
			switch (prereq.condition){
				case 'has_achievement':
					if (pc.achievements_has(prereq.value) == intval(prereq.not)){
						ok = 0;
					}
					break;
				case 'has_skill':
					if (pc.skills_has(prereq.value) == intval(prereq.not)){
						ok = 0;
					}
					break;
				case 'has_item':
					if (pc.items_has(prereq.value, 1) == intval(prereq.not)){
						ok = 0;
					}
					break;
				case 'has_buff':
					if (pc.buffs_has(prereq.value) == intval(prereq.not)){
						ok = 0;
					}
					break;
				case 'over_level':
					if ((!intval(prereq.not) && pc.stats_get_level() < intval(prereq.value)) ||
						(intval(prereq.not) && pc.stats_get_level() > intval(prereq.value))){
						ok = 0;
					}
					break;
				case 'completed_quest':
					if ((pc.getQuestStatus(prereq.value) == 'done') == intval(prereq.not)){
						ok = 0;
					}
					break;
				case 'in_hub':
					if ((pc.location.hubid == prereq.value) == intval(prereq.not)){
						ok = 0;
					}
					break;
				case 'over_mood':
					if ((!intval(prereq.not) && pc.metabolics_get_mood() < intval(prereq.value)) ||
						(intval(prereq.not) && pc.metabolics_get_mood() > intval(prereq.value))){
						ok = 0;
					}
					break;
				case 'over_energy':
					if ((!intval(prereq.not) && pc.metabolics_get_energy() < intval(prereq.value)) ||
						(intval(prereq.not) && pc.metabolics_get_energy() > intval(prereq.value))){
						ok = 0;
					}
					break;
				case 'has_recipe':
					if (!pc.recipes.recipes[prereq.value]){
						ok = 0;
					}
					break;
				case 'over_favor':
					var favor_data = prereq.value.split('|');
					var favor = pc.stats_get_favor_points(favor_data[0]);
					if ((!intval(prereq.not) && favor < intval(favor_data[1])) ||
						(intval(prereq.not) && favor > intval(favor_data[1]))){
						ok = 0;
					}
					break;
				case 'quest_count_over':
					if ((!intval(prereq.not) && num_keys(pc.quests.done.quests) < intval(prereq.value)) ||
						(intval(prereq.not) && num_keys(pc.quests.done.quests) > intval(prereq.value))){
						ok = 0;
					}
					break;
				case 'custom_code':
					if (prereq.value(pc, q) == intval(prereq.not)){
						ok = 0;
					}
					break;
				default:
					log.info('ERROR: unknown prerequisite condition '+prereq.condition+'.');
					break;
			}
			
			if (ok == 0){
				var not = '';
				if (intval(prereq.not)) not = "NOT ";
				if (config.is_dev) log.info(this+' missing prerequisite ('+not+prereq.condition+' ['+prereq.value+']) for quest: '+q);
				break;
			}
		}


		for (var j in q_proto.prereq_quests){

			var pq = q_proto.prereq_quests[j];
			var sub_status = pc.getQuestStatus(pq);

			if (sub_status != 'done'){
				ok = 0;
				if (config.is_dev) log.info(this+' missing prereq ('+pq+') for quest: '+q);
			}
		}

		if (q_proto.canOffer){
			if (!q_proto.canOffer(pc)){
				ok = 0;
				if (config.is_dev) log.info(this+' call to canOffer() returned false for quest: '+q);
			}
		}

		if (ok){

			if (config.is_dev) log.info(this+' can offer: '+q);
			quests.offered[q] = q;
		}
	}


	//
	// anything ready to turn in?
	//

	for (var i in pc.quests.todo.quests){
		var qi = pc.quests.todo.quests[i];
		var can_turnin = 0;
		for (var j in qi.end_npcs){
			if (qi.end_npcs[j] == this.class_id) can_turnin = 1;
		}
		if (can_turnin){
			delete quests.given[qi.class_id];
			qi.checkCompletion(pc);
			if (qi.isDone(pc)){
				quests.completed[qi.class_id] = qi;
				if (config.is_dev) log.info(this+' quest '+qi.class_id+' can be turned in to this item');
			}else{
				//quests.incomplete[qi.class_id] = qi; // Disabled because it's unused and has a tendency to pop up in annoying places
				if (config.is_dev) log.info(this+' quest '+qi.class_id+' can be turned in to this item (not done yet)');
			}
		}
	}


	return quests;
}

function offerQuests(pc, msg){

	var didSomethingSilent = false;
	var quests = this.getAvailableQuests(pc);
	var choices = {};
	var excluding_quests = false;

	var choice_index = 0;


	//
	// offer some quests?
	//

	if (num_keys(quests.offered)){

		for (var i in quests.offered){
			var q = quests.offered[i];
			var q_proto = apiFindQuestPrototype(q);
			
			if(msg && msg.exclude_quests && in_array(q, msg.exclude_quests)) {
				excluding_quests = true;
				continue;
			}

			// If we have a quest to offer, but it has no offer text, silently accept by default
			if(!q_proto.getOffer(pc) || q_proto.getOffer(pc) == q_proto.getDesc(pc)) {
				pc.startQuest(q, true);
				pc.acceptQuest(q);
				
				didSomethingSilent = true;
			} else {
				// otherwise, explain the quest.
				choices['offer'+i] = {
					'txt': q_proto.getTitle(pc),
					'value': 'explain-quest-'+q,
					'order': choice_index++
				};
			}
		}
	}


	//
	// some pending quests?
	//
	// this would fire if the NPC offers a quest you are already on.
	// commenting this out, otehrwise all quests need anothr block of text.
	//

	if (num_keys(quests.given) && 0){

		for (var i in quests.given){
			var qi = quests.given[i];

			choices['pending'+i] = {
				'txt': 'Given: '+qi.getTitle(pc),
				'value': 'given-quest-'+qi.class_id,
				'order': choice_index++
			};
		}
	}

	if (num_keys(quests.incomplete)){

		for (var i in quests.incomplete){
			var qi = quests.incomplete[i];

			choices['incomplete'+i] = {
				'txt': 'Incomplete: '+qi.getTitle(pc),
				'value': 'incomplete-quest-'+qi.class_id,
				'order': choice_index++
			};
		}
	}


	//
	// complete some quests?
	//

	if (num_keys(quests.completed)){

		for (var i in quests.completed){
			var qi = quests.completed[i];

			// If we have a quest to complete, but it has no completed text, silently finish
			if (qi.getCompletion(pc) == ""){
				pc.completeQuest(qi.class_id, 1);
				
				// Check if we can chain quests.
				var moreQuests = this.getAvailableQuests(pc);
				var chain = num_keys(moreQuests.offered) + num_keys(moreQuests.completed);
				
				didSomethingSilent = true;
				
				if (chain){
					// Careful, recursion:
					this.offerQuests(pc, msg);
				}
			}
			else{
				choices = {}; // We always want to default to a single turn-in
				choices['done'+i] = {
					'txt': 'Turn in: '+qi.title,
					'value': 'turnin-quest-'+qi.class_id,
					'order': choice_index++
				};
			}
		}
	}


	//
	// talk to user
	//

	var num_choices = num_keys(choices);

	if (num_choices == 1){

		for (var i in choices){
			if (!msg) msg = {};
			msg.choice = choices[i].value;
			msg.no_backtrack = 1;
			this.onConversation(pc, msg);
			return;
		}

	}else if (num_choices > 1){
		choices['cancel'] = {
			'txt': this.classProps.cancel_quest_text ? this.classProps.cancel_quest_text : 'Nevermind',
			'value': 'cancel',
			'order': choice_index++
		};
		
		log.info(this+' starting conversation... ', choices);

		if (msg && msg.choice){
			this.conversation_reply(pc, msg, this.classProps.got_quest_text, choices, null, null, 'cancel');
		}else{
			this.conversation_start(pc, this.classProps.got_quest_text, choices, null, null, 'cancel');
		}

	}else if(!didSomethingSilent && !excluding_quests){
		log.info(this+' no quests for you...');

		var txt = this.classProps.no_quest_text;
		if (!txt){
			var choices = [
				"I don't feel like talking right now.",
				"Sorry, I don't have anything to say.",
				"It's been a long day. Maybe we can talk later.",
				"Sorry, I've got nothing for you."
			];
			txt = choose_one(choices);
		}
		var overridden = 0;

		if (msg && msg.choice){
			this.conversation_reply(pc, msg, txt);
		}else{
			this.conversation_start(pc, txt);
		}
	} else if(excluding_quests) {
		this.conversation_end(pc, msg);
	}
}

function setAvailableQuests(quests){
	// store these away for later
	this.available_quests = quests;
}
