import OpenAI from "openai";
export type Message = {
    changelog: string;
    type: "Bug Fix" | "Improvement" | "Other";
    ticket_id: string;
    impact: 1 | 2 | 3 | 4;
};

export type PR = {
    url: string;
    html_url: string;
    diff_url: string;
    title: string;
    user: {
        login: string;
        avatar_url: string;
    };
    body: string;
    created_at: string;
    updated_at: string;
    closed_at: string;
    merged_at: string;
    merge_commit_sha: string;
};

const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_KEY ?? process.env.OPENAI_KEY,
    organization: import.meta.env.OPENAI_ORG_ID ?? process.env.OPENAI_ORG_ID,
});

export function generateMessage(pr: PR, recentPRs: PR[]): Promise<Message> {
    const recentPRsText = recentPRs
        .map((pr) => `\n${pr.title} - ${pr.body}`)
        .join("\n===\n");

    return openai.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a product manager for a team that is responsible for writing a professional changelog. You are given one commit at a time and a list of recent previous commits, that may or may not be relevant to the one commit. You will write a 0-3 line changelog for the commit. The changelog should be as high-level as can be and help users adapt to the change in the system. As well, you will respond with the type of change of either 'Bug Fix', 'Improvement', 'Other'. And the impact of the change, which is 1-4 with 1 being most impactful. If you do not know the type of change or the impact, you will say 'Other' or 4. You will respond in JSON only, with properties 'changelog', 'type', 'ticket_id, and 'impact'. Where 'ticket_id' is the JIRA ticket id if it exists.",
                },
                {
                    role: "user",
                    content: `Pull Request Title: "${pr.title}". Pull Request Body: "${pr.body}". Recent PRs: "${recentPRsText}")}`,
                },
            ],
            model: "gpt-4-1106-preview",
        })
        .then((res) => {
            return JSON.parse(
                res.choices[0].message.content
                    ?.split("\n")
                    .filter((l) => !l.startsWith("```"))
                    .join("\n") ?? "{}",
            ) as Message;
        });
}
