function savanna_on_enter(pc, login) {
	// Set up Baqala time details
	pc.baqala_setup();
	
	// Are we already overwhelmed by nostalgia? If so, escape.
	if(pc.buffs_has('too_much_nostalgia')) {
		if(!pc['on_overwhelmed_prompt']) {
			pc['on_overwhelmed_prompt'] = true;
			pc.prompts_add({
				txt: "Oh, this is too much! You will be sent somewhere to recuperate until you're ready to return to the Ancestral Lands.", 
				title: "Overwhelmed!",
				prompt_callback: 'do_baqala_boot', 
				is_modal: true,
				choices: [{
					value: "ok",
					label: "OK"
				}]});
		}
		return;
	} else {
		// REMOVEME: Dealing with lingering prompts from earlier error. This can be removed eventually.
		if(this['overwhelmed_prompt']) {
			delete this['overwhelmed_prompt'];
		}		
	}

	// We are just entering the savanna. Do setup
	if(pc.last_region() != 'Savanna' || login) {
		pc.start_baqala_buff();
		
		// Offer quest
		pc.startQuest('baqala_nostalgia');
	} else if (pc.last_region() == 'Savanna' && !pc.buffs_has('ancestral_nostalgia') && !pc.is_god) {
		pc.check_baqala_boot();
	}
}

function savanna_on_reconnect(pc) {
	pc.check_baqala_boot();
}

function savanna_on_exit(pc, logout) {
	if(!pc.baqala_times) {
		// There is a problem.
		log.info("Error: "+this+" left Baqala without somehow ever being there.");
		return;
	}
	if(pc.buffs_has('too_much_nostalgia') && !pc['too_much_nostalgia_prompt']) {
		pc['too_much_nostalgia_prompt'] = true;
		pc.prompts_add({
			txt: "You were overwhelmed by wistfulness while exploring the savanna, and forced to beat a hasty retreat. You won't be able to re-enter for approximately exactly half an hour, so be careful!", 
			title: "Overwhelmed!",
			is_modal: true,
			callback: 'overwhelmed_prompt_callback',
			choices: [{
				value: "ok",
				label: "OK"
			}]});		
		return;
	}
	
	pc.leave_savanna(logout);
}