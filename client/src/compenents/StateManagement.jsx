import { use, useState } from "react";
export const StateManagement = () => {
    // console.log(useState(10));
    const [count, setCount] = useState(0);
    // console.log("initial value",count);
    const increment = () => {
        setCount(count + 1);
    }
       console.log(count);
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Click Me</button>
        </div>
    );

}