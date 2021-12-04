export function Modal({ children, header, hideModal, size }) {
    return (
        <div className={"center"}>
            <div className={"register-background center"} onClick={hideModal}/>
            <div className={"card modal-box " + (size? size : "")}>
                <div className={"close"}>
                    <button onClick={hideModal} className={"close-btn"}>X</button>
                </div>
                <div className={"modal-header center " + (size? "h-" + size : "")}>{header.toUpperCase()}</div>
                <div className={"modal-content"}>
                    {children}
                </div>
            </div>
        </div>
    )
}

