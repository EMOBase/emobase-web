export interface Color {
	/** @primaryKey */
	id: number;
	value?: string | null;
}

export interface Example {
	/** @primaryKey */
	id: number;
	value?: string | null;
}

export interface Homepage {
	about_the_data?: string | null;
	description?: string | null;
	/** @primaryKey */
	id: number;
	title?: string | null;
}

export interface Logo {
	/** @primaryKey */
	id: number;
	image?: DirectusFile | string | null;
}

export interface SiteInfo {
	favicon?: DirectusFile | string | null;
	/** @primaryKey */
	id: number;
	title?: string | null;
}

export interface DirectusAccess {
	/** @primaryKey */
	id: string;
	policy?: DirectusPolicy | string;
	role?: DirectusRole | string | null;
	sort?: number | null;
	user?: DirectusUser | string | null;
}

export interface DirectusActivity {
	action?: string;
	collection?: string;
	/** @primaryKey */
	id: number;
	ip?: string | null;
	item?: string;
	origin?: string | null;
	timestamp?: string;
	user?: DirectusUser | string | null;
	user_agent?: string | null;
	revisions?: DirectusRevision[] | string[];
}

export interface DirectusCollection {
	accountability?: 'all' | 'activity' | null | null;
	archive_app_filter?: boolean;
	archive_field?: string | null;
	archive_value?: string | null;
	collapse?: string;
	/** @primaryKey */
	collection: string;
	color?: string | null;
	display_template?: string | null;
	group?: DirectusCollection | string | null;
	hidden?: boolean;
	icon?: string | null;
	item_duplication_fields?: 'json' | null;
	note?: string | null;
	preview_url?: string | null;
	singleton?: boolean;
	sort?: number | null;
	sort_field?: string | null;
	translations?: Array<{ language: string; translation: string; singular: string; plural: string }> | null;
	unarchive_value?: string | null;
	versioning?: boolean;
}

export interface DirectusComment {
	collection?: DirectusCollection | string;
	comment?: string;
	date_created?: string | null;
	date_updated?: string | null;
	/** @primaryKey */
	id: string;
	item?: string;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface DirectusField {
	collection?: DirectusCollection | string;
	conditions?: 'json' | null;
	display?: string | null;
	display_options?: 'json' | null;
	field?: string;
	group?: DirectusField | string | null;
	hidden?: boolean;
	/** @primaryKey */
	id: number;
	interface?: string | null;
	note?: string | null;
	options?: 'json' | null;
	readonly?: boolean;
	required?: boolean | null;
	searchable?: boolean;
	sort?: number | null;
	special?: string[] | null;
	translations?: 'json' | null;
	validation?: 'json' | null;
	validation_message?: string | null;
	width?: string | null;
}

export interface DirectusFile {
	charset?: string | null;
	created_on?: string;
	description?: string | null;
	duration?: number | null;
	embed?: string | null;
	filename_disk?: string | null;
	filename_download?: string;
	filesize?: number | null;
	focal_point_x?: number | null;
	focal_point_y?: number | null;
	folder?: DirectusFolder | string | null;
	height?: number | null;
	/** @primaryKey */
	id: string;
	location?: string | null;
	metadata?: 'json' | null;
	modified_by?: DirectusUser | string | null;
	modified_on?: string;
	storage?: string;
	tags?: string[] | null;
	title?: string | null;
	tus_data?: 'json' | null;
	tus_id?: string | null;
	type?: string | null;
	uploaded_by?: DirectusUser | string | null;
	uploaded_on?: string | null;
	width?: number | null;
}

export interface DirectusFolder {
	/** @primaryKey */
	id: string;
	name?: string;
	parent?: DirectusFolder | string | null;
}

export interface DirectusMigration {
	name?: string;
	timestamp?: string | null;
	/** @primaryKey */
	version: string;
}

export interface DirectusPermission {
	action?: string;
	collection?: string;
	fields?: string[] | null;
	/** @primaryKey */
	id: number;
	permissions?: 'json' | null;
	policy?: DirectusPolicy | string;
	presets?: 'json' | null;
	validation?: 'json' | null;
}

export interface DirectusPolicy {
	admin_access?: boolean;
	app_access?: boolean;
	description?: string | null;
	enforce_tfa?: boolean;
	icon?: string;
	/** @primaryKey */
	id: string;
	ip_access?: string[] | null;
	/** @required */
	name: string;
	permissions?: DirectusPermission[] | string[];
	users?: DirectusAccess[] | string[];
	roles?: DirectusAccess[] | string[];
}

export interface DirectusPreset {
	bookmark?: string | null;
	collection?: string | null;
	color?: string | null;
	filter?: 'json' | null;
	icon?: string | null;
	/** @primaryKey */
	id: number;
	layout?: string | null;
	layout_options?: 'json' | null;
	layout_query?: 'json' | null;
	refresh_interval?: number | null;
	role?: DirectusRole | string | null;
	search?: string | null;
	user?: DirectusUser | string | null;
}

export interface DirectusRelation {
	/** @primaryKey */
	id: number;
	junction_field?: string | null;
	many_collection?: string;
	many_field?: string;
	one_allowed_collections?: string[] | null;
	one_collection?: string | null;
	one_collection_field?: string | null;
	one_deselect_action?: string;
	one_field?: string | null;
	sort_field?: string | null;
}

export interface DirectusRevision {
	activity?: DirectusActivity | string;
	collection?: string;
	data?: 'json' | null;
	delta?: 'json' | null;
	/** @primaryKey */
	id: number;
	item?: string;
	parent?: DirectusRevision | string | null;
	version?: DirectusVersion | string | null;
}

export interface DirectusRole {
	description?: string | null;
	icon?: string;
	/** @primaryKey */
	id: string;
	/** @required */
	name: string;
	parent?: DirectusRole | string | null;
	children?: DirectusRole[] | string[];
	policies?: DirectusAccess[] | string[];
	users?: DirectusUser[] | string[];
}

export interface DirectusSession {
	expires?: string;
	ip?: string | null;
	next_token?: string | null;
	origin?: string | null;
	share?: DirectusShare | string | null;
	/** @primaryKey */
	token: string;
	user?: DirectusUser | string | null;
	user_agent?: string | null;
}

export interface DirectusSettings {
	ai_anthropic_allowed_models?: Array<`claude-haiku-4-5` | `claude-sonnet-4-5` | `claude-opus-4-5`> | null;
	ai_anthropic_api_key?: string | null;
	ai_google_allowed_models?: Array<`gemini-3-pro-preview` | `gemini-3-flash-preview` | `gemini-2.5-pro` | `gemini-2.5-flash`> | null;
	ai_google_api_key?: string | null;
	ai_openai_allowed_models?: Array<`gpt-4o-mini` | `gpt-4.1-nano` | `gpt-4.1-mini` | `gpt-4.1` | `gpt-5-nano` | `gpt-5-mini` | `gpt-5` | `gpt-5.2` | `gpt-5.2-chat-latest` | `gpt-5.2-pro`> | null;
	ai_openai_api_key?: string | null;
	ai_openai_compatible_api_key?: string | null;
	ai_openai_compatible_base_url?: string | null;
	ai_openai_compatible_headers?: Array<{ header: string; value: string }> | null;
	ai_openai_compatible_models?: Array<{ id: string; name: string; context: number; output: number; attachment: boolean; reasoning: boolean; providerOptions: Record<string, any> }> | null;
	ai_openai_compatible_name?: string | null;
	ai_system_prompt?: string | null;
	auth_login_attempts?: number | null;
	auth_password_policy?: null | `/^.{8,}$/` | `/(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{';'?>.<,])(?!.*\\s).*$/` | null;
	basemaps?: Array<{ name: string; type: 'raster' | 'tile' | 'style'; url: string; tileSize: number; attribution: string }> | null;
	collaborative_editing_enabled?: boolean;
	custom_aspect_ratios?: Array<{ text: string; value: number }> | null;
	custom_css?: string | null;
	default_appearance?: 'auto' | 'light' | 'dark';
	default_language?: string;
	default_theme_dark?: string | null;
	default_theme_light?: string | null;
	/** @primaryKey */
	id: number;
	mapbox_key?: string | null;
	mcp_allow_deletes?: boolean;
	mcp_enabled?: boolean;
	mcp_prompts_collection?: string | null;
	mcp_system_prompt?: string | null;
	mcp_system_prompt_enabled?: boolean;
	module_bar?: 'json' | null;
	org_name?: string | null;
	product_updates?: boolean | null;
	project_color?: string;
	project_descriptor?: string | null;
	project_id?: string | null;
	project_logo?: DirectusFile | string | null;
	project_name?: string;
	project_owner?: string | null;
	project_status?: string | null;
	project_url?: string | null;
	project_usage?: string | null;
	public_background?: DirectusFile | string | null;
	public_favicon?: DirectusFile | string | null;
	public_foreground?: DirectusFile | string | null;
	public_note?: string | null;
	public_registration?: boolean;
	public_registration_email_filter?: 'json' | null;
	public_registration_role?: DirectusRole | string | null;
	public_registration_verify_email?: boolean;
	report_bug_url?: string | null;
	report_error_url?: string | null;
	report_feature_url?: string | null;
	storage_asset_presets?: Array<{ key: string; fit: 'contain' | 'cover' | 'inside' | 'outside'; width: number; height: number; quality: number; withoutEnlargement: boolean; format: 'auto' | 'jpeg' | 'png' | 'webp' | 'tiff' | 'avif'; transforms: 'json' }> | null;
	storage_asset_transform?: 'all' | 'none' | 'presets' | null;
	storage_default_folder?: DirectusFolder | string | null;
	theme_dark_overrides?: 'json' | null;
	theme_light_overrides?: 'json' | null;
	visual_editor_urls?: Array<{ url: string }> | null;
}

export interface DirectusUser {
	appearance?: null | 'auto' | 'light' | 'dark' | null;
	auth_data?: 'json' | null;
	avatar?: DirectusFile | string | null;
	description?: string | null;
	email?: string | null;
	email_notifications?: boolean | null;
	external_identifier?: string | null;
	first_name?: string | null;
	/** @primaryKey */
	id: string;
	language?: string | null;
	last_access?: string | null;
	last_name?: string | null;
	last_page?: string | null;
	location?: string | null;
	password?: string | null;
	provider?: 'keycloak';
	role?: DirectusRole | string | null;
	status?: 'draft' | 'invited' | 'unverified' | 'active' | 'suspended' | 'archived';
	tags?: string[] | null;
	text_direction?: 'auto' | 'ltr' | 'rtl';
	tfa_secret?: string | null;
	theme_dark?: string | null;
	theme_dark_overrides?: 'json' | null;
	theme_light?: string | null;
	theme_light_overrides?: 'json' | null;
	title?: string | null;
	token?: string | null;
	policies?: DirectusAccess[] | string[];
}

export interface DirectusDashboard {
	color?: string | null;
	date_created?: string | null;
	icon?: string;
	/** @primaryKey */
	id: string;
	name?: string;
	note?: string | null;
	user_created?: DirectusUser | string | null;
	panels?: DirectusPanel[] | string[];
}

export interface DirectusPanel {
	color?: string | null;
	dashboard?: DirectusDashboard | string;
	date_created?: string | null;
	height?: number;
	icon?: string | null;
	/** @primaryKey */
	id: string;
	name?: string | null;
	note?: string | null;
	options?: 'json' | null;
	position_x?: number;
	position_y?: number;
	show_header?: boolean;
	type?: string;
	user_created?: DirectusUser | string | null;
	width?: number;
}

export interface DirectusNotification {
	collection?: string | null;
	/** @primaryKey */
	id: number;
	item?: string | null;
	message?: string | null;
	recipient?: DirectusUser | string;
	sender?: DirectusUser | string | null;
	status?: string | null;
	subject?: string;
	timestamp?: string | null;
}

export interface DirectusShare {
	collection?: DirectusCollection | string;
	date_created?: string | null;
	date_end?: string | null;
	date_start?: string | null;
	/** @primaryKey */
	id: string;
	item?: string;
	max_uses?: number | null;
	name?: string | null;
	password?: string | null;
	role?: DirectusRole | string | null;
	times_used?: number | null;
	user_created?: DirectusUser | string | null;
}

export interface DirectusFlow {
	accountability?: string | null;
	color?: string | null;
	date_created?: string | null;
	description?: string | null;
	icon?: string | null;
	/** @primaryKey */
	id: string;
	name?: string;
	operation?: DirectusOperation | string | null;
	options?: 'json' | null;
	status?: string;
	trigger?: string | null;
	user_created?: DirectusUser | string | null;
	operations?: DirectusOperation[] | string[];
}

export interface DirectusOperation {
	date_created?: string | null;
	flow?: DirectusFlow | string;
	/** @primaryKey */
	id: string;
	key?: string;
	name?: string | null;
	options?: 'json' | null;
	position_x?: number;
	position_y?: number;
	reject?: DirectusOperation | string | null;
	resolve?: DirectusOperation | string | null;
	type?: string;
	user_created?: DirectusUser | string | null;
}

export interface DirectusTranslation {
	/** @primaryKey */
	id: string;
	/** @required */
	key: string;
	/** @required */
	language: string;
	/** @required */
	value: string;
}

export interface DirectusVersion {
	collection?: DirectusCollection | string;
	date_created?: string | null;
	date_updated?: string | null;
	delta?: 'json' | null;
	hash?: string | null;
	/** @primaryKey */
	id: string;
	item?: string;
	key?: string;
	name?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface DirectusExtension {
	bundle?: string | null;
	enabled?: boolean;
	folder?: string;
	/** @primaryKey */
	id: string;
	source?: string;
}

export interface DirectusDeployment {
	credentials?: string | null;
	date_created?: string | null;
	/** @primaryKey */
	id: string;
	last_synced_at?: string | null;
	options?: 'json' | null;
	provider?: string;
	user_created?: DirectusUser | string | null;
	webhook_ids?: 'json' | null;
	webhook_secret?: string | null;
	projects?: DirectusDeploymentProject[] | string[];
}

export interface DirectusDeploymentProject {
	date_created?: string | null;
	deployable?: boolean;
	deployment?: DirectusDeployment | string;
	external_id?: string;
	framework?: string | null;
	/** @primaryKey */
	id: string;
	name?: string;
	url?: string | null;
	user_created?: DirectusUser | string | null;
	runs?: DirectusDeploymentRun[] | string[];
}

export interface DirectusDeploymentRun {
	completed_at?: string | null;
	date_created?: string | null;
	external_id?: string;
	/** @primaryKey */
	id: string;
	project?: DirectusDeploymentProject | string;
	started_at?: string | null;
	status?: string | null;
	target?: string;
	url?: string | null;
	user_created?: DirectusUser | string | null;
}

export interface Schema {
	color: Color;
	examples: Example[];
	homepage: Homepage;
	logo: Logo;
	site_info: SiteInfo;
	directus_access: DirectusAccess[];
	directus_activity: DirectusActivity[];
	directus_collections: DirectusCollection[];
	directus_comments: DirectusComment[];
	directus_fields: DirectusField[];
	directus_files: DirectusFile[];
	directus_folders: DirectusFolder[];
	directus_migrations: DirectusMigration[];
	directus_permissions: DirectusPermission[];
	directus_policies: DirectusPolicy[];
	directus_presets: DirectusPreset[];
	directus_relations: DirectusRelation[];
	directus_revisions: DirectusRevision[];
	directus_roles: DirectusRole[];
	directus_sessions: DirectusSession[];
	directus_settings: DirectusSettings;
	directus_users: DirectusUser[];
	directus_dashboards: DirectusDashboard[];
	directus_panels: DirectusPanel[];
	directus_notifications: DirectusNotification[];
	directus_shares: DirectusShare[];
	directus_flows: DirectusFlow[];
	directus_operations: DirectusOperation[];
	directus_translations: DirectusTranslation[];
	directus_versions: DirectusVersion[];
	directus_extensions: DirectusExtension[];
	directus_deployments: DirectusDeployment[];
	directus_deployment_projects: DirectusDeploymentProject[];
	directus_deployment_runs: DirectusDeploymentRun[];
}

export enum CollectionNames {
	color = 'color',
	examples = 'examples',
	homepage = 'homepage',
	logo = 'logo',
	site_info = 'site_info',
	directus_access = 'directus_access',
	directus_activity = 'directus_activity',
	directus_collections = 'directus_collections',
	directus_comments = 'directus_comments',
	directus_fields = 'directus_fields',
	directus_files = 'directus_files',
	directus_folders = 'directus_folders',
	directus_migrations = 'directus_migrations',
	directus_permissions = 'directus_permissions',
	directus_policies = 'directus_policies',
	directus_presets = 'directus_presets',
	directus_relations = 'directus_relations',
	directus_revisions = 'directus_revisions',
	directus_roles = 'directus_roles',
	directus_sessions = 'directus_sessions',
	directus_settings = 'directus_settings',
	directus_users = 'directus_users',
	directus_dashboards = 'directus_dashboards',
	directus_panels = 'directus_panels',
	directus_notifications = 'directus_notifications',
	directus_shares = 'directus_shares',
	directus_flows = 'directus_flows',
	directus_operations = 'directus_operations',
	directus_translations = 'directus_translations',
	directus_versions = 'directus_versions',
	directus_extensions = 'directus_extensions',
	directus_deployments = 'directus_deployments',
	directus_deployment_projects = 'directus_deployment_projects',
	directus_deployment_runs = 'directus_deployment_runs'
}