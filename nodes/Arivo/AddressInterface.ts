export interface IAddress {
	id?: string;
	object?: string;
	created_at?: string;
	updated_at?: string;
	street?: string;
	number?: string;
	complement?: string;
	zip_code?: string;
	district?: string;
	city?: string;
	state?: string;
	country?: string;
	contact_id?: string;
}

export interface IAddressResponse {
	id: string;
	object: string;
	created_at: string;
	updated_at: string;
	street?: string;
	number?: string;
	complement?: string;
	zip_code?: string;
	district?: string;
	city?: string;
	state?: string;
	country?: string;
	contact_id: string;
}
