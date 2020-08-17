import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {OverlayTrigger, Popover, Modal, ListGroupItem, ListGroup} from "react-bootstrap";
import {
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Nav,
    Navbar,
    NavItem,
    Row, Spinner,
    Table
} from 'reactstrap';
import axios from 'axios';



const url:string = "http://192.168.1.144:8080"; // todo read from config or auto detect?

function UserMessage(setUserMsg:any, message:string) {
    if(message === "") {
        setUserMsg(<Spinner size="sm" color="primary" />);
    }else {
        setUserMsg(message);
    }
}

function App(this: any) {

    const [userState, setUserState] = useState(0);
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [company, setCompany] = useState("");
    const [loginMessage, setLoginMessage] = useState("Please Login");
    const [tableRows, setTable] = useState([]);
    const [holdingRows, setHoldingRows] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [seletedCompany, selectCompany] = useState("");
    const [shares, setShares] = useState(0);
    const [tradeOp, setTradeOp] = useState(1);
    const [money, setMoney] = useState(0);
    const [userMsg, setUserMsg] = useState(<Spinner size="sm" color="primary" />);
    const [popup, setPopup] = useState(false);
    const [focusAfterClose, setFocusAfterClose] = useState(true);
    const [totalValue, setTotalValue] = useState(0);
    const [mainActivity, setMainActivity] = useState(BuildTradeScreen(tableRows, selectCompany, companies,setShares,tradeOp,setTradeOp,
        company,shares,setPopup,setTable,setCompanies,setHoldingRows,setMoney,setUserMsg,holdingRows,seletedCompany, setTotalValue))
    const [notify, showNotify] = useState(false);
    const [inspectCompany, setInspectCompany] = useState("Example");
    const [companyPhoto, setCompanyPhoto] = useState("");
    const [companyDescription, setDescription] = useState("");
    const [companyUpdates, setCompanyUpdates] = useState([]);


    // setUserState(1);

    if (userState === 0) {
     return loginscreen(setUserState,username,setusername, password, setPassword, loginMessage,
         setLoginMessage, setCompany, setTable, setCompanies, setHoldingRows, setMoney, setTotalValue);
    } else if(userState === -1){
        // todo admin console
    } else if (userState === 2){
        // todo company info page
        // let payload = companyPage(inspectCompany);
            return (
                <div className = "App">
                    {generateMainNav(company, money, setTable, setCompanies, setHoldingRows, setMoney, setUserState,showNotify, setInspectCompany, totalValue, setTotalValue, inspectCompany, setCompanyPhoto, setDescription, setCompanyUpdates)}

                    <Container fluid className="companyPage">
                        <Row>
                        <Col><img className="companyPhoto" src={"data:image/jpg;base64," + companyPhoto} /> </Col>
                            <Col> <p className="companyDescription">{companyDescription}</p> </Col>
                        </Row>
                        <Row>
                        {renderUpdates(companyUpdates)}
                        </Row>s
                    </Container>
                    <br/>
                </div>
            );




    } else if (userState === 3){
        return (<div className = "App">
            {generateMainNav(company, money, setTable, setCompanies, setHoldingRows, setMoney, setUserState,showNotify, setInspectCompany, totalValue, setTotalValue, inspectCompany, setCompanyPhoto, setDescription, setCompanyUpdates)}
            <Table striped style={{background: "white"}}>
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
        </div>)
    } else if(userState === 5) {
        // trade history
        return (
            <div className = "App">
                {generateMainNav(company, money, setTable, setCompanies, setHoldingRows, setMoney, setUserState,showNotify, setInspectCompany, totalValue, setTotalValue, inspectCompany, setCompanyPhoto, setDescription, setCompanyUpdates)}
            </div>);
    }
  return ( // main menu

    <div className="App">



        {generateMainNav(company, money, setTable, setCompanies, setHoldingRows, setMoney, setUserState,showNotify, setInspectCompany, totalValue, setTotalValue, inspectCompany, setCompanyPhoto, setDescription, setCompanyUpdates)}



        <Container className="tradeScreen" >
            <div className="text">
                <Row >
                    <Col xl="auto">
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
                        <Form onSubmit={e => e.preventDefault()}>
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
                                <Input onSubmit={e=>{e.preventDefault()}} type="number" name="shares" id="numberofShares" placeholder="Enter number of shares" onChange={(chg) => {
                                    let val:number = parseInt(chg.target.value);
                                    setShares( val);
                                }} />
                            </FormGroup>
                            <FormGroup check>
                                <Label check style={{color: 'black'}}>
                                    <Input type="radio" name="radio1" defaultChecked onClick = {()=> {
                                        setTradeOp(1)
                                    }} />
                                    Buy
                                </Label>
                            </FormGroup>
                            <FormGroup check >
                                <Label check style={{color: 'black'}}>
                                    <Input type="radio" name="radio1" onClick = {(c)=> {
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
                                    fetchTable(setTable,setCompanies, setHoldingRows, company, setMoney, setTotalValue);
                                    UserMessage(setUserMsg,res.data.message);
                                    // console.log("traded")
                                    // console.log(res);
                                });
                            }}>Trade</Button>
                        </Form>
                    </Col>

                </Row>
            </div>
        </Container>

        <Modal
            show={popup}
            // onHide={setPopup(!popup)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {userMsg}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {setPopup(!popup)}}>
                    Done
                </Button>
            </Modal.Footer>
        </Modal>

    </div>
  );
}

function BuildTradeScreen(tableRows:any, selectCompany:any, companies:any, setShares:any, tradeOp:any, setTradeOp:any,
                          company:any, shares:any, setPopup:any, setTable:any, setCompanies:any, setHoldingRows:any, setMoney:any,
                          setUserMsg:any, holdingRows:any, seletedCompany:any, setTotalValue:any) {
    return (<Container className="tradeScreen" >
        <div className="text">
            <Row >
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
                            <Label check style={{color: 'black'}}>
                                <Input type="radio" name="radio1" defaultChecked onClick = {()=> {
                                    setTradeOp(1)
                                }} />
                                Buy
                            </Label>
                        </FormGroup>
                        <FormGroup check >
                            <Label check style={{color: 'black'}}>
                                <Input type="radio" name="radio1" onClick = {(c)=> {
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
                                console.log("popup firing");
                                fetchTable(setTable,setCompanies, setHoldingRows, company, setMoney, setTotalValue);
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
        </div>
    </Container> );
}

function genNotify() {
    return null;
// return (
        // <Popover id="popover-basic">
        //     <Popover.Title as="h3">Popover right</Popover.Title>
        //     <Popover.Content>
        //         And here's some <strong>amazing</strong> content. It's very engaging.
        //         right?
        //     </Popover.Content>
        // </Popover>
    // );
}

function generateMainNav(company:any, money:any, setTable:any, setCompanies:any, setHoldingRows:any, setMoney:any, setUserState:any,
                         showNotify:any, setInspectCompany:any, totalValue:any, setTotalValue, inspectCompany, setCompanyPhoto, setDescription, setCompanyUpdates) {
    let total:string = ""
    if(totalValue >= 1000) { // todo change to base setting
        total = "green";
    }else {
        total = "red"
    }
return (        <Navbar className="topBar">
    <Nav className=" nav-fill w-100">
        <NavItem disabled>
            {company}<br/>
            Cash: ${money} <br/>
            Total: <p style ={{color: total}}>${totalValue}</p>
        </NavItem>
        <NavItem>
            <Button style={{background: '#ffffff', color: 'black'}} onClick={() => {
                fetchTable(setTable, setCompanies, setHoldingRows, company, setMoney, setTotalValue);
            }}>Refresh</Button>
        </NavItem>
        <NavItem>
            <Button style={{background: '#ffffff', color: 'black'}} onClick={() => {
                setUserState(4);
            }}>Trade Screen</Button>
        </NavItem>
        <NavItem>
            <Button style={{background: '#ffffff', color: 'black'}} onClick={() => {
                // alert("Coming soon!!!!")
                // setInspectCompany(company);
                setUserState(2);
                companyPage(inspectCompany).then((payload) => {
                    setCompanyPhoto(payload.companyPhoto);
                    setDescription(payload.description);
                    setCompanyUpdates(payload.updates);})

            }}>My Company</Button>
        </NavItem>
        <NavItem>
            <Button style={{background: '#ffffff', color: 'black'}} onClick={() => {
                // alert("Coming soon!!!!")
                setUserState(5);
            }}>Trade History</Button>
        </NavItem>
        <NavItem>
            <Button style={{background: '#ffffff', color: 'black'}} onClick={() => {
                //alert("Coming soon!!!!")
                setUserState(3);
            }}>My Holdings</Button>
        </NavItem>
        <NavItem>
            {/*todo change to greyed out when no notification*/}

            <OverlayTrigger trigger="click" placement="bottom" overlay={generatePop("test")}>
                <img src='/Pixel_Perfact/bell.png' className="bellIcon"></img>
            </OverlayTrigger>
        </NavItem>
    </Nav>
</Navbar>);
}

function generatePop(msg:string) {
    return (<Popover id="popover-basic">
        <Popover.Title as="h3">Notification Tile</Popover.Title>
        <Popover.Content>
            <p>{msg}</p>
        </Popover.Content>
    </Popover>);
}

function loginscreen(setlogin:any,username:any,setusername:any, password:any, setPassword:any,
                     loginMessage:any, setLoginMessage:any, setCompany:any, setTable:any,
                     setCompanies:any, setHoldingRows:any, setMoney:any, setTotalValue:any) {

return (
    <div className="login">
        <p>{loginMessage}</p>
        <Form onSubmit = {(e) => {
            e.preventDefault();
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
        <Button color="danger" type="submit" onClick={() =>
        {
            // console.log("trying logging in: " + username + " Pass: " + password);
            return axios.post(url+"/login", {username: username, password:password}).then((res) => {
                if(res.status === 202) {
                    setLoginMessage("Accepted");
                    // console.log( "axios data: "+res.data.name);
                    setCompany(res.data.name)
                    fetchTable(setTable, setCompanies, setHoldingRows, res.data.name, setMoney, setTotalValue);
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

function fetchTable(setTable:any, setcompanies:any, setHoldingRows:any, company:any, setMoney:any, setTotalValue:any) {
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
        let totalValue:number = 0;
        let money: number = 0;
        let length = rows.data.length;
        for(let i:number = length - 1; i>=0; i--){
            if(i === 0) { // todo optimize this out of loop
                money = rows.data[i].money.toFixed(2);
                // todo
                // totalValue = rows.data[i].total.toFixed(2);
            }
            if(rows.data[i].amount !== 0) {
                totalValue += ((rows.data[i].amount * rows.data[i].value) as number);
                holdings.push(
                    <tr>
                        <td>{rows.data[i].held}</td>
                        <td>{rows.data[i].amount}</td>
                        <td>${(rows.data[i].amount * rows.data[i].value).toFixed(2)}</td>
                    </tr>
                );
            }
        }
        // totalValue += money;
        let x:string = ((parseFloat(String(totalValue))) + (parseFloat(String(money)))).toFixed(2);
        console.log("x is :" + x);
        setHoldingRows(holdings);
        setMoney(money);
        setTotalValue(x);
    })
}

function companyPage(name:string){
    return new Promise<{description, updates, companyPhoto}>((resolve, reject) => {
        return axios.get(url+"/companyPage/" + name).then((res) => {
            resolve(res.data);
        }).catch((e:any) => {
            alert("error" + e)});
            // reject(e);
    });

}

function renderUpdates(updates: any[]) {
    let groups:any[] = [];
    for(let x = 0; x<updates.length; x++ ) {
        console.log(updates[x]);
        groups.push(
            <ListGroupItem>
                {updates[x].toString("utf8")}
            </ListGroupItem>
        );
    }
    // return (<p>rip</p>);
    return (
        <ListGroup className="updates" >
            <ListGroupItem>
                {groups}
            </ListGroupItem>
        </ListGroup>
    );
}


export default App;
