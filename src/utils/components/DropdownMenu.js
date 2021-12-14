import {useComponentVisible} from "../use-component-visible";
import {useState} from "react";

/**
 * The menu containing the available options.
 * @param label a String containing the label of the form { amount, category, difficulty, type }.
 * @param content an Object where each key value is a list item for the DropdownMenu.
 * @param formSetter a function that sets the innerHTML value of the input div ( passed to DropdownItem ).
 * @returns {JSX.Element}
 */
export function DropdownMenu({ label, content, formSetter }) {
    const { ref, isComponentVisible, setIsComponentVisible } =  useComponentVisible(false)

    /**
     * The item in the DropdownMenu.
     * @param value tne text value of the DropdownItem.
     * @param formSetter a function that sets the innerHTML value of the input div.
     * @returns {JSX.Element}
     */
    function DropdownItem({ value, formSetter }) {
        const [ itemValue ] = useState(value)

        return (
            <a onClick={() => {
                formSetter(itemValue)
            }}>{itemValue.toUpperCase()}</a>
        )
    }

    return (
        <div>
            <button onClick={() => {
                const visible = !isComponentVisible
                setIsComponentVisible(visible)
            }} className={"dropbtn"}>▼</button>
            {isComponentVisible && (<div ref={ref} className={"dropdown-content"}>
                {content && Object.keys(content).map((key, index) => <DropdownItem key={key} value={content[key]} formSetter={formSetter}/>)}
            </div>)}

        </div>
    )
}