import { useState } from "react";
export const StateManagement = ({ className = "" }) => {
    // console.log(useState(10));
    const [count, setCount] = useState(0);
    // console.log("initial value",count);
    const increment = () => {
        setCount(count + 1);
    }
       console.log(count);
    return (
        <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Count: {count}</span>
            <button onClick={increment} className={className || "btn btn-outline-secondary"}>
                Click Me
            </button>
        </div>
    );

}