import React, { useState, useEffect } from 'react';
import './Home.css';

const MultiStepForm = () => {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [showContent, setShowContent] = useState(false);
    const [formData, setFormData] = useState({
        surveyName: '', // Campo para el nombre de la encuesta
        numberOfPeople: '' // Campo para la cantidad de personas
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setTimeout(() => {
            setShowContent(true);
        }, 1000); // 1 segundo de retardo antes de mostrar la primera pantalla
    }, []);

    const validate = () => {
        let tempErrors = {};
        if (currentScreen === 2 && !formData.surveyName) {
            tempErrors.surveyName = 'Este campo es obligatorio';
        }
        if (currentScreen === 3 && !formData.numberOfPeople) {
            tempErrors.numberOfPeople = 'Este campo es obligatorio';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleNextScreen = () => {
        if (validate()) {
            setShowContent(false);
            setTimeout(() => {
                setCurrentScreen((prevScreen) => prevScreen + 1);
                setShowContent(true);
            }, 2000); // 2 segundos para coincidir con la duración de la transición
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleOptionChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            numberOfPeople: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);
    };

    return (
        <div className="container">
            <div className="home-background"></div>
            <div className="content">
                {currentScreen === 1 && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <p className="Welcome">
                            Queridos amigos y familia,<br />
                            somos Yess y Maly<br />
                            y estamos organizando los<br />
                            últimos detalles de<br />
                            nuestra boda y…<br />
                            <br />
                            ¡Casi se nos olvidan<br />
                            los invitados!<br />
                            <br />
                            Se buscan invitados<br />
                            con o sin experiencia<br />
                            para boda campera<br />
                            cuqui-piji-moni.<br />
                            (rollo boho-chic en el campo,<br />
                            hippy pero pija con césped).<br />
                            <br />
                            Necesitamos conocer vuestras preferencias y necesidades<br />
                            y por ello hemos hecho<br />
                            una encuesta para que<br />
                            nada se nos escape<br />
                            en un día tan especial.<br />
                            <br />
                            ¡Ayúdanos a estar preparadas!
                        </p>
                        <button className="button" onClick={handleNextScreen}>Comenzar</button>
                    </div>
                )}
                {currentScreen === 2 && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Nombre de esta encuesta:<span className="required">*</span><br />
                                <small>Ejemplo: Familia Granadete, Encarnita & Antonio, Encarnita & Cía o simplemente Encarnita.</small><br />
                                <input
                                    type="text"
                                    name="surveyName"
                                    placeholder="Escriba su respuesta"
                                    value={formData.surveyName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.surveyName && <span className="error">{errors.surveyName}</span>}
                            </label>
                            <button type="button" className="button" onClick={handleNextScreen}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 3 && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label>
                                ¿Cuántas personas sois?:<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.numberOfPeople === '1' ? 'selected' : ''}`} onClick={() => handleOptionChange('1')}>1</button>
                                <button type="button" className={`option-button ${formData.numberOfPeople === '2' ? 'selected' : ''}`} onClick={() => handleOptionChange('2')}>2</button>
                                <button type="button" className={`option-button ${formData.numberOfPeople === '2 or more' ? 'selected' : ''}`} onClick={() => handleOptionChange('2 or more')}>2 ó más</button>
                            </div>
                            {errors.numberOfPeople && <span className="error">{errors.numberOfPeople}</span>}
                            <button type="button" className="button" onClick={handleNextScreen}>Siguiente</button>
                        </form>
                    </div>
                )}
                {/* Otras pantallas se pueden añadir aquí */}
            </div>
        </div>
    );
}

export default MultiStepForm;
