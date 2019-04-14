import React from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Icon,
  Header,
  Message
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from "md5";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill all the columns" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (this.isPassWordValid(this.state)) {
      error = { message: "Passwords not Matched" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else return true;
  };

  isFormEmpty = ({ username, password, email, passwordConfirmation }) => {
    return (
      !username.length ||
      !password.length ||
      !passwordConfirmation.length ||
      !email.length
    );
  };

  isPassWordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) return true;
    else if (password !== passwordConfirmation) return true;
    else return false;
  };

  showErrorMessage = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  showInputErrorClass = (errors, input) => {
    return errors.some(error => error.message.toLowerCase().includes(input))
      ? "error"
      : "";
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(()=>{console.log("User Saved")})
              this.setState({  loading: false});
            })
            .catch(err => {
                console.log(err);
              this.setState({
                loading: false,
                errors: this.state.errors.concat(err)
              });
            });
        })
        .catch(err => {
            console.log(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    }
  };

   saveUser= createdUser =>{
       return this.state.usersRef.child(createdUser.user.uid).set({
           name:createdUser.user.displayName,
           avatar:createdUser.user.photoURL
       })
   }

  render() {
    const {
      username,
      password,
      email,
      passwordConfirmation,
      errors,
      loading
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="register">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" color="orange" textAlign="center">
            <Icon name="registered" color="orange" />
            Register For ProChat
          </Header>
          <Segment stacked>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="UserName"
                onChange={this.handleChange}
                type="text"
                className={this.showInputErrorClass(errors, "username")}
                value={username}
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                type="email"
                className={this.showInputErrorClass(errors, "email")}
                value={email}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password(Min 6 Characters)"
                onChange={this.handleChange}
                type="password"
                className={this.showInputErrorClass(errors, "password")}
                value={password}
              />
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                onChange={this.handleChange}
                className={this.showInputErrorClass(errors, "password")}
                type="password"
                value={passwordConfirmation}
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="orange"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Form>
            {errors.length > 0 && (
              <Message error>
                <h4>Error</h4>
                {this.showErrorMessage(errors)}
              </Message>
            )}
          </Segment>
          <Message color="teal">
            Already a User?{" "}
            <Link to="/login">
              <strong>Login</strong>
            </Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
export default Register;
