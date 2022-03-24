import './App.css';
import React, { Component } from 'react'
import web3 from './web3';
import lottery from './lottery';
class App extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state = { manager : ' '};
  // }

  state = {
    manager : '',
    players : [],
    balance : '',
    value : '',
    message: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager  , players , balance });
  };

  onSubmit = async(event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message : 'Please wait...'});

    await lottery.methods.enter().send({
      from:accounts[0],
      value : web3.utils.toWei(this.state.value , 'ether')
    });

    this.setState({message : 'You have successfully entered!'});
  };

  pickWinner = async (event) => {
    event.preventDefault();
    console.log('picking winner');

    const accounts = await web3.eth.getAccounts();

    this.setState({message : 'Picking a winner, Please wait '})

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({message : 'Winner is picked'});
  }

  render(){
    console.log(lottery);
    return (
      <div>
        <h1>Contract</h1>
        <p>
          contract is deployed from address {this.state.manager}.
          There are {this.state.players} players competing to a prize of amount 
          {web3.utils.fromWei(this.state.balance , 'ether')} ether
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Enter the amount</label>
            <input 
              value = {this.state.value}
              onChange={event => this.setState({value : event.target.value})} 
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h2>Pick Winner</h2>
        <button onClick={
          this.pickWinner
        }>Pick</button>
        <hr />
        <h2>Status</h2>
        <h2>{this.state.message}</h2>
      </div>
    );
  }
  
}

export default App;
