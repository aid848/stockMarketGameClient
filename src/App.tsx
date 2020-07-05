import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';
import axios from 'axios';
const url:string = "http://192.168.1.156:8080"; // todo read from config or auto detect?


function App(this: any) {

    const [btnTxt, setBtnTxt] = useState('click me!');
    const [loggedin, setlogin] = useState(0);
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState("Please Login");

    if (loggedin === 0) {
     return loginscreen(setlogin,username,setusername, password, setPassword, loginMessage, setLoginMessage);
    }
  return (
    <div className="App">
        <Button color="danger" onClick={() => {
            if (btnTxt === "click me!") {
                // @ts-ignore
                setBtnTxt('clicked')
            }else {
                // @ts-ignore
                setBtnTxt("click me!")
            }
        }}>{btnTxt}</Button>
    </div>
  );
}

function loginscreen(setlogin:any,username:any,setusername:any, password:any, setPassword:any, loginMessage:any, setLoginMessage:any) {

return (
    <div className="login">
        <p>{loginMessage}</p>
        <Form onSubmit = {() => {
            console.log()
        }}>
            <FormGroup>
                <Label for="username">username</Label>
                <Input type="text" id="username" onChange={(chg) => {
                    chg.preventDefault();
                    let x = chg.target.value
                    // console.log(x);
                    setusername(x);
                }}/>
            </FormGroup>
            <FormGroup>
                <Label for="password">password</Label>
                <Input type="password" id="password" onChange={(chg) => {
                    chg.preventDefault();
                    let x = chg.target.value
                    // console.log(x);
                    setPassword(x);
                }}/>
            </FormGroup>
        </Form>
        <button onClick={() =>
        {
            console.log("trying logging in: " + username + " Pass: " + password);
            return axios.post(url+"/login", {username: username, password:password}).then((res) => {
                if(res.status === 202) {
                    setLoginMessage("Accepted");
                    setlogin(1);
                }else {
                    setLoginMessage("Invalid Credentials");
                }
            }).catch((err) => {
                setLoginMessage("Invalid Credentials");
            })
        }
        }>login</button>
    </div>
)
}

export default App;
