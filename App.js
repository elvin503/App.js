import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const API_URL = 'http://localhost:5000/students';

function App() {
  // States
  const [formData, setFormData] = useState({
    id: '', 
    title: '', 
    name: '', 
    suffix: '', 
    sex: '', 
    birthday: '', 
    age: '', 
    postalCode: '', 
    citizenship: '', 
    civilStatus: '', 
    course: '', 
    address: ''
  });
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state
  const [userRole, setUserRole] = useState(''); // User role (admin or client)
  const [searchTerm, setSearchTerm] = useState('');
  const [loginData, setLoginData] = useState({ username: '', password: '' }); // Login form state

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStudents();
    }
  }, [isLoggedIn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      toast.success('Resident added successfully!');
      fetchStudents();
      setFormData({
        id: '', 
        title: '', 
        name: '', 
        suffix: '', 
        sex: '', 
        birthday: '', 
        age: '', 
        postalCode: '', 
        citizenship: '', 
        civilStatus: '', 
        course: '', 
        address: ''
      });
    } catch (error) {
      toast.error('Error adding Resident!');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${formData.id}`, formData);
      toast.success('Resident updated successfully!');
      fetchStudents();
      setFormData({
        id: '', 
        title: '', 
        name: '', 
        suffix: '', 
        sex: '', 
        birthday: '', 
        age: '', 
        postalCode: '', 
        citizenship: '', 
        civilStatus: '', 
        course: '', 
        address: ''
      });
      setIsEditing(false);
    } catch (error) {
      toast.error('Error updating Resident!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Resident deleted!');
      fetchStudents();
    } catch (error) {
      toast.error('Error deleting Resident!');
    }
  };

  const handleEdit = (student) => {
    setFormData(student);
    setIsEditing(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Login form submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin') {
      setIsLoggedIn(true);
      setUserRole('admin');
      toast.success('Logged in as admin!');
    } else if (loginData.username === 'resident' && loginData.password === 'resident') {
      setIsLoggedIn(true);
      setUserRole('resident');
      toast.success('Logged in as resident!');
    } else {
      toast.error('Invalid username or password!');
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    toast.success('Logged out successfully!');
  };

  // Conditional rendering for login or student CRUD functionality
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        {/* ✅ Add the animated square here */}
        <div className="animated-square"></div>
  
        <div>
          <h1>Login</h1>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginData.username}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    
    <div className="container" style={{ textAlign: 'center' }} width="80%">
      
      <div className="animated-square"></div>
      <h1>Brgy Dona Josefa Residence Record</h1>

      {/* Student CRUD Form */}
      {userRole === 'admin' && (
        <form onSubmit={isEditing ? handleEditSubmit : handleAddSubmit}>
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={isEditing}
            autoComplete="off"
          />
          <select name="title" value={formData.title} onChange={handleChange} required autoComplete="honorific-prefix">
            <option value="">Select Title</option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Ms.">Ms.</option>
          </select>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
          <select name="suffix" value={formData.suffix} onChange={handleChange} autoComplete="honorific-suffix">
            <option value="">Select Suffix</option>
            <option value="None">None</option>
            <option value="Jr.">Jr.</option>
            <option value="Sr.">Sr.</option>
            <option value="III">III</option>
          </select>
          <select name="sex" value={formData.sex} onChange={handleChange} required autoComplete="sex">
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="BiSexual">BiSexual</option>
          </select>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
            autoComplete="bday"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            required
            autoComplete="postal-code"
          />
          <input
            type="text"
            name="citizenship"
            placeholder="Citizenship"
            value={formData.citizenship}
            onChange={handleChange}
            required
            autoComplete="country"
          />
          <select name="civilStatus" value={formData.civilStatus} onChange={handleChange} required autoComplete="civil-status">
            <option value="">Civil Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Complicated">Complicated</option>
            <option value="Separated">Separated</option>
          </select>
          <input
            type="text"
            name="course"
            placeholder="Occupation"
            value={formData.course}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            autoComplete="street-address"
          />
          <button type="submit">{isEditing ? 'Update' : 'Add'} Resident</button>
        </form>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Logout
      </button>

      {/* Search Bar */}
      <h2>Resident List</h2>
      <input
        type="text"
        placeholder="Search to Filter Field"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
      />

      {/* Student Table */}
      <table border="1" align="center" style={{ width: '80%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Name</th>
            <th>Suffix</th>
            <th>Sex</th>
            <th>Birthday</th>
            <th>Age</th>
            <th>Postal Code</th>
            <th>Citizenship</th>
            <th>Civil Status</th>
            <th>Occupation</th>
            <th>Address</th>
            {userRole === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.title}</td>
              <td>{student.name}</td>
              <td>{student.suffix}</td>
              <td>{student.sex}</td>
              <td>{student.birthday}</td>
              <td>{student.age}</td>
              <td>{student.postalCode}</td>
              <td>{student.citizenship}</td>
              <td>{student.civilStatus}</td>
              <td>{student.course}</td>
              <td>{student.address}</td>
              {userRole === 'admin' && (
                <td>
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}

export default App;
