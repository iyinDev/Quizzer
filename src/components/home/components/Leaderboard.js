import {collection, getFirestore, limit, orderBy, query} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";

export function Leaderboard() {
    const db = getFirestore()
    const leaderboard = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(5))
    const [values, loading, error] = useCollectionData(leaderboard)

    function Leader({ value, index }) {
        return (
            <div className={"leader card " + index}>
                <div className={"leader-pos"}>{parseInt(index[1]) + 1}.</div>
                <div className={"leader-name"}>{value? value.user : ""}</div>
                <div className={"leader-score"}>{value? value.score : ""}</div>
            </div>
        )
    }

    function Leaders() {
        return (
            <div>
                <Leader value={values[0]} index={"l" + 0}/>
                <Leader value={values[1]} index={"l" + 1}/>
                <Leader value={values[2]} index={"l" + 2}/>
                <Leader value={values[3]} index={"l" + 3}/>
                <Leader value={values[4]} index={"l" + 4}/>
            </div>
        )
    }

    return (
        <div>
            <div className={"leaderboard-label"}>LEADERBOARD</div>
            <div className={"leaderboard-background"}>
                {values? <Leaders/> : <div/>}
            </div>
        </div>
    )
}