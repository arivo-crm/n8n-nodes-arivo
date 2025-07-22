export interface ITaskRecurrence {
	id?: string;
	object?: string;
	created_at?: string;
	updated_at?: string;
	frequency: number; // 0=never, 1=daily, 2=weekly, 3=monthly, 4=yearly
	interval?: number; // Interval between repetitions (default 1)
	ends_on?: number; // 0=never, 1=after X repetitions, 2=after date
	repeat?: number; // Number of repetitions (when ends_on=1)
	start_until?: string; // End date (when ends_on=2)
	sunday?: boolean;
	monday?: boolean;
	tuesday?: boolean;
	wednesday?: boolean;
	thursday?: boolean;
	friday?: boolean;
	saturday?: boolean;
	monthly_by_weekday?: boolean;
}

export interface ITask {
	id?: string;
	object?: string;
	created_at?: string;
	updated_at?: string;
	name: string;
	done?: boolean;
	task_type_id?: number;
	due_type_id?: number; // 998=with date, 999=no date
	due_date?: string;
	due_date_end?: string;
	completed_at?: string;
	comment?: string;
	contact_id?: number;
	deal_id?: number;
	task_recurrence?: ITaskRecurrence | null;
	tags?: string[];
	team_id?: number;
	user_id?: number;
	creator_id?: number;
}
