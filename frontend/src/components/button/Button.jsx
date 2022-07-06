import "./Button.scss";

function Button(props) {
    return (
        <button className="rounded-pill log-btn" onClick={props.onClick} disabled={props.disabled}>{props.text}</button>
    )
}

export default Button