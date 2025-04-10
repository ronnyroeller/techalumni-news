import { eachLimit } from "async";
import { config } from "dotenv";
import OpenAI from "openai";
import { Article, Category, Severity } from "../types";

config(); // loads OPENAI_API_KEY from .env

const categories: Category[] = [
	"AI / Threat Hunting",
	"Zero Day Vulnerabilities",
	"Business Email Compromise",
	"Ransomware",
	"Supply Chain Attacks",
	"Cloud Security",
	"IoT Security",
	"Critical Infrastructure",
	"Data Breaches",
	"Phishing Campaigns",
	"Other"
];
const severityLevels: Severity[] = ["Critical", "High", "Moderate", "Low"];

const MAX_WORKERS = 10;

const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY
});

export async function classifyWithOpenAI({
	title,
	summary
}: {
	title: string;
	summary: string;
}): Promise<{ category: Category; severity: Severity }> {
	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		temperature: 0.2,
		tools: [
			{
				type: "function",
				function: {
					name: "classify_article",
					description: "Classify a cybersecurity article by category and severity",
					parameters: {
						type: "object",
						properties: {
							category: {
								type: "string",
								enum: categories
							},
							severity: {
								type: "string",
								enum: severityLevels
							}
						},
						required: ["category", "severity"]
					}
				}
			}
		],
		messages: [
			{
				role: "system",
				content:
					"You are a cybersecurity analyst. Classify each article using the provided function."
			},
			{
				role: "user",
				content: `Title: ${title}\n\nSummary: ${summary}`
			}
		]
	});

	const toolCall = response.choices[0].message?.tool_calls?.[0];
	if (!toolCall || toolCall.function.name !== "classify_article") {
		throw new Error("No valid tool_call returned");
	}

	return JSON.parse(toolCall.function.arguments);
}

export async function classifyArticles(articles: Article[]): Promise<Article[]> {
	const result: Article[] = [];

	const classify = async (article: Article, callback: VoidFunction) => {
		try {
			console.log(`Classifying "${article.title}"...`);
			const { category, severity } = await classifyWithOpenAI({
				title: article.title,
				summary: article.summary,
			});
			result.push({ ...article, category, severity });
		} catch (err) {
			console.error(`❌ Failed to classify "${article.title}"`, err);
			result.push({ ...article, category: "Other", severity: "Moderate" });
		}

		callback();
	};

	await eachLimit(articles, MAX_WORKERS, classify);

	return result;
}
