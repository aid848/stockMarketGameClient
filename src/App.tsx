import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Modal, ModalBody, ModalFooter,
    Nav,
    Navbar,
    NavItem,
    Row, Spinner,
    Table
} from 'reactstrap';
import axios from 'axios';
import {createSecretKey} from "crypto";
const url:string = "http://localhost:8080"; // todo read from config or auto detect?

function UserMessage(setUserMsg:any, message:string) {
    if(message === "") {
        setUserMsg(<Spinner size="sm" color="primary" />);
    }else {
        setUserMsg(message);
    }
}

function App(this: any) {

    const [loggedin, setlogin] = useState(0);
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [company, setCompany] = useState("");
    const [loginMessage, setLoginMessage] = useState("Please Login");
    const [tableRows, setTable] = useState([]);
    const [holdingRows, setHoldingRows] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [seletedCompany, selectCompany] = useState("");
    const [shares, setShares] = useState(0);
    const [tradeOp, setTradeOp] = useState(0);
    const [money, setMoney] = useState(0);
    const [userMsg, setUserMsg] = useState(<Spinner size="sm" color="primary" />);
    const [popup, setPopup] = useState(false);
    const [focusAfterClose, setFocusAfterClose] = useState(true);

    if (loggedin === 0) {
     return loginscreen(setlogin,username,setusername, password, setPassword, loginMessage,
         setLoginMessage, setCompany, setTable, setCompanies, setHoldingRows, setMoney);
    }
    if(loggedin === -1){
        // todo admin console
    }
  return ( // main menu
    <div className="App">
        {/*todo put a navbar with refresh, company name, and money*/}
        {/*todo get logged in company holdings as third column in main activity*/}

        <Nav pills className="topBar">
            <NavItem>
                <button onClick={() => {
                    fetchTable(setTable, setCompanies, setHoldingRows, company, setMoney);
                    // todo set money
                }}>Refresh</button>
            </NavItem>
            <NavItem>
                {company}
            </NavItem>
            <NavItem disabled>
                ${money}
            </NavItem>
        </Nav>

        <Container fluid>
            <Row>
                <Col xs="auto">
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
                <Col xs="auto">
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
                                <Input type="radio" name="radio1" defaultChecked onClick = {(c)=> {
                                    setTradeOp(0)
                                }}/>
                                Sell
                            </Label>
                        </FormGroup>
                        <Button onClick={()=> {
                            // todo do rest request and the toast result and update table
                            // console.log("trading:" + seletedCompany + shares + tradeOp + company);
                            axios.post(url + "/trade", {buyer: company, seller:seletedCompany, amount: shares, operation: tradeOp}).then((res) => {
                                setPopup(true);
                                fetchTable(setTable,setCompanies, setHoldingRows, company, setMoney);
                                UserMessage(setUserMsg,res.data.message);
                                // console.log("traded")
                                // console.log(res);
                            });
                        }}>Trade</Button>
                    </Form>
                </Col>
                <Col xs="auto" >
                    <Table striped>
                        <thead>
                        <tr>
                            <th>Held Company</th>
                            <th>Amount of Shares</th>
                            <th>Total Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {holdingRows}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>

        <Modal returnFocusAfterClose={focusAfterClose} isOpen={popup}>
            <ModalBody>
                {userMsg}
                {/*todo replace with spinner that changes once trade is complete, disable button until ready*/}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" id="closeBtn" onClick={() => {
                    setPopup(!popup);
                }}>Done</Button>
            </ModalFooter>
        </Modal>

    </div>
  );
}

function loginscreen(setlogin:any,username:any,setusername:any, password:any, setPassword:any,
                     loginMessage:any, setLoginMessage:any, setCompany:any, setTable:any,
                     setCompanies:any, setHoldingRows:any, setMoney) {

return (
    <div className="login">
        <p>{loginMessage}</p>
        <Form onSubmit = {() => {
            // console.log()
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
        <Button color="danger" onClick={() =>
        {
            // console.log("trying logging in: " + username + " Pass: " + password);
            return axios.post(url+"/login", {username: username, password:password}).then((res) => {
                if(res.status === 202) {
                    setLoginMessage("Accepted");
                    // console.log( "axios data: "+res.data.name);
                    setCompany(res.data.name)
                    fetchTable(setTable, setCompanies, setHoldingRows, res.data.name, setMoney);
                    setlogin(1);
                }else {
                    setLoginMessage("Invalid Credentials");
                }
            }).catch((err) => {
                setLoginMessage("Invalid Credentials");
            })
        }
        }>Login</Button>
        <p></p>
        <Button color="warning" onClick={() => window.alert("I don't do anything yet")}>Admin Panel</Button>
    </div>
)
}

function fetchTable(setTable:any, setcompanies:any, setHoldingRows:any, company:any, setMoney:any) {
    axios.get(url+ "/companies").then((rows) => {
        // console.log(rows);
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
                        <td>${(1.00*rows.data[i].value).toFixed(2)}</td>
                        <td>{rows.data[i].sharesRemaining}</td>
                        <td>{((rows.data[i].previous_value - rows.data[i].value)/ rows.data[i].value).toFixed(4) }%</td>
                        {/*// todo do computation on serverside*/}
                    </tr>
                )
            }
            // console.log(comps)


            setcompanies(comps);
            setTable(results)
        }
    })

    axios.get(url + "/company/" + company).then((rows) => {
        console.log(rows);
        let holdings:any[] = [];
        let money: number = 0;
        let length = rows.data.length;
        for(let i:number = length - 1; i>=0; i--){
            if(i === 0) { // todo optimize this out of loop
                money = rows.data[i].money.toFixed(2);
            }
            if(rows.data[i].amount !== 0) {
                holdings.push(
                    <tr>
                        <td>{rows.data[i].held}</td>
                        <td>{rows.data[i].amount}</td>
                        <td>${(rows.data[i].amount * rows.data[i].value).toFixed(2)}</td>
                    </tr>
                );
            }
        }

        setHoldingRows(holdings);
        setMoney(money);
    })
}

export default App;
