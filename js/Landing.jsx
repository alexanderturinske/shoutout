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
        const [selected] = this.state.companies.filter(ele => ele.company === event.target.value);
        this.setState({ selected });
    };
    buttonClick = () => {
        this.recognition.start();
    };
    render() {
        return (
            <div className="landing">
                <h1>Shout Out!</h1>
                <div>Choose a company or slogan!</div>
                <div>Company:</div>
                <select name="company-select" onChange={this.setSelected} value={this.state.selected.company}>
                    {this.state.companies.map(company => (
                        <option key={company.company} value={company.company}>
                            {company.company}
                        </option>
                    ))}
                </select>
                <div>Slogan</div>
                <select name="slogan-select" onChange={this.setSelected} value={this.state.selected.company}>
                    {this.state.companies.map(company => (
                        <option key={company.company} value={company.company}>{company.slogan}</option>
                    ))}
                </select>
                <div>
                    <button onClick={this.buttonClick}>
                        Shout Out!
                    </button>
                </div>
            </div>
        );
    }
}

export default Landing;
