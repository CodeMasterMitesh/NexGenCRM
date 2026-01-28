export const Greeting = () => {
    const greet = () => {
        alert("Welcome to NexGenCRM!");
    }
    return (
        <WelcomeMessage click={greet} />
    )

}

const WelcomeMessage = (props) => {
    return (
        <button onClick={props.click}>Click to Greet</button>
    )
}