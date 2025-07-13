export interface INote {
	id: string;
	object: 'note';
	text: string;
	contact_id?: string;
	deal_id?: string;
	task_id?: string;
	user_id?: string;
	team_id?: string;
	created_at?: string;
	updated_at?: string;
}