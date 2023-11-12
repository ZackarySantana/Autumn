/** @jsxImportSource react */

import { type Changelog, changelogDate } from "src/lib/changelog";

function StepContainer(props: { isFirst: boolean; children: React.ReactNode }) {
    return (
        <li
            className={`relative flex gap-2 after:absolute after:left-[11px] after:top-[25px] after:h-[calc(100%-3px)] after:w-[2px] after:border-[1px] after:border-solid after:content-[''] [&:last-child]:after:hidden ${
                props.isFirst
                    ? "after:border-mdb-green"
                    : "after:border-mdb-text-primary"
            }`}
        >
            {props.children}
        </li>
    );
}

function StepNumber(props: { children: number }) {
    return (
        <div
            className={`flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-[50%] border-[2px] border-solid text-xs leading-[25px] ${
                props.children === 0
                    ? "border-mdb-green text-mdb-green"
                    : "border-mdb-text-primary"
            }`}
        >
            {props.children + 1}
        </div>
    );
}

export default function VerticalStepper({
    changelog,
}: {
    changelog: Changelog[];
}) {
    return (
        <ol className="flex flex-col gap-5">
            {changelog.map((item, index) => (
                <StepContainer
                    key={index}
                    isFirst={index === 0}
                >
                    <StepNumber>{index}</StepNumber>
                    <ul className="flex flex-col">
                        <li className="text-lg font-bold">
                            {changelogDate(item.week)}
                        </li>
                        {item.commits.map((subitem, subindex) => {
                            return (
                                <li
                                    key={subindex}
                                    className="ml-5 list-disc"
                                >
                                    {subitem.generated.changelog}
                                </li>
                            );
                        })}
                    </ul>
                </StepContainer>
            ))}
        </ol>
    );
}
