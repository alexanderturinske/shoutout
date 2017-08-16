import React, { Component } from 'react';
import Dropdown from './Dropdown';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            selected: {},
            speaking: false,
            score: 0
        };
        this.winner = false;
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    }
    componentDidMount() {
        fetch('http://localhost:3000').then(response => response.json()).then(responseJson => {
            this.setState({ companies: responseJson, selected: responseJson[0] });
        });
        this.recognition.interimResults = true;
        this.addResultListener();
        this.addStartListener();
        this.addEndListener();
    }
    setSelected = event => {
        if (event.target.className === 'selection__random') {
            const selected = this.state.companies[Math.floor(Math.random() * this.state.companies.length)];
            this.setState({ selected });
        } else {
            const [selected] = this.state.companies.filter(ele => ele.company === event.target.value);
            this.setState({ selected });
        }
    };
    addResultListener = () => {
        this.recognition.addEventListener('result', e => {
            this.setState({ score: this.state.score + 1 });
            this.resultDisplay.classList.remove('results--fail', 'results--succeed');
            const transcript = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join('');
            this.resultDisplay.textContent = transcript;
            if (transcript.toLowerCase().replace(/[^a-zA-Z ]/g, '') === this.state.selected.readable) {
                this.winner = true;
                this.resultDisplay.classList.add('results--succeed');
            } else {
                this.winner = false;
                this.resultDisplay.classList.add('results--fail');
            }
        });
    };
    addEndListener = () => {
        this.recognition.addEventListener('end', () => {
            if (this.winner) {
                this.resultStatus.textContent = 'You Win!';
            } else {
                this.setState({ score: 0 });
                this.resultStatus.textContent = 'You Lose!';
            }
            this.setState({ speaking: !this.state.speaking });
        });
    };
    addStartListener = () => {
        this.recognition.addEventListener('start', () => {
            this.setState({ score: 0 });
        });
    };
    start = () => {
        this.recognition.start();
        this.setState({ speaking: !this.state.speaking });
    };
    stop = () => {
        this.recognition.stop();
    };
    render() {
        let action;
        if (this.state.speaking) {
            action = (
                <button onClick={this.stop}>
                    Quiet Down!
                </button>
            );
        } else {
            action = (
                <button onClick={this.start}>
                    Shout Out!
                </button>
            );
        }
        return (
            <div className="landing">
                <div className="start">
                    {action}
                </div>
                <div className="selection">
                    <Dropdown
                        type="Company"
                        companies={this.state.companies}
                        selected={this.state.selected}
                        setSelected={this.setSelected}
                    />
                    <Dropdown
                        type="Slogan"
                        companies={this.state.companies}
                        selected={this.state.selected}
                        setSelected={this.setSelected}
                    />
                    <br />
                    <button className="selection__random" onClick={this.setSelected}>
                        Random
                    </button>
                </div>
                <div className="results">
                    <h4 className="results__title">Results</h4>
                    <div
                        className="results__display"
                        ref={element => {
                            this.resultDisplay = element;
                        }}
                    />
                    <div
                        className="results__status"
                        ref={element => {
                            this.resultStatus = element;
                        }}
                    />
                    <div className="results__score">
                        Score: {this.state.score}
                    </div>
                </div>
            </div>
        );
    }
}

export default Landing;
