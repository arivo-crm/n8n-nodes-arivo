export interface ICustomRecordDefinition {
	id: string;
	object: string;
	created_at: string;
	updated_at: string;
	name: string;
	definitions: {
		[key: string]: {
			label: string;
			field_type: string;
		};
	};
}

export interface ICustomRecord {
	id: string;
	object: string;
	created_at: string;
	updated_at: string;
	deal_id: number | null;
	contact_id: number | null;
	tags: string[];
	custom_fields: {
		[key: string]: any;
	};
	team_id: number | null;
	user_id: string;
}

export interface ICustomRecordCreateRequest {
	deal_id?: number;
	contact_id?: number;
	tags?: string[];
	custom_fields?: {
		[key: string]: any;
	};
	team_id?: number;
	user_id?: number;
}

export interface ICustomRecordUpdateRequest {
	deal_id?: number;
	contact_id?: number;
	tags?: string[];
	custom_fields?: {
		[key: string]: any;
	};
	team_id?: number;
	user_id?: number;
}
