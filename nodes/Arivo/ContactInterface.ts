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

export interface ICompany {
	id: string;
	contact_type: 'company';
	name: string;
	cnpj?: string;
	main_contact_id?: string;
	website?: string;
	emails?: Array<{
		address: string;
		type: 'work' | 'personal' | 'other';
	}>;
	phones?: Array<{
		number: string;
		type: 'work' | 'mobile' | 'home' | 'other';
	}>;
	addresses?: Array<{
		street: string;
		city: string;
		state: string;
		district: string;
		country: string;
		zip: string;
		type: 'work' | 'home' | 'other';
	}>;
	tags?: string;
	custom_fields?: Record<string, any>;
	user_id?: string;
	team_id?: string;
	created_at?: string;
	updated_at?: string;
}
