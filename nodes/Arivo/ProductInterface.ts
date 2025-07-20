export interface IProduct {
	id?: string;
	object?: string;
	created_at?: string;
	updated_at?: string;
	name: string;
	code?: string;
	description?: string;
	price?: number;
	available?: boolean;
	product_category_id?: number;
	tags?: string[];
}

export interface IProductResponse {
	id: string;
	object: string;
	created_at: string;
	updated_at: string;
	name: string;
	code?: string;
	description?: string;
	price?: string;
	available?: boolean;
	product_category_id?: string;
	tags?: string[];
}

export interface IProductCategory {
	id: string;
	object: string;
	created_at: string;
	updated_at: string;
	name: string;
	code?: string;
}
