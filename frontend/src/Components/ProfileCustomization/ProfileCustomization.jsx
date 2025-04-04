import { useState } from 'react';
import { motion } from 'framer-motion';
import './ProfileCustomization.css';
import InputForm from '../InputForm/InputForm';
import BounceLoader from "react-spinners/BounceLoader";
import ImageCropperModal from '../ImageCropper/ImageCropper.jsx';
import ImageCropperRect from '../ImageCropper/ImageCropperRectangle.jsx';

const ProfileCustomization = () => {
    const [customProgress, setCustomProgress] = useState(1);
    const [customizationIsLoading, setCustomizationIsLoading] = useState(false)
    return (
        <article className='profileCustomizationMainBox'>
            {customProgress === 1 && <FirstStep customProgress={customProgress} setCustomProgress={setCustomProgress} />}
            {customProgress === 2 && <SecondStep customProgress={customProgress} setCustomProgress={setCustomProgress} />}
            {customProgress === 3 && <ThirdStep customProgress={customProgress} setCustomProgress={setCustomProgress} setCustomizationIsLoading={setCustomizationIsLoading} customizationIsLoading={customizationIsLoading}/>}
            {customProgress === 4 && <ResultProfileCustomization customProgress={customProgress} setCustomProgress={setCustomProgress} />}

            {customProgress < 4 && 
            <section className="customProgressContainer">
                <button className={`customProgressButton ${customProgress >= 1 && 'activeCustomProgressButton'}`}>1</button>
                <button className={`customProgressButton ${customProgress >= 2 && 'activeCustomProgressButton'}`}>2</button>
                <button className={`customProgressButton ${customProgress >= 3 && 'activeCustomProgressButton'}`}>3</button>
            </section>}

            {customizationIsLoading && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className=""
            >
                <CustomizationLoader />
            </motion.div>
        )}
        </article>
    );
};

const CustomizationLoader = () => {
    return(
        <section className="customizationLoader">
            <BounceLoader  size='100' color='#4A617F'/>
        </section>
    )
}
 
const FirstStep = ({ customProgress, setCustomProgress }) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    function toggleTag(tag) {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((n) => n !== tag) : [...prev, tag]
        );
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            setImageFile(URL.createObjectURL(file));
            setIsModalOpen(true);
            event.target.value = "";
        }
    }

    return (
        <motion.article
            className="profileCustomizationMainBox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <section className="inputsPersonalInfoContainer">
                <p className='titlePersonalInfo'>Personalizar Perfil</p>
                <InputForm Width='30vw' title="Escribe tu nombre" type="text" />
                <InputForm Width='8.5vw' title="Cumpleaños" type="date" />
                <InputForm Width='11vw' title="Género" type="select" options={['', 'Masculino', 'Femenino']} />
                <InputForm Width='8.5vw' title="Pronombres" type="select" options={['', 'Él/He', 'Ella/She', 'Elle/They']} />
                <InputForm Width='30vw' title="Lugar donde buscas compañero" type="text" />
                <InputForm Height='29vh' Width='30vw' title="Añade una descripción" type="area" />
            </section>

            <section className="firstStepTagsMainContainer">
                <div className="firstStepPhotoProfileContainer">
                    <img 
                        src={croppedImage || "/Graphics/Icons/camera-icon.png"} 
                        alt="Foto de perfil" 
                        draggable="false"
                        style={{ pointerEvents: 'none', cursor: 'pointer', width: '100%', height: '100%', borderRadius: '50%' }}
                        onClick={() => setIsModalOpen(true)}
                    />
                    <input 
                        type="file" 
                        className="inputFilePhotoProfile"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                        onChange={handleFileChange}
                    />
                </div>

                <p className='tagsTitle'>Elige etiquetas que te describan</p>
                <div className="firstStepTagsContainer">
                    {tags.map((tag, i) => (
                        <button
                            key={i}
                            onClick={() => toggleTag(tag)}
                            className={selectedTags.includes(tag) ? 'activeTag' : 'tagFirstStep'}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <button className="nextStep" onClick={() => { console.log(selectedTags); setCustomProgress(customProgress + 1); }}>
                    Siguiente
                </button>
            </section>


            {isModalOpen && (
                <ImageCropperModal 
                    imageSrc={imageFile}  
                    onClose={() => setIsModalOpen(false)}
                    onCropComplete={(croppedImg) => { 
                        setCroppedImage(croppedImg);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </motion.article>
    );
};
const SecondStep = ({ customProgress, setCustomProgress }) => {


    function chooseCard(){
        setCustomProgress(customProgress+1)
    }
    return (
        <motion.article
            className="profileCustomizationMainBox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <section className="choseBoxContainer">
                <p className='chooseBoxTitle'>¿Que estás buscando???</p>
                <ChoseBox title='Roomie' image='/Graphics/choose-roomie.png'/>
                <ChoseBox title='Habitación' image='/Graphics/choose-room.png'/>
                <ChoseBox title='Ambos' image='/Graphics/choose-both.png'/>
                <button className="goBack" onClick={()=>setCustomProgress(customProgress-1)}>Atrás</button>
            </section>
        </motion.article>
    );

    function ChoseBox({title, image}){
        return(
            <div className='chooseBox' onClick={()=>chooseCard()}>
                <p className='chooseBoxTitleCard'>{title}</p>
                <img 
                    src={image} 
                    alt="" 
                    style={{width: '100%', position: 'absolute', }}
                    />
            </div>
        )
    }
};
const ThirdStep = ({ customProgress, setCustomProgress, setCustomizationIsLoading, customizationIsLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null); 
    const [images, setImages] = useState([null, null, null, null]);

    function handleFileChange(event, index) {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setImageFile(fileURL);
            setSelectedIndex(index);
            setIsModalOpen(true);
        }
    }

    function handleCropComplete(croppedImg) {
        if (selectedIndex !== null && croppedImg) {
            setImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[selectedIndex] = croppedImg;
                return newImages;
            });
        }
        setIsModalOpen(false);
    }

    function finish(){
        setCustomizationIsLoading(!customizationIsLoading)
        setTimeout(()=>{
            setCustomizationIsLoading(false)
            setCustomProgress(customProgress+1)
        },5000)
    }

    return (
        <motion.article
            className="profileCustomizationMainBox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <section className="photosBoxContainer">
                <p className='photosBoxTitle'>Una imagen dice más que mil palabras, <br/> ¡muéstrate!</p>
                <p className='subTitlePhotosBox'>Las imágenes ayudan a conectar. Sube al menos una foto para terminar</p>
                
                {images.map((image, index) => (
                    <InputSelectPhoto 
                        key={index} 
                        index={index} 
                        image={image} 
                        onFileChange={handleFileChange} 
                    />
                ))}

                <button onClick={()=> setCustomProgress(customProgress-1)} className='backButtonThirdStep'>Atrás</button>
                <button onClick={finish}>Terminar</button>
            </section>

            {isModalOpen && imageFile && (
                <ImageCropperRect 
                    imageSrc={imageFile} 
                    onCropComplete={handleCropComplete} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </motion.article>
    );
};
function InputSelectPhoto({ index, image, onFileChange }) {
    return (
        <div className='inputSelectPhoto' onClick={() => document.getElementById(`file-input-${index}`).click()}>
            <img 
                src={image || "/Graphics/Icons/plus.png"} 
                alt="Foto de perfil" 
                draggable="false"
                style={{cursor: 'pointer', width: '100%', borderRadius: '10px', objectFit: 'cover' }}
            />
            <input 
                type="file" 
                id={`file-input-${index}`}
                className="inputFilePhotoProfile"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                onChange={(e) => onFileChange(e, index)}
                style={{ display: "none" }}
            />
        </div>
    );
}

const ResultProfileCustomization = ({ customProgress, setCustomProgress }) =>{
    return(
        <motion.article
        className="resultProfileCustomization"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
    >
        <p className='finishTitle'>¡Cuenta creada con exito!</p>
        <button className='finishButton'>Continuar</button>
    </motion.article>
    )
}
export default ProfileCustomization;

let tags = [
    "Lectura", "Deportes", "Tecnología", "Cine", "Música", "Viajes", "Arte", "Fotografía", 
    "Videojuegos", "Naturaleza", "Desarrollador", "DiseñadorGráfico", "Ingeniero", "MarketingDigital", 
    "Escritor", "Cocinero", "Creativo", "Emprendedor", "Educador", "Consultor", "Optimista", 
    "Aventurero", "Curioso", "Introvertido", "Extravertido", "Empático", "Líder", "Soñador", 
    "Perseverante", "Amor", "Equidad", "Innovación", "Sostenibilidad", "Igualdad", "Familia", 
    "Responsabilidad", "TrabajoEnEquipo", "CrecimientoPersonal", "AprenderNuevo", "DesarrolloProfesional", 
    "Networking", "Inspiración", "Motivación", "Productividad", "Bilingüe", "Cultura", "Multicultural", 
    "Idiomas", "ArteCultural", "EstilosDeVida", "Meditación", "SaludMental", "Ejercicio", "Yoga", 
    "ComidaSaludable", "Bienestar", "Influencer", "Vlogs", "Streaming", "Tendencias", "Memes", 
    "CulturaPop", "Voluntariado", "Mentoría", "Colaboración", "RedesProfesionales", "Comunidad"
];
