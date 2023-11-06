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

export function generateMessage(pr: PR, recentPRs: PR[]): Promise<string[]> {
    return new Promise((resolve) => {
        resolve([pr.title]);
    });
}
