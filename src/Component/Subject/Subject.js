import './Subject.css';
import { auth } from '../../Database/firebase';
import firestore from '../../Database/firebase';
import { useState, useEffect } from 'react';
import Select from 'react-select';

function Subject(){
    const [sub, setSub] = useState('');
    const [sec, setSec] = useState('');
    const Idsub = firestore.collection('Idsub');
    console.log(sub)
    
    const option = [
        { label: '1', value: '1' },
        { label: '2', value: '2' }
    ]

    useEffect(() =>{
        if(sec){
            Idsub.doc(sec).get().then((data) =>{
                const Data = data.data();
                let allData = [];
                for(let x in Data){
                    allData = [...allData, Data[x]]
                }
                setSub(allData);
            })
        }
    },[sec])

    const select = (value) =>{
        const Sec = value.value;
        setSec(Sec)
    }

    return(
        <div className="container-subject">
            <div className="text-subject">
                <h1>รายวิชา</h1>
            </div>
            <div className="Selectsec">
                <Select options={option} onChange={select} placeholder="Sec" />
            </div>
            { sub ? (
                <div className="listsub">
                { sub && (
                    sub.map((data ,index) =>{
                        return(
                            <div className="sub" key={index}>
                                <div className="sub-Id"><span>{data.Id}</span></div>
                                <div className="sub-Name"><span>{data.Name}</span></div>
                                <div className="sub-Credit"><span>{data.Credit}</span></div>
                                <div className="sub-Time"><span>{data.Time}</span></div>
                                <div className="sub-Room"><span>{data.Room}</span></div>
                                <div className="sub-Teacher"><span>{data.Teacher}</span></div>
                            </div>
                        )
                    })
                ) }
            </div>
            ) : (null) }
        </div>
    )
}

export default Subject;