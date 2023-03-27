import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Enroll from '../Component/Enroll/Enroll';
import Timetable from '../Component/Timetable/Timetable';
import Subject from '../Component/Subject/Subject';

function Routes(){
    return(
        <Switch>
            <Router path="/enroll">
                <Enroll />
            </Router>
            <Router path="/timetable">
                <Timetable />
            </Router>
            <Router path="/subject">
                <Subject />
            </Router>
        </Switch>
    );
}

export default Routes;