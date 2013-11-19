<?
	$data = implode('',file('/usr/local/dev_gs/js_root/quests/skill_mining_refining.js'));

	preg_match('!b> (.*?) there\'s!', $data, $m);

	$len = strlen($m[1]);

	for ($i=0; $i<$len; $i++){
		$c = ord(substr($m[1], $i, 1));
		echo sprintf('%02x ', $c);
	}
?>
