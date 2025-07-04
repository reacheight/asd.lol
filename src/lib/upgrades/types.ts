export interface Upgrade {
	id: string;
	name: string;
	description: string;
	cost: number;
	type: 'font' | 'sound' | 'theme' | 'emoji';
	value: string;
	purchased: boolean;
} 