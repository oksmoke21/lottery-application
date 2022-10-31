import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import './App.css';
import web3 from '../src/utils/web3';
import lottery from '../src/utils/lottery';
import { contractAddress } from '../src/utils/contractConfig';

class App extends React.Component {
    state = {
        manager: '',
        playersNo: '',
        nWinners: '',
        value: '',
        message: '',
        isMetaMaskPluginAvailable: false,
        isTransactionIsRunning: false,
        startWarning: false,
        errorMessage: ''
    };

    async componentDidMount() {
        const isMetaMaskPluginAvailable = web3 && lottery;
        this.setState({ isMetaMaskPluginAvailable });
        this.updateContractInfo();
    }

    async updateContractInfo() {
        fetch('http://localhost:5000/contract-info')
            .then(res => res.json())
            .then(({ manager, playersNo }) => {
                this.setState({ manager, playersNo });
            })
            .catch(console.log);
    }

    onSubmit = async event => {
        event.preventDefault();
        this.setState({
            errorMessage: ''
        });
        const { isMetaMaskPluginAvailable, value } = this.state;
        if (!isMetaMaskPluginAvailable) {
            return this.metaMaskNotAvailable();
        }
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        this.setState({
            message: 'Transaction is processing. This might take 12 to 30 seconds.',
            isTransactionIsRunning: true
        });
        try {
            await lottery.methods.enterLottery().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            this.updateContractInfo();
            this.setState({
                message: 'You entered the lottery',
                value: ''
            });
        } catch (err) {
            if (value == '') {
                err.message = "Value cannot be empty"
            }
            this.setState({
                errorMessage: err.message
            });
        }
        this.setState({ isTransactionIsRunning: false });
    };

    onClickSelectNoOfWinners = async event => {
        event.preventDefault();
        this.setState({
            errorMessage: ''
        });
        const { isMetaMaskPluginAvailable, nWinners, message } = this.state;
        if (!isMetaMaskPluginAvailable) {
            return this.metaMaskNotAvailable();
        }
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        this.setState({
            message: 'Transaction is processing. This might take 12 to 30 seconds.',
            isTransactionIsRunning: true
        });
        console.log(message)

        try {
            await lottery.methods.setNoOfWinners(nWinners).send({
                from: accounts[0],
            });
            this.updateContractInfo();
            this.setState({
                message: 'No of winners set',
                nWinners: ''
            });
        } catch (err) {
            if (nWinners == '') {
                err.message = "Value cannot be empty"
            }
            this.setState({
                errorMessage: err.message
            });
        }

        this.setState({
            message: `${nWinners} winners chosen`
        });

        this.setState({ isTransactionIsRunning: false });
    };


    onClickPickWinner = async event => {
        event.preventDefault();
        const { isMetaMaskPluginAvailable, isTransactionIsRunning } = this.state;
        if (!isMetaMaskPluginAvailable) {
            return this.metaMaskNotAvailable();
        }
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        this.setState({
            message: 'Transaction is processing. This might take 9 to 15 seconds.',
            isTransactionIsRunning: true
        });
        console.log(isTransactionIsRunning);

        try {
            await lottery.methods.chooseWinner().send({
                from: accounts[0]
            });
        } catch (err) { console.log(err) }

        this.setState({
            message: 'Winner picked'
        });

        this.setState({ isTransactionIsRunning: false });
        updateContractInfo();
    };

    metaMaskNotAvailable = () => {
        this.setState({
            startWarning: true
        });
    };

    mainWindow() {
        const {
            isMetaMaskPluginAvailable,
            startWarning,
            errorMessage
        } = this.state;
        return (
            <div className='container-contact100'>
                <div className='wrap-contact100'>
                    <form
                        onSubmit={this.onSubmit}
                        className='contact100-form validate-form'
                    >
                        <span className='contact100-form-title'>Try Your Luck</span>
                        {!isMetaMaskPluginAvailable && !startWarning && (
                            <div className='metamask-not-found'>Metamask Not Found</div>
                        )}
                        {!isMetaMaskPluginAvailable && startWarning && (
                            <div className='metamask-not-found warning'>
                                Metamask Not Found
                            </div>
                        )}
                        {errorMessage && (
                            <div className='metamask-not-found error-message'>
                                {errorMessage}
                            </div>
                        )}
                        {this.inputForm()}
                        {this.announcements()}
                    </form>
                    {this.rules()}
                </div>
            </div>
        );
    }

    announcements() {
        const { manager, playersNo } = this.state;
        return (
            <div className='announcement-container'>
                <div className='announcement-title'>
                    Announcements
                </div>
                <div className='announcement-section'>
                    <span className='lnr lnr-bullhorn announcement-icon'></span>
                    <div className='announcement-status'>
                        <span className='marked-number'>0.05</span> ETH is
                        required to enter the lottery pool
                    </div>
                </div>
                <div className='announcement-section'>
                    <span className='lnr lnr-bullhorn announcement-icon'></span>
                    <div className='announcement-status'>
                        The contract is managed by{' '}
                        <span>{manager}</span>
                    </div>
                </div>
                <div className='announcement-section'>
                    <span className='lnr lnr-bullhorn announcement-icon'></span>
                    <div className='announcement-status'>
                        Total <span className='marked-number'>{playersNo}</span>{' '} players in current lottery pool
                    </div>
                </div>

                <div className='manager-section'>
                    <div className='manager-warning'>(Only For Contract Manager)</div>
                    <button onClick={this.onClickSelectNoOfWinners} className='custom-button'>
                        Choose no of winners
                    </button>
                    <div className='wrap-input100 validate-input'>
                        {this.inputNoOfWinners()}
                    </div>
                    <button onClick={this.onClickPickWinner} className='custom-button'>
                        Pick Winner
                    </button>
                </div>

            </div>
        );
    }

    rules() {
        return (
            <div className='contact100-more flex-col-c-m'>
                <div className='flex-w size1 p-b-47'>
                    <div className='txt1 p-r-25'>
                        <span className='lnr lnr-book'></span>
                    </div>

                    <div className='flex-col size2'>
                        <span className='txt1 p-b-20'>Decentralized Lottery App</span>

                        <span className='txt2'>
                            This application serves a lottery powered by smart contracts running
                            on blockchain technology. The contract has a prize pool and a list of people who
                            have entered the prize pool. You can send money (as ethers) to the contract.
                            As soon as people transfer the funds, they are recorded as a participant in that lottery pool.
                            These funds don't go to a particular person but rather the smart contract itself.
                            The contract manager (the person responsible for creating the smart contract) decides how many
                            participants will win the lottery, and the prize pool is equally distributed among the winners.
                            When the manager calls the button to pick a winner, the contract randomly picks
                            the winners, and transfers their reward money from the prize pool to their accounts.
                            At that point, the lottery contract resets to a new pool, and is now ready to accept a new list of
                            participants.
                        </span>

                        <div className='contract-info-container'>
                            <div>Contract Address: {contractAddress}</div>
                            <div>
                                Monitor Contract Transaction in{' '}
                                <a
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='remote-link'
                                    href={`https://goerli.etherscan.io/address/${contractAddress}`}
                                >
                                    EtherScan
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    inputNoOfWinners() {
        const { nWinners } = this.state;
        return (
            <div>
                <div>
                    <input
                        id='nWinners'
                        type='text'
                        name='nWinners'
                        placeholder='No of winners'
                        value={this.state.nWinners}
                        onChange={event => this.setState({ nWinners: event.target.value })}
                    />
                </div>
            </div>
        );
    }

    inputForm() {
        return (
            <div>
                <div className='wrap-input100 validate-input'>
                    <input
                        id='email'
                        className='input100'
                        type='text'
                        name='email'
                        placeholder='Example: 0.05'
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                    />
                    <span className='focus-input100'></span>
                </div>
                <div className='container-contact100-form-btn'>
                    <button className='contact100-form-btn'>Join</button>
                </div>
                <span className='network-warning'>
                    This app is running on Goerli test network and deals with fake
                    ETH.
                </span>
            </div>
        );
    }

    render() {
        return (
            <LoadingOverlay>
                {this.mainWindow()}
            </LoadingOverlay>
        );
    }
}

export default App;
