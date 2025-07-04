import type { Upgrade } from './types.js';

export const themeUpgrades: Upgrade[] = [
	{
		id: 'theme-dark',
		name: 'Dark',
		description: 'think twice',
		cost: 200,
		type: 'theme',
		value: 'dark',
		purchased: false
	},
	{
		id: 'theme-purple',
		name: 'Purple',
		description: 'for real men',
		cost: 250,
		type: 'theme',
		value: 'purple',
		purchased: false
	}
]; 