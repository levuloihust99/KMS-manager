import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';

export const displayError = (error) => {
    console.log(error)
    alert(`Error: ${error.reason}`, { position: 'top-right', timeout: 1 * 1000 })
};
