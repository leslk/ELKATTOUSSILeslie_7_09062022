import "./PasswordValidator.scss"

function PasswordValidator(props) {

    return (
    <div>
        <p>Le mot de passe doit contenir : </p>
        <ul>
            <PasswordValidatorItem valid={props.uppercase} text="1 majuscule"/>
            <PasswordValidatorItem valid={props.lowercase} text="1 minuscule"/>
            <PasswordValidatorItem valid={props.numbers} text="3 chiffres"/>
            <PasswordValidatorItem valid={props.symbol} text="1 caractère spécial"/>
            <PasswordValidatorItem valid={props.passwordLength} text="minimum 8 caractères"/>
        </ul>
    </div>

    ) 
}

function PasswordValidatorItem(props) {
    return <li className={props.valid ? "password-check" : "password-uncheck"}>{props.text}</li>
}


export default PasswordValidator;