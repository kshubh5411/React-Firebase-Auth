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

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false
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
    if (this.isFormValid(this.state)) {
        this.setState({ errors: [], loading: true });
        firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email,this.state.password)
        .then((signedInUser)=>{
            console.log(signedInUser);
        })
        .catch((err)=>{
            console.log(err);
            this.setState({errors:this.state.errors.concat(err),loading:false})
        })
    }
  };

  isFormValid = ({ email, password }) => email && password;

  render() {
    const { password, email, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="register">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" color="blue" textAlign="center">
            <Icon name="sign in" color="blue" />
            Login For ProChat
          </Header>
          <Segment stacked>
            <Form size="large" onSubmit={this.handleSubmit}>
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
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                className={this.showInputErrorClass(errors, "password")}
                value={password}
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="blue"
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
          <Message color="blue">
            Don't Have An Account?{" "}
            <Link to="/Register">
              <strong>Register</strong>
            </Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
export default Login;
