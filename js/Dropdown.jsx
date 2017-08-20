import React from 'react';
import PropTypes from 'prop-types';

const Dropdown = props => (
    <div className="selection">
        <div className="selection__title">{props.type}:</div>
        <select
            className="selection__input"
            name={`${props.type.toLowerCase()}-select`}
            onChange={props.setSelected}
            value={props.selected.company}
        >
            {props.companies.map(company => (
                <option key={company.company} value={company.company}>
                    {company[props.type.toLowerCase()]}
                </option>
            ))}
        </select>
    </div>
);

Dropdown.defaultProps = {
    selected: { company: 'Loading Options..', slogan: 'Loading Options..' },
    companies: [{ company: 'Loading Options..', slogan: 'Loading Options..' }]
};

Dropdown.propTypes = {
    type: PropTypes.string.isRequired,
    setSelected: PropTypes.func.isRequired,
    selected: PropTypes.shape({
        company: PropTypes.string,
        slogan: PropTypes.string
    }),
    companies: PropTypes.arrayOf(PropTypes.object)
};

export default Dropdown;
