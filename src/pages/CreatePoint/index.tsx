import React, { useEffect, useState } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';

interface Item {
  id: number,
  title: string,
  image: string,
};

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    api.get('items')
      .then(response => setItems(response.data))
      .catch(e => console.log('Erro', e));
  }, []);

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

        <fieldset>
          <legend>
            <h2>
              Endereço
            </h2>

            <span>
              Selecione o endereço no mapa
            </span>
          </legend>

          <Map
            center={[-22.8631668, -48.4287712]}
            zoom={15}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-22.8631668, -48.4287712]}>
              <Popup>
                Boulevard Shopping Botucatu
              </Popup>
            </Marker>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">
                Estado (UF)
              </label>

              <select
                name="uf"
                id="name"
              >
                <option value="0">
                  Selecione um estado
                </option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="uf">
                Cidade
              </label>

              <select
                name="city"
                id="city"
              >
                <option value="0">
                  Selecione uma cidade
                </option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>
              Itens de coleta
            </h2>

            <span>
              Selecione um ou mais itens abaixo
            </span>
          </legend>

          <ul className="items-grid">
            {
              items.map(item => (
                <li key={item.id}>
                  <img src={item.image} />
                  <span>
                    {item.title}
                  </span>
                </li>
              ))
            }
          </ul>
        </fieldset>

        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
}

export default CreatePoint;