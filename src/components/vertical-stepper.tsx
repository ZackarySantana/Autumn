/* eslint-disable max-lines-per-function */
/** @jsxImportSource react */

import { type Changelog, changelogDate } from "src/lib/changelog";
import Badge from "./badge";
import { Link } from "lucide-react";

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
                    <ul className="flex flex-col gap-5">
                        <li className="text-lg font-bold">
                            {changelogDate(item.week)}
                        </li>
                        {item.commits.map((subitem, subindex) => {
                            return (
                                <li
                                    key={subindex}
                                    className="5 flex flex-col justify-center gap-1"
                                >
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold">
                                            {subitem.generated.ticket_id ===
                                                "" ||
                                            subitem.generated.ticket_id === null
                                                ? "Unknown"
                                                : subitem.generated.ticket_id}
                                        </h3>
                                        <a
                                            href={subitem.url}
                                            target="_blank"
                                        >
                                            <Link
                                                height={20}
                                                width={20}
                                            />
                                        </a>
                                    </div>
                                    <p className="leading-5">
                                        {subitem.generated.changelog}
                                    </p>
                                    <div className="shrink-0">
                                        <Badge type={subitem.generated.type}>
                                            {subitem.generated.type}
                                        </Badge>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </StepContainer>
            ))}
        </ol>
    );
}
