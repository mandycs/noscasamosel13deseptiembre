// src/Questionnaire.js
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Questionnaire.css';

const Questionnaire = () => {
    const [formData, setFormData] = useState({
        stayingDays: '',
        willStay: '',
        additionalInfo: '',
    });

    const [showAdditionalQuestion, setShowAdditionalQuestion] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'willStay') {
            setShowAdditionalQuestion(value === 'yes');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_USER_ID')
            .then((result) => {
                console.log(result.text);
                alert('Formulario enviado con éxito!');
            }, (error) => {
                console.log(error.text);
                alert('Error al enviar el formulario');
            });

        // Resetea el formulario si es necesario
        setFormData({
            stayingDays: '',
            willStay: '',
            additionalInfo: '',
        });
        setShowAdditionalQuestion(false);
    };

    return (
        <form className="questionnaire" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>¿Cuántos días te quedarás?</label>
                <input
                    type="text"
                    name="stayingDays"
                    value={formData.stayingDays}
                    onChange={handleChange}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label>¿Te quedarás a dormir?</label>
                <select
                    name="willStay"
                    value={formData.willStay}
                    onChange={handleChange}
                    className="form-input"
                >
                    <option value="">Seleccione una opción</option>
                    <option value="yes">Sí</option>
                    <option value="no">No</option>
                </select>
            </div>
            {showAdditionalQuestion && (
                <div className="form-group">
                    <label>Información adicional para los que se quedan:</label>
                    <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        className="form-input"
                    ></textarea>
                </div>
            )}
            <button type="submit" className="form-button">Enviar</button>
        </form>
    );
};

export default Questionnaire;
