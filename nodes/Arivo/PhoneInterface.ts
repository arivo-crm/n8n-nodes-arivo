export interface IPhone {
	id?: string;
	object?: string;
	created_at?: string;
	updated_at?: string;
	number: string;
	phone_type: 'work' | 'cell' | 'home' | 'fax';
	contact_id?: string;
}

export interface IPhoneResponse {
	id: string;
	object: string;
	created_at: string;
	updated_at: string;
	number: string;
	phone_type: 'work' | 'cell' | 'home' | 'fax';
	contact_id: string;
}