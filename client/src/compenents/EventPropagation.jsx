export const EventPropagation = () => {
    const grandParentClick = (e) => {
        // e.stopPropagation();
        alert("Grand Parent Div Clicked");
        console.log("Grand Parent Div Clicked");
    }

    const parentClick = (e) => {
        // e.stopPropagation();
        alert("Parent Div Clicked");
        console.log("Parent Div Clicked");
    }

    const childClick = (e) => {
        // e.stopPropagation();
        alert("Child Div Clicked");
        console.log("Child Div Clicked");
    }
    return (
        <div style={{margin:'10', border:"2px solid black",textAlign:"center"}} onClickCapture={grandParentClick}> Grand Parent Div
            <div style={{margin:'10', borderTop:"2px solid black",textAlign:"center"}} onClickCapture={parentClick}> Parent Div
                <div style={{margin:'10', borderTop:"2px solid black",textAlign:"center"}} onClickCapture={childClick}>Child Div </div>
            </div>
        </div>
    );
}



// Event propagation in React follows the standard DOM event propagation model of three phases: capturing, targeting, and bubbling. By default, most React event handlers execute during the bubbling phase and use a SyntheticEvent system for cross-browser consistency. 
// The Three Phases of Event Propagation
// When an event, such as a click, occurs on an element nested within others, it travels through the DOM in the following order: 
// Capturing Phase: The event starts from the top of the DOM (the window and document) and travels down to the target element. Event handlers with the Capture suffix (e.g., onClickCapture) are called during this phase.
// Target Phase: The event reaches the actual element that was clicked. The event handler on the target element fires.
// Bubbling Phase: The event then travels back up the DOM tree from the target element to the root. This is the default phase for most React event handlers (e.g., onClick), so a parent's handler will also be triggered after a child's handler runs. 
// Key Concepts and Control Methods
// SyntheticEvent: React wraps native browser events in a SyntheticEvent object. This object provides a consistent interface and behavior across different browsers.
// event.stopPropagation(): You can use this method within an event handler to stop the event from continuing to propagate up (or down) the DOM tree. For example, calling e.stopPropagation() in a child button's onClick handler prevents the parent div's onClick handler from running.
// event.preventDefault(): This method prevents the browser's default behavior for a specific event (e.g., preventing a form submission or a link from navigating to a new URL).
// onClickCapture: By appending Capture to an event name in JSX, you can register a handler that runs in the capturing phase instead of the bubbling phase. 
// Event Delegation
// React internally uses event delegation, where most event listeners are attached to the root of the application (or document in older React versions) rather than individual DOM nodes. This makes event handling more efficient, especially for dynamic lists, as only one listener manages events for all children by leveraging the bubbling mechanism