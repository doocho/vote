import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingContract from './contracts/Voting.json';
import contractAddress from './contracts/contract-address.json';
import CreatePoll from './components/CreatePoll';
import PollsList from './components/PollsList';
import PollDetails from './components/PollDetails';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  useEffect(() => {
    initializeProvider();
  }, []);

  useEffect(() => {
    if (contract && account) {
      loadPolls();
    }
  }, [contract, account]);

  const initializeProvider = async () => {
    console.log('Initializing provider...');

    if (typeof window.ethereum !== 'undefined') {
      try {
        // Try to switch to Anvil network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7a69' }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x7a69',
                  chainName: 'Anvil Local',
                  rpcUrls: ['http://127.0.0.1:8545'],
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                },
              ],
            });
          }
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setAccount(address);

        const contract = new ethers.Contract(
          contractAddress.Voting,
          VotingContract.abi,
          signer
        );
        setContract(contract);

        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert('Error connecting to MetaMask: ' + error.message);
      }
    } else {
      alert('Please install MetaMask to use this dApp');
    }
  };

  const loadPolls = async () => {
    try {
      console.log('Loading polls...');
      const pollsData = await contract.getAllPolls();

      const pollsArray = [];
      for (let i = 0; i < pollsData[0].length; i++) {
        pollsArray.push({
          id: Number(pollsData[0][i]),
          title: pollsData[1][i],
          creator: pollsData[2][i],
          createdAt: Number(pollsData[3][i]),
          active: pollsData[4][i]
        });
      }

      console.log('Polls loaded:', pollsArray);
      setPolls(pollsArray);
    } catch (error) {
      console.error('Error loading polls:', error);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setPolls([]);
    setSelectedPollId(null);
    setShowCreatePoll(false);
  };

  const handlePollCreated = () => {
    setShowCreatePoll(false);
    loadPolls();
  };

  const handleSelectPoll = (pollId) => {
    setSelectedPollId(pollId);
    setShowCreatePoll(false);
  };

  const handleBackToList = () => {
    setSelectedPollId(null);
    loadPolls();
  };

  if (!account) {
    return (
      <div className="app">
        <div className="container">
          <h1>Voting DApp</h1>
          <div className="connect-wallet">
            <p>Connect your wallet to create and participate in polls</p>
            <button onClick={initializeProvider}>Connect Wallet</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>Voting DApp</h1>
          <div className="wallet-info">
            <div>
              <p>Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
            </div>
            <button onClick={disconnectWallet} style={{ marginLeft: '15px' }}>
              Disconnect
            </button>
          </div>
        </header>

        {!selectedPollId && !showCreatePoll && (
          <>
            <div className="actions-bar">
              <button onClick={() => setShowCreatePoll(true)} className="create-poll-btn">
                + Create New Poll
              </button>
            </div>
            <PollsList
              polls={polls}
              onSelectPoll={handleSelectPoll}
              account={account}
            />
          </>
        )}

        {showCreatePoll && (
          <CreatePoll
            contract={contract}
            onUpdate={handlePollCreated}
          />
        )}

        {selectedPollId && (
          <PollDetails
            contract={contract}
            pollId={selectedPollId}
            account={account}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
}

export default App;
