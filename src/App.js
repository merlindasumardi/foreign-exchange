import React, { Component } from 'react';
import axios from 'axios';
import _ from  'lodash';
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 10,
            base: null,
            date: null,
            rates: null,
            showAddForm: false,
            currency: 'USD',
            currencyList: ['USD', 'CAD', 'IDR','GBP','CHF', 'SGD', 'INR', 'MYR', 'JPY', 'KRW'],
            result: [],
            currencyName: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.clickAdd = this.clickAdd.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.submitAdd = this.submitAdd.bind(this);
    }

    componentDidMount(){

        axios.get('https://api.exchangeratesapi.io/latest?base=USD').then(res => {
            console.log(res);
            const { data } = res;
            this.setState({
                base: data.base,
                date: data.date,
                rates: data.rates
            })

            
        });

        axios.get('https://openexchangerates.org/api/currencies.json').then(res => {
            console.log(res);
            const { data } = res;
            this.setState({
                currencyName: data
            })
        })
    }

    handleChange(event){
        this.setState({value: event.target.value});
    }

    clickAdd(){
        this.setState({
            showAddForm: !this.state.showAddForm
        })
    }

    handleAdd(event){
        console.log(event.target.value);
        this.setState({currency: event.target.value});
    }

    submitAdd(event){
        const currency = this.state.currency;

        if (_.isUndefined(currency)) {
            const result = this.state.value;
        }

        const result = {
            currency: this.state.currency,
            value: this.state.rates[currency] ? this.state.rates[currency] : this.state.value,
            name: this.state.currencyName[currency]
        }

        this.state.result.push(result);

        this.setState({
            showAddForm : !this.state.showAddForm
        });
        
        event.preventDefault();
        console.log(this.state.result);

    }

    onRemove(key){
        const result = _.pull(this.state.result, key);
        this.setState ({
            result: result
        })
        console.log(result);
    }

    render() {
        return (
            <div>
                <div className="container">
                <label><i>USD - United States Dollar</i></label>
                <form className="currency-value">
                <label>USD</label>
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                </form>
                </div>

                {this.state.result.map((item, key) => {
                    return (
                        <div>
                            <div className="container">
                            <div className="row">
                                <div className="colomn">
                                    <label className="currency-result-name">{item.currency} - {item.value * this.state.value}</label>
                                    <label className="currency-label">{item.currency} - {item.name}</label>
                                    <label className="currency-label">{this.state.value} USD = {item.currency} {item.value * this.state.value}</label>
                                    </div>
                                <div className="colomn">
                                    <button onClick={this.onRemove.bind(this,item)} className="remove-button"> (-) Remove</button>
                                </div>
                            </div>
                            
                            </div>
                        </div>
                    )
                })}

                <div>
                    {
                        (this.state.showAddForm)?
                        <div className="container">
                        <form className="choose-currency" onSubmit={this.submitAdd}>
                            <select  onChange={this.handleAdd}>
                            <option>-Select Currency-</option>
                                {this.state.currencyList.map((item, key) => {
                                    return (
                                        <option key={key} value={item}>{item}</option>
                                    )
                                })}
                            </select>
                            <input type="submit" value="Submit" />
                        </form>
                        </div>
                        :
                        <button onClick={this.clickAdd} className="add-button">(+) Add more currencies</button>
                    }
                </div>

                
            </div>
        )
    }

    
}

export default App;