import './Loading.css';

function Loading(){
    return(
        <div id="wapaper">
            <h1 className="h1">Loading</h1>
            <div className="loading-spinner"></div>
            <div className="loading-dots">
                <div className="bounce"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </div>
    )
}

export default Loading;