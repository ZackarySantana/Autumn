/** @jsxImportSource react */

function StepContainer(props: { isFirst: boolean; children: React.ReactNode }) {
    return (
        <li
            className={`relative flex gap-2 after:absolute after:left-[11px] after:top-[25px] after:h-[calc(100%-4px)] after:w-[2px] after:border-[1px] after:border-solid after:content-[''] [&:last-child]:after:hidden [.reversed>&]:after:left-[calc(100%-14px)] ${
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
            className={`flex h-[25px] w-[25px] items-center justify-center rounded-[50%] border-[2px] border-solid text-xs leading-[25px] ${
                props.children === 0
                    ? "border-mdb-green text-mdb-green"
                    : "border-mdb-text-primary"
            }`}
        >
            {props.children + 1}
        </div>
    );
}

export default function VerticalStepper(props: { generated: string[][] }) {
    return (
        <ol className="flex flex-col gap-5">
            {props.generated.map((item, index) => (
                <StepContainer
                    key={index}
                    isFirst={index === 0}
                >
                    <StepNumber>{index}</StepNumber>
                    <ul className="flex flex-col">
                        {item.map((subitem, subindex) => {
                            return (
                                <li
                                    key={subindex}
                                    className={
                                        subindex === 0
                                            ? "text-lg font-bold"
                                            : "ml-5 list-disc"
                                    }
                                >
                                    {subitem}
                                </li>
                            );
                        })}
                    </ul>
                </StepContainer>
            ))}
        </ol>
    );
}
