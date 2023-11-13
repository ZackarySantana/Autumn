export type BadgeType = "Bug Fix" | "Improvement" | "Other";
export default function Badge({
    children,
    type,
}: {
    type: BadgeType;
    children: React.ReactNode;
}) {
    let cn = "";
    if (type === "Improvement") {
        cn =
            "text-mdb-text-blue-foreground bg-mdb-text-blue-background border-mdb-text-blue-border";
    }
    if (type === "Bug Fix") {
        cn =
            "text-mdb-text-red-foreground bg-mdb-text-red-background border-mdb-text-red-border";
    }
    if (type === "Other") {
        cn =
            "text-mdb-text-green-foreground bg-mdb-text-green-background border-mdb-text-green-border";
    }
    return (
        <div
            className={`h-fit w-fit shrink-0 rounded-sm px-2 text-xs font-bold uppercase ${cn}`}
        >
            {children}
        </div>
    );
}
