import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    return setSelectedUf(event.target.value);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    return setSelectedCity(event.target.value);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    return setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng,
    ]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      return setSelectedItems(filteredItems);
    }

    return setSelectedItems([ ...selectedItems, id ]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items,
    };

    try {
      await api.post('points', data);

      alert(`Ponto de coleta ${data.name} cadastrado com sucesso!`);
    } catch (e) {
      alert(`Erro ao cadastrar ponto de coleta! [${e}]`);
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

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

      <form onSubmit={handleSubmit}>
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
              onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition}>
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
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
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