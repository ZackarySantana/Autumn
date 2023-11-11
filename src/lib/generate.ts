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
                        "You will be provided a pull request title and body, as well as other recent pull request title's and body's. You will construct a changelog for the current pull request using the other pull requests as context. If the change is small, you can send nothing. If the change is large, you can send multiple lines. Do not include any ticket labels in the changelog. Use a professional tone that focuses on how users might be impacted by the change. Begin the changelog with a number 1-4 to indicate the type of change. 1: Bug Fix, 2: New Feature, 3: Improvement, 4: Other. If you do not know the type of change, use 4. Then a second number 1-4 to indicate the impact of the change. 1: Low, 2: Medium, 3: High, 4: Critical. If you do not know the impact of the change, use 1. For example a changelog might be: 1.4: Fixed a bug where the app would crash when opening a file.",
                },
                {
                    role: "user",
                    content: `Pull Request Title: "${pr.title}". Pull Request Body: "${pr.body}". Recent PRs: "${recentPRsText}")}`,
                },
            ],
            model: "gpt-4-1106-preview",
        })
        .then((res) => {
            return res.choices[0].message.content?.split("\n") ?? [];
        });
}
