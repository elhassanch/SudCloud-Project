import React from "react";
import Signup from "./authentication/Signup";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Profile from './authentication/Profile';
import Login from './authentication/Login';
import PrivateRoute from './authentication/PrivateRoute';
import PublicRoute from './authentication/PublicRoute';
import ForgotPassword from './authentication/ForgotPassword'
import UpdateProfile from './authentication/UpdateProfile'
import Dashboard from "./google-drive/Dashboard";
import Home from './Home'

function App() {
  return (
      <Router>
        <AuthProvider>
          <Switch>
            <PublicRoute path="/home" component={Home} />

            {/* Drive */}
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute exact path="/folder/:folderId" component={Dashboard} />


            {/* Profile */}
            <PrivateRoute path="/user" component={Profile} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />

            {/* Auth */}
            <PublicRoute path="/signup" component={Signup} />
            <PublicRoute path="/login" component={Login} />
            <PublicRoute path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
  );
}

export default App;
