import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import httpServices from "../service/httpServices";

const Signup = () => {
const [userData, setUserDate] = useState({
    name:"",
    email:"",
    password:"",
})

const[error, setError] = useState()
const apiEndpont = "/api/auth/signup"
const navigate = useNavigate()



    async function handleSubmit(e){
        e.preventDefault()
        
        try {
             const {data} = await httpServices.post(apiEndpont, userData);
               localStorage.setItem("jwt", JSON.stringify(data));
               navigate("/", {replace:"true"});
            } catch (error) {
                setError(error.response.data.error);
        }
    }


    return ( 
        <>        
        <div className="login-group">
            <section className="login-container">
                <Link to="/">
                    <img className="login-container--brand" src="brandTheApp.PNG" alt="" />
                </Link>
                <section className="login-form m-3">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="text-body-secondary form-label">Start your journey</label>
                            <h3> Sign Up to the App </h3>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" required className="form-control" id="name" aria-describedby="emailHelp" autoComplete="name"
                           value={userData.name} onChange={e=> setUserDate({...userData, name:e.target.value})}/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" required className="form-control" id="email" aria-describedby="emailHelp" autoComplete="email"
                            value={userData.email} onChange={e => setUserDate({...userData, email:e.target.value})}/>
                            {error && (<div className="alert alert-danger p-1"><span>{error}</span></div>)}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" required className="form-control" id="password" autoComplete="new-password"
                            value={userData.password} onChange={e => setUserDate({...userData, password:e.target.value})}/>
                        </div>
                       
                        <button type="submit" className="btn btn-primary col-12">Sign Up</button>
                    </form>

                <section className="help-links mt-3">
                    <div className="help-links--sign-up">
                        <p>Already have an account?</p>
                        <Link to="/login">Sign In</Link>
                    </div>
                 
                </section>
                </section>



             </section>
            <section className="login-background"></section>
        </div>
     </>

     );
}
 
export default Signup;