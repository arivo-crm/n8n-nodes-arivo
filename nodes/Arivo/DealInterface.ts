export interface IDeal {
	id: string;
	name: string;
	description?: string;
	value?: number;
	company_id?: string;
	contact_id?: string;
	status?: 'open' | 'won' | 'lost';
	temperature?: 'cold' | 'warm' | 'hot';
	opened_at?: string;
	estimated_close_date?: string;
	closed_at?: string;
	pipeline_id?: string;
	pipeline_step_id?: string;
	tags?: string;
	custom_fields?: Record<string, any>;
	user_id?: string;
	team_id?: string;
	created_at?: string;
	updated_at?: string;
}