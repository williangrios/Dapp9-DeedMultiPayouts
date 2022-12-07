import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import { ethers } from "ethers";
import './App.css';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { _toEscapedUtf8String } from "ethers/lib/utils";

function App() {

  const [addressLawyer, setAddressLawyer] = useState('');
  const [addressBeneficiary, setAddressBeneficiary] = useState('');
  const [fromNow, setFromNow] = useState();
  const [datesPayouts, setDatesPayouts] = useState([]);
  //const [intervalPayouts, setIntervalPayouts] = useState();
  const [balance, setBalance] = useState(0);
  const [payouts, setPayouts] = useState(0);
  const [paidPayouts, setPaidPayouts] = useState(0);

  const addressContract = '0x8644d69Fa92a93DD11Dcdc7dB16e76b5d6529424';

  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_lawyer",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "_beneficiary",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "fromNow",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor",
      "payable": true
    },
    {
      "inputs": [],
      "name": "INTERVAL",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "PAYOUTS",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "amount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "beneficiary",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "earliest",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "lawyer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "paidPayouts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
  
  let contractDeployed = null;
  let contractDeployedSigner = null;
  
  function getProvider(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (contractDeployed == null){
      contractDeployed = new ethers.Contract(addressContract, abi, provider)
    }
    if (contractDeployedSigner == null){
      contractDeployedSigner = new ethers.Contract(addressContract, abi, provider.getSigner());
    }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }

  function formatDate(date){
    let dateFormatted = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes();
    return dateFormatted;
  }

  async function getData() {
    getProvider();
    let resp = await contractDeployed.earliest() * 1000;
    let date = new Date(resp);
    setFromNow(formatDate(date));
    setBalance(await contractDeployed.balanceOf());
    setAddressLawyer(await  contractDeployed.lawyer());
    setAddressBeneficiary( await contractDeployed.beneficiary());
    let respPayouts  = await contractDeployed.PAYOUTS();
    setPayouts(respPayouts);
    let intervalPayouts =  (await contractDeployed.INTERVAL()).toString();
    setPaidPayouts(await contractDeployed.paidPayouts());

    setDatesPayouts([]);
    let arrayPayouts = [];
    for (let i = 1; i <= respPayouts; i++) {
      arrayPayouts.push(formatDate (new Date((resp + (i* intervalPayouts)))));
    }
    setDatesPayouts(arrayPayouts)
    toastMessage('Data loaded from blockchain')
  }

  async function handleWithdraw(){
    getProvider();
    try {
      const resp  = await contractDeployedSigner.withdraw(); 
      
    } catch (error) {
      console.log(error)
      toastMessage(error.data.message);
    }
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Deed Multiple Payouts" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
 
        {addressLawyer == '' ?
          <>
            <button onClick={getData}>Load data</button>
          </>
          : 
          <>
          <h2>Deed Multiple Payouts Info</h2>
          <h5>Balance: {(balance).toString()} wei</h5>
          <h5>Lawyer address: {addressLawyer}</h5>
          <h5>Beneficiary address: {addressBeneficiary}</h5>
          <h5>Payouts: {(payouts).toString()}</h5>
          <h5>Paid Payouts: {(paidPayouts).toString()}</h5>
          <h5>Dates to withdraw</h5>
          { 
            datesPayouts.map((item, i) => 
              <p>{item}</p>)
          }
          <hr/>
          <h2>Withdraw Funds</h2>
          <button onClick={handleWithdraw}>Withdraw</button>
        </>
        
        }
        
      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />       
    </div>
  );
}

export default App;
