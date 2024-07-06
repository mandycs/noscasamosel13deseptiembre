import React, { useState, useEffect } from 'react';
import './Home.css';

const MultiStepForm = () => {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [showContent, setShowContent] = useState(false);
    const [formData, setFormData] = useState({
        surveyName: '',
        numberOfPeople: '',
        names: {},
        nights: '',
        sleepLocation: '',
        additionalEquipment: '',
        hasTent: '',
        hasMatress: '',
        additionalQuestion: '',
        selectedOption: '' // Nuevo campo para almacenar la opción seleccionada
    });
    const [errors, setErrors] = useState({});
    const [confirmScreen, setConfirmScreen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowContent(true);
        }, 1000);
    }, []);

    const validate = () => {
        let tempErrors = {};
        if (currentScreen === 2 && !formData.surveyName) {
            tempErrors.surveyName = 'Este campo es obligatorio';
        }
        if (currentScreen === 3 && !formData.numberOfPeople) {
            tempErrors.numberOfPeople = 'Este campo es obligatorio';
        }
        if (currentScreen === 4) {
            const names = Object.values(formData.names);
            if (names.length === 0 || names.some(name => !name)) {
                tempErrors.names = 'Todos los nombres son obligatorios';
            }
        }
        if (currentScreen === 7 && !formData.nights) {
            tempErrors.nights = 'Este campo es obligatorio';
        }
        if (currentScreen === 8 && formData.nights !== 'none' && !formData.sleepLocation) {
            tempErrors.sleepLocation = 'Este campo es obligatorio';
        }
        if (currentScreen === 10 && formData.sleepLocation === 'Tienda' && !formData.hasTent) {
            tempErrors.hasTent = 'Este campo es obligatorio';
        }
        if (currentScreen === 11 && formData.sleepLocation === 'Tienda' && !formData.hasMatress) {
            tempErrors.hasMatress = 'Este campo es obligatorio';
        }
        if (currentScreen === 12 && formData.sleepLocation === 'Tienda' &&
            (formData.selectedOption === 'option1' || formData.selectedOption === 'option2') && !formData.additionalQuestion) {
            tempErrors.additionalQuestion = 'Este campo es obligatorio';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };


    const handleNextScreen = () => {
        if (isTransitioning) return;
        if (validate()) {
            setIsTransitioning(true);
            setShowContent(false);
            setTimeout(() => {
                setCurrentScreen(prevScreen => {
                    if (prevScreen === 3 && formData.numberOfPeople === '1') {
                        setFormData(prevData => ({ ...prevData, numberOfPeople: '' })); // Resetear el valor para evitar preselección
                        setConfirmScreen(true);
                        return prevScreen; // Mantener la pantalla actual para mostrar confirmación
                    } else if (confirmScreen) {
                        setConfirmScreen(false);
                        return prevScreen + 1; // Avanzar después de la confirmación
                    } else {
                        if (prevScreen === 7 && formData.nights === 'none') {
                            return 9; // Ir a la pantalla de no quedarse a dormir
                        } else if (prevScreen === 8 && formData.sleepLocation === 'Tienda') {
                            return 10; // Ir a la primera pantalla específica de Tienda de campaña
                        } else if (prevScreen === 10) {
                            return 11; // Ir a la segunda pantalla específica de Tienda de campaña
                        } else if (prevScreen === 11 && formData.sleepLocation === 'Tienda') {
                            return 12; // Ir a la nueva pantalla específica de Tienda de campaña
                        }
                        return prevScreen + 1;
                    }
                });
                setShowContent(true);
                setIsTransitioning(false);
                console.log('formData after validation:', formData);

            }, 2000);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        console.log('formData after input change:', formData);
        console.log('Actual Screen:', currentScreen);
    };


    const handleOptionChange = (value) => {
        setFormData(prevData => ({
            ...prevData,
            numberOfPeople: value,
        }));
        console.log('formData after option change:', formData);
    };

    const handleNameChange = (index, value) => {
        setFormData(prevData => ({
            ...prevData,
            names: {
                ...prevData.names,
                [index]: value,
            }
        }));
        console.log('formData after name change:', formData);
        console.log('Confirm screen status', confirmScreen);
    };

    const handleNightsChange = (value) => {
        setFormData(prevData => ({
            ...prevData,
            nights: value,
        }));
        console.log('formData after nights change:', formData);
    };

    const handleSleepLocationChange = (value) => {
        setFormData(prevData => ({
            ...prevData,
            sleepLocation: value,
        }));
        console.log('formData after sleepLocation change:', formData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);
    };

    const handleConfirmOptionChange = (name, value) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        console.log('formData after confirm option change:', formData);
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
                        <button className="button" onClick={handleNextScreen} disabled={isTransitioning}>Comenzar</button>
                    </div>
                )}
                {currentScreen === 2 && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className="label-names">
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
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 3 && !confirmScreen && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className="people-label">
                                ¿Cuántas personas sois?:<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.numberOfPeople === '1' ? 'selected' : ''}`} onClick={() => handleOptionChange('1')}>1</button>
                                <button type="button" className={`option-button ${formData.numberOfPeople === '2' ? 'selected' : ''}`} onClick={() => handleOptionChange('2')}>2</button>
                                <button type="button" className={`option-button ${formData.numberOfPeople === '2 or more' ? 'selected' : ''}`} onClick={() => handleOptionChange('2 or more')}>2 ó más</button>
                            </div>
                            {errors.numberOfPeople && <span className="error">{errors.numberOfPeople}</span>}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {confirmScreen && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className="people-label">
                                ¿Vienes con tu pareja?<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.numberOfPeople === '2' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('yes')}>Sí</button>
                                <button type="button" className={`option-button ${formData.numberOfPeople === '1' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('no')}>No</button>
                            </div>
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 4 && !confirmScreen && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            {formData.numberOfPeople !== '1' ? (
                                <>
                                    <label className="label-names">
                                        Nombres de las personas que vienen (separados por comas):<span className="required">*</span><br />
                                    </label>
                                    <input
                                        type="text"
                                        name="names"
                                        placeholder="Escriba su respuesta"
                                        value={Object.values(formData.names).join(', ')}
                                        onChange={(e) => {
                                            const namesArray = e.target.value.split(',').map(name => name.trim());
                                            const namesObj = namesArray.reduce((acc, name, index) => {
                                                acc[index] = name;
                                                return acc;
                                            }, {});
                                            setFormData(prevData => ({
                                                ...prevData,
                                                names: namesObj
                                            }));
                                        }}
                                        required
                                    />
                                </>
                            ) : (
                                <>
                                    <label className="label-names">
                                        Nombre de la persona que viene:<span className="required">*</span><br />
                                    </label>
                                    <input
                                        type="text"
                                        name="name1"
                                        placeholder="Escriba su respuesta"
                                        value={formData.names[0] || ''}
                                        onChange={(e) => handleNameChange(0, e.target.value)}
                                        required
                                    />
                                </>
                            )}
                            {errors.names && <span className="error">{errors.names}</span>}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 5 && !confirmScreen && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <p className="Welcome">
                            ¿Prepados para acampar<br />
                            el viernes <br />
                            con Glamour y camping?<br />
                        </p>
                        <button className="button" onClick={handleNextScreen} disabled={isTransitioning}>¡Vamos a ver!</button>
                    </div>
                )}
                {currentScreen === 6 && !confirmScreen && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <p className="Welcome">
                            La ceremonia será <br />
                            el Viernes por la tarde<br />
                            con opción a quedarse a dormir<br />
                            en tiendas de campaña<br />
                            durante la noche del viernes<br />
                            y también la noche del sábado.<br />
                            <br />
                            Tendremos una zona de Glamping<br />
                            (glamour y camping)<br />
                            y contamos con tres baños portátiles<br />
                            y con dos puntos de duchas al aire libre.<br />
                            <br />
                            Teniendo en cuenta esto...
                        </p>
                        <button className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                    </div>
                )}
                {currentScreen === 7 && !confirmScreen && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className='nights'>
                                ¿Cuántos días te quedarás a dormir?<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.nights === 'none' ? 'selected' : ''}`} onClick={() => handleNightsChange('none')}>Ninguno</button>
                                <button type="button" className={`option-button ${formData.nights === 'friday' ? 'selected' : ''}`} onClick={() => handleNightsChange('friday')}>Solo el viernes noche</button>
                                <button type="button" className={`option-button ${formData.nights === 'both' ? 'selected' : ''}`} onClick={() => handleNightsChange('both')}>Viernes noche y Sábado noche</button>
                            </div>
                            {errors.nights && <span className="error">{errors.nights}</span>}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 8 && !confirmScreen && formData.nights !== 'none' && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className='sleep-location'>
                                ¡Perfecto! Recuérdanos donde vas a dormir:<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.sleepLocation === 'Tienda' ? 'selected' : ''}`} onClick={() => handleSleepLocationChange('Tienda')}>Tienda de campaña</button>
                                <p>
                                    Me quedo donde me hagáis huequito y me es indiferente. No soy “fussy" lo importante es ir, estar y disfrutar.
                                </p>
                                <button type="button" className={`option-button ${formData.sleepLocation === 'Casa del campo' ? 'selected' : ''}`} onClick={() => handleSleepLocationChange('Casa del campo')}>Casa del campo</button>
                                <p>
                                    Es mía o me han invitado a quedarme en una de las habitaciones porque soy M-VIP (Madrina-Very Intimo Parentesco)
                                </p>
                                <button type="button" className={`option-button ${formData.sleepLocation === 'Camper' ? 'selected' : ''}`} onClick={() => handleSleepLocationChange('Camper')}>Llevo mi camper/furgoneta</button>
                                <p>
                                    No me hace falta tienda de campaña ¡gracias! aunque agradecería un sitio cerca para mi campervan.
                                </p>
                            </div>
                            {errors.sleepLocation && <span className="error">{errors.sleepLocation}</span>}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 9 && !confirmScreen && formData.nights === 'none' && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <p className="Welcome">
                            Entendemos que no te quedarás a dormir,<br />
                            ¡pero nos alegra que vayas a acompañarnos en nuestro día especial!<br />
                        </p>
                        <button className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                    </div>
                )}
                {currentScreen === 10 && !confirmScreen && formData.sleepLocation === 'Tienda' && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className="people-label">
                                ¿Tienes tienda propia?<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.hasTent === 'yes' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('hasTent', 'yes')}>Sí</button>
                                <button type="button" className={`option-button ${formData.hasTent === 'no' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('hasTent', 'no')}>No</button>
                            </div>
                            {errors.hasTent && <span className="error">{errors.hasTent}</span>}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 11 && !confirmScreen && formData.sleepLocation === 'Tienda' && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className="people-label">
                                ¿Tienes esterillas o colchón inflable que quieras llevarte para dormir?<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.hasMatress === 'yes' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('hasMatress', 'yes')}>Sí</button>
                                <button type="button" className={`option-button ${formData.hasMatress === 'no' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('hasMatress', 'no')}>No</button>
                            </div>
                            {errors.hasMatress && <span className="error">{errors.hasMatress}</span>}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 12 && !confirmScreen && formData.sleepLocation === 'Tienda' && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className='label-names'>
                                En caso de que fuese estrictamente necesario compartir una tienda de campaña de varias habitaciones...<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.selectedOption === 'option1' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'selectedOption', value: 'option1' } })}>Si hay varias habitaciones entonces compartiría con  ____</button>
                                <button type="button" className={`option-button ${formData.selectedOption === 'option2' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'selectedOption', value: 'option2' } })}>¡Y sin varias habitaciones! No me importa nada dormir junto a ____</button>
                                <button type="button" className={`option-button ${formData.selectedOption === 'option3' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'selectedOption', value: 'option3' } })}>No compartiría, sorry pero no.</button>
                                <button type="button" className={`option-button ${formData.selectedOption === 'option4' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'selectedOption', value: 'option4' } })}>Hummm no se ya lo vamos viendo jaja</button>
                            </div>
                            {(formData.selectedOption === 'option1' || formData.selectedOption === 'option2') && (
                                <div>
                                    <input
                                        type="text"
                                        name="additionalQuestion"
                                        placeholder="Escriba su respuesta"
                                        value={formData.additionalQuestion || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

export default MultiStepForm;
