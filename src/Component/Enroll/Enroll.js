import './Enroll.css'
import firestore from '../../Database/firebase';
import { auth } from '../../Database/firebase';
import { useState, useEffect, useRef} from 'react';
import Select from 'react-select';

function Enroll(){
    const ser = useRef();
    const Users = firestore.collection('Users');
    const Idsub = firestore.collection('Idsub');
    const Addsub = firestore.collection('Usersub');
    const Register = firestore.collection('Register');
    const Userinsub = firestore.collection('Userinsub');
    const Waitfordel = firestore.collection('Waitfordel');
    const [user, setUser] = useState(''); 
    const [setshownumsub, setSetshownumsub] = useState('');
    const [NumofStu, setNumofStu] = useState('');
    const [Subject, setSubject] = useState('');
    const [Subjectadd, setSubjectAdd] = useState('');
    const [inputvalue, setInputvalue] = useState('');
    const [allSubject, setAllSubject] = useState('');
    const [credit, setCredit] = useState('');
    const [showSubject, setShowSubject] = useState('');
    const [deleteSub, setDeleteSub] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [check, setCheck] = useState('');
    const [Registersub, setRegistersub] = useState(null);
    const [Re, setRe] = useState(null);
    const [Resub, setResub] = useState(null);
    const [Renum, setRenum] = useState(true);
    const [sec, setSec] = useState('');
    const option = [
        { label: '1', value: '1' },
        { label: '2', value: '2' }
    ]
    const Green = {
        color: 'green'
    };
    const Red = {
        color: 'red'
    };
    const Yellow = {
        color: '#F7FD04'
    };
    

    useEffect(() =>{
        auth.onAuthStateChanged((user) =>{
            Users.doc(user.uid).get().then((data) =>{
                setUser(data.data())
            })
            Register.doc(user.uid).get().then((result) =>{
                if(result.exists != false){
                    setRegistersub(result.data().register)
                }
            })
        })
    },[Re])

    useEffect(async () =>{
        if(sec){
            await Idsub.doc(sec).get().then((data) =>{
                const id = data.data()
                setSubject(id[Subject.Id])
            })

            await Userinsub.doc(sec).collection('user').doc(Subject.Id).get().then((data) =>{
                const num = data.data().NumofStu;
                setSetshownumsub(num)
            })
        }
    },[sec])


    useEffect(() =>{
        auth.onAuthStateChanged((user) =>{  
            Addsub.doc(user.uid).get().then((data) =>{
                if(data.exists){
                    const subject = data.data().Sub;
                    const credit = data.data().Credit.toString();
                    setShowSubject(subject)
                    setAllSubject(subject)
                    setCredit(credit);
                    let allnum = [];
                    subject.forEach((data) =>{
                        Userinsub.doc(data.Sec).collection('user').doc(data.Id).get().then((res) =>{
                            const num = res.data().NumofStu;
                            allnum = [...allnum, { Id : data.Id, Sec : sec, Num : num }];
                            setNumofStu(allnum);
                        })
                    })
                }
            }).then(() =>{
                Userinsub.doc('1').collection('del').doc(user.uid).get().then((data) =>{
                    if(!data.exists){
                        Userinsub.doc('1').collection('del').doc(user.uid).set({ waitfordel : [] })
                    }
                })
                Userinsub.doc('2').collection('del').doc(user.uid).get().then((data) =>{
                    if(!data.exists){
                        Userinsub.doc('2').collection('del').doc(user.uid).set({ waitfordel : [] })
                    }
                })
            })
        })
    },[])

    useEffect(() =>{
        auth.onAuthStateChanged((user) =>{
            Addsub.doc(user.uid).get().then((data) =>{
                if(data.exists){
                    const subject = data.data().Sub;
                    const credit = data.data().Credit.toString();
                    setShowSubject(subject)
                    setAllSubject(subject)
                    setCredit(credit)
                    let allnum = [];
                    subject.forEach((data) =>{
                        Userinsub.doc(data.Sec).collection('user').doc(data.Id).get().then((res) =>{
                            const num = res.data().NumofStu;
                            allnum = [...allnum, { Id : data.Id, Sec : sec, Num : num }];
                            setNumofStu(allnum);
                        })
                    })
                    
                    if(subject == ''){
                        setDeleteSub(false)
                        setShowDelete(false)
                    }
                }
            })
        })
    }, [Resub])

    const addstu = () =>{
        const Id = user.Id;
        Register.doc(Id).get().then((result) =>{
            const sub = result.data().subjectregis;
            sub.forEach((data) =>{
                Userinsub.doc(data.Sec).collection('user').doc(data.Id).get().then((res) =>{
                    const student = res.data().Student;

                    if(student.length == 0){
                        let allstu = [Id];
                        let num = allstu.length;
                        Userinsub.doc(data.Sec).collection('user').doc(data.Id).set({ NumofStu : num, Student : allstu }).then(() =>{
                            console.log('เพิ่มนักเรียน')
                        }).then(() =>{
                            if(Renum){
                                setRenum(false)
                            }else{
                                setRenum(true)
                            }
                        })
                    }else{
                        const check = student.every((data) =>{
                            return data != Id
                        })

                        if(check){
                            let allstu = [...student, Id];
                            let num = allstu.length;
                            Userinsub.doc(data.Sec).collection('user').doc(data.Id).set({ NumofStu : num, Student : allstu }).then(() =>{
                                console.log('เพิ่มนักเรียน')
                            }).then(() =>{
                                if(Renum){
                                    setRenum(false)
                                }else{
                                    setRenum(true)
                                }
                            })
                        }else{
                            console.log('ลงไปเเล้ว')
                        }
                    }
                })
            })
        })
    }

    const deleuser = async () =>{
        await Userinsub.doc('1').collection('del').doc(user.Id).get().then((data) =>{
            if(data.exists){
                const Wait = data.data().waitfordel;
                if(Wait.length != 0){
                    Wait.forEach((data) =>{
                        Userinsub.doc('1').collection('user').doc(data).get().then((res) =>{
                            const student = res.data().Student;
                            const newStudent = student.filter((data) =>{
                                return data != user.Id;
                            })
                            const num = newStudent.length;
                            Userinsub.doc('1').collection('user').doc(data).update({ Student : newStudent, NumofStu : num })
                        })
                    })
                    Userinsub.doc('1').collection('del').doc(user.Id).set({ waitfordel : [] })
                }
            }else{
                Userinsub.doc('1').collection('del').doc(user.Id).set({ waitfordel : [] })
            }
        })

        await Userinsub.doc('2').collection('del').doc(user.Id).get().then((data) =>{
            if(data.exists){
                const Wait = data.data().waitfordel;
                if(Wait.length != 0){
                    Wait.forEach((data) =>{
                        Userinsub.doc('2').collection('user').doc(data).get().then((res) =>{
                            const student = res.data().Student;
                            const newStudent = student.filter((data) =>{
                                return data != user.Id;
                            })
                            const num = newStudent.length;
                            Userinsub.doc('2').collection('user').doc(data).update({ Student : newStudent, NumofStu : num })
                        })
                    })
                    Userinsub.doc('2').collection('del').doc(user.Id).set({ waitfordel : [] })
                }
            }else{
                Userinsub.doc('2').collection('del').doc(user.Id).set({ waitfordel : [] })
            }
        })
    }

    const Confirmsub = async () =>{
        await Addsub.doc(user.Id).get().then((data) =>{
            if(sec != ''){
                if(data.exists){
                    const subject = data.data().Sub;
                    
                    if(subject.length == 0){
                        let alldata = [Subject];
                        let credit = Subject.Credit;
                        // setAllSubject(alldata);
                        Userinsub.doc(Subject.Sec).collection('del').doc(user.Id).get().then((res) =>{
                            const wait = res.data().waitfordel;
                            if(wait.length != 0){
                                const check = wait.every((data) =>{
                                    return data != Subject.Id;
                                })

                                if(!check){
                                    const New = wait.filter((data) =>{
                                        return data != Subject.Id;
                                    })
                                    Userinsub.doc(Subject.Sec).collection('del').doc(user.Id).set({ waitfordel : New })
                                }
                            }
                        })
                        Addsub.doc(user.Id).set({ Sub : alldata, Credit : credit }).then(() =>{
                            console.log("Add Sub!");
                        }).then(() =>{
                            if(Resub){
                                setResub(false)
                            }else{
                                setResub(true)
                            }
                        })
                    }else{
                        const Credit = data.data().Credit;
                        let alldata = [...allSubject, Subject];
                        let credit = Credit + Subject.Credit;
                        
                        if(credit <= 19){
                            Userinsub.doc(Subject.Sec).collection('del').doc(user.Id).get().then((res) =>{
                                const wait = res.data().waitfordel;
                                if(wait.length != 0){
                                    const check = wait.every((data) =>{
                                        return data != Subject.Id;
                                    })
    
                                    if(!check){
                                        const New = wait.filter((data) =>{
                                            return data != Subject.Id;
                                        })
                                        Userinsub.doc(Subject.Sec).collection('del').doc(user.Id).set({ waitfordel : New })
                                    }       
                                }
                            })
                            Addsub.doc(user.Id).set({ Sub : alldata, Credit : credit }).then(() =>{
                                console.log("Add Sub!!")
                            }).then(() =>{
                                if(Resub){
                                    setResub(false)
                                }else{
                                    setResub(true)
                                }
                            })
                        }else{
                            alert('หน่วยกิตเกินจำนวนที่กำหนดเเล้ว!!')
                        }
                    }
                }else{
                    let alldata = [Subject]
                    let credit = Subject.Credit;
                    // setAllSubject(alldata)
                    Userinsub.doc(Subject.Sec).collection('del').doc(user.Id).get().then((res) =>{
                            const wait = res.data().waitfordel;
                            if(wait.length != 0){
                                const check = wait.every((data) =>{
                                    return data != Subject.Id;
                                })

                                if(!check){
                                    const New = wait.filter((data) =>{
                                        return data != Subject.Id;
                                    })
                                    Userinsub.doc(Subject.Sec).collection('del').doc(user.Id).set({ waitfordel : New })
                                }
                            }
                        })
                    Addsub.doc(user.Id).set({Sub : alldata, Credit : credit}).then(() =>{
                        console.log("Add Sub!")
                    }).then(() =>{
                        if(Resub){
                            setResub(false)
                        }else{
                            setResub(true)
                        }
                    })
                }
                setSubject('')
                setInputvalue('')
            }else{
                alert("เลือก section")
            }
        })
    }

    const searchsub = () =>{
        let value = ser.current.value;
        setInputvalue(value);
        if(value != ''){
            if(value.length >= 4){
                Idsub.doc('Subject').get().then((res) =>{
                    if(allSubject != ''){
                        const check = allSubject.every((data) =>{
                            return data.Id != value;
                        })
    
                        if(check){
                            if(res.exists){
                                setSubjectAdd('');
                                setSec('');
                                const id = res.data()
                                setSubject(id[value])
                                if(Renum == true){
                                    setRenum(false)
                                }else{
                                    setRenum(true)
                                }
                            }
                        }else{
                            alert("วิชานี้ถูกลงทะเบียนเรียนเรียบร้อยเเล้ว")
                            setInputvalue('')
                        }
                    }else{
                        if(res.exists){
                            setSubjectAdd('');
                            setSec('');
                            const id = res.data()
                            setSubject(id[value])
                            if(Renum == true){
                                setRenum(false)
                            }else{
                                setRenum(true)
                            }
                        }
                    }
                })
            }
        }else{
            setSubject('')
        }
    }

    const Deletesub = async(data) =>{
        const Sec = data.Sec;
        const Credit = data.Credit;
        const Id = data.Id;
        Addsub.doc(user.Id).get().then((result) =>{
            const resu = result.data().Sub
            const credit = result.data().Credit;
            const newCredit = credit - Credit;
            const re = resu.filter((data) =>{
                return data.Id != Id;
            })
            // setAllSubject(re)
            Addsub.doc(user.Id).update({ Sub : re , Credit : newCredit}).then(() =>{
                console.log("Delete Subject!!")
            }).then(() =>{
                if(Resub){
                    setResub(false)
                }else{
                    setResub(true)
                }
            })  
        })

        await Userinsub.doc(Sec).collection('user').doc(Id).get().then((data) =>{
            const student = data.data().Student;
            const check = student.every((res) =>{
                return res != user.Id;
            })

            if(!check){
                Userinsub.doc(Sec).collection('del').doc(user.Id).get().then((data) =>{
                    if(!data.exists){
                        let wait = [Id];
                        Userinsub.doc(Sec).collection('del').doc(user.Id).set({ waitfordel : wait }).then(() =>{
                            console.log('del')
                        })
                    }else{
                        const waitfordel = data.data().waitfordel;
        
                        if(Waitfordel.length == 0){
                            let wait = [Id];
                            Userinsub.doc(Sec).collection('del').doc(user.Id).set({ waitfordel : wait }).then(() =>{
                                console.log('del!')
                            })
                        }else{
                            const Check = waitfordel.every((res) =>{
                                return res != Id
                            })
        
                            if(Check){
                                let wait = [...waitfordel, Id];
                                Userinsub.doc(Sec).collection('del').doc(user.Id).set({ waitfordel : wait }).then(() =>{
                                    console.log('del!!')
                                })
                            }else{
                                console.log('ลบไปเเล้ว')
                            }
                        }
                    }
                })
            }
        })
    }

    const Deletesubject = (data) =>{
        if(deleteSub == true){
            setShowDelete(true)
            setCheck(data.Id)
        }
    }

    const Submitenroll = () =>{
        if(allSubject != ''){
            const cre = parseInt(credit)
            Register.doc(user.Id).set({ Tablesub : true, register : false, subjectregis : allSubject , Username : user.Name, UserId : user.Id, Credit : cre}).then(() =>{
                console.log("Register!!")
            })
            addstu();
            deleuser();
            setRe(true)
        }else{
            alert('ลงทะเบียนอย่างน้อย 1 วิชา')
        }
    }

    const Delesub = () =>{
        if(allSubject != ''){
            setDeleteSub(true)
        }else{
            alert('ลงทะเบียนอย่างน้อย 1 วิชา')
        }
    }

    const setFalse = () =>{
        setDeleteSub(false)
        setShowDelete(false)
    }

    const Reregister = () =>{
        Register.doc(user.Id).update({ register : true,Tablesub : false }).then(() =>{
            console.log('Reregister!!')
        })
        setRe(false)
    }

    const select = (value) =>{
        const sec = value.value;
        setSec(sec)
    }

    return(
        <>
        { Registersub == true || Registersub == null ? (
            <>
                <div className="container-enroll">
                    <div className="head-table">
                        <div className="idsub"><span>รหัสวิชา</span></div>
                        <div className="namesub"><span>ชื่อวิชา</span></div>
                        <div className="credit"><span>หน่วยกิจ</span></div>
                        <div className="time"><span>เวลาเรียน</span></div>
                        <div className="sec"><span>Section</span></div>
                        <div className="room"><span>ห้องเรียน</span></div>
                        <div className="teacher"><span>อาจารย์</span></div>
                        <div className="numstu"><span>จำนวนนักศึกษา</span></div>
                    </div>
                </div>
                <div className="container-input">
                    <div className="sub-table">
                        { showSubject && showSubject.map((data, index, index2) =>{
                            return(
                                <>
                                    <div className="table-table" key={index} onMouseOver={() => Deletesubject(data)}>
                                        <div className="idsub-c" key={index}><span>{data.Id}</span></div>
                                        <div className="namesub-c" ><span>{data.Name}</span></div>
                                        <div className="credit-c"><span>{data.Credit}</span></div>
                                        <div className="time-c"><span>{data.Time}</span></div>
                                        <div className="sec-c"><span>{data.Sec}</span></div>
                                        <div className="room-c"><span>{data.Room}</span></div>
                                        <div className="teacher-c"><span>{data.Teacher}</span></div>
                                        { NumofStu && NumofStu.map((res) =>{
                                            if(res.Id == data.Id){
                                                return(
                                                    <div className="numstu-c">
                                                        <span>{ res.Num }/10</span>
                                                    </div>
                                                )
                                            }
                                        }) }
                                    </div>
                                    { showDelete == true && data.Id == check && (
                                        <div className="delete-table" key={index2} onClick={() => Deletesub(data)}>
                                            <div className="delete-box">
                                            <span>Delete</span>
                                        </div>
                                    </div>
                                    ) }
                                </>
                            );
                        }) }
                        { Subject && (
                            <>
                                <div className="table-table">
                                    <div className="idsub-c"><span>{Subject.Id}</span></div>
                                    <div className="namesub-c"><span>{Subject.Name}</span></div>
                                    <div className="credit-c"><span>{Subject.Credit}</span></div>
                                    <div className="time-c">
                                        { sec == '' ? (<span>-</span>) : (Subject.Time) }
                                    </div>
                                    <div className="sec-c"><Select options={option} onChange={select} placeholder="Sec" /></div>
                                    <div className="room-c">
                                        { sec == '' ? (<span>-</span>) : (Subject.Room) }
                                    </div>
                                    <div className="teacher-c">
                                        { sec == '' ? (<span>-</span>) : (Subject.Teacher) }
                                    </div>
                                    <div className="numstu-c">
                                        { sec == '' ? (<span>-</span>) : (<span>{setshownumsub}/10</span>) }
                                    </div>
                                </div>
                            </>
                        )}  
                        { deleteSub == false && (
                            <div className="idsub-input">
                                <input ref={ser} onChange={() => searchsub()} value={inputvalue} />
                            </div>  
                        ) }
                        { Subject && (
                            <>
                                <div className="btn-comfirm" onClick={() => Confirmsub()}><span>ลงทะเบียน</span></div>
                            </>
                        ) }
                    </div>
                    <div className="Credit">
                        <div className="credit-box">
                            <div className="credit-text">
                                <span>หน่วยกิตรวม</span>
                            </div>
                            <div className="credit-num">
                                <span style={credit >= 0 && credit <= 9 ? Green : credit >= 10 && credit <= 18 ? Yellow : Red }>{ credit ? credit : "0" }</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-btn">
                    <div className="line"></div>
                        <div className="btn-btn">
                        <div className="btn-submit" onClick={() => Submitenroll()}><span>ยืนยันการลงทะเบียนเรียน</span></div>
                            {deleteSub == false ? (
                                <div className="btn-delete" onClick={() => Delesub()}><span>ลบรายวิชาที่ลงทะเบียน</span></div>
                                ) : (
                                <div className="btn-delete" onClick={() => setFalse()}><span>ยกเลิกการลบวิชา</span></div>
                                ) }
                        </div>
                    </div>
            </>
        ) : (
            <div className="container-confirm">
                <div className="text-confirm"><h1>ลงทะเบียนเรียบร้อยเเล้ว</h1></div>
                <div className="re-register" onClick={() => Reregister()}><span>เพิ่ม-เปลี่ยน-ถอน</span></div>
            </div>
        ) }
        </>
    );
}

export default Enroll;
