import type { Upgrade } from './types.js';

export const themeUpgrades: Upgrade[] = [
	{
		id: 'theme-dark',
		name: 'Dark',
		description: 'Easy on the eyes dark theme',
		cost: 200,
		type: 'theme',
		value: 'dark',
		purchased: false
	},
	{
		id: 'theme-purple',
		name: 'Purple',
		description: 'Stylish purple color scheme',
		cost: 250,
		type: 'theme',
		value: 'purple',
		purchased: false
	}
]; 