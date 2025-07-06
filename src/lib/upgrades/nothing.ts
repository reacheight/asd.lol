import type { Upgrade } from './types.js';

export const nothingUpgrades: Upgrade[] = [
	{
		id: 'nothing-small',
		name: 'Absolutely Nothing',
		description: 'at least it\'s not $4.99/month app you definitely need (no) ',
		cost: 100,
		type: 'nothing',
		value: 'nothing-small',
		purchased: false
	},
	{
		id: 'nothing-medium',
		name: 'Premium Nothing',
		description: 'still nothing but more expensive, just like your rent',
		cost: 1000,
		type: 'nothing',
		value: 'nothing-medium',
		purchased: false
	},
	{
		id: 'nothing-large',
		name: 'Enterprise Nothing',
		description: 'scale your business to the next level',
		cost: 5000,
		type: 'nothing',
		value: 'nothing-large',
		purchased: false
	}
]; 