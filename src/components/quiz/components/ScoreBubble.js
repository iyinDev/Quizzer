/**
 * Displays a value from the quizSummary state.
 * @param label The label of the ScoreBubble.
 * @param value The value inside the ScoreBubble.
 * @returns {JSX.Element}
 */
export function ScoreBubble({ label, value }) {
    return (
        <div>
            <div className={"bubble-label"}>{label.toUpperCase()}</div>
            <div className={label}>{value}</div>
        </div>
    )
}