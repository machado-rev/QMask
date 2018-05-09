import React from 'react';
import ReactDOM from 'react-dom';
import { networks, generateMnemonic } from "qtumjs-wallet"

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Mnemonic: generateMnemonic(),
      optPassword: '',
      publicKey: '',
      privateKey: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeMnem = this.handleChangeMnem.bind(this);
    this.handleGenWallet = this.handleGenWallet.bind(this);
  }

  handleChange(event) {
    this.setState({optPassword: event.target.value});
  }

  handleSubmit(event) {
    alert('new password: ' + this.state.optPassword);
    event.preventDefault();
  }

  handleChangeMnem(event) {
    this.setState({Mnemonic: ''});
  }

  handleGenWallet(event) {
    const network = networks.testnet;
    const wallet = network.fromMnemonic(this.state.Mnemonic, this.state.optPassword);
    this.setState({publicKey: wallet.address});
    this.setState({privateKey: wallet.toWIF()});
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div>
          <h1>
            QTUM Wallet Creator:
          </h1>
          <div style={{margin:"10px"}}>
            <b>Mnemonic Phrase: </b>
          </div>
          {this.state.Mnemonic}
          <div>
            <form onSubmit={this.handleChangeMnem}>  
                <div>
                  <button type="submit" value="Submit"
style={{backgroundColor: "#38ACEC", fontFamily: "Helvetica Neue", border:"0", height:"40px", width:"200px",margin:"10px"}}><b>Change Mnemonic Phrase</b></button> 
                </div>
            </form>
          </div>
        </div>
        <div>
          <form onSubmit={this.handleGenWallet}>  
              <label>
                <input type="password" placeholder = "Optional Password" style={{ fontFamily: "Helvetica Neue", border:"0", height:"40px", width:"200px",textAlign:"center"}} value={this.state.value} onChange={this.handleChange} />
              </label>
              <div>
                <button type="submit" value="Submit" style={{backgroundColor: "#38ACEC", fontFamily: "Helvetica Neue", border:"0", height:"40px", width:"200px",margin:"10px"}}><b>Generate Wallet</b></button> 
              </div>
          </form>
        </div>
        <div style={{margin:"10px"}}>
          <label>
            pubKey: {this.state.publicKey}
          </label>
        </div>
        <div style={{margin:"10px"}}>
          <label>
            priKey: {this.state.privateKey}
          </label>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <NameForm />,
  document.getElementById('root')
);

async function main() {
  const network = networks.testnet
  const mnemonic = generateMnemonic()
  const password = "covfefe"

  const wallet = network.fromMnemonic(mnemonic, password)

  console.log("mnemonic:", mnemonic)
  console.log("public address:", wallet.address)
  console.log("private key (WIF):", wallet.toWIF())
}

main().catch((err) => console.log(err))