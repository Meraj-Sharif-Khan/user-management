import httpServices from "../service/httpServices";
import {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment"
import _ from "lodash"

const Users = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState("");
    const [sort, setSort] = useState({path:"lastSeen", order:"asc"});

    const apiEndpont = "api/users"
    const deldeteApiEndpont = "api/users/deleteUsers"
    const blockApiEndpont = "api/users/blockUsers"
    const unblockApiEndpont = "api/users/unblockUsers"
    const logoutApiEndpoint = "api/auth/logout"
    const navigate = useNavigate();
    
    useEffect(()=>{
      const getUsers = async ()=> {
        try {
          const {data:users} = await httpServices.get(apiEndpont)
          const sorted = _.orderBy(users, "lastSeen","desc");
          setUsers(sorted);
          const {name} = JSON.parse(localStorage.getItem("jwt"))
          setCurrentUser(name)
        } catch (error) {
            navigate("/login")
            if(error.response.data.error.userId){
              toast.error("user not found")
            }
        }
    }
    getUsers()
},[navigate])

  const handleSelect = (e) =>{
        const allUsers = [...users]
        const index = allUsers.indexOf(e)
        allUsers[index] = {...users[index]}
        allUsers[index].select = !allUsers[index].select        
       setUsers(allUsers);
  }



  const getSelectedUser = ()=>{
    const allUsers = [...users];
    const selectedUsers = allUsers.filter(e => e.select ? e._id:null);
    const usersId = selectedUsers.map(e=>e._id);
    return usersId
  }

  const handleDelete = async ()=>{
    const allUsers = [...users];
    const avlUsers = allUsers.filter(e=> (e.select!==true));
    
    const usersId = getSelectedUser();
    try {
      if(usersId.length){
        const {data} = await httpServices.delete(deldeteApiEndpont, {data:{usersId}});
        setUsers(avlUsers);
        toast.success(data.deletedCount+" "+ data.message);
      }
    } catch (error) {
      setUsers(allUsers);
      const status = error.response.status;
      const message = error.response.data.error;
      if(status === 401 || status === 404){
        navigate("/login");
        toast.error(message);
      }
    }
}

const handleSort = (path)=>{
  const sorted =  _.orderBy(users, [path], [sort.order]);
  setUsers(sorted);
  const order = sort.order === "asc" ? "desc":"asc";
  setSort({path,order});
}


const handleBlock = async () =>{
   const allUsers = [...users]
   const block = allUsers.map(e=>{
    if(e.select){
      return {...e, blocked:true}
    }
    return e
   })
   setUsers(block);
   const usersId = getSelectedUser();

   try {
    if(usersId.length){
      const {data} = await httpServices.put(blockApiEndpont, {usersId});
      data.updatedCount > 0 ? toast.success(data.updatedCount+" "+ data.message):"";
    }
  } catch (error) {
    setUsers(allUsers);
    const status = error.response.status;
    const message = error.response.data.error;
    if(status === 401 || status === 404){
      navigate("/login");
      toast.error(message);
    }
  }

}

const handleUnBlock = async ()=>{
    const allUsers = [...users]
   const UnBlock = allUsers.map(e=>{
    if(e.select && e.blocked){
      return {...e, blocked:false}
    }
    return e
   })
   setUsers(UnBlock);
   const usersId = getSelectedUser();
   try {
    if(usersId.length){
      const {data} = await httpServices.put(unblockApiEndpont, {usersId});
      data.updatedCount > 0 ? toast.success(data.updatedCount+" "+ data.message):"";
    }
  } catch (error) {
    setUsers(allUsers);
    const status = error.response.status;
    const message = error.response.data.error;
    if(status === 401 || status === 404){
      navigate("/login");
      toast.error(message);
    }
  }
  }

const handleLogout = async ()=>{
  try {
    await httpServices.post(logoutApiEndpoint);
    localStorage.removeItem("jwt");
    navigate("/login")
  } catch (error) {
    toast.error(error.response.data.error)
  }
}



return (<>    
    
    <div className="container mt-2">

        <button className="btn btn-sm btn-outline-dark" title="Logout" onClick={()=>handleLogout()}>
          <i className="fa fa-sign-out" aria-hidden="true"></i>
        </button>
      
      <span className="ms-2 me-2">Welcome {currentUser}</span>
      
      <button className="btn btn-sm btn-outline-primary" onClick={()=> handleBlock()}>
        <i className="fa fa-lock me-2" aria-hidden="true"></i>Block
      </button>
      
      <button className="btn btn-sm btn-outline-primary ms-2 me-2" title="Unblock" onClick={()=> handleUnBlock()}>
        <i className="fa fa-unlock" aria-hidden="true"></i>
      </button>
      
      <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={()=> handleDelete()}>
        <i className="fa fa-trash" aria-hidden="true"></i>
      </button>
    
    </div>

    <table className="container table">
      <thead>
        <tr>
          <th scope="col">Select</th>
          <th scope="col" style={{ cursor: "pointer" }} onClick={()=>handleSort("name")}>
            Name
            {sort.path==="name" && (sort.order==="asc"?<i className="fa fa-sort-desc"></i>:<i className="fa fa-sort-asc"></i>)}
          </th>
          <th scope="col" style={{ cursor: "pointer" }} onClick={()=>handleSort("email")}>
            Email
            {sort.path==="email" && (sort.order==="asc"?<i className="fa fa-sort-desc"></i>:<i className="fa fa-sort-asc"></i>)}
          </th>
          <th scope="col" style={{ cursor: "pointer" }} onClick={()=>handleSort("lastSeen")}>
            Last Seen
            {sort.path==="lastSeen" && (sort.order==="asc"?<i className="fa fa-sort-asc"></i>:<i className="fa fa-sort-desc"></i>)}
          </th>
        </tr>
      </thead>
      <tbody>
      {users.map(user=>(
        <tr key={user._id} className={user.blocked? "text-decoration-line-through":""}>
            <td><input className="form-check-input" type="checkbox" onClick={()=>handleSelect(user)}></input></td>
            <td className={user.blocked? "text-secondary":""}>{user.name}</td>
            <td className={user.blocked? "text-secondary":""}>{user.email}</td>
            <td className={user.blocked? "text-secondary":""} title={moment(user.lastSeen).format('MMMM Do YYYY, h:mm:ss a')} role="button">{moment(user.lastSeen).fromNow()}</td>
      </tr>
      ))}
      </tbody>
    </table>

    </> );
}
 
export default Users;
