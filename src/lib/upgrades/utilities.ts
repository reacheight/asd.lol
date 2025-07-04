import type { Upgrade } from './types.js';

export const utilityUpgrades: Upgrade[] = [
	{
		id: 'utility-copy',
		name: 'Copy Button',
		description: 'unlock the ability to copy your notes',
		cost: 500,
		type: 'utility',
		value: 'copy',
		purchased: false
	}
]; 