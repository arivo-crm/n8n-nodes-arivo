export interface IDealItem {
	id?: string;
	object?: string;
	created_at?: string;
	updated_at?: string;
	name: string;
	deal_id: string;
	product_id?: string;
	price?: number;
	quantity?: number;
	discount?: number;
	total_price?: number;
}

export interface IDealItemResponse {
	id: string;
	object: string;
	created_at: string;
	updated_at: string;
	name: string;
	deal_id: string;
	product_id?: string;
	price?: string;
	quantity?: string;
	discount?: string;
	total_price?: string;
}