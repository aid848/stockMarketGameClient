import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Container, Form, FormGroup, Input, Label, Row, Table} from 'reactstrap';
import axios from 'axios';
const url:string = "http://192.168.1.156:8080"; // todo read from config or auto detect?


function App(this: any) {

    const [loggedin, setlogin] = useState(0); // todo reenable login
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [company, setCompany] = useState("");
    const [loginMessage, setLoginMessage] = useState("Please Login");
    const [tableRows, setTable] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [seletedCompany, selectCompany] = useState("");
    const [shares, setShares] = useState(0);
    const [tradeOp, setTradeOp] = useState(0);

    if (loggedin === 0) {
     return loginscreen(setlogin,username,setusername, password, setPassword, loginMessage, setLoginMessage, setCompany, setTable, setCompanies);
    }
  return ( // main menu
    <div className="App">
        {/*todo put a navbar with refresh, company name, and money*/}
        <button onClick={() => {
            fetchTable(setTable, setCompanies);
        }}>Refresh</button>
        <Container>
            <Row>
                <Col xs="8">
                    <Table striped>
                        <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Share Value</th>
                            <th>Shares Remaining</th>
                            <th>% Change</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableRows}
                        </tbody>
                    </Table>
                </Col>
                <Col xs="4">
                    <Form>
                        <FormGroup>
                            <Label for="SelectCompany"> Select Company</Label>
                            <Input type="select" name="select" id="companySelect>" onChange={(chg) => {
                                // console.log(chg.target.value);
                                selectCompany(chg.target.value)
                            }}>
                                <option>Select a company</option>
                                {companies}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleEmail">Shares</Label>
                            <Input type="number" name="shares" id="numberofShares" placeholder="Enter number of shares" onChange={(chg) => {
                                let val:number = parseInt(chg.target.value);
                                setShares( val);
                            }} />
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="radio1" onClick = {()=> {
                                    setTradeOp(1)
                                }} />
                                Buy
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="radio1" onClick = {()=> {
                                    setTradeOp(0)
                                }}/>
                                Sell
                            </Label>
                        </FormGroup>
                        <Button onClick={()=> {
                            // todo do rest request and the toast result and update table
                            console.log("trading:" + seletedCompany + shares + tradeOp + company);
                        }}>Trade</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    </div>
  );
}

function loginscreen(setlogin:any,username:any,setusername:any, password:any, setPassword:any, loginMessage:any, setLoginMessage:any, setCompany:any, setTable:any, setCompanies:any) {

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
            // console.log("trying logging in: " + username + " Pass: " + password);
            return axios.post(url+"/login", {username: username, password:password}).then((res) => {
                if(res.status === 202) {
                    setLoginMessage("Accepted");
                    // console.log( "axios data: "+res.data.name);
                    setCompany(res.data.name)
                    fetchTable(setTable, setCompanies);
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

function fetchTable(setTable:any, setcompanies) {
    axios.get(url+ "/companies").then((rows) => {
        console.log(rows);
        let results:any[] = [];
        let comps:any[] = [];
        if(rows !== undefined) {
            let x: number = rows.data.length;
            for(let i:number = x-1; i>=0; i--) {
                comps.push(
                    <option>{rows.data[i].name}</option>
                );
                results.push(
                    <tr>
                        <td>{rows.data[i].name}</td>
                        <td>${1.00*rows.data[i].value}</td>
                        <td>{rows.data[i].sharesRemaining}</td>
                        <td>{(rows.data[i].previous_value - rows.data[i].value)/ rows.data[i].value }%</td>
                        {/*// todo do computation on serverside*/}
                    </tr>
                )
            }
            console.log(comps)
            setcompanies(comps);
            setTable(results)
        }
    })
}

export default App;
