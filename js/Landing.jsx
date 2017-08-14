import React, { Component } from 'react';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            selected: {}
        };
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    }
    componentDidMount() {
        fetch('http://localhost:3000').then(response => response.json()).then(responseJson => {
            this.setState({ companies: responseJson, selected: responseJson[0] });
        });
        this.recognition.interimResults = true;
        this.recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join('');
            console.log(transcript);
        });
        this.recognition.addEventListener('end', this.recognition.start);
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
    };
    render() {
        return (
            <div className="landing">
                <div className="start">
                    <button onClick={this.start}>
                        Shout Out!
                    </button>
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
            </div>
        );
    }
}

export default Landing;
