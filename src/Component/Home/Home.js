import Navbar from '../Navbar/Navbar';
import './Home.css';
import Routes from '../../Route/Routes';

function Home({Logout, LoginState}){
    return(
        <>
        { LoginState ? (
            <>
            <Navbar Logout={Logout}/>
            <Routes /> 
            </>
        ) : null }
        </>
    )
}

export default Home;