import React from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const CreatePoint = () => {
  return(
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Logo Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form>
        <h1>
          Cadastro do <br />ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>
              Dados
            </h2>
          </legend>

          <div className="field">
            <label htmlFor="name">
              Nome da entidade
            </label>

            <input
              id="name"
              type="text"
              name="name"
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
              />
            </div>

            <div className="field">
              <label htmlFor="name">
                Whatsapp
              </label>

              <input
                id="whatsapp"
                type="text"
                name="whatsapp"
              />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default CreatePoint;