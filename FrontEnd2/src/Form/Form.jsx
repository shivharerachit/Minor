import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CarPriceForm = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage , setMileage] = useState('');
  const [engineCapacity , setEngineCapaciyt] = useState('');
  const [km, setKm] = useState(0);
  const [seat ,setSeat] = useState(5);
  const [fuel, setFuel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [owner, setOwner] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const modelOptions = {
    'Maruti': ['Alto', 'Wagon R', 'Swift', 'Baleno', 'Swift Dzire', 'Celerio', 'Eeco', 'S-Presso', 'Dzire LXI', 'Dzire ZXI', 'Dzire VXI', 'Glanza', 'Ertiga', 'Ciaz', 'S-Cross', 'Vitara Brezza', 'XL6', 'Ignis', 'S-Presso'],
    'Hyundai': ['i20', 'i10', 'Verna', 'Creta', 'Venue', 'Santro', 'Aura', 'Elantra', 'Tucson', 'Grand i10', 'Xcent', 'Alcazar'],
    'Ford': ['Ecosport', 'Endeavour', 'Aspire', 'Figo', 'Freestyle'],
    'Renault': ['Duster', 'KWID', 'Triber', 'Kiger', 'Captur'],
    'Mini': ['Cooper', 'Countryman', 'Clubman'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLS', 'CLS', 'A-Class', 'GLC', 'GLE', 'Maybach'],
    'Toyota': ['Innova', 'Fortuner', 'Glanza', 'Urban Cruiser', 'Camry', 'Yaris', 'Vellfire'],
    'Volkswagen': ['Polo', 'Vento', 'Tiguan', 'Taigun', 'Virtus'],
    'Honda': ['City', 'Civic', 'Amaze', 'Jazz', 'WR-V', 'CR-V'],
    'Mahindra': ['XUV500', 'Thar', 'Scorpio', 'Bolero', 'Marazzo', 'XUV300', 'Alturas', 'KUV100'],
    'Datsun': ['GO', 'redi-GO'],
    'Tata': ['Nexon', 'Harrier', 'Safari', 'Altroz', 'Tiago', 'Tigor', 'Hexa'],
    'Kia': ['Seltos', 'Sonet', 'Carnival', 'EV6'],
    'BMW': ['X1', 'X3', 'X5', '5 Series', '7 Series', 'Z4', '3 Series'],
    'Audi': ['A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7'],
    'Land Rover': ['Range Rover', 'Discovery', 'Defender', 'Velar'],
    'Jaguar': ['XF', 'XE', 'F-PACE', 'XJ', 'E-PACE'],
    'MG': ['Hector', 'Gloster', 'Astor', 'ZS EV'],
    'Isuzu': ['D-Max', 'MU-X', 'V-Cross'],
    'Porsche': ['Cayenne', 'Panamera', 'Macan', '911', 'Taycan'],
    'Skoda': ['Rapid', 'Superb', 'Kushaq', 'Octavia'],
    'Volvo': ['XC40', 'XC60', 'XC90', 'S90'],
    'Lexus': ['ES', 'NX', 'RX', 'LX', 'LC'],
    'Jeep': ['Compass', 'Meridian', 'Wrangler', 'Grand Cherokee'],
    'Maserati': ['Ghibli', 'Quattroporte', 'Levante'],
    'Bentley': ['Continental', 'Flying Spur', 'Bentayga'],
    'Nissan': ['Kicks', 'Magnite', 'GT-R', 'X-Trail'],
    'ISUZU': ['D-Max', 'MU-X', 'V-Cross'],
    'Ferrari': ['Portofino', 'Roma', 'SF90', '296 GTB'],
    'Mercedes-AMG': ['GT', 'C 43', 'E 53', 'G 63'],
    'Rolls-Royce': ['Ghost', 'Phantom', 'Cullinan', 'Wraith'],
    'Force': ['Gurkha', 'Cruiser', 'Urbania']
  };

  const Slider = ({ label, min, max, value, onChange }) => (
    <div style={styles.sliderContainer}>
      <label style={styles.label}>
        {label}:
        <span style={styles.rangeValues}>
          <span style={styles.orangeText}>{min}</span>
          <span style={styles.orangeText}>{value}</span>
          <span style={styles.orangeText}>{max}</span>
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={styles.slider}
      />
    </div>
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
        Brand: brand,
        Model: model,
        "M-Year": parseInt(year, 10),
        "KM-Driven": parseInt(km, 10),
        Mileage: parseFloat(mileage),
        "Engine-Capacity": parseFloat(engineCapacity),
        Seats: parseInt(seat, 10),
        "Fuel-Type": fuel,
        Transmission: transmission,
    };

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/process_car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setLoading(false);
        const result = await response.json();
        console.log('API Response:', result);
        navigate('/result', { state: { result } });
      } else {
        console.error('API Error:', response.statusText);
        alert('Failed to fetch prediction. Please try again.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('An error occurred while connecting to the server.');
    }
  };


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   navigate("/result");
  //   console.log({ brand, model, year, mileage,engineCapacity , km , seat ,fuel, transmission, owner });

  // };

  useEffect(() => {
    setModel(''); // Reset model when brand changes
  }, [brand]);

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>Car Price Prediction</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Car Brand</label>
            <select
              name = "brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Select Brand</option>
              {Object.keys(modelOptions).map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Model</label>
            <select
              name = "model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={styles.select}
              required
              disabled={!brand}
            >
              <option value="">Select Model</option>
              {brand && modelOptions[brand]?.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Manufactured Year</label>
            <input
              name = "year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={styles.input}
              min="2000"
              max="2023"
              placeholder='Enter manufacturing Year'
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mileage</label>
            <input
              name = "mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              style={styles.input}
              placeholder='Enter the Mileage'
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Engine Capacity (in litres)</label>
            <input
              name = "engineCapacity"
              type="number"
              value={engineCapacity}
              onChange={(e) => setEngineCapaciyt(e.target.value)}
              style={styles.input}
              placeholder='Enter the Engine Capacity'
              required
            />
          </div>

          <Slider
            name="km"
            label="Kilometers Driven"
            min={0}
            max={200000}
            value={km}
            onChange={(e) => setKm(e.target.value)}
          />

          <Slider
            name="seat"
            label="Seats"
            min={2}
            max={9}
            value={seat}
            onChange={(e) => setSeat(e.target.value)}
          />


          <div style={styles.formGroup}>
            <label style={styles.label}>Fuel Type</label>
            <select
              name = "fuel"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              style={styles.select}
              required
            >

              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Select Transmission</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
          >
            {loading ? 'Loading...' : 'Predict Price'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0F1225',
  },
  formWrapper: {
    // backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  heading: {
    textAlign: 'center',
    // color: '#2c3e50',
    color:"#fff" ,
    marginBottom: '2rem',
    fontSize: '1.8rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    // color: '#2c3e50',
    color:"#fff",
    fontWeight: '500',
  },
  select: {
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #753c45',
    fontSize: '1rem',
    backgroundColor: '#272731',
    color:"#fff",
  },
  input: {
    padding: '0.8rem',
    borderRadius: '6px',
    backgroundColor:" #272731" ,
    color:"#fff",
    border: '1px solid #753c45',
    fontSize: '1rem',
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  slider: {
    width: '100%',
    height: '4px',
    backgroundColor: '#272731',
    borderRadius: '2px',
    outline: 'none',
  },
  rangeValues: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
  },
  orangeText: {
    color: '#ff6b35',
    fontWeight: '600',
  },
  button: {
    backgroundColor:'#272731' ,
    color: 'white',
    padding: '1rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '1rem',
    '&:hover': {
      backgroundColor: "rgb(68, 68, 100)",
    },
  },
};

export default CarPriceForm;