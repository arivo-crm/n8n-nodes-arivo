export interface IEmail {
	id?: string;
	object?: string;
	created_at?: string;
	updated_at?: string;
	address: string;
	email_type: 'work' | 'home';
	contact_id?: string;
}

export interface IEmailResponse {
	id: string;
	object: string;
	created_at: string;
	updated_at: string;
	address: string;
	email_type: 'work' | 'home';
	contact_id: string;
}
