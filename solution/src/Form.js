import React, { useState, useEffect } from 'react';
import { isNameValid, getLocations } from './mock-api/apis';
import './Form.css';

const FormComponent = () => {
    // setting the state for the application
    const [name, setName] = useState('');
    const [location, setLocation] = useState('Select Location');
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidName, setIsValidName] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            // retrieve data from api
            setIsLoading(true);
            const locationsData = await getLocations();
            setLocations(['Select a location', ...locationsData]);
            setIsLoading(false);
        } catch (error) {
            // for general error handling, setting the error here
            // for purposes of the mock, no errors truly occur
            // but I believe it is good practice to handle errors
            setError('Error fetching the locations');
        }
    };

    const onChangeName = async(event) => {
        event.preventDefault();
        const newName = event.target.value;
        setName(newName);

        // check for name validity and set the name. 
        // Disable the form while the api call is occurring.
        if (newName.trim() !== '') {
            try {
                setIsLoading(true);
                const nameValidity = await isNameValid(newName);
                setIsValidName(nameValidity);
                setIsLoading(false);
            } catch (error) {
                // for general error handling, setting the error here
                // for purposes of the mock, no errors truly occur
                // but I believe it is good practice to handle errors
                setError('Error validating the provided name');
            }
        }
    };

    // change the location based on the selection from the dropdown
    const onChangeLocation = (event) => {
        event.preventDefault();
        setLocation(event.target.value);
    };

    // when clearing, clear all state
    const onClear = () => {
        setName('');
        setLocation('');
        setIsValidName(true);
        setError(null);
        setTableData([]);
    };

    // check for incorrect input and ideally show an error to the user
    // afterwards set input and show it in the table.
    const onAdd = () => {
        if (name.trim() === '' || location.trim === '' || location === "Select a location") {
            setError('Please enter both a name and a location');
        } else {
            const newTableVal = {
                name: name,
                location: location
            }

            setTableData([...tableData, newTableVal]);
            setName('');
            setLocation('');
            console.log(tableData);
        }
    };

    return (
        <div className="Form">
            <form>
                <div className="name-field">
                    <label className="form-label">Name</label>
                    <div className="input-and-error-box">
                        <input type="text" className="input-box" placeholder='Enter name' value={name} onChange={onChangeName} />
                        {!isValidName ? <div className="name-error-text">this name has already been taken</div> : null}
                    </div>
                </div>
                <div className="location-field">
                    <label className="form-label">Location</label>
                    <select className="input-box" value={location} onChange={onChangeLocation} disabled={isLoading}>
                        {locations.map((location, index) => {
                            return (   
                                <option className="location-dropdown-option" key={index} value={location}>
                                    {location}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </form>
            <div className="form-button">
                <button onClick={onClear} disabled={isLoading}>
                    Clear
                </button>
                <button className="add-button" onClick={onAdd} disabled={isLoading}>
                    Add
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th className="table-header">Name</th>
                        <th className="table-header">Location</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((data, index) => {
                            return (
                                <tr key={index} className="table-row">
                                    <td className="table-cell">{data.name}</td>
                                    <td className="table-cell">{data.location}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default FormComponent;