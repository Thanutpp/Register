import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, userEffect, useEffect } from 'react';
import { auth } from '../../Database/firebase';
import firestore from '../../Database/firebase';

function Navbar({Logout}){
    const Users = firestore.collection('Users');
    const location = useLocation();
    const [user, setUser] = useState('');
    const [img, setImg] = useState(null);
    const [logout, setLogout] = useState(false);
    console.log(user.Photo)

    useEffect(() =>{
        auth.onAuthStateChanged((user) =>{
            Users.doc(user.uid).get().then((data) =>{
                console.log(data.data().Photo.default)
                setImg(data.data().Photo.default)
                setUser(data.data())
            })
        })
    },[])

    return(
        <div className="container-navbar">
            <div className="navbar">
                <div className="text-navbar">
                    { location.pathname == '/profile' ? (
                        <span>ประวัติส่วนตัว</span>
                    ) : location.pathname == '/timetable' ? (
                        <span>ตารางเรียน</span>
                    ) : (
                        <span>ลงทะเบียนเรียน</span>
                    ) }
                </div>
                <div className="choose-navbar">
                    <Link to="/enroll" className="text-link">ลงทะเบียนเรียน</Link>
                    <Link to="/timetable" className="text-link">ตารางเรียน</Link>
                    <Link to="/subject" className="text-link">รายวิชา</Link>
                </div>
                <div className="user-navbar" onMouseOver={() => setLogout(true)} onMouseLeave={() => setLogout(false)}>
                    <div className="name-user"><span>{ user ? user.Name : null }</span></div>
                    <div className="img-user" style={ img != undefined ? { backgroundImage : `url(${img})` } : { backgroundImage : `url(${user.Photo})` } }></div>
                    <div className={ logout == true ? 'Logout active' : 'Logout' } onClick={() => Logout()}>
                        <div className="logout" onClick={() => Logout()}>
                            <div className="logout-box"><span>Logout</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;