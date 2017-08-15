import React, { Component } from 'react';

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
        this.recognition.addEventListener('result', e => {
            this.setState({ score: this.state.score + 1 });
            this.display.classList.remove('results--fail', 'results--succeed');
            const transcript = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join('');
            this.display.textContent = transcript;
            if (transcript.toLowerCase().replace(/[^a-zA-Z ]/g, '') === this.state.selected.readable) {
                this.winner = true;
                this.display.classList.add('results--succeed');
            } else {
                this.winner = false;
                this.display.classList.add('results--fail');
            }
        });
        this.recognition.addEventListener('end', () => {
            if (this.winner) {
                console.log('w', this.state.score);
            } else {
                this.setState({ score: 0 });
                console.log('l', this.state.score);
            }
            this.setState({ speaking: !this.state.speaking });
        });
        this.recognition.addEventListener('start', () => {
            this.setState({ score: 0 });
        });
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
    start = () => {
        this.recognition.start();
        this.setState({ speaking: !this.state.speaking });
    };
    stop = () => {
        this.recognition.stop();
    };
    render() {
        return (
            <div className="landing">
                <div className="start">
                    {this.state.speaking
                        ? <button onClick={this.stop}>
                              Quiet Down!
                          </button>
                        : <button onClick={this.start}>
                              Shout Out!
                          </button>}
                </div>
                <div className="selection">
                    <div className="selection__title">Company:</div>
                    <select
                        className="selection__input"
                        name="company-select"
                        onChange={this.setSelected}
                        value={this.state.selected.company}
                    >
                        {this.state.companies.map(company => (
                            <option key={company.company} value={company.company}>
                                {company.company}
                            </option>
                        ))}
                    </select>
                    <div className="selection__title">Slogan</div>
                    <select
                        className="selection__input"
                        name="slogan-select"
                        onChange={this.setSelected}
                        value={this.state.selected.company}
                    >
                        {this.state.companies.map(company => (
                            <option key={company.company} value={company.company}>{company.slogan}</option>
                        ))}
                    </select>
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
                            this.display = element;
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
