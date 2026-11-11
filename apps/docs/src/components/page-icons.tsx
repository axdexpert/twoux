// One icon per foundation and pattern page, so overview cards can be scanned by shape as well as title.
import {
	Accessibility, Ban, BarChart3, Bell, Bookmark, Bot, Braces, CalendarClock, CalendarRange, ChartPie, CircleAlert, CircleDashed, Clock, Columns3, Compass,
	Download, FileDiff, FileText, GripVertical, Grid2x2, History, Keyboard, Layers, LayoutDashboard, LayoutGrid, LayoutPanelLeft, LifeBuoy, ListChecks,
	ListFilter, Loader, type LucideIcon, Megaphone, MessageCircleQuestion, MessageSquare, MousePointerClick, Palette, PanelRight, PanelRightOpen, PenLine,
	PencilLine, Quote, RefreshCw, Repeat, Rocket, Rows3, Ruler, Save, Shapes, SquareCheck, SquarePen, SquarePlus, Tag, TextCursorInput, ThumbsUp, Trash2,
	Type, Undo2, UserCog, Wind, ZoomIn, CircleHelp, GitPullRequest, Lightbulb,
	BadgeCheck, FileUp, Gauge, LogIn, Plug, ListTodo, Footprints,
	Sheet, Columns2, Activity, ArrowLeftRight, FileSpreadsheet, LibraryBig, Settings2, TableProperties, SquareChevronDown,
	AlignStartVertical, ArrowDownUp, ArrowUpDown, BarChartHorizontal, CandlestickChart, ChartColumnBig, ChartNoAxesGantt, LayoutPanelTop, ListOrdered, SquareSplitHorizontal, TrendingUp, Workflow,
	CalendarDays, CalendarCheck, ChevronsUpDown, Tags, Earth, GanttChart, Radar, Signpost, Speech, ArrowRightLeft,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
	colours: Palette, "data-vis-colours": ChartPie, typography: Type, spacing: Ruler, "content-density": Rows3, layout: LayoutPanelLeft,
	iconography: Shapes, "shape-elevation": Layers, motion: Wind, "design-tokens": Braces, consistency: Repeat, accessibility: Accessibility,
	writing: PenLine, "voice-and-tone": Speech, "keyboard-model": Keyboard, migrating: ArrowRightLeft,
	"filtering-search": ListFilter, "saving-views": Bookmark, "selection-bulk-actions": ListChecks, "inline-editing-validation": PencilLine,
	"empty-loading-error": CircleDashed, "undo-destructive": Undo2, "notification-channels": Bell, "record-detail": PanelRight,
	"keyboard-navigation": Keyboard, "data-export": Download, "period-comparison": CalendarRange, "workspace-onboarding": Rocket,
	"ask-on-screen": MessageSquare, "propose-apply": FileDiff, "reasoning-progress": Loader, "clarify-before-acting": MessageCircleQuestion,
	"citing-sources": Quote, "labelling-ai-output": Tag, "agents-on-behalf": Bot, "generated-columns": Columns3, "saved-tasks-schedules": CalendarClock,
	"data-visualisation": BarChart3, "chart-drill-down": ZoomIn, "static-dashboard": LayoutDashboard, "configurable-dashboard": LayoutGrid,
	"dashboard-items": Grid2x2, "regenerating-answers": RefreshCw, "generated-drafts-files": FileText, "inline-input-in-answer": TextCursorInput,
	"agent-activity-log": History, "managing-agents": UserCog, "disabled-read-only": Ban, "drag-and-drop": GripVertical, "error-messages": CircleAlert,
	"help-system": LifeBuoy, "secondary-panels": PanelRightOpen, "user-feedback": ThumbsUp, "unsaved-changes": Save, timestamps: Clock,
	actions: MousePointerClick, "choosing-selection-control": SquareCheck, "create-record": SquarePlus, "edit-record": SquarePen,
	"plan-card": ListChecks, "change-request": GitPullRequest, "confidence-note": CircleHelp, "why-choice": Lightbulb,
	"delete-record": Trash2, navigation: Compass, "announcing-features": Megaphone,
	"provider-logo": BadgeCheck, "sign-in": LogIn, "onboarding-step": Footprints, "file-drop": FileUp, "connector-picker": Plug, "setup-checklist": ListTodo, "usage-meter": Gauge,
	"sheet-grid": Sheet, "columns-menu": Columns2, "run-status-bar": Activity, "field-mapping": ArrowLeftRight, "csv-import": FileSpreadsheet, "action-catalogue": LibraryBig, "table-settings": Settings2,
	"dense-table": TableProperties, "split-button": SquareChevronDown,
	"chart-share-bar": SquareSplitHorizontal, "ranked-list": ListOrdered, "change-list": ArrowUpDown, "order-book": ArrowDownUp, "pane-layout": LayoutPanelTop, "chart-price": TrendingUp, "chart-waterfall": ChartColumnBig,
	"chart-bullet": BarChartHorizontal, "chart-treemap": LayoutPanelTop, "chart-sankey": Workflow, "chart-histogram": AlignStartVertical, "chart-box-plot": ChartNoAxesGantt,
	"chart-candlestick": CandlestickChart,
	"chart-radial-bars": CircleDashed, "chart-map": Earth, "timeline": GanttChart, "scheduler": CalendarDays, "chart-radial-lines": Radar, "guide-cue": Signpost, "date-picker": CalendarCheck, "combobox": ChevronsUpDown, "tag-input": Tags,
};

export function PageIcon({ id, icon }: { id?: string; icon?: LucideIcon }) {
	const Icon = icon ?? (id ? ICONS[id] : undefined) ?? FileText;
	return (
		<span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-sm bg-primary-soft text-primary-ink transition-colors duration-(--duration-fast) group-hover:bg-primary group-hover:text-primary-foreground">
			<Icon className="size-4" strokeWidth={1.75} />
		</span>
	);
}
