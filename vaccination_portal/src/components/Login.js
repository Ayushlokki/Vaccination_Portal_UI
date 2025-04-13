import { Alert } from 'bootstrap'
import React, { useState  } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ()=>{

  const [userName,setUserName] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  const handleUserName = (e)=>{

  setUserName(e.target.value)

  }
  const handlePassword= (e)=>{

  setPassword(e.target.value)

  }

  const handleSubmit= ()=>{
    console.log("okok",userName,password)
    if (userName === "Ayush" && password ==="Ayush123"){
      navigate("/dashboard")
    }else
    alert("Invalid Credentials")
  }
    return(
        <div className="container mt-5">
        <div className="row justify-content-center">
          {/* <div className="col-md-6"> */}

              <div className="mb-3" style={{display:"flex",gap:"16px", alignItems:'center'}}>
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={userName}
                  placeholder="Enter User Name"
                  onChange={(e)=>handleUserName(e)}
                />
              </div>
      
              <div className="mb-3" style={{display:"flex",gap:"16px", alignItems:'center'}}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  placeholder="Enter Password"
                  onChange={(e)=>handlePassword(e)}
                />
              </div>
      
              <button className="btn btn-primary" type="submit"  onClick={handleSubmit}>
                Submit
              </button>

          {/* </div> */}
        </div>
      </div>
      

    )

}
export default Login