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
        if (event.target.className === 'selection-random') {
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
                console.log('yis');
            } else {
                this.setState({ score: 0 });
            }
            this.startButton.classList.remove('start--begin', 'start--finish');
            this.setState({ speaking: !this.state.speaking });
            this.startButton.classList.add('start--begin');
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
        this.startButton.classList.add('start--finish');
    };
    stop = () => {
        this.recognition.stop();
    };
    render() {
        return (
            <div className="landing">
                <div className="header">
                    <h1>Speak Up!</h1>
                </div>
                <div className="start">
                    <button className="start__button" onClick={this.start}>
                        <img
                            className="start__image start--begin"
                            src="./public/microphone.png"
                            alt="microphone"
                            ref={element => {
                                this.startButton = element;
                            }}
                        />
                    </button>
                </div>
                <div className="selection-menu">
                    <div className="selection-menu__predefined">
                        <Dropdown
                            type="Slogan"
                            companies={this.state.companies}
                            selected={this.state.selected}
                            setSelected={this.setSelected}
                        />
                    </div>
                    <div className="selection-menu__random">
                        <button className="selection-random" onClick={this.setSelected}>
                            Random
                        </button>
                    </div>
                </div>
                <div className="results">
                    <h1 className="results__title">Results</h1>
                    <div
                        className="results__display"
                        ref={element => {
                            this.resultDisplay = element;
                        }}
                    />
                    <div className="results__score">
                        Score: {this.state.score}
                    </div>
                    <div
                        className="results__status"
                        ref={element => {
                            this.resultStatus = element;
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default Landing;
