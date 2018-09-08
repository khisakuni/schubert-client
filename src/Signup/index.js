import React, { PureComponent } from 'react';

import Input from '../shared/Input';
import Button from '../shared/Button';

class Signup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    this.update = this.update.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  update(name) {
    return e => {
      this.setState({ [name]: e.target.value });
    };
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('submitting >>>>', e);
  }

  render() {
    const { username, email, password, confirmPassword } = this.state;

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <Input
            name="Username"
            value={username}
            onChange={this.update('username')}
          />
          <Input
            name="Email"
            type="email"
            value={email}
            onChange={this.update('email')}
          />
          <Input
            name="Password"
            type="password"
            value={password}
            onChange={this.update('password')}
          />
          <Input
            name="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={this.update('confirmPassword')}
          />
          <Button value="Submit" submit />
        </form>
      </div>
    );
  }
}

Signup.path = '/signup';

export default Signup;
