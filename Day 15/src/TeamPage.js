import React, {useEffect,useState} from 'react';
import api from './api';
import { io } from 'socket.io-client';


export default function TeamPage({ team, back }){
const [tasks, setTasks] = useState([]);
const socketRef = React.useRef();
}