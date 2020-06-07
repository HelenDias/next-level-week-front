import React, { useEffect, useState, ChangeEvent } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';

interface Item {
  id: number,
  title: string,
  image: string,
};

interface IbgeUfResponse {
  sigla: string,
};

interface IbgeCityResponse {
  nome: string,
};

const CreatePoint = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    return setSelectedUf(event.target.value);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    return setSelectedCity(event.target.value);
  }

  useEffect(() => {
    api.get('items')
      .then(response => setItems(response.data))
      .catch(e => console.log('Erro', e));
  }, []);

  useEffect(() => {
    axios.get<IbgeUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => {
        const ufs = response.data.map(uf => uf.sigla)
        return setUfs(ufs);
      })
      .catch(e => console.log('Erro', e));
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    axios.get<IbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then((response) => {
        const cities = response.data.map(city => city.nome)
        return setCities(cities);
      })
      .catch(e => console.log('Erro', e));
  }, [selectedUf]);

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
                id="name"
                name="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value="0">
                  Selecione um estado
                </option>

                {
                  ufs.map(uf => (
                    <option
                      key={uf}
                      value={uf}
                    >
                      {uf}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">
                Cidade
              </label>

              <select
                id="city"
                name="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">
                  Selecione uma cidade
                </option>

                {
                  cities.map(city => (
                    <option
                      key={city}
                      value={city}
                    >
                      {city}
                    </option>
                  ))
                }
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
                  <img src={item.image} alt={item.title} />
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