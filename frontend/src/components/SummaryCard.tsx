type SummaryCardProps = {
    label: string;
    value: number;
};
export default function SummaryCard(props: SummaryCardProps) {
    return (
        <article className="summary-card">
            <p className="summary-card__label">{props.label}</p>
            <p className="summary-card__value">{props.value}</p>
        </article>
    );
}