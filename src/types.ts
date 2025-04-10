export interface FeedConfig {
	name: string;
	url: string;
}

export type Category =
	| "AI / Threat Hunting"
	| "Zero Day Vulnerabilities"
	| "Business Email Compromise"
	| "Ransomware"
	| "Supply Chain Attacks"
	| "Cloud Security"
	| "IoT Security"
	| "Critical Infrastructure"
	| "Data Breaches"
	| "Phishing Campaigns"
	| "Other";
export type Severity = "Critical" | "High" | "Moderate" | "Low";

export interface Article {
	title: string;
	summary: string;
	link: string;
	published: string;
	source: string;
	category?: Category;
	severity?: Severity;
}
