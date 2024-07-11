import React, { useState, useEffect } from 'react';
import './Home.css';

const MultiStepForm = () => {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [showContent, setShowContent] = useState(false);
    const [formData, setFormData] = useState({
        surveyName: '',
        numeroDePersonas: '',
        names: {},
        noches: '',
        sleepLocation: '',
        additionalEquipment: '',
        tieneTienda: '',
        tieneColchon: '',
        dormirPersona: '',
        selectedOption: '',
        coche: '',
        plazasLibres: '',
        cantidadPlazas: '',
        namesCochePasajeros: {},
        transporte: '',
        transportePersona: '',
        alergico: '',
        alergias: ''
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
        if (currentScreen === 3 && !formData.numeroDePersonas) {
            tempErrors.numeroDePersonas = 'Este campo es obligatorio';
        }
        if (currentScreen === 4) {
            const names = Object.values(formData.names);
            if (names.length === 0 || names.some(name => !name)) {
                tempErrors.names = 'Todos los nombres son obligatorios';
            }
        }
        if (currentScreen === 7 && !formData.noches) {
            tempErrors.noches = 'Este campo es obligatorio';
        }
        if (currentScreen === 8 && formData.noches !== 'none' && !formData.sleepLocation) {
            tempErrors.sleepLocation = 'Este campo es obligatorio';
        }
        if (currentScreen === 10 && formData.sleepLocation === 'Tienda' && !formData.tieneTienda) {
            tempErrors.tieneTienda = 'Este campo es obligatorio';
        }
        if (currentScreen === 11 && formData.sleepLocation === 'Tienda' && !formData.tieneColchon) {
            tempErrors.tieneColchon = 'Este campo es obligatorio';
        }
        if (currentScreen === 11 && formData.sleepLocation === 'Tienda' && formData.tieneColchon === 'yes' && !formData.additionalEquipment) {
            tempErrors.additionalEquipment = 'Este campo es obligatorio';
        }
        if (currentScreen === 12 && formData.sleepLocation === 'Tienda' &&
            (formData.selectedOption === 'habitaciones' || formData.selectedOption === 'noHabitaciones') && !formData.dormirPersona) {
            tempErrors.dormirPersona = 'Este campo es obligatorio';
        }
        if (currentScreen === 14 && !formData.coche) {
            tempErrors.coche = 'Este campo es obligatorio';
        }
        if (currentScreen === 15 && formData.coche === 'yes' && formData.plazasLibres === 'plazas' && !formData.cantidadPlazas) {
            tempErrors.cantidadPlazas = 'Este campo es obligatorio';
        }
        if (currentScreen === 15 && formData.coche === 'yes' && formData.plazasLibres === 'lleno') {
            const namesCochePasajeros = Object.values(formData.namesCochePasajeros);
            if (namesCochePasajeros.length === 0 || namesCochePasajeros.some(name => !name)) {
                tempErrors.namesCochePasajeros = 'Todos los nombres son obligatorios';
            }
        }
        if (currentScreen === 15 && formData.coche === 'no' && formData.transporte === 'compartirCocheConocido' && !formData.transportePersona) {
            tempErrors.transportePersona = 'Este campo es obligatorio';
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
                    if (prevScreen === 3 && formData.numeroDePersonas === '1') {
                        setFormData(prevData => ({ ...prevData, numeroDePersonas: '' })); // Resetear el valor para evitar preselección
                        setConfirmScreen(true);
                        return prevScreen; // Mantener la pantalla actual para mostrar confirmación
                    } else if (confirmScreen) {
                        setConfirmScreen(false);
                        return prevScreen + 1; // Avanzar después de la confirmación
                    } else {
                        if (prevScreen === 7 && formData.noches === 'none') {
                            return 9; // Ir a la pantalla de no quedarse a dormir
                        } else if (prevScreen === 8 && formData.sleepLocation === 'Tienda') {
                            return 10; // Ir a la primera pantalla específica de Tienda de campaña
                        } else if (prevScreen === 9) {
                            return 13; // Ir a la pantalla de coche
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
            numeroDePersonas: value,
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
    const handlenochesChange = (value) => {
        setFormData(prevData => ({
            ...prevData,
            noches: value,
        }));
        console.log('formData after noches change:', formData);
    };

    const handleSleepLocationChange = (value) => {
        setFormData(prevData => ({
            ...prevData,
            sleepLocation: value,
        }));
        console.log('formData after sleepLocation change:', formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);
    
        try {
            const response = await fetch('http://mandycs.pythonanywhere.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                console.log('Formulario enviado exitosamente');
                // Puedes agregar cualquier lógica adicional aquí, como redireccionar o mostrar un mensaje de éxito
            } else {
                console.error('Error al enviar el formulario');
                // Lógica para manejar el error
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            // Lógica para manejar el error
        }
    };
    const handleLastScreen = (e) => {
        handleSubmit(e);
        handleNextScreen();
    }

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
                                <small>Ejemplo: Familia Granadete, Antoñita & Antonio, Antoñita & Cía o simplemente Antoñita.</small><br />
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
                                <button type="button" className={`option-button ${formData.numeroDePersonas === '1' ? 'selected' : ''}`} onClick={() => handleOptionChange('1')}>1</button>
                                <button type="button" className={`option-button ${formData.numeroDePersonas === '2' ? 'selected' : ''}`} onClick={() => handleOptionChange('2')}>2</button>
                                <button type="button" className={`option-button ${formData.numeroDePersonas === '2 or more' ? 'selected' : ''}`} onClick={() => handleOptionChange('2 or more')}>2 ó más</button>
                            </div>
                            {errors.numeroDePersonas && <span className="error">{errors.numeroDePersonas}</span>}
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
                                <button type="button" className={`option-button ${formData.numeroDePersonas === '2' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('numeroDePersonas', '2')}>Sí</button>
                                <button type="button" className={`option-button ${formData.numeroDePersonas === '1' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('numeroDePersonas', '1')}>No</button>
                            </div>
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 4 && !confirmScreen && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            {formData.numeroDePersonas !== '1' ? (
                                <>
                                    <label className="label-names">
                                        Nombres de las personas que vienen (separados por comas):<span className="required">*</span><br />
                                    </label>
                                    <input
                                        type="text"
                                        name="names"
                                        placeholder="Sus nombres son..."
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
                                        placeholder="Su nombre es..."
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
                            <label className='noches'>
                                ¿Cuántos días te quedarás a dormir?<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.noches === 'none' ? 'selected' : ''}`} onClick={() => handlenochesChange('none')}>Ninguno</button>
                                <button type="button" className={`option-button ${formData.noches === 'friday' ? 'selected' : ''}`} onClick={() => handlenochesChange('friday')}>Solo el viernes noche</button>
                                <button type="button" className={`option-button ${formData.noches === 'both' ? 'selected' : ''}`} onClick={() => handlenochesChange('both')}>Viernes noche y Sábado noche</button>
                            </div>
                            {errors.noches && <span className="error">{errors.noches}</span>}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 8 && !confirmScreen && formData.noches !== 'none' && (
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
                {currentScreen === 9 && !confirmScreen && formData.noches === 'none' && (
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
                        <p className="Welcome">¡Vale, genial! <br />
                            En ese caso contaremos contigo / con vosotros para la zona de Glamping.<br />
                            Cuando lleguéis las tiendas estarán montadas y cuquis, sin embargo, <br />
                            nos haría falta haceros unas preguntas y que nos contéis un poquito:
                        </p>
                        <form onSubmit={handleSubmit}>
                            <label className="people-label">
                                ¿Tienes tienda propia?<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.tieneTienda === 'yes' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('tieneTienda', 'yes')}>Sí</button>
                                <button type="button" className={`option-button ${formData.tieneTienda === 'no' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('tieneTienda', 'no')}>No</button>
                            </div>
                            {(formData.tieneTienda === 'yes') && (
                                <div>
                                    <p className='Welcome'>
                                        Perfe, te dejamos el recuadro para que nos digas las medidas y <br />
                                        el modelo además de cuando podrías dárnosla <br />
                                        por adelantado para dejarlo todo montado.
                                    </p>
                                </div>
                            )}
                            {(formData.tieneTienda === 'no') && (
                                <div>
                                    <p className='Welcome'>
                                        Ok! Sin problema, hay de sobra. Te asignaremos una para ti ^^
                                    </p>
                                </div>
                            )}
                            {errors.tieneTienda && <span className="error">{errors.tieneTienda}</span>}
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
                                <button type="button" className={`option-button ${formData.tieneColchon === 'yes' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('tieneColchon', 'yes')}>Sí</button>
                                <button type="button" className={`option-button ${formData.tieneColchon === 'no' ? 'selected' : ''}`} onClick={() => handleConfirmOptionChange('tieneColchon', 'no')}>No</button>
                            </div>
                            {(formData.tieneColchon === 'yes') && (
                                <div>
                                    <label className="label-names">
                                        ¿Qué tienes exactamente?<span className="required">*</span><br />
                                    </label>
                                    <input
                                        type="text"
                                        name="additionalEquipment"
                                        placeholder="Tengo un colchón, esterilla o similar..."
                                        value={formData.additionalEquipment || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <p className='Welcome'>
                                        Vale, déjanoslo por adelantado y estará allí esperándote para dormir. <br />
                                        Si tienes alguna otra cosa que necesites, como saco, sábanas, almohadas<br />
                                        o algún otro accesorio déjanoslo también todo junto.<br />
                                        Cualquier momento es bueno para traérnoslo a casa, aunque lo mejor sería a partir de Agosto.
                                    </p>
                                </div>
                            )}
                            {(formData.tieneColchon === 'no') && (
                                <div>
                                    <p className='Welcome'>
                                        ¡Recibido, no hay problema! Hemos preparado algunos colchones de goma espuma. <br />
                                        Recuerda preparar tus sábanas, almohada y saco/mantita si es que lo necesitas. <br />
                                        Tendrás que déjanoslo por adelantado y estará allí esperándote para dormir.<br />
                                        Si tienes alguna otra cosa que necesites, déjanoslo también todo junto. <br />
                                        Cualquier momento es bueno para traérnoslo a casa, aunque lo mejor sería a partir de Agosto.
                                    </p>
                                </div>
                            )}
                            {errors.tieneColchon && <span className="error">{errors.tieneColchon}</span>}
                            {errors.additionalEquipment && <span className="error">{errors.additionalEquipment}</span>}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 12 && !confirmScreen && formData.sleepLocation === 'Tienda' && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className='label-names'>
                                En caso de que fuese estrictamente necesario compartir una tienda de campaña de varias habitaciones...<span className="required">*</span><br />
                                <small>Tranqui esto lo hemos diseñado nosotras, nadie más verá las respuestas jajaja 🤭</small><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.selectedOption === 'habitaciones' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'selectedOption', value: 'habitaciones' } })}>Si hay varias habitaciones entonces compartiría con  ____</button>
                                <button type="button" className={`option-button ${formData.selectedOption === 'noHabitaciones' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'selectedOption', value: 'noHabitaciones' } })}>¡Y sin varias habitaciones! No me importa nada dormir junto a ____</button>
                                <button type="button" className={`option-button ${formData.selectedOption === 'nadie' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'selectedOption', value: 'nadie' } })}>No compartiría, sorry pero no.</button>
                                <button type="button" className={`option-button ${formData.selectedOption === 'vamosViendo' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'selectedOption', value: 'vamosViendo' } })}>Hummm no se ya lo vamos viendo jaja</button>
                            </div>
                            {(formData.selectedOption === 'habitaciones' || formData.selectedOption === 'noHabitaciones') && (
                                <div>
                                    <label className="label-names">
                                        ¿Con quién compartirías / dormirías?<span className="required">*</span><br />
                                    </label>
                                    <input
                                        type="text"
                                        name="dormirPersona"
                                        placeholder="Dormiría con ... / Compartiría con ..."
                                        value={formData.dormirPersona || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 13 && !confirmScreen && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <p className="Welcome">
                            Respecto a los vehículos, hay poco sitio para aparcar <br />
                            coches por lo que la organización<br />
                            de la llegada de invitados es crucial para nosotras. <br />
                            Para la vuelta siempre hay más opciones.<br />
                            Necesitamos conocer cuantos coches vendrán y organizarlos. <br />
                            Además, también se han pensado ubicaciones cercanas<br />
                            donde aparcar y que alguien os recoja. <br />
                            Si tienes cualquier duda o caso especial <br />
                            llámanos y lo vemos juntas. <br />
                            Por favor tened en cuenta los diez <br />
                            kilómetros de curvas del camino, <br />
                            que no caben muchos coches aparcados <br />
                            y que todos al final vamos a beber.<br />
                            No queremos que nadie conduzca y beba en nuestra boda.
                        </p>
                        <button className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                    </div>
                )}
                {currentScreen === 14 && !confirmScreen && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className='coche'>
                                Cuéntanos ¿Cuál es tu caso?<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.coche === 'Llevo coche' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'coche', value: 'Llevo coche' } })}>Llevo el coche</button>
                                <button type="button" className={`option-button ${formData.coche === 'No llevo coche o no tengo' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'coche', value: 'No llevo coche o no tengo' } })}>No tengo o no voy a llevar mi coche. </button>
                            </div>
                            {errors.coche && <span className="error">{errors.coche}</span>}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 15 && !confirmScreen && formData.coche === 'Llevo coche' && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className='coche'>
                                ¿Vendrá el coche lleno o tienes plazas libres?<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.plazasLibres === 'lleno' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'plazasLibres', value: 'lleno' } })}>Llevo el coche completo</button>
                                <button type="button" className={`option-button ${formData.plazasLibres === 'plazas' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'plazasLibres', value: 'plazas' } })}>Tenemos alguna plaza libre </button>
                            </div>
                            {formData.plazasLibres === 'plazas' && (
                                <div>
                                    <label className="label-names">
                                        ¿Cuántas plazas libres tienes?<span className="required">*</span><br />
                                    </label>
                                    <input
                                        type="text"
                                        name="cantidadPlazas"
                                        placeholder="Me quedan 2 plazas libres"
                                        value={formData.cantidadPlazas}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.cantidadPlazas && <span className="error">{errors.cantidadPlazas}</span>}
                                </div>
                            )}
                            {formData.plazasLibres === 'lleno' && (
                                <div>
                                    <label className="label-names">
                                        ¿Quién viene contigo?<span className="required">*</span><br />
                                        <small>Por favor, escribe los nombres separados por comas.</small><br />
                                    </label>
                                    <input
                                        type="text"
                                        name="namesCochePasajeros"
                                        placeholder="Nombres de las personas"
                                        value={Object.values(formData.namesCochePasajeros).join(', ')}
                                        onChange={(e) => {
                                            const namesArray = e.target.value.split(',').map(name => name.trim());
                                            const namesObj = namesArray.reduce((acc, name, index) => {
                                                acc[index] = name;
                                                return acc;
                                            }, {});
                                            setFormData(prevData => ({
                                                ...prevData,
                                                namesCochePasajeros: namesObj
                                            }));
                                        }}
                                        required
                                    />
                                    {errors.namesCochePasajeros && <span className="error">{errors.namesCochePasajeros}</span>}
                                </div>
                            )}
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 15 && !confirmScreen && formData.coche === 'No llevo coche o no tengo' && (
                    <div className={`screen ${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className='coche'>
                                Cuéntanos ¿Cuál es tu caso?<span className="required">*</span><br />
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.transporte === 'compartirCocheConocido' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'transporte', value: 'compartirCocheConocido' } })}>Voy en el coche de: No worries por mí</button>
                                {formData.transporte === 'compartirCocheConocido' && (
                                    <div>
                                        <label className="label-names">
                                            ¿Con quién vas?<span className="required">*</span><br />
                                        </label>
                                        <input
                                            type="text"
                                            name="transportePersona"
                                            placeholder="Voy con ..."
                                            value={formData.transportePersona || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors.transportePersona && <span className="error">{errors.transportePersona}</span>}
                                    </div>
                                )}
                                <button type="button" className={`option-button ${formData.transporte === 'compartirCocheDesonocido' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'transporte', value: 'compartirCocheDesonocido' } })}>Podría compartir pero no sé aún</button>
                                <button type="button" className={`option-button ${formData.transporte === 'Uber' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'transporte', value: 'Uber' } })}>Prefiero ir en Uber (20-35 euros) por mi cuenta y me despreocupo.</button>
                            </div>
                            <button type="button" className="button" onClick={handleNextScreen} disabled={isTransitioning}>Siguiente</button>
                        </form>
                    </div>
                )}
                {currentScreen === 16 && !confirmScreen &&(
                    <div className={`screen${showContent ? 'show' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <label className='alergias'>
                                ¿Eres alergico/intolerante a algo?<span className="required">*</span> <br/>
                            </label>
                            <div className="options">
                                <button type="button" className={`option-button ${formData.alergico === 'yes' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'alergico', value: 'yes' } })}>Sí</button>
                                <button type="button" className={`option-button ${formData.alergico === 'no' ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'alergico', value: 'no' } })}>No</button>
                            </div>
                            {formData.alergico === 'yes' && (
                                    <div>
                                        <input
                                            type="text"
                                            name="alergias"
                                            placeholder="Tengo intolerancia/alergia a..."
                                            value={formData.alergias || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                )}
                        </form>
                        <button type="button" className="button" onClick={handleLastScreen} disabled={isTransitioning}>Enviar</button>
                    </div>
                )}
                {currentScreen === 17 && !confirmScreen && (
                    <div className={`screen${showContent ? 'show' : ''}`}>
                        <p className='Welcome'>
                            Muchas gracias por haber contestado con paciencia a todas nuestras preguntas <br/>
                            Te esperamos el día 13 de septiembre!!! <br/>
                            Cualquier duda siempre podrás escribirnos
                        </p>
                    </div>
                )}
            </div>
        </div>
    );// CurrentScreen 14 y 15, una con formData.coche === 'yes' y otra con formData.coche === 'no'
    //En yes, tiene que estar si el coche viene lleno o si tiene x plazas libres
    //En no, tiene que haber un voy con ___ input, y un no se con quien ir pero puedo compartir gastos, y un voy en uber.
    //Pantalla de comida, si hay alergias, intolerancias, vegetarianos, veganos, etc.   
}

export default MultiStepForm;
