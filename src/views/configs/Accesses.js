import { Button, Card } from '@material-ui/core';
import { Facebook } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

const Accesses = (props) => {
    const [alert, setAlert] = React.useState(null)
    const [errorMessage, setErrorMessage] = React.useState(null)

    React.useEffect(() => {
        console.log(window.FB.getLoginStatus(function(response) {
            console.log("status login", response);
        }))
    }, [])

    const facebookLogin = () => {
        window.FB.login(function(response){
            // handle the response 
            console.log(response)
        }, {scope: "public_profile,email,instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement"});
    }

    return <div>
        {
            alert &&  ((alert === 1)
            ? <Alert severity="success">Sucesso!</Alert>
            : <Alert severity="error">{errorMessage || "error"}</Alert>
            ) 
        }

        <Button color="primary" onClick={facebookLogin} variant="contained" startIcon={<Facebook />}>Autenticar no Facebook</Button>
    </div>
}

export default Accesses