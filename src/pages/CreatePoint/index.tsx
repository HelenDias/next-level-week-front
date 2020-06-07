import React from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiArrowDownLeft } from 'react-icons/fi';

const CreatePoint = () => {
  return(
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Logo Ecoleta" />

        <Link to="/">
          <FiArrowDownLeft />
          Voltar para home
        </Link>
      </header>
    </div>
  );
}

export default CreatePoint;