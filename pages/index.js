import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import WavePortal from "../src/artifacts/contracts/WavePortal.sol/WavePortal.json";
import Token from "../src/artifacts/contracts/AIMToken.sol/AIMToken.json";
import { useEffect, useState } from "react";

const waveAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const deployerPrivateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const [data, setData] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [txs, setTxs] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      // First make sure we have access to window.ethereum
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask");
        return;
      } else {
        console.log("we have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("get wallet");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const changeWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("get wallet");
        return;
      }

      setCurrentAccount("");
      await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGreeting = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          waveAddress,
          WavePortal.abi,
          provider
        );

        const data = await contract.greet();
        setData(data);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const sendMessage = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(
          waveAddress,
          WavePortal.abi,
          signer
        );
        const tx = await contract.message(
          greeting ? greeting : "Hi marvellous"
        );
        const done = await tx.wait();
        if (done) {
          setGreeting("");
        }
        fetchGreeting();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          waveAddress,
          WavePortal.abi,
          provider
        );

        const waves = await contract.getAllWaves();
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const getBalance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
        const balance = await contract.balanceOf(currentAccount);
        console.log("Balance: ", ethers.utils.formatEther(balance));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendToken = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wallet = new ethers.Wallet(deployerPrivateKey, provider);
        const balance = await wallet.getBalance();
        console.log("balance", ethers.utils.formatEther(balance));
        const contract = new ethers.Contract(tokenAddress, Token.abi, wallet);
        console.log(contract);
        const tx = await contract.transfer(currentAccount, 1000000);
        const done = await tx.wait();
        if (done) {
          console.log(done);
        }
        // console.log(`${amount} coins successfully sent to ${userAccount}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onNewWave = (from, message, timestamp) => {
    setAllWaves((prev) => [
      ...prev,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  const onNewTx = (sender, recipient, amount) => {
    setTxs((prev) => [
      ...prev,
      {
        from: sender,
        to: recipient,
        amount,
      },
    ]);
  };

  const handleChange = (e) => {
    setGreeting(e.target.value);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllWaves();
  }, []);

  useEffect(() => {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(waveAddress, WavePortal.abi, signer);

      contract.on("NewWave", onNewWave);
    }

    return () => {
      if (contract) {
        contract.off("NewWave", onNewWave);
      }
    };
  }, []);

  useEffect(() => {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);

      contract.on("Transfer", onNewTx);
    }

    return () => {
      if (contract) {
        contract.off("Transfer", onNewTx);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Wave Portal</title>
        <meta name="description" content="web3, dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>🖐🏾 Welcome to Wave Portal</h1>
        <h2>Say Hi or send a mesaage or both to for a surprise 😉</h2>

        {!currentAccount ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <button onClick={connectWallet}>change wallet</button>
        )}
        <h3>{data}</h3>

        <button onClick={sendMessage}>Say hi</button>

        <input type="text" value={greeting} onChange={handleChange}></input>
        <button onClick={sendMessage}>Send message</button>

        <div>
          <button onClick={getBalance}>Get balance</button>
          <button onClick={sendToken}>Send coins</button>
        </div>

        {allWaves.map((wave, index) => {
          return (
            <div key={index}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
