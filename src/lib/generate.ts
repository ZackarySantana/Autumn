import OpenAI from "openai";
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

export function generateMessage(pr: PR, recentPRs: PR[]): Promise<string[]> {
    let recentPRsText = recentPRs
        .map((pr) => `\n${pr.title} - ${pr.body}`)
        .join("\n===\n");
    if (recentPRsText.length > 500) {
        recentPRsText = recentPRsText.slice(0, 500);
    }

    return openai.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content:
                        "You will be provided a pull request title and a list of other recent pull requests, write a succinct changelog relating to the pull request. You will use the other prs as context. Do not include the ticket label in the changelog, which might appear . Use a branded and professional tone and provide as much context for the changelog. Do not start it with a bullet or anything else. It can be up to 3 lines. Only send the summary.",
                },
                {
                    role: "user",
                    content: `Pull Request Title: "${pr.title}". Pull Request Body: "${pr.body}". Recent PRs: "${recentPRsText}")}`,
                },
            ],
            model: "gpt-3.5-turbo-16k",
        })
        .then((res) => {
            return res.choices[0].message.content?.split("\n") ?? [];
        });
}
