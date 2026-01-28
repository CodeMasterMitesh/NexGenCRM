export const EventsBtn = () => {
    const handleClick = ()=>  {
        alert("Clicked!");
    }
    const handleMouseEnter = () => {
        console.log("Mouse Entered!");
    }
    return (
        <>
            {/* inline event handler */}
            <button onClick={()=>console.log("Clicked Again")}>Click me</button>

            {/* external event handler with named function */}
            <button onClick={handleClick}>Click me 1</button>
            <button onMouseEnter={handleMouseEnter} onMouseLeave={() => console.log("Mouse Left!")}>Mouse Enter/Out Here</button>

            {/* external event handler with anonymous function */}

            <button onClick={() => handleClick()}>Click me 3</button>
        </>
    )
}