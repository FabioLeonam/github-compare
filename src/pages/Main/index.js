import React, { Component } from 'react';
import moment from 'moment';
import { Container, Form } from './styles';
import logo from '../../assets/logo.png';
import CompareList from '../../components/CompareList';
import api from '../../services/api';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: '',
    repositories: [],
  };

  handleAddRepository = async (evt) => {
    evt.preventDefault();

    const { repositoryInput, repositories } = this.state;
    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(`/repos/${repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();
      this.setState({
        repositoryError: false,
        repositoryInput: '',
        repositories: [...repositories, repository],
      });
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      repositoryError, repositories, repositoryInput, loading,
    } = this.state;
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={repositoryInput}
            onChange={evt => this.setState({ repositoryInput: evt.target.value })}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>
        <CompareList repositories={repositories} />
      </Container>
    );
  }
}
