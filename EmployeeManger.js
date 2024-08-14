import React from "react";
import axios from "axios";
class EmployeeManager extends React.Component{
    constructor(props)
    {
        super(props)
        this.state={
            Employees:[],
            isUpdated:false,
            isId:'',
            ipName:'',
            ipEmail:'',
            ipDesignation:'',
            statusMsg:''
        }
    }
    componentDidMount(){
        axios.get("http://localhost:3001/ContactDetails").then((res)=>this.setState({Employees:res.data})).catch
        ((err)=>console.log("error"))
    }
    handleChange=(e,keyword)=>{
        if(keyword==="employeename"){
            this.setState({ipName:e.target.value})
        }
        else if(keyword==="employeeemail"){
            this.setState({ipEmail:e.target.value})
        }
        else{
            this.setState({ipDesignation:e.target.value})
        }

    }
    handleDelete=(e,keyId)=>{
        axios.delete(`http://localhost:3001/ContactDetails/${keyId}`).then((res)=>{
                const temp = this.state.Employees
                const UpdatedEmployee =  temp.filter((item)=> item.id!== keyId)
                this.setState({Employees:UpdatedEmployee})
        }).catch((err)=>console.log('error'))
    }
    handleUpdate=(e,keyid)=>{
        this.setState({isUpdated:!(this.state.isUpdated)})
        this.setState({isId:keyid})
    }
    handleSubmit=(e)=>{
        e.preventDefault()
        if(this.state.isUpdated){
            axios.put(`http://localhost:3001/ContactDetails/${this.state.isId}`, {
                ename: this.state.ipName,
                email: this.state.ipEmail,
                Designation:this.state.ipDesignation
               
            }).then((res) => {
                const temp=this.state.Employees;
                const index=temp.findIndex((item)=>item.id===res.data.id)

                temp.splice(index,1,res.data);
                this.setState({ Employees: temp })
            }).catch((err) => this.setState({ statusMsg: "some error occurred please try again" }))
            this.setState({isUpdated:!(this.state.isUpdated)})
        }
        else{
            axios.post("http://localhost:3001/ContactDetails",{
                ename:this.state.ipName,
                email:this.state.ipEmail,
                Designation:this.state.ipDesignation
            }).then((res)=>{
                const temp = [...this.state.Employees,res.data]
                this.setState({Employees:temp})
                this.setState({statusMsg:"created user successfully"})}).catch((err)=>this.setState({statusMsg:"Unable to create user! please try again"}))
                  // axios.get("http://localhost:3001/ContactsDetails").then((res)=>this.setState({contacts:res.data}))
                //   .catch((err)=>console.log("error"))
        }  
    }
    render(){
        return(   
    <>
    <form>
       Employee Name:<input type="text" placeholder="enter the name of the employee" onChange={(e)=>this.handleChange(e,"employeename")}></input>
        Employee Mail:<input type="text" placeholder="Email"onChange={(e)=>this.handleChange(e,"employeeemail")} ></input>
         Designation:<input type="text" placeholder="Designation" onChange={(e)=>this.handleChange(e,"designation")}></input>
         <button onClick={(e)=>this.handleSubmit(e)}>{(this.state.isUpdated)?"Update Employee":"Create Employee"}</button>
    </form>
    <p style={{color:"red"}}>{this.state.statusMsg}</p>
    {
        this.state.Employees.map((item)=>(
            <>
            <h2>Name:{item.ename}</h2>
            <p>Email:{item.email}</p>
            <p>Designation:{item.Designation}</p>
            <button onClick={(e)=>this.handleDelete(e,item.id)}>Delete</button>
            <button onClick={(e)=>this.handleUpdate(e,item.id)}>Update</button>
            <br></br>
            <hr></hr>
            </>
        ))
    }
    </>
        )
    }
}
export default EmployeeManager