export interface IContact {
	id: string;
	contact_type: 'person' | 'company';
	name: string;
	email: string;
	phone: string;
	company: string;
	position: string;
	address: string;
	city: string;
	state: string;
	country: string;
	zip: string;
	notes: string;
} 